# coding=utf-8
"""
数据源模块

提供统一的数据源接口，支持 RSS、网站爬取、Twitter 和本地文件等多种数据源类型。
支持数据源分组管理，每个分组可以应用不同的AI配置。
"""

from .base import DataSource, SourceConfig, Article, SourceType
from .rss_source import RSSSource
from .web_source import WebSource
from .twitter_source import TwitterSource
from .local_source import LocalSource
from .manager import SourceManager
from .group_manager import SourceGroup, SourceGroupManager, AIConfig

__all__ = [
    "DataSource",
    "SourceConfig",
    "Article",
    "SourceType",
    "RSSSource",
    "WebSource",
    "TwitterSource",
    "LocalSource",
    "SourceManager",
    "SourceGroup",
    "SourceGroupManager",
    "AIConfig",
]
