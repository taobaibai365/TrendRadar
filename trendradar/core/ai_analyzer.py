# coding=utf-8
"""
AI 驱动的分析与聚合模块

取代原有的词频分析，使用大语言模型进行内容分析、分类和主题聚合。
支持并行分析以提高性能。
"""

import json
from typing import List, Dict
from collections import defaultdict
from concurrent.futures import ThreadPoolExecutor, as_completed
import threading
from datetime import datetime

from trendradar.storage.local import LocalStorageBackend
from trendradar.ai.processor import AIProcessor, AIAnalysisResult
from trendradar.core.deduplication import ContentDeduplicator

def run_ai_analysis(storage: LocalStorageBackend, ai_processor: AIProcessor, date: str):
    """
    执行 AI 分析和聚合流程

    1. 从数据库读取所有待分析的文章（全文内容）。
    2. 并行对每篇文章进行独立的 AI 分析（提取摘要、标签等）。
    3. 每篇文章独立生成一个主题（不再强制聚合）。
    4. 生成链接汇总卡片（针对全文抓取失败的文章）。
    5. 将所有分析结果存回数据库。

    Args:
        storage: 本地存储后端实例
        ai_processor: AI 处理器实例
        date: 要处理的日期 (YYYY-MM-DD)
    """
    print("[AI Analyzer] ========================================")
    print("[AI Analyzer] 开始执行 AI 分析流程...")

    # 尽早打印去重配置状态
    try:
        from trendradar.core.loader import load_config
        config = load_config()
        dedup_config = config.get("DEDUPLICATION", {})
        enabled = dedup_config.get("enabled", False)
        print(f"[AI Analyzer] 去重功能状态: {'✓ 已启用' if enabled else '✗ 未启用'}")
        if enabled:
            print(f"[AI Analyzer]   - 相似度阈值: {dedup_config.get('similarity_threshold', 0.8)}")
            print(f"[AI Analyzer]   - 过滤条件: deleted={dedup_config.get('filter_deleted', False)}, archived={dedup_config.get('filter_archived', False)}, exported={dedup_config.get('filter_exported', False)}")
            print(f"[AI Analyzer]   - 处理方式: {dedup_config.get('duplicate_action', 'keep')}")
    except Exception as e:
        print(f"[AI Analyzer] ⚠️ 读取去重配置失败: {e}")
    print("[AI Analyzer] ========================================")

    # 1. 读取待分析的文章
    articles_to_analyze = _get_articles_for_analysis(storage, date)
    if not articles_to_analyze:
        print("[AI Analyzer] 没有找到需要分析的新文章。")

    # 2. 生成链接汇总卡片（针对全文抓取失败的文章）
    _create_link_summary_card(storage, date)

    # 如果没有待分析的文章，直接返回
    if not articles_to_analyze:
        print("[AI Analyzer] 没有找到需要分析的新文章。")
        return

    print(f"[AI Analyzer] 找到 {len(articles_to_analyze)} 篇文章待分析。")

    # 2. 并行分析每篇文章
    individual_results: Dict[int, AIAnalysisResult] = {}
    completed_count = 0
    lock = threading.Lock()

    # 过滤掉内容过短的文章
    valid_articles = {aid: content for aid, content in articles_to_analyze.items() if content and len(content) >= 100}
    print(f"[AI Analyzer] 过滤后剩余 {len(valid_articles)} 篇有效文章。")

    # 如果没有有效文章，直接返回
    if not valid_articles:
        print("[AI Analyzer] 所有文章内容过短或为空，无需分析。")
        return

    # 使用线程池并行分析（默认 4 个并发）
    max_workers = min(4, len(valid_articles))  # 最多 4 个并发
    print(f"[AI Analyzer] 启动 {max_workers} 个并发分析任务...")

    with ThreadPoolExecutor(max_workers=max_workers) as executor:
        # 提交所有分析任务
        future_to_article = {
            executor.submit(analyze_single_article, ai_processor, article_id, content): article_id
            for article_id, content in valid_articles.items()
        }

        # 收集结果
        for future in as_completed(future_to_article):
            article_id = future_to_article[future]
            try:
                result = future.result()
                if result:
                    with lock:
                        individual_results[article_id] = result
                        completed_count += 1
                        print(f"[AI Analyzer] 进度: {completed_count}/{len(valid_articles)} 篇文章已分析 (ID: {article_id})")
            except Exception as e:
                print(f"[AI Analyzer] 文章 ID {article_id} 分析失败: {e}")

    if not individual_results:
        print("[AI Analyzer] 所有文章都未能成功进行初步分析。")
        return

    print(f"[AI Analyzer] {len(individual_results)} 篇文章初步分析完成。")

    # 3. 每篇文章独立生成一个主题（不再强制聚合）
    _save_analysis_results(storage, individual_results, date, ai_processor)

    print("[AI Analyzer] 分析流程已完成。")


