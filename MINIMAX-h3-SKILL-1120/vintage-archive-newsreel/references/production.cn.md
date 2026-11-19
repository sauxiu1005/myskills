# 技术实施：独立项目，统一时间轴

## 初始化与按需依赖

包内 `vendor/lemo-opuscar/` 是固定源码。初始化只复制相关运行时、许可和素材工具，创建空作品目录；不联网、不安装、不写示例故事、不渲染。

```sh
python3 "$SKILL/scripts/init_project.py" "$WORKSPACE/newsreel-<slug>"
python3 "$SKILL/scripts/check_runtime.py" "$WORKSPACE/newsreel-<slug>"
```

生成结构：

```text
new-project/
  project.json            相对路径、默认规格与上游提交
  runtime/                core、依赖清单、采样/模型下载器、许可
  film/
    tools/footage.py       方案前可用的素材研究工具
    raw/ assets/ fonts/ voice/ audio/ out/ stills/
    SOURCES.jsonl SOURCES.md FACTS.md CREDITS TREATMENT.md QA.md
```

`project.json` 同时记录只读运行时探测结果（Node、Python、内置 FFmpeg 路径、缓存浏览器、Python 模块）。

初始化拒绝已有目标目录，避免覆盖作品；继续已有项目时直接使用已有文件。`film/` 之后由导演制作本片的 `index.html`、`timeline.json`、`audio/mix.py`、配音稿及构建脚本。它不是换标题就能出片的模板。

以下为代码路线的实施参考，工具不可用时按 design-adapter.cn.md 优先替换成平台能力；不是每个项目都必须安装的依赖清单。运行时仅在作品需要时安装，当前环境已有合法依赖可复用。基础参考命令在 `runtime/` 执行：

```sh
# playwright-core 已由 init_project.py 链接到平台副本；仅缺失时才 npm ci --omit=dev
python3 -m venv --system-site-packages .venv        # 复用平台 numpy/scipy/Pillow
.venv/bin/python -m pip install soundfile soxr      # 仅采样器与音频预处理需要
```

`init_project.py` 同时对项目内 `mux.sh` 副本应用 FFmpeg 6.0 兼容修补（见适配文档）。playwright-core 与缓存的 chromium-headless-shell 版本一致时会自动找到（`check_runtime.py` 会列出两者）；仅不一致时设 `PLAYWRIGHT_CHROME`。没有缓存浏览器时先询问再安装。FFmpeg 可能不在 `PATH`（随 Design 应用内置），在 `build.sh` 中导出其目录，供 `mux.sh` 调用 `ffmpeg`/`ffprobe`。上游原封不动的 npm 锁文件含 three（通用依赖），本风格主体仍为 Canvas2D。安装失败检查实际包/浏览器版本，不以“安装过”代替可启动。

声音按需添加，不自动下载全部模型/采样：

- 平台音频或用户录音：导出单句WAV和实测时长；不需要Kokoro模型。
- 本地语音与ASR：按实际需要安装 `requirements-voice.txt` 中相应包；其全量安装包含Kokoro、edge-tts、faster-whisper。英语Kokoro另需 `sh tools/fetch.sh voice`；中文在线edge-tts不需Kokoro模型。
- 物理建模班卓：`requirements-music.txt` 的numba是加速依赖；以代码实际导入为准。
- 真实采样：先读 `core/audio/INSTRUMENTS.md`，按所用声部获取对应 `sh tools/fetch.sh instruments freepats` 等单包。不要默认 `all`；清单含大小/校验和，失配即停止，不能跳过校验。
- 文件源、字体、模型和采样的可用性可能改变。包内提供源码与清单，不包含已安装的二进制依赖；不要为普通新片先复刻整支demo。

## 参考源码的位置与迁移

写完 `TREATMENT.md` 后再阅读以下代码，仅借需要的函数；默认不用原 `demo/build.sh`，它会下载示例档案并复刻原题材。

| 源路径（相对vendor/lemo-opuscar） | 可借用技法 | 本片需重写 |
|---|---|---|
| `styles/newsreel/demo/index.html` | `filmLook`、双层合成、台标、`pencil/ring`、转场、`subBand`、`TEXTS/SUBCHECK` | 具体场景、素材、字卡、品牌、硬编码时长和1920坐标 |
| `styles/newsreel/demo/tools/prep.py` | 整段调级、去噪/缩放、帧序列、扫描页调级 | 文件名、裁切、源区间、地图投影与地点、录音 |
| `styles/newsreel/demo/tools/timeline.py` | 小节/拍→秒、镜头/标签/录音落点 | 全部故事节奏与镜号 |
| `styles/newsreel/demo/audio/mix.py` | 光学播报音色、乐队/唱片压低、放映机、纸张/笔音、左右对答 | 旋律、和声、配器段落、cue、源录音 |
| `styles/newsreel/demo/tools/voice.py` | 英语Kokoro向量混声 | 本片台词、声音、速度；中文不沿用英文lang |
| `styles/newsreel/demo/tools/cues.py`、`subcheck.mjs`、`final_asr.py` | 时长驱动字幕、宽度检验、成片语音检查 | 语言、文件路径、字幕结构 |

原例中的 `HERE.parents[...]`、相对目录和样片文件名不能直接移植。项目脚本统一以环境 `LIB` 指向本项目 `runtime/`，如 `Path(os.environ['LIB'])`；网页 `/core/lib.js` 由随包服务从runtime根提供。原例 `audio/mix.py` 不读取LIB，需要修改自己的副本；不要改vendor。移植后的脚本先实际运行必要检查。

## 时间与画面契约

