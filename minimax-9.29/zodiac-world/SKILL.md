---
name: zodiac-world
description: |
  十二生肖英语世界 — 单集视频制作全流程。输入一章小说文本，自动完成：
  章节分析 → 视频脚本拆解 → 角色立绘生成 → 关键帧图生成 →
  AI 配音 → 结尾儿歌生成 → 视频片段生成 → 最终合成。
  输出竖屏 9:16 的 30-60 秒儿童英语启蒙短视频（故事+儿歌混合模式）。
  触发词：十二生肖英语世界、zodiac world、生肖视频制作、
  和风森、Monkey 主角、制作一集、章节转视频、12 生肖英语。
trigger-words:
  - 十二生肖英语世界
  - zodiac world
  - 生肖视频
  - 和风森
  - 制作一集
  - 章节转视频
  - zodiac-world
  - 12生肖英语
  - 生肖英语世界
---

# 十二生肖英语世界 — 单集视频制作

输入一章小说文本，输出一集 30-60 秒竖屏短视频（9:16）。
故事+儿歌混合模式，3D 皮克斯风格，面向 3-8 岁儿童英语启蒙。

---

## 世界观

森林村庄**和风森**。12 个生肖动物各住一处，
日常串门、做饭、种花、聊天中自然学英语。
不是浮空岛，不是 RPG，不是魔法设定——是温暖的小村庄日常。

**Monkey 是叙事锚点**——每章都出现，孩子通过他的视角进入故事。
每章有一个焦点角色（Monkey 去拜访的朋友）。

第一季 10 章，前 5 章焦点角色依次：Rabbit → Tiger → Rat → Dragon → Pig。

---

## 角色视觉定义（3D 皮克斯风）

生成 character sheet 或关键帧时，以下英文描述作为 prompt 基础。
所有角色共享的 style tag: `3D Pixar/Disney style, adorable, child-friendly,
soft lighting, forest village setting, vertical 9:16`

### Monkey — 10 岁，淘气话多，叙事锚点

Golden-brown short fur, light beige face. Large round amber eyes,
bright and mischievous. Bright red adventure vest with one big pocket
(always stuffed with trinkets) + khaki shorts. One stubborn ahoge on
top that never stays down. Curly-tipped tail. Lean and agile build,
long limbs, often in jumping/climbing poses. Signature gesture: waving
one hand high above head to say hi.

### Rabbit — 8 岁，温柔胆小

Soft cream-white fluffy fur, cherry-blossom pink inside ears. Round
pale blue eyes, always with a hint of worry. Light blue apron dress
(cottage-garden style) with small floral pattern. A tiny daisy pinned
to one ear, always wearing gardening gloves. Petite and soft, puffy
round tail, ears perk straight up when startled. Signature gesture:
both paws held to chest, ears slightly drooping.

### Tiger — 12 岁，勇敢直率

Bright orange base with crisp black tiger stripes, creamy white belly.
Sharp emerald green eyes, full of confidence. Dark green zip-up sport
hoodie (zipper open) + black athletic pants. Silver whistle on a
lanyard around neck (captain badge), sneaker laces untied. Sturdy and
muscular, tallest and strongest of the five, upright posture. Signature
gesture: hands on hips, chin slightly raised.

### Rat — 9 岁，冷静机灵

Dark blue-grey fur, light grey belly, fur sleek and tidy. Narrow deep
purple eyes, always observing and thinking. Mustard-yellow turtleneck
sweater + brown suspender pants, a small notebook in pocket. Round
oversized glasses (often pushed up with one finger), thin flexible tail
that auto-curls around things. Short but well-proportioned, precise
movements with no wasted motion. Signature gesture: pushing glasses up
+ tilting head in thought.

### Dragon — 14 岁，温柔爱幻想，中国龙

Pearlescent mint-green scales with faint golden shimmer in light. Warm
amber-gold large eyes, vertical pupils but gentle expression. Two
backward-curving Chinese dragon horns (smooth jade-carved look, rounded
not sharp). Two long white whiskers from nose sides, floating softly
like silk ribbons. Fluffy white mane from crown to back of neck,
slightly floating. Eastern serpentine body but chibi-proportioned —
shortened torso, stubby limbs for walking upright, creamy white belly.
Rounded four-toed dragon claws with paw-pad feel. Long tail ending in
a tuft of mint-green fluffy fur (flame-shaped). White gauze shawl
draped over shoulders, fastened with a cloud-pattern jade clasp.
Special: blows colorful little cloud puffs from nose (not fire — soft
rainbow clouds). Signature gesture: gazing up at the sky, whiskers
drifting in the wind.

