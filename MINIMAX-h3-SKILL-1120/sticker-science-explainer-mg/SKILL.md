---
name: sticker-science-explainer-mg
description: |
  用代码渲染贴纸风科普短片：粗白描边贴纸、精确图表和地图，可选固定视角或运镜，并代码合成配乐；不用于 AI 生视频。
trigger-words: [sticker explainer, sticker-style explainer, knowledge explainer MG, 贴纸风科普, 贴纸风格, 回形针风格, 粗描边贴纸人科普, 贴纸科普视频, 科普 MG]
---

# 贴纸风科普 MG 短片

基于开源项目 mg-styles-15（github.com/Vincentwei1021/mg-styles-15，MIT 许可，见 `toolkit/LICENSE`）。
把主题做成粗描边贴纸风格的动态设计科普短片：照片或实物变成带粗白描边的贴纸，与扁平图标、精确数据图表一起排在版面上，
可选固定视角（画面内元素入场、变化、退场，按章节换版面）或大画布运镜（镜头平移缩放串联信息点），最后落在粗黑体的标题卡上。画面、动画、配乐和音效全部由代码生成，用无头 Chrome 逐帧确定性渲染，再用 ffmpeg 合成。

附带资源（路径相对本 Skill 目录）：
- `references/style-prompt.md` — 本风格的完整制作提示词（Style / Output / 技术路线 / Creative seed / Signature features /
  How to work / Rules / Craft checklist / Deliver）。
- `references/rubric.md` — 独立评审提示词，用于「评审 → 修改」一轮。
- `toolkit/` — 渲染器与参考源码：`harness/render.mjs`（确定性 HTML→MP4，页面暴露 `window.renderAt(t)`）、`harness/preview.html`、
  `lib/audio`（mgaudio 配乐工具包 + 配乐配方与 4 种 CC0 音效采样：拍板、刮瓜、沙铃、玻璃杯；配乐乐器全部由代码合成）、`demos/19-paperclip/`（原片源码与世界地图数据；原片的照片贴纸图未随包提供，仅作代码参考）、
  `assets/`（字体清单）、`package.json`、`requirements.txt`。

## 步骤 1：需求

收集主题、关键事实与数字、画面文字语言，以及要做成贴纸的照片。开始制作前确认交付规格：画幅（默认 1920×1080；竖屏 1080×1920）、
时长（默认 10 秒，提示词和工具包按 10 秒调校）、是否需要配乐音效（默认需要），以及镜头方式（二选一，附简要说明让用户选）：
- **固定视角（推荐）**：画面像一页版面不动，贴纸、文字和图表在画面里入场、变化、退场，按章节切换。信息清楚、阅读压力小，适合大多数科普。
- **运镜**：所有内容铺在一张超大画布上，镜头一路平移缩放串起各个信息点，旧贴纸随镜头移出画面。更有流动感和空间感，适合路线、流程类题材，但更考验节奏。
用虚构名称代替真实品牌商标。

## 步骤 2：创意方案确认

读取 `references/style-prompt.md`。通用部分保留，**绝不删除 `Signature features`**。只改写 `Creative seed`（主题、文案、配色、声音），
在 `Camera mode` 里只保留用户选定的那一段，必要时改 `Output`（尺寸、时长）。向用户呈现：两句话概念、带时间码的节拍表（前 0.5 秒钩子、升级、约 60–75% 处的高潮、停留的结尾卡）、
配色、画面文案、所用数据和配乐方向。等待确认——渲染是高成本步骤。

## 步骤 3：制作（委派编码子 agent）

交给编码子 agent，内容包括：完整改写后的提示词全文（直接贴进 brief）；本 Skill `toolkit/` 的绝对路径，以及 `toolkit/demos/19-paperclip/`
作为参考实现；要求把工具包复制到其工作目录（页面从工具包根目录起服务，`/assets/...`、`/node_modules/...` 均相对根目录），按需
`npm install` 与 `pip install -r requirements.txt`，用确定性的 `window.renderAt(t)` 搭建页面，用 `lib/audio` 配方写 `audio.py` 并锁定同一份 cue 表，
再用 `harness/render.mjs` 渲染。
需传达的约束：每帧都是时间 t 的纯函数；只用 CC0/OFL/可商用素材；画面文字准确自然、标点规范；图表精确、数字自洽；
音频母带 −14 LUFS、真峰值 ≤ −1 dBTP；交付 MP4 和简短报告（节拍表、各风格特征如何实现、检查数值）。
字体文件不随包提供，使用已安装或 OFL 字体（见 `toolkit/assets/fonts/README.md`）。

## 步骤 4：交付与可选修改

呈现成片与报告，请用户反馈。仅在用户需要时用 `references/rubric.md` 做一轮评审。用户反馈通过同一编码子任务更新同一支成片（新版本）。

## 说明
- 同一份提示词每次做出的片子都不同，一次运行通常达不到原片完成度。
