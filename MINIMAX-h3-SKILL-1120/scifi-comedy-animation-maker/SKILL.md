---
name: scifi-comedy-animation-maker
description: |
  将创意或剧本制作或修改为代码绘制的科幻喜剧动画短片，含声音驱动口型、配乐、字幕和可编辑源码；不用于图生视频、3D或真人实拍。
trigger-words: [科幻喜剧动画, 科幻情景喜剧卡通, 科幻卡通短片, 双人对白动画, 平行世界喜剧, 代码绘制卡通, Sci-Fi Sitcom Toon, scifi-toon]
license: MIT
metadata:
  upstream: "lemomo-ai/lemo-opuscar"
  upstream-commit: "f17136060781a0068a7951245a3aa7835a7230de"
---

# 科幻喜剧动画制作

按原仓库制作，不另写一套替代画风。原文、示例代码、参考帧及所需核心模块随包保存在 `vendor/lemo-opuscar/`；流程使用实际可用的执行环境和获授权的声音来源。此包独立整理上游方法，来源与缺失的外部依赖见 [provenance.cn.md](references/provenance.cn.md)。

## 读取顺序与依据

1. 先读 [原版 STYLE.md](vendor/lemo-opuscar/styles/scifi-toon/STYLE.md) 与 [DIRECTOR.md](vendor/lemo-opuscar/DIRECTOR.md)。STYLE 是此风格的视觉、表演、声音和字幕依据；专项风格规则优先于通用导演建议。用户明确要求优先。
2. 按 DIRECTOR 写本片的 `TREATMENT.md`：候选结构、故事弧、参考基准、镜头与逐秒节拍、音乐 cue、声音表和字幕设计。沿用用户已确认的故事与选择，不重复询问。
3. 方案成立后读 [DEMO.md](vendor/lemo-opuscar/styles/scifi-toon/DEMO.md)，实际查看 [原示例风格帧](vendor/lemo-opuscar/styles/scifi-toon/demo/stills/styleframe.jpg) 和 [海报](vendor/lemo-opuscar/styles/scifi-toon/poster.jpg)，研究 demo 源码中的实现。示例是完成度与技法参考，原文明确其故事、人物、时序和片尾不是新作品模板。
4. 制作前读 [TECHNIQUE.md](vendor/lemo-opuscar/TECHNIQUE.md)、[core 工具说明](vendor/lemo-opuscar/core/README.md) 与 [制作准备与交付](references/delivery.cn.md)。项目目录、逐句声音契约和已验证的环境兜底见 [production.cn.md](references/production.cn.md)。

默认沿用上游：30–60秒、1920×1080、24fps、当前对话语言的对白与字幕、约−14 LUFS；用户指定的语言、时长、画幅或静音覆盖默认。仅修改 skill 时只改技能文件与验证，不启动影片生成。

## 原版风格执行要点

本节是原文导航摘要，完整参数和语境以 STYLE 为准，不覆盖它：

- **画面**（STYLE §2–3）：屏幕空间恒定粗线、12fps 三态轮廓抖动；纯平涂与裁剪在形体内的硬边阴影，天空用平面色带。大眼白、小瞳孔、重眼皮和可参数化弹性嘴型；每世界独立配色。保留原版 `toon.js` 默认值，不关闭抖线或改成细线风格。
- **表演与镜头**（§5–6）：人物12fps，摄影机与传送等效果24fps；预备动作、挤压拉伸、紧张抖动、对白反应近景、硬切和传送转场。冷场只留下轮廓抖动。整体平移不能代替人物表演。
- **声音**（§7、TECHNIQUE §3–6）：每句真实音频驱动嘴型；统一时间轴驱动画面、对白、字幕、配乐和音效。特雷门琴感主奏、模拟低音、琶音与复古鼓机等按故事编曲；冷场切掉音乐及混响尾音。
- **字幕**（§4）：卡通自身的字幕设计、说话人色标、阅读时间和底部安全区；按实际输出像素检查，不把工具默认字号当作成片规格。

## 从原代码到新作品

运行 [init_project.py](scripts/init_project.py) 创建独立目录：它校验并复制完整随包上游快照到 `runtime/`，包括 demo 的人物、世界、镜头、音频、音乐、参考帧与构建代码；另建 `film/` 作为新作目录，并在 `film/tools/` 放入已验证的兜底工具。初始化只准备素材与代码，不是完成的影片。

先按原版导演流程，用实际动画绘制代码产出角色设定表（转面、表情、关键姿态）和两张风格帧，自己对照原文和参考帧检查后继续。不是只读文字风格，不以另一条生图路线的静态美图冒充动画渲染效果。用户要求先审分镜时再执行其审阅流程。

在项目副本中借用 `toon.js` 的屏幕空间绘制、`chars.js` 的五官/手/肢体实现、`worlds.js` 的场景与传送机制，以及声音和渲染脚本；为新故事改写角色、场景、镜头、台词、配乐与片尾。保留上游源码许可。不要把示例的 WAV 测量数据当作新录音数据。

依 TECHNIQUE 执行逐句声音、时间轴、代码动画、事件导出、音乐音效混音、SRT、逐帧渲染与合成。优先走上游路径，仅在出现对应症状时采用 production.cn.md 中的兜底。依 [qa.cn.md](references/qa.cn.md) 完成原版的两轮接触表检查、关键动作帧条、最终速度音画观看及技术检验。制作环境无法实现所需环节时准确说明缺口，不以低保真示意动画替代后宣称达到参考。

交付原版要求的 MP4、封面、SRT、TREATMENT、CREDITS、源码和 `build.sh`；在预期播放器中验证播放、暂停恢复、跳转和片尾。文件导出、播放检查和视觉验收分别如实报告；应用专属的导入与上传由运行时负责。
