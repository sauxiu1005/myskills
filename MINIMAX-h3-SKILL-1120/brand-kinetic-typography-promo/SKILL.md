---
name: brand-kinetic-typography-promo
description: 将品牌、主题、卖点或产品信息制作成10–30秒动态字体宣传片，可选配色、动效、Logo、产品图和配乐，交付成片及可编辑规格。不用于AI生成视频或真人实拍。
trigger-words:
- motion graphics
- MG video
- kinetic typography
- promo video
- product launch animation
- code animation
- 动效视频
- MG动画
- 动态图形
- 品牌动效
- 产品宣传动画
- 代码动效
- Python FFmpeg 视频
---

# 代码渲染动效宣传片

用户提供品牌、主题、卖点或产品信息，希望用代码（而不是 AI 视频生成）做出动感的动态图形视频时使用：动态字体、形状变形、卡节拍转场。每一帧由 Python + Skia 绘制，FFmpeg 编码；配乐由代码合成或使用提供的音乐。结果可复现，整条片子由一个 JSON 规格文件驱动、随时重渲染。

随附引擎：`scripts/mgfx.py`（以及 `mgfx_core.py`、`mgfx_scenes.py`、`mgfx_recipes.py`、`mgfx_chapters.py`、`mgfx_portfolio.py`、`mgfx_ignite.py`、`mgfx_ideaform.py`、`mgfx_typeform.py`、`mgfx_reelcraft.py`、`mgfx_chrome.py`、`mgfx_audio.py`、`setup.sh`）。写规格前先读 `references/spec-reference.md`，做规划前先读 `references/creative-planning.md`，按主题挑选动效时读 `references/motion-library.md`。`references/example-spec.json` 是一份完整可运行的示例。

两个用户确认点：制作方案（文案 + 场景表），然后是分镜静帧。两者都确认前不渲染完整成片，除非用户明确要求跳过。

## 步骤 0：准备渲染环境

1. 在项目目录之外的临时目录创建虚拟环境（体积较大，不放进项目）：`bash scripts/setup.sh <tmp>/mgfx-venv`，已存在就复用。会安装 numpy、skia-python 和 imageio-ffmpeg；FFmpeg 随包附带，不需要系统 FFmpeg。
2. 在临时工作目录中工作。把用户素材（Logo、产品图、音乐）作为本地文件放进去。素材只以项目资源形式存在时，在项目工作区中找到对应本地文件；找不到就请用户附上。
3. 最终交付物（视频、规格文件、分镜图）复制到项目工作区并导入项目项目预览。

## 步骤 1：信息收集

从请求中提取，只询问缺失且影响结果的信息：
- **主体**：品牌或主题名、一句话主张、3–5 个卖点、产品事实、优惠/日期/口号、行动号召。
- **素材**：Logo 和产品图（透明 PNG 效果最好；不透明照片会放进圆角卡片）。用户希望抠出产品且有可用的去背景能力时，可主动提供。
- **事实**：`stat` 数据场景里的数字必须来自用户。不编造数据、价格、认证或日期。
- **画面文字语言**（中英文均支持）。

## 步骤 2：动效推荐与风格选择（一张问题卡）

先按 `motion-library.md` 第 2 节（调性判断、行业推荐表、目录中的"适合品牌"一栏）和第 2b 节（呈现格式）为主题推荐动效：
- 说明从需求中判断出的行业和调性，然后给出 **2–3 个方案**（推荐 / 稳妥 / 大胆）。每个方案写明视觉风格与配色、节奏、分镜表（用用户语言写动效名、这个品牌在该镜头展示什么、为什么适合）、需要用户提供的素材（产品图、真实数据、Logo）和预计渲染时间。不向用户展示模块代码名。
- 用户可以选一个方案，或替换其中个别镜头；选定结果就是步骤 3 的场景列表。

同一张卡片里再确认以下几项（依据品牌调性给出推荐，见 `creative-planning.md` 第 4 节）：
- **动效风格**：冲击快剪 `punch` / 极简瑞士 `swiss` / 科技HUD `hud` / 活泼弹性 `bouncy`（各方案已带建议，确认或调整）。
- **配色**：预设 `ember` `bauhaus` `cyber` `candy` `mono` `earth`，或品牌色（1–3 个色值），自动派生完整色板。
- **规格**：16:9 / 9:16 / 1:1 / 4:5，时长 10–30 秒（默认 15 秒、16:9、60fps）。
- **配乐**：代码合成（免费、节拍精确，默认）/ 平台 AI 配乐（可能产生费用）/ 用户提供（确认版权）/ 无声。

用户拿不准时，先渲染对比图（几秒完成、无成本）：`mgfx.py palette --brand ... --out palettes.png`；有了初稿规格后用 `mgfx.py styles spec.json --out styles.png`，导入项目让用户挑选。

## 步骤 3：制作方案 → 确认点 1

