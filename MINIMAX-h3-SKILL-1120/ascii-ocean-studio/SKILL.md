---
name: ascii-ocean-studio
description: |
  将用户指定的海洋生物名称或照片转为 ASCII 字符角色，一键生成支持游动、投喂与避让的交互海洋网页，默认黑白。不适用于通用 ASCII 图像制作。
trigger-words: [ASCII aquarium, ASCII ocean, ASCII sea creatures, photo to ASCII creature, ASCII海洋工作室, 字符海洋, ASCII 海洋生物, 照片转字符生物]
---
# ASCII海洋工作室

当用户想要一个由自己挑选的海洋生物组成的 ASCII 字符海洋网页时，按此流程执行。网页是可离线打开的单个 HTML 文件：ASCII 字符生物围绕居中的极简对话卡片（标题 `let your thoughts drift.`、输入框、发送按钮）自由游动。点击空白水域投放食物，附近生物（每粒最多 3 只）游过来吃；鼠标悬停显示小放大镜；每约 46 秒有一只巨型访客穿过，其他生物主动让路。默认主题为 **Ink**（`mono`）：白底纯黑的字符与文字；Pearl、Abyss、Sunset 三套彩色主题保留，可通过主题按钮切换。

这是观赏性艺术作品，不是游戏：生物之间允许轻微交叠，只要不扎堆即可，因为严格分离会让多只生物无法一起游向同一粒食物。以桌面端为主。

用用户的语言交流；网页 UI 文字保持英文、简短干净。

## STEP 0：检查资源

1. 缺少依赖时先安装一次：`pip install -r scripts/requirements.txt` 和 `python3 -m playwright install chromium`（抠图、SVG 渲染和冒烟检查都需要）。
2. 输出写到当前项目目录，不要写死个人路径。
3. 不渲染视频，也不用生图模型生成参考图——用户只要网页，只说名字的生物用代码画轮廓就够了。

## STEP 1：先问用户要哪些生物（必须最先做）

动手前先问：

> 你想让哪些海洋生物住进这片海？**至少选 3 种**。每一种都可以：
> **A.** 直接说名字（比如"蝠鲼""翻车鱼""灯笼水母"）；
> **B.** 上传一张照片或插画，我把它做成字符角色。
> 也可以告诉我哪一种作为偶尔路过的巨型访客。

- 最少且默认 **3 种生物**，最多 7 种（6 个常驻位 + 1 个访客位）。不足 3 种时请用户补充，或推荐内置生物补齐。
- 生物清单明确后直接构建并展示完成的网页，中间不需要再确认。

## STEP 2：规划每种生物

为每种生物确定轮廓来源、运动方式和槽位。

### 轮廓来源

| 用户给的 | 处理方式 |
|---|---|
| 内置物种：鲨鱼、槌头鲨、鳐鱼、海龟、水母、章鱼 | 直接保留该槽位的内置生物，无需图片。 |
| 照片或插画 | 直接使用。纯色或透明背景最佳；纯色或棋盘格边框会从边缘向内泛洪去除，因此身体内部的浅色区域（如眼白）会被保留。 |
| 只有名字（非内置） | 用代码画一个干净的 **SVG 轮廓**：侧视全身、实色填充、明显更深的眼睛（深色会变成 `@` 瞳孔字符）、可选白色高光、白底，游动类头朝左。按 `references/SILHOUETTES.md` 的规则和示例绘制。 |

### 运动方式

- `swim`——鱼、鲨、鲸、鳐、海龟、海豹、鳗：横向、越靠尾部摆动越大的身体波动。图中头朝右时设 `facing=right`。
- `pulse`——水母、章鱼、鱿鱼及圆形或竖长身体：伞体脉动加下半部摆动。

### 槽位（每个槽位一种生物）

- `hero`、`second`——最大的两个常驻位（大型游动类）。
- `ray`、`turtle`——中型游动类。
- `jellyfish`、`octopus`——竖向或脉动类身体。
- `visitor`——巨型路过者，必须是 `swim`。

每种生物可选：`scale=`（屏幕尺寸，像素）、`rotate=`（逆时针角度，用于斜拍照片）、`name=`（只用于日志，不显示在 UI）。

## STEP 3：构建并检查（一条命令）

```bash
python3 scripts/make.py --out <输出目录> \
  --creature "slot=octopus,image=octo.png,motion=pulse,name=Headphone octopus" \
  --creature "slot=ray,image=sunfish.svg,motion=swim,name=Sunfish,scale=140" \
  --creature "slot=visitor,image=whale.jpg,motion=swim,facing=right,name=Blue whale" \
  [--keep hero,turtle]   # 用户选中的内置生物槽位，计入至少 3 种
  [--theme mono|pearl|abyss|sunset] [--speed 1.4] [--width 1920 --height 1080]
```

执行内容：
1. `scripts/silhouette.py` 把每张图转成约 96 列的密度网格，带瞳孔和高光字符，并由生物自身色相派生 Pearl/Abyss/Sunset 三套彩色配色（Ink 主题下一律为黑色）。
2. `scripts/build.py` 把生物注入 `templates/index.html`；未指定的槽位保留内置生物。
3. headless 冒烟检查：页面报错、出现非法字符或任一自定义生物不可见都会判定失败。选中的生物（自定义 + `--keep`）少于 3 种会被拒绝；只选内置生物时，只传 `--keep` 即可。

输出：`demo/index.html`（本地打开、无需联网）、`creatures/<slot>-grid.png`（每种生物的 ASCII 预览）、`smoke.json`。

**抠图效果不对**——背景残留或身体缺失：调整 `tolerance=`（默认 34）、裁剪照片或改用透明 PNG。游动类生物过高或倾斜：用 `rotate=` 或改成 `pulse`。

**测试投喂时的坑**：点击对话卡片内部会被有意忽略，测试食物要放在空白水域。

## STEP 4：展示结果

用 headless 截一张图，展示网页并用用户的语言简要说明：
- 哪种生物在哪个槽位、用哪种运动方式；
- 当前使用的主题；
- 抠图上的局限。

然后询问是否要替换、增加或改色。每次 `make.py` 都会重建整个页面，不会合并旧输入。修改时传入当前完整的自定义 `--creature` 清单（包括未改动的生物及其源图片）、完整的 `--keep` 清单，以及当前主题、速度与尺寸，选中的生物总数仍至少为 3。将完整命令及源图片保存在项目中，供后续修改时保留已确认配置。

## 能力边界

- 自定义生物沿用内置物理（swim → 鲨鱼，pulse → 章鱼），鳍和触手不单独绑定。
- 抠图是启发式的；背景杂乱的照片可能需要更干净的图。
- 不打包任何上游代码，无法访问的链接绝不声称看过，见 `references/SOURCES.md`。运动与页面 API 细节见 `references/INTERACTION.md`。
