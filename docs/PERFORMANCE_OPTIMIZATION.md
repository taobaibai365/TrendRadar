# AI 分析性能优化说明

## 优化内容

### 之前：串行分析 ❌
```python
for article_id, content in articles.items():
    result = ai_processor.analyze_text(content)  # 等待完成
```

**问题**：
- 如果有 10 篇文章，每篇分析需要 10 秒
- 总耗时：10 × 10 = **100 秒**

### 现在：并行分析 ✅
```python
with ThreadPoolExecutor(max_workers=4) as executor:
    futures = [executor.submit(analyze, aid, content) for aid, content in articles]
    for future in as_completed(futures):
        result = future.result()  # 不等待其他任务
```

**优势**：
- 4 个线程同时工作
- 10 篇文章分 3 批完成：
  - 第 1 批：4 篇（10 秒）
  - 第 2 批：4 篇（10 秒）
  - 第 3 批：2 篇（10 秒）
- 总耗时：**30 秒**（提速 **70%**）

## 技术细节

### 1. 并发控制
- **最大并发数**：4 个线程（可调整）
- **线程安全**：使用 `threading.Lock()` 保护共享变量
- **错误处理**：单篇文章失败不影响其他文章

### 2. 进度显示
```
[AI Analyzer] 启动 4 个并发分析任务...
[AI Analyzer] 进度: 1/10 篇文章已分析 (ID: 123)
[AI Analyzer] 进度: 2/10 篇文章已分析 (ID: 124)
[AI Analyzer] 进度: 3/10 篇文章已分析 (ID: 125)
...
```

### 3. 性能提升

| 文章数量 | 串行耗时 | 并行耗时 (4线程) | 提速 |
|---------|---------|-----------------|------|
| 5 篇    | 50 秒   | 20 秒           | 60%  |
| 10 篇   | 100 秒  | 30 秒           | 70%  |
| 20 篇   | 200 秒  | 60 秒           | 70%  |
| 50 篇   | 500 秒  | 150 秒          | 70%  |

**结论**：文章越多，提速越明显！

## 可配置项

如果你想调整并发数，修改 `trendradar/core/ai_analyzer.py` 第 53 行：

```python
# 当前：最多 4 个并发
max_workers = min(4, len(valid_articles))

# 改为：最多 8 个并发（需要更强的 API 限额）
max_workers = min(8, len(valid_articles))
```

**注意事项**：
- 并发数越多，API 调用越快，但可能触发速率限制
- DeepSeek/OpenAI 等服务通常有 RPM（每分钟请求数）限制
- 建议值：3-5 个并发

## 使用方法

无需修改任何配置，自动生效！

1. 启动 Python 后端：
```bash
cd /path/to/TrendRadar
python3 -m uvicorn api.main:app --host 127.0.0.1 --port 3334
```

2. 在 Obsidian 中点击"开始抓取"

3. 观察后台日志，会看到并发分析进度

4. 分析速度大幅提升！🚀
