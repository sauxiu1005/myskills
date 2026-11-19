# 内置五种风格参考卡

> Governing workflow: read `production-workflow.md`. Speech language, subtitles and music require explicit pre-video approval; none is a default. Historical English/voice/music examples are conditional illustrations. Default video model: MiniMax H3. Character and shot-keyframe approvals precede video; clips require user review before final assembly. No unsolicited generated-media acceptance inspections or autonomous paid retries.
> 优先遵循 `production-workflow.md`：旁白语言、字幕和配乐在视频前明确确认，均无默认值。历史英文、音色和音乐内容仅作条件示例。默认视频模型为 MiniMax H3；角色和镜头关键帧先确认，片段审阅后再组装。不主动验收自有生成媒体或自行付费重试。


在询问用户选择风格前，依次展示以下五张单独参考图。每张图只包含一种风格，不使用 A/B 编号，也不要把两种风格放在同一张图里。

| 编号 | 风格 | 当前项目参考图 | 原版局部帧备用 | 冻结要点 |
|---|---|---|---|---|
| Style 1 | 白底黑火柴人 | `res_85cec12e2afb` | `assets/light-theme-demo.png` | 实心黑圆头、无脸、细黑单线四肢、无衣服 |
| Style 2 | 黑底白火柴人 | `res_a051bca854a3` | `assets/dark-theme-demo.png` | 实心白头、简单夸张表情、较粗白色圆管身体和四肢 |
| Style 3 | 极简科技火柴人 | 优先导入右列科技场景参考图 | `assets/style-3-tech-reference.png` | 淡紫低饱和长袖、白圆头、小白手、细黑腿与粗黑靴；无帽无头发无背包；环境仍为白网格科技空间与青蓝玻璃 UI |
| Style 4 | 彩色故事火柴人 | 优先导入右列电影叙事场景参考图 | `assets/style-4-cinematic-reference.png` | 与画风3完全相同的淡紫长袖、白圆头、小白手、细黑腿与粗黑靴，无帽无头发无背包；区别仅为全彩叙事环境与电影化光影 |
| Style 5 | 治愈故事火柴人 | `res_3f4e92ec25ef` | `assets/style-4-cozy-station.png`、`assets/style-4-cozy-cafe.png` | 白实心圆头、下宽钟形躯干、深色细线四肢、全彩生活场景 |

## 使用规则

- 先展示 Style 1–5 的五张参考图，再让用户选择。
- 用户可以直接说“Style 3”或说风格名称；不要再使用 Style 1A、1B、2A、2B 作为选择项。
- 参考图只锁定人物和画风，不把图中的具体场景、道具或演员自动带入新故事。


## 画风3与画风4共用人物说明

两种画风共用淡紫色长袖、无帽无头发无背包、黑靴人物及同一角色定稿图。区别仅为动画环境和背景：画风3是白网格科技空间与青蓝玻璃 UI，画风4是全彩叙事场景与电影化光影。展示时分别说明对应环境，不能把同一张人物定稿图描述成已经展示了两种背景。旧版红帽黄衣人物已被替换，不作为当前风格人物卡。项目Resource ID可能不可读，此时导入本地参考文件。

## 画风3正式选风格卡

画风3选风格时展示 `assets/style-3-tech-reference.png`，其同时呈现淡紫色主角、白色透视网格科技空间与青蓝悬浮玻璃界面，不再用纯背景人物定稿图代替风格卡。该图用于风格与环境参考；画风3和画风4的人物身份仍由共用 `assets/style-3-lavender-character.png` 锁定。

## 画风4正式选风格卡

画风4选风格时展示 `assets/style-4-cinematic-reference.png`，同时呈现共用淡紫色主角、雨后黄昏街道、暖色窗灯与冷色天空、前景框景和远景层次，以突出全彩二维电影叙事气质，不再用纯背景人物图或项目镜头代替选风格卡。场景仅作风格示例，不自动成为新故事的指定地点。人物身份仍由 `assets/style-3-lavender-character.png` 锁定。
