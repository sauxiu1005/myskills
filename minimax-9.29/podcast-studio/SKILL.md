---
name: podcast-studio
description: |
  把书面内容改写成播客脚本，附带朗读时长、音乐 cue、音效点和制作备注。输入是任意长文（文章、博客、专栏、简报），输出是一份结构化 markdown 脚本，制作人可以直接交给声优和音频工程师执行。
  当用户想把文章转播客、给节目稿件加音乐 cue、围绕 Tone.js 或 Howler.js 规划片头片尾音乐，或给口播稿设计声音铺底时触发。
trigger-words: [podcast script, article to podcast, podcast production, show notes, music cues, sound design, Tone.js, Howler.js, 播客脚本, 播客制作, 文章转播客, 音乐 cue, 声音设计]
allowed-tools: [question, hub_read, hub_write, hub_save_file_to_session]
---

# Podcast Studio

把书面内容转成可直接进棚的播客脚本。处理旁白节奏、音乐 cue、音效点、制作备注，声优和音频工程师拿到就能开录。

以资深播客制作人身份工作。假设交付栈是浏览器端：`Tone.js` 负责合成音乐 bed 和转场，`Howler.js` 负责触发离散 SFX 和循环环境音。

## 工作流

### Step 1：加载原文素材

- 用户在对话里直接粘了正文，就用粘贴的内容。
- 用户引用 session workspace 里的文件，用 `hub_read` 传入文件路径加载全文。
- 已经在 workspace 的内容不要再让用户粘一遍。

### Step 2：收集缺失的制作参数

只有推不出来的决策才 call `question`，其他用合理默认值。

- question："这期播客目标时长？"，options：["5 分钟", "10 分钟", "15 分钟", "20-30 分钟"]
- question："要几个 sponsor / 广告位？"，options：["0", "1", "2"]
- question："声调 / 语域？"，options：["Casual 对话感", "Documentary 叙事", "News 简报", "Interview 访谈"]

用户在初始请求里已经说过的问题一律跳过。

### Step 3：切段并应用脚本结构

把文章按下面顺序拆段，每段按 ~150 words / min 估算朗读时长：

1. Cold open（0:00 - 0:30）— 钩子句，无音乐
2. Intro（0:30 - 1:00）— Tone.js 主题音乐 bed 进
3. Chapters（正文主体，占总时长 60-80%）— 拆 2-5 章，每章带音乐 bed 指令 + 场景切换 SFX cue
4. Sponsor breaks（如有）— 章节间插入，打 "AD BREAK 1"、"AD BREAK 2" 标签
5. Outro（最后 0:45）— 落点句，Tone.js 音乐 bed 淡出

每段附：音乐 bed 指令（Tone.js 合成音色、调、tempo）、SFX cue（Howler.js 触发名 + 时间码）、声优交付备注。

### Step 4：编排 markdown 脚本

按下面格式写完整播客脚本：

```markdown
# Podcast Episode Script

**Title**: {从原文推导}
**Runtime**: {总分钟}
**Generated**: {timestamp}

---

## Cold Open (0:00 - 0:30)

**VO**: "..."
**Music**: 无
**SFX**: 无

## Intro (0:30 - 1:00)

**VO**: "..."
**Music**: [Tone.js — bed 音色、调、tempo、fade 时长]
**SFX**: [Howler.js — 触发名 @ 时间码]

## Chapter 1: {名称} (1:00 - X:XX)
...

## AD BREAK 1 (X:XX)
[30s 位 — 交接点]

## Chapter 2: {名称} (X:XX - X:XX)
...

## Outro (X:XX - end)

**VO**: "..."
**Music**: [Tone.js — 尾部 15s 淡出]

---

## Cue Sheet Summary

| 时间码 | Cue | 类型 | 备注 |
|---|---|---|---|
| 0:30 | Intro bed in | Tone.js music | ... |
| ... | ... | ... | ... |
```

然后 call `hub_write`，传文件路径（如 `podcast-{slug}.md`）和上面完整 markdown。

### Step 5：注册交付物

Call `hub_save_file_to_session`：
- file：Step 4 的 markdown 脚本路径
- file_type：`text`

这样制作人从工作区 files 面板就能拉到，交给声优和音频工程师。

## Hub 适配说明

- 产出是纯文本制作文档；本 skill 不合成音频。若用户要成品口播，交给独立的 TTS 步骤。
- 原文太长时用 `hub_read` 从 session 工作区加载，不要让用户整段粘贴。
- 用 `hub_write` 落最终 markdown 脚本，再通过 `hub_save_file_to_session`（`file_type: text`）注册到 session，工作区 files 面板可拉到。
- 音乐 cue 假设浏览器端播放器（Tone.js / Howler.js）由消费方提供；本 skill 只出 cue 表，不跑音频引擎。
- 尽量少用 `question` — 直接给合理默认值（段数、时长、广告位数），让用户按需覆盖。
