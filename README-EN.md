<div align="center" id="trendradar">

<a href="https://github.com/sansan0/TrendRadar" title="TrendRadar">
  <img src="/_image/banner.webp" alt="TrendRadar Banner" width="80%">
</a>

**An AI-Powered Workflow for Information Aggregation, Analysis, and Knowledge Management**

Automatically transform global information streams into your personal knowledge base.

[![GitHub Stars](https://img.shields.io/github/stars/sansan0/TrendRadar?style=flat-square&logo=github&color=yellow)](https://github.com/sansan0/TrendRadar/stargazers)
[![GitHub Forks](https://img.shields.io/github/forks/sansan0/TrendRadar?style=flat-square&logo=github&color=blue)](https://github.com/sansan0/TrendRadar/network/members)
[![License](https://img.shields.io/badge/license-GPL--3.0-blue.svg?style=flat-square)](LICENSE)
[![Python Version](https://img.shields.io/badge/python-3.9+-blue.svg?style=flat-square&logo=python&logoColor=white)](https://www.python.org)
[![TypeScript](https://img.shields.io/badge/typescript-5.x-blue.svg?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org)

</div>

<div align="center">

**[中文](README.md)** | **English**

</div>

---

**Major Refactoring Notice:** This project has been completely refactored to implement a brand new, AI-based personal knowledge workflow. The original hot-list monitoring and multi-channel push features have been replaced by a more powerful "Backend Data Engine + Obsidian Plugin" architecture.

## ✨ Core Features

- **Automatic Information Retrieval**: Aggregates information from RSS feeds and scrapes the **full text** of articles.
- **AI-Powered Analysis**: Utilizes a Large Language Model (Gemini by default) to perform in-depth analysis on each article, automatically generating:
    - A concise, refined title
    - A core summary
    - Content category and tags
    - Importance and impact scores
    - A list of key points
- **Seamless Obsidian Integration**: Provides a full-featured Obsidian plugin as the frontend, allowing you to perform all operations within your knowledge base.
- **Thematic Aggregation (Planned)**: Automatically groups similar or related articles under a single theme for analysis.
- **One-Click Knowledge Conversion**: Instantly convert analyzed themes or articles into well-structured Markdown notes in Obsidian for permanent storage.

## 🏛️ Architecture

The new TrendRadar consists of two core components:

1.  **Backend Data Engine (Python)**:
    - Handles RSS crawling and full-text content extraction.
    - Calls the AI service for analysis and processing.
    - Provides a REST API via FastAPI for the frontend to consume.

2.  **Obsidian Plugin (TypeScript & Svelte)**:
    - Provides a complete workspace view within Obsidian.
    - Calls the backend API to display AI-analyzed "themes" in a beautiful interface.
    - Allows viewing detailed analysis and the list of original articles for a single theme.
    - Includes a "Export to Note" feature to transform analysis results into your personal notes.

## 🚀 Installation and Setup

### **Prerequisites**

- **Python**: 3.9 or higher.
- **Node.js**: 18.x or higher (for building the Obsidian plugin).
- **Obsidian**: [Download from the official website](https://obsidian.md/).
- **Google Gemini API Key**: Get one from [Google AI Studio](https://aistudio.google.com/app/apikey).

---

### **1. Backend Setup**

1.  **Clone the Repository**:
    ```bash
    git clone https://github.com/YOUR_USERNAME/TrendRadar.git
    cd TrendRadar
    ```

2.  **Install Python Dependencies**:
    ```bash
    pip install -r requirements.txt
    ```

3.  **Configure `config.yaml`**:
    Open the `config/config.yaml` file and complete the following key configurations:
    - **AI Settings**:
      ```yaml
      ai:
        api_key: "" 
      ```
      It is strongly recommended to set your API key via the `GEMINI_API_KEY` environment variable for security.
    - **RSS Feeds**:
      Add the RSS feeds you want to subscribe to in the `rss.feeds` list.
    - **Obsidian Integration**:
      ```yaml
      integrations:
        obsidian:
          export_path: "TrendRadar/Notes" # The path within your Obsidian vault to save notes
      ```

4.  **Run the Backend Services**:
    You need to run two separate processes: the **Main Program (Crawler)** and the **API Server**.

    - **Start the Main Program (for crawling and analysis)**:
      ```bash
      python -m trendradar
      ```
      The program will start crawling RSS feeds, extracting full text, and performing AI analysis (currently mocked). You can set up a scheduled task (like `cron`) to run it periodically.

    - **Start the API Server**:
      ```bash
      bash start-api-server.sh
      ```
      This script starts the FastAPI server, which listens on `http://0.0.0.0:3334` by default.

---

### **2. Frontend Setup (Obsidian Plugin)**

1.  **Navigate to the Plugin Directory**:
    ```bash
    cd obsidian-plugin
    ```

2.  **Install Node.js Dependencies**:
    ```bash
    npm install
    ```

3.  **Build the Plugin**:
    ```bash
    npm run build
    ```
    This will generate `main.js`, `manifest.json`, and `styles.css` in the current directory.

4.  **Install in Obsidian**:
    - Open your Obsidian vault.
    - Go to the `.obsidian/plugins/` directory.
    - Create a new folder, for example, `trendradar-ai-assistant`.
    - Copy the `main.js`, `manifest.json`, and `styles.css` files generated in the previous step into this new folder.

5.  **Enable the Plugin**:
    - Restart Obsidian or reload its plugins.
    - Go to `Settings` -> `Community plugins`.
    - Find "TrendRadar AI Assistant" and enable it.

6.  **Configure the Plugin**:
    - In the plugin's settings tab, ensure the "Backend API URL" points to your running backend server (default is `http://127.0.0.1:3334`).
    - Confirm that the "Export Folder Path" is set to your desired path.

## 📖 Usage Guide

1.  Make sure the backend main program has been run at least once and the API server is running.
2.  In Obsidian, click the "Radar" 📡 icon (TrendRadar AI) in the left ribbon.
3.  A new view will open, displaying the list of AI-analyzed themes fetched from the backend.
4.  Click on any theme card to open a detail modal showing the full AI summary, key points, and related source articles.
5.  In the detail modal, click the "Export to Note" button to save all the theme's information as a new, well-structured Markdown note.

## ⚙️ Configuration Details

### `config.yaml`

- **`ai`**: Configure the AI provider and API Key.
- **`rss.feeds`**: Add or remove the RSS feeds you want to monitor.
- **`integrations.obsidian.export_path`**: Configure the folder in your Obsidian Vault for exported notes.
- **`advanced.api_server`**: Configure the host and port for the API server.

### `frequency_words.txt`
This file was used for keyword filtering in the old version and is **currently not used** by the new AI analysis workflow. All articles fetched from the RSS feeds will be sent for analysis.

## 📄 License

This project is licensed under the [GPL-3.0](LICENSE) License.

## 🙏 Acknowledgements

- Thanks to the original [sansan0/TrendRadar](https://github.com/sansan0/TrendRadar) project for providing an excellent initial framework.
- Thanks to the [newsnow](https://github.com/ourongxing/newsnow) project for its hot-list data API (though no longer a core part of the new architecture).
- Thanks to all developers who contribute to the open-source community.
