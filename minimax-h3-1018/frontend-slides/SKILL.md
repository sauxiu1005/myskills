---
name: frontend-slides
description: |
  从零、粗略提纲、完整内容或 PowerPoint 文件创建零依赖、动效丰富的 HTML 网页幻灯片。输入为主题/笔记/PPTX/已有 HTML deck，输出为独具风格、视口安全的单文件 HTML，支持导出 PDF 或部署为可分享 URL。通过可视化风格预览让用户"看着选"，而非"说出偏好"。
  当用户想制作演示文稿、把 PPT/PPTX 转成网页、为演讲/路演做幻灯片、或增强已有的 HTML deck 时触发。
---

# 前端幻灯

创建完全在浏览器中运行的零依赖、动效丰富的 HTML 演示文稿。

## 核心原则

1. **零依赖** — 单个 HTML 文件，内联 CSS/JS，无需 npm 或构建工具。
2. **展示而非描述** — 通过可视化预览让用户选风格，不问抽象的审美问题。
3. **独特设计** — 拒绝千篇一律的"AI 味"，每份 deck 都要有量身定制的感觉。
4. **渐进式披露** — 先读轻量的风格索引，用户选定 bold template 后再读完整的 `design.md`。
5. **固定 16:9 舞台（不可协商）** — 每份 deck 使用 1920×1080 幻灯片画布整体等比缩放至视口。所有屏幕（包括手机）都必须保持 16:9，不重排幻灯片内容。

## 设计美学

模型倾向于收敛到通用、"符合分布"的输出，在前端设计上就是所谓的"AI 味"审美。避免这一点：做有创造性、有辨识度的前端，让人惊喜。

关注：

- 排版：选择漂亮、独特、有趣的字体。避免 Arial 和 Inter 这类通用字体，选能提升审美的独特字体。
- 色彩与主题：坚定一种美学。用 CSS 变量保持一致性。主色 + 锐利强调色胜过平淡均匀的调色板。可从 IDE 主题和文化美学中寻找灵感。
- 动效：把动画用在效果和微交互上。HTML 优先 CSS-only 方案，React 可用 Motion 库。聚焦高影响力时刻：一次精心编排的页面加载（staggered reveals + animation-delay）比零散的微交互更能带来惊喜。
- 背景：营造氛围和深度，而不是默认纯色。叠加 CSS 渐变、几何图案，或添加与整体美学契合的场景化效果。

避免 AI 生成的通用美学：

- 过度使用的字体家族（Inter、Roboto、Arial、系统字体）
- 陈词滥调的配色（尤其是白底紫色渐变）
- 可预测的布局和组件模式
- 缺乏场景个性的模板化设计

创造性地诠释，做出令人意外、真正为这个场景而设计的选择。在明亮/暗色主题、不同字体、不同美学之间变化。模型仍会倾向于收敛到常见选择（比如 Space Grotesk）：一定要跳出这个陷阱！

## 固定舞台规则

以下不变式适用于每份 deck 的每一张幻灯片：

- 每份 deck 都有一个填满浏览器窗口的视口包装器。
- 每张幻灯片都在固定 1920×1080 舞台内编写。
- 舞台等比缩放至视口，可加信箱边或立柱边，但不得重排内容。
- 不要用响应式断点为手机重新排列幻灯片内容。
- 在 1920×1080 设计尺寸下使用固定的内部测量单位。
- 幻灯片可见性必须由 `viewport-base.css` 中的 `.active` / `.visible` 通过 `visibility`、`opacity`、`pointer-events` 控制。不要用 `display: none` / `display: block` 切换幻灯片；后续的 `.slide-content { display: flex; }` 等布局类会覆盖它们，导致所有幻灯片同时可见。
- `clamp()` 只能用于舞台外的非幻灯片 UI，或者小型 fallback 预览。
- 加入 `prefers-reduced-motion` 支持。
- 不要直接对 CSS 函数取负（`-clamp()` / `-min()` / `-max()` 会被静默忽略）——请用 `calc(-1 * clamp(...))`。

**生成时必须读取 `viewport-base.css` 并在每份演示文稿中包含它的完整内容。**

### 内容密度模式

先问用户这份 deck 主要是用来阅读的还是用来讲的，然后据此设计：

