# coding=utf-8
"""
本地文件数据源实现

支持从本地文件系统读取文档文件（Markdown、TXT、PDF等）。
"""

import os
from typing import List, Optional
from pathlib import Path
from datetime import datetime

from .base import DataSource, SourceConfig, Article, SourceType


class LocalSource(DataSource):
    """
    本地文件数据源

    从指定的本地目录读取文档文件。
    支持的文件类型：.md, .txt, .pdf（未来）
    """

    def __init__(self, config: SourceConfig):
        """
        初始化本地数据源

        Args:
            config: 数据源配置
        """
        super().__init__(config)
        self.directory = config.extra.get("path", "")
        self.file_patterns = config.extra.get("file_patterns", ["*.md", "*.txt"])
        self.recursive = config.extra.get("recursive", True)

    def validate_config(self) -> bool:
        """验证配置"""
        if not super().validate_config():
            return False

        if not self.directory:
            print(f"[LocalSource] {self.source_name}: 未配置目录路径")
            return False

        if not os.path.exists(self.directory):
            print(f"[LocalSource] {self.source_name}: 目录不存在: {self.directory}")
            return False

        if not os.path.isdir(self.directory):
            print(f"[LocalSource] {self.source_name}: 路径不是目录: {self.directory}")
            return False

        return True

    def fetch(self) -> List[Article]:
        """
        从本地目录读取文档文件

        Returns:
            Article 对象列表
        """
        if not self.validate_config():
            print(f"[LocalSource] {self.source_name}: 配置无效，跳过")
            return []

        try:
            articles = []
            directory_path = Path(self.directory)

            # 收集匹配的文件
            files = self._collect_files(directory_path)

            print(f"[LocalSource] {self.source_name}: 找到 {len(files)} 个文件")

            for file_path in files:
                try:
                    article = self._read_file(file_path)
                    if article:
                        articles.append(article)
                except Exception as e:
                    print(f"[LocalSource] 读取文件失败 {file_path}: {e}")

            # 限制数量
            if self.config.max_items > 0:
                articles = articles[:self.config.max_items]

            return articles

        except Exception as e:
            print(f"[LocalSource] {self.source_name}: 抓取失败: {e}")
            return []

    def _collect_files(self, directory: Path) -> List[Path]:
        """
        收集目录中匹配模式的文件

        Args:
            directory: 目录路径

        Returns:
            文件路径列表
        """
        files = []

        # 遍历目录
        if self.recursive:
            iterator = directory.rglob("*")
        else:
            iterator = directory.glob("*")

        for file_path in iterator:
            # 只处理文件
            if not file_path.is_file():
                continue

            # 检查文件扩展名
            if self._matches_pattern(file_path):
                files.append(file_path)

        # 按修改时间排序（最新的在前）
        files.sort(key=lambda f: f.stat().st_mtime, reverse=True)

        return files

    def _matches_pattern(self, file_path: Path) -> bool:
        """
        检查文件是否匹配模式

        Args:
            file_path: 文件路径

        Returns:
            是否匹配
        """
        # 简单的扩展名匹配
        extensions = {
            ".md": "*.md",
            ".markdown": "*.markdown",
            ".txt": "*.txt",
            ".pdf": "*.pdf"
        }

        file_ext = file_path.suffix.lower()

        for pattern in self.file_patterns:
            pattern_lower = pattern.lower().replace("*", "")
            if file_ext == pattern_lower:
                return True

        return False

    def _read_file(self, file_path: Path) -> Optional[Article]:
        """
        读取单个文件

        Args:
            file_path: 文件路径

        Returns:
            Article 对象，失败返回 None
        """
        try:
            # 读取文件内容
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()

            # 提取标题（第一行非空行）
            title = self._extract_title(content, file_path.name)

            # 获取文件修改时间
            mtime = datetime.fromtimestamp(file_path.stat().st_mtime)
            published_at = mtime.isoformat()

            # 创建文章对象
            article = Article(
                title=title,
                url=str(file_path.absolute()),  # 使用完整路径作为URL
                source_id=self.source_id,
                source_name=self.source_name,
                source_type=SourceType.LOCAL,
                published_at=published_at,
                author="",
                summary=content[:500],  # 前500字符作为摘要
                content=content  # 完整内容
            )

            return article

        except UnicodeDecodeError:
            # 尝试其他编码
            try:
                with open(file_path, 'r', encoding='gbk') as f:
                    content = f.read()

                title = self._extract_title(content, file_path.name)
                mtime = datetime.fromtimestamp(file_path.stat().st_mtime)

                return Article(
                    title=title,
                    url=str(file_path.absolute()),
                    source_id=self.source_id,
                    source_name=self.source_name,
                    source_type=SourceType.LOCAL,
                    published_at=mtime.isoformat(),
                    author="",
                    summary=content[:500],
                    content=content
                )
            except Exception as e:
                print(f"[LocalSource] 编码错误 {file_path}: {e}")
                return None

        except Exception as e:
            print(f"[LocalSource] 读取文件失败 {file_path}: {e}")
            return None

    def _extract_title(self, content: str, fallback: str) -> str:
        """
        从内容中提取标题

        Args:
            content: 文件内容
            fallback: 备用标题（文件名）

        Returns:
            提取的标题
        """
        lines = content.strip().split('\n')

        # 找到第一个非空行
        for line in lines:
            line = line.strip()
            if line:
                # 移除Markdown标题标记
                if line.startswith('#'):
                    line = line.lstrip('#').strip()
                return line

        # 如果没有找到，使用文件名（去掉扩展名）
        return Path(fallback).stem
