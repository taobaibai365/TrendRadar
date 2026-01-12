# coding=utf-8
"""
RSS 数据源实现

从 RSS/Atom 订阅源抓取文章。
"""

import time
import random
from typing import List, Optional

import requests

from .base import DataSource, SourceConfig, Article, SourceType
from trendradar.crawler.rss.parser import RSSParser


class RSSSource(DataSource):
    """
    RSS 数据源

    支持标准的 RSS 2.0 和 Atom 格式。
    """

    def __init__(self, config: SourceConfig, timeout: int = 15, proxy_url: str = ""):
        """
        初始化 RSS 数据源

        Args:
            config: 数据源配置
            timeout: 请求超时时间（秒）
            proxy_url: 代理服务器 URL
        """
        super().__init__(config)
        self.timeout = timeout
        self.proxy_url = proxy_url
        self.parser = RSSParser()
        self._session = self._create_session()

    def _create_session(self) -> requests.Session:
        """创建 HTTP 会话"""
        session = requests.Session()
        session.headers.update({
            "User-Agent": "TrendRadar/3.0 RSS Reader (https://github.com/trendradar)",
            "Accept": "application/feed+json, application/json, application/rss+xml, "
                      "application/atom+xml, application/xml, text/xml, */*",
            "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8",
        })

        if self.config.use_proxy and self.proxy_url:
            session.proxies = {
                "http": self.proxy_url,
                "https": self.proxy_url,
            }
        
        return session
    
    def validate_config(self) -> bool:
        """验证 RSS 配置"""
        if not super().validate_config():
            return False
        return bool(self.config.url)
    
    def fetch(self) -> List[Article]:
        """
        抓取 RSS 源
        
        Returns:
            Article 对象列表
        """
        if not self.validate_config():
            print(f"[RSS] {self.source_name}: 配置无效，跳过")
            return []
        
        try:
            response = self._session.get(self.config.url, timeout=self.timeout)
            response.raise_for_status()
            
            # 使用现有的 RSS 解析器
            parsed_items = self.parser.parse(response.text, self.config.url)
            
            # 限制条目数量
            if self.config.max_items > 0:
                parsed_items = parsed_items[:self.config.max_items]
            
            # 转换为统一的 Article 格式
            articles = []
            for item in parsed_items:
                article = Article(
                    title=item.title,
                    url=item.url,
                    source_id=self.source_id,
                    source_name=self.source_name,
                    source_type=SourceType.RSS,
                    published_at=item.published_at or "",
                    author=item.author or "",
                    summary=item.summary or "",
                    content=None,  # 全文内容稍后通过 scraper 获取
                )
                articles.append(article)

            print(f"[RSS] {self.source_name}: 获取 {len(articles)} 条")
            return articles

        except requests.Timeout:
            error_msg = f"请求超时 ({self.timeout}s)"
            print(f"[RSS] {self.source_name}: {error_msg}")
            self._log_error("timeout", error_msg)
            return []
        except requests.RequestException as e:
            error_msg = str(e)
            print(f"[RSS] {self.source_name}: 请求失败 - {error_msg}")
            self._log_error("request", error_msg, details=str(type(e).__name__))
            return []
        except ValueError as e:
            error_msg = str(e)
            print(f"[RSS] {self.source_name}: 解析失败 - {error_msg}")
            self._log_error("parse", error_msg, details="RSS/Atom 解析错误")
            return []
        except Exception as e:
            error_msg = str(e)
            print(f"[RSS] {self.source_name}: 未知错误 - {error_msg}")
            self._log_error("unknown", error_msg, details=type(e).__name__)
            return []

    def _log_error(self, error_type: str, message: str, details: str = ""):
        """记录错误到错误追踪器"""
        try:
            # 延迟导入以避免循环依赖
            from trendradar.api.errors import get_error_tracker
            error_tracker = get_error_tracker()
            error_tracker.log_error(
                error_type="source",
                source=self.source_name,
                message=message,
                severity="error",
                details=details if details else None
            )
        except Exception as e:
            # 错误记录失败不影响主流程
            print(f"[RSS] {self.source_name}: 记录错误失败 - {e}")
