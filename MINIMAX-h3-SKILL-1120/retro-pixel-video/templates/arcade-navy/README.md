# 街机海军蓝预设模板（arcade-navy）

从《年轻人的复利》参考画风英文 30 秒版抽取，可直接运行。依赖：Python3 + Pillow + numpy、ffmpeg。风格规格见 `references/style-presets.md` §1。

```
cd project
python3 render_range.py 241 385 ../out/sample.mp4            # 6 秒风格样片（先做这一步给用户对照参考）
AUDIO=/path/mix.wav python3 render_range.py 0 720 ../out/film.mp4   # 全片，直接管道编码，不落 PNG
```

| 文件 | 改什么 |
|---|---|
| `cues.json` | 唯一时间来源：镜头区间、事件帧、字幕。换文案时用 `plan/build_cues_en.py` 重建 |
| `project/engine/arcade.py` | 预设套件：海军蓝点阵底+透视网格、速度线、步进旋转放射束、蓝底金边横幅（硬弹入）、?块、金币、砖地、白云、绿山、爱心、问号气泡、状态条、跳跃曲线、换装 NPC |
| `project/engine/character.py` | **legacy 示例人物** `draw_zhou`（复利片的眼镜大头青年）。只在 `cues.json` 的 `cast` 声明 `kind: legacy_zhou` 时可用，否则报错；新主题不要用 |
| `project/engine/textfit.py` + `ui.py` | 文字层：英文 Geneva 像素字 ×k×3；含中文改用 Hiragino Sans GB 逻辑字号 12/16/22 无抗锯齿 ×3；按真实 bbox 开画布不截字；字幕超宽自动换行（中文按字、句读避头尾），左右安全边距 32、底部 14 逻辑像素；`PIX_CLEAN=1` 关闭全部文字层。换字体用环境变量 `PIX_FONT_CJK` / `PIX_FONT_LATIN` |
| `project/engine/sprite.py` | 网格手画角色：字符矩阵 → 像素（`Sprite`、`variant` 小改表情、`lint` 自查、`sheet` 出小样） |
| `project/engine/cast.py` | 角色选择入口：读 `cues.json` 的 `cast`，`cast.load("lead")` 取本工程的角色模块 |
| `project/characters/_TEMPLATE.py` | 新角色空骨架：复制改名，按本主题在逻辑网格上手画 |
| `project/tools/char_sheet.py` | 角色姿态小样 + 自查：`python3 tools/char_sheet.py characters.<角色>` |
| `palette/compound-dawn.json` | 57 色；场景返回映射名 `街机`（全部原色，保留靛紫/粉紫） |
| `project/scenes/sN.py` | 1 夜房掉币+举沙漏 · 2 ?块金字塔连锁 · 3 金币分落单利/复利 + 奖励特写 · 4 审核员疑惑→合成 1→低头 · 5 弹琴 XP→不规则台阶 · 7 选卡→每周→三块连跳→群像爱心→收尾 |

## 新主题换角色（必做）

示例片的眼镜青年只用于复现示例。新主题：
1. 复制 `characters/_TEMPLATE.py` 为 `characters/<角色>.py`，按文案在 320×180 网格上手画剪影与像素簇（规则见 `references/style-presets.md` §4），至少 2 个姿态放进 `POSES`。
2. `python3 tools/char_sheet.py characters.<角色>` 出小样并自查（含 `style-presets.md` §5 默认美观：整洁发型、圆润额鼻、短下巴、干净肤色、不显老；用户另有要求时从用户），修完直接继续。
3. 改 `cues.json`（或 `plan/build_cues_en.py` 的 `CAST`）：删掉 `legacy_zhou`，写 `{"lead": {"name": "...", "kind": "sprite", "module": "characters.<角色>"}}`。
4. 场景里用 `cast.load("lead").draw(...)` 或模块里的 `POSES` 画角色；不要调用 `A.hero` / `A.npc`（未声明 legacy 时会报错）。

- 画在 320×180 小画布，最后 `up2()` 2× 放大到 640×360，再 ×3 输出 1080p（1 逻辑像素 = 6 输出像素）。
- 镜头间硬切（`render.py` 中 `TRANS = 0`），机位静止；动感来自角色姿态、步进特效与弹入。
- 落币时间公式 `hit_frames()` 与音效混音共用，改它会让音画错位。
- 实测（本机，热运行，渲染+编码）：48 帧 3.2 秒；6 秒样片 144 帧 27 秒；30 秒全片 720 帧 61 秒。
- 资产来源：角色、场景、道具、色板均由程序原创绘制；未使用参考视频的任何像素、水印或文案。
