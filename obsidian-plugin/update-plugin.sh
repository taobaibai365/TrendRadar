#!/bin/bash

# 自动复制编译后的插件文件到测试 vault
# 使用方法：./update-plugin.sh

set -e  # 遇到错误立即退出

# 颜色定义
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 插件源目录
PLUGIN_DIR="/Users/apple/Library/Mobile Documents/com~apple~CloudDocs/Development/TrendRadar/obsidian-plugin"

# 测试 vault 目标目录
TARGET_DIR="/Users/apple/Library/Mobile Documents/iCloud~md~obsidian/Documents/test/.obsidian/plugins/trendradar"

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}  TrendRadar 插件自动更新脚本${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

# 确保目标目录存在
mkdir -p "$TARGET_DIR"

# 复制文件
echo "📦 正在复制插件文件..."

# 复制 main.js
if [ -f "$PLUGIN_DIR/main.js" ]; then
    cp "$PLUGIN_DIR/main.js" "$TARGET_DIR/main.js"
    echo -e "${GREEN}✓${NC} main.js 已更新"
else
    echo "⚠️  警告: main.js 不存在"
fi

# 复制 manifest.json
if [ -f "$PLUGIN_DIR/manifest.json" ]; then
    cp "$PLUGIN_DIR/manifest.json" "$TARGET_DIR/manifest.json"
    echo -e "${GREEN}✓${NC} manifest.json 已更新"
else
    echo "⚠️  警告: manifest.json 不存在"
fi

# 复制 styles.css
if [ -f "$PLUGIN_DIR/styles.css" ]; then
    cp "$PLUGIN_DIR/styles.css" "$TARGET_DIR/styles.css"
    echo -e "${GREEN}✓${NC} styles.css 已更新"
else
    echo "⚠️  警告: styles.css 不存在"
fi

echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}✅ 插件更新完成！${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo "📂 目标目录: $TARGET_DIR"
echo "💡 提示: 如果 Obsidian 已打开，请重新加载插件"
echo "   (命令面板 > Reload app without saving)"
