# 来源与适配边界

上游原作作者 LemoLab / Lemomo；[原仓库](https://github.com/lemomo-ai/lemo-opuscar)、[用户参考展示页](https://lemomo-ai.github.io/lemo-opuscar/)。本包是独立Design适配，不是上游官方插件。

- 版本：1.1.2；更新日期2026-10-30。
- 沿用最初取用的固定提交 `f17136060781a0068a7951245a3aa7835a7230de`，不混入后来main的其他风格改动。
- [原版STYLE](https://github.com/lemomo-ai/lemo-opuscar/blob/f17136060781a0068a7951245a3aa7835a7230de/styles/scifi-toon/STYLE.md)、DEMO、DIRECTOR、TECHNIQUE和随包源码原样保留。
- [upstream-manifest.json](upstream-manifest.json)记录55个上游原文件的长度及SHA-256。包括所选风格目录完整快照及此路线使用的core、依赖清单；不是全仓库镜像。
- 保留[上游MIT许可](../vendor/lemo-opuscar/LICENSE)。第三方字体、音源/模型与新作品素材仍按其实际来源记录。

技能包作者：MiniMax Design；来源分类：official-featured。当前市场版本以 `meta.yaml` 为准，以下版本历史描述导入来源包。上游原作作者与源码许可独立保留。

## 本适配新增的内容

市场修订从创作流程中移除应用导入和画布接入要求，改由 [delivery.cn.md](delivery.cn.md) 描述文件交付和播放验收。兼容合成脚本遇到静音或非有限响度测量时跳过归一化，新增真实 FFmpeg 回归验证。随包上游文件保持字节不变，仅修改本地兜底工具。

SKILL入口（英文 `SKILL.md`、中文 `SKILL.cn.md`）、Design环境接线、路径与缺失依赖说明、验收索引、元数据、包校验、初始化脚本及已验证的兼容工具（`scripts/compat/soundfile.py`、`scripts/mux_compat.sh`、`scripts/check_srt.py`）。v1.1.0撤销独立的visual-direction.md以及v1.0.1对抖线、线宽、阴影、色彩和表演形变的覆盖；原始STYLE重新成为风格依据。v1.1.2 按平台规范适配（双语入口文件、结构化市场元数据、英文参考文档及对应 `.cn.md` 中文版），并加入 79 秒成片中验证过的兜底。未修改vendor中的任何文件。

## 不随包提供的资产

原仓库未附带示例语音WAV、所引用字体二进制、TTS/ASR模型、最终示例MP4；本包也不伪造这些文件。字体/声音模型的具体名字属于示例环境，不要求Design必须使用同一服务。平台声音可接入原版逐句音频/时间轴/嘴型契约。

DIRECTOR/TECHNIQUE中的全库setup、其他风格、3D及采样库段落超出本包范围。保留文献供理解，不宣称这些工具均在本包；按production.cn.md准备此2D风格需要的依赖。

示例《Coffee Run》及风格帧用于研究实现与质量，不自动复用其人物、买咖啡故事、曲子、镜头时序或LemoLab品牌片尾。用户要求与任务范围优先，不把原文的素材措辞扩展成额外审批流程。
