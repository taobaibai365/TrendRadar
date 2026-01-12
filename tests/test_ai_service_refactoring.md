# AI 服务架构重构 - 测试计划

## 一、单元测试

### 1.1 AIServiceManager 测试

#### 测试用例 1.1.1：创建 AI 服务
**前置条件**：
- 清空的 AI 服务列表

**测试步骤**：
1. 调用 `AIServiceManager.add()` 创建新服务
2. 服务包含所有必填字段

**预期结果**：
- 服务成功添加到列表
- `save()` 被调用，配置写入文件
- 返回 `True`

**测试代码**：
```python
service = AIService(
    id="test-openai",
    name="测试 OpenAI",
    provider="openai",
    api_key="sk-test",
    base_url="https://api.openai.com/v1/chat/completions",
    model_name="gpt-4o",
    temperature=0.7,
    description="测试服务"
)
result = manager.add(service)
assert result == True
assert manager.get("test-openai") is not None
```

---

#### 测试用例 1.1.2：创建重复 ID 的服务
**测试步骤**：
1. 创建 ID 为 "test-1" 的服务
2. 再次创建 ID 为 "test-1" 的服务

**预期结果**：
- 第二次创建返回 `False`
- 列表中只有一个 "test-1" 服务
- 打印错误日志

---

#### 测试用例 1.1.3：更新 AI 服务
**测试步骤**：
1. 创建服务 S1
2. 修改 S1 的 `model_name` 和 `temperature`
3. 调用 `update("s1", S1_modified)`

**预期结果**：
- 服务更新成功，返回 `True`
- `get("s1")` 返回更新后的服务
- 配置文件已更新

---

#### 测试用例 1.1.4：删除 AI 服务
**测试步骤**：
1. 创建服务 S1
2. 调用 `delete("s1")`
3. 调用 `get("s1")`

**预期结果**：
- 删除返回 `True`
- `get("s1")` 返回 `None`
- 配置文件中不包含 S1

---

#### 测试用例 1.1.5：旧配置迁移
**前置条件**：
- `config/ai_config.json` 存在且包含旧格式配置

**测试步骤**：
1. 创建新的 `AIServiceManager`
2. 检查服务列表

**预期结果**：
- 自动从旧配置创建服务
- 服务 ID 格式为 `migrated-{provider}-{model}`
- 服务名称包含"(迁移自旧配置)"
- 打印迁移日志

---

### 1.2 AIConfig 测试

#### 测试用例 1.2.1：新格式序列化
**测试步骤**：
```python
config = AIConfig(
    mode="single",
    analysis_service_id="service-1",
    aggregation_service_id=""
)
data = config.to_dict()
```

**预期结果**：
```python
{
    "mode": "single",
    "analysis_service_id": "service-1",
    "aggregation_service_id": ""
}
```

---

#### 测试用例 1.2.2：新格式反序列化
**测试步骤**：
```python
data = {
    "mode": "two-stage",
    "analysis_service_id": "service-1",
    "aggregation_service_id": "service-2"
}
config = AIConfig.from_dict(data)
```

**预期结果**：
- `config.mode == "two-stage"`
- `config.analysis_service_id == "service-1"`
- `config.aggregation_service_id == "service-2"`

---

#### 测试用例 1.2.3：旧格式反序列化（警告）
**测试步骤**：
```python
data = {
    "provider": "openai",
    "api_key": "sk-test",
    "model_name": "gpt-4o"
}
config = AIConfig.from_dict(data)
```

**预期结果**：
- 打印警告日志
- 返回空配置（所有字段为空字符串或默认值）
- `mode == "two-stage"` (默认)

---

### 1.3 GroupAnalyzer 测试

#### 测试用例 1.3.1：Single 模式服务选择
**前置条件**：
- 创建分组 G1，AI 配置为 single 模式
- `analysis_service_id = "service-1"`
- `aggregation_service_id = ""`
- 创建服务 "service-1"

