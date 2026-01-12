# coding=utf-8
"""
数据源分组管理器

支持将多个数据源分组，并为每个分组应用不同的AI配置。
"""

import os
import json
from typing import List, Dict, Any, Optional
from dataclasses import dataclass, field

from .base import SourceConfig, SourceType
from .manager import SourceManager


@dataclass
class AIConfig:
    """AI配置

    使用引用方式指定AI服务，而不是直接嵌入配置。
    这样可以在多个分组之间共享同一个AI服务配置。
    """
    mode: str = "two-stage"  # 'two-stage' (分阶段) 或 'single' (整体处理)
    analysis_service_id: str = ""  # 分析服务ID (two-stage模式必填，single模式使用)
    aggregation_service_id: str = ""  # 聚合服务ID (仅two-stage模式使用)

    def to_dict(self) -> Dict[str, Any]:
        return {
            "mode": self.mode,
            "analysis_service_id": self.analysis_service_id,
            "aggregation_service_id": self.aggregation_service_id
        }

    @classmethod
    def from_dict(cls, data: Dict[str, Any]) -> 'AIConfig':
        # 支持新旧两种格式
        if "provider" in data:
            # 旧格式：provider, api_key, base_url, model_name, temperature
            # 这种格式已经被废弃，需要迁移到新的服务引用模式
            # 为了不丢失数据，暂时保留旧格式但标记为需要迁移
            print(f"[AIConfig] 警告：检测到旧格式的AI配置（provider={data['provider']}），需要迁移到新的AI服务模式")
            print(f"[AIConfig] 请在界面中重新配置AI服务")
            # 返回一个默认的空配置，用户需要重新设置
            return cls(
                mode="two-stage",
                analysis_service_id="",
                aggregation_service_id=""
            )
        else:
            # 新格式：mode, analysis_service_id, aggregation_service_id
            return cls(
                mode=data.get("mode", "two-stage"),
                analysis_service_id=data.get("analysis_service_id", ""),
                aggregation_service_id=data.get("aggregation_service_id", "")
            )


@dataclass
class SourceGroup:
    """数据源分组"""
    id: str
    name: str
    enabled: bool = True
    ai_config: Optional[AIConfig] = None
    sources: List[SourceConfig] = field(default_factory=list)

    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "name": self.name,
            "enabled": self.enabled,
            "ai_config": self.ai_config.to_dict() if self.ai_config else None,
            "sources": [s.to_dict() for s in self.sources]
        }

    @classmethod
    def from_dict(cls, data: Dict[str, Any]) -> 'SourceGroup':
        ai_config_data = data.get("ai_config")
        ai_config = AIConfig.from_dict(ai_config_data) if ai_config_data else None

        sources_data = data.get("sources", [])
        sources = [SourceConfig.from_dict(s) for s in sources_data]

        return cls(
            id=data["id"],
            name=data["name"],
            enabled=data.get("enabled", True),
            ai_config=ai_config,
            sources=sources
        )


