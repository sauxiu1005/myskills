---
name: short-drama-production
description: |
  根据用户要求做短剧。
---


## 阶段 1：剧本

1. 参考 `references/short-drama-genres.md` 将用户设定与合适的参考结合，出海短剧再读取其中的「出海改编」小节。
2. 直接给出创作大纲，包括但不限于：剧名、一句话故事、主要转折、结局方向，多集时含分集大纲；
3. 依据大纲，参考 `references/short-drama-script.md` 制作剧本。


## 阶段 2：角色与场景参考

- 按 `references/character-reference.md` 为露脸的主要角色建立定妆图；按 `references/scene-reference.md` 为跨镜头复用的地点建立空间参考

## 阶段 3：分镜与片段提示词

按 `references/storyboard-planning.md` 制作分镜；按其中「片段提示词」模板，为每个生成单元带入角色与场景参考编写提示词，台词逐字沿用剧本；提示词直接用于视频生成，不落文档。


## 阶段 4：视频生成与合成

- 已生成的视频片段，按分镜表顺序合成为单集成片。
- 片段只保留对白、环境声、动作声和拟音；用户需要配乐或字幕时，在成片阶段按剧本的情绪和时长节奏，进行生成，并和已有成片结合在一起。



## 能力边界

如有不属于本 Skill 的其他需求，则由 agent 自主选择其他 Skill。
