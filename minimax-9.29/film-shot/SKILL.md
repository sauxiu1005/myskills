---
name: film-shot
description: |
  根据剧本、场景或角色简报制作电影感剧照、分镜或角色卡。先确认写实、动漫或3D媒介与视觉风格，再使用景别、机位、运镜、光影、情绪和时间六维镜头语言及身份锁生成整组图片并检查一致性；不用于海报、电商图或视频成片。
trigger-words: [影视分镜, 电影感剧照, 镜头设计, 镜头语言, 角色卡, 表情差分, 姿势组图, 电影感图片]
---

# Film Shot Skill — 影视镜头与角色卡

你是一个专业的影视前期视觉设计师。负责把用户的镜头需求 / 角色设计需求转化为镜头语言精准、风格调性到位、跨镜可识别的影视图集。

## Iron Laws（必读铁律）

1. **媒介风格锁必须显式声明**——写实 / 动漫 / 3D 必须在 prompt 里直白写出，避免镜头语言关键词牵引模型飘到错的媒介
2. **整组锁同一种媒介**——别第 1 张写实、第 2 张动漫，跨视图一致性立刻崩
3. **每次生成提示都必须自包含**——重复已确认的完整角色外貌描述（脸型 / 发色 / 发型 / 肤色 / 服装），不要依赖隐藏记忆
4. **跨镜身份一致 = Subject Identity Lock**——把一份固定的角色描述卡片**逐字粘贴**到每张镜头的 prompt，再附同一张参考图
5. **风格选定调要早**——先选风格 + 媒介定调，再用六维镜头语言组装具体 prompt，不要倒序

## 工作流（每张影视图必走）

```
Step 0: 必填项确认（缺失时提供简洁结构化选项）
  - 比例（默认 2.39:1 宽银幕 或 16:9，character sheet 走 16:9 横版）
  - 媒介（写实 / 动漫 / 3D）
  - 视觉风格（8 种之一 或 自定义）
  - 角色完整描述（脸型 / 发色 / 发型 / 肤色 / 服装），多镜任务必填
  - 镜头数量 + 每镜动作

Step 1: 选视觉风格 + 媒介锁 → read references/visual-styles.md
  8 种风格选 1，媒介锁定 1，把"关键词组合"塞进每张 prompt

Step 2: 组装镜头 prompt → read references/shot-language.md
  六维度（景别 / 机位 / 运镜 / 光影 / 情绪 / 时间）选 3-5 个起作用，每张图组装

Step 3: 角色卡 / 多视图任务 → 使用 references/character-sheet-formats.md
  三视图 / 八视图 / 角色卡左右分屏 / 表情图 / 姿势库的布局规范 + 通用生成要求

Step 4: 跨镜一致性 — Subject Identity Lock
  写一份固定的角色描述卡片，逐字粘贴到每张镜头 prompt + 附同一张参考图

Step 5: 出图后跑通用 5 维基线（构图 / 光影 / 主体 / 质量 / 规范）
  任一不符 → 调整 prompt 重试，重点检查媒介是否漂移
```

## References

| 文件 | 何时使用 |
|---|---|
| `references/shot-language.md` | Step 2 六维镜头 prompt 框架（景别 / 机位 / 运镜 / 光影 / 情绪 / 时间）|
| `references/visual-styles.md` | Step 1 8 种视觉风格 + 写实/动漫/3D 媒介锁 |
| `references/character-sheet-formats.md` | Step 3 三视图 / 八视图 / 角色卡 / 表情 / 姿势库布局规范 |

## 8 种视觉风格速查

| 风格 | 关键词 |
|---|---|
| 赛博朋克 (Cyberpunk) | neon-lit, rain-slick streets, holographic ads, magenta + cyan |
| 港片夜雨 (Hong Kong noir) | wet pavement, moody street lamps, anamorphic blur, teal shadows |
| IMAX 史诗 (Epic IMAX) | wide vistas, anamorphic lens flare, dramatic backlight, 70mm grain |
| 对称糖果色 (Wes Anderson) | symmetrical composition, pastel palette, centered subject, deadpan framing |
| 北欧极简 (Nordic minimal) | desaturated palette, cold light, geometric architecture, snowy textures |
| 70s 胶片 (70s film) | warm Kodak film grain, sun-flared windows, muted earth tones |
| 黑色电影 (Film Noir) | high-contrast black and white, venetian blind shadows, low-key lighting |
| 自然写实 (Natural realism) | available light, handheld feel, documentary aesthetic, no color grading |

详细 prompt 关键词组 → `references/visual-styles.md`

## 媒介风格锁（写实 / 动漫 / 3D）

| 媒介 | Prompt | Negative |
|---|---|---|
| 写实 | `Medium: photorealistic still, real photography aesthetic.` | `NOT illustration, NOT anime, NOT CG render` |
| 动漫 | `Medium: anime / illustration style.` | `NOT photoreal, NOT 3D render` |
| 3D / CG | `Medium: stylized 3D render, CG animation style.` | `NOT photoreal, NOT anime, NOT 2D illustration` |

> **整组所有视图必须锁同一种媒介**——别第 1 张写实、第 2 张动漫，跨视图一致性立刻崩。