class SourceGroupManager:
    """
    数据源分组管理器

    管理多个数据源分组，每个分组可以有独立的AI配置和数据源集合。
    """

    def __init__(self, config_path: Optional[str] = None):
        """
        初始化分组管理器

        Args:
            config_path: 配置文件路径（JSON或YAML）
        """
        self.config_path = config_path
        self.groups: Dict[str, SourceGroup] = {}
        self._load_config()

    def _load_config(self):
        """从文件加载配置"""
        if not self.config_path or not os.path.exists(self.config_path):
            print("[SourceGroupManager] 配置文件不存在，使用默认配置")
            self._load_default_config()
            return

        try:
            with open(self.config_path, 'r', encoding='utf-8') as f:
                if self.config_path.endswith('.json'):
                    data = json.load(f)
                else:
                    # 尝试YAML
                    import yaml
                    data = yaml.safe_load(f)

            # 解析分组配置
            groups_data = data.get("source_groups", [])
            for group_data in groups_data:
                group = SourceGroup.from_dict(group_data)
                self.groups[group.id] = group

            print(f"[SourceGroupManager] 已加载 {len(self.groups)} 个数据源分组")

        except Exception as e:
            print(f"[SourceGroupManager] 加载配置失败: {e}")
            self._load_default_config()

    def _load_default_config(self):
        """加载默认配置（向后兼容）"""
        # 创建一个默认的"network"分组，包含所有现有的数据源
        default_group = SourceGroup(
            id="default",
            name="默认分组",
            enabled=True,
            ai_config=None  # 使用全局默认AI配置
        )
        self.groups["default"] = default_group

    def get_all_groups(self) -> List[SourceGroup]:
        """获取所有分组"""
        return list(self.groups.values())

    def get_group(self, group_id: str) -> Optional[SourceGroup]:
        """获取指定分组"""
        return self.groups.get(group_id)

    def get_enabled_groups(self) -> List[SourceGroup]:
        """获取所有启用的分组"""
        return [g for g in self.groups.values() if g.enabled]

    def add_group(self, group: SourceGroup) -> bool:
        """添加分组"""
        if group.id in self.groups:
            print(f"[SourceGroupManager] 分组 {group.id} 已存在")
            return False

        self.groups[group.id] = group
        return True

    def update_group(self, group_id: str, group: SourceGroup) -> bool:
        """更新分组"""
        if group_id not in self.groups:
            print(f"[SourceGroupManager] 分组 {group_id} 不存在")
            return False

        if group.id != group_id:
            print(f"[SourceGroupManager] 分组ID不匹配")
            return False

        self.groups[group_id] = group
        return True

    def remove_group(self, group_id: str) -> bool:
        """删除分组"""
        if group_id not in self.groups:
            print(f"[SourceGroupManager] 分组 {group_id} 不存在")
            return False

        del self.groups[group_id]
        return True

    def save_config(self) -> bool:
        """保存配置到文件"""
        if not self.config_path:
            print("[SourceGroupManager] 未设置配置文件路径")
            return False

        try:
            os.makedirs(os.path.dirname(self.config_path), exist_ok=True)

            data = {
                "source_groups": [g.to_dict() for g in self.groups.values()]
            }

            with open(self.config_path, 'w', encoding='utf-8') as f:
                if self.config_path.endswith('.json'):
                    json.dump(data, f, ensure_ascii=False, indent=2)
                else:
                    import yaml
                    yaml.dump(data, f, allow_unicode=True, default_flow_style=False)

            print(f"[SourceGroupManager] 配置已保存到 {self.config_path}")
            return True

        except Exception as e:
            print(f"[SourceGroupManager] 保存配置失败: {e}")
            return False

    def get_sources_in_group(self, group_id: str) -> List[SourceConfig]:
        """获取分组内的所有数据源"""
        group = self.get_group(group_id)
        if not group:
            return []
        return group.sources

    def remove_source_from_group(self, group_id: str, source_id: str) -> bool:
        """从分组中删除指定的数据源"""
        group = self.get_group(group_id)
        if not group:
            print(f"[SourceGroupManager] 分组 {group_id} 不存在")
            return False

        # 查找并删除数据源
        original_count = len(group.sources)
        group.sources = [s for s in group.sources if s.id != source_id]

        if len(group.sources) == original_count:
            print(f"[SourceGroupManager] 数据源 {source_id} 在分组 {group_id} 中不存在")
            return False

        print(f"[SourceGroupManager] 已从分组 {group_id} 中删除数据源 {source_id}")
        return True

    def find_source_group(self, source_id: str) -> Optional[str]:
        """查找包含指定数据源的分组ID"""
        for group_id, group in self.groups.items():
            if any(s.id == source_id for s in group.sources):
                return group_id
        return None

    def migrate_from_source_manager(self, source_manager: SourceManager, target_group_id: str = "default"):
        """
        从SourceManager迁移现有的数据源到指定分组

        Args:
            source_manager: 旧的数据源管理器
            target_group_id: 目标分组ID
        """
        # 获取或创建目标分组
        if target_group_id not in self.groups:
            default_group = SourceGroup(
                id=target_group_id,
                name="默认分组",
                enabled=True
            )
            self.groups[target_group_id] = default_group

        group = self.groups[target_group_id]

        # 迁移所有启用的数据源
        all_sources = source_manager.get_enabled_sources()
        group.sources = all_sources

        print(f"[SourceGroupManager] 已迁移 {len(all_sources)} 个数据源到分组 {target_group_id}")
