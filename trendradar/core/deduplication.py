# coding=utf-8
"""
内容去重模块

基于文本相似度检测重复内容，避免用户已处理的内容重复出现。
"""

import re
import jieba
from typing import List, Dict, Tuple, Optional
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np


class TextSimilarityCalculator:
    """文本相似度计算器"""

    def __init__(self):
        self.tfidf_vectorizer = TfidfVectorizer(
            tokenizer=self._chinese_tokenizer,
            min_df=1,
            max_df=0.9,
            ngram_range=(1, 2)
        )

    @staticmethod
    def _chinese_tokenizer(text: str) -> List[str]:
        """
        中文分词器

        Args:
            text: 输入文本

        Returns:
            分词列表
        """
        # 移除标点符号和特殊字符
        text = re.sub(r'[^\w\s]', '', text)
        # 使用 jieba 分词
        words = jieba.cut(text)
        # 过滤停用词和单字
        stopwords = {'的', '了', '在', '是', '我', '有', '和', '就', '不', '人', '都', '一', '一个', '上', '也', '很', '到', '说', '要', '去', '你', '会', '着', '没有', '看', '好', '自己', '这'}
        return [w for w in words if len(w) > 1 and w not in stopwords]

    def jaccard_similarity(self, text1: str, text2: str) -> float:
        """
        计算 Jaccard 相似度

        Jaccard = (A ∩ B) / (A ∪ B)

        Args:
            text1: 文本1
            text2: 文本2

        Returns:
            相似度 (0.0-1.0)
        """
        words1 = set(self._chinese_tokenizer(text1))
        words2 = set(self._chinese_tokenizer(text2))

        if not words1 and not words2:
            return 1.0

        if not words1 or not words2:
            return 0.0

        intersection = words1.intersection(words2)
        union = words1.union(words2)

        return len(intersection) / len(union) if union else 0.0

    def cosine_similarity_tfidf(self, text1: str, text2: str) -> float:
        """
        计算余弦相似度（基于 TF-IDF）

        Args:
            text1: 文本1
            text2: 文本2

        Returns:
            相似度 (0.0-1.0)
        """
        if not text1 or not text2:
            return 0.0

        try:
            texts = [text1, text2]
            tfidf_matrix = self.tfidf_vectorizer.fit_transform(texts)
            similarity = cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:2])[0][0]
            return float(similarity)
        except Exception as e:
            print(f"Error calculating cosine similarity: {e}")
            return 0.0

    def hybrid_similarity(
        self,
        title1: str, summary1: str,
        title2: str, summary2: str,
        title_weight: float = 0.7,
        summary_weight: float = 0.3
    ) -> float:
        """
        计算混合相似度（标题 + 摘要）

        Args:
            title1: 标题1
            summary1: 摘要1
            title2: 标题2
            summary2: 摘要2
            title_weight: 标题权重（默认0.7）
            summary_weight: 摘要权重（默认0.3）

        Returns:
            综合相似度 (0.0-1.0)
        """
        # 标题使用 Jaccard（快速且适合短文本）
        title_sim = self.jaccard_similarity(title1, title2)

        # 摘要使用 TF-IDF 余弦相似度（适合中等长度文本）
        summary_sim = self.cosine_similarity_tfidf(summary1, summary2)

        # 加权平均
        hybrid_sim = title_sim * title_weight + summary_sim * summary_weight

        return hybrid_sim


class ContentDeduplicator:
    """内容去重器"""

    def __init__(self, config: Dict):
        """
        初始化去重器

        Args:
            config: 去重配置
                - similarity_threshold: 相似度阈值
                - check_window_days: 检查时间窗口（天）
                - max_history_records: 最大历史记录数
                - filter_deleted: 是否过滤已删除
                - filter_archived: 是否过滤已归档
                - filter_exported: 是否过滤已导出
                - method: 相似度计算方法 ("title_only" | "hybrid")
        """
        self.config = config
        self.similarity_calc = TextSimilarityCalculator()

    def is_duplicate(
        self,
        new_theme: Dict,
        history_records: List[Dict]
    ) -> Tuple[bool, Optional[Dict]]:
        """
        判断新主题是否与历史记录重复

        Args:
            new_theme: 新主题（包含 title, summary, category）
            history_records: 历史记录列表

        Returns:
            (是否重复, 最相似的记录)
        """
        if not history_records:
            return False, None

        max_similarity = 0.0
        most_similar = None

        for record in history_records:
            similarity = self._calculate_similarity(new_theme, record)

            if similarity > max_similarity:
                max_similarity = similarity
                most_similar = record

        threshold = self.config.get('similarity_threshold', 0.8)
        is_duplicate = max_similarity >= threshold

        if is_duplicate and most_similar:
            # 在相似记录中添加相似度信息
            most_similar['similarity'] = max_similarity

        return is_duplicate, most_similar

    def _calculate_similarity(self, theme1: Dict, theme2: Dict) -> float:
        """
        计算两个主题的相似度

        Args:
            theme1: 主题1
            theme2: 主题2

        Returns:
            相似度 (0.0-1.0)
        """
        method = self.config.get('method', 'hybrid')

        title1 = theme1.get('title', '')
        summary1 = theme1.get('summary', '')
        title2 = theme2.get('title', '')
        summary2 = theme2.get('summary', '')

        if method == 'title_only':
            return self.similarity_calc.jaccard_similarity(title1, title2)
        else:  # hybrid
            return self.similarity_calc.hybrid_similarity(title1, summary1, title2, summary2)

    def filter_by_category(
        self,
        new_theme: Dict,
        history_records: List[Dict]
    ) -> List[Dict]:
        """
        过滤出同分类的历史记录

        Args:
            new_theme: 新主题
            history_records: 全部历史记录

        Returns:
            同分类的历史记录
        """
        new_category = new_theme.get('category', '')

        if not new_category:
            return history_records

        # 精确匹配分类
        same_category = [r for r in history_records if r.get('category') == new_category]

        # 如果同分类记录太少，也包含相似分类的
        if len(same_category) < 10:
            # 简单的分类匹配：包含相同关键词
            category_keywords = set(new_category.split())
            similar_category = [
                r for r in history_records
                if any(kw in r.get('category', '') for kw in category_keywords)
            ]
            return same_category + similar_category

        return same_category