| 密度模式 | 适合场景 | 设计行为 |
| ------- | ------- | ------- |
| **低密度 / 主讲式** | 公开演讲、发布会式分享、现场讲解 | 每页一个想法、大字号、强视觉层次、慷慨留白、每页最多 1-3 条要点、需要就多分页 |
| **高密度 / 阅读式** | 报告、handout、异步 review、详细内部文档 | 自成体系的页面、结构化的网格/表格/注释、可读时每页 4-8 条要点或 4-6 张卡片、间距更紧凑但仍有意图 |

底线不变：不滚动、不溢出、面板不重叠、字不小于舒适阅读尺寸。内容超出所选密度模式时，把它拆到更多页，而不是一直缩到拥挤。

---

## Phase 0: 判定模式

判断用户想要什么：

- **模式 A：新演示文稿** — 从零创建，进入 Phase 1。
- **模式 B：PPT 转换** — 转换 .pptx 文件，进入 Phase 4。
- **模式 C：增强已有** — 增强现有 HTML 演示文稿。读它、理解它、增强它。**遵循下方模式 C 修改规则。**

### 模式 C：修改规则

增强现有演示文稿时，最大风险是固定舞台的适配：

1. **加内容前**：先数现有元素数量，对照密度上限
2. **加图片**：让它塞进 1920×1080 幻灯片画布内。若本页已满，就拆成两页
3. **加文字**：每页最多 4-6 条要点。超了就拆成续页
4. **每次修改后要验证**：舞台仍是 16:9、无文字溢出卡片、无面板重叠、1280×720 + 一个手机视口下截图正确
5. **主动重组**：预判到会溢出就自动拆内容并告知用户，不要等被问

**给现有幻灯片加图片时**：先把图片移到新页，或先减掉其他内容。不要在没确认现有内容是否已填满 1920×1080 时直接加图。

---

## Phase 1: 内容采集（新演示文稿）

**一次性问完所有问题**，让用户一次填完。当前环境若提供原生结构化提问 UI 就用它，否则一条简洁消息里带清晰编号选项即可：

**问题 1 — 用途**（header: "Purpose"）：
这份演示文稿用来做什么？选项：路演稿 / 教学-Tutorial / 会议演讲 / 内部汇报

**问题 2 — 长度**（header: "Length"）：
大约多少页？选项：短 5-10 / 中 10-20 / 长 20+

**问题 3 — 内容**（header: "Content"）：
你有现成内容吗？选项：全部就绪 / 粗略笔记 / 只有主题

**问题 4 — 密度**（header: "Density"）：
deck 应该有多密？选项：

- "低密度 / 主讲式" — 大想法、少文字、更多视觉呼吸感
- "高密度 / 阅读式" — 自成体系的详情，适合异步阅读

**Phase 1 阶段不要问 inline editing**。用户不必在看到草稿前决定编辑行为。inline editing 是草稿后的顺手功能：默认打开，除非用户明确要"锁定/仅导出"文件。

记住用户的密度选择。它影响页数、排版尺度、每页文字量、布局密度，以及是偏向电影感讲者页还是自成体系的阅读页。

如果用户有内容，请他分享。

### Step 1.2：图片评估（如果用户提供了图片）

用户选择"无图片"→ 跳到 Phase 2。

用户提供了图片文件夹：

1. **扫描** — 列出所有图片文件（.png、.jpg、.svg、.webp 等）
2. **看每张图** — 用 agent 可用的图像理解能力。如果不可用，就用文件名/元数据，需要时再问用户澄清
3. **评估** — 每张图：内容是什么、可用还是不可用（附原因）、代表什么概念、主色调
4. **图文共同规划大纲** — 挑选出的图片和文本一起决定幻灯片结构。**不是**"先规划再配图"——从一开始就围绕图文共同设计（例如 3 张截图 → 3 页功能介绍，1 个 logo → 首页/尾页）
5. **确认大纲**（同样优先用结构化提问）："这个大纲和图片选择看着对吗？"选项：不错 / 调整图片 / 调整大纲

**Logo 出现在预览中**：如果识别出可用 logo，就把它 base64 嵌入 Phase 2 的每份风格预览——用户能看到自己的品牌被三种不同风格呈现。

---

## Phase 2: 风格发现

**这是"展示而非描述"阶段。** 大多数人无法用文字描述设计偏好。

