# coding=utf-8
"""
AI 驱动的分析与聚合模块

取代原有的词频分析，使用大语言模型进行内容分析、分类和主题聚合。
"""

from typing import List, Dict
from collections import defaultdict

from trendradar.storage.local import LocalStorageBackend
from trendradar.ai.processor import AIProcessor, AIAnalysisResult

def run_ai_analysis(storage: LocalStorageBackend, ai_processor: AIProcessor, date: str):
    """
    执行 AI 分析和聚合流程

    1. 从数据库读取所有待分析的文章（全文内容）。
    2. 对每篇文章进行独立的 AI 分析（提取摘要、标签等）。
    3. 根据分析结果（如共享标签）对文章进行分组。
    4. 对每个分组进行更高层级的 AI 主题分析（生成聚合标题、摘要等）。
    5. 将所有分析结果存回数据库。

    Args:
        storage: 本地存储后端实例
        ai_processor: AI 处理器实例
        date: 要处理的日期 (YYYY-MM-DD)
    """
    print("[AI Analyzer] 开始执行 AI 分析流程...")

    # 1. 读取待分析的文章
    articles_to_analyze = _get_articles_for_analysis(storage, date)
    if not articles_to_analyze:
        print("[AI Analyzer] 没有找到需要分析的新文章。")
        return

    print(f"[AI Analyzer] 找到 {len(articles_to_analyze)} 篇文章待分析。")

    # 2. 对每篇文章进行独立分析
    individual_results: Dict[int, AIAnalysisResult] = {}
    for article_id, content in articles_to_analyze.items():
        if not content or len(content) < 100: # 内容过短，跳过
            continue
        
        print(f"[AI Analyzer] 正在分析文章 ID: {article_id}...")
        analysis_result = ai_processor.analyze_text(content)
        if analysis_result:
            individual_results[article_id] = analysis_result

    if not individual_results:
        print("[AI Analyzer] 所有文章都未能成功进行初步分析。")
        return
        
    print(f"[AI Analyzer] {len(individual_results)} 篇文章初步分析完成。")

    # 3. 根据标签对文章进行分组
    # 使用 defaultdict(list) 可以简化代码
    tag_to_articles: Dict[str, List[int]] = defaultdict(list)
    for article_id, result in individual_results.items():
        for tag in result.tags:
            # 将标签标准化为小写，以便更好地分组
            tag_to_articles[tag.lower()].append(article_id)
            
    print(f"[AI Analyzer] 根据 {len(tag_to_articles)} 个独立标签对文章进行分组。")

    # 4. 对每个分组进行主题分析 (此处为简化版逻辑，实际可能更复杂)
    # 简化逻辑：此处我们仅将分析结果存入数据库，主题聚合将在下一步完成。
    # 更完整的逻辑会在这里进行二次AI调用。
    
    # 5. 将分析结果存入数据库
    # 在这个实现中，我们先不创建 "themes"，而是先将单篇文章的分析结果存起来
    # _save_analysis_results(storage, individual_results)

    print("[AI Analyzer] 分析流程已完成（简化版）。")


def _get_articles_for_analysis(storage: LocalStorageBackend, date: str) -> Dict[int, str]:
    """
    从数据库获取需要分析的文章（ID 和全文内容）
    
    逻辑：查找在 rss_items 中存在，但在 article_contents 中有内容，
          且尚未关联到任何 theme (theme_id is NULL) 的文章。
          
    Returns:
        一个字典 {rss_item_id: content}
    """
    try:
        conn = storage._get_connection(date, db_type="rss")
        cursor = conn.cursor()

        # SQL 查询：连接 rss_items 和 article_contents
        # 选择那些 theme_id 为空且 content 不为空的文章
        cursor.execute("""
            SELECT
                i.id,
                ac.content
            FROM rss_items AS i
            JOIN article_contents AS ac ON i.id = ac.rss_item_id
            WHERE i.theme_id IS NULL AND ac.content IS NOT NULL AND LENGTH(ac.content) > 50
        """)
        
        rows = cursor.fetchall()
        return {row['id']: row['content'] for row in rows}
        
    except Exception as e:
        print(f"[AI Analyzer] 从数据库获取待分析文章失败: {e}")
        return {}

def _save_analysis_results(storage: LocalStorageBackend, results: Dict[int, AIAnalysisResult]):
    """
    (此功能将在后续步骤中实现)
    将分析结果保存到 analysis_themes 表，并更新 rss_items 的 theme_id
    """
    # 这是一个占位符，具体实现会涉及：
    # 1. 遍历 results
    # 2. 为每个 result 创建一个新的 theme 记录
    # 3. 获取新 theme 的 ID
    # 4. 更新对应 article_id 的 theme_id
    pass
