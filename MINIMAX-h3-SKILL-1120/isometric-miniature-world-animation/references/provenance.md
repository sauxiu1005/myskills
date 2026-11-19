# 来源、许可与适配范围

本技能针对用户指定的 [等轴案例源码目录](https://github.com/vincentwei1021/mg-styles-15/tree/main/demos/03-isometric) 编写，展示页为 [等轴 2.5D](https://vincentwei1021.github.io/mg-styles-15/?lang=zh#03-isometric)。原作 ISOPOLIS「让城市自己生长」的作者署名为 Vincentwei1021。本包不宣称是上游作者或 Design 平台官方发布。

## 保留内容

`vendor/mg-styles-15/` 是 2026-10-28 从 `main` 读取的文件快照：

- `demos/03-isometric/`：页面列出的全部 11 个源文件，逐字保留。
- `prompts/03-isometric.md`：完整原始提示词。
- `harness/render.mjs`、`harness/preview.html`：原渲染和预览参考。
- `package.json`、`requirements.txt`：上游依赖声明，不代表本机或 Design 已安装。
- `assets/fonts/README.md`、`assets/fonts/fonts.css`：字体说明和原路径参考，不含字体文件。
- `rubric.md`、`template.md`、`LICENSE`：原评审、提示词结构和 MIT 许可证。

共 21 个上游原文件，`snapshot.json` 记录各文件 SHA-256 与字节数。未能取得可靠提交 ID，`commit` 为 null；不能把此快照称作已锁定的 Git 提交。后续复用以随包哈希为准。

原代码、提示词和文档遵循随包 [MIT 许可证](../vendor/mg-styles-15/LICENSE)，保留 `Copyright (c) 2026 Vincentwei1021` 及许可全文。新增字体、采样、库和用户资产分别记录实际许可；上游 MIT 不自动覆盖外部资产。

## 新增适配

本技能新增用户创意输入、MiniMax Design 兼容的双语运行文件（SKILL.md / SKILL.cn.md）与展示元数据、中文文字处理、办公室/机房创作路线、可变时长画幅、Design 能力发现与画布验收、明确的依赖修复说明。`references/` 中的模板和流程是本次适配，不是上游仓库原文，也不是平台 API 规范。

修正原提示词中的混合约定：真等轴 ±30° 与 2:1 像素轴测并不相同；正交相机拉远应改 zoom；原源码的 roof_lag=0.375 秒也不等于提示词中的 2–3 帧。以实际代码行为和本次创作需要为准。

## 不包含与验证边界

本包不包含上游成片、封面、第三方字体二进制、node_modules、`lib/audio/mgaudio` 或采样库。它提供制作指导与源代码参考，不是已补齐依赖的原片复刻工程。复制作品前先读源码地图，替换字体与路径，按需取得依赖或另写声音。

创建本技能不等于已在 Design 上传、加载或完成成片；只有在目标平台实际执行后，才能报告对应平台的验证结果。
