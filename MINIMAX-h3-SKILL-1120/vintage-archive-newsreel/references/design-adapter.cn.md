# Design 平台适配

说明上游新闻片流程如何落到 MiniMax Design。平台能力名称会随版本变化：按“能做什么”发现并选择当前会话真实提供的能力，不编造工具、字段、音色ID或模型名。

## 1. 文件位置

- `skillRoot`：已安装技能目录。`vendor/lemo-opuscar/` 为只读固定快照，禁止修改。
- `projectRoot`：用 `scripts/init_project.py` 在当前 Design 项目工作区内新建的目录。运行时副本、原始下载、素材、配音、音乐、渲染和 QA 全部放在这里。
- 要上画布的媒体必须在工作区内；作者机器路径不是交付链接。
- 在 `film/QA.md` 记录 `skillRoot`、`projectRoot`、语言、尺寸/fps、配音路线、音乐路线及实际使用的工具/模型。

## 2. 复用已安装运行时

开工时运行一次只读探测 `python3 scripts/check_runtime.py <projectRoot>`。Design 桌面端通常已有：

| 需求 | Design 通常已有 | 仅缺失时的项目内步骤 |
|---|---|---|
| Node ≥ 20 | 平台 Node 运行时 | 无 |
| Python ≥ 3.11 及 numpy、scipy、Pillow | 平台 Python 运行时 | 无 |
| FFmpeg/ffprobe（libx264、loudnorm、ebur128、hqdn3d） | Design 应用内置 FFmpeg | 无 |
| 与 playwright-core 匹配的无头 Chromium | 已缓存的 chromium-headless-shell | 不再下载浏览器；仅版本不符时设 `PLAYWRIGHT_CHROME` |
| `core/render` 需要的 playwright-core | 平台 Python playwright 包内自带的副本（与锁文件同为 1.63.0） | `init_project.py` 自动链接到 `runtime/node_modules/`；只有没有匹配副本且存在 npm 时才 `npm ci --omit=dev`（平台 Node 不含 npm） |
| soundfile、soxr（采样器、音频预处理） | 常缺 | `python3 -m venv --system-site-packages runtime/.venv` 后只装这两个 |
| numba（物理建模班卓加速） | 常缺 | 仅实际使用 `pluck.py` 时安装 |
| Kokoro / edge-tts / faster-whisper | 通常缺 | 优先平台语音与转录；用户明确要求原引擎才本地安装 |

`init_project.py` 还会修补项目内的 `mux.sh` 副本（绝不改 vendor），规避内置 FFmpeg 6.0 的两个问题：解码时长检查改用单独的普通解码；AAC 前固定输出立体声布局。两项记录在 `project.json` 的 `runtime_patches`。

不重装上游整套工具栈，不默认全量安装 `requirements-voice.txt`，不更新全局包，同一安装失败最多重试两次。“装过”不等于可用：实际运行一次（如渲染一帧）并记录。

## 3. 能力替换表

保持每个环节的结果和质量标准，实现方式可替换。在 `QA.md` 记录“原环节 → 实际工具 → 保留能力 → 已知差异”。已授权范围内的等效替换无需再次确认。

