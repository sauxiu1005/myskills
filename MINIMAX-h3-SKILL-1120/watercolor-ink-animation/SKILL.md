---
name: watercolor-ink-animation
description: '用代码逐帧绘制水彩水墨卡通视频（MP4）：动画短片、水彩水墨 MV、歌词动画、循环动图，先做样片再出整片。不用于 AI 生图/生视频或 3D 动画。

  '
trigger-words:
- watercolor ink animation
- painted animation
- watercolour cartoon
- lyric video
- 水彩水墨动画
- 水彩动画
- 水墨动画
- 手绘动画
- 手绘 MV
- 歌词动画
- 卡通短片
- 动画样片
- 循环动图
---

# 水彩水墨动画

完全用代码制作短动画：每一帧都由 p5.js + p5.brush 在无头 Chrome 中绘制（水彩填色、抖动的墨线），再用 ffmpeg 编码成 MP4。适用于动画短片、音乐 MV、歌词动画和无缝循环动图，主角可以是 Clawd，也可以是用同一套工具画出的任何角色。全程不使用图像或视频生成模型，画面刻意保持平面 2D。

方法源自 [JohnHeibel/PDoomVideo](https://github.com/JohnHeibel/PDoomVideo)（一部 156 秒的手绘 MV）及其工具包 [ClaudeAnimationBase](https://github.com/JohnHeibel/ClaudeAnimationBase)（MIT），后者以 `template/` 的形式随附。每一帧都是时间 `t` 的纯函数：`studio.html` 加载场景文件，每个镜头绘制完整的 1920×1080 画面，`render.mjs` 负责渲染审查用的联系表或成片的每一帧。

## STEP 1：搭建工程

```bash
bash <skill-dir>/scripts/new_project.sh <project-dir>     # <skill-dir> = 本文件所在目录；--keep-demo 保留示例；--help 查看选项
```

- 脚本先检查 node / npm / ffmpeg / Chrome，缺少任何一项都会以退出码 2 结束并给出安装提示；随后复制模板、摘掉示例场景并安装依赖。如果 npm 或 ffmpeg 不在 PATH 里，设置 `NPM="node /path/to/npm-cli.js"` 和 `FFMPEG_PATH=/path/to/ffmpeg`（`render.mjs` 也接受 `--ffmpeg=<path>`）。所有脚本都支持 `--help`。
- 设计之前**完整阅读 `<project-dir>/ANIMATION_GUIDE.md`**：其中包含规则、动画原理以及完整的引擎 / Clawd API。查看角色设定图 `docs/emotions.jpg` 和 `docs/views.jpg`。
- 音乐 MV 或超过约 20 秒的作品，还要阅读 [references/music-video.md](references/music-video.md)。

## STEP 2：先定配乐（有配乐时）

画面按节拍剪辑，所以要在设计镜头之前定下配乐；之后再换音乐就得重新对拍。

- **先听情绪。** 在一首曲子上开工前，先逐段描述它（乐器、和声、有没有尖锐、嗡鸣或诡异的声音）。曲子在技术上没问题，也可能让观众觉得吓人；温柔的故事需要有旋律、和谐的配乐。生成音乐时，要明确写出旋律、乐器，以及“不要嗡鸣、不要不协和、不要尖锐高音”。
- **实测，不要轻信。** 对实际文件运行 `scripts/beat_grid.py`：生成的音乐常常不遵守要求的 BPM，听着像 120 的曲子可能实际是 78.9 BPM。以实测速度和实测拍点为准。
- **按能量选段。** 选择安静前奏、起势、高潮和平静收尾正好落在故事需要位置的那一段，并从拍点开始截取，使节拍落在片段时间 `n·BEAT` 上。
- 如果镜头做好后才换配乐，就把镜头起点和按拍触发的事件重新对齐到新节拍上；只有差异很小（≲ 5%）时才拉伸音频，拉伸过多会明显改变音乐听感。
- 细节（LRC、歌词时间、截取音频）：见 [references/music-video.md](references/music-video.md) 第 1 节。

## STEP 3：先写分镜，再写代码

- 编写 `STORYBOARD.md`（格式见指南：一句话梗概、世界观与配色走向、母题、角色情绪线，然后是带 **reads** 的镜头表，即观众必须依次看懂的内容及时间）。完整示例：[references/examples/xiaozhen/](references/examples/xiaozhen/)，一部 31 秒的歌词 MV，包含分镜和全部场景代码。
- 即使只要样片，也要写**整片**分镜，并把样片区间标为 `Sample: a–b s`（通常选高潮、drop 或点题段落，而不是开头）。
- 开工前把分镜给用户看，除非用户说直接做，或者只要样片。

## STEP 4：逐镜构建

- 在 `src/config.js` 中设置 `duration`、`bpm`、`offset` 和 `audio`。
- 每个场景 / 章节在 `src/scenes/` 中一个文件，用 IIFE 包裹，以 `shots([[t0, fn], ...])` 结尾；按顺序把它的 `<script>` 加进 `studio.html`。
- 先摆关键姿势，作为静帧检查，再补中间的动作。
- 镜头起点对齐到拍点（`B(n) = n·BEAT`），而不是整数秒，这样换速度时只需改拍数。

## STEP 5：渲染并检查，每个镜头看多次

读代码看不出动作。在工程目录下：

```bash
node render.mjs --sheet=0.1,0.8,1.6,2.4 --cols=4 --w=480 --out=out/check/a.jpg        # 关键帧
node render.mjs --strip=2.1:2.6 --out=out/check/strip.jpg                             # 某一刻的每一帧
node render.mjs --sheet=2.3 --crop=760,420,500,400 --w=500 --out=out/check/face.jpg   # 全分辨率细节
```

- 逐张查看图片，对照指南的审查清单：事件清楚吗？角色够大吗？reads 的时间够第一次看的观众理解吗？有预备动作和跟随动作、没有突变吗？接触点贴合吗？每个接缝都有转场吗？没有文字、没有 3D、没有纯黑纯白、没有发脏的光晕吗？修改后再看。
- 预算：每个镜头至少一张联系表，每个关键动作和转场一条逐帧序列，每张承载剧情的脸一张特写。
- 请人或工具检查画面时，要写明在**当前时间线**下每个时间点应该出现什么；重新对拍后沿用旧预期会产生误报。
- 整屏切镜闪白在静帧上看起来像空白帧；控制在约 0.1 秒，并且是有意为之。

## STEP 6：先做样片，再做整片

样片就是正片里最有代表性的一段，在同一个工程里构建，整片可以复用全部代码。

1. 只构建覆盖样片区间的镜头，并至少用一张联系表检查。
2. 渲染：`node render.mjs --sample=a:b`（或用 `--sample=20` 表示 0–20 秒）→ 输出 `out/sample.mp4`，并带上 `PROJECT.audio` 的对应片段。它会打印每帧耗时、整片渲染预估和已构建的镜头起点。
3. 汇报后停下：路径、区间、时长、分辨率、预估时间，以及分镜里还有哪些镜头没做。用户只要样片时，交付后就停在这里。
4. 用户要整片时，留在同一个工程里，保留样片的镜头代码。如果样片成为更长影片的中段，就导出它的镜头函数并整体平移注册（`shot(t − S0)`），`S0` 落在拍点上；去掉样片自己的结尾（iris / 淡出），让影片继续往下走，再在它前后补新镜头。

## STEP 7：渲染并交付视频

```bash
node render.mjs --clip --out=out/video.mp4                                 # 短视频（≲ 20 秒），单 worker
node render.mjs --frames && node render.mjs --encode --out=out/video.mp4  # 较长视频，可断点续渲
```

- `--encode` 默认合入 `PROJECT.audio`（`--audio=x` 可覆盖，`--audio=none` 输出无声），没有写入音频时会给出警告。
- 长时间渲染会超出工具调用的时间限制。要完全脱离会话启动，避免超时连带杀掉 Chrome，然后轮询：`(nohup node render.mjs --frames > out/render.log 2>&1 < /dev/null &)` 和 `ls out/frames | wc -l`。只有工程输入、帧率和循环设置都未变化时才会续渲；修改后会自动清除旧帧，需重新运行 `--frames` 再编码。`--workers=N` 在强 GPU 上更快，但在笔记本上可能触发导航超时。
- **汇报前先探测 MP4**：时长、尺寸、帧率，有配乐时确认存在音频流。无声交付是最容易漏掉的错误。
- 汇报成片、时长、每帧耗时、抽查了什么和没有检查什么（整片很少逐帧看完），以及这种媒介的局限（平面 2D；环绕和滑动变焦都是用视差层模拟的）。

## 最重要的规则

以下是指南规则的浓缩版，以指南为准。

1. **手工媒介。** 只用 `paint()` / `inkLine()`（p5.brush），不用普通 p5 的 `rect` / `ellipse` / `fill`。只做平面 2D：转身通过绘制的关键视角完成（`turn()`、`spinView()`），不用 3D 投影。光用 `glow()`（叠加），因为颜料混合会让蓝底上的黄色变绿。
2. **不出现文字。** 不要字幕、标签、招牌或对话气泡；用画面表达。反应用画出来的表情符号。例外是歌词 MV 的卡拉 OK 字幕，以及少量大号拟声字。
3. **每个镜头都有事发生**：一个事件、因果反应、有铺垫有回收。
4. **给观众时间。** 列出每个镜头的 reads；一次只传达一件事；动作快、意义停留；引导视线；由 reads 决定镜头长度。这是生成式动画最常失败的地方。
5. **画面是活的。** 没有静止的东西（来自 `feel()` 的待机动作、漂移的镜头、线条抖动）；表情通过 `emotions()` 变化，不直接替换；角色要大（中景 u≈20–28，特写 40–70）；一切跟着节拍走。
6. **每个接缝都要转场**，按剧情选择（笔刷擦除、iris / 异形 iris、甩镜、匹配剪辑、动作剪辑、镜头穿越）。
7. **浑然一体。** 一个世界、一条色彩走向、一条情绪线、相互关联的场景，结尾与开头呼应。

## 引擎注意事项

- **`t` 的纯函数。** 帧是并行、乱序渲染的：不能跨帧保存状态，不能用 `Math.random()`，不能逐帧模拟物理。稳定随机用 `hash(i)`，抖动用 `jit()`。
- **`boilSeed(key)`**：每个独立的背景元素或道具前都要调用，否则一个移动的物体会让它之后绘制的所有东西每帧重新抖动。
- **全局名不要和 p5 重名**（`line`、`text`、`color`、`scale` 等）：顶层的 `function line()` 会报 `Cannot redefine property`，页面永远不会就绪。把辅助函数放在场景 IIFE 内部。
- **门洞、窗户和屏幕的层次**：先画里面的内容，再把四周的框重新画在上面。
- 点列表里出现 `NaN` 会抛出 `Failed to construct 'OffscreenCanvas'`；要防住退化几何。
- 镜头缩放 ≳ 2 时，描边粗细会随缩放变化，特写里要相应调小 `sw`。
- 开销 = 填色和笔画的数量。目标约 ≤ 1.5–2.5 秒/帧（日志会打印每帧耗时）；优先用更少、更大的形状。没有真 GPU 时水彩填色很慢；`--soft-gl` 是最后的手段。
- macOS：渲染器使用 `--use-angle=metal`，并自动找到 `/Applications/Google Chrome.app`；否则传入 `--chrome=<path>`。

## 扩展

- Clawd 是默认主角，不是必需。新角色、道具和表情用同样的工具（`paint`、`ribbon`、`through`、`glow`）绘制，并在各镜头中保持造型一致；新表情加到 `src/clawd.js` 的 `EMO` 中。
- `src/karaoke.js` 通过 `core.js` 中的 `window.overlayHook` 为歌词 MV 提供逐字卡拉 OK 字幕。
- `LOOPS.name = t => {...}; LOOPS.name.len = 4;` 加 `node render.mjs --loop=name --png`，可以做无缝循环动图。
- 长视频拆给多个并行助手制作，见 [references/music-video.md](references/music-video.md) 第 4 节。
