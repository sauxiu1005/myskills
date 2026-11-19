---
name: subtitle-correction
description: |
  修正语音识别生成的字幕文件（`.srt`）里的错误，严格保留时间轴信息和字幕编号。会先问用户领域术语（框架、品牌、专业词），然后按该领域调优做模式感知的修正——中文谐音混淆、专业术语误识、中英文混排、代码标识符拼写等。附带 `subtitle_tool.py` 校验器 + diff 报告生成器供 review。
  当用户上传 `.srt` 文件、要求「修正字幕」「校对字幕」「fix subtitles」「proofread subtitles」时触发，尤其是编程教程、AI/ML 课程、或任何带专业术语的内容。
---

# 字幕修正

修正字幕文件里的语音识别错误，严格保留时间轴信息。

## 交互工作流

### Step 1：向用户索取术语

**重要**：开始修正前**始终**先向用户索取领域术语。

用以下 prompt 问用户：

```
在开始修正之前，请提供一些关键术语，帮助我更准确地识别和修正语音识别错误：

1. **专有名词**：人名、品牌名、产品名等（如：Anthropic、Claude）
2. **技术术语**：框架、库、工具名称（如：LangChain、OpenAI、PyTorch）
3. **领域词汇**：行业特定词汇（如：checkpointer、middleware、runtime）
4. **其他关键词**：视频中频繁出现的重要词汇

请用逗号分隔，例如：`LangChain, Agent, OpenAI, checkpointer`
```

英文用户版：

```
Before I begin correction, please provide key terms to help me accurately identify speech recognition errors:

1. **Proper nouns**: Names, brands, products (e.g., Anthropic, Claude)
2. **Technical terms**: Frameworks, libraries, tools (e.g., LangChain, PyTorch)
3. **Domain vocabulary**: Industry-specific terms (e.g., checkpointer, middleware)
4. **Other keywords**: Important words that appear frequently

Please separate with commas, e.g.: `LangChain, Agent, OpenAI, checkpointer`
```

### Step 2：确认理解

收到术语后确认：

1. 列出收到的术语
2. 识别可能的领域/上下文（AI/ML 教程、web dev 等）
3. 问是否还有补充再开工

示例回复：

```
收到以下术语：
- 技术框架：LangChain, LangGraph, OpenAI
- 技术概念：Agent, checkpointer, runtime

看起来这是一个 LangChain 智能体开发的教程视频。

还有其他需要补充的术语吗？如果没有，我将开始修正字幕。
```

### Step 3：带术语处理

用提供的术语：

1. 建立期望词汇的心智模型
2. 识别可能的语音识别错误
3. 全篇一致地应用修正

### 用户不提供术语时

用户说"没有" / "no" / "直接开始"：

1. 用内置模式继续修正
2. 不确定的修正标出让用户 review
3. 完成后问漏了哪些术语

## 核心流程

1. **读字幕文件** — 加载用户提供的 `.srt`
2. **识别错误模式** — 识别常见的语音识别错误
3. **应用修正** — 修错，但严格保留时间戳
4. **输出修正版** — 按用户上下文返回或保存

## 严格规则

### 时间轴保留

- **绝不改时间戳** — `00:00:00,000 --> 00:00:00,000` 行保持原样
- **绝不改字幕编号** — 保留序号
- **绝不合并或拆分字幕条目** — 一对一对应

### 错误类别

#### 1. 谐音错误（同音字/谐音错误）

中文语音识别常见：

- 会话 ↔ 绘画 (huìhuà)
- 元数据 ↔ 源数据 (yuán shùjù)
- 本课 ↔ 本科 (běnkè)
- 示例 ↔ 事例 (shìlì)
- 实践 ↔ 时间 (shíjiàn)

#### 2. 专业术语错误

语音识别常在以下失效：

- 框架名：LangChain、LangGraph、OpenAI、PyTorch、TensorFlow
- 编程术语：API、SDK、runtime、checkpointer、middleware
- 代码标识符：snake_case 名字、函数名、类名

#### 3. 中英混排

- Luncheon/lunch → langchain
- open EI/open Email → OpenAI
- land GRAPH → langgraph
- a memory Server → MemorySaver

#### 4. 代码相关术语

把口头描述转成正确格式：

- "underscore" → 变量名里的 "_"
- "dot" → 方法调用里的 "."
- 识别 camelCase、snake_case、PascalCase 模式

## 用户提供的术语

用户给术语列表时把它作为修正的主参考：

```
用户提供的术语：LangChain,Agent,OpenAI,LangGraph
```

这些术语暗示：

- 专业术语的正确拼写
- 内容领域的上下文
- 识别语音识别错误的线索

## 处理策略

### 长文件（>200 行）

1. 用 `view_range` 分块处理
2. 跨块维持上下文
3. 增量构建完整修正版

### 技术内容

1. 识别领域（AI/ML、web dev 等）
2. 建立期望术语的心智模型
3. 一致地应用领域特定修正

### 质量检查

输出前：

