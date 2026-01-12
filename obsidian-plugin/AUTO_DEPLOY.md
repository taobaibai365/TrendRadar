# Obsidian 插件自动部署配置

## 📋 配置说明

### 自动部署目标

**测试 vault 路径**：
```
/Users/apple/Library/Mobile Documents/iCloud~md~obsidian/Documents/test/.obsidian/plugins/trendradar
```

### 工作流程

```
修改代码
    ↓
npm run build
    ↓
编译 main.js
    ↓
自动执行 postbuild
    ↓
运行 update-plugin.sh
    ↓
复制文件到测试 vault ✅
```

## 🔧 配置文件

### 1. package.json

```json
{
  "scripts": {
    "build": "rollup --config rollup.config.js --environment BUILD:production",
    "postbuild": "./update-plugin.sh"  // 👈 自动部署脚本
  }
}
```

### 2. update-plugin.sh

```bash
#!/bin/bash

# 源目录
PLUGIN_DIR="/Users/apple/Library/Mobile Documents/com~apple~CloudDocs/Development/TrendRadar/obsidian-plugin"

# 目标目录（测试 vault）
TARGET_DIR="/Users/apple/Library/Mobile Documents/iCloud~md~obsidian/Documents/test/.obsidian/plugins/trendradar"

# 自动复制文件
cp "$PLUGIN_DIR/main.js" "$TARGET_DIR/main.js"
cp "$PLUGIN_DIR/manifest.json" "$TARGET_DIR/manifest.json"
cp "$PLUGIN_DIR/styles.css" "$TARGET_DIR/styles.css"
```

## ✅ 验证状态

| 文件 | 大小 | 最后更新时间 |
|------|------|--------------|
| main.js | 381 KB | 2026-01-11 11:13:12 |
| manifest.json | 315 B | 2026-01-11 11:13:12 |
| styles.css | 17 KB | 2026-01-11 11:13:12 |

**验证结果**：✅ 所有文件已成功自动部署

## 🚀 使用方法

### 编译并自动部署

```bash
cd obsidian-plugin
npm run build
```

**输出**：
```
✓ main.js 已更新
✓ manifest.json 已更新
✓ styles.css 已更新

✅ 插件更新完成！
📂 目标目录: /Users/apple/Library/Mobile Documents/iCloud~md~obsidian/Documents/test/.obsidian/plugins/trendradar
💡 提示: 如果 Obsidian 已打开，请重新加载插件
```

### 在 Obsidian 中重新加载插件

1. 打开测试 vault
2. 按 `Cmd+P` 打开命令面板
3. 输入 `Reload app without saving`
4. 执行命令

或者直接重启 Obsidian。

## 📝 注意事项

### 1. 权限问题

如果遇到权限错误：
```bash
chmod +x obsidian-plugin/update-plugin.sh
```

### 2. 路径问题

路径中包含空格（"Mobile Documents"），bash 脚本已正确处理。

### 3. iCloud 同步延迟

由于目标路径在 iCloud 中，可能需要几秒钟才能同步完成。

## 🔄 自动部署的工作原理

### npm postbuild 钩子

当你运行 `npm run build` 时，npm 会：
1. 执行 `build` 脚本（编译插件）
2. build 成功后，自动执行 `postbuild` 脚本（部署插件）

### 修改配置

如果需要修改目标目录，编辑 `update-plugin.sh`：

```bash
# 修改这一行
TARGET_DIR="/your/new/vault/path/.obsidian/plugins/trendradar"
```

## 🧪 测试验证

### 验证自动部署

```bash
# 编译插件
cd obsidian-plugin
npm run build

# 检查文件时间戳
ls -l "/Users/apple/Library/Mobile Documents/iCloud~md~obsidian/Documents/test/.obsidian/plugins/trendradar/"
```

**预期结果**：文件时间戳应该是最新的。

### 验证插件功能

1. 在 Obsidian 中打开测试 vault
2. 进入设置 → 社区插件 → 已安装插件
3. 找到 "TrendRadar" 并启用
4. 测试功能是否正常

## 📊 部署历史

| 时间 | 操作 | 结果 |
|------|------|------|
| 2026-01-11 11:13 | 完整编译 | ✅ 成功 |
| 2026-01-11 11:05 | 完整编译 | ✅ 成功 |
| 2026-01-09 21:49 | 配置更新 | ✅ 成功 |

## 🎯 总结

**自动部署已配置完成并验证正常工作**。

每次修改代码后，只需运行：
```bash
npm run build
```

插件就会自动编译并部署到测试 vault，无需手动复制文件。

---

**配置文件位置**：
- `obsidian-plugin/package.json`
- `obsidian-plugin/update-plugin.sh`

**文档更新时间**：2026-01-11
