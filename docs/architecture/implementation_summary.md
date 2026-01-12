# 分组架构实现总结

## 已实现的功能

### 1. 核心组件

#### ✅ 数据源分组管理器 (`trendradar/sources/group_manager.py`)
- `SourceGroup`: 数据源分组数据类
- `AIConfig`: AI配置数据类
- `SourceGroupManager`: 分组管理器
  - 支持从YAML/JSON加载配置
  - 分组的增删改查
  - 配置保存和验证

#### ✅ 本地数据源 (`trendradar/sources/local_source.py`)
- `LocalSource`: 本地文件数据源
  - 支持Markdown、TXT文件
  - 递归目录扫描
  - 自动提取标题
  - 文件修改时间追踪

#### ✅ 分组分析器 (`trendradar/core/group_analyzer.py`)
- `GroupAnalyzer`: 分组分析器
  - 按分组抓取内容
  - 保存到数据库（支持local_items表）
  - 使用分组特定的AI配置

#### ✅ API端点 (`api/main.py`)
- `GET /api/source-groups` - 获取所有分组
- `GET /api/source-groups/{group_id}` - 获取单个分组
- `POST /api/source-groups` - 创建分组
- `PUT /api/source-groups/{group_id}` - 更新分组
- `DELETE /api/source-groups/{group_id}` - 删除分组
- `GET /api/themes?group_id=xxx` - 按分组过滤主题
- `POST /api/tasks/fetch?group_id=xxx` - 按分组触发抓取

### 2. 数据库扩展

#### ✅ 表结构更新
```sql
-- analysis_themes 表新增字段
ALTER TABLE analysis_themes ADD COLUMN group_id TEXT;
ALTER TABLE analysis_themes ADD COLUMN group_name TEXT;

-- local_items 表（本地文件数据源）
CREATE TABLE IF NOT EXISTS local_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    group_id TEXT NOT NULL,
    source_id TEXT NOT NULL,
    title TEXT NOT NULL,
    file_path TEXT NOT NULL,
    file_type TEXT,
    content TEXT,
    theme_id INTEGER,
    analyzed INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 3. 配置文件

#### ✅ 示例配置 (`config/sources_groups.example.yaml`)
- 网络信息源分组示例
- 本地Inbox分组示例
- 项目专用分组示例（使用本地AI）
- 工作资料分组示例

## 使用方法

### 快速开始

1. **复制配置文件**
```bash
cp config/sources_groups.example.yaml config/sources_groups.yaml
```

2. **编辑配置**
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
        id: "techcrunch"
        name: "TechCrunch"
        url: "https://techcrunch.com/feed/"
        enabled: true
```

3. **使用API**
```python
import requests

# 获取所有分组
response = requests.get("http://localhost:3334/api/source-groups")
groups = response.json()

# 创建新分组
new_group = {
    "id": "test",
    "name": "测试分组",
    "enabled": True,
    "ai_config": {
        "provider": "openai",
        "model_name": "gpt-4o-mini"
    },
    "sources": []
}
response = requests.post("http://localhost:3334/api/source-groups", json=new_group)

# 获取特定分组的主题
response = requests.get("http://localhost:3334/api/themes?group_id=network")
themes = response.json()
```

### Python API使用

```python
from trendradar.sources import SourceGroupManager, SourceGroup, AIConfig
from trendradar.sources.base import SourceConfig, SourceType

# 加载配置
manager = SourceGroupManager("config/sources_groups.yaml")

# 获取所有分组
groups = manager.get_all_groups()
for group in groups:
    print(f"{group.name}: {len(group.sources)} 个数据源")

# 获取特定分组
network = manager.get_group("network")
if network:
    print(f"AI提供商: {network.ai_config.provider if network.ai_config else '默认'}")

# 创建新分组
new_group = SourceGroup(
    id="test",
    name="测试分组",
    enabled=True,
    ai_config=AIConfig(provider="openai", model_name="gpt-4o-mini"),
    sources=[]
)
manager.add_group(new_group)
manager.save_config()
```

## API端点详细说明

### 数据源分组API

#### 获取所有分组
```
GET /api/source-groups
```
**响应示例：**
```json
{
  "groups": [
    {
      "id": "network",
      "name": "网络信息源",
      "enabled": true,
      "ai_config": {
        "provider": "openai",
        "model_name": "gpt-4o-mini",
        "base_url": "https://api.openai.com/v1"
      },
      "sources": [...]
    }
  ]
}
```

#### 创建分组
```
POST /api/source-groups
Content-Type: application/json

{
  "id": "new-group",
  "name": "新分组",
  "enabled": true,
  "ai_config": {
    "provider": "openai",
    "model_name": "gpt-4o-mini",
    "api_key": "sk-xxx"
  },
  "sources": [
    {
      "id": "my-rss",
      "name": "我的订阅",
      "type": "rss",
      "url": "https://example.com/feed/",
      "enabled": true,
      "max_items": 50
    }
  ]
}
```

