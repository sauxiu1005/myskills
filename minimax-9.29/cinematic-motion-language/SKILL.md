---
name: cinematic-motion-language
description: |
  为高精度电影级视频生成打造的结构化 prompt 词汇系统。用"相机契约"、运动物理锚点、空间分区、镜头/对焦行为序列、以及"负空间即构图工具"五大支柱取代模糊形容词。输入是一份电影 brief;输出是一段严谨的 prompt 块,包含硬规则式的相机行为、时间锚定的运动速度、逐区域的空间规则、以及在负向 prompt 里重复强化的约束。
  在写任何需要精确控制运动、氛围、景深或构图的视频 prompt 之前使用——氛围镜头、产品揭幕、人物戏、抽象运动、神圣视觉,任何"用模糊语言就会失控"的 brief。
trigger-words: [cinematic motion language, motion language, camera contract, motion physics, spatial zoning, negative space, precision video prompt, 电影运动语言, 相机契约, cinematic prompt vocabulary]
allowed-tools: [question, hub_read_media, hub_generate_video, hub_save_file_to_session]
---

# 电影运动语言

高精度电影级视频 prompt 的五支柱词汇系统。

**核心原则:** 模型理解物理、几何、序列、约束,不理解形容词。把每一个模糊描述都换成物理类比、空间坐标、时间序列、或硬规则。

## 工作流

### Step 1: 收集 brief 输入
提前调用 `question`(尽量批量):
- 画幅比:21:9 / 16:9 / 9:16
- 时长:X 秒
- 单句叙事:"发生什么"一句话
- 单句风格 & 氛围:视觉基调 + 氛围
- 目标模型(Seedance 2.0 / Kling 3.0 / Wan 等)

这些是核心承载信息——留空 = 模型即兴发挥,直接破坏 skill 价值。

### Step 2: 读取参考素材
用户附了参考帧、分镜板或情绪板时,对每个附件调用 `hub_read_media`。这样空间分区规则能命名到**实际构图的真实区域**(例如"这张参考图的左上角暗部三分之一"),而不是抽象。

### Step 3: 应用五支柱填模板
每条支柱按下面规则把模糊想法转成硬规则:

**支柱 1 — 相机契约:** 描述其他任何东西之前,先把相机行为定死为硬规则。例:`"Static locked-off camera. Zero movement."` / `"Slow push-in only — 10% scale change over the full duration."` / `"Single handheld drift, slight organic sway, no cuts."`

**支柱 2 — 运动物理锚点:** 每个运动元素给一个物理类比 + 时间锚定测量。绝不单独用 "slow" 或 "fast"。例:`"like dust suspended in honey"` + `"one full revolution across the entire 10-second clip"`。

**支柱 3 — 空间分区:** 把画面切成有名字的区域,每个区域给明确规则。负向 prompt 里交叉引用。例:`"Left third: pure black, no light, no particles."`

**支柱 4 — 镜头行为序列:** 把对焦写成 trigger → shift → state → return → repeat 的因果链。别把 DOF 描述成静态。

**支柱 5 — 负空间:** 给空区域命名成刻意构图。再在负向 prompt 强化:`"no particles on the left side, no light on the left side, no movement on the left side."`

### Step 4: 逐字段填 Prompt 模板(每个字段必填)

```
CAMERA: [static / push / drift / handheld — state as a hard rule]
ASPECT RATIO: [21:9 / 16:9 / 9:16]
DURATION: [X seconds]

Style & Mood: [visual register + atmosphere in one line]

Narrative: [one sentence — what happens]

Action:
- Subject: [who/what, position in frame, emotional state]
- Motion: [speed anchor — physical analogy + time measurement]
- Secondary motion: [particles / fabric / smoke — own speed anchor]

Lens:
- Focal feel: [wide / normal / telephoto character]
- Focus event: [cause → shift → state → return → repeat count]
- DoF: [shallow / deep / breathing]

Lighting: [source count, direction, quality, color temperature]

Spatial Zones:
- [region]: [rule]
- [region]: [rule]
- [region]: [rule]

Audio: [sound texture description — not music genre]

Quality suffixes: [photoreal, film grain, anamorphic, 8K detail, etc.]

Negative Prompt: [camera moves, spatial violations, style rejections, motion violations]
```

每个字段都必须给值。填完的模板放在 fenced markdown code block 里。

### Step 5: 生成前确认
调用 `question`:
- question: "确定要在 <Step 1 模型> 上生成吗?强化后的 negative prompt 会独立传字段,不会内联到正向 prompt 里。"
- options: ["立即生成", "先精修 prompt", "只出 prompt,取消生成"]

默认只出 prompt。不经明确批准不消耗 credit。

### Step 6: 生成(仅当 Step 5 批准)
调用 `hub_generate_video`:
- vendor / model: `<Step 1 选定模型>`
- prompt: `<Step 4 填完的模板,不含 Negative Prompt 那一行>`
- negative_prompt: `<Negative Prompt 那一行作为独立字段>`(绝不塞进正向 prompt 当注释)
- duration_sec: `<Step 1 时长>`
- aspect_ratio: `<Step 1 画幅比>`
- medias: `[]`,除非用户提供了参考帧

### Step 7: 注册产物
调用 `hub_save_file_to_session`:
- file: `<返回的 .mp4 路径>`
- file_type: `video`

---

## 五大支柱详细参考

### 1. 相机契约(Camera Contract)

