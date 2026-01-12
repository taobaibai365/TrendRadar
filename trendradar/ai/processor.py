# coding=utf-8
"""
AI 内容处理器

负责连接大语言模型，并根据预设的指令分析文本内容。
"""

import json
import requests
from typing import Optional, Dict, Any, List
from dataclasses import dataclass, asdict
import re

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
    
    支持多种AI服务提供商，包括 OpenAI, DeepSeek, Gemini 等。
    """
    # 支持的AI服务提供商
    SUPPORTED_PROVIDERS = ["openai", "deepseek", "gemini", "mock"]
    
    def __init__(self, provider: str = "mock", api_key: str = None, model_name: str = None, endpoint_url: str = None):
        """
        初始化 AI 处理器

        Args:
            provider: AI服务提供商
            api_key: 大语言模型的 API Key
            model_name: 模型名称
            endpoint_url: API端点URL
        """
        if provider not in self.SUPPORTED_PROVIDERS:
            # 默认为 openai 兼容模式
            if provider:
                print(f"[AI Processor] 未知提供商 {provider}，将尝试使用 OpenAI 兼容模式")
                self.provider = "openai"
            else:
                self.provider = "mock"
        else:
            self.provider = provider
            
        self.api_key = api_key
        self.endpoint_url = endpoint_url
        
        # 设置默认模型名称
        if not model_name:
            if provider == "gemini":
                self.model_name = "gemini-pro"
            elif provider == "deepseek":
                self.model_name = "deepseek-chat"
            elif provider == "openai":
                self.model_name = "gpt-3.5-turbo"
            else:
                self.model_name = "mock-model"
        else:
            self.model_name = model_name
        
        # 设置默认 Endpoint
        if not self.endpoint_url:
            if self.provider == "deepseek":
                self.endpoint_url = "https://api.deepseek.com/v1/chat/completions"
            elif self.provider == "openai":
                self.endpoint_url = "https://api.openai.com/v1/chat/completions"
            # Gemini 通常使用 SDK，这里暂不设置默认 URL

    def analyze_text(self, text_content: str) -> Optional[AIAnalysisResult]:
        """
        分析给定的文本内容

        Args:
            text_content: 从网页抓取到的文章全文

        Returns:
            一个 AIAnalysisResult 对象，如果分析失败则返回 None
        """
        
        # 如果是mock模式，直接返回模拟数据
        if self.provider == "mock":
            print("[AI Processor] 警告：正在使用模拟数据，未真实调用 AI API。")
            return self._get_mock_result()

        if not self.api_key:
            print("[AI Processor] 错误：未配置 API Key，无法调用 AI 服务。")
            return None

        # 构建prompt
        prompt = self._build_prompt(text_content)
        
        try:
            result_dict = {}
            # 根据不同的AI服务提供商调用相应的API
            if self.provider == "gemini":
                result_dict = self._call_gemini_api(prompt)
            else:
                # OpenAI, DeepSeek 和其他兼容 OpenAI 格式的接口
                result_dict = self._call_openai_compatible_api(prompt)
            
            return self._parse_result(result_dict)
        except Exception as e:
            print(f"[AI Processor] 调用 {self.provider} API 失败: {e}")
            # 严重错误：不再回退到模拟数据，而是直接返回 None，让用户知道出错了
            return None
        
    def _build_prompt(self, text_content: str, filter_prompt: str = "") -> str:
        """构建发送给大语言模型的指令 (Prompt)"""
        
        # 限制内容长度，防止超出 token 限制
        max_length = 12000
        if len(text_content) > max_length:
            text_content = text_content[:max_length] + "... (内容已截断)"
        
        # 默认的过滤指令
        default_filter = """
**内容过滤要求:**
请首先判断本文是否属于财经、科技、商业、国际关系、地缘政治或其他严肃新闻范畴。
如果文章内容主要涉及娱乐、八卦、明星、综艺、体育、游戏等非严肃新闻类别，
或者是名人轶事、社会八卦等娱乐性内容，请直接在返回的 JSON 中将 `category` 字段设为 `irrelevant`，
其他字段可以简化处理（如 importance 和 impact 设为 1）。
只有当文章具有实质性的信息价值时，才进行详细分析。
"""
        
        filter_instruction = filter_prompt if filter_prompt else default_filter

        prompt = f"""
请你扮演一个专业的新闻分析师。请仔细阅读以下文章内容，并根据你的理解，以严格的 JSON 格式返回你的分析结果。请特别关注经济趋势、国际关系和技术科技相关的内容。

{filter_instruction}

**文章内容:**
---
{text_content}
---

**分析要求:**
请根据文章内容，提取或生成以下信息，并以一个完整的 JSON 对象返回：
1.  `title`: (string) 生成一个简洁、精炼、吸引人的标题，不超过 25 个字。
2.  `summary`: (string) 对全文进行深入总结，生成一段约 150-250 字的摘要。
3.  `category`: (string) 从以下分类中选择最相关的一个：经济趋势、国际关系、技术科技、商业、金融、政治、军事、社会、文化、其他。如果是娱乐八卦类内容，请设为 `irrelevant`。
4.  `tags`: (string array) 提取文章的 3-5 个核心关键词作为标签。
5.  `importance`: (integer) 评估文章的重要性，范围从 1 (非常不重要) 到 10 (非常重要)。
6.  `impact`: (integer) 评估文章的潜在影响范围，范围从 1 (影响极小) 到 10 (影响巨大)。
7.  `key_points`: (string array) 列出文章的 3-5 个核心要点，每点一句话。