**测试步骤**：
1. 调用 `analyzer._analyze_with_ai(G1)`

**预期结果**：
- 获取到服务 "service-1"
- 创建的 `AIProcessor` 使用 "service-1" 的配置
- 打印日志："使用单一模式，服务: {service-1.name}"
- 日志中**不出现**聚合服务

---

#### 测试用例 1.3.2：Two-stage 模式服务选择
**前置条件**：
- 创建分组 G2，AI 配置为 two-stage 模式
- `analysis_service_id = "service-1"`
- `aggregation_service_id = "service-2"`
- 创建两个服务

**测试步骤**：
1. 调用 `analyzer._analyze_with_ai(G2)`

**预期结果**：
- 获取到两个服务
- 创建的 `AIProcessor` 使用分析服务配置
- 打印日志显示两个服务名称
- 日志中明确显示"分阶段模式"

---

#### 测试用例 1.3.3：Single 模式缺少服务 ID
**前置条件**：
- 创建分组 G3，AI 配置为 single 模式
- `analysis_service_id = ""`

**测试步骤**：
1. 调用 `analyzer._analyze_with_ai(G3)`

**预期结果**：
- 打印错误日志："未配置分析服务，跳过分析"
- 返回 0
- 不抛出异常

---

#### 测试用例 1.3.4：服务 ID 不存在
**前置条件**：
- 创建分组 G4，`analysis_service_id = "non-existent"`

**测试步骤**：
1. 调用 `analyzer._analyze_with_ai(G4)`

**预期结果**：
- 打印错误日志："分析服务 non-existent 不存在，跳过分析"
- 返回 0
- 不抛出异常

---

### 1.4 API 端点测试

#### 测试用例 1.4.1：创建分组 - Single 模式验证
**请求**：
```json
POST /api/source-groups
{
  "id": "test-group",
  "name": "测试分组",
  "ai_config": {
    "mode": "single",
    "analysis_service_id": "service-1",
    "aggregation_service_id": "should-be-cleared"
  }
}
```

**预期结果**：
- 返回 200 OK
- `aggregation_service_id` 被自动清空
- 保存的配置中 `aggregation_service_id == ""`

---

#### 测试用例 1.4.2：创建分组 - Two-stage 模式缺少聚合服务
**请求**：
```json
POST /api/source-groups
{
  "id": "test-group",
  "ai_config": {
    "mode": "two-stage",
    "analysis_service_id": "service-1",
    "aggregation_service_id": ""
  }
}
```

**预期结果**：
- 返回 400 Bad Request
- 错误信息："Two-stage mode requires both analysis_service_id and aggregation_service_id"
- 分组未创建

---

#### 测试用例 1.4.3：创建分组 - Single 模式缺少分析服务
**请求**：
```json
POST /api/source-groups
{
  "id": "test-group",
  "ai_config": {
    "mode": "single",
    "analysis_service_id": "",
    "aggregation_service_id": ""
  }
}
```

**预期结果**：
- 返回 400 Bad Request
- 错误信息："Single mode requires analysis_service_id"
- 分组未创建

---

#### 测试用例 1.4.4：创建 AI 服务
**请求**：
```json
POST /api/ai-services
{
  "id": "test-service",
  "name": "测试服务",
  "provider": "openai",
  "api_key": "sk-test",
  "model_name": "gpt-4o"
}
```

**预期结果**：
- 返回 200 OK
- 服务创建成功
- `GET /api/ai-services` 可以获取到该服务

---

## 二、集成测试

### 2.1 前后端数据流测试

#### 测试用例 2.1.1：前端创建 Single 模式分组
**前置条件**：
- API 服务运行中
- Obsidian 插件已加载
- 已创建 AI 服务 "service-1"

**测试步骤**：
1. 打开 Obsidian 设置 → TrendRadar → 数据源分组
2. 点击"添加分组"
3. 输入分组 ID 和名称
4. 选择 AI 模式："整体处理"
5. 选择 AI 服务："service-1"
6. 点击保存