描述其他任何东西之前,先把相机行为定成硬规则。模型会把相机当作一个角色对待——你不定义它,它就会即兴发挥。

例子:
- "Static locked-off camera. Zero movement. No pan, no zoom, no dolly, no shake."
- "Slow push-in only — 10% scale change over the full duration."
- "Single handheld drift, slight organic sway, no cuts."

相机规则要在**负向 prompt** 里再强化一次。

### 2. 运动物理锚点(Motion Physics Anchor)

给每个运动元素一个来自物理世界的**速度参考**。物理类比 + 时间锚定测量,精度最高。

速度类比例子:
- "like dust suspended in honey"
- "like embers floating in still air"
- "like smoke through a cathedral at dawn"
- "like the surface of a lake disturbed by a single drop"

时间锚定测量:
- "one full revolution across the entire 10-second clip"
- "roughly 6 degrees per second"
- "the pace of a clock's hour hand — imperceptibly slow"
- "travels the full arc in 8 seconds with no pause"

永远不要单独用 "slow"、"fast"、"gentle"、"subtle"。

### 3. 空间分区(Spatial Zoning)

把画面切成有名字的区域,每个区域给明确规则。

区域命名惯例:
- "Left third / center third / right third"
- "Foreground plane / midground / background"
- "Upper half / lower half"
- "Right two-thirds / left void"

区域规则例子:
- "Left third: pure black, no light, no particles, no movement."
- "Right two-thirds: all action contained here."
- "Foreground plane: particle layer only — no subject."

空间分区也要在**负向 prompt** 里交叉引用一次。

### 4. 镜头行为序列(Lens Behavior Sequence)

把对焦和景深描述成有起承转合的叙事事件。

结构:**trigger → shift → state → return → repeat**

例子:
"Focus opens on the subject. As the foreground element crosses the lens plane, focus shifts onto it — the subject softens into warm bokeh. The element drifts past. Focus breathes back to the subject. This cycle repeats organically 2–3 times."

关键词汇:shallow depth of field / focus-breathing / rack focus / bokeh silhouette / lens plane crossing / anamorphic lens rendering。

### 5. 负空间即构图工具(Negative Space)

给画面里空的区域命名成**刻意的设计决策**。

例子:
- "Sacred emptiness — the left third is a deliberate compositional weight."
- "The darkness is active, not background."
- "Void occupies the left two-thirds — no fill, no ambient spill, no movement."

负向 prompt 强化:`"particles on the left side, light on the left side, movement on the left side"`

---

## 关键词汇参考

### 相机
static locked-off / handheld drift / slow push-in / crane reveal / whip pan / zero movement / no reframe / locked composition

### 运动速度
suspended in honey / floating in still air / cathedral smoke / hour-hand pace / imperceptibly slow / continuous fluid arc / no acceleration / no stillness

### 粒子行为
three-dimensional spiral / orbiting / foreground crossing / contained within zone / rising and descending in soft arcs / catching directional light

### 镜头 / 对焦
shallow depth of field / focus-breathing / rack focus / bokeh silhouette / lens plane crossing / anamorphic rendering / focus returns organically

### 灯光
single key light / directional warm / chiaroscuro / golden-amber / deep shadow / no fill / no ambient spill / upper right source / rim light / backlight halo

### 负空间
sacred emptiness / pure black void / no light bleed / no particles / no movement / deliberate compositional weight / active darkness

---

## 实例:旋转托钵僧镜头(Dervish Shot)

**Brief:** 旋转的托钵僧,高举的手和前臂特写,金色尘埃粒子,左三分之一纯黑,神圣苏菲氛围。

**相机:** Static locked-off. Zero movement. No pan, no zoom, no dolly.

**运动锚点:** 手在 10 秒内完成一整个 Sama 旋转的弧线——时钟时针的速度。粒子像静止空气中的余烬一样运动。

**镜头事件:** 前景粒子跨过镜头平面 → 对焦转到粒子(锐利、发光) → 手软化为暖色 bokeh → 粒子飘过 → 对焦回到手上。整个循环有机地重复 2–3 次。

**空间分区:**
- 左三分之一:纯黑,无粒子、无光、无运动。
- 右三分之二:所有运动限制在此。
- 前景平面:粒子层,从手前方经过。

**灯光:** 右上单个暖光主光。深 chiaroscuro。黑底金琥珀色。

**负向 prompt:** camera movement, pan, zoom, dolly, shake, fast motion, fast particles, particles on the left side, light on the left side, acceleration, abrupt cuts, cartoon, anime, strobing.

## Hub 适配说明

- 起草 prompt 之前用 `question` 收集画幅比、时长、单句"发生什么"叙事——不要静默猜。
- 用户附了参考帧或分镜板时,先用 `hub_read_media` 读进来,让空间分区规则能命名到实际构图的真实区域。
- 主要输出是 Prompt 模板逐字段填齐后放在 fenced markdown code block 里;每个字段都必须给值(留空 = 模型即兴发挥,直接破坏这个 skill 的价值)。
- 默认只出 prompt。只有用户明确批准生成时才调 `hub_generate_video`,并且要把强化后的 negative prompt 独立传字段,不要塞进正向 prompt 当注释。
- 生成完成后用 `hub_save_file_to_session`(`file_type: video`)把 `.mp4` 注册到 session。
- 和 `seedance-director`(多镜头叙事结构)、`pulp-cinema-director`(类型框架)配合最好——本 skill 提供词汇层,不提供 shot list 层。
