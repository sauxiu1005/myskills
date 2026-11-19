---
name: voiceover-direction
description: |
  指导配音演员交付符合品牌视觉的表演——从写 VO brief、写"可念"的脚本，到给对的声音选型、现场跑 session、事后给可执行的补录反馈。输入是一个项目（SaaS 解说、广告、e-learning、有声书、TVC）加品牌与受众上下文；输出是 VO brief、经可念性校验的脚本、选角标准、以"意图"而非"抑扬"驱动的现场导演笔记，以及结构化的补录反馈笔记。
  当用户想要招募并 brief 配音演员、给现场 session 做准备、既不冒犯演员又想扭转"念得像广告"的表演、为品牌选对声音、把不好念的脚本改到自然，或者给一条已交付的读法写清晰补录笔记时触发。
trigger-words: [配音, 配音导演, VO brief, 配音脚本, 补录反馈, 选角, voiceover, voice direction, VO brief, speakable script, casting voice, pickup notes, voice talent]
allowed-tools: [question, hub_read, hub_write, hub_save_file_to_session, hub_audio_generation]
---

# 配音导演

> 掌握指导配音演员的艺术，交付符合品牌视觉的表演 —— 故事优先，"意图"胜过"抑扬"。

**核心原则：** 配音演员不是"读稿的"—— 他们是**演员**。你的工作是给他们**情感语境**，不是"line reading"。告诉他们**为什么**这样说，而不是**怎么**说。

## 工作流

### Step 1：拉现有品牌与脚本上下文

任何提问之前，先尝试 `hub_read` 以下 workspace 路径（没有就静默跳过）：

- `.agents/brand-voice.md` / `.claude/brand-voice.md` —— 品牌人格参考
- 用户提到的任何脚本路径（例如 `scripts/explainer-v3.md`）
- 用户要迭代的先前 VO brief

读到什么就拿去预填 Step 2。

### Step 2：一次性收集 brief 输入（一个 `question` 打包问完）

发一次 `question`，覆盖：

1. **交付物** —— 完整 VO brief / 脚本可念性改写 / session 导演笔记 / 已交付 take 的补录笔记
2. **项目格式** —— explainer / commercial / e-learning / audiobook / ad / 其它
3. **时长 & 目标字数**（~150 WPM）
4. **品牌人格** —— 3-5 个形容词
5. **目标受众** —— 是谁 + 听到时的情绪状态
6. **声音规格** —— 性别偏好 / 音域年龄 / 口音 / tone / 节奏 / 能量 1-10
7. **Sound-alike 参考** —— 2-3 条链接
8. **Anti-references** —— 一定不能像什么
9. **要不要 TTS 试听参考？** —— yes/no（决定 Step 5）

没答齐之前不推进。

### Step 3：按领域规则拟交付物

严格套用下述规则。

#### VO brief 模板（交付物 = 完整 brief）

```
## Voiceover Brief

### Project Overview
Project name: ...
Format: [Explainer / Commercial / E-learning / Audiobook / ...]
Duration: [runtime]
Usage: [使用场景与授权范围]

### Brand Context
Company: ...
Brand personality: [3-5 adjectives]
Sound-alike references: [links]
Avoid sounding like: [anti-references]

### Target Audience
Who: [demographics + psychographics]
Emotional state: [busy / relaxed / stressed / skeptical]

### Voice Specifications
Gender preference: ...
Vocal age range: ...
Accent: ...
Tone: [warm / authoritative / playful / urgent / ...]
Pace: [conversational / quick / measured]
Energy level: [1-10]

### Practical Details
Script word count: ...
Estimated read time: [÷ 150 WPM]
Deadline / Budget / 修订轮次
```

#### 脚本可念性规则（交付物 = 脚本改写）

- 短句（≤ 15 词）
- 一句一 idea
- 自然连读（don't、won't、it's）
- 难词加音标括号
- 数字写成词（three million，不是 3,000,000）
- 缩写加发音指南
- 行内加 tone shift 括号与 `[PAUSE]` marker
- 加 10-15% 时长 buffer
- 定稿前朗读 3 次

#### Session 导演笔记（交付物 = 导演速查）

框架：**"意图"，不是"抑扬"。**

DO：
- "This person just solved a problem that's been bugging them for months"
- "You're sharing a secret with your best friend"
- "This is the moment they've been waiting to hear"

