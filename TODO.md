# TrendRadar 改造计划 TODO

## 第一部分：后端数据引擎 (Python)

- [x] 1. **[数据库]** 升级 `storage/schema.sql`，增加用于存储 AI 分析结果（如分类、标签、总结、重要性等）的字段。
- [x] 2. **[爬虫]** 改造 `crawler/fetcher.py`，实现获取链接后的全文抓取功能。
- [x] 3. **[AI模块]** 新建 `trendradar/ai/processor.py` 模块，封装对大语言模型 API 的调用逻辑。
- [x] 4. **[核心逻辑]** 重构 `core/analyzer.py`，从词频分析改为调用 AI 模块进行分析、分类和聚合。
- [x] 5. **[API服务]** 改造 `mcp_server/server.py`，利用 Flask 或 FastAPI 框架，创建 API 端点以提供分析结果。
- [x] 6. **[配置]** 更新 `config.yaml`，加入 AI 服务和新功能的相关配置。

## 第二部分：前端 Obsidian 插件 (TypeScript)

- [x] 7. **[初始化]** 创建一个新的 Obsidian 插件项目骨架。
- [x] 8. **[API客户端]** 编写代码，用于请求后端引擎的 API 接口。
- [x] 9. **[UI开发]** 开发插件主视图，用于展示后端返回的“主题”列表。
- [x] 10. **[UI开发]** 开发详情视图，用于展示单个“主题”的完整 AI 分析和原始链接。
- [x] 11. **[核心功能]** 实现“转为笔记”功能，将数据格式化为 Markdown 并存入 Obsidian 仓库。
- [x] 12. **[设置]** 创建插件的设置页面，允许用户配置后端服务地址。
