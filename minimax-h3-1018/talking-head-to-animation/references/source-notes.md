# Source and Adaptation Notes

The user supplied talking-head-to-animation as a third-party package. Its source notes attribute the methods to [Hypit](https://github.com/hypit-ai/hypit): reference transformation, semantic anchors, explicit take selection, dependency-aware reuse, and production review. Original package authorship is unspecified; this local adaptation does not claim official MiniMax authorship.

The supplied notes report a lookup dated 2026-09-17 and commit d68fe605c7eecbdadbfa7fa8df0a8dee59d6db66. These are inherited claims, not fresh online verification.

- [Upstream Skill](https://github.com/hypit-ai/hypit/blob/d68fe605c7eecbdadbfa7fa8df0a8dee59d6db66/skills/hypit/SKILL.md)
- [Production relationships](https://github.com/hypit-ai/hypit/blob/d68fe605c7eecbdadbfa7fa8df0a8dee59d6db66/skills/hypit/references/production/system.md)
- [Transformations](https://github.com/hypit-ai/hypit/blob/d68fe605c7eecbdadbfa7fa8df0a8dee59d6db66/skills/hypit/references/creation/transformations.md)
- [License](https://github.com/hypit-ai/hypit/blob/d68fe605c7eecbdadbfa7fa8df0a8dee59d6db66/LICENSE)

No upstream source code, models, renderer, executable, or connector is bundled. Do not infer license grants or platform prices. Recheck licensing before copying or redistributing upstream code. Running or installing Hypit is outside this Skill, not a fallback.

## Package mapping

| Supplied component | Adapted component |
| --- | --- |
| Chinese SKILL.md | English SKILL.md and aligned SKILL.cn.md |
| agents/openai.yaml | Replaced by meta.yaml; Codex-specific configuration intentionally not installed |
| references/design-adapter.md | Native capability and canvas rules in production-handbook.md |
| references/timing-and-project.md | Version-bound semantic timing and record template in production-handbook.md |
| references/variants-and-recovery.md | Dependency matrix and recovery in production-handbook.md |
| assets/production-template.md | Single-artifact and production-record templates in production-handbook.md |
| references/source-notes.md | This provenance document |

Key corrections: generation auto-registers canvas assets; no duplicate upload; caption production is opt-in; editable delivery requires a real editor; metadata is distinct from semantic evidence; references remain references rather than accidental keyframes; local retries preserve successes; no hidden media scripts or installs.

Static validation does not establish live reload, marketplace approval, media-generation success, or audiovisual QA. No paid media generation was run while adapting this package.

## 口播手绘模式的参考与证据范围

2026-09-28 根据用户反馈“线稿过于简单”补充手绘解释动画与多画幅指南。用户指定参考为 [Axton 原帖](https://x.com/AxtonLiu/status/2102827887732932956)。原帖文字已读取，作者称保留口播原声、字幕和时长，真人缩为圆形画中画，动画对应讲述概念。完整视频在本次浏览中无法播放，不能据此声明已验证其动态效果。

本次另观察了 [公开案例目录中的对应抽样图](https://github.com/athemeroy/awesome-opus-5-5-videos/blob/main/assets/case-thumbnails/2102827887732932956.webp)：浅色背景、黑色简笔人物、不同颜色的对话框、人物群体关系、顶部编号步骤、下方字幕与右下真人圆框。这只是单帧静态证据；不证明全片镜头密度、运动质量或精确视觉参数。没有复制或打包第三方图片、视频和源码。

新增指南中的更丰富场景、角色动作、局部视差和构图策略属于本次制作标准与建议，不应描述为已观察到的原片全部特征。将来取得完整视频后应补充连续镜头观察，再决定具体动作与节奏，而非把此抽样图当作永久风格模板。


## 本次用户明确的风格约束

用户进一步要求：画面仍参考原帖动画 B-roll，轻松有趣，线稿动画即可，不要写实。因此本模式明确采用简笔造型、夸张表情、动作反馈与气泡图解；此前生成的精细神话插画不作为本模式的合格参考。此项是用户选择，不是对未完整观看原视频的新增事实断言。
