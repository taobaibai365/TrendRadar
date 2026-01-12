# coding=utf-8
"""
TrendRadar 主程序包装器

提供给 API 使用的 TrendRadar 实例封装，支持配置重载和单次运行。
"""

import os
from typing import Optional

from trendradar.context import AppContext
from trendradar.core import load_config
from trendradar.core.ai_analyzer import run_ai_analysis
from trendradar.ai.processor import AIProcessor
from trendradar.__main__ import NewsAnalyzer
from trendradar.sources.manager import SourceManager

class TrendRadar(NewsAnalyzer):
    """TrendRadar 主程序封装类"""
    
    def __init__(self):
        super().__init__()
        self.source_manager = SourceManager()
        self._sync_dynamic_config()
        
    def _sync_dynamic_config(self):
        """将 SourceManager 的动态配置同步到 AppContext"""
        print("正在同步动态数据源配置...")
        
        # 重新加载数据源配置
        self.source_manager._load_config()
        
        # 获取所有启用的 RSS 源
        rss_sources = [
            s for s in self.source_manager.get_enabled_sources() 
            if s.type == "rss"
        ]
        
        # 转换为 AppContext 需要的格式
        rss_feeds = []
        for source in rss_sources:
            rss_feeds.append({
                "id": source.id,
                "name": source.name,
                "url": source.url,
                "max_items": source.max_items,
                "enabled": True,
                "max_age_days": source.retention_days
            })
            
        # 更新 RSS 配置
        if "RSS" not in self.ctx.config:
            self.ctx.config["RSS"] = {}
            
        self.ctx.config["RSS"]["FEEDS"] = rss_feeds
        self.ctx.config["RSS"]["ENABLED"] = len(rss_feeds) > 0
        
        print(f"已同步 {len(rss_feeds)} 个 RSS 源到运行配置")
        
    def reload_config(self):
        """重新加载配置"""
        print("正在重新加载配置...")
        # 重新加载配置文件
        config = load_config()
        
        # 更新上下文配置
        self.ctx.config = config
        
        # 同步动态配置
        self._sync_dynamic_config()
        
        # 更新实例属性
        self.request_interval = self.ctx.config["REQUEST_INTERVAL"]
        self.report_mode = self.ctx.config["REPORT_MODE"]
        self.rank_threshold = self.ctx.rank_threshold
        
        # 重新初始化存储管理器
        self._init_storage_manager()
        
        print("配置重新加载完成")
        
    def run_once(self):
        """执行一次完整的抓取和分析流程"""
        # 每次运行前确保配置是最新的
        self._sync_dynamic_config()
        self.run()