### Step 2.0：直接生成 3 份风格预览

基于用途、受众、氛围、内容密度，生成 3 张风格截然不同的单页 HTML 预览，展示排版、色彩、动效和整体美学。

不要问用户"想要选项吗？"或"要预设选择器吗？"，默认的发现方式就是可视化对比。

如果用户已经给了 vibe，就用它。没给就从场合、受众、内容、赌注推断可能的情绪。选项之间要足够多样，让用户能视觉反应，而不是先要求他"说出品味"。

如果用户明确点名了某个预设或 bold template，把它作为其中一个选项，其余选项围绕它生成。

读 [STYLE_PRESETS.md](STYLE_PRESETS.md) 拿安全预设候选。若存在 [bold-template-pack/selection-index.json](bold-template-pack/selection-index.json)，同样读这份紧凑索引，但**先不要**读任何 `design.md`。

| 情绪 | 建议预设 |
| --- | ------- |
| 印象深刻/自信 | Bold Signal、Electric Studio、Dark Botanical |
| 兴奋/充满能量 | Creative Voltage、Neon Cyber、Split Pastel |
| 平静/专注 | Notebook Tabs、Paper & Ink、Swiss Modern |
| 受启发/被打动 | Dark Botanical、Vintage Editorial、Pastel Geometry |

**预览组合规则：**

- 默认生成 3 份预览：1 个 `STYLE_PRESETS.md` 的安全预设 + 至少 1 个 `bold-template-pack/selection-index.json` 中的 bold template + 1 个 wildcard
- wildcard 可以是第二个 bold template，或者一个自研的 custom 设计。哪个能为用户当前场合、受众、氛围、内容形成最强对比，就用哪个
- 不要强求每个表现力选项都来自模板库。如果需求本身有比模板更锐利、更具体的设计机会，wildcard 就自由设计
- 对保守/高赌注的 deck，安全预设做得格外克制；bold template 挑一个平静、更正式的；wildcard 要么是另一个克制的模板，要么是一个感觉有权威感而非装饰感的自研设计
- 对表现力优先的 deck，保留可读性 fallback 作为安全预设；挑一个强的 bold template；wildcard 做得冒险、场景化、与其他两份都明显不同
- 若 bold template 匹配感觉都弱，就把 wildcard 换成 custom 设计，或者退回另一个安全预设，别硬套模板

**自研 wildcard 设计规则：**

- 遵守上文"设计美学"章节：不要通用"AI 味"、不要默认字体/色彩/布局、不要白底紫渐变陈词滥调、不要千篇一律的 dashboard/card 样式
- 契合用户明说的场合、受众、氛围/vibe、内容密度。custom 设计应该像是"为这份 deck 而写"的，而不只是"看起来好看"
- 做出深思熟虑的视觉论点：独特排版、坚定的调色板、可识别的布局系统、一个强氛围或图形装置
- 让它能扩展成完整 deck。预览必须暗示一个能扩展到章节页、内容页、引言页、对比页、结束页的设计系统
- 使用固定 1920×1080 舞台规则，通过所有其他选项要通过的预览真实性检查
- 不要在幻灯片上渲染 "custom"、"wildcard"、"AI-generated" 或设计过程标签

**Bold template 选择规则：**

- 用户用途/情绪与模板的 `mood`、`tone`、`best_for`、`avoid_for`、`formality`、`density`、`scheme` 匹配
- 把 `best_for` 例子当软信号，而不是严格行业过滤
- 三份预览之间要真正不同
- 选定候选模板后，只读候选模板的 `preview.md`（路径见 selection index 的 `preview_md`）
- `preview.md` 只用于标题页预览。用户敲定最终模板前不要读完整 `design.md`
- 除非选定的 `design.md` 缺关键实现细节，否则不要读或复制 `template.html`

**预览真实性规则（不可协商）：**

- 每份风格预览必须看起来像用户 deck 的真正首页，而不是诊断卡片
- 不要在幻灯片上渲染任何内部工作流文字：`preview`、`generated from`、`preview.md`、`template`、`preset`、`style option`、`Option A/B/C`、文件名、路径、源文档标签
- 不要在幻灯片上渲染模板名/slug 名。模板/风格名只出现在对用户的消息里
- 不要把用户需求笔记当幻灯片内容渲染，比如"锐利有力"、"安全选项"、"大胆选项"、"用于内部分享"、"受众：..."——除非用户明确要求这句原文出现
- 幻灯片如需 chrome，只用真的 deck chrome：deck 标题、章节标题、日期、作者、公司名、页码，或用户素材里真的内容短语
- 打开预览前先检查可见文字，如出现内部元数据就修掉