def analyze_single_article(ai_processor: AIProcessor, article_id: int, content: str) -> AIAnalysisResult:
    """
    分析单篇文章（用于并行调用）

    Args:
        ai_processor: AI 处理器实例
        article_id: 文章 ID
        content: 文章内容

    Returns:
        AI 分析结果
    """
    try:
        return ai_processor.analyze_text(content)
    except Exception as e:
        print(f"[AI Analyzer] 文章 {article_id} 分析出错: {e}")
        return None


def _get_articles_for_analysis(storage: LocalStorageBackend, date: str) -> Dict[int, str]:
    """
    从数据库获取需要分析的文章（ID 和全文内容）

    逻辑：查找在 rss_items 中存在，但在 article_contents 中有内容，
          且尚未关联到任何 theme (theme_id is NULL) 的文章，
          且未被分析过 (analyzed = 0)。

    Returns:
        一个字典 {rss_item_id: content}
    """
    try:
        conn = storage._get_connection(date, db_type="rss")
        cursor = conn.cursor()

        # SQL 查询：连接 rss_items 和 article_contents
        # 选择那些 theme_id 为空且 content 不为空且未分析过的文章
        cursor.execute("""
            SELECT
                i.id,
                ac.content
            FROM rss_items AS i
            JOIN article_contents AS ac ON i.id = ac.rss_item_id
            WHERE i.theme_id IS NULL
              AND ac.content IS NOT NULL
              AND LENGTH(ac.content) > 50
              AND i.analyzed = 0
        """)

        rows = cursor.fetchall()
        return {row['id']: row['content'] for row in rows}

    except Exception as e:
        print(f"[AI Analyzer] 从数据库获取待分析文章失败: {e}")
        return {}