**预期结果**：
- 前端显示保存成功提示
- API 返回 200 OK
- 后端 `config/source_groups.json` 中包含新分组
- `ai_config.mode == "single"`
- `ai_config.analysis_service_id == "service-1"`
- `ai_config.aggregation_service_id == ""`

---

#### 测试用例 2.1.2：前端创建 Two-stage 模式分组
**测试步骤**：
1. 同上，但选择 AI 模式："分阶段（分析 + 聚合）"
2. 选择分析服务："service-1"
3. 选择聚合服务："service-2"
4. 点击保存

**预期结果**：
- 保存成功
- `ai_config.mode == "two-stage"`
- `ai_config.analysis_service_id == "service-1"`
- `ai_config.aggregation_service_id == "service-2"`

---

#### 测试用例 2.1.3：模式切换界面更新
**前置条件**：
- 已创建分组，当前为 single 模式

**测试步骤**：
1. 打开分组编辑界面
2. 当前显示 1 个服务选择器
3. 切换模式为"分阶段"
4. 界面自动刷新

**预期结果**：
- 显示 2 个服务选择器（分析服务、聚合服务）
- 下拉列表中包含所有已创建的 AI 服务

---

### 2.2 端到端测试

#### 测试用例 2.2.1：完整的抓取和分析流程（Single 模式）

**前置条件**：
- 已配置 AI 服务（真实 API Key）
- 已创建数据源分组（single 模式）
- 已添加 RSS 数据源

**测试步骤**：
1. 调用 `POST /api/tasks/fetch`
2. 等待任务完成
3. 检查 `GroupAnalyzer` 的日志

**预期结果**：
- 日志显示："使用单一模式，服务: {service_name}"
- AIProcessor 使用正确的服务配置
- 如果 `run_ai_analysis` 已实现，应该生成主题

---

#### 测试用例 2.2.2：完整的抓取和分析流程（Two-stage 模式）

**测试步骤**：
1. 配置分组为 two-stage 模式
2. 调用 `POST /api/tasks/fetch`
3. 检查日志

**预期结果**：
- 日志显示两个服务的名称
- 日志明确显示"分阶段模式"
- 分析使用 `analysis_service_id` 对应的服务

---

## 三、边界条件测试

### 3.1 特殊字符和输入验证

#### 测试用例 3.1.1：服务 ID 包含特殊字符
**输入**：
```json
{
  "id": "service with spaces!",
  "name": "测试"
}
```

**预期结果**：
- 允许创建（当前无限制）
- 或者：返回 400 错误（如果添加了 ID 格式验证）

---

#### 测试用例 3.1.2：空的 API Key
**输入**：
```json
{
  "id": "test",
  "api_key": ""
}
```

**预期结果**：
- 允许创建（当前无强制验证）
- 后续使用时会在 AI 调用时失败

---

### 3.2 并发和竞态条件

#### 测试用例 3.2.1：同时更新同一分组
**测试步骤**：
1. 两个请求同时 `PUT /api/source-groups/group-1`

**预期结果**：
- 两个请求都成功（当前无锁）
- 或：第二个请求失败（如果添加了乐观锁）

---

## 四、性能测试

### 4.1 大量服务测试

#### 测试用例 4.1.1：创建 100 个 AI 服务
**测试步骤**：
1. 循环创建 100 个服务
2. 测量 `get_all()` 的响应时间

**预期结果**：
- 所有服务成功创建
- `get_all()` 响应时间 < 100ms

---

### 4.2 配置文件大小测试

#### 测试用例 4.2.1：大型配置文件
**前置条件**：
- `ai_services.json` 包含 50 个服务
- 每个服务约 200 字节

**测试步骤**：
1. 启动 API 服务
2. 测量 `AIServiceManager.__init__()` 的时间

**预期结果**：
- 初始化时间 < 1 秒
- 所有服务正确加载

---

## 五、兼容性测试

### 5.1 向后兼容性

