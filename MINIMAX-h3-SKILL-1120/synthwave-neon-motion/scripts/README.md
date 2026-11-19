# scripts · 最小本地预览

`synthwave_preview.py` 是原创、免费、本地运行的最小示例：天空渐变 + 星点、条纹落日（条纹越往下越宽并向下滚动）、两层线框山脉、透视霓虹网格、地平线热线、铬金属中文标题（约 70% 处砸入 + 闪光回弹）、双层辉光与可选扫描线/RGB 偏移。演示镜头：**C1 低机位推进 → C2 横移视差**；`--loop` 为 C7 静镜循环。

它不是通用渲染框架：没有音频、没有产品主体、没有事件表驱动。完整作品按 `references/workflow-and-qa.md` 另行制作。

依赖：python3、numpy、Pillow、ffmpeg。

```bash
# 5 秒预览（默认 1280×720 30fps 150 帧）
python3 scripts/synthwave_preview.py --out preview.mp4
# 换色板/强度/文字
python3 scripts/synthwave_preview.py --palette cyan-midnight --intensity full --title "深夜电台" --subtitle "LIVE · 每晚十点"
# 无缝循环 6 秒（帧数须被 grid-period 与 band-period 整除）
python3 scripts/synthwave_preview.py --loop --frames 180 --grid-period 30 --band-period 90 --out loop.mp4
# 单帧静帧（竖屏示例）
python3 scripts/synthwave_preview.py --width 1080 --height 1920 --still 120 --out still.png
```

确定性：每帧只由帧序号、参数和 `--seed` 决定，不读系统时间；同参数重渲结果一致。
字体：使用系统已安装的中文字体（macOS 黑体 / 冬青黑体，或 Noto Sans CJK），不随包分发。

## scenes_showcase.py · 三场景 2.5D 展示（v0.2 增强）

三个 4 秒场景：01 COASTLINE DRIVE、02 ARCADE AFTER DARK、03 NEON OBJECT（画内只用英文）。2.5D = 平面多边形 + 针孔相机投影 + 画家算法，不是真 3D、不是 AI 生成。**默认参数输出与 v0.1 逐像素一致**；新能力需显式开启：

| 参数 | 作用 |
|---|---|
| `--motion base|standard|high` | base=v0.1 动作；standard/high 打开已实现的动作升级（high 幅度 ×1.5） |
| `--look clean|film` | film：逐帧胶片颗粒 + 暗部轻抬 + 高光柔肩 + halation |
| `--grain auto|off|low|standard|strong` | auto：film 时为 standard，否则 off；颗粒尺寸随输出高度缩放，固定 `--seed` 可复现 |
| `--halation 0..1` `--weave` `--flicker` | 局部红橙光晕强度；片门漂移（在缩放前施加，不软化画面）；±1.4% 曝光波动 |
| `--chroma N` `--scanlines` | 视频/CRT 伪影，独立于胶片颗粒，默认关闭 |
| `--range a:b` `--tag TEXT` `--frames …` | 只渲染帧区间；左上角英文标签（如 ORIGINAL / RETRO MOTION）；导出静帧 |

```bash
# 原版 720p（与 v0.1 相同）
python3 scripts/scenes_showcase.py --out showcase_12s.mp4
# 复古增强版 720p
python3 scripts/scenes_showcase.py --look film --weave --flicker --motion standard --out showcase_retro.mp4
# 快速 A/B：只渲染夜驾 4 秒，960×540、无超采样
python3 scripts/scenes_showcase.py --width 960 --height 540 --ss 1 --range 0:120 --tag ORIGINAL --out a.mp4
python3 scripts/scenes_showcase.py --width 960 --height 540 --ss 1 --range 0:120 --tag "RETRO MOTION" --look film --motion standard --out b.mp4
```

film 模式编码自动加 `-tune grain` 与更低 CRF，避免颗粒被压缩抹掉（文件会明显变大）。720p `--ss 2` 每帧较慢（8 核约 40 分钟/12 秒），预览先用 `--ss 1`。
未实现：透视字飞入、条带遮罩揭示、光带擦除、线框形变、模拟视频转场（只在 `references/motion-fx-library.md` 写了规则）；无音频。

注意：v0.2 把 `palettes/intensity.json` 中 standard 档的 `scanlines` 从 0.06 改为 0（扫描线属于视频伪影，不是胶片），`synthwave_preview.py --intensity standard` 因此不再默认画扫描线；需要时用 `--intensity full`。

> 范围说明：这两个脚本实现几何 MG、场景、排版和特效。本技能默认不做人物（见 `references/character-narrative.md`），故事中的人由物件、光和视角表达。

## lofi_score.py（默认配乐）

本地合成 lo-fi 配乐，读取与画面相同的 `cues.json`：`python3 lofi_score.py cues.json score.wav`。字段说明见脚本开头与 `../references/lofi-score.md`。