| 原环节 | Design 路线 | 必须保持 |
|---|---|---|
| `footage.py` 搜索/下载 | 用平台 Python 运行 `footage.py`（仅标准库）；内置浏览器阅读目录页与文件页；公开视频页用网页媒体下载能力；直链文件用媒体导入 | 读目录说明与许可模板、实际看片、记录入出点 |
| 通用图片搜索 | 只作线索追到档案页；没有核实来源页与许可，不能当证据或素材 | 每个文件的出处与许可 |
| Kokoro / edge-tts 播报 | 用户录音优先；否则平台语音合成，通过平台音色检索选英文男声（明亮、有活力）。先生成一句实测，再用同一音色批量 | 全片一个音色；每句导出 `<id>.wav`；实测 `dur.json` |
| faster-whisper 校对 | 平台字幕转录分别处理干声与成片，逐句对照台词，并实际听审 | 专名、数字、日期一致；用改写措辞修正，不改事实 |
| 采样/建模乐队 | 首选代码乐队（原创旋律，按需逐个获取并校验采样库）。备选：平台器乐生成，再用代码按时间轴剪辑，使急停、收尾和落点成立 | 190–220 BPM 律动、大号/班卓/长号/小军鼓/钢琴/小号/单簧管配器、两次近静音、原创音乐 |
| 音效 `sfx.py` | 程序化代码音效；平台音效生成仅作补充 | 每个可见动作有音效；放映机底噪贯穿首尾 |
| Canvas2D + `video.mjs` + `mux.sh` | 随包渲染器 + 平台 Node、缓存浏览器、内置 FFmpeg | 确定性 `render(t)`、两层画面、画门、源视频真实运动 |
| 接触表与媒体信息 | `still.mjs` + `sheet.py`；`scripts/delivery_check.py`；平台媒体检查作复核 | 缩略图不能代替正常速度观看 |
| 交付 | 最终 MP4 导入画布，并在画布播放器播放 | 文件解码、上传、画布播放分别记录 |

绝不用生成图片或生成视频替代档案影片、印刷物或唱片，不用 AI 修复、上色或放大伪造时代素材。生成能力只用于用户要求且明确非档案的内容（如海报变体），并标注。

## 4. 真实彩色素材

真实彩色胶片或视频（如长时段历史的后期章节）可以使用。与其他素材同样做基础调级（灰度→百分位拉伸→S 曲线→14–238，每段一套明暗值），统一到暖银灰。黑白素材的上色版、AI 增强版、“修复版”仍排除。地点日期卡始终写素材真实年代，以二十年代语法讲回顾时，不把后期素材冒充二十年代。

## 5. 浏览器

随包渲染器在项目内回环服务上启动自带无头 Chromium；仅在宿主允许时使用，不连接用户浏览器调试端口。内置浏览器用于阅读档案目录页、许可页和目视检查 HTML 预览，不能替代确定性逐帧渲染。

## 6. 画布交付

1. 运行 `scripts/delivery_check.py film.mp4 --srt film.srt --out film/QA_delivery.json`：实际宽高/fps/时长/音轨、完整解码零错误、约 −14 LUFS 且真峰值 ≤ −1 dBFS、黑场有解释（画门、虹膜、片尾卡属正常）、faststart。
2. 带颗粒的母版可能很大（胶片颗粒对 H.264 码率代价高）。母版保留在本地；体积过大不便画布上传（约超过 50 MiB 或平台拒收）时，从同一母版做交付编码（尺寸、fps、音轨、时长不变；H.264 yuv420p，提高 CRF 或限制码率，AAC，faststart），同样运行 `delivery_check.py` 并记录两个文件。不得静默降低分辨率、帧率或去掉音轨。
3. 最终 MP4 以一个媒体节点导入画布。不导入中间帧、分轨或代理渲染。海报、ZIP 附件或进度条完成都不能称为可播放成片。
4. 在实际节点做画布播放检查：播放时时间与画面推进；暂停后继续；暂停中跳到中段等目标帧刷新后再播放；播放片尾。Agent 无法操作画布播放器时记 `canvas_playback=needs_user_check`，请用户按这四项检查，不能报告为通过。
5. 同时放入海报、有字幕时的 SRT，以及一个画布文字说明：来源、事实、QA 状态与可编辑工程位置。
6. 可编辑工程：运行 `scripts/pack_project.py <projectRoot> <zip>`。≤ 50 MiB 与成片一起导入；更大则保留本地，把绝对路径、大小、内容与重建命令（`sh build.sh`）写进画布说明。称“本地可编辑工程”，不能称在线编辑器链接。
7. 不公开发布、不扩大分享范围。

QA 状态词：`passed`、`failed`、`not_run`、`blocked`、`needs_user_check`。技能结构校验不等于 Design 上传、全片渲染或画布验收。
