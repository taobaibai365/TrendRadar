# TrendRadar 可扩展数据源架构设计

## 设计目标

支持多种数据源的混合模式，满足以下需求：
1. 不同来源的内容可以分组分析
2. 每个分组可以使用不同的AI配置
3. 支持网络数据源（RSS、Web、Twitter）和本地数据源（文件系统）
4. 可灵活扩展新的数据源类型

## 核心概念

### 1. 数据源组 (Source Group)

数据源组是逻辑分组，用于将多个数据源聚合在一起，并应用统一的AI配置。

**示例分组：**
- `network`: 网络信息源（RSS、Web、Twitter），使用云端AI
- `inbox`: 本地随手导入的文章，使用云端AI
- `project-x`: 某某项目专用目录，使用本地部署AI

### 2. 数据源类型 (Source Type)

- `rss`: RSS/Atom 订阅源
- `web`: 网页抓取
- `twitter`: Twitter/X 账号
- `local-dir`: 本地目录（新增）
- `local-file`: 本地文件（新增）

## 配置结构

```yaml
# config/sources.yaml

# 全局默认AI配置
default_ai_config:
  provider: "openai"
  api_key: "${OPENAI_API_KEY}"
  model_name: "gpt-4o-mini"
  base_url: "https://api.openai.com/v1"

# 数据源分组
source_groups:
  # 网络信息源组
  - id: "network"
    name: "网络信息源"
    enabled: true
    ai_config:
      provider: "openai"
      model_name: "gpt-4o-mini"
    sources:
      - type: "rss"
        id: "techcrunch"
        name: "TechCrunch"
        url: "https://techcrunch.com/feed/"
        enabled: true
        max_items: 50

      - type: "web"
        id: "hackernews"
        name: "Hacker News"
        url: "https://news.ycombinator.com/"
        selector: ".titleline > a"
        enabled: true

  # 本地inbox组（与网络源混合分析）
  - id: "inbox"
    name: "随手收集"
    enabled: true
    ai_config:
      provider: "openai"
      model_name: "gpt-4o-mini"
    sources:
      - type: "local-dir"
        id: "inbox-docs"
        name: "Inbox文档"
        path: "/Users/xxx/Obsidian/Inbox"
        file_patterns: ["*.md", "*.txt"]
        recursive: true
        enabled: true

  # 项目专用组（独立分析，使用本地AI）
  - id: "project-x"
    name: "某某项目"
    enabled: true
    ai_config:
      provider: "openai-compatible"
      base_url: "http://localhost:11434/v1"
      model_name: "llama3.2"
      api_key: "local-key"
    sources:
      - type: "local-dir"
        id: "project-x-docs"
        name: "项目文档"
        path: "/Users/xxx/Obsidian/Projects/ProjectX"
        file_patterns: ["*.md", "*.txt"]
        recursive: true
        enabled: true
```

## 实现架构

### 核心组件

```
trendradar/
├── sources/
│   ├── base.py              # 数据源基类
│   ├── manager.py           # 数据源管理器（已存在）
│   ├── group_manager.py     # 数据源分组管理器（新增）
│   ├── rss_source.py        # RSS数据源（已存在）
│   ├── web_source.py        # Web数据源（已存在）
│   ├── twitter_source.py    # Twitter数据源（已存在）
│   └── local_source.py      # 本地数据源（新增）
├── ai/
│   ├── processor.py         # AI处理器（已存在）
│   └── group_processor.py   # 分组AI处理器（新增）
└── core/
    └── group_analyzer.py    # 分组分析器（新增）
```

### 数据流程

```
1. 数据源配置加载
   ↓
2. 按组抓取内容
   ├─ network组 → RSS/Web → 本地存储 (rss_items)
   ├─ inbox组 → 本地文件 → 本地存储 (local_items)
   └─ project-x组 → 本地文件 → 本地存储 (local_items)
   ↓
3. 按组进行AI分析
   ├─ network组 → OpenAI → analysis_themes (group_id: network)
   ├─ inbox组 → OpenAI → analysis_themes (group_id: inbox)
   └─ project-x组 → 本地AI → analysis_themes (group_id: project-x)
   ↓
4. 按组生成报告（可选）
```