def _save_analysis_results(storage: LocalStorageBackend, results: Dict[int, AIAnalysisResult], date: str, ai_processor: AIProcessor):
    """
    将分析结果保存到 analysis_themes 表，每篇文章独立生成一个主题

    Args:
        storage: 本地存储后端实例
        results: 文章ID到分析结果的映射
        date: 处理的日期
        ai_processor: AI处理器实例（保留参数以兼容，但暂不使用）
    """
    try:
        conn = storage._get_connection(date, db_type="rss")
        cursor = conn.cursor()

        print(f"[AI Analyzer] 开始保存 {len(results)} 个分析结果...")

        cursor.execute("PRAGMA table_info(analysis_themes)")
        theme_columns = {row["name"] for row in cursor.fetchall()}
        has_tags_column = "tags" in theme_columns
        if not has_tags_column:
            try:
                cursor.execute("ALTER TABLE analysis_themes ADD COLUMN tags TEXT")
                conn.commit()
                has_tags_column = True
            except Exception as e:
                print(f"[AI Analyzer] 添加 tags 字段失败，将跳过标签保存: {e}")

        # 为每篇文章独立创建主题（不再聚合）
        for article_id, analysis_result in results.items():
            # ============================================
            # 去重检查
            # ============================================
            theme_data = {
                "title": analysis_result.title,
                "summary": analysis_result.summary,
                "category": analysis_result.category
            }

            # 检查是否需要去重（直接从配置加载，避免循环导入）
            dedup_config = {}
            try:
                from trendradar.core.loader import load_config
                config = load_config()
                dedup_config = config.get("DEDUPLICATION", {})
            except Exception as e:
                print(f"[AI Analyzer] 加载去重配置失败: {e}")

            should_skip = False
            is_duplicate = False
            duplicate_info = None

            if dedup_config.get("enabled", False):
                try:
                    # 初始化去重器
                    deduplicator = ContentDeduplicator(dedup_config)

                    # 获取历史记录
                    filter_statuses = []
                    if dedup_config.get("filter_deleted", False):
                        filter_statuses.append("deleted")
                    if dedup_config.get("filter_archived", False):
                        filter_statuses.append("archived")
                    if dedup_config.get("filter_exported", False):
                        filter_statuses.append("exported")

                    if filter_statuses:
                        # 获取检查窗口（取时间和数量的较小值）
                        check_days = dedup_config.get("check_window_days", 30)
                        max_records = dedup_config.get("max_history_records", 3000)

                        # 获取同分类的历史记录（性能优化）
                        history_records = storage.get_processed_history(
                            days=check_days,
                            limit=max_records,
                            category=analysis_result.category
                        )

                        # 进一步过滤状态
                        history_records = [
                            r for r in history_records
                            if r.get("status") in filter_statuses
                        ]

                        if history_records:
                            # 先用分类过滤
                            filtered_history = deduplicator.filter_by_category(theme_data, history_records)

                            # 检查是否重复
                            is_duplicate, duplicate_info = deduplicator.is_duplicate(theme_data, filtered_history)

                            if is_duplicate:
                                duplicate_action = dedup_config.get("duplicate_action", "keep")

                                if duplicate_action == "discard":
                                    should_skip = True
                                    print(f"[AI Analyzer] ❌ 主题 '{analysis_result.title}' 与历史记录相似度 {duplicate_info.get('similarity', 0):.2%}，已丢弃")
                                else:
                                    print(f"[AI Analyzer] ⚠️ 主题 '{analysis_result.title}' 与历史记录相似度 {duplicate_info.get('similarity', 0):.2%}，标记为重复")
                            else:
                                pass  # 不重复，继续保存
                except Exception as e:
                    print(f"[AI Analyzer] ❌ 去重检查失败: {e}")
                    import traceback
                    traceback.print_exc()

            if should_skip:
                continue

            # 准备重复标记信息
            is_duplicate = 1 if is_duplicate else 0
            duplicate_similarity_value = duplicate_info.get('similarity', 0.0) if is_duplicate else None

            # 保存主题
            if has_tags_column:
                cursor.execute("""
                    INSERT INTO analysis_themes
                    (title, summary, key_points, category, importance, impact, tags, is_duplicate, duplicate_similarity)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
                """, (
                    analysis_result.title,
                    analysis_result.summary,
                    json.dumps(analysis_result.key_points, ensure_ascii=False),
                    analysis_result.category,
                    analysis_result.importance,
                    analysis_result.impact,
                    json.dumps(analysis_result.tags, ensure_ascii=False),
                    is_duplicate,
                    duplicate_similarity_value
                ))
            else:
                cursor.execute("""
                    INSERT INTO analysis_themes
                    (title, summary, key_points, category, importance, impact, is_duplicate, duplicate_similarity)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                """, (
                    analysis_result.title,
                    analysis_result.summary,
                    json.dumps(analysis_result.key_points, ensure_ascii=False),
                    analysis_result.category,
                    analysis_result.importance,
                    analysis_result.impact,
                    is_duplicate,
                    duplicate_similarity_value
                ))

            # 获取新创建的 theme ID
            theme_id = cursor.lastrowid

            # 将文章关联到主题，并标记为已分析
            cursor.execute("""
                UPDATE rss_items
                SET theme_id = ?, analyzed = 1
                WHERE id = ?
            """, (theme_id, article_id))

        # 提交事务
        conn.commit()
        print(f"[AI Analyzer] 成功保存 {len(results)} 个主题（每篇文章独立生成）。")

    except Exception as e:
        print(f"[AI Analyzer] 保存分析结果失败: {e}")
        if 'conn' in locals():
            conn.rollback()


