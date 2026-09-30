# 物件设计格式示例

以下是单个物件的 `{prop_name}/design.md` 标准格式。每个物件独立一个目录和文件。

```markdown
# 旧皮卡 Old Pickup Truck

## 外观描述

- 类型：载具
- 形态：1970s Ford F-150 皮卡，车身线条方正硬朗，车斗敞开
- 颜色/材质：深蓝色车漆大面积剥落露出底漆和铁锈，金属车身带明显凹痕
- 尺寸/比例：标准全尺寸皮卡，车斗可坐人或放吉他箱
- 细节特征：挡风玻璃左下角蛛网状裂纹、保险杠贴着褪色公路贴纸、车斗里散落旧毛毯和绳索、左尾灯用胶带缠着

## 叙事作用

旧皮卡是旅人漂泊生活的物质载体，承载着他所有的行李和记忆。
车身的锈迹与伤痕映射着旅人自身的经历——破旧但仍在行驶，
暗示一种"不完美但不放弃"的生活态度。它在公路镜头中反复出现，
既是交通工具也是移动的家，是全片最核心的视觉符号之一。

## 生图设定

提示词：
  A beat-up 1970s dark blue Ford F-150 pickup truck parked on the shoulder
  of a desert highway at golden hour. Peeling paint revealing rust and primer,
  cracked windshield, faded bumper stickers, old blanket in the truck bed.
  Cinematic, 35mm film, warm amber tones, wide shot.
  single object, no split screen, no multiple panels, no collage.

模型：Midjourney V7 --ar 3:2
参考图：style_cache/cinematic/02_bar.png

## 候选图

- candidate_01.jpg — Midjourney V7, 公路侧方全景
- candidate_02.jpg — Gemini, 车头45度特写
- candidate_03.jpg — Midjourney V7, 黄昏逆光剪影

## 选定图

selected.jpg（候选图 01）
```

## 格式要点

- 一级标题 `#` 用于物件名（中文名 + 英文名）
- 二级标题 `##` 用于各字段分区，必须包含以下 5 个分区：
  - `## 外观描述` — 用列表逐项描述：类型、形态、颜色/材质、尺寸/比例、细节特征
  - `## 叙事作用` — 一段话描述物件在故事中的功能和象征意义
  - `## 生图设定` — 包含三个子字段：
    - `提示词：` — 英文，融合物件描述和美术风格关键词
    - `模型：` — 使用的生图模型名称
    - `参考图：` — 美术风格参考图路径（相对 theme 目录）
  - `## 候选图` — 所有生成的候选图路径（相对物件目录），每行附模型和构图说明
  - `## 选定图` — 最终选定的图片路径（由用户在预览页面中挑选）
- 图片存放在物件同级目录下（candidate_*.jpg, selected.jpg）
- 生成候选图后、用户选定前，`## 选定图` 区域留空

## 文件组织

```
./.mv/{song_name}/{theme}/
├── props/
│   ├── {prop_name_1}/
│   │   ├── design.md            # 物件设计说明
│   │   ├── candidate_01.jpg     # 候选图
│   │   ├── candidate_02.jpg
│   │   └── selected.jpg         # 最终选定图
│   ├── {prop_name_2}/
│   │   ├── design.md
│   │   ├── candidate_01.jpg
│   │   └── selected.jpg
```
