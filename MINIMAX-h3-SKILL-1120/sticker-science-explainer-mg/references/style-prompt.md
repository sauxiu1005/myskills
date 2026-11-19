# 粗描边贴纸人科普 MG（贴纸风格） Bold-outline Sticker Explainer MG (sticker style)

**原片**：一部手机里，藏着多少种元素？ 70/118 · 1920×1080 · 30 fps · 10 秒 · AI 评审终评 7.71 / 10

**源码**：[demos/19-paperclip/](../toolkit/demos/19-paperclip/)

## 怎么用

1. 新建一个空文件夹，在里面打开一个能写代码、能执行命令的 AI 助手（例如 Claude Code）。本机需要能跑网页渲染（Node + Chrome）和 ffmpeg。
2. 把下面「提示词」整段复制进去发送。
3. 想换成自己的内容：改 `Creative seed` 里的故事、品牌名、文案和配色，或者改 `Output` 里的尺寸（比如竖屏 1080×1920）。不要删 `Signature features` 那一段，它是这种风格被一眼认出来的依据。
4. 想再提高：成片出来后，另开一个 AI 用 [rubric.md](rubric.md) 评审，把评审意见贴回给制作的 AI 再改一轮。原片就是这样改了两轮。

## 提示词

```text
You are the director, motion designer, engineer and sound designer of ONE 10-second motion-design film.
The goal is the most classic, yet most stunning form of this style — award-shortlist / high-end commercial quality. A clean,
template-looking result is a fail. Benchmarks: Buck, ManvsMachine, Ordinary Folk, Giant Ant, Territory Studio, Apple keynote
motion, Pentagram motion identities, top Behance/Motionographer features, top 抖音/B站 designer accounts.

# Style
粗描边贴纸人科普 MG（贴纸风格） Bold-outline Sticker Explainer MG (sticker style)

# Output (fixed)
- 1920×1080, 30 fps, exactly 10.000 s (300 frames), H.264 MP4 with stereo AAC audio (48 kHz), mastered to −14 LUFS
  integrated, true peak ≤ −1 dBTP. Final file: video.mp4.

# Camera mode (keep ONE block below, delete the other)
[A · Fixed view — default] One fixed 1920×1080 stage. The camera never pans; at most a gentle ≤5 % push-in/pull-out.
Stickers, text and charts enter, change and leave inside the frame; each chapter is a new page layout, changed with a hard
cut or an element-led slide/wipe. Old stickers never drift out of frame with a moving camera.
[B · Camera moves] One giant canvas (e.g. 6000×3000 px) with a camera layer that pans and zooms on long eases, one
continuous path linking all information points; stickers leave frame as the camera travels on. Keep every stop held long
enough to read.

# Suggested technical route
HTML: a deterministic stage following the camera mode above, SVG charts, photo stickers with 10px white outline
(You may choose a better route if it clearly raises quality; say why.)

# Creative seed
「贴纸风硬核科普」The sticker-style knowledge-video look: sticker-ized photos + flat icons + precise charts, staged according to the chosen camera mode.
- Topic (write your own tight copy), e.g. 「一部手机里，藏着多少种元素？」.
- Calm blue-grey/off-white canvas (#E9EEF2 + slate), 2–3 colours + one accent (e.g. #FF5A36); equal-weight sans typography, strict alignment.
- Beats in order (chapters in mode A, camera stops in mode B): sticker phone photo (white 10px outline, soft shadow) → exploded-parts stickers with leader-line labels → periodic-table grid where element tiles light up → bar chart grows with count-up "70+" → world map with supply routes drawing → a bold typographic title card in the sticker-explainer manner (heavy sans, huge number, small caption).
- Every beat introduces a new visual element; charts are exact (bars to scale, numbers consistent).
- Page system (keep it on every chapter): top-left chapter heading (small accent square + number + title, e.g. 「■ 01 拆开一部手机」); a chapter progress bar along the bottom or bottom-right that highlights the current chapter; small footnotes under charts (data source / 示意比例). 3–6 concrete stickers per page (objects, people, places — not only abstract symbols), mostly 2–3 colours with one warm accent. Give every sentence and key number enough reading time (≥1 s held after it settles).
Sound: clean tech-explainer bed, UI clicks, ticking during count-up, soft whoosh on chapter changes (mode A) or camera moves (mode B).

You are the director: you may change the concept, copy, story beats and brand names if you find a stronger idea, but the result must remain the CANONICAL, instantly-recognisable form of this style and must hit its signature features below.

# Signature features and key techniques (the result is judged against these)
中文知识区的标准包装：实拍图片抠图后加粗白描边变成『贴纸』，与扁平图标、数据图表一起排在版面上：固定视角时画面内元素逐个入场、变化、退场，按章节换版面；运镜时铺在大画布上，镜头平移缩放串联信息点；财经、跨学科类视频也常将其与手写板书、公式卡片结合。至今仍是硬核科普、财经知识区、企业宣传片的主流范式。
视觉特征 照片贴纸化（粗白描边）, 蓝灰/米白冷静底色, 扁平图标+精确数据图表, 章节版面（章节标题+进度条+注脚）+ 所选镜头方式（固定视角或大画布运镜）, 信息密度极高的节拍化叙事
关键技法 素材照片抠图 + 8~12px 白描边统一质感，消除图片来源差异
镜头方式二选一：固定视角——镜头不平移，最多 ≤5% 轻推拉，信息变化靠画面内贴纸、文字、图表入场退场，章节间硬切或元素滑动/擦除转场；运镜——超宽大画布，摄像机层平移/缩放（ease 长曲线），一镜串多个信息点
图表动效：柱状图生长、数字滚动计数、路径描边生长
解说词逐句驱动画面元素入场，语速快、每句必有新视觉元素
克制配色（2~3 色）+ 等线字体，保持『严肃感』

# How to work
1. Treatment. Write down one clear idea: a hook in the first 0.5 s (never open on more than 0.3 s of empty or black), an
   escalation, one unmistakable hero moment at ~60–75 % of the runtime, and a composed end frame held ~0.8–1.2 s with living
   micro-motion. Map every signature feature above to a moment. Keep one cue sheet (beats and hit times) that both the
   picture and the sound read from.
2. Key frames before motion. Build the look, render stills at 6–10 key times and actually look at them. Each still should be
   poster-worthy: composition, hierarchy, negative space, type set properly (kerning, line-height, weight contrast, CJK
   punctuation, ~5 % safe margins). Iterate until nothing looks default, generic, cramped or "AI-template".
3. Motion. Build the choreography and preview at low resolution. Step through the fastest moves frame by frame: spacing,
   easing, arcs, overlap, anticipation and follow-through, motion blur. No unintended dead spans; the energy follows the music.
4. Sound. Write genre-correct music and sound design locked to the cue sheet. Check that visual hits land on audio onsets.
   Master to the output spec.
5. Final. Render at full resolution (motion blur where apt), then check: exactly 10.00 s, resolution, fps, audio present and at
   the right loudness, no black frames, no fallback fonts or tofu, no clipped elements at the frame edges, no shimmer on thin
   lines, no gradient banding. Fix and repeat until you would submit it to a festival.
6. Write an honest self-critique: what is strongest, what is weakest, what you would do with more time.

# Rules
- Rendering must be deterministic: every frame is a pure function of time t. Seeded randomness only; physics and particles
  precomputed or closed-form; no real-time clocks; no state-triggered CSS transitions. A reliable route: a web page that can
  draw any time t on request, captured frame by frame with a headless browser and encoded with ffmpeg (or a Blender script
  that renders a PNG sequence).
- Assets: only CC0 / public domain / OFL / Apache / free-for-commercial-use. Record each source and licence in CREDITS.md.
  No real brand trademarks; invent brand names.
- On-screen text must be correct and natural: idiomatic Chinese, proper CJK punctuation, no typos.

# Craft checklist (what a jury looks for)
- Style authenticity: an expert names the style in one second; every signature technique is present and executed correctly.
- Motion craft: purposeful easing (no linear unless mechanical by design), overlap and stagger, anticipation and
  follow-through, arcs, squash and stretch where the style allows, consistent physics, motion blur where apt; transitions
  carried by elements, not crossfades.
- Rhythm: hits locked to the music; contrast between busy and calm; no monotony.
- Design: strong composition, grid, typographic hierarchy, controlled palette; texture and finishing (grain, glow, vignette)
  only where the style wants it; nothing looks accidental.
- Technical polish: no jitter (unless intended), no popping, no aliasing, no banding, no fallback fonts, no half-loaded images.
- Sound: genre-correct, musical, synced, mastered.

# Before you deliver, score yourself honestly
1–10 on style fidelity, concept wow, motion craft, design & typography, finish & texture, sound & sync, technical
(6 = template-level, 8 = high-end agency, 9 = award shortlist). Aim for 9; fix whatever scores lowest first.

# Deliver
video.mp4, plus a short report: the concept in two sentences; a beat sheet with timecodes; how each signature feature is
realised; the tech route; check numbers (duration, resolution, fps, loudness, true peak); your honest top-3 weaknesses.
```