#### 测试用例 5.1.1：加载旧版配置文件
**前置条件**：
- `config/source_groups.json` 包含旧格式 `ai_config`

**测试步骤**：
1. 启动 API 服务
2. 调用 `GET /api/source-groups`

**预期结果**：
- 返回分组列表
- 旧格式分组的 `ai_config` 被转换为新格式
- `mode` 默认为 "two-stage"
- `analysis_service_id` 和 `aggregation_service_id` 为空字符串
- 后端日志显示警告

---

#### 测试用例 5.1.2：前端兼容旧格式数据
**前置条件**：
- 后端返回旧格式的分组数据（模拟）

**测试步骤**：
1. 前端接收到数据
2. 渲染分组编辑界面

**预期结果**：
- 界面正常显示
- 不会崩溃或报错
- `ai_config` 字段能够正确处理

---

## 六、回归测试

### 6.1 现有功能不受影响

#### 测试用例 6.1.1：数据源管理功能
**测试步骤**：
1. 创建 RSS 数据源
2. 更新数据源
3. 删除数据源

**预期结果**：
- 所有功能正常工作
- 不受 AI 服务架构变更影响

---

#### 测试用例 6.1.2：主题查看功能
**测试步骤**：
1. 调用 `GET /api/themes`

**预期结果**：
- 正常返回主题列表
- 不受配置结构变更影响

---

## 七、用户验收测试（UAT）

### 7.1 实际使用场景

#### 场景 1：首次配置新用户
**步骤**：
1. 安装新版本插件
2. 打开设置
3. 按照配置向导：
   - 先配置 AI 服务（1-2 个）
   - 再创建数据源分组
   - 选择 AI 模式和服务
4. 测试抓取功能

**验收标准**：
- 配置流程清晰
- 每个步骤都有明确的提示
- 最终能够成功抓取和分析数据

---

#### 场景 2：从旧版本升级的用户
**步骤**：
1. 备份旧配置
2. 升级到新版本
3. 启动 API 服务（观察日志）
4. 打开插件设置
5. 重新配置每个分组的 AI 服务

**验收标准**：
- 旧的 AI 配置自动迁移到服务列表
- 插件显示迁移提示
- 分组编辑界面能够正常选择服务
- 最终功能正常

---

#### 场景 3：切换 AI 模式
**步骤**：
1. 创建一个 single 模式的分组
2. 测试抓取
3. 编辑分组，切换为 two-stage 模式
4. 配置两个不同的服务
5. 再次测试抓取

**验收标准**：
- 模式切换后界面正确更新
- 保存成功
- 两次抓取都使用正确的服务

---

## 八、自动化测试脚本

### 8.1 Python 测试脚本

```python
import pytest
from trendradar.sources.ai_service_manager import AIServiceManager, AIService
from trendradar.sources.group_manager import AIConfig
import tempfile
import os

class TestAIServiceManager:
    def setup_method(self):
        """每个测试前创建临时配置文件"""
        self.temp_file = tempfile.NamedTemporaryFile(mode='w', delete=False, suffix='.json')
        self.temp_path = self.temp_file.name
        self.temp_file.close()
        self.manager = AIServiceManager(config_path=self.temp_path)

    def teardown_method(self):
        """清理临时文件"""
        if os.path.exists(self.temp_path):
            os.remove(self.temp_path)

    def test_create_service(self):
        """测试创建服务"""
        service = AIService(
            id="test-1",
            name="测试服务",
            provider="openai",
            api_key="sk-test",
            model_name="gpt-4o"
        )
        result = self.manager.add(service)
        assert result == True
        retrieved = self.manager.get("test-1")
        assert retrieved is not None
        assert retrieved.name == "测试服务"

    def test_duplicate_id(self):
        """测试重复 ID"""
        service1 = AIService(id="test-1", name="服务1", provider="openai", api_key="sk-1", model_name="gpt-4")
        service2 = AIService(id="test-1", name="服务2", provider="deepseek", api_key="sk-2", model_name="deepseek-chat")

        result1 = self.manager.add(service1)
        result2 = self.manager.add(service2)

        assert result1 == True
        assert result2 == False
        assert len(self.manager.get_all()) == 1

class TestAIConfig:
    def test_new_format_serialization(self):
        """测试新格式序列化"""
        config = AIConfig(
            mode="single",
            analysis_service_id="service-1",
            aggregation_service_id=""
        )
        data = config.to_dict()
        assert data["mode"] == "single"
        assert data["analysis_service_id"] == "service-1"
        assert data["aggregation_service_id"] == ""

    def test_old_format_deserialization(self):
        """测试旧格式反序列化"""
        data = {
            "provider": "openai",
            "api_key": "sk-test",
            "model_name": "gpt-4o"
        }
        # 应该打印警告并返回空配置
        config = AIConfig.from_dict(data)
        assert config.mode == "two-stage"  # 默认值
        assert config.analysis_service_id == ""
        assert config.aggregation_service_id == ""
```

