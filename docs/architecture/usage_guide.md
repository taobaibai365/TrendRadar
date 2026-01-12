# 数据源分组架构使用指南

## 概述

数据源分组架构允许您将不同来源的内容分组管理，并为每个分组应用不同的AI配置。这特别适合以下场景：

1. **混合分析**：将本地Inbox中的文章与网络RSS源一起分析
2. **成本优化**：简单内容使用本地AI，复杂内容使用云端AI
3. **隐私保护**：敏感项目的内容完全本地化处理
4. **多租户**：不同的项目使用不同的AI配置

## 快速开始

### 1. 准备配置文件

```bash
# 复制示例配置
cp config/sources_groups.example.yaml config/sources_groups.yaml

# 编辑配置文件
vim config/sources_groups.yaml
```

### 2. 配置数据源分组

```yaml
source_groups:
  - id: "network"
    name: "网络信息源"
    enabled: true
    ai_config:
      provider: "openai"
      model_name: "gpt-4o-mini"
    sources:
      - type: "rss"
        id: "my-blog"
        name: "我的博客订阅"
        url: "https://example.com/feed/"
        enabled: true
```

### 3. 使用Python API

```python
from trendradar.sources import SourceGroupManager, SourceGroup, AIConfig
from trendradar.sources.base import SourceConfig, SourceType

# 创建分组管理器
manager = SourceGroupManager("config/sources_groups.yaml")

# 获取所有启用的分组
groups = manager.get_enabled_groups()
for group in groups:
    print(f"分组: {group.name}")
    print(f"  AI配置: {group.ai_config.provider if group.ai_config else '默认'}")
    print(f"  数据源数量: {len(group.sources)}")

# 获取特定分组
network_group = manager.get_group("network")
if network_group:
    sources = network_group.sources
    for source in sources:
        print(f"  - {source.name} ({source.type})")
```

## 配置详解

### 数据源组配置

每个数据源组包含以下字段：

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `id` | string | 是 | 唯一标识符 |
| `name` | string | 是 | 显示名称 |
| `enabled` | boolean | 否 | 是否启用（默认true） |
| `description` | string | 否 | 分组描述 |
| `ai_config` | object | 否 | AI配置（为空则使用全局默认） |
| `sources` | array | 是 | 数据源列表 |

### AI配置

| 字段 | 类型 | 说明 |
|------|------|------|
| `provider` | string | AI提供商：openai, deepseek, gemini, openai-compatible |
| `api_key` | string | API密钥（支持环境变量） |
| `base_url` | string | API端点URL |
| `model_name` | string | 模型名称 |
| `temperature` | float | 温度参数（0-1） |

### 数据源配置

#### RSS数据源

```yaml
- type: "rss"
  id: "unique-id"
  name: "显示名称"
  url: "https://example.com/feed/"
  enabled: true
  max_items: 50
  retention_days: 30
  schedule: "0 * * * *"  # Cron表达式
```

#### Web数据源

```yaml
- type: "web"
  id: "unique-id"
  name: "显示名称"
  url: "https://example.com"
  selector: "CSS选择器"
  enabled: true
  max_items: 50
```

#### 本地目录数据源

```yaml
- type: "local"
  id: "unique-id"
  name: "显示名称"
  enabled: true
  max_items: 100
  extra:
    path: "/path/to/directory"
    file_patterns: ["*.md", "*.txt"]
    recursive: true
```

**本地数据源extra字段说明：**

| 字段 | 类型 | 说明 |
|------|------|------|
| `path` | string | 目录路径（绝对路径） |
| `file_patterns` | array | 文件模式列表，如 ["*.md", "*.txt"] |
| `recursive` | boolean | 是否递归子目录 |

## 使用场景示例

### 场景1：混合网络和本地内容

```yaml
source_groups:
  - id: "mixed-content"
    name: "混合内容"
    enabled: true
    ai_config:
      provider: "openai"
      model_name: "gpt-4o-mini"
    sources:
      # RSS源
      - type: "rss"
        id: "tech-news"
        name: "科技新闻"
        url: "https://techcrunch.com/feed/"

      # 本地Inbox
      - type: "local"
        id: "inbox"
        name: "随手收集"
        extra:
          path: "/Users/xxx/Obsidian/Inbox"
          file_patterns: ["*.md"]
          recursive: true
```

### 场景2：使用本地AI降低成本

