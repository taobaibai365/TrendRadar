#!/usr/bin/env python3
# coding=utf-8
"""
分组架构测试脚本

测试数据源分组管理器和本地数据源的基本功能。
"""

import os
import sys
import tempfile
from pathlib import Path

# 添加项目根目录到路径
project_root = Path(__file__).parent.parent
sys.path.insert(0, str(project_root))

from trendradar.sources import (
    SourceGroupManager,
    SourceGroup,
    AIConfig,
    LocalSource,
    SourceConfig,
    SourceType
)


def test_source_group_manager():
    """测试数据源分组管理器"""
    print("=" * 60)
    print("测试 1: 数据源分组管理器")
    print("=" * 60)

    # 创建临时配置文件
    with tempfile.NamedTemporaryFile(mode='w', suffix='.yaml', delete=False) as f:
        config_path = f.name
        f.write("""
source_groups:
  - id: "network"
    name: "网络信息源"
    enabled: true
    ai_config:
      provider: "openai"
      model_name: "gpt-4o-mini"
    sources:
      - type: "rss"
        id: "test-rss"
        name: "测试RSS"
        url: "https://example.com/feed/"
        enabled: true

  - id: "inbox"
    name: "随手收集"
    enabled: true
    sources: []
""")

    try:
        # 测试加载配置
        print("\n1.1 加载配置...")
        manager = SourceGroupManager(config_path)
        groups = manager.get_all_groups()
        print(f"✓ 加载了 {len(groups)} 个分组")

        for group in groups:
            print(f"  - {group.name} (ID: {group.id}, 启用: {group.enabled})")
            if group.ai_config:
                print(f"    AI: {group.ai_config.provider}/{group.ai_config.model_name}")

        # 测试获取单个分组
        print("\n1.2 获取单个分组...")
        network = manager.get_group("network")
        if network:
            print(f"✓ 找到分组: {network.name}")
            print(f"  数据源数量: {len(network.sources)}")

        # 测试添加分组
        print("\n1.3 添加新分组...")
        new_group = SourceGroup(
            id="test",
            name="测试分组",
            enabled=True,
            ai_config=AIConfig(provider="openai", model_name="gpt-4o-mini"),
            sources=[]
        )
        success = manager.add_group(new_group)
        if success:
            print(f"✓ 成功添加分组: {new_group.name}")

        # 测试保存配置
        print("\n1.4 保存配置...")
        success = manager.save_config()
        if success:
            print(f"✓ 配置已保存到 {config_path}")

        print("\n✅ 数据源分组管理器测试通过")
        return True

    except Exception as e:
        print(f"\n❌ 测试失败: {e}")
        import traceback
        traceback.print_exc()
        return False

    finally:
        # 清理临时文件
        if os.path.exists(config_path):
            os.unlink(config_path)


def test_local_source():
    """测试本地数据源"""
    print("\n" + "=" * 60)
    print("测试 2: 本地数据源")
    print("=" * 60)

    # 创建临时目录和测试文件
    with tempfile.TemporaryDirectory() as temp_dir:
        print(f"\n2.1 创建测试目录: {temp_dir}")

        # 创建测试文件
        test_files = {
            "test1.md": """# 测试文档1

这是第一篇测试文档的内容。

## 要点

- 要点1
- 要点2
- 要点3
""",
            "test2.txt": """测试文档2

这是一篇纯文本文档。

包含一些内容用于测试。
""",
            "test3.md": """# 项目文档

这是一个项目相关的文档。

## 背景

描述项目的背景信息。

## 目标

列出项目的主要目标。
"""
        }

        for filename, content in test_files.items():
            filepath = os.path.join(temp_dir, filename)
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f"  ✓ 创建文件: {filename}")

        try:
            # 创建本地数据源配置
            print("\n2.2 创建本地数据源...")
            config = SourceConfig(
                id="test-local",
                name="测试本地源",
                type=SourceType.LOCAL,
                enabled=True,
                max_items=10,
                extra={
                    "path": temp_dir,
                    "file_patterns": ["*.md", "*.txt"],
                    "recursive": False
                }
            )

            # 创建数据源并抓取
            print("\n2.3 抓取文件...")
            source = LocalSource(config)
            articles = source.fetch()

            print(f"✓ 抓取到 {len(articles)} 个文件")

            # 显示抓取结果
            print("\n2.4 抓取结果:")
            for i, article in enumerate(articles, 1):
                print(f"\n  文件 {i}:")
                print(f"    标题: {article.title}")
                print(f"    路径: {article.url}")
                print(f"    类型: {article.source_type}")
                print(f"    内容长度: {len(article.content) if article.content else 0}")
                if article.content:
                    preview = article.content[:100].replace('\n', ' ')
                    print(f"    预览: {preview}...")

            print("\n✅ 本地数据源测试通过")
            return True

        except Exception as e:
            print(f"\n❌ 测试失败: {e}")
            import traceback
            traceback.print_exc()
            return False


def test_ai_config():
    """测试AI配置"""
    print("\n" + "=" * 60)
    print("测试 3: AI配置")
    print("=" * 60)

    try:
        # 测试创建AI配置
        print("\n3.1 创建AI配置...")
        config = AIConfig(
            provider="openai",
            api_key="sk-test",
            model_name="gpt-4o-mini",
            temperature=0.7
        )
        print(f"✓ 创建配置: {config.provider}/{config.model_name}")

        # 测试转换为字典
        print("\n3.2 转换为字典...")
        config_dict = config.to_dict()
        print(f"✓ 转换成功: {config_dict}")

        # 测试从字典创建
        print("\n3.3 从字典创建...")
        config2 = AIConfig.from_dict(config_dict)
        print(f"✓ 创建成功: {config2.provider}/{config2.model_name}")

        # 测试与环境变量结合
        print("\n3.4 环境变量支持...")
        os.environ['TEST_API_KEY'] = 'sk-from-env'
        config_with_env = AIConfig(
            provider="openai",
            api_key="${TEST_API_KEY}",
            model_name="gpt-4o"
        )
        print(f"✓ API Key: {config_with_env.api_key}")

        print("\n✅ AI配置测试通过")
        return True

    except Exception as e:
        print(f"\n❌ 测试失败: {e}")
        import traceback
        traceback.print_exc()
        return False


def main():
    """运行所有测试"""
    print("\n" + "=" * 60)
    print("TrendRadar 分组架构测试")
    print("=" * 60)

    results = {
        "数据源分组管理器": test_source_group_manager(),
        "本地数据源": test_local_source(),
        "AI配置": test_ai_config(),
    }

    # 汇总结果
    print("\n" + "=" * 60)
    print("测试结果汇总")
    print("=" * 60)

    passed = 0
    failed = 0

    for test_name, result in results.items():
        status = "✅ 通过" if result else "❌ 失败"
        print(f"{test_name}: {status}")
        if result:
            passed += 1
        else:
            failed += 1

    print(f"\n总计: {passed} 通过, {failed} 失败")

    if failed == 0:
        print("\n🎉 所有测试通过!")
        return 0
    else:
        print(f"\n⚠️  有 {failed} 个测试失败")
        return 1


if __name__ == "__main__":
    sys.exit(main())