---

## 角色英语风格

对话生成时，每个角色的台词**必须**符合这些语言习惯。
如果生成的对话里所有角色说话一模一样——说明这条纪律没执行，必须重做。

| 角色 | 年龄 | 口头禅 / 句式特征 |
|------|------|-------------------|
| Monkey | 10 | Hey guys! Guess what? / Look! Wow! — 话多，爱打断 |
| Rabbit | 8 | Oh dear... I'm afraid / Are you okay? — 轻声细语，温柔胆小 |
| Tiger | 12 | Let's go! Follow me! / Move! — 短促有力，直率冲动 |
| Rat | 9 | Wait... I have a plan / Let me think — 话少但准，冷静精准 |
| Dragon | 14 | Imagine if... / Everything will be alright — 悠长诗意，温柔幻想 |

---

## 方案 A 视频结构（默认）

每集视频 30-60 秒，三段式：

| 时间段 | 内容 | 时长 |
|--------|------|------|
| 开场 | 场景铺垫，角色出场，引入小麻烦 | 0-10s |
| 主体 | 对话推进剧情，核心英语表达反复出现 | 10-40s |
| 收尾 | 角色合唱 15-20 秒短歌，歌词紧扣本章主题 | 40-60s |

**歌词在拿到小说内容后根据本章剧情另写**，不在小说阶段写歌。

---

## STEP 0: 检查资源

1. **章节文本**：用户提供小说章节文本（粘贴或文件）。没有则提示用户提供。
2. **本章角色**：从文本中识别出场角色列表。
3. **角色立绘**：检查项目目录下是否已有该角色的 character sheet 图片。
   - 已有 → 记录路径，STEP 3 跳过该角色的生成
   - 没有 → 标记需要在 STEP 3 生成
4. **章节编号**：确认这是第几章，对应焦点角色是谁。
5. **已有语音**：检查是否有之前章节保存的角色 voice_id。
   - 已有 → STEP 5 直接复用
   - 没有 → STEP 5 需要设计新语音

---

## STEP 1: 分析章节

从小说文本中提取视频制作所需信息：

1. **焦点角色**：本章 Monkey 拜访的朋友是谁
2. **核心英语表达**：本章教的关键句型（如 "May I come in?"）
3. **关键场景**：最适合做成 30-60 秒视频的情节片段
4. **情感弧线**：开场情绪 → 转折 → 结尾情绪
5. **环境设定**：发生在和风森的什么地方（谁的家 / 花园 / 林间小路）

输出一段章节分析摘要，供后续步骤使用。

---

## STEP 2: 编写视频脚本 + 歌词

### 视频脚本

按方案 A 结构拆分成 4-6 个镜头。**每个镜头 ≤ 15 秒**（视频生成单次上限）。

每个镜头包含：

| 字段 | 内容 |
|------|------|
| 镜头编号 | Shot 1, Shot 2, ... |
| 时间段 | 如 0:00-0:08 |
| 画面描述 | 场景、角色动作、表情、镜头运动（英文，供生图/生视频用） |
| 对话 | 角色台词（英文原文，**必须符合角色英语风格表**） |
| 核心表达 | 本镜头是否包含核心英语表达 |
| 情绪 | 角色情绪状态 |

**脚本纪律**：

- 对话必须符合角色英语风格表，不能所有角色说一样的话
- 核心英语表达至少出现 2-3 次（自然重复，不是机械复读）
- 每个镜头 ≤ 15 秒
- 最后 1-2 个镜头留给结尾儿歌段落

### 结尾歌词

根据本章核心表达和剧情写一首 15-20 秒的短歌（4-6 句）。
要求：简单押韵、重复核心表达、节奏适合 3-8 岁孩子跟唱。

### ⏸ 用户确认

展示完整脚本（镜头表）和歌词，等待用户确认或修改后再继续。

---

## STEP 3: 定装图（角色 + 场景，首次生成，后续复用）

