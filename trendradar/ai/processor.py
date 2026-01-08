# coding=utf-8
"""
AI 内容处理器

负责连接大语言模型，并根据预设的指令分析文本内容。
"""

import json
from typing import Optional, Dict, Any, List
from dataclasses import dataclass, asdict
import re

# 这是一个占位符，实际使用时需要安装 google-generativeai
# import google.generativeai as genai

# --- 数据模型 ---
@dataclass
class AIAnalysisResult:
    """
    AI分析结果的数据模型
    """
    title: str
    summary: str
    category: str
    tags: List[str]
    importance: int
    impact: int
    key_points: List[str]

    def to_dict(self) -> Dict[str, Any]:
        return asdict(self)

# --- AI 处理器 ---
class AIProcessor:
    """
    AI 内容分析器
    """
    def __init__(self, api_key: str, model_name: str = "gemini-pro"):
        """
        初始化 AI 处理器

        Args:
            api_key: 大语言模型的 API Key
            model_name: 模型名称
        """
        if not api_key:
            raise ValueError("API Key 不能为空")
        
        self.api_key = api_key
        self.model_name = model_name
        
        # 实际使用时取消下面的注释
        # try:
        #     genai.configure(api_key=self.api_key)
        #     self.model = genai.GenerativeModel(self.model_name)
        # except Exception as e:
        #     raise RuntimeError(f"初始化 Google Gemini 失败: {e}")

    def analyze_text(self, text_content: str) -> Optional[AIAnalysisResult]:
        """
        分析给定的文本内容

        Args:
            text_content: 从网页抓取到的文章全文

        Returns:
            一个 AIAnalysisResult 对象，如果分析失败则返回 None
        """
        
        # 为了避免 API 真实调用和 Key 的问题，此处返回一个模拟的伪数据
        # 在真实场景中，下面的 return 语句需要被注释掉
        print("[AI Processor] 警告：正在使用模拟数据，未真实调用 AI API。")
        return self._get_mock_result()

        # --- 以下是真实调用的代码 ---
        
        # prompt = self._build_prompt(text_content)
        # try:
        #     # response = self.model.generate_content(prompt)
        #     # raw_json = self._extract_json(response.text)
        #     # result_dict = json.loads(raw_json)
        #     # return self._parse_result(result_dict)
        #     pass # 占位
        # except Exception as e:
        #     print(f"[AI Processor] 调用 API 失败: {e}")
        #     return None
        
    def _build_prompt(self, text_content: str) -> str:
        """构建发送给大语言模型的指令 (Prompt)"""
        
        # 限制内容长度，防止超出 token 限制
        max_length = 15000
        if len(text_content) > max_length:
            text_content = text_content[:max_length] + "... (内容已截断)"

        prompt = f"""
请你扮演一个专业的新闻分析师。请仔细阅读以下文章内容，并根据你的理解，以严格的 JSON 格式返回你的分析结果。

**文章内容:**
---
{text_content}
---

**分析要求:**
请根据文章内容，提取或生成以下信息，并以一个完整的 JSON 对象返回：
1.  `title`: (string) 生成一个简洁、精炼、吸引人的标题，不超过 25 个字。
2.  `summary`: (string) 对全文进行深入总结，生成一段约 150-250 字的摘要。
3.  `category`: (string) 从以下分类中选择最相关的一个：科技、财经、政治、军事、社会、文化、娱乐、体育、其他。
4.  `tags`: (string array) 提取文章的 3-5 个核心关键词作为标签。
5.  `importance`: (integer) 评估文章的重要性，范围从 1 (非常不重要) 到 10 (非常重要)。
6.  `impact`: (integer) 评估文章的潜在影响范围，范围从 1 (影响极小) 到 10 (影响巨大)。
7.  `key_points`: (string array) 列出文章的 3-5 个核心要点，每点一句话。

**输出格式要求:**
- 你的回答必须是一个能够被 `json.loads()` 函数直接解析的、格式严格的 JSON 对象。
- 不要添加任何 JSON 格式以外的说明、注释或 markdown 标记（例如 \`\`\`json）。
- 键名必须与要求中的完全一致。
- 值的类型必须与要求中的完全一致。

**JSON 示例:**
{{
  "title": "...",
  "summary": "...",
  "category": "...",
  "tags": ["...", "..."],
  "importance": 7,
  "impact": 6,
  "key_points": ["...", "..."]
}}
"""
        return prompt

    def _extract_json(self, text: str) -> str:
        """从模型的返回文本中提取 JSON 部分"""
        match = re.search(r'\{.*\}', text, re.DOTALL)
        if match:
            return match.group(0)
        return text # 如果没有找到，假设整个文本就是 JSON

    def _parse_result(self, result_dict: Dict[str, Any]) -> Optional[AIAnalysisResult]:
        """将解析后的字典转换为 AIAnalysisResult 对象"""
        try:
            return AIAnalysisResult(
                title=result_dict.get("title", "无标题"),
                summary=result_dict.get("summary", ""),
                category=result_dict.get("category", "其他"),
                tags=result_dict.get("tags", []),
                importance=int(result_dict.get("importance", 5)),
                impact=int(result_dict.get("impact", 5)),
                key_points=result_dict.get("key_points", [])
            )
        except (TypeError, ValueError) as e:
            print(f"[AI Processor] 解析 API 返回的 JSON 字段失败: {e}")
            return None
            
    def _get_mock_result(self) -> AIAnalysisResult:
        """返回一个用于测试的模拟结果"""
        return AIAnalysisResult(
            title="模拟AI分析标题",
            summary="这是一个由模拟数据生成的摘要，用于在没有真实API Key的情况下测试流程。它描述了一个关于人工智能如何改变软件开发的虚构事件。",
            category="科技",
            tags=["AI", "软件开发", "模拟数据"],
            importance=8,
            impact=7,
            key_points=[
                "AI正在自动化部分编码工作。",
                "开发者需要学习新的技能以适应变化。",
                "这是一个模拟要点，不代表真实内容。"
            ]
        )

# 使用示例
if __name__ == '__main__':
    # 这是一个简单的测试
    # 在真实环境中，api_key 需要从配置中读取
    # processor = AIProcessor(api_key="YOUR_API_KEY") 
    
    # 模拟一个 AI 处理器
    class MockAIProcessor(AIProcessor):
        def __init__(self):
            print("初始化一个模拟的AI处理器（无需API Key）")
        
        def analyze_text(self, text_content: str) -> Optional[AIAnalysisResult]:
            print(f"正在模拟分析以下内容的文本：\n---\n{text_content[:100]}...\n---")
            return self._get_mock_result()

    # 执行测试
    mock_processor = MockAIProcessor()
    sample_text = "这是一段关于下一代AI技术如何赋能开发者的长篇文章..."
    analysis_result = mock_processor.analyze_text(sample_text)

    if analysis_result:
        print("\n✅ 分析成功！")
        print(json.dumps(analysis_result.to_dict(), indent=2, ensure_ascii=False))
    else:
        print("\n❌ 分析失败。")
