# 后期包装：拼接、歌词字幕与卡拍效果

视频模型负责画面本身；准确的文字、卡在拍点上的闪切和组与组之间的转场，用 ffmpeg 在后期做最稳。后期包装适合所有风格，不只是夜店或 Y2K：只要是带歌词的歌，歌词字幕通常都值得做，样式随歌曲风格变化。下面的命令都实测可运行。

## 拼接与铺音乐

视频模型返回的时长常比请求多零点几秒。先把每段裁到计划组长、统一分辨率和帧率，再拼接，总长才和音乐一致；多段累积的偏差会让口型越往后越偏。

```bash
ffmpeg -i g01.mp4 -t 12 -an -vf "scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,fps=24" -c:v libx264 -crf 18 g01_t.mp4
# concat 列表拼接后，去掉视频自带声音，从 0 秒铺整条定稿音乐
ffmpeg -i video.mp4 -i master.wav -map 0:v -map 1:a -c:v copy -c:a aac -b:a 320k -shortest final.mp4
```

需要淡出时，在最后一秒左右加 `afade=t=out:st=<总长-1>:d=1`。画面滤镜要保住清晰度：复古、低清、颗粒感优先在生成时写进提示词，后期只加轻微颗粒和调色，不把画面压低分辨率再放大。

### 延长或重排音乐

歌比需要的短、要补前奏尾奏或重复段落时，同一份音频要用几段就输入几次，每段从自己的输入里裁。用 `asplit` 把一路音频分给多个 `atrim` 再串 `acrossfade`，实测会卡住，输出只有前十几秒有声，后面全是静音。

```bash
# 原曲 103 秒，前面补 4.4–13.3 秒这段器乐当前奏，再重复副歌 60–68 秒放在结尾，共约 120 秒
ffmpeg -i song.mp3 -i song.mp3 -i song.mp3 -filter_complex \
 "[0:a]atrim=4.444:13.333,asetpts=PTS-STARTPTS[pre];[1:a]asetpts=PTS-STARTPTS[body];\
  [2:a]atrim=60:68.2,asetpts=PTS-STARTPTS[rep];\
  [pre][body]acrossfade=d=0.1[x];[x][rep]acrossfade=d=0.1,atrim=0:120,afade=t=out:st=118.8:d=1.2[out]" \
 -map "[out]" -c:a pcm_s16le master.wav
```

拼出来比目标短时，再补一段音乐，不用 `apad` 补静音凑时长。

### 每次处理完音频都查一遍有没有声

改过音乐、铺过音乐，都用静音检测确认整条有声，结果里出现长段静音就是坏了，查原因重做，不交付：

```bash
ffmpeg -i master.wav -af silencedetect=noise=-45dB:d=2 -f null -
```

除了开头结尾的淡入淡出，不应出现超过两秒的 `silence_start`。终剪成片同样查一次。

## 节拍表

卡拍效果的前提是知道拍子在哪。从定稿音乐的分析或转写里得到 BPM 和关键时间点（第一拍、副歌和 drop 的起点）：

- 一拍 = 60 / BPM 秒，一小节（4/4）= 240 / BPM 秒。128 BPM 时一拍约 0.469 秒，一小节 1.875 秒。
- 第 n 拍的时间 = 第一拍时间 + n × 拍长。重拍、小节线、副歌和 drop 起点是最值得放效果的位置。
- 分析出的 BPM 和写歌时设定的 BPM 不一致时，以实测为准，并顺手核一两个重拍的位置。

## 花字图层（overlay）

系统字体只能做出“字幕”，做不出材质和造型。片名、Hook、关键词这类要好看的字，先用图像模型做成透明底的花字图（字形、材质、颜色、光效写清楚，原文逐字给出，要求透明背景），再叠到视频上。同一句可以做两三个变体（不同颜色、破碎版、描边版）在重拍上切换，形成跳字。