角色和场景都需要定装，否则跨镜头一致性会崩。

**跳过条件**：本章所有出场角色的 character sheet 和场景定装图都已存在 → 跳到 STEP 4。

### 3a: 角色 character sheet

为每个缺少立绘的角色生成 **4 视图 character sheet**（2×2 grid: 正面 / 左侧 / 右侧 / 背面）：

- 风格：3D Pixar/Disney style, adorable, child-friendly
- **比例：1:1 方形**（保证四格等大，不要 9:16）
- prompt 基础：使用上方「角色视觉定义」中对应角色的英文描述
- 背景：纯白或浅色渐变，不要复杂场景
- 表情：中性友好，不带强烈情绪
- 姿势：标准站姿，不要动作 pose
- 要求：四个角度的服装、配饰、体型**必须完全一致**
- 模型推荐：`doubao-seedream-5-0-260128`（3D/character sheet 强项）

**已知问题**：4 视图中不同角度的服装细节（口袋位置、拉链等）可能不完全一致，
需要在用户确认时重点检查正面视图的衣服结构是否正确。

### 3b: 场景定装图（关键！容易遗漏）

为本章出现的主要场景生成**场景定装图**（无角色的纯环境图）：

- 比例：16:9 横屏（宽幅建立全景布局）
- 视角：略高 3/4 俯视，展示完整场景布局
- 内容：锁定场景中所有关键视觉元素（建筑外观、围栏样式、植物布局、道路、水体等）
- 不含任何角色——纯环境参考

**场景定装的元素必须逐条列出并锁定**，例如：
围栏类型（白色尖头木栅栏）、高度、门的设计、建筑风格（圆门茅草顶）、
花园布局（雏菊在前、石板路居中）、水体位置（溪流在左侧）等。

### 3c: 角色-场景比例定装图（防穿帮）

在场景中放入角色，**锁定角色与场景元素的高度比例关系**：

- 让角色站在关键道具旁（如围栏），手搭在道具上，明确高度对比
- 比例：9:16 竖屏（与最终视频一致）
- **必须传入角色 character sheet 作为参考**，确保衣服细节（口袋、配饰）一致
- 这张图是内部参考，不是交付物

**为什么必须做这一步**：
纯环境定装图没有角色参照，模型无法判断围栏/门/桌子相对于角色的高度。
实测中出现围栏在不同镜头高度从膝盖到超过头顶，一眼穿帮。
加入角色比例定装后，后续关键帧传入该图作为参考，高度一致性显著提升。

**一致性检查**：生成后对比 character sheet 正面图，确认衣服结构完全一致
（口袋位置、是否有物品露出、拉链/纽扣等细节）。不一致则以 character sheet 为准重做。

**生成后保存所有定装图路径，后续章节同场景直接复用。**

### ⏸ 用户确认

展示所有新生成的角色立绘和场景定装图。
用户确认后继续；不满意则根据反馈调整后重新生成。

---

## STEP 4: 关键帧图片

为 STEP 2 脚本中的每个镜头生成一张关键帧图片：

- 风格：3D Pixar style，与角色立绘一致
- 比例：9:16 竖屏
- 角色一致性：**必须**使用 STEP 3a 的 character sheet 作为角色参考图
- 场景一致性：**必须**使用 STEP 3b 的场景定装图 + STEP 3c 的比例定装图作为场景参考
- 画面内容：按 STEP 2 脚本中该镜头的画面描述生成
- 情绪表达：按脚本中标注的角色情绪状态调整表情和肢体语言
- 多用镜头切换，注重表情和场景细节的丰富度
- 长镜头倾向一镜到底的设计

**每张关键帧必须同时传入所有定装图作为参考**：角色 sheet + 场景定装 + 比例定装。
缺少任何一张都会导致跨镜头不一致（场景漂移或比例穿帮）。

**批量策略**：所有镜头的关键帧在一次任务中批量生成，不要逐个交替。

### ⏸ 用户确认

展示所有关键帧，标注对应镜头编号和时间段。
等待用户确认或指出需要调整的帧。

---

## STEP 5: 音频制作

两类音频并行制作：

### 5a: 角色对话配音

为每个角色分配不同的 AI 语音。如果有之前章节保存的 voice_id，直接复用。
如果是首次出场，按以下特征设计新语音并**保存 voice_id 供后续章节复用**：