def _create_link_summary_card(storage: LocalStorageBackend, date: str):
    """
    生成链接汇总卡片（针对全文抓取失败的文章）

    1. 获取所有 needs_link_card = 1 且 theme_id IS NULL 的文章
    2. 进行 URL 去重
    3. 生成一个统一的链接汇总卡片
    4. 保存卡片并关联所有文章

    Args:
        storage: 本地存储后端实例
        date: 要处理的日期 (YYYY-MM-DD)
    """
    try:
        conn = storage._get_connection(date, db_type="rss")
        cursor = conn.cursor()

        # 1. 获取需要生成链接卡片的文章
        cursor.execute("""
            SELECT
                i.id,
                i.title,
                i.url,
                i.feed_id,
                i.published_at,
                i.summary
            FROM rss_items AS i
            WHERE i.needs_link_card = 1
              AND i.theme_id IS NULL
            ORDER BY i.published_at DESC
            LIMIT 50
        """)

        articles = cursor.fetchall()
        if not articles:
            print("[AI Analyzer] 没有需要生成链接卡片的文章。")
            return

        print(f"[AI Analyzer] 找到 {len(articles)} 篇需要生成链接卡片的文章。")

        # 2. URL 去重（按 URL 归并）
        unique_articles = {}
        for article in articles:
            url = article['url']
            if url not in unique_articles:
                unique_articles[url] = article
            else:
                print(f"[AI Analyzer] 跳过重复 URL: {url}")

        articles = list(unique_articles.values())
        print(f"[AI Analyzer] URL 去重后剩余 {len(articles)} 篇文章。")

        # 3. 如果没有文章，直接返回
        if not articles:
            return

        # 4. 生成链接汇总卡片
        from datetime import datetime

        # 按源分组
        feed_groups = {}
        for article in articles:
            feed_id = article['feed_id']
            if feed_id not in feed_groups:
                # 获取 feed 名称
                cursor.execute("SELECT name FROM rss_feeds WHERE id = ?", (feed_id,))
                feed_row = cursor.fetchone()
                feed_name = feed_row['name'] if feed_row else feed_id

                feed_groups[feed_id] = {
                    'name': feed_name,
                    'articles': []
                }

            feed_groups[feed_id]['articles'].append({
                'id': article['id'],
                'title': article['title'],
                'url': article['url'],
                'published_at': article['published_at']
            })

        # 生成汇总内容
        summary_lines = []
        summary_lines.append(f"以下 {len(articles)} 篇文章因全文抓取失败，仅提供链接供您手动查看：\n")

        for feed_id, group in feed_groups.items():
            summary_lines.append(f"### {group['name']} ({len(group['articles'])} 篇)\n")
            for i, article in enumerate(group['articles'], 1):
                title = article['title']
                url = article['url']
                summary_lines.append(f"{i}. [{title}]({url})")
            summary_lines.append("")  # 空行分隔

        summary_content = "\n".join(summary_lines)

        # 生成带时间戳的标题
        timestamp = datetime.now().strftime("%Y-%m-%d %H:%M")
        title = f"处理失败链接 [{timestamp}]"

        # 5. 保存到 analysis_themes
        cursor.execute("""
            INSERT INTO analysis_themes
            (title, summary, key_points, category, importance, impact, tags, status)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            title,
            summary_content,
            json.dumps([f"共 {len(articles)} 篇文章需要手动查看"], ensure_ascii=False),
            "链接汇总",
            1,
            1,
            json.dumps(["链接"], ensure_ascii=False),
            'unread'
        ))

        theme_id = cursor.lastrowid

        # 6. 关联所有文章并标记为已处理
        for article in articles:
            cursor.execute("""
                UPDATE rss_items
                SET theme_id = ?, analyzed = 1
                WHERE id = ?
            """, (theme_id, article['id']))

        conn.commit()
        print(f"[AI Analyzer] 成功生成链接汇总卡片，包含 {len(articles)} 篇文章。")

    except Exception as e:
        print(f"[AI Analyzer] 生成链接汇总卡片失败: {e}")
        import traceback
        traceback.print_exc()
        if 'conn' in locals():
            conn.rollback()
