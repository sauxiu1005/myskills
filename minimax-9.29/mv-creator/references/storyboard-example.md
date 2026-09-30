# 分镜规划格式示例

以下是 `storyboard.md` 的标准格式。每幕对应脚本中的一个场景，引用已生成的背景图、人设图和物件图，包含视频生成提示词。

```markdown
# 歌曲名 — MV 分镜规划

## 第一幕：黎明启程

* 0:00 - 0:12 (12s)

出场角色：traveller
场景背景：desert_highway
关键物件：old_pickup

场景描述：
  男人站在破旧皮卡旁，晨光从地平线倾泻而来，逆光勾勒出他和吉他的剪影。
  远处是空旷的荒漠公路，延伸至天际线。

视频提示词：
  use image 1 as the background, image 2 as the character reference,
  image 3 as the prop reference. A rugged man stands beside a vintage
  blue pickup truck at dawn. Golden hour backlight creates silhouette.
  He reaches into the truck bed to grab his guitar. Camera slowly
  dollies in from wide establishing shot. Warm amber tones, 35mm film grain.

参考图：
  - backgrounds/desert_highway/selected.jpg（背景参考）
  - characters/traveller/selected.jpg（角色参考）
  - props/old_pickup/selected.jpg（物件参考）

候选图：
  - scene_01.jpg — nano_banana_2, 超广角皮卡全景

选定图：
  scene_01.jpg

---

## 第二幕：公路独行

* 0:12 - 0:23 (11s)

> 风吹过荒原的尽头
> 我听见远方在呼唤

出场角色：traveller
场景背景：desert_highway

场景描述：
  皮卡行驶在笔直的公路上，车窗半开，男人单手扶方向盘，
  另一手搭在车窗外。阳光打在他侧脸上，表情平静而坚定。

视频提示词：
  use image 1 as the background, image 2 as the character reference.
  A man driving a vintage pickup truck on a straight desert highway,
  one hand on steering wheel, other arm resting on open window.
  Sunlight on his face, calm determined expression. Interior car shot,
  shallow depth of field. Camera slowly pans from dashboard to his profile.
  Cinematic, 35mm film grain, warm amber palette.

参考图：
  - backgrounds/desert_highway/selected.jpg（背景参考）
  - characters/traveller/selected.jpg（角色参考）

候选图：
  - scene_02.jpg — nano_banana_2, 车内侧脸特写

选定图：
  scene_02.jpg

---

## 第三幕：星空营地

* 0:23 - 0:35 (12s)

> 星星落在篝火旁
> 照亮你来时的路

出场角色：（无）
场景背景：starlit_camp

场景描述：
  无人的荒野营地，篝火微弱地燃烧着，火星飞散向漫天星河。
  皮卡停在远处，车头灯已熄灭，月光洒在沙地上。

视频提示词：
  use image 1 as the background scene. A solitary campfire burning
  in vast desert wilderness at night, embers floating up toward
  milky way galaxy. Gentle wind makes flames flicker. No people.
  Camera slowly tilts up from campfire to starry sky. Cool blue
  shadows, warm fire glow contrast, long exposure stars effect.

参考图：
  - backgrounds/starlit_camp/selected.jpg（背景参考）

候选图：
  - scene_03.jpg — nano_banana_2, 篝火星空全景

选定图：
  scene_03.jpg
```

## 格式要点

- 一级标题 `#` 仅用于文件标题（歌曲名 — MV 分镜规划）
- 二级标题 `##` 用于每幕场景标题，与 `script.md` 的幕名保持一致
- 时间码行格式：`* M:SS - M:SS (Xs)`，与 `script.md` 一致
- 歌词引用以 `> ` 开头（从 script.md 同步），纯音乐幕无歌词
- 每幕包含以下字段：
  - `出场角色：` — 该场景中出现的角色**目录名**（逗号分隔），无角色则写 `（无）`
  - `场景背景：` — 对应的背景**目录名**（与 `backgrounds/` 目录名一致）
  - `关键物件：` — 物件**目录名**（逗号分隔），无物件可省略
  - `场景描述：` — 中文画面描述，缩进 2 空格，可多行
  - `视频提示词：` — 英文 prompt，引用参考图编号 + 描述动态和镜头，缩进 2 空格
  - `参考图：` — 列表形式，每行注明用途（背景参考/角色参考/物件参考），路径相对 theme 目录
  - `候选图：` — 列表形式，每行记录分镜图文件名（位于 `storyboard/` 目录下）和构图说明
  - `选定图：` — 用户选定的最终分镜图文件名
- 场景之间用 `---` 分隔

## 参考图使用策略

| 场景类型 | 参考图 |
|----------|--------|
| 角色场景 | 背景 `selected.jpg` + 角色 `selected.jpg` |
| 角色 + 物件场景 | 背景 `selected.jpg` + 角色 `selected.jpg` + 物件 `selected.jpg` |
| 多角色同框 | 背景 `selected.jpg` + 多个角色 `selected.jpg` |
| 纯空镜/风景 | 仅背景 `selected.jpg` |

## 文件组织

```
./.mv/{song_name}/{theme}/
├── storyboard.md                          # 分镜规划文档
├── storyboard/                            # 分镜图目录
│   ├── scene_01.jpg
│   ├── scene_02.jpg
│   └── ...
```