**输出格式要求:**
- 你的回答必须是一个能够被 `json.loads()` 函数直接解析的、格式严格的 JSON 对象。
- 不要添加任何 JSON 格式以外的说明、注释或 markdown 标记（例如 ```json）。
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
            
    def _call_openai_compatible_api(self, prompt: str) -> Dict[str, Any]:
        """
        调用 OpenAI 兼容格式的 API (包括 DeepSeek, Moonshot 等)
        """
        headers = {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {self.api_key}"
        }
        
        data = {
            "model": self.model_name,
            "messages": [
                {"role": "system", "content": "You are a helpful assistant that outputs JSON."},
                {"role": "user", "content": prompt}
            ],
            "temperature": 0.3,
            "stream": False
        }
        
        print(f"[AI Processor] 正在调用 API: {self.endpoint_url}, 模型: {self.model_name}")
        
        try:
            response = requests.post(self.endpoint_url, headers=headers, json=data, timeout=60)
            response.raise_for_status()
            
            result = response.json()
            content = result['choices'][0]['message']['content']
            
            # 提取并解析 JSON
            json_str = self._extract_json(content)
            return json.loads(json_str)
            
        except requests.exceptions.RequestException as e:
            print(f"[AI Processor] HTTP 请求失败: {e}")
            if hasattr(e, 'response') and e.response is not None:
                print(f"[AI Processor] 响应内容: {e.response.text}")
            raise
        except (KeyError, json.JSONDecodeError) as e:
            print(f"[AI Processor] 响应解析失败: {e}")
            raise

    def _call_gemini_api(self, prompt: str) -> Dict[str, Any]:
        """
        调用 Google Gemini API (通过 REST API)
        """
        # 如果没有配置 endpoint_url，使用默认的
        url = self.endpoint_url
        if not url:
            url = f"https://generativelanguage.googleapis.com/v1beta/models/{self.model_name}:generateContent?key={self.api_key}"
            
        headers = {
            "Content-Type": "application/json"
        }
        
        data = {
            "contents": [{
                "parts": [{"text": prompt}]
            }]
        }
        
        print(f"[AI Processor] 正在调用 Gemini API")
        
        try:
            response = requests.post(url, headers=headers, json=data, timeout=60)
            response.raise_for_status()
            
            result = response.json()
            # Gemini 的响应结构比较复杂
            try:
                content = result['candidates'][0]['content']['parts'][0]['text']
                json_str = self._extract_json(content)
                return json.loads(json_str)
            except (KeyError, IndexError) as e:
                print(f"[AI Processor] Gemini 响应结构异常: {result}")
                raise
                
        except requests.exceptions.RequestException as e:
            print(f"[AI Processor] Gemini HTTP 请求失败: {e}")
            raise

    def _get_mock_result(self) -> AIAnalysisResult:
        """返回模拟的分析结果"""
        return AIAnalysisResult(
            title="[模拟] AI 分析服务未配置或调用失败",
            summary="这是一条模拟的摘要信息。如果您看到这条信息，说明 AI 服务配置不正确，或者 API 调用失败。请检查您的 API Key 和网络连接。",
            category="系统通知",
            tags=["模拟数据", "配置错误", "检查日志"],
            importance=10,
            impact=10,
            key_points=["AI 服务未生效", "请检查配置", "查看后端日志"]
        )

    def aggregate_summaries(self, summaries: List[str]) -> str:
        """
        聚合多个摘要成一个简短的汇总

        Args:
            summaries: 多个摘要字符串列表

        Returns:
            聚合后的摘要字符串
        """
        if not summaries:
            return ""

        if len(summaries) == 1:
            return summaries[0]

        # 如果没有配置 API Key，返回简单的拼接
        if not self.api_key or self.provider == "mock":
            # 取第一个摘要的前 200 字符，并说明还有更多
            first_summary = summaries[0]
            if len(first_summary) > 200:
                first_summary = first_summary[:200] + "..."
            return f"{first_summary}\n\n（还有 {len(summaries) - 1} 篇相关文章）"

        # 使用 AI 进行聚合
        prompt = f"""请将以下 {len(summaries)} 篇文章的摘要合并成一个简短的汇总（不超过 200 字）：

文章摘要：
{chr(10).join(f'{i+1}. {s}' for i, s in enumerate(summaries))}

要求：
- 提取共同的主题和关键信息
- 简明扼要，不超过 200 字
- 使用中文回复
- 不要添加任何额外说明，直接返回汇总内容
"""

        try:
            if self.provider == "gemini":
                # Gemini 不支持聚合功能，回退到简单拼接
                first_summary = summaries[0]
                if len(first_summary) > 200:
                    first_summary = first_summary[:200] + "..."
                return f"{first_summary}\n\n（聚合了 {len(summaries)} 篇文章）"
            else:
                # 使用 OpenAI 兼容 API
                result = self._call_openai_compatible_api(prompt)
                if isinstance(result, dict):
                    # 提取聚合结果
                    if 'summary' in result:
                        return result['summary']
                    elif 'aggregated_summary' in result:
                        return result['aggregated_summary']
                    else:
                        # 假设整个结果就是汇总文本
                        return str(result)
                return str(result)
        except Exception as e:
            print(f"[AI Processor] 聚合摘要失败: {e}，使用简单拼接")
            # 回退到简单拼接
            first_summary = summaries[0]
            if len(first_summary) > 200:
                first_summary = first_summary[:200] + "..."
            return f"{first_summary}\n\n（聚合了 {len(summaries)} 篇文章）"