```bash
# 1–3 秒出现在画面中央，每拍（128 BPM，0.469 秒）从 1.6 倍砸回原大
ffmpeg -i video.mp4 -loop 1 -t 4 -i hook.png -filter_complex \
 "[1:v]format=rgba,scale=w='trunc(800*(1+0.6*exp(-10*mod(t\,0.469)))/2)*2':h=-2:eval=frame[w];\
  [0:v][w]overlay=x=(W-w)/2:y=(H-h)/2:eval=frame:enable='between(t\,1\,3)'" -c:a copy out.mp4
```

`800` 是花字显示的基础宽度；位置可以用 `x`、`y` 表达式做位移和抖动（如 `x=(W-w)/2+8*sin(t*40)`）。多张花字图依次 `overlay`，各自用 `enable` 控制出现时间。

**混合模式要在 RGB 里算。** `blend`（screen、multiply、overlay、add 等所有模式）是逐个通道做数学运算的，输入是什么像素格式就在什么格式里算。视频默认是 YUV，两个色度通道也会被当成亮度一样去混合，结果整片偏色（黑底 screen 变紫、multiply 变绿等），而且和叠的是什么颜色无关。所以两路输入都先转成 RGB 再混合，混完再转回 YUV：

```bash
[0:v]format=gbrp[a];[1:v]format=gbrp[b];[a][b]blend=all_mode=screen,format=yuv420p[v]
```

这样叠上去的颜色就是图层本来的颜色；想要整体染紫、染红，也是在 RGB 里混合才能得到准确的颜色。只需要覆盖不需要混合时，图层带透明通道（PNG、`format=rgba`）直接 `overlay` 即可，`overlay` 会按透明度正确合成。做完任何叠层，抽一帧和原片对比，确认颜色变化是自己想要的。

## 歌词字幕（ASS）

用转写得到的逐句时间轴生成 ASS 文件，文字用确认过的歌词校正，再用 `ass=` 烧录。ASS 能做的远不止白字底栏，先按 [包装](packaging.md) 里“文字是设计”的思路定好字形、颜色、排版和动效，再写样式；默认字体白字居中只是能显示，不是设计：

- **样式随歌曲风格变。** 字体、字号、颜色、描边、阴影、位置（`Alignment` 底部 2、中间 5、顶部 8，或 `\pos(x,y)` 自由放）都可以按风格设计。古风可用竖排或宋体系、留白处落字；说唱可用粗黑体、大字压在画面中间；Y2K 可用荧光粉蓝、描边加像素感；抒情歌可以细字、低对比、慢淡入。
- **动效。** `\fad` 淡入淡出；`\t(...)` 在时间内渐变缩放、字距、颜色、透明度；`\k` 卡拉 OK 逐字变色；`\move` 位移；`\frz` 旋转；`\blur` 柔化。
- **主次。** 普通句用一套克制的样式，Hook 或关键词换成大字样式，在重拍上弹出。
- **位置避开人脸。** 竖屏人物多在中上部，字幕放下三分之一或画面留白处；需要大字时，提示词里可以提前给画面留出空间。
- **字体。** 中文要指定系统里确实存在的中文字体，并用 `fontsdir=` 指向字体目录；先用 `fc-list :lang=zh` 看有哪些可用，不要用不含中文的字体（会显示方块）。

