"""空骨架：复制为 characters/<角色>.py，按本主题文案手画角色；不要直接使用本文件，也不要把旧示例人物当起点。

步骤（逻辑网格上逐像素画，见 references/style-presets.md §4）：
1. 先定剪影：只用 '.' 和 'o' 把轮廓画清楚，缩小看也认得出是谁（人物/动物/物件均可，比例按角色需要，不强制大头）。
2. 再分材质：每种材质 2–3 阶（亮/中/暗），在 LEGEND 里映射到色板 ramp；轮廓阶梯规则（1-1、2-1、2-2 均匀过渡），不要锯齿乱跳。
3. 脸用少量像素：眼 1–2 像素、嘴 1–2 像素；避免巨大白眼镜、细碎尖发、单像素噪点。
4. 至少画 2 个姿态放进 POSES，跑 python3 tools/char_sheet.py characters.<角色> 出小样并看自查结果。
默认美观（用户没给年龄/外形/写实/怪诞要求或参考时，见 style-presets.md §5）：发型整洁蓬松有高光、额鼻下巴圆润短小、
   闭眼 2 像素线、颊色 1–2 像素、肤色暗阶只用在颈下等交界；无胡茬/皱纹/凹陷侧脸；无年龄设定的日常主题用年轻成年人中性造型。
   可以只写填色矩阵，再用 engine.sprite.outline(rows) 自动补轮廓。用户要求优先，美观不等于固定性别、肤色或年龄。
5. 在 cues.json 的 "cast" 里声明：{"lead": {"name": "...", "kind": "sprite", "module": "characters.<角色>"}}。
"""
from engine.sprite import Sprite

LEGEND = {
    "o": ("ink", 0),
    # "a": ("<ramp>", 1), "b": ("<ramp>", 2), "c": ("<ramp>", 3),
}

IDLE = Sprite([
    "....",          # ← 替换为本主题角色的像素矩阵
], LEGEND, name="待设计")

POSES = [IDLE]