DON'T：
- "Make it go UP at the end"
- "Emphasize THIS word"
- "Slower on that part"

常见调整：
- 太广告腔 → "Throw it away more. Like you're just telling me."
- 太平 → "What's exciting about this for you?"
- 用力过猛 → "Let the words do the work."
- 节奏错 → "Take your time. The viewer isn't going anywhere."

#### 补录笔记（交付物 = 已交付 take 的反馈）

每条：**时间戳 / 当前问题 / 期望改动 / 为什么（故事原因）**。

Bad："Line 3 doesn't sound right"
Good："Line 3（'We're different'）—— 现在听起来像在辩护。试更笃定的读法，像陈述一个大家都已经承认的事实。"

### Step 4：落盘前确认

呈现：
- 文件名（例如 `vo-brief-projectflow.md`、`script-speakable-v2.md`）
- 字数 / 行数
- 哪些是从上下文拉的、哪些是新写的

等用户 yes。

### Step 5：save + register

对每个交付物：

1. 调 `hub_write`：
   - `file_path`：workspace 相对 slug（例如 `voiceover/2026-07-03/vo-brief.md`）
   - `content`：完整 Markdown
2. 调 `hub_save_file_to_session`：
   - `file`：同一路径
   - `file_type`：`text`

### Step 6：（可选）TTS 试听参考

只在 Step 2 回答 yes 时执行：

1. 从可念脚本里挑 20-40 秒代表性片段
2. 调 `hub_audio_generation`：
   - `vendor`：按声音规格选（英文默认 `moss-audio`；用户可指定）
   - `voice_id`：按 Step 2 的性别 / 年龄 / tone 从 vendor voice 目录里挑（例如"暖调 30 代英文女声" → 匹配的 voice_id）
   - `text`：片段（必须已按 Step 3 可念性规则清洗）
3. 调 `hub_save_file_to_session`：
   - `file`：返回的 `.wav` / `.mp3` 路径
   - `file_type`：`audio`
4. 告诉用户这只是 **tone / pace 的参考**——真人配音（或付费 TTS）还得单独出。

## 招募真人演员

如果用户是在 audition 真人（交付物 = brief + audition instructions），在 brief 里加：

```
## Audition Instructions
Record the following in TWO different reads:

Read 1: [主方向 —— 例如 "warm and conversational, like explaining to a friend"]
Read 2: [替代方向 —— 例如 "slightly more authoritative, like a trusted advisor"]

Selected excerpt:
[30-60 秒代表性文本]

Technical:
- WAV 或 AIFF, 44.1kHz, 16-bit 起
- 干录（无效果）
- 结尾附 3 秒干净 room tone
```

选角评估维度（写进 brief，方便打分）：
- **声学**：音高 / 共鸣 / 质感 / presence
- **表演**：warmth / authority / energy / authenticity 量表
- **品牌契合**：这个声音听起来像品牌吗？受众会信吗？跟竞品有区分度吗？

## Session 导演速查

降能量："Throw it away" / "Just say it" / "Less is more here"
加暖度："Like you're sharing a secret" / "Smile as you say it" / "Talk to one person"
拉权威感："State it as fact" / "You know this to be true"
调节奏："Land on that word" / "Take a breath there" / "Let that sink in"
求自然："Tell me in your own words" / "Forget the script" / "What's exciting about this to you?"

## Skill 边界

擅长：搭 VO 生产工作流、技术指导、质量 checklist、导演话术。
做不了：替代音频工程、混音母带、主观创作决策、保证商业成功。

## Hub 适配说明

- 所有文本交付物（VO brief、可念脚本、导演笔记、补录笔记）都是 Markdown —— 用 `hub_write` 落盘、`hub_save_file_to_session`（`file_type: text`）注册。
- `hub_read` 是第一个调用的工具 —— 拉 brand-voice 文件与已有脚本，让 `question` 跳过已答字段。
- `question` 一次问齐所有字段，不来回追问。
- TTS 试听是可选、由 Step 2 答案决定 —— 触发时 `hub_audio_generation` 出一段短参考、`hub_save_file_to_session`（`file_type: audio`）注册 `.wav`/`.mp3`。
- 本 skill 指导真人或 TTS 演员 —— 不做音频工程、母带或混音。
