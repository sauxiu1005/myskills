# 角色设计格式示例

以下是单个角色的 `{character_name}/design.md` 标准格式。每个角色独立一个目录和文件。

```markdown
# 旅人 The Traveller

## 外貌特征

- 年龄/性别：30多岁男性
- 体型：中等偏瘦，肩膀宽厚
- 发型：深棕色头发微卷，略长
- 面部：蓄着短胡茬，轮廓分明
- 服装：红灰格纹法兰绒衬衫、磨旧的棕色牛仔靴、膝盖自然磨损的牛仔裤
- 配饰：左手腕旧皮表带手表

## 性格气质

沉稳而自由，眼神中有沧桑但不颓废。
动作不急不缓，像是已经习惯了漫长的公路和独处。

## 标志物件

- Martin D-28 原木色吉他（有使用痕迹和贴纸）
- 破旧的深蓝色 Ford F-150 皮卡

## 生图设定

提示词：
  A rugged man in his 30s with short stubble and slightly curly brown hair,
  wearing a red-grey plaid flannel shirt and worn cowboy boots, carrying a
  Martin acoustic guitar. Cinematic, 35mm film, warm amber tones, natural lighting.
  single character, single view, no split screen, no multiple panels, no collage, no reference sheet.

模型：Midjourney V7 --ar 2:3
参考图：style_cache/cinematic/01_highway.png

## 候选图

- candidate_01.jpg — Midjourney V7, 全身站姿
- candidate_02.jpg — Kling, 半身特写
- candidate_03.jpg — Midjourney V7, 弹吉他侧面

## 选定图

selected.jpg（候选图 01）
```

## 格式要点

- 一级标题 `#` 用于角色名（中文名 + 英文名）
- 二级标题 `##` 用于各字段分区，必须包含以下 6 个分区：
  - `## 外貌特征` — 用列表逐项描述：年龄/性别、体型、发型、面部、服装、配饰
  - `## 性格气质` — 表情、姿态、整体气质描述
  - `## 标志物件` — 角色专属的识别性物件，列表形式
  - `## 生图设定` — 包含三个子字段：
    - `提示词：` — 英文，融合角色描述和美术风格关键词
    - `模型：` — 使用的生图模型名称
    - `参考图：` — 美术风格参考图路径（相对 theme 目录）
  - `## 候选图` — 所有生成的候选图路径（相对角色目录），每行附模型和构图说明
  - `## 选定图` — 最终选定的图片路径（由用户在预览页面中挑选）
- 图片存放在角色同级目录下（candidate_*.jpg, selected.jpg）
- 生成候选图后、用户选定前，`## 选定图` 区域留空

## 文件组织

```
./.mv/{song_name}/{theme}/
├── {character_name_1}/
│   ├── design.md            # 角色设计说明
│   ├── candidate_01.jpg     # 候选图
│   ├── candidate_02.jpg
│   └── selected.jpg         # 最终选定图
├── {character_name_2}/
│   ├── design.md
│   ├── candidate_01.jpg
│   └── selected.jpg
```