```yaml
source_groups:
  # 简单内容使用本地AI
  - id: "simple-news"
    name: "简单新闻"
    enabled: true
    ai_config:
      provider: "openai-compatible"
      base_url: "http://localhost:11434/v1"  # Ollama
      model_name: "llama3.2"
    sources:
      - type: "rss"
        id: "news-feed"
        name: "新闻订阅"
        url: "https://news.example.com/feed/"

  # 复杂内容使用云端AI
  - id: "deep-analysis"
    name: "深度分析"
    enabled: true
    ai_config:
      provider: "openai"
      model_name: "gpt-4o"
    sources:
      - type: "rss"
        id: "research-papers"
        name: "研究论文"
        url: "https://arxiv.com/feed/"
```

### 场景3：隐私敏感项目

```yaml
source_groups:
  # 公开内容（云端AI）
  - id: "public"
    name: "公开内容"
    enabled: true
    ai_config:
      provider: "openai"
      model_name: "gpt-4o-mini"
    sources:
      - type: "rss"
        id: "public-feeds"
        name: "公开订阅"
        url: "https://public.example.com/feed/"

  # 私密项目（本地AI）
  - id: "secret-project"
    name: "私密项目"
    enabled: true
    ai_config:
      provider: "openai-compatible"
      base_url: "http://localhost:11434/v1"
      model_name: "llama3.2"
    sources:
      - type: "local"
        id: "project-docs"
        name: "项目文档"
        extra:
          path: "/Users/xxx/SecretProject"
          file_patterns: ["*.md"]
          recursive: true
```

## 高级功能

### 环境变量

支持在配置中使用环境变量：

```yaml
ai_config:
  api_key: "${OPENAI_API_KEY}"
  base_url: "${AI_BASE_URL}"
```

设置环境变量：

```bash
# ~/.bashrc 或 ~/.zshrc
export OPENAI_API_KEY="sk-xxx"
export AI_BASE_URL="https://api.openai.com/v1"
```

### 运行特定分组

```bash
# 分析特定分组
trendradar --group network

# 分析所有分组
trendradar --group all

# 分析多个分组
trendradar --group network,inbox
```

### 动态管理分组

```python
from trendradar.sources import SourceGroupManager, SourceGroup, AIConfig

# 加载配置
manager = SourceGroupManager("config/sources_groups.yaml")

# 添加新分组
new_group = SourceGroup(
    id="new-group",
    name="新分组",
    enabled=True,
    ai_config=AIConfig(provider="openai", model_name="gpt-4o-mini"),
    sources=[]
)
manager.add_group(new_group)

# 保存配置
manager.save_config()
```

## 数据库表结构

使用分组架构后，会在数据库中添加以下字段：

```sql
-- analysis_themes 表新增字段
ALTER TABLE analysis_themes ADD COLUMN group_id TEXT;
ALTER TABLE analysis_themes ADD COLUMN group_name TEXT;

-- 查询特定分组的主题
SELECT * FROM analysis_themes WHERE group_id = 'network';
```

## 故障排查

### 问题1：分组未生效

**检查：**
1. 确认 `enabled: true`
2. 检查分组ID是否正确
3. 查看日志中的错误信息

```bash
# 查看日志
tail -f logs/trendradar.log | grep "SourceGroup"
```

### 问题2：本地文件未读取

**检查：**
1. 确认路径是绝对路径
2. 检查文件权限
3. 验证 file_patterns 是否匹配

```bash
# 测试文件读取
ls -la /path/to/directory/*.md
```

### 问题3：AI配置错误

**检查：**
1. 验证API密钥是否正确
2. 确认 base_url 可访问
3. 检查模型名称是否支持

```bash
# 测试AI连接
curl -H "Authorization: Bearer $API_KEY" \
     https://api.openai.com/v1/models
```

## 最佳实践

1. **分组命名**：使用有意义的ID和名称，如 `network`, `inbox`, `project-x`
2. **AI配置**：简单内容使用小模型，复杂内容使用大模型
3. **文件组织**：本地文件按主题分类到不同目录
4. **定期维护**：定期清理旧数据，调整分组配置
5. **性能优化**：限制 max_items 避免单次抓取过多

## 迁移指南

从旧的单一模式迁移到分组模式：

```python
from trendradar.sources import SourceManager, SourceGroupManager

# 加载旧配置
old_manager = SourceManager("config/sources.json")

# 创建新分组管理器
new_manager = SourceGroupManager("config/sources_groups.yaml")

# 迁移现有数据源到默认分组
new_manager.migrate_from_source_manager(
    old_manager,
    target_group_id="default"
)

# 保存新配置
new_manager.save_config()
```

## 更多资源

- [架构设计文档](./data_source_architecture.md)
- [API参考文档](../api/reference.md)
- [配置示例](../../config/sources_groups.example.yaml)