## 数据库扩展

### 新增表：source_groups

```sql
CREATE TABLE IF NOT EXISTS source_groups (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    enabled INTEGER DEFAULT 1,
    ai_config TEXT,  -- JSON格式的AI配置
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 修改表：analysis_themes

```sql
-- 新增字段
ALTER TABLE analysis_themes ADD COLUMN group_id TEXT;
ALTER TABLE analysis_themes ADD COLUMN group_name TEXT;

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_themes_group_id ON analysis_themes(group_id);
```

### 新增表：local_items（用于本地文件源）

```sql
CREATE TABLE IF NOT EXISTS local_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    group_id TEXT NOT NULL,
    source_id TEXT NOT NULL,
    title TEXT NOT NULL,
    file_path TEXT NOT NULL,
    file_type TEXT,  -- md, txt, pdf等
    content TEXT,
    theme_id INTEGER,
    analyzed INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (group_id) REFERENCES source_groups(id),
    FOREIGN KEY (theme_id) REFERENCES analysis_themes(id)
);
```

## API扩展

### 新增端点

```python
# 获取所有数据源分组
GET /api/source-groups

# 创建数据源分组
POST /api/source-groups

# 更新数据源分组
PUT /api/source-groups/{group_id}

# 删除数据源分组
DELETE /api/source-groups/{group_id}

# 按组获取主题
GET /api/themes?group_id={group_id}

# 按组触发抓取
POST /api/tasks/fetch?group_id={group_id}
```

## 优势

1. **灵活性**：可以随时添加新的数据源分组和配置
2. **可扩展性**：新的数据源类型只需继承 DataSource 基类
3. **隔离性**：不同分组使用不同的AI配置，互不干扰
4. **成本控制**：可以将简单内容发送给本地AI，复杂内容发送给云端AI
5. **隐私保护**：敏感项目的内容可以完全本地化处理

## 迁移路径

### 阶段1：基础架构（当前）
- 实现 SourceGroupManager
- 扩展数据库表结构
- 实现本地数据源

### 阶段2：分组处理
- 实现分组AI处理器
- 修改主流程支持分组

### 阶段3：完整功能
- 实现前端分组管理界面
- 添加分组报告功能
- 性能优化

## 使用示例

```python
# 示例1：所有网络源一起分析
network_group = source_group_manager.get_group("network")
articles = network_group.fetch_all()
themes = network_group.analyze_with_ai(articles)

# 示例2：本地项目使用本地AI
project_group = source_group_manager.get_group("project-x")
local_articles = project_group.fetch_from_local()
themes = project_group.analyze_with_ai(
    local_articles,
    ai_config={"provider": "ollama", "model": "llama3.2"}
)

# 示例3：混合模式（inbox + 网络源）
all_articles = []
for group in ["network", "inbox"]:
    all_articles.extend(source_group_manager.get_group(group).fetch_all())
mixed_themes = analyze_with_default_ai(all_articles)
```

## 配置验证

```python
# 验证配置
def validate_source_groups_config(config):
    required_fields = ["id", "name", "sources"]
    for group in config.get("source_groups", []):
        for field in required_fields:
            if field not in group:
                raise ValueError(f"Group missing {field}")

        # 验证AI配置
        if "ai_config" in group:
            validate_ai_config(group["ai_config"])

        # 验证数据源
        for source in group.get("sources", []):
            validate_source_config(source)
```

## 总结

这个架构设计具有以下特点：
- **向后兼容**：现有的单一模式可以作为一个默认分组
- **渐进式迁移**：可以逐步将现有数据源迁移到分组模式
- **插件化**：新数据源类型可以作为插件动态加载
- **配置即代码**：支持通过配置文件或API动态管理