#### 更新分组
```
PUT /api/source-groups/{group_id}
```

#### 删除分组
```
DELETE /api/source-groups/{group_id}
```

### 主题API（已扩展）

#### 获取主题（支持按分组过滤）
```
GET /api/themes?group_id=network&status=unread&date=2026-01-10
```

**新增参数：**
- `group_id`: 过滤特定分组的主题

### 任务API（已扩展）

#### 触发抓取（支持按分组）
```
POST /api/tasks/fetch?group_id=network
```

**新增参数：**
- `group_id`: 可选，指定要抓取的分组

## 测试指南

### 1. 测试API端点

```bash
# 启动API服务器
uvicorn api.main:app --host 0.0.0.0 --port 3334 --reload

# 测试获取分组
curl http://localhost:3334/api/source-groups

# 测试创建分组
curl -X POST http://localhost:3334/api/source-groups \
  -H "Content-Type: application/json" \
  -d '{
    "id": "test",
    "name": "测试分组",
    "enabled": true,
    "sources": []
  }'

# 测试按分组获取主题
curl http://localhost:3334/api/themes?group_id=network
```

### 2. 测试本地数据源

```python
from trendradar.sources import LocalSource, SourceConfig, SourceType

# 创建本地数据源配置
config = SourceConfig(
    id="test-local",
    name="测试本地源",
    type=SourceType.LOCAL,
    enabled=True,
    max_items=10,
    extra={
        "path": "/path/to/your/docs",
        "file_patterns": ["*.md", "*.txt"],
        "recursive": True
    }
)

# 创建数据源并抓取
source = LocalSource(config)
articles = source.fetch()

for article in articles:
    print(f"标题: {article.title}")
    print(f"路径: {article.url}")
    print(f"内容长度: {len(article.content) if article.content else 0}")
    print("---")
```

### 3. 测试分组分析器

```python
from trendradar.sources import SourceGroupManager
from trendradar.core.group_analyzer import GroupAnalyzer
from trendradar.storage.local import LocalStorageBackend

# 加载配置
group_manager = SourceGroupManager("config/sources_groups.yaml")

# 创建存储后端
storage = LocalStorageBackend(data_dir="output")

# 创建分析器
analyzer = GroupAnalyzer(
    group_manager=group_manager,
    storage=storage,
    proxy_url="",
    timeout=15
)

# 分析单个分组
result = analyzer.analyze_group("network")
print(f"成功: {result['success']}")
print(f"文章数: {result.get('articles_count', 0)}")
print(f"主题数: {result.get('themes_count', 0)}")

# 分析所有分组
all_results = analyzer.analyze_all_groups()
print(f"总分组数: {all_results['total_groups']}")
print(f"总文章数: {all_results['total_articles']}")
print(f"总主题数: {all_results['total_themes']}")
```

## 下一步开发

### 待完成功能

1. **完整的分组AI分析**
   - 修改 `run_ai_analysis` 支持分组ID
   - 支持 local_items 表的AI分析
   - 保存主题时标记 group_id 和 group_name

2. **命令行支持**
   ```bash
   trendradar --group network  # 分析特定分组
   trendradar --group all      # 分析所有分组
   ```

3. **前端UI**
   - 分组管理界面
   - 分组状态显示
   - 按分组查看主题

4. **性能优化**
   - 并行抓取多个分组
   - 缓存AI配置
   - 批量数据库操作

### 已知限制

1. **AI分析**: 当前分组分析器的AI部分还未完全实现
2. **本地数据源**: 本地文件的AI分析流程需要适配
3. **命令行**: 命令行参数还未添加分组支持
4. **通知**: 分组完成后的通知功能待实现

## 文件清单

### 核心代码
- `trendradar/sources/group_manager.py` - 分组管理器
- `trendradar/sources/local_source.py` - 本地数据源
- `trendradar/core/group_analyzer.py` - 分组分析器
- `trendradar/sources/base.py` - 添加了LOCAL类型
- `trendradar/sources/__init__.py` - 更新导出

### API
- `api/main.py` - 添加分组管理API端点

### 文档
- `docs/architecture/data_source_architecture.md` - 架构设计文档
- `docs/architecture/usage_guide.md` - 使用指南
- `docs/architecture/implementation_summary.md` - 本文档

### 配置
- `config/sources_groups.example.yaml` - 示例配置

## 总结

分组架构的核心功能已经实现：
- ✅ 数据源分组管理
- ✅ 本地文件数据源
- ✅ 分组管理API
- ✅ 数据库表结构扩展

系统现在支持：
1. 将多个数据源分组管理
2. 每个分组使用不同的AI配置
3. 从本地目录读取文档
4. 通过API管理分组

后续可以根据需要逐步完善AI分析和命令行功能。
