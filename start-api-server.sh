#!/bin/bash
#
# TrendRadar REST API Server - 启动脚本
#

# 获取脚本所在目录
SCRIPT_DIR=$(cd "$(dirname "${BASH_SOURCE[0]}")" &> /dev/null && pwd)
cd "$SCRIPT_DIR"

# 检查 uvicorn 是否安装
if ! command -v uvicorn &> /dev/null
then
    echo "错误: uvicorn 未安装。"
    echo "请先安装项目依赖: pip install -r requirements.txt"
    exit 1
fi

echo "启动 TrendRadar REST API 服务器..."
echo "访问 http://127.0.0.1:3334/docs 查看 API 文档"

# 启动服务器
# --host 0.0.0.0 允许从外部访问（例如 Obsidian 插件）
# --port 3334 使用一个新端口，避免与 MCP 服务器冲突
# --reload 开发时非常有用，文件变化时自动重启服务器
uvicorn api.main:app --host 0.0.0.0 --port 3334 --reload
