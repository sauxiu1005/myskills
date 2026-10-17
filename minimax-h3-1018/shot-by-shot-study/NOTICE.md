# 来源与修改说明

本技能依据 [eternityspring/reelbench-skills](https://github.com/eternityspring/reelbench-skills) 的 video-shots 与 video-sync 改编。

- 固定上游版本：`18f2f63987337df0975a89973d38d50f3231ee31`。
- 上游许可证：Apache License 2.0，全文随包放在 `LICENSE`。
- `vendor/video-shots/scripts/`、`vendor/video-shots/examples/` 与 `vendor/video-sync/scripts/` 为上述提交的原样副本，保留原注释与测试夹具；`vendor/video-sync/references/`、`assets/` 及双语 README 同步保留上游版式、样式与示例资料。
- 本包新增中文 Design 工作流、能力适配约定、来源与精度记录、质量检查、同步合成说明及 `scripts/canvas-plan.mjs`。这些新增文件也按 Apache-2.0 提供。
- 本包不是 Design 官方插件。画布节点命名、`analysis-state.json`、`canvas-plan.json` 是本技能的中间约定，不是经过确认的 Design 官方导入协议。
- 本包修正或限定上游指导中的若干假设：运动差分不能直接证明摄影机运动；一个长镜头中更换运镜不等于切镜；15%/85% 抽帧不是真正的首尾帧；字幕不等于已核听台词；上游 cutsPerMinute 的实现实际是镜头数/分钟。

1.0.1 修正：交互 HTML 不再是可被文字表替代的可选项；新增完整报告打包器、当前镜头列表跟随滚动、开关及交互验收说明。vendor 文件仍保持原样，增强功能在 scripts/ 中独立实现。

1.0.2 packaging revision: English SKILL.md, Chinese SKILL.cn.md and separate meta.yaml. Complete renderer dependencies are preserved. No platform-specific execution capability is assumed.

1.0.3 integration revision: verified the bundled video-sync scripts byte-for-byte against upstream commit `18f2f63987337df0975a89973d38d50f3231ee31`, restored upstream layout/style references and preview assets, and documented the three-image scrolling/highlight pipeline and its failure traps.