1. 先梳理信息层级，再从 `creative-planning.md` 选择结构模板。按内容选场景模块：卖点 → `kinetic_words`；产品图 → `product_hero` / `product_glow`；真实数据 → `stat`；使用场景或步骤 → `shape_morph`；能量高潮 → `rapid_cuts`；收尾 → `end_card`。也可按 `motion-library.md` 的叙事位置挑选动效（角色与调性标签、匹配流程、多样性规则）。除非用户点名要某个预设，不整条照搬参考片的场景链。`depth_tunnel`（纵深隧道）和 `ribbon_loop`（条纹色带）只在与产品或品牌契合时才使用，不作为默认动效。
   - 需要更紧凑的整片时，参考 `motion-library.md` 里设计好的链：R5 创意到成形（图形 / 界面主导的创意平台）、R6 字体主导（每一拍都由大字承担）、R7 快剪 Reel（showreel / showcase 快剪：`line_split` → `marquee_swap` → `orbit_morph` → `style_cuts` → `converge_lockup`，另有 `split_flap` `slice_type` `outline_echo` 增加字体变化）。可以只取其中一环，也可整链使用，再换文案、配色和 Logo。
   - 以动态字体为主，图形动效只负责串联镜头。模块要贴合品牌调性（运动、能量类用粗体无衬线；避免与品牌冲突的风格，如科技品牌用衬线体）。
2. 编写 `spec.json`。时长以拍为单位，总拍数必须等于 时长 × BPM / 60。交替使用 `bg` 色板角色，让每次切换都有明暗变化。大字保持简短（中文 ≤8 字、英文 ≤12 个字母）。
   - 自然的节奏：每镜约 1.25–2 秒（`format.min_scene`，默认 1.0）；每镜是「爆发 → 停留 → 快速退出」；字母从遮罩里带回弹升起；背景始终有次级运动；镜头之间用匹配转场（`transition: iris` 从上一镜某点扩开、形状放大成下一镜底色填满画面、`blinds` 百叶窗）。`beats` 可以写小数（如 2.5）。
   - 想法多、时长不够时，减少模块，而不是把模块压到 1 秒以下或单纯加速旧镜头；那样只会显得仓促，不算新设计。
   - 全局质感：顶层 `fx` 覆盖风格自带的后期效果，例如 `{"shake": 24, "rgb": 12, "grain": 7, "vig": 0.35}`，节拍上震动加色散，全片颗粒加暗角。
   - 字母保持在阅读的那一行上；打乱字母顺序的效果看起来像噪点。
3. 运行 `mgfx.py validate spec.json`，修复所有 ERROR。
4. 在项目中保存方案文档：创意概念、风格与配色、配乐选择、场景表（时间、模块、画面文案、作用）。请用户确认或修改文案与顺序，修改后同步到规格文件并重新校验。

## 步骤 4：分镜静帧 → 确认点 2

1. `mgfx.py stills spec.json --out storyboard.png`：每个场景渲染一张代表帧，顶部附色板条（720p，几秒完成）。
2. 把分镜图导入项目，请用户确认画面，或提出修改（文案、颜色、替换场景、风格）。只改规格文件，按改动重渲染静帧。

## 步骤 5：配乐

- **代码合成**：无需准备；`audio.mood` 可选 `energetic` / `bright` / `cool`。鼓组、贝斯、铺底、转场呼啸、低频冲击和提示音都精确落在节拍与场景切点上。
- **平台 AI 配乐**：按规格 BPM 生成一条纯音乐，情绪匹配所选风格，长度 ≥ 时长 + 3 秒。费用由用户在应用内确认。生成后进入下面的分析步骤。
- **用户或 AI 音乐文件**：`mgfx.py analyze-audio music.mp3` → 把 `format.bpm` 设为实测值（重新分配拍数，保证总长不变），设置 `audio.mode: "file"`、`audio.path`，`audio.start` 取 `suggested_starts` 之一。默认在上面叠加音效（`audio.sfx_gain` 0.5）。

## 步骤 6：渲染

1. 可选快速草稿：`mgfx.py render spec.json --out draft.mp4 --height 720 --fps 30`。
2. 正式渲染：`mgfx.py render spec.json --out <名称>.mp4`（1080p60，15 秒约 1–3 分钟）。引擎分段并行渲染、限制码率、合入 AAC 音轨并启用 faststart。
3. 只做技术检查：文件存在、时长、分辨率、包含音轨。不自行评审创意质量，由用户审阅。

## 步骤 7：交付与修改

- 把视频、规格文件（可编辑源）和分镜图导入项目中同一个作品目录。简述风格、配色、场景表和配乐。
- 修改时只改规格文件（文案、顺序、拍数、颜色、风格、音乐）→ `validate` → 画面变化时重出 `stills` → 重新渲染。修改后的成片作为同一视频资源的新版本保存。

## 实战踩坑

- **码率爆炸**：胶片颗粒会让 x264 码率超过 100 Mbps（15 秒文件 200MB 以上）。引擎已限制 maxrate；自行调用编码器时要保留这一限制。
- **并行抢占**：每个 FFmpeg 默认占满所有核心，进程过多时渲染反而慢 3 倍。引擎把每个编码进程限制为 2 线程，最多 4 个并行进程。
- **中文缺字**：拉丁展示字体没有中文字形。引擎按字符回退到苹方 / 冬青黑 / Noto CJK；系统没有中文字体时 `validate` 会报错，此时把 `fonts.cjk` 设为字体文件路径。
- **分镜取帧**：在转场中取到的帧看起来像故障；`stills` 已自动避开转场时段。可用场景的 `still` 比例挑选更好的时刻。
- **长词**会被自动缩小、失去冲击力；长文案放进 `callouts`、`label` 或 `subtitle`。
- 本技能的成片不使用 AI 视频生成；它是代码渲染的动态图形。