```ass
[Script Info]
ScriptType: v4.00+
PlayResX: 1080
PlayResY: 1920

[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
Style: Lyric,Noto Sans CJK SC,64,&H00FFFFFF,&H00FF66FF,&H00200020,&H80000000,1,0,0,0,100,100,2,0,1,3,0,2,80,80,220,1
Style: Hook,Noto Sans CJK SC,150,&H0000F0FF,&H00FFFFFF,&H00000000,&H00000000,1,0,0,0,100,100,6,0,1,6,0,5,40,40,0,1

[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
Dialogue: 0,0:00:00.20,0:00:01.90,Lyric,,0,0,0,,{\fad(120,120)}{\k30}今{\k30}夜{\k30}不{\k30}睡
Dialogue: 0,0:00:02.00,0:00:02.90,Hook,,0,0,0,,{\fscx220\fscy220\alpha&HFF&\t(0,90,\fscx100\fscy100\alpha&H00&)\t(600,900,\alpha&HFF&)}炸
Dialogue: 0,0:00:03.00,0:00:04.50,Lyric,,0,0,0,,{\an8\pos(540,300)\fad(80,80)\t(0,1500,\fsp20)}跟着鼓点
```

依次是：逐字变色的普通歌词；从 2.2 倍砸回原大小、再淡出的 Hook 大字；顶部字距慢慢拉开的一句。颜色是 `&HAABBGGRR`（透明度、蓝、绿、红）。

**每一句都要有动效。** 所有歌词都用同一种淡入淡出、整句平放，看起来就像打字幕。普通句也要有进出场和节奏感，Hook 和高能段更要放开。常用组合（`\t` 的时间是相对这一句开始的毫秒）：

```ass
; 砸入：从 2.6 倍、全透明，80ms 砸回原大，结尾压扁消失
{\pos(960,540)\fscx260\fscy260\alpha&HFF&\t(0,80,\fscx100\fscy100\alpha&H00&)\t(1000,1200,\fscx140\fscy60\alpha&HFF&)}KICK
; 同一句再叠一层偏色、错位、模糊的影子（放在 Layer 0），形成故障残影
{\pos(972,540)\c&H00FFFF&\alpha&H80&\fscx260\fscy260\t(0,80,\fscx100\fscy100)\t(80,200,\pos(940,540))\blur6}KICK
; 逐字弹出：每个字间隔一拍或半拍出现，整句斜放
{\an4\pos(260,420)\frz-8\alpha&HFF&\t(0,60,\alpha&H00&)}心{\alpha&HFF&\t(120,180,\alpha&H00&)}跳{\alpha&HFF&\t(240,300,\alpha&H00&)}在{\alpha&HFF&\t(360,420,\alpha&H00&)}燃
; 从画外滑入、贴边放置的副词条
{\an6\pos(1700,700)\c&H0000FF&\3c&HFFFFFF&\frz-8\move(1900,700,1700,700,0,120)}HEART RACE
```

还有这些手段：每拍一闪的描边或颜色（多个 `\t` 按拍子排）、整句随拍子轻微缩放、字距从紧到松、`\clip` 做擦除出现、按拍子换位置（一句拆成几行，分别出现在画面不同地方）。高能段同一屏可以有大字主句加小字副词条，大小、颜色、角度形成对比。

```bash
ffmpeg -i video.mp4 -vf "ass=lyrics.ass:fontsdir=/usr/share/fonts" -c:v libx264 -crf 18 -c:a copy out.mp4
```

片名或一两个静态大字也可以用 `drawtext`，`alpha` 表达式做淡入：

```bash
drawtext=fontfile=/path/to/cjk.ttf:text='长安':fontsize=200:fontcolor=white:x=(w-text_w)/2:y=(h-text_h)/2:alpha='if(lt(t,0.5),t/0.5,1)'
```

## 卡拍效果

用 `enable` 让效果只在拍点或某个区间出现，`mod(t-起点, 拍长)` 得到“距上一拍过了多久”。下面以 2.0 秒起、128 BPM（拍长 0.469）为例：