预览存到 `.frontend-slides/slide-previews/`（style-a.html、style-b.html、style-c.html）。每份都要自成体系、紧凑，展示一张带动画的标题页。

自动为用户打开每份预览。

### Step 2.1：用户选择

问（header: "Style"）：
你更喜欢哪份风格预览？选项：Style A: [名字] / Style B: [名字] / Style C: [名字] / 混合元素

若"混合元素"，追问具体想融合什么。

---

## Phase 3: 生成演示文稿

用 Phase 1 内容（文本，或文本 + 挑好的图片）+ Phase 2 风格生成完整 deck。

如果提供了图片，Step 1.2 时大纲已把它们纳入。如果没提供，CSS 生成的视觉（渐变、图形、图案）提供视觉趣味——这是一等公民路径。

在整份 deck 中应用用户的密度选择：

- **低密度 / 主讲式**：更多页数、每页更少想法。偏向大标题、短语、视觉比喻、章节 beat、引言/宣告页、演讲友好节奏
- **高密度 / 阅读式**：让每页更自成体系。用结构化网格、对比表、注释图、字幕、简洁解释文字。保持层次感强，让它看起来是设计过的，而不是把文档粘到幻灯片上

如果用户需求两者兼有，就选更接近的一种，不要发明中间态：现场受众说服默认低密度；异步流转或详细 review 默认高密度。

高密度不能变成视觉杂乱。如果高密度页开始溢出，就拆或重新设计成更清晰的结构。

如果用户选了 `bold-template-pack` 中的 bold template，生成前只读该模板的完整 `design.md`，不要读别的 bold template。把 `design.md` 当作设计配方：

- 保留它的字体、调色板、装饰词汇、间距节奏、组件语法
- 无论源模板原来用的是 `deck-stage.js` 还是视口流式 CSS，最终 deck 都生成为固定 1920×1080 舞台等比缩放
- `design.md` 里视口流式的值按设计比例翻译到 1920×1080 舞台坐标，不要保留为最终 deck 里活的视口重排规则
- 输出保持为单个自成体系的 Frontend Slides HTML 文件
- 不要抄 demo 幻灯片内容，也不要过分模仿源模板
- `template.html` 只作为最后的实现参考
- 生成后，通过浏览器截图验证内容溢出 + 面板重叠。仅靠 `scrollHeight` 检查不够，网格面板可能视觉上互相遮盖

如果用户选了自研 custom wildcard，把那份预览的 CSS 和布局当作设计配方：

- 保留它的字体、调色板、装饰词汇、间距节奏、网格逻辑、组件语法
- 把同一视觉系统扩展到整份 deck。用户选了 custom 后不要切回预设或 bold template
- 缺的幻灯片布局从这个系统内设计，不要引入其他风格的模式
- 保持固定舞台、单文件、视觉验证过——和其他 deck 一样

**生成前，读这些支持文件：**

- [html-template.md](html-template.md) — HTML 架构和 JS 功能
- [viewport-base.css](viewport-base.css) — 强制 CSS（完整包含进去）
- [animation-patterns.md](animation-patterns.md) — 动画参考，匹配目标情绪

**关键要求：**

- 单个自成体系 HTML 文件，所有 CSS/JS 内联
- 在 `<style>` 块中包含 viewport-base.css 的**完整**内容
- 使用 Fontshare 或 Google Fonts 的字体——不要用系统字体
- 加详细注释解释每部分
- 每个部分都要有清晰的 `/* === SECTION NAME === */` 注释块

---

## Phase 4: PPT 转换

转换 PowerPoint 文件时：

1. **抽取内容** — 运行 `python scripts/extract-pptx.py <input.pptx> <output_dir>`（若需安装 python-pptx：`pip install python-pptx`）
2. **和用户确认** — 展示抽取出的幻灯片标题、内容摘要、图片数量
3. **风格选择** — 进入 Phase 2 做风格发现
4. **生成 HTML** — 按选定风格转换，保留所有文字、图片（来自 assets/）、幻灯片顺序、讲者备注（作为 HTML 注释）

