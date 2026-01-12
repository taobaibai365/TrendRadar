# coding=utf-8
"""
分组分析器

支持按数据源分组进行独立的抓取、分析和存储流程。
"""

import os
from typing import List, Dict, Any, Optional
from datetime import datetime

from trendradar.sources.group_manager import SourceGroup, SourceGroupManager, AIConfig
from trendradar.sources.ai_service_manager import AIServiceManager
from trendradar.sources.base import SourceConfig, SourceType
from trendradar.sources.rss_source import RSSSource
from trendradar.sources.web_source import WebSource
from trendradar.sources.twitter_source import TwitterSource
from trendradar.sources.local_source import LocalSource
from trendradar.storage.local import LocalStorageBackend
from trendradar.ai.processor import AIProcessor
from trendradar.core.ai_analyzer import run_ai_analysis


class GroupAnalyzer:
    """
    分组分析器

    为每个数据源分组执行独立的抓取、分析和存储流程。
    """

    def __init__(
        self,
        group_manager: SourceGroupManager,
        storage: LocalStorageBackend,
        proxy_url: str = "",
        timeout: int = 15
    ):
        """
        初始化分组分析器

        Args:
            group_manager: 数据源分组管理器
            storage: 本地存储后端
            proxy_url: 代理URL
            timeout: 请求超时时间
        """
        self.group_manager = group_manager
        self.storage = storage
        self.proxy_url = proxy_url
        self.timeout = timeout

        # AI服务管理器
        self.ai_service_manager = AIServiceManager()

        # 数据源类型映射
        self.source_classes = {
            SourceType.RSS: RSSSource,
            SourceType.WEB: WebSource,
            SourceType.TWITTER: TwitterSource,
            SourceType.LOCAL: LocalSource,
        }

    def analyze_group(self, group_id: str, date: Optional[str] = None) -> Dict[str, Any]:
        """
        分析单个分组

        Args:
            group_id: 分组ID
            date: 目标日期 (YYYY-MM-DD)，默认为今天

        Returns:
            分析结果统计
        """
        group = self.group_manager.get_group(group_id)
        if not group:
            print(f"[GroupAnalyzer] 分组 {group_id} 不存在")
            return {"success": False, "error": "Group not found"}

        if not group.enabled:
            print(f"[GroupAnalyzer] 分组 {group_id} 未启用，跳过")
            return {"success": False, "error": "Group disabled"}

        print(f"[GroupAnalyzer] ========================================")
        print(f"[GroupAnalyzer] 开始分析分组: {group.name} ({group_id})")
        print(f"[GroupAnalyzer] ========================================")

        try:
            # 1. 抓取所有数据源的内容
            all_articles = self._fetch_group_articles(group)

            if not all_articles:
                print(f"[GroupAnalyzer] 分组 {group.name} 没有抓取到任何内容")
                return {
                    "success": True,
                    "group_id": group_id,
                    "group_name": group.name,
                    "articles_count": 0,
                    "themes_count": 0
                }

            print(f"[GroupAnalyzer] 分组 {group.name} 抓取到 {len(all_articles)} 篇文章")

            # 2. 保存到数据库
            saved_items = self._save_articles(all_articles, group, date)

            print(f"[GroupAnalyzer] 成功保存 {len(saved_items)} 篇文章到数据库")

            # 3. AI分析
            themes_count = self._analyze_with_ai(group, date)

            print(f"[GroupAnalyzer] 分组 {group.name} 分析完成，生成 {themes_count} 个主题")

            return {
                "success": True,
                "group_id": group_id,
                "group_name": group.name,
                "articles_count": len(all_articles),
                "saved_count": len(saved_items),
                "themes_count": themes_count
            }

        except Exception as e:
            print(f"[GroupAnalyzer] 分析分组 {group_id} 失败: {e}")
            import traceback
            traceback.print_exc()
            return {
                "success": False,
                "group_id": group_id,
                "error": str(e)
            }

    def analyze_all_groups(self, date: Optional[str] = None) -> Dict[str, Any]:
        """
        分析所有启用的分组

        Args:
            date: 目标日期 (YYYY-MM-DD)，默认为今天

        Returns:
            所有分组的分析结果
        """
        enabled_groups = self.group_manager.get_enabled_groups()

        if not enabled_groups:
            print("[GroupAnalyzer] 没有启用的分组")
            return {"success": False, "error": "No enabled groups"}

        print(f"[GroupAnalyzer] 找到 {len(enabled_groups)} 个启用的分组")

        results = []
        total_articles = 0
        total_themes = 0
        failed_groups = []

        for group in enabled_groups:
            result = self.analyze_group(group.id, date)
            results.append(result)

            if result.get("success"):
                total_articles += result.get("articles_count", 0)
                total_themes += result.get("themes_count", 0)
            else:
                failed_groups.append(group.id)

        return {
            "success": True,
            "total_groups": len(enabled_groups),
            "successful_groups": len(enabled_groups) - len(failed_groups),
            "failed_groups": failed_groups,
            "total_articles": total_articles,
            "total_themes": total_themes,
            "group_results": results
        }

    def _fetch_group_articles(self, group: SourceGroup) -> List[Any]:
        """
        从分组中的所有数据源抓取文章

        Args:
            group: 数据源分组

        Returns:
            文章列表
        """
        all_articles = []

        for source_config in group.sources:
            if not source_config.enabled:
                continue

            try:
                articles = self._fetch_from_source(source_config)
                all_articles.extend(articles)
                print(f"[GroupAnalyzer] 从 {source_config.name} 抓取到 {len(articles)} 篇文章")

            except Exception as e:
                print(f"[GroupAnalyzer] 从 {source_config.name} 抓取失败: {e}")

        return all_articles

    def _fetch_from_source(self, config: SourceConfig) -> List[Any]:
        """
        从单个数据源抓取文章

        Args:
            config: 数据源配置

        Returns:
            文章列表
        """
        source_class = self.source_classes.get(config.type)

        if not source_class:
            print(f"[GroupAnalyzer] 不支持的数据源类型: {config.type}")
            return []

        # 创建数据源实例
        if config.type == SourceType.LOCAL:
            source = source_class(config)
        else:
            source = source_class(config, timeout=self.timeout, proxy_url=self.proxy_url)

        # 抓取数据
        return source.fetch()

    def _save_articles(self, articles: List[Any], group: SourceGroup, date: Optional[str] = None) -> List[Any]:
        """
        保存文章到数据库

        Args:
            articles: 文章列表
            group: 数据源分组
            date: 目标日期

        Returns:
            保存的文章列表
        """
        if not articles:
            return []

        # 根据数据源类型保存到不同的表
        local_articles = [a for a in articles if a.source_type == SourceType.LOCAL]
        network_articles = [a for a in articles if a.source_type != SourceType.LOCAL]

        saved_items = []

        # 保存网络数据源的文章（使用现有的RSS存储）
        if network_articles:
            # TODO: 转换为RSS数据格式并保存
            # 这里暂时跳过，因为需要更多适配代码
            pass

        # 保存本地文件的文章
        if local_articles:
            saved_items.extend(self._save_local_articles(local_articles, group, date))

        return saved_items

    def _save_local_articles(self, articles: List[Any], group: SourceGroup, date: Optional[str] = None) -> List[Any]:
        """
        保存本地文章到数据库

        Args:
            articles: 本地文章列表
            group: 数据源分组
            date: 目标日期

        Returns:
            保存的文章ID列表
        """
        from trendradar.utils.time import format_date_folder

        target_date = format_date_folder(date, self.storage.timezone)

        try:
            conn = self.storage._get_connection(target_date, db_type="rss")
            cursor = conn.cursor()

            # 检查 local_items 表是否存在
            cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='local_items'")
            if not cursor.fetchone():
                # 创建表
                cursor.execute("""
                    CREATE TABLE IF NOT EXISTS local_items (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        group_id TEXT NOT NULL,
                        source_id TEXT NOT NULL,
                        title TEXT NOT NULL,
                        file_path TEXT NOT NULL,
                        file_type TEXT,
                        content TEXT,
                        theme_id INTEGER,
                        analyzed INTEGER DEFAULT 0,
                        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                    )
                """)
                conn.commit()

            saved_ids = []

            for article in articles:
                # 检查是否已存在（基于文件路径）
                cursor.execute("""
                    SELECT id FROM local_items WHERE file_path = ? AND group_id = ?
                """, (article.url, group.id))

                existing = cursor.fetchone()

                if not existing:
                    # 插入新记录
                    cursor.execute("""
                        INSERT INTO local_items
                        (group_id, source_id, title, file_path, file_type, content)
                        VALUES (?, ?, ?, ?, ?, ?)
                    """, (
                        group.id,
                        article.source_id,
                        article.title,
                        article.url,  # 文件路径存储在url字段
                        article.url.split('.')[-1] if '.' in article.url else 'unknown',
                        article.content
                    ))

                    saved_ids.append(cursor.lastrowid)
                else:
                    saved_ids.append(existing['id'])

            conn.commit()
            print(f"[GroupAnalyzer] 保存了 {len(saved_ids)} 篇本地文章")
            conn.close()

            return saved_ids

        except Exception as e:
            print(f"[GroupAnalyzer] 保存本地文章失败: {e}")
            import traceback
            traceback.print_exc()
            return []

    def _analyze_with_ai(self, group: SourceGroup, date: Optional[str] = None) -> int:
        """
        使用AI分析分组的内容

        Args:
            group: 数据源分组
            date: 目标日期

        Returns:
            生成的主题数量
        """
        from trendradar.utils.time import format_date_folder

        target_date = format_date_folder(date, self.storage.timezone)

        # 获取分组的AI配置
        ai_config = group.ai_config
        if not ai_config:
            print(f"[GroupAnalyzer] 分组 {group.name} 没有配置AI，跳过分析")
            return 0

        # 获取AI模式
        mode = ai_config.mode

        # 根据模式获取AI服务配置
        if mode == "single":
            # 单一模式：使用一个服务处理整个流程
            service_id = ai_config.analysis_service_id
            if not service_id:
                print(f"[GroupAnalyzer] 分组 {group.name} 未配置分析服务，跳过分析")
                return 0

            analysis_service = self.ai_service_manager.get(service_id)
            if not analysis_service:
                print(f"[GroupAnalyzer] 分组 {group.name} 的分析服务 {service_id} 不存在，跳过分析")
                return 0

            print(f"[GroupAnalyzer] 分组 {group.name} 使用单一模式，服务: {analysis_service.name}")

            # 创建AI处理器（使用单一服务）
            processor = AIProcessor(
                provider=analysis_service.provider,
                api_key=analysis_service.api_key,
                model_name=analysis_service.model_name,
                endpoint_url=analysis_service.base_url
            )

            # 执行AI分析
            # TODO: 这里需要修改 run_ai_analysis 以支持分组ID和本地表
            print(f"[GroupAnalyzer] AI分析器已准备就绪（分组: {group.name}，模式: single，服务: {analysis_service.name}）")
            print(f"[GroupAnalyzer] 等待完整的 run_ai_analysis 集成")
            return 0

        elif mode == "two-stage":
            # 分阶段模式：使用两个不同的服务
            analysis_service_id = ai_config.analysis_service_id
            aggregation_service_id = ai_config.aggregation_service_id

            if not analysis_service_id or not aggregation_service_id:
                print(f"[GroupAnalyzer] 分组 {group.name} 的two-stage模式缺少服务配置，跳过分析")
                return 0

            analysis_service = self.ai_service_manager.get(analysis_service_id)
            aggregation_service = self.ai_service_manager.get(aggregation_service_id)

            if not analysis_service:
                print(f"[GroupAnalyzer] 分组 {group.name} 的分析服务 {analysis_service_id} 不存在，跳过分析")
                return 0

            if not aggregation_service:
                print(f"[GroupAnalyzer] 分组 {group.name} 的聚合服务 {aggregation_service_id} 不存在，跳过分析")
                return 0

            print(f"[GroupAnalyzer] 分组 {group.name} 使用分阶段模式")
            print(f"[GroupAnalyzer]   分析服务: {analysis_service.name}")
            print(f"[GroupAnalyzer]   聚合服务: {aggregation_service.name}")

            # 创建AI处理器（使用分析服务）
            processor = AIProcessor(
                provider=analysis_service.provider,
                api_key=analysis_service.api_key,
                model_name=analysis_service.model_name,
                endpoint_url=analysis_service.base_url
            )

            # 执行AI分析
            # TODO: 这里需要实现完整的两阶段分析流程
            print(f"[GroupAnalyzer] AI分析器已准备就绪（分组: {group.name}，模式: two-stage）")
            print(f"[GroupAnalyzer]   - 分析服务: {analysis_service.name}")
            print(f"[GroupAnalyzer]   - 聚合服务: {aggregation_service.name}")
            print(f"[GroupAnalyzer] 等待完整的两阶段分析流程集成")
            return 0

        else:
            print(f"[GroupAnalyzer] 分组 {group.name} 的AI模式 '{mode}' 不支持，跳过分析")
            return 0
