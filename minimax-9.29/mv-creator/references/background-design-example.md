# 背景图设计格式示例

以下是单个背景的 `{bg_name}/design.md` 标准格式。每个背景独立一个目录和文件。

```markdown
# 荒漠公路 Desert Highway

## 场景描述

- 环境类型：室外 / 开阔地形
- 地形/空间：笔直的双车道公路，延伸至远方地平线，两侧是平坦的黄沙戈壁
- 色调/氛围：暖黄色沙漠基调，golden hour 金色阳光，天际线泛紫红
- 关键元素：路面裂纹和热浪扭曲、远处红色岩山轮廓、路边枯草丛和倒伏的路标
- 天气/时段：晴朗无云、黄昏前后

## 出场幕列表

第一幕（黎明启程）、第二幕（公路独行）、第七幕（终点回望）

## 生图设定

提示词：
  A long straight desert highway stretching to the horizon, cracked asphalt
  with heat haze, flat sandy terrain on both sides, distant red rock mesas,
  dried grass and a tilted road sign on the shoulder. Golden hour warm light,
  purple-red sky at the horizon. Cinematic, 35mm film, warm amber tones,
  wide establishing shot, no people.
  single scene, no split screen, no multiple panels, no collage.

模型：nano_banana_2
参考图：style_cache/cinematic/01_highway.png

## 候选图

- candidate_01.jpg — nano_banana_2, 超广角地平线延伸
- candidate_02.jpg — nano_banana_2, 低角度路面特写
- candidate_03.jpg — nano_banana_2, 黄昏逆光全景

## 选定图

selected.jpg（候选图 01）
```

## 格式要点

- 一级标题 `#` 用于背景名（中文名 + 英文名）
- 二级标题 `##` 用于各字段分区，必须包含以下 5 个分区：
  - `## 场景描述` — 用列表逐项描述：环境类型、地形/空间、色调/氛围、关键元素、天气/时段
  - `## 出场幕列表` — 该背景在哪些幕中出现（从 script.md 提取）
  - `## 生图设定` — 包含三个子字段：
    - `提示词：` — 英文，融合场景描述和美术风格关键词，必须包含 `no people`
    - `模型：` — 使用的生图模型名称
    - `参考图：` — 美术风格参考图路径（相对 theme 目录）
  - `## 候选图` — 所有生成的候选图路径（相对背景目录），每行附模型和构图说明
  - `## 选定图` — 最终选定的图片路径（由用户在预览页面中挑选）
- 图片存放在背景同级目录下（candidate_*.jpg, selected.jpg）
- 生成候选图后、用户选定前，`## 选定图` 区域留空
- **宽高比统一使用 16:9 宽屏**（`aspect_ratio: "16:9"`），展示场景全貌

## 文件组织

```
./.mv/{song_name}/{theme}/
├── backgrounds/
│   ├── {bg_name_1}/
│   │   ├── design.md            # 背景设计说明
│   │   ├── candidate_01.jpg     # 候选图
│   │   ├── candidate_02.jpg
│   │   └── selected.jpg         # 最终选定图
│   ├── {bg_name_2}/
│   │   ├── design.md
│   │   ├── candidate_01.jpg
│   │   └── selected.jpg
```