---

## Phase 5: 交付

1. **清理** — 若存在 `.frontend-slides/slide-previews/` 就删掉
2. **打开** — 用 `open [filename].html` 在浏览器中启动
3. **总结** — 告诉用户：
   - 文件位置、风格名、页数
   - 导航：方向键、空格键，如启用则支持滑动/点击
   - 如何定制：`:root` CSS 变量改色，字体 link 改排版，`.reveal` 类改动画
   - inline 文字编辑可用：hover 左上角或按 E 进入编辑模式，点任意文字编辑，Ctrl+S 保存
   - 提供草稿后自然的后续动作：改需求、直接在浏览器里改文字、或导出/分享

---

## Phase 6: 分享与导出（可选）

交付后**问用户**：_"要分享这份演示文稿吗？我可以把它部署成一个可访问的 URL（在任何设备包括手机上都能看），或者导出成 PDF。"_

选项：

- **部署到 URL** — 任何设备都能打开的可分享链接
- **导出 PDF** — 邮件、Slack、打印都通用的文件
- **两个都要**
- **不用了**

用户拒绝就停在这里。选了一个或两个就继续。

### 6A：部署到 URL（Vercel）

把演示文稿部署到 Vercel——一个免费托管平台。链接在任何设备（手机、平板、笔记本）都能打开，直到用户主动下架为止。

**如果用户从没部署过，一步步引导：**

1. **检查 Vercel CLI 是否已装** — 运行 `npx vercel --version`。没找到就先装 Node.js（macOS 上 `brew install node`，或从 https://nodejs.org 下载）
2. **检查是否已登录** — 运行 `npx vercel whoami`
   - 若**没**登录，解释：_"Vercel 是免费托管服务。你需要账户才能部署。让我一步步带你走："_
     - 第一步：让用户在浏览器打开 https://vercel.com/signup
     - 第二步：可用 GitHub、Google、邮箱注册——哪个方便用哪个
     - 第三步：注册好后，运行 `vercel login` 跟着提示走（会打开浏览器授权）
     - 第四步：用 `vercel whoami` 确认登录
   - 等用户确认已登录再继续
3. **部署** — 运行部署脚本：

   ```bash
   bash scripts/deploy.sh <path-to-presentation>
   ```

   脚本可接受一个文件夹（含 index.html）或单个 HTML 文件
4. **分享 URL** — 告诉用户：
   - 上线 URL（从脚本输出中拿）
   - 它在任何设备都能看——他可以发微信、Slack、邮件
   - 下架方式：访问 https://vercel.com/dashboard 删除项目
   - Vercel 免费额度很宽——不会被扣钱

**部署常见问题：**

- **本地图片/视频必须一起走。** 部署脚本自动检测 HTML 里 `src="..."` 引用的文件并一起打包。但若演示文稿通过 CSS `background-image` 或不寻常路径引用，可能被漏掉。**部署前先验证**：打开上线 URL，检查所有图片是否加载。若有坏图，最保险的做法是把 HTML 和所有资源放到一个文件夹里部署，而不是部署单个 HTML
- **有很多资源时优先部署文件夹。** 若演示文稿在文件夹里、图片和它并排（例如 `my-deck/index.html` + `my-deck/logo.png`），直接部署文件夹：`bash scripts/deploy.sh ./my-deck/`。这比部署单个 HTML 更可靠，因为整个文件夹会原样上传
- **文件名带空格能用但可能出问题。** 脚本处理空格，但 Vercel URL 会把空格编码成 `%20`。可能的话避免图片文件名带空格。用户图片有空格时脚本会处理——如果仍坏，把空格改成连字符是解法
- **重复部署会覆盖同一 URL。** 对同一份演示文稿重跑脚本会覆盖之前的部署。URL 保持不变——不用再发新链接

### 6B：导出 PDF

对每张幻灯片截图并合并成 PDF。适合邮件附件、嵌入文档、打印。

**注意**：动画和交互不会保留——PDF 是静态快照。这是正常的，务必告诉用户以免意外。

1. **运行导出脚本：**

   ```bash
   bash scripts/export-pdf.sh <path-to-html> [output.pdf]
   ```

   不给输出路径就保存到 HTML 旁边
