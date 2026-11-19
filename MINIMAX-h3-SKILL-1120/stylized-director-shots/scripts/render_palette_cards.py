"""Render palette cards from assets/palettes/<director>/schemes.json.

- <ID>-card.png : text-free colour-role card for use as a generation reference (no text, no layout labels).
- preview.svg / preview.png : labelled human preview of all schemes of one director.
Run from the skill root:  python3 scripts/render_palette_cards.py
Custom director (temporary branch):  python3 scripts/render_palette_cards.py <dir containing schemes.json>
"""
import json, os, glob
from PIL import Image, ImageDraw, ImageFont

ROLE_ORDER = ["background_main", "shadow", "light_highlight", "accent_small", "skin_protection"]
ROLE_ZH = {"background_main": "背景主色", "shadow": "阴影", "light_highlight": "光源高光",
           "accent_small": "小面积强调", "skin_protection": "肤色保护"}
PROV_ZH = {"user_real_palette_unverified": "用户截图取色·方法未核实", "user_design_suggestion": "用户设计建议",
           "sampled_from_user_still": "本技能单帧取样", "sampled_from_web_still": "网络剧照取样·只代表所取帧", "manual_suggestion": "人工建议色值"}
WEIGHT = {"background_main": 52, "shadow": 30, "light_highlight": 10, "accent_small": 3, "skin_protection": 5}


def font(size):
    for p in ["/System/Library/Fonts/Hiragino Sans GB.ttc", "/System/Library/Fonts/STHeiti Medium.ttc",
              "/System/Library/Fonts/Supplemental/Arial Unicode.ttf"]:
        if os.path.exists(p):
            return ImageFont.truetype(p, size)
    return ImageFont.load_default()


def rgb(h):
    h = h.lstrip("#"); return tuple(int(h[i:i + 2], 16) for i in (0, 2, 4))


def blocks(scheme):
    out = []
    for role in ROLE_ORDER:
        hx = scheme["roles"][role]["hex"]
        for h in hx:
            out.append((role, h, WEIGHT[role] / len(hx)))
    return out


def card(scheme, path, W=1600, H=900):
    """Text-free card: proportional vertical bands, background colour first.
    Empty roles (no accent, skin protection) add no swatch."""
    im = Image.new("RGB", (W, H), rgb(scheme["roles"]["background_main"]["hex"][0]))
    d = ImageDraw.Draw(im)
    bl = blocks(scheme); tot = sum(w for _, _, w in bl); x = 0
    for i, (_, h, w) in enumerate(bl):
        x2 = W if i == len(bl) - 1 else x + max(24, round(W * w / tot))
        d.rectangle([x, 0, x2, H], fill=rgb(h)); x = x2
    im.save(path)


def preview(data, png, svg):
    sc = data["schemes"]; W, rowH, top = 1800, 330, 120; H = top + rowH * len(sc) + 60
    im = Image.new("RGB", (W, H), (245, 242, 236)); d = ImageDraw.Draw(im)
    f1, f2, f3 = font(40), font(26), font(18)
    d.text((40, 30), f"{data['director_zh']} {data['director_en']} · 配色方案（互斥，一次只选一个）", fill=(20, 20, 20), font=f1)
    parts = [f'<svg xmlns="http://www.w3.org/2000/svg" width="{W}" height="{H}" viewBox="0 0 {W} {H}">',
             f'<rect width="{W}" height="{H}" fill="#F5F2EC"/>',
             f'<text x="40" y="70" font-size="40" font-family="PingFang SC, Hiragino Sans GB, sans-serif" fill="#141414">{data["director_zh"]} {data["director_en"]} · 配色方案（互斥，一次只选一个）</text>']
    for r, s in enumerate(sc):
        y = top + r * rowH
        title = f"{s['id']} {s['name_zh']} — {s['film']}"
        d.text((40, y), title, fill=(20, 20, 20), font=f2)
        parts.append(f'<text x="40" y="{y+26}" font-size="26" font-family="PingFang SC, Hiragino Sans GB, sans-serif" fill="#141414">{title}</text>')
        x = 40
        for role in ROLE_ORDER:
            rd = s["roles"][role]; hx = rd["hex"] or [None]
            bw = 330
            sw = bw // len(hx)
            for i, h in enumerate(hx):
                bx = x + i * sw
                if h:
                    d.rectangle([bx, y + 45, bx + sw - 6, y + 205], fill=rgb(h))
                    d.text((bx + 4, y + 210), h, fill=(40, 40, 40), font=f3)
                    parts.append(f'<rect x="{bx}" y="{y+45}" width="{sw-6}" height="160" fill="{h}"/>')
                    parts.append(f'<text x="{bx+4}" y="{y+228}" font-size="18" font-family="Menlo, monospace" fill="#282828">{h}</text>')
                else:
                    empty = "保留原肤色" if role == "skin_protection" else "不设色"
                    d.rectangle([bx, y + 45, bx + sw - 6, y + 205], outline=(150, 150, 150), width=2)
                    d.text((bx + 10, y + 115), empty, fill=(120, 120, 120), font=f3)
                    parts.append(f'<rect x="{bx}" y="{y+45}" width="{sw-6}" height="160" fill="none" stroke="#969696" stroke-width="2"/>')
                    parts.append(f'<text x="{bx+10}" y="{y+130}" font-size="18" font-family="PingFang SC, sans-serif" fill="#787878">{empty}</text>')
            lab = f"{ROLE_ZH[role]} · {PROV_ZH[rd['provenance']]}"
            d.text((x, y + 240), lab, fill=(70, 70, 70), font=f3)
            if rd.get("suggested_area"):
                d.text((x, y + 264), "面积" + rd["suggested_area"], fill=(110, 110, 110), font=f3)
            parts.append(f'<text x="{x}" y="{y+258}" font-size="18" font-family="PingFang SC, sans-serif" fill="#464646">{lab}</text>')
            if rd.get("suggested_area"):
                parts.append(f'<text x="{x}" y="{y+282}" font-size="18" font-family="PingFang SC, sans-serif" fill="#6E6E6E">面积{rd["suggested_area"]}</text>')
            x += bw + 18
    foot = "肤色保护不给色值：保留角色原本肤色。预览卡仅供人工阅读；生成时只上传无文字的 <ID>-card.png。面积与色值标注见 schemes.json，均非官方 LUT 或全片统计。"
    d.text((40, H - 45), foot, fill=(90, 90, 90), font=f3)
    parts.append(f'<text x="40" y="{H-28}" font-size="18" font-family="PingFang SC, sans-serif" fill="#5A5A5A">{foot.replace("<","&lt;").replace(">","&gt;")}</text>')
    parts.append("</svg>")
    im.save(png); open(svg, "w").write("\n".join(parts))


if __name__ == "__main__":
    import sys
    targets = [os.path.join(a, "schemes.json") for a in sys.argv[1:]] or sorted(glob.glob("assets/palettes/*/schemes.json"))
    for js in targets:
        data = json.load(open(js)); base = os.path.dirname(js)
        for s in data["schemes"]:
            card(s, os.path.join(base, f"{s['id']}-card.png"))
        preview(data, os.path.join(base, "preview.png"), os.path.join(base, "preview.svg"))
        print("rendered", base)
