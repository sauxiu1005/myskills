# 随包动画代码的实施

原始实现与工具用法见 vendor 中的 TECHNIQUE.md、core/README.md 和 styles/scifi-toon/demo/。本文件仅说明新项目接线，不更改原版风格。

## 目录与初始化

```sh
python3 /path/to/scifi-comedy-animation-maker/scripts/verify_bundle.py
python3 /path/to/scifi-comedy-animation-maker/scripts/init_project.py /path/to/new-film
```

输出：
- `runtime/`：55个原文件保持原目录与原字节，包括完整随包 `styles/scifi-toon/demo/`、STYLE、DEMO、DIRECTOR、TECHNIQUE、core及依赖清单。
- `film/`：新作目录、原版toon.js、LICENSE、ES module清单、素材子目录和 `tools/`（已验证的兼容兜底，见文末）；还需编写新作角色、场景、时间轴、页面与构建脚本。
- `upstream-manifest.json`、`project.json`：来源哈希、实际路径与“仅初始化”的状态。初始化不联网、不装依赖、不启动TTS或渲染。

原版 demo 的路径拓扑在 runtime 中保留，但其外部字体、语音WAV和模型不随仓库提供，不能称开箱即完成复现。新作运行路径独立，修改工作副本而非安装目录。

## 实现对应关系

| 原文件 | 在新作品中的用途 |
|---|---|
| toon.js | 矩阵栈、曲线路径、屏幕空间恒定线宽、抖线、裁剪硬阴影；保持原版默认 `frame(t)` |
| chars.js | 参数眼睛/眼睑/眉、嘴的开合宽圆弯曲、手、曲线肢体、服装与道具；用这些技法设计原创角色 |
| worlds.js | 具体空间、物件、怪物、配色和传送门；为主题重写世界内容 |
| story.js、main.js | 台词起点、镜头、表演、特效、字幕、音乐事件共享一个时间来源 |
| lines.json、voice.py、asr.py | 逐句配音、按角色处理、打断裁剪、48kHz输出、实际dur/lips、文字核对 |
| music/score.py、mix.py、levels.py | 从cue编曲、程序音效、对白下压、环境声、冷场、分轨测量 |
| srt.mjs、build.sh、sheet.sh、strip.sh | 字幕、构建、整片接触表、连续动作帧条；改成新项目路径 |

阅读 demo 后不要沿用其角色名、场景、曲子和时序作为新作。原风格参考图用于检查复杂度与观感；参数实现来自源代码。

## 路径与依赖适配

在新作 `build.sh` 中由脚本自身位置求 `HERE`，以相邻 `runtime` 为 `LIB`，供Python/Node脚本读用；把原脚本内写死的demo路径与 `../../../core` 改成实际LIB。页面仍通过 `/core/lib.js` 访问运行库，片内模块用相对URL，经原渲染服务加载。

沿用 Node≥20、Python≥3.11、FFmpeg≥7。按任务安装 runtime 的npm依赖、匹配浏览器和项目venv；参考原requirements，口型脚本额外需要librosa。Kokoro/ASR模型按选用声音流程准备，平台TTS则提供同样的逐句WAV契约。不要运行未打包的setup或全库下载器。

`fonts/fonts.css` 引用了未附带的字体二进制。原示例使用的字体及许可见其CREDITS，实际下载/提供字体后再加载；新增语言选择完整覆盖该语言字形的字体。确认字体就绪才设置READY。

保留原toon.js的1920×1080基准与默认抖线/线宽；别加入v1.0.1的 `amp: 0` 覆盖。其他画幅按TECHNIQUE改布局与渲染尺寸，而非简单拉伸输出。

## 时间轴与声音

先记录每句ID、角色、TTS/字幕文本、音频文件及源入出点，再实测处理后时长。声音可以来自平台，但嘴型须由本片逐句录音重新提取RMS与频谱重心。统一story时间轴输出画面、字幕、音乐和音效；不复用示例的dur/lips/words作为新片数据。

页面提供 `window.DUR`、确定性的 `window.render(t)`、`window.READY`，按实际需要提供EV/TEXTS。按TECHNIQUE使用still/events/video/readcheck、score/mix/SRT和mux；平涂卡通将mux的grain设为0。构建新作时使用已完成配音，除非明确重生成，避免TTS变长破坏时间轴。

渲染命令示意（仅在新作页面、资源和时间轴完成后）：

```sh
cd /path/to/new-film/runtime
node core/render/still.mjs ../film 0.5 5 12 --out ../film/stills
node core/render/events.mjs ../film
node core/render/video.mjs ../film --fps 24 --workers 2 --out ../film/out/picture.mp4
sh core/render/mux.sh ../film/out/picture.mp4 ../film/audio/mix.wav ../film/out/film.mp4 24 0
```

实际依赖、素材与许可写入新作CREDITS；默认不把示例LemoLab/模型署名片尾带到用户作品中。

## 已验证的环境兜底

来自一部 79 秒成片在 macOS + ffmpeg 6.0 下的实际制作。优先走上游路径，仅在出现对应症状时切换，并在 BUILD 说明中记录。

| 症状 | 兜底做法 |
|---|---|
| ffmpeg 6.x 下 `mux.sh` 报 “only X s of the Y s could be decoded” 而中止，或 scipy 写出的 WAV 没有声道布局 | `sh film/tools/mux_compat.sh picture.mp4 mix.wav out.mp4 DUR 24`：测量值有限时执行两遍 loudnorm（−14 LUFS、TP −1.2）；静音或非有限值跳过归一化，加 `aformat=channel_layouts=stereo`，用 `atrim=0:DUR` 截断而非 `-shortest`，grain 0 |
| 无法安装 `soundfile`（或 soxr） | 把 `film/tools` 放到 `PYTHONPATH` 最前；`soundfile.py` 以 scipy 提供 `read`/`write`。装好真包后移除 |
| 毫秒取整后相邻字幕重叠 | 在本片 SRT 导出中加校验（有序、非空、结束 ≤ 下一条开始 − 20 ms，否则中止），并运行 `python3 film/tools/check_srt.py out/film.srt` |
| macOS 没有 `timeout` 命令 | 用工具自身限制或后台任务加轮询控制长渲染，不依赖 GNU `timeout` |
| 需要封面 | 在本片页面加 `?view=cover` 视图，用上游 still 工具渲染，不截取视频帧 |
| 微缩密集镜头在 1080p 下线条糊成一团 | 对该组局部降低线宽（如按镜头的 `lwScale`），不改 toon.js 默认值 |

台词读法与屏幕文字需不同时（如表盘写 “66 MILLION YEARS AGO”，配音读 “sixty-six million”），保留字幕文本，在 lines.json 另设朗读字段给 TTS。
