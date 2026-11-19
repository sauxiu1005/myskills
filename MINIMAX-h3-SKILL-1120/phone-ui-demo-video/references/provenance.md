# 来源与适配

- 原仓库：[Unclecheng-li/AI_Animation](https://github.com/Unclecheng-li/AI_Animation)
- 原技能：`skills/phone-ui-demos`
- 固定提交：`3d17ba3eb0b0ea631b593bc646b01b83c8d861e4`（2026-11-09 获取 master）
- MIT 许可与 Copyright (c) 2026 Unclecheng 保留于根目录 LICENSE。

`references/upstream/` 与 `assets/upstream/` 保留该提交的规范、模板和 8 镜头示例，作为视觉参考快照。历史命令 `../video-shot-demos/scripts/shot.js` 未随包提供，也不作为依赖，改用本包 `stills` 命令；历史多页播放器不是 MP4 导出入口。

本包新增：绝对时间模板、合成音频、MP4 自动渲染与参数核验、单文件预览打包（`bundle`）。新模板借鉴原手机布局和视觉规则，重新实现时间轴，避免一次性 cue 与页面跳转影响导出。

当前统一名称：手机界面演示视频 / Phone UI Demo Video；技能标识、根目录和分发 ZIP 分别为 `phone-ui-demo-video`、`phone-ui-demo-video/`、`phone-ui-demo-video.zip`。

## 1.2.0 平台适配

- 新增英文 `SKILL.md` 与中文 `SKILL.cn.md` 双语运行文件，frontmatter 改为 name / description / trigger-words，版本只记录在 `meta.yaml`。
- `meta.yaml` 补齐分类标签、summary、desc 与双语 structured-info。
- 项目按分镜脚本、关键帧、动画预览、成片、可编辑源码包组织，修订保留新版本。
- 确认节奏统一为：交付规格（无法推断时）→ 分镜 → 成片审阅。
- 检查范围改为“构建检查由执行者完成、画面与听感由用户审阅”；渲染报告字段改为 `technical_check` / `user_review`。
- 依赖缺失时不自行安装，先说明影响并征得同意。
- 移除仅供其他宿主使用的 `agents/openai.yaml`。

## 1.2.1 运行链路修订

保留原作者 MIT 许可；本次新增和修改内容按相同 MIT 条款提供。修正依赖解析、时间线采样与帧数舍入、未知场景报错、资源内嵌和初始化前置检查；新增包完整性清单、校验器、回归测试和制作交接。清单描述本次包内字节，不声称与未重新获取的上游提交完全相同。本次未引入任何字体或第三方二进制，puppeteer-core 仍为按需安装依赖，锁文件保留其完整性信息。

## 1.3.0 命名、能力摘要与交付说明

以用户提供且经过购物案例实测的 1.2.1 包为基础，统一中英文名称、技能标识、包名及双语元数据。按用户要求设置发布作者与 community 来源；这不替代上游 LICENSE 中的原作者署名。保留渲染器、模板与依赖版本，补充持久后台渲染、导入状态未确认时的文件包执行、平台实际预览验证及确认点跳过条件。实测证据与仍未覆盖的边界见 [验证记录](validation-report.md)。

## 1.3.1 编码前截图稳定性修复

新增无第三方依赖的 PNG 像素解码与同时间点连续截图确认，接入 stills 和全片 export。检测到瞬态截图变化时有限重拍，持续不稳定则中止，保存诊断帧与统计；初始化同时复制新模块。保留分镜、片头动效、帧率、音效和模板样式，不以删帧或改变创意掩盖异常。补充旧工程升级步骤、制作阶段保护要求与 6 项回归测试。实测范围与限制见 [验证记录](validation-report.md)。