| 角色 | 语音特征 |
|------|---------|
| Monkey | 活泼高亢的男孩声，语速偏快，情绪起伏大 |
| Rabbit | 柔软轻柔的女孩声，语速慢，带气声 |
| Tiger | 自信有力的男孩声，语速适中偏快，干脆利落 |
| Rat | 平稳沉着的男孩声，语速慢而精准，略带鼻音 |
| Dragon | 温暖空灵的少年声，语速慢，带梦幻感 |

按 STEP 2 脚本中的对话，逐角色生成配音音频 + 字幕时间戳文件。

### 5b: 结尾儿歌

使用 STEP 2 确认的歌词生成 15-20 秒儿歌音频：

- 风格：欢快、简单、适合幼儿
- 演唱：童声合唱感
- 节奏：中等偏慢，方便跟唱

### 无需暂停确认

音频效果不满意可在最终成片确认时反馈，后期替换，不阻塞流程。

---

## STEP 6: 视频片段生成

从每张关键帧生成视频片段（Image-to-Video）：

- 首帧：STEP 4 的关键帧图片
- 角色参考：STEP 3 的 character sheet（保持角色一致性）
- 时长：按 STEP 2 脚本中每个镜头标注的时间段
- 比例：9:16 竖屏
- 动作/运镜：按 STEP 2 脚本中该镜头的画面描述和镜头运动

**批量策略**：所有镜头的视频在一次任务中批量提交。

### ⏸ 用户确认

展示所有视频片段，标注对应镜头编号。
用户指出需要重新生成的片段，其余通过。

---

## STEP 7: 最终合成

将所有素材合成为一条完整视频：

1. **视频合并**：按镜头顺序拼接 STEP 6 的所有视频片段，加入平滑转场
2. **对话音轨**：将 STEP 5a 的配音按时间戳嵌入对应位置
   - 对话音量为主，其他音轨压低
3. **儿歌音轨**：将 STEP 5b 的儿歌嵌入最后 15-20 秒
4. **BGM**：可选添加轻柔背景音乐（极低音量，不抢对话和儿歌）
5. **字幕**：嵌入英文字幕（大号圆体字，适合儿童辨认）

**关键**：合成前去掉故事段落视频片段的原始音轨（如果有），
避免和配音叠声。儿歌段落同理——只保留 STEP 5b 的儿歌音频。

### ⏸ 用户确认

展示最终成品视频，汇报：

- 实际总时长 vs 计划时长
- 如对配音或儿歌不满意，可提供替换音频，重新合成即可

---

## 避坑记录

以下方向已验证不可行，**不要尝试**：

| 类别 | 避坑项 |
|------|--------|
| 世界观 | 浮空语岛、影怪、言出法随、魔法设定、RPG 打怪、秘宝 |
| 角色 | 一次规划 12 个角色全出场（信息过载） |
| 小说 | 一个字段塞超过 3 个角色（必截断） |
| 对话 | 没写明角色英语风格就生成（所有角色说话一模一样） |
| 歌词 | 小说阶段写歌词（歌词属于视频层，看完剧情再写） |
| 视频 | 单个镜头超过 15 秒（生成质量断崖式下降） |
| 场景一致性 | 只做角色定装不做场景定装（围栏/建筑/花园每张都不一样） |
| 比例穿帮 | 场景定装图中不含角色（模型无法判断道具相对角色的高度，围栏忽高忽低） |
| character sheet | 用 9:16 竖屏做 4 视图（四格大小不等，应使用 1:1 方形） |
| character sheet | 不检查正面衣服结构（口袋可能挡住拉链等结构错误） |
| 关键帧 | 生成关键帧时只传角色 sheet 不传场景定装（场景每张都变） |
| 比例定装 | 比例定装图中角色衣服和 character sheet 不一致（口袋有无工具等细节漂移），必须以 sheet 为准检查 |

---

## 分季规划

| 季 | 章节 | 角色范围 | 主题 |
|----|------|---------|------|
| 第一季 | 10 章 | 5 个核心角色 | 森林日常 |
| 第二季 | 待定 | 引入剩余 7 个生肖 | 待定 |
| 后续 | 根据数据决定 | — | — |
