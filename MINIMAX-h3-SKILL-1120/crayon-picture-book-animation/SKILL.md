---
name: crayon-picture-book-animation
description: 根据故事构想或主题，用代码渲染蜡笔儿童绘本风动画短片（蜡笔笔触、水彩显影），交付方案、角色设定、配音配乐、字幕、MP4 与源码；不用于 AI 生成视频或普通剪辑。
trigger-words: [crayon picture book, crayon animation, picture book film, bedtime story animation, children's picture book video, 蜡笔绘本, 蜡笔儿童绘本, 儿童绘本动画, 绘本短片, 睡前故事动画, 蜡笔动画]
---

# 蜡笔儿童绘本动画

制作一部像"一页儿童绘本正在被蜡笔当场画出来"的短片：带纸纹的暖白纸、蜡笔笔触、可选的一道水彩把藏着的白蜡图案显出来。画面、配音（TTS）、配乐、拟音、字幕全部用随附引擎以代码确定性生成。本 Skill 从 Lemo-Opuscar 的 crayon-book 风格拆分而来，自带引擎，可以单独运行。

随附文件（路径相对本 Skill 目录）：

- `references/STYLE.md`：风格的固定规则（材质、配色、字体、运动、镜头、声音、常见坑），全部遵守。
- `references/LESSONS.md`：在 MiniMax Design 上做中文片验证过的做法和用户纠正过的偏好。**与上游冲突时以它为准**（例如默认不做"拉出纸边看到书桌"的结尾）。
- `references/DIRECTOR.md`、`references/TECHNIQUE.md`：上游导演与制作指南；`engine/core/README.md`：工具命令。
- `references/DEMO.md`、`references/upstream-demo/`：上游示例片源码（英文）；`examples/`：两部 15 秒中文片。写完方案后才读，只学技法，不照搬故事、角色、镜头和时间线。
- `starter/`：新项目的引擎文件；`scripts/new-project.sh` 用来建项目；`scripts/env.sh` 配置运行环境。

## 步骤 1：一次性对齐简报

沿用当前对话语言。只在一条消息里确认请求没说清的内容：故事构想或主题、角色、时长（默认 15 秒）、画幅（默认 16:9 1920×1080）、配音和字幕语言、台词句数、要不要字幕、用户有没有自己的声音/音乐/素材、是否要先看方案。其余用合理默认值补齐，用几行话总结简报。

## 步骤 2：制作方案

在当前工作区建项目目录（小写字母、数字、连字符）：`sh "<skill dir>/scripts/new-project.sh" <目录>`。读 `references/STYLE.md` 和 `references/LESSONS.md`，写 `TREATMENT.md`：三个结构候选与选择、梗概与情节弧、角色表、带时间的台词表、分镜表（时间、景别、运镜、内容、为什么）、节拍表、声音设计表、蜡笔盒（约 12 支，轮廓不用黑色，一支白蜡留作显影，最多一种水彩）、字幕和交付物。每个运镜和招式都要服务于故事。

生成脚本会将实际 Skill 路径保存到 `.skill-path`，`build.sh` 重建时读取它。Skill 移动后，更新该文件或将 `SKILL_DIR` 设为新路径。

## 步骤 3：定画面并确认

到这一步才读示例和上游示例源码学技法。写 `pal.js`、`chars.js`、`world.js`、`sheet.js` 和初版 `film.js`。渲染角色设定页（`?test=sheet`）和几张关键帧静帧，拼成联系表交付到画布。把方案和联系表给用户看，**等确认后再正式制作**；只有用户明确要求直接出成片时才跳过。

## 步骤 4：批量制作

1. 配音：写 `lines.json`，用 `core/tts/tts_zh.py` 生成，再用 `core/tts/asr_check.py` 逐句回听。识别错的句子先换说法，再调参数。
2. 时间线：完成 `film.js`（镜头轨道、角色状态、事件 `EV`、`SUBS`），写 `subs.json`，运行 `core/render/events.mjs`。
3. 配乐与混音：`music/score.py`（合成乐器，按 `events.json` 对点）和 `mix.py`（拟音、环境声、人声链、避让、−14 LUFS）。检查每句台词比背景高多少 dB。
4. 用 `core/render/video.mjs` 渲染，`core/render/srt.py` 导出字幕，`core/render/mux.sh` 合成。保证 `build.sh` 一条命令能重建全部。

每条引擎命令都要在同一条 shell 命令里先加载环境：`SKILL_DIR="<skill dir>"; . "$SKILL_DIR/scripts/env.sh" && cd "$LIB" && node core/render/still.mjs "<项目>" 1.5`。第一次运行引擎命令前，先执行 `sh "<skill dir>/scripts/setup.sh" --check`；如果提示缺依赖（轻量包不带依赖），告诉用户后运行一次 `sh "<skill dir>/scripts/setup.sh"`（约 750 MB，需联网，几分钟；已装好的部分自动跳过）。edge-tts 需要联网；语音识别模型在第一次回听时下载（连不上 Hugging Face 时设 `HF_ENDPOINT=https://hf-mirror.com`）。未经用户要求不安装系统软件。

## 步骤 5：检查与交付

测量客观数据：时长、分辨率、帧率、响度和峰值、黑帧、ASR 结果、台词余量。可以把静帧或成片交给媒体分析，看有没有角色悬空、头顶被切、水彩没铺满、暗角过重；只修明显缺陷，其余如实报告。把 MP4、SRT 和 `TREATMENT.md` 交付到同一个画布作品，分别标为「成片」「字幕文件」「制作方案」；封面、CREDITS 和源码留在项目目录。汇报实测数据、与方案不一致的地方，以及需要用户亲自看、听的地方。

## 修改

用户指出某个时间点和改法时，只改那一处，重新渲染，作为同一画布资源的新版本交付。改动影响方案时同步更新 `TREATMENT.md`。

## 边界与署名

不用于 AI 文生视频、真人实拍、普通裁剪或格式转换。片中不点名、不模仿参考作品。保留 `engine/LICENSE`（MIT，LemoLab）和每个项目的 `CREDITS`（字体、TTS 服务、工具）。引擎改编自 Lemo-Opuscar（https://github.com/lemomo-ai/lemo-opuscar），这是本地适配版，不是官方发布。
