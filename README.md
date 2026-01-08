<div align="center" id="trendradar">

<a href="https://github.com/sansan0/TrendRadar" title="TrendRadar">
  <img src="/_image/banner.webp" alt="TrendRadar Banner" width="80%">
</a>

**一个由 AI 驱动的信息聚合、分析和知识管理工作流**

将全网信息流自动转化为你的个人知识库

[![GitHub Stars](https://img.shields.io/github/stars/sansan0/TrendRadar?style=flat-square&logo=github&color=yellow)](https://github.com/sansan0/TrendRadar/stargazers)
[![GitHub Forks](https://img.shields.io/github/forks/sansan0/TrendRadar?style=flat-square&logo=github&color=blue)](https://github.com/sansan0/TrendRadar/network/members)
[![License](https://img.shields.io/badge/license-GPL--3.0-blue.svg?style=flat-square)](LICENSE)
[![Python Version](https://img.shields.io/badge/python-3.9+-blue.svg?style=flat-square&logo=python&logoColor=white)](https://www.python.org)
[![TypeScript](https://img.shields.io/badge/typescript-5.x-blue.svg?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org)

</div>

<div align="center">

**中文** | **[English](README-EN.md)**

</div>

---

**重大改造说明:** 本项目已被全面重构，以实现一个全新的、基于 AI 的个人知识工作流。原有的热榜监控和多渠道推送功能已被一个更强大的“后端数据引擎 + Obsidian 插件”架构所取代。

## ✨ 核心功能

- **信息自动抓取**: 通过 RSS 订阅源自动聚合信息，并抓取文章**全文内容**。
- **AI 驱动分析**: 利用大语言模型（默认集成 Gemini）对每篇文章进行深度分析，自动生成：
    - 精炼标题
    - 核心摘要
    - 内容分类与标签
    - 重要性与影响度评分
    - 关键要点列表
- **Obsidian 无缝集成**: 提供一个功能完善的 Obsidian 插件作为前端，让你在知识库中完成所有操作。
- **主题化聚合 (规划中)**: 自动将内容相似或有相关性的文章聚合到同一主题下进行分析。
- **一键知识转化**: 在 Obsidian 中，一键将分析好的主题或文章转化为结构优美的 Markdown 笔记，永久保存。

## 🏛️ 技术架构

新版 TrendRadar 由两个核心组件构成：

1.  **后端数据引擎 (Python)**:
    - 负责 RSS 抓取、全文内容提取。
    - 调用 AI 服务进行分析和处理。
    - 通过 FastAPI 提供 REST API 接口，供前端调用。

2.  **Obsidian 插件 (TypeScript & Svelte)**:
    - 在 Obsidian 中提供一个完整的工作区。
    - 调用后端 API，以美观的界面展示 AI 分析好的“主题”。
    - 查看单个主题的详细分析和其包含的原始文章列表。
    - 提供“一键导出”功能，将分析结果转化为你的个人笔记。

## 🚀 安装与设置

### **先决条件**

- **Python**: 3.9 或更高版本。
- **Node.js**: 18.x 或更高版本 (用于构建 Obsidian 插件)。
- **Obsidian**: [从官网下载](https://obsidian.md/)。
- **Google Gemini API Key**: 前往 [Google AI Studio](https://aistudio.google.com/app/apikey) 获取。

---

### **1. 后端设置**

1.  **克隆仓库**:
    ```bash
    git clone https://github.com/YOUR_USERNAME/TrendRadar.git
    cd TrendRadar
    ```

2.  **安装 Python 依赖**:
    ```bash
    pip install -r requirements.txt
    ```

3.  **配置 `config.yaml`**:
    打开 `config/config.yaml` 文件，完成以下关键配置：
    - **AI 设置**:
      ```yaml
      ai:
        api_key: "" 
      ```
      强烈建议通过环境变量 `GEMINI_API_KEY` 来设置你的 API Key，而不是直接写入文件。
    - **RSS 订阅源**:
      在 `rss.feeds` 列表中添加你想要订阅的 RSS 源。
    - **Obsidian 集成**:
      ```yaml
      integrations:
        obsidian:
          export_path: "TrendRadar/Notes" # 你希望在 Obsidian 仓库中保存笔记的路径
      ```

4.  **运行后端服务**:
    你需要运行两个独立的进程：**主程序 (爬虫)** 和 **API 服务器**。

    - **启动主程序 (用于抓取和分析)**:
      ```bash
      python -m trendradar
      ```
      程序会开始抓取 RSS 源、提取全文并进行 AI 分析（目前为模拟）。你可以根据需要设置定时任务（如 `cron`）来定期运行它。

    - **启动 API 服务器**:
      ```bash
      bash start-api-server.sh
      ```
      此脚本会启动 FastAPI 服务器，默认监听在 `http://0.0.0.0:3334`。

---

### **2. 前端设置 (Obsidian 插件)**

1.  **进入插件目录**:
    ```bash
    cd obsidian-plugin
    ```

2.  **安装 Node.js 依赖**:
    ```bash
    npm install
    ```

3.  **构建插件**:
    ```bash
    npm run build
    ```
    这会在当前目录生成 `main.js`, `manifest.json` 和 `styles.css` 文件。

4.  **安装到 Obsidian**:
    - 打开你的 Obsidian 仓库。
    - 进入 `.obsidian/plugins/` 目录。
    - 创建一个新文件夹，例如 `trendradar-ai-assistant`。
    - 将上一步生成的 `main.js`, `manifest.json`, `styles.css` 三个文件复制到这个新文件夹中。

5.  **启用插件**:
    - 重启 Obsidian 或重新加载插件。
    - 进入 `设置` -> `第三方插件`。
    - 找到 "TrendRadar AI Assistant" 并启用它。

6.  **配置插件**:
    - 在插件设置页面，确保 "Backend API URL" 指向你正在运行的后端服务 (默认为 `http://127.0.0.1:3334`)。
    - 确认 "Export Folder Path" 是你期望的路径。

## 📖 使用指南

1.  确保后端的主程序已运行过，并且 API 服务器正在运行。
2.  在 Obsidian 中，点击左侧边栏的 "雷达" 📡 图标 (TrendRadar AI)。
3.  一个新的视图将会打开，显示从后端获取的 AI 分析主题列表。
4.  点击任意主题卡片，会弹出一个详细窗口，展示完整的 AI 摘要、要点和相关的原始文章。
5.  在详情窗口中，点击 "Export to Note" 按钮，该主题的所有信息将被保存为一篇新的 Markdown 笔记。

## ⚙️ 详细配置

### `config.yaml`

- **`ai`**: 配置 AI 提供商和 API Key。
- **`rss.feeds`**: 添加或删除你想要监控的 RSS 订阅源。
- **`integrations.obsidian.export_path`**: 配置笔记导出到 Obsidian Vault 中的哪个文件夹。
- **`advanced.api_server`**: 配置 API 服务器的 host 和 port。

### `frequency_words.txt`
此文件在旧版中用于关键词过滤，在当前的 AI 分析流程中**暂未使用**。所有从 RSS feeds 中抓取的文章都会被送去分析。

## 📄 许可

本项目基于 [GPL-3.0](LICENSE) 许可证开源。

## 🙏 致谢

- 感谢原项目 [sansan0/TrendRadar](https://github.com/sansan0/TrendRadar) 提供了优秀的初始框架。
- 感谢 [newsnow](https://github.com/ourongxing/newsnow) 项目提供的热榜数据 API（尽管在新架构中已非核心）。
- 感谢所有为开源社区做出贡献的开发者。