---

### 8.2 API 测试脚本

```python
import pytest
from fastapi.testclient import TestClient
from api.main import app

client = TestClient(app)

def test_create_ai_service():
    """测试创建 AI 服务 API"""
    response = client.post("/api/ai-services", json={
        "id": "test-service",
        "name": "测试服务",
        "provider": "openai",
        "api_key": "sk-test",
        "model_name": "gpt-4o"
    })
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == "test-service"
    assert data["name"] == "测试服务"

def test_create_group_single_mode_validation():
    """测试 Single 模式验证"""
    # 先创建一个 AI 服务
    client.post("/api/ai-services", json={
        "id": "service-1",
        "name": "服务1",
        "provider": "openai",
        "api_key": "sk-1",
        "model_name": "gpt-4"
    })

    # Single 模式，缺少分析服务
    response = client.post("/api/source-groups", json={
        "id": "test-group",
        "name": "测试分组",
        "ai_config": {
            "mode": "single",
            "analysis_service_id": "",
            "aggregation_service_id": ""
        }
    })
    assert response.status_code == 400
    assert "Single mode requires analysis_service_id" in response.json()["detail"]

def test_create_group_two_stage_mode_validation():
    """测试 Two-stage 模式验证"""
    # 先创建一个 AI 服务
    client.post("/api/ai-services", json={
        "id": "service-1",
        "name": "服务1",
        "provider": "openai",
        "api_key": "sk-1",
        "model_name": "gpt-4"
    })

    # Two-stage 模式，缺少聚合服务
    response = client.post("/api/source-groups", json={
        "id": "test-group",
        "name": "测试分组",
        "ai_config": {
            "mode": "two-stage",
            "analysis_service_id": "service-1",
            "aggregation_service_id": ""
        }
    })
    assert response.status_code == 400
    assert "Two-stage mode requires both" in response.json()["detail"]
```

---

## 九、测试执行计划

### 阶段 1：开发阶段（当前）
- [ ] 单元测试（1.1 - 1.4）
- [ ] API 端点测试（1.4）

### 阶段 2：集成阶段
- [ ] 前后端数据流测试（2.1）
- [ ] 边界条件测试（3.1）

### 阶段 3：系统测试
- [ ] 端到端测试（2.2）
- [ ] 性能测试（4.1 - 4.2）
- [ ] 兼容性测试（5.1）

### 阶段 4：用户验收
- [ ] UAT 场景测试（7.1）
- [ ] 回归测试（6.1）

---

## 十、测试环境要求

### 软件环境
- Python 3.8+
- Node.js 16+
- Obsidian（测试插件）

### 依赖服务
- OpenAI API 或其他 AI 服务 API
- RSS Feed 源（用于测试数据抓取）

### 测试数据
- 预置的 `ai_services.json`
- 预置的 `source_groups.json`
- 测试用 RSS Feed URL

---

**文档版本**：1.0
**创建日期**：2026-01-11
**最后更新**：2026-01-11