2. **背后发生了什么**（简单解释给用户）：
   - 一个无头浏览器以 1920×1080（标准宽屏）打开演示文稿
   - 一张张截图
   - 所有截图合并成一份 PDF
   - 脚本需要 Playwright（一个浏览器自动化工具）——缺失会自动装
3. **Playwright 安装失败时：**
   - 最常见问题是 Chromium 下载失败。运行：`npx playwright install chromium`
   - 那也失败可能是网络/防火墙问题。让用户换个网络试试
4. **交付 PDF** — 脚本会自动打开。告诉用户：
   - 文件位置和大小
   - 邮件、Slack、Notion、Google Docs、打印都能用
   - 动画用它们的最终视觉状态替代（仍好看，只是静态）

**PDF 导出常见问题：**

- **首次运行慢。** 脚本会装 Playwright 并下载一个 Chromium 浏览器（约 150MB）到 temp 目录，每次运行一次。告诉用户第一次可能要 30-60 秒——同一 session 里后续导出会快
- **幻灯片必须用 `class="slide"`。** 导出脚本按 `.slide` 元素找幻灯片。用了别的类名就会报 "0 slides found" 失败。本 skill 生成的演示文稿都用 `.slide`，所以这只影响外部创建的 HTML
- **本地图片必须可通过 HTTP 加载。** 脚本会起本地服务器加载 HTML（这样 Google Fonts 和相对图片路径能工作）。如果图片用绝对文件系统路径（例如 `src="/Users/name/photo.png"`）而不是相对路径（例如 `src="photo.png"`），就无法加载。本 skill 生成的演示文稿总用相对路径，但转换过来或用户提供的 deck 可能不是——发现就修
- **本地图片会出现在 PDF 里**，只要它们在 HTML 同目录（或相对路径能到）。导出脚本把 HTML 父目录起 HTTP，所以相对路径像 `src="photo.png"` 能正确解析——含带空格的文件名。图片仍没出现就检查：(1) 图片文件真实存在于引用路径 (2) 路径是相对的，不是绝对文件系统路径
- **大 deck 会产生大 PDF。** 每张幻灯片以完整 1920×1080 PNG 截图。18 页的 deck 能产生约 20MB 的 PDF。若 PDF 超 10MB，问用户：_"PDF 是 [大小]。要不要压缩下？会略微降清晰度但文件小很多。"_ 若要，用 `--compact` flag 重跑：
  ```bash
  bash scripts/export-pdf.sh <path-to-html> [output.pdf] --compact
  ```
  以 1280×720 而不是 1920×1080 渲染，文件通常缩小 50-70%，视觉差异极小

---

## 支持文件

| 文件 | 用途 | 何时读 |
| --- | --- | --- |
| [STYLE_PRESETS.md](STYLE_PRESETS.md) | 12 个精选视觉预设，含色彩、字体、标志性元素 | Phase 2（风格选择） |
| [bold-template-pack/selection-index.json](bold-template-pack/selection-index.json) | 紧凑的 bold template 元数据，用于候选选择 | Phase 2（风格选择） |
| [bold-template-pack/templates/*/preview.md](bold-template-pack/templates/) | 入围 bold template 的轻量风格卡（用于标题页预览） | Phase 2 入围后 |
| [bold-template-pack/templates/*/design.md](bold-template-pack/templates/) | 用户选定的 bold template 的详细设计系统文档 | Phase 3 用户选定后 |
| [viewport-base.css](viewport-base.css) | 强制的固定舞台 CSS——每份演示文稿都要完整拷进去 | Phase 3（生成） |
| [html-template.md](html-template.md) | HTML 结构、JS 功能、代码质量标准 | Phase 3（生成） |
| [animation-patterns.md](animation-patterns.md) | CSS/JS 动画片段和"效果到情绪"的映射指南 | Phase 3（生成） |
| [scripts/extract-pptx.py](scripts/extract-pptx.py) | 抽取 PPT 内容的 Python 脚本 | Phase 4（转换） |
| [scripts/deploy.sh](scripts/deploy.sh) | 部署到 Vercel | Phase 6（分享） |
| [scripts/export-pdf.sh](scripts/export-pdf.sh) | 导出为 PDF | Phase 6（分享） |
