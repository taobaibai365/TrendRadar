#!/bin/bash
# 快速更新 Obsidian 插件到测试 vault

set -e

SOURCE_DIR="/Users/apple/Library/Mobile Documents/com~apple~CloudDocs/Development/TrendRadar/obsidian-plugin"
TARGET_DIR="/Users/apple/Library/Mobile Documents/iCloud~md~obsidian/Documents/test/.obsidian/plugins/trendradar"

echo "🔨 正在编译插件..."
cd "$SOURCE_DIR"
npm run build > /dev/null 2>&1

echo "📦 正在复制插件文件..."
cp "$SOURCE_DIR/main.js" "$TARGET_DIR/main.js"
cp "$SOURCE_DIR/manifest.json" "$TARGET_DIR/manifest.json"
cp "$SOURCE_DIR/styles.css" "$TARGET_DIR/styles.css"

echo "✅ 插件已更新到测试 vault"
echo "📁 目标位置: $TARGET_DIR"
echo ""
echo "📝 更新的文件:"
ls -lh "$TARGET_DIR" | grep -E "main.js|manifest.json|styles.css"
