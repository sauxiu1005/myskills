---
name: vinyl-print-graphics
description: |
  生成扁平、可矢量化的图形，能直接进物理切割机（HTV、Cricut、Silhouette、CNC 激光）或手工丝网印刷。输入是主题描述，输出是纯色高对比图形（含模型路由、prompt 骨架、约束块），保证 plotter 切出来能 weeding（挑边角料）不散架。
  当用户想设计 vinyl / HTV 服装图案、做模板或丝网印稿、切 plotter 可执行的形状，或产出保证可 weed 的单色印刷图时触发。
trigger-words: [vinyl, HTV, Heat Transfer Vinyl, Cricut, Silhouette, plotter, cutter, silkscreen, screen printing, stencil, linocut, woodblock print, 丝网印刷, 刻绘, 刻字, T恤图案]
allowed-tools: [question, hub_generate_image, hub_save_file_to_session]
---

# Vinyl、Silhouette/Cricut Plotter 与丝网印刷设计指南

产出扁平、可矢量化的图形工作流，专门为物理切割（vinyl plotter、HTV、Cricut、Silhouette、CNC 激光）或手工丝网印刷设计。

触发关键词：**HTV / Heat Transfer Vinyl / vinyl / plotter / cutter / Cricut / Silhouette**、**silkscreen / screen printing / sérigraphie / manual print / ink press / 丝网印刷**，或独立服装/印刷图形的 **stencil（模板）/ stamp（印章）/ linocut（版画）/ woodblock print（木刻）**。

## 核心操作原则

### 硬性矢量兼容规则

物理 vinyl 切割和丝网印刷要求 **扁平、连通的纯色墨块**。
- **背景**：始终指定 `flat, solid, plain white background` 或 `solid black background`。背景不能有纸张纹理、drop shadow、织物 mockup、模特形象。
- **墨/图形描述**：使用 `solid pure black artwork`、`high contrast monochrome vector graphic style` 或 `flat 2D silhouette design`。
- **零阈值容差**：明确告诉模型：`no grays, no colors, no gradients, no shading, no drop shadows, no t-shirt mockup, no fabric texture, no photorealism`。

### Weeding 与线宽保护

Vinyl 设计切完之后，人要手动"weed"（挑掉废料）。太细、断开、或者一堆浮尘般碎点的线，会撕裂、跑位、粘不住。
- **线宽**：使用 `thick clean lines, bold geometric solid paths, high contrast silhouettes`。
- **结构整合**：如果设计繁复（如放射状辐条线、op-art 网格、高对比栅格），要求模型：`make paths continuous, avoid floating dust particles, widen fine lines for clean cuts, ensure lines are thick enough to cut and weed`。

---

## 工作流

### Step 1：收集设计 brief

烧 credit 前先 call `question` 补齐缺失字段：

- question："图形的核心主体是什么？"（自由填写，一行）
- question："设计需要精细字体、数字坐标、或几何轴线/网格吗？"，options：["需要 — 字体或几何关键", "不需要 — 有机 / 插画感", "在已上传的参考图上修改"]
- question："目标画幅？"，options：["1:1 方形", "2:3 竖版（胸前印花）", "3:4", "16:9 横版"]

用户已经内联给过答案的问题跳过。

### Step 2：路由到正确的模型

按 Step 1 的答案选 vendor + model：

| 用户答案 | vendor | model | quality | resolution |
|---|---|---|---|---|
| 字体 / 几何关键 | `openai-image` | Imagen 级（支持的最高档） | `high` | `2k` |
| 有机 / 插画感 | `nano-banana` | edit 级 | — | `2k` |
| 在参考图上修改 | `nano-banana` | edit 级 | — | `2k` |

**永远不要**降 resolution — 低分辨率栅格会毁掉下游矢量化，直接让 weeding 变不可能。

### Step 3：按四支柱骨架构建 prompt

按顺序拼装 prompt：

1. **Subject（主体）**：核心元素（如 optical sphere、握着玫瑰的解剖学之手、极简植物轮廓）。
2. **Style（风格）**：单色矢量、扁平 2D 丝印母题、高对比剪影、op-art 粗线条。
3. **Instructions（指令）**：网格布局、边框限位、字体渲染。指定线条力度：`Ensure all black lines are thick, bold, and continuous so they are vector-plotter ready.`
4. **Constraints（约束，永远原样粘贴）**：`Absolutely no colors, no shades of gray, no gradients, no shadows. Background must be a solid, featureless pure white sheet. No mockup. No stippling, no screentones, no halftones. All elements connect to a main central structure. No garment mockup, no t-shirt mockup, no human model, flat scan design only.`

示例骨架：

```text
[Subject]: A minimalist 2D industrial graphic. Centered is [insert core subject].
[Style]: High-contrast monochrome vector style, clean flat black ink and pure white space.
[Instructions]: Bold and distinct geometric linework. A thin vertical structural axis runs alongside the element. Include precise, clean monospaced text reading: "[exact text]" underneath.
[Constraints]: Absolutely flat scan. Plain solid white screen background. No color, no gray, no halftones, no t-shirt mockup, no model, no shadows. All lines must be thick, continuous, and robust for plotter cutting and vinyl weeding.
```

### Step 4：出图

Call `hub_generate_image`：
- vendor：Step 2 定的
- model：Step 2 定的
- prompt：Step 3 的四支柱骨架
- aspect_ratio：Step 1 定的
- resolution：`2k`
- （用户给了参考图）medias：`[{ role: "image", data: { id: "<upload_id>", type: "media_input" } }]`

### Step 5：按陷阱表 QA

交付前对照下表检查结果：

| 陷阱 | 成因 | 修法（重跑） |
|---|---|---|
| 字体模糊 / 像素化 | 默认模型糊掉小字 | 重跑 Step 4，切 Imagen 级模型 + `quality: high` |
| 出现渐变 / 半调 | 风格化模型用点阵 | 重跑 Step 4，prompt 里强化 `absolutely no stippling, no screentones, no halftones, no tiny dots, solid black shapes only` |
| 分离浮点碎片 | 孤立元素在 vinyl 转印时会掉 | 重跑 Step 4，加 `ensure all elements connect to a main central structure / axis / line` |
| 织物 / T 恤 mockup | 模型把图形放到服装上 | 重跑 Step 4，加 `no garment mockup, no t-shirt mockup, no human model, flat scan design only` |

任何一条陷阱命中，回到 Step 4 用修正后的 prompt 重跑。

### Step 6：注册交付物

对每张通过的图 call `hub_save_file_to_session`：
- file：返回的图片路径/URL
- file_type：`image`

用户就能拉进自己的 plotter 工作流（Cricut Design Space、Silhouette Studio 等）。

## Hub 适配说明

- 所有出图走 `hub_generate_image` — 字体/几何路由到 Imagen 级模型，有机/手绘线条或对已上传参考做重定向路由到 Nano-Banana 级编辑模型。
- 指定 `resolution: 2k`（或支持的最高分辨率），保证输出能撑到下游矢量化；低分辨率栅格图会把 weeding 玩死。
- 完成的 PNG 通过 `hub_save_file_to_session`（`file_type: image`）注册到 session，用户可以拉进自己的 plotter 工作流（Cricut Design Space、Silhouette Studio 等）。
- 本 skill 不碰物理切割机 — plotter 切割、weeding、HTV 热压是用户端下游手工步骤。
- 每次 prompt 都要重申约束块（`no gradients, no halftones, no mockup, no fabric texture`）；模型没约束就会漂回照片级 mockup。
