# 来源与适配边界

上游作者：LemoLab / Lemomo。仓库：[lemomo-ai/lemo-opuscar](https://github.com/lemomo-ai/lemo-opuscar)。用户指定入口：[README.zh-CN.md](https://github.com/lemomo-ai/lemo-opuscar/blob/main/README.zh-CN.md)。本包为独立 Design 适配，不是上游发布的官方 Design 插件。

- 读取日期：2026-10-27。
- 固定提交：`413a6bd6d78ebd3bdd5abaec9538a26867f890df`。
- 风格：[styles/newsreel/STYLE.md](https://github.com/lemomo-ai/lemo-opuscar/blob/413a6bd6d78ebd3bdd5abaec9538a26867f890df/styles/newsreel/STYLE.md)。所属分类：剪辑与纪实；不同于 `styles/silent-film`。
- 示例：《Knock-Knee Alert / 膝盖警报》，54.6秒；示例说明和源码均随包保存。
- 上游 MIT 许可完整保留于根 [LICENSE](../LICENSE) 和 vendor。字体许可、档案出处另见示例 `fonts/`、`CREDITS`、`SOURCES.md`。MIT 不会替所有外部档案素材授权。
- [upstream-manifest.json](upstream-manifest.json) 记录所有复制文件及 SHA-256。`vendor/lemo-opuscar/` 为未修改快照；本包新写部分是入口、Design 适配、实施文档、元数据与初始化脚本。

## 版本记录

- 1.0.1：Codex 宿主适配（中文入口与 Codex agent 清单）。
- 1.1.0：Design 原生版。双语运行文件（`SKILL.md` 英文、`SKILL.cn.md` 中文）、Hub `meta.yaml`、平台能力替换、复用平台 Node/Python/FFmpeg/无头浏览器（`check_runtime.py`）、带版本的 `init_project.py`、`delivery_check.py`、`pack_project.py`、`validate_skill.py`、从平台 Python 包链接 playwright-core、对项目内 `mux.sh` 副本应用 FFmpeg 6.0 兼容修补、真实彩色素材规则、大母版的交付编码、画布播放与大工程交付规则。删除 Design 不读取的 Codex `agents/openai.yaml`。vendor 未改动。

## 流程对应

| 仓库规则 | 本包落点 |
|---|---|
| AGENTS Workflow：Brief → Treatment → Look → 可选 Storyboard → Produce → Self-check | SKILL 第1至8步；文档剪辑类先素材研究后 Treatment |
| DIRECTOR §2–4：参考作品、三结构、独立方案 | 第3步；不把示例题材写成默认剧情 |
| DIRECTOR §5：三张真实风格帧、可选6–9张故事板 | 第4步；只有用户要求预审才等待 |
| STYLE §1–6：真实材料、1.37画门、银灰、清晰字层、新闻剪辑 | 第2、4步及原 STYLE |
| STYLE §7–8：播报、热舞乐队、唱片、急停与标志技法 | 第5–6步及原 STYLE |
| STYLE §9：素材检索、目录核对、FACTS/SOURCES | materials.cn.md；`footage.py` |
| TECHNIQUE：render(t)、统一时间轴、分轨、逐帧渲染与mux | production.cn.md；随包 core 与示例源码 |
| DIRECTOR §11：接触表、动作条、全片听看、集中修正、避免复刻示例 | 第7步及交付清单 |

## 适配时明确处理的差异

1. 不搬入全库风格选择、Claude 插件安装、自定义风格保存和自动更新；本技能只有 newsreel。上游原文提到未随包提供的其他风格/3D资源时，不属于本包依赖。
2. 上游称风格以 Claude Opus 5.5 调试；这是原项目背景，不等于 Design 当前已有对应模型，也不是适配版的模型硬限制。调用当前真实可用工具并记录，不伪造模型名。
3. 保留原生代码渲染路线作为精确实现；仓库工具不可用时优先采用 Design 等效工具，代码补足平台缺少的能力。Design 承担素材组织、制作与最终画布交付。当前平台能力需要执行时发现，`meta.yaml` 参考现有 Design 技能包结构，尚未代表已在平台成功导入。
4. 上游 `setup.sh` 的克隆/更新替换为固定快照复制与项目内依赖安装；不自动改全局环境。原文错误提示中的插件安装命令按 production.cn.md 替换。
5. 主题与语言服从用户。默认当前对话语言，不因示例是英语播报就默认切英语；双语字幕按需。
6. 上游风格与泛用导演指南冲突时采用专项规则：节拍硬切、至多一个栏目卡且至少2.5秒、真实影像为主体；阅读时间要求仍需满足。
7. 原文公版年份为2026年的美国地域判断，不能永久硬编码；执行时核实条目、作品类型、日期及适用地域。保留 PD 原标签，不把“公有领域”改写成 CC0。
8. 原文提及去掉水印，适配为选择无水印合法原档或剪除档案头尾板；不抹除权利水印或隐瞒来源。“No known restrictions”及工具示例字符串本身不构成已核验许可。
9. 真实彩色影像可去色统一为暖银灰；上色版与 AI 增强版仍排除。
10. 不自动携带示例频道名、机构背书和作者/模型片尾；源码许可保留。大包字体、模型、采样及档案影像按项目需要获取。

包内代码已保存不代表依赖、外部下载或完整样片在当前 Design 实测可用；结构检查、源码可解析、本地渲染、平台导入、画布播放须分别报告。