`timeline.json` 单一来源至少含 `duration, fps, size, sections, shots, hits, lines, tags, clips`，使用何种字段名由本片决定，所有消费者一致。每段记录源入点、出点、播放速率与素材ID；历史录音另记实测拍点/终和弦/唱针事件。帧数由时长和fps推导，并核对实际输出，不直接复制示例1310帧。

```js
window.DUR = duration;
window.render = (t) => { /* 根据绝对时间绘制全部状态 */ };
window.EV = events;
window.TEXTS = (t) => visibleLabelsWithFullTextAndBounds(t);
window.SUBCHECK = () => measuredSubtitleWidths();
// 所有必需素材与字体加载成功后才置true
window.READY = true;
```

图像加载失败必须报告并阻止交付，不能因上游工具称“optional file missing”就忽略本片必需资产。`render(t)` 不依赖前帧状态、墙钟时间或无种子随机；相同时间独立截图一致。影片转24fps JPEG序列，以 `floor((t−shotStart)*24)` 加对应源偏移读取；索引限制在真实帧数内。平台原生视频同样需确认逐帧导出会更新画面，不能只有封面。

画面内标记走统一 world→screen 变换。默认画门原样保留；其他外框尺寸用 `gateW=min(W,H*1480/1080)`、`gateH=gateW*1080/1480` 居中适配，按画门单位缩放。竖版如因此导致字幕过小，应重排/简化并说明取舍，不能仅拉伸原1920硬编码HTML。若用户要竖幅铺满，将其记录为明确偏离1.37画门的变体。

## 图像、声音与检查的实施细节

画面底色调（真实彩色素材同样处理）：灰度→百分位拉伸→轻S曲线 `x+0.18*(x-0.5)*(1-abs(2*x-1))`→14–238。影片整段共享百分位，印刷物黑点抬到26–30。画面层暖银采用 `multiply #efe7d6`、`screen #17140f`，闪烁±3.5%及3Hz慢漂，画门位移约±1.6/±2.2px，少量9帧寿命划痕与单帧灰尘。虹膜透明角落用 `destination-over` 补黑，不能被screen漂成灰角。

光学播报后期参考：高通260Hz、低通3.7kHz，1.5–2.3kHz约+4dB；tanh驱动2、4:1压缩、0.55Hz/0.22% wow、6.3Hz/0.07% flutter、31/67ms短反射。先保清晰，不能为怀旧失真牺牲专名与事实。乐队可限频95–7500Hz，播报下压约4–5dB；原录音噪声只在落针期间出现。

字幕由真实语音时长生成，不以字数估算充当测时。双语每语种单行；需要的字形全在本地字体中。`TEXTS(t)` 报每个标签完整字符串和边界，从首次出现就报完整文字；字幕宽度另由 `SUBCHECK` 和实际SRT检查。若进入动画被通用readcheck误算为阅读时间，额外以入场结束到退出开始计算停留，不用删检测对象逃过检查。

## 本片构建脚本的真实命令

下面展示项目 `build.sh` 的收尾阶段，前提是本片已经有正确资产、配音、timeline和自己的 `film/audio/mix.py`。`LIB` 为runtime，`FILM` 为作品。构建脚本前段需调用本片素材预处理、配音/校对、时间轴更新，外部已有配音则复用。不要照抄示例来源下载与剧情。

```sh
#!/bin/sh
set -eu
PROJECT=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
LIB="$PROJECT/runtime"
FILM="$PROJECT/film"
export LIB
FFDIR=$(python3 -c "import json;print(__import__('os').path.dirname(json.load(open('$PROJECT/project.json'))['runtime_probe']['ffmpeg']['path']))")
export PATH="$FFDIR:$PATH"
PY="$LIB/.venv/bin/python"; [ -x "$PY" ] || PY=python3
cd "$LIB"
node core/render/readcheck.mjs "$FILM" --size 1920x1080
# 若已从参考实现本片SUBCHECK，运行迁移后的film/tools/subcheck.mjs
node core/render/events.mjs "$FILM"
node core/render/video.mjs "$FILM" --fps 24 --size 1920x1080 --workers 3 --out "$FILM/out/video.mp4"
"$PY" "$FILM/audio/mix.py"
"$PY" core/render/srt.py "$FILM/out/cues.json" "$PROJECT/film.srt"
sh core/render/mux.sh "$FILM/out/video.mp4" "$FILM/out/mix.wav" "$PROJECT/film.mp4" 24 7
```

上例的 `cues.json` 必须由本片字幕阶段实际生成；无字幕分支删除SRT步骤。明确静音分支生成无音轨视频并单独做需要的颗粒/编码，不传不存在的mix.wav。其他尺寸/fps同时改所有渲染、帧索引、字幕、安全区与mux参数。目标约−14LUFS、true peak≤−1.2dB是上游默认，最终实测再报告。

验证与接触表命令（从runtime运行，替换实际作品路径）：

```sh
node core/render/still.mjs /actual/project/film --range 0:30:2
node core/render/still.mjs /actual/project/film --range 8:9:0.2 --prefix action_
.venv/bin/python core/render/sheet.py /actual/project/contact.jpg /actual/project/film/stills/t_*.jpg
python3 "$SKILL/scripts/delivery_check.py" /actual/project/film.mp4 --srt /actual/project/film.srt --out /actual/project/film/QA_delivery.json
```

范围改为实际全片与关键动作；另测响度/黑场、用实测台词进行成片ASR、检查字幕cue时长及可读性，完整播放并听审。缩略图存在、工具exit0和结构校验都不能替代审片。没有声音播放能力时写明未听审。

用 `scripts/pack_project.py` 打包。最终源码包含项目源代码、时间轴、素材及许可、构建脚本和版本记录；排除node_modules、venv、缓存与无关资料。依赖可重装，必要素材不能只指向作者机器路径；不再分发的外部素材保留合法恢复步骤并明确重建限制。