- **逐拍闪白**（drop 段）：`drawbox=x=0:y=0:w=iw:h=ih:color=white@0.85:t=fill:enable='lt(mod(t-2.0\,0.469)\,0.06)*between(t\,2.0\,10.0)'`
- **重拍色差抖动**：`rgbashift=rh=12:bh=-12:enable='between(t\,2.0\,2.12)'`
- **每拍冲推（punch zoom）**：`scale=w='iw*(1+0.12*exp(-12*mod(t,0.469)))':h=-2:eval=frame,crop=1080:1920`
- **每拍亮度脉冲**：`eq=brightness='0.25*exp(-15*mod(t,0.469))':eval=frame`
- **拖影 / 残影**（迷幻、慢段）：`tblend=all_mode=average` 或 `lagfun=decay=0.9`
- **颗粒**：`noise=alls=12:allf=t`

多个效果用逗号串在同一条 `-vf` 里。强度跟着音乐能量走：主歌可以只有轻微脉冲，副歌和 drop 再放开闪白、冲推和跳字。整屏闪白每秒三次以内（光敏安全），局部闪光、冲推、色差、跳字不受这个限制。

### 高能段的强烈变化

电子、VJ、舞曲的 drop 和副歌，观众要的是每拍都有变化、每小节都有大变化。单一的亮度脉冲太弱，要几种手段叠加，按拍子分层：每拍一次小冲击（冲推加色差），每两拍换一次色相，每小节一次大事件（反相或闪白）。下面这条实测可用（128 BPM，拍长 0.469）：

```bash
ffmpeg -i drop.mp4 -vf "\
scale=w='trunc(iw*(1+0.12*exp(-14*mod(t\,0.469)))/2)*2':h=-2:eval=frame,crop=1920:1080,\
rgbashift=rh=30:bh=-30:enable='lt(mod(t\,0.469)\,0.08)',\
hue=h='mod(floor(t/0.938)\,2)*180',\
negate=enable='between(mod(t\,1.876)\,0\,0.06)',\
drawbox=x=0:y=0:w=iw:h=ih:color=white@0.85:t=fill:enable='between(mod(t\,1.876)\,0.938\,0.988)'" -c:a copy out.mp4
```

依次是：每拍冲推；每拍开头 0.08 秒强色差；每两拍色相翻转 180 度（红变青，换成另一套色）；每小节第一拍反相一帧；每小节第三拍闪白一帧。`crop` 的尺寸改成成片分辨率。可以再加：每小节一次画面上下翻转或镜像（`hflip`、`vflip` 配 `enable`）、`lagfun` 拖影、高能段之间穿插 2–4 帧的纯黑或纯色帧。

这些后期效果只是加强，画面本身也要强：提示词里写大尺度事件（激光扇面炸开、整面屏翻色、人群同时跃起、镜头高速穿越），切镜按拍子来（见 [分镜](storyboard.md)）。

## 组与组之间的转场

硬切适合快节奏；需要转场时，用 `xfade` 把两段接起来，效果名可以呼应风格：`fade`、`fadeblack`、`fadewhite`（闪白转场）、`pixelize`（像素、Y2K）、`dissolve`、`radial`、`circleopen`、`slideleft`、`smoothup`、`hblur`、`zoomin` 等。

```bash
ffmpeg -i a.mp4 -i b.mp4 -filter_complex "[0][1]xfade=transition=pixelize:duration=0.4:offset=11.6,format=yuv420p" ab.mp4
```

`offset` 是转场开始的时间（第一段时长减转场时长）。转场会吃掉重叠的这段时长，用 xfade 时要相应调整组长，保证总长仍等于音乐。水墨晕开、纸片撕开、光线扫过这类和画面内容结合的转场，更适合在生成时写进提示词（上一组最后一镜和下一组第一镜各做一半），后期只负责接上。

## 交付前看一眼

- 技术检查：能播放，时长、分辨率、帧率正确，整条有声（跑一遍静音检测）。
- 内容检查：抽看几帧，确认字有设计感、和画面风格一致，没有方块字和错字、没有压住脸，效果卡在拍上，人物没有崩坏，没有黑屏。高能段数一下切镜是否跟上了拍子。
- 如实告诉用户：哪些步骤失败后重试成功、哪组没生成出来、用什么补的、还有什么已知问题。