- 验证所有时间戳未改
- 验证字幕数量未改
- 检查全篇术语一致
- 确保无孤立修正（半吊子修改）

## 常见修正模式

### 中文 AI/ML 课程内容

| 错误 | 修正 | 上下文 |
|---|---|---|
| 蓝犬/蓝卷/Lantern | LangChain | 框架名 |
| 绘画 | 会话 | Session/对话 |
| 拖/tour | tool | 工具概念 |
| checkpoint 组件 | checkpointer 组件 | 记忆组件 |
| 源数据 | 元数据 | Metadata |
| 大约模型 | 大模型 | 大模型 |
| 中间键 | 中间件 | Middleware |

### 代码标识符

| 口头 | 书面 |
|---|---|
| user underscore 001 | user_001 |
| thread underscore id | thread_id |
| create underscore agent | create_agent |
| runtime dot state | runtime.state |

## 输出格式

保存时用 `-corrected` 后缀：

- 输入：`filename.srt`
- 输出：`filename-corrected.srt`

## 校验脚本

用 `scripts/subtitle_tool.py` 校验和分析字幕：

```bash
# 校验修正版保留了结构
python scripts/subtitle_tool.py validate original.srt corrected.srt

# 展示字级 diff 带彩色（默认，只显示变化）
python scripts/subtitle_tool.py diff original.srt corrected.srt

# 展示所有条目（变化和未变化）
python scripts/subtitle_tool.py diff original.srt corrected.srt --all

# 生成 HTML diff 报告（推荐 review 用）
python scripts/subtitle_tool.py diff original.srt corrected.srt --html report.html

# 简单行级 diff
python scripts/subtitle_tool.py diff original.srt corrected.srt --simple

# 关闭彩色（用于管道到文件）
python scripts/subtitle_tool.py diff original.srt corrected.srt --no-color

# 分析文件识别潜在的语音识别错误
python scripts/subtitle_tool.py analyze input.srt --terms "LangChain,OpenAI"
```

### Diff 输出格式

#### 终端输出（默认）

字级变化带颜色：

```
[1] 00:00:01,500 --> 00:00:04,500
  今天我们来学习[-Luncheon-]{+LangChain+}框架

[3] 00:00:08,000 --> 00:00:12,500
  我们可以用它来创建[-绘画-]{+会话+}应用程序
```

- `[-deleted-]` — 删除文字（终端红色）
- `{+added+}` — 新增文字（终端绿色）
- 用 `--all` 显示未变化条目

#### HTML 报告（推荐 review）

生成完整对比报告：

- **所有条目**显示（变化和未变化）
- **并排列**：原文 | 修正版 | Diff 视图
- **视觉高亮**：删除红色删除线，新增绿色
- **汇总统计**：条目总数、变化数、未变化数
- **跳转链接**：快速定位变化条目
- **变化指示**：黄点标记变化行

```bash
python scripts/subtitle_tool.py diff original.srt corrected.srt --html diff_report.html
```

然后浏览器打开 `diff_report.html`。

### 校验流程

1. **修正前**：跑 `analyze` 识别潜在错误
2. **修正后**：跑 `validate` 确保结构完整
3. **review 变化**：跑 `diff --html report.html` 生成可视化对比

### 校验检查

- 条目数与原文一致
- 所有时间戳未改
- 所有序号保留
- 无格式损坏

## 示例交互

### 交互 1：用户不带术语上传

**用户**：帮我修正这个字幕文件

**Claude**：

```
在开始修正之前，请提供一些关键术语，帮助我更准确地识别语音识别错误：

1. **专有名词**：人名、品牌名、产品名
2. **技术术语**：框架、库、工具名称
3. **领域词汇**：行业特定词汇
4. **其他关键词**：视频中频繁出现的重要词汇

请用逗号分隔，例如：`LangChain, Agent, OpenAI`
```

**用户**：LangChain, Agent, OpenAI, LangGraph, checkpointer

**Claude**：

```
收到以下术语：
- 技术框架：LangChain, LangGraph, OpenAI
- 技术概念：Agent, checkpointer

这是一个 LangChain 相关的技术教程。还有补充吗？
```

**用户**：没有了，开始吧

**Claude**：[进入修正流程]

### 交互 2：用户先给术语

**用户**：帮我修正字幕，术语：LangChain, OpenAI, Agent

**Claude**：[确认术语后直接开工]

### 修正流程

1. 读上传的 `.srt` 文件
2. 跑 `analyze` 识别潜在错误
3. 用提供术语作主参考应用修正
4. 跑 `validate` 确认结构完整
5. 用 `-corrected` 后缀保存修正版
6. 生成 diff 报告 + 呈现修改汇总
7. **提供 HTML 报告**：问用户要不要 HTML diff 报告方便 review

**输出**：分类呈现修正汇总。

**完成后追问**：

```
修正完成！我可以生成一个 HTML 差异报告，方便您在浏览器中查看所有修改。
需要生成 HTML 报告吗？

Correction complete! I can generate an HTML diff report for easier review in your browser.
Would you like me to generate the HTML report?
```
