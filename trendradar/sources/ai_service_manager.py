# coding=utf-8
"""
AI服务管理模块

管理可用的AI服务列表，数据源分组通过引用ID使用这些服务。
"""

import os
import json
from typing import List, Dict, Any, Optional
from dataclasses import dataclass, field


@dataclass
class AIService:
    """AI服务配置"""
    id: str
    name: str  # 服务显示名称
    provider: str = "openai"  # openai, deepseek, gemini, openai-compatible
    api_key: str = ""
    base_url: str = ""
    model_name: str = ""
    temperature: float = 0.7
    description: str = ""  # 服务描述

    def to_dict(self) -> Dict[str, Any]:
        """转换为字典"""
        return {
            "id": self.id,
            "name": self.name,
            "provider": self.provider,
            "api_key": self.api_key,
            "base_url": self.base_url,
            "model_name": self.model_name,
            "temperature": self.temperature,
            "description": self.description
        }

    @classmethod
    def from_dict(cls, data: Dict[str, Any]) -> 'AIService':
        """从字典创建实例"""
        return cls(
            id=data["id"],
            name=data["name"],
            provider=data.get("provider", "openai"),
            api_key=data.get("api_key", ""),
            base_url=data.get("base_url", ""),
            model_name=data.get("model_name", ""),
            temperature=data.get("temperature", 0.7),
            description=data.get("description", "")
        )


class AIServiceManager:
    """
    AI服务管理器

    管理可用的AI服务列表，支持CRUD操作。
    """

    def __init__(self, config_path: Optional[str] = None):
        """
        初始化AI服务管理器

        Args:
            config_path: 配置文件路径，默认为 ~/.trendradar/ai_services.json
        """
        if config_path is None:
            config_dir = os.path.expanduser("~/.trendradar")
            os.makedirs(config_dir, exist_ok=True)
            config_path = os.path.join(config_dir, "ai_services.json")

        self.config_path = config_path
        self.services: List[AIService] = []
        self.load()

    def load(self):
        """从文件加载AI服务列表"""
        if os.path.exists(self.config_path):
            try:
                with open(self.config_path, 'r', encoding='utf-8') as f:
                    data = json.load(f)
                    self.services = [AIService.from_dict(item) for item in data]
                print(f"Loaded {len(self.services)} AI services from {self.config_path}")
            except Exception as e:
                print(f"Failed to load AI services: {e}")
                self.services = []

        # 如果没有服务，尝试从旧配置迁移
        if not self.services:
            self._migrate_from_old_config()

        # 如果还是没有服务，创建默认服务
        if not self.services:
            self._create_default_services()
            self.save()

    def _migrate_from_old_config(self):
        """从旧的 AI 配置迁移"""
        # 获取项目根目录（向上两级，并规范化路径）
        module_dir = os.path.dirname(os.path.abspath(__file__))
        project_root = os.path.abspath(os.path.join(module_dir, "..", ".."))

        # 尝试从多个可能的位置读取旧配置
        old_config_paths = [
            # 项目根目录的 config
            os.path.join(project_root, "config", "ai_config.json"),
            # 用户主目录的 .trendradar
            os.path.expanduser("~/.trendradar/ai_config.json"),
        ]

        for old_path in old_config_paths:
            if os.path.exists(old_path):
                try:
                    with open(old_path, 'r', encoding='utf-8') as f:
                        old_config = json.load(f)

                    # 将旧配置转换为 AI 服务
                    provider = old_config.get("provider", "openai")
                    model_name = old_config.get("model_name", "gpt-4o")
                    base_url = old_config.get("base_url", "")

                    # 生成服务ID
                    service_id = f"migrated-{provider}-{model_name}".replace("_", "-").replace(".", "-")

                    # 创建服务
                    service = AIService(
                        id=service_id,
                        name=f"{provider.upper()} (迁移自旧配置)",
                        provider=provider,
                        api_key=old_config.get("api_key", ""),
                        base_url=base_url,
                        model_name=model_name,
                        temperature=old_config.get("temperature", 0.7),
                        description="从旧版 AI 配置自动迁移"
                    )

                    self.services.append(service)
                    print(f"自动迁移 AI 服务: {service.name}")
                    self.save()

                    # 只迁移第一个找到的配置
                    return

                except Exception as e:
                    print(f"迁移旧配置失败: {e}")
                    continue

    def save(self):
        """保存AI服务列表到文件"""
        try:
            with open(self.config_path, 'w', encoding='utf-8') as f:
                json.dump([service.to_dict() for service in self.services], f, ensure_ascii=False, indent=2)
            print(f"Saved {len(self.services)} AI services to {self.config_path}")
        except Exception as e:
            print(f"Failed to save AI services: {e}")
            raise

    def _create_default_services(self):
        """创建默认AI服务"""
        self.services = [
            AIService(
                id="default-openai",
                name="OpenAI (默认)",
                provider="openai",
                model_name="gpt-4o",
                temperature=0.7,
                description="OpenAI GPT-4o，适合通用任务"
            ),
            AIService(
                id="default-openai-fast",
                name="OpenAI 快速分析",
                provider="openai",
                model_name="gpt-4o-mini",
                temperature=0.3,
                description="OpenAI GPT-4o-mini，适合快速分析"
            )
        ]

    def get_all(self) -> List[AIService]:
        """获取所有AI服务"""
        return self.services.copy()

    def get(self, service_id: str) -> Optional[AIService]:
        """根据ID获取AI服务"""
        for service in self.services:
            if service.id == service_id:
                return service
        return None

    def add(self, service: AIService) -> bool:
        """
        添加AI服务

        Args:
            service: AI服务对象

        Returns:
            是否添加成功
        """
        # 检查ID是否已存在
        if self.get(service.id):
            print(f"AI service with id '{service.id}' already exists")
            return False

        self.services.append(service)
        self.save()
        return True

    def update(self, service_id: str, service: AIService) -> bool:
        """
        更新AI服务

        Args:
            service_id: 服务ID
            service: 新的服务配置

        Returns:
            是否更新成功
        """
        for i, existing in enumerate(self.services):
            if existing.id == service_id:
                self.services[i] = service
                self.save()
                return True
        return False

    def delete(self, service_id: str) -> bool:
        """
        删除AI服务

        Args:
            service_id: 服务ID

        Returns:
            是否删除成功
        """
        for i, service in enumerate(self.services):
            if service.id == service_id:
                del self.services[i]
                self.save()
                return True
        return False


# 全局单例
_ai_service_manager: Optional[AIServiceManager] = None


def get_ai_service_manager(config_path: Optional[str] = None) -> AIServiceManager:
    """获取AI服务管理器单例"""
    global _ai_service_manager
    if _ai_service_manager is None:
        _ai_service_manager = AIServiceManager(config_path)
    return _ai_service_manager
