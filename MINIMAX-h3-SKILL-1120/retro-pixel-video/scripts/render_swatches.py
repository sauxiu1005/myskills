#!/usr/bin/env python3
"""render_swatches.py — 把 Skill 的色板 JSON 渲染为一张色卡 PNG 与一个单文件 HTML。

读取 <Skill目录>/palettes/*.json（字段: name, name_en, tier, colors[].index/hex/role/ramp,
ramps, cycle_ranges, fx_colors），输出:
  palettes/swatches.png   所有色板一张图；按 ramp 分行（超过 --max-cols 自动折行，宽高按内容自适应），每色块标 index + hex，
                          特效色加 FX 标记，循环区间单独一行并以括号标出。
  palettes/swatches.html  （可选）单文件、内联数据与样式，不依赖网络；0.5.0 起默认不随 Skill 分发。

只依赖 Python3 + Pillow。中文字体按 --font → 常见系统字体 依次查找；
找不到中文字体时 PNG 内使用英文名（name_en / role 原文）。
"""
import argparse
import glob
import html
import json
import os
import sys

from PIL import Image, ImageDraw, ImageFont

SKILL_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# 常见系统 CJK 字体（只是候选，找不到会自动降级）
CJK_FONT_CANDIDATES = [
    "/System/Library/Fonts/PingFang.ttc",
    "/System/Library/Fonts/Hiragino Sans GB.ttc",
    "/System/Library/Fonts/STHeiti Medium.ttc",
    "/System/Library/Fonts/STHeiti Light.ttc",
    "/Library/Fonts/Arial Unicode.ttf",
    "/usr/share/fonts/opentype/noto/NotoSansCJK-Regular.ttc",
    "/usr/share/fonts/noto-cjk/NotoSansCJK-Regular.ttc",
    "/usr/share/fonts/truetype/wqy/wqy-microhei.ttc",
    "C:/Windows/Fonts/msyh.ttc",
    "C:/Windows/Fonts/simhei.ttf",
]


# ---------------------------------------------------------------- 数据规整
def hex_to_rgb(h):
    h = h.strip().lstrip("#")
    if len(h) == 3:
        h = "".join(c * 2 for c in h)
    return tuple(int(h[i:i + 2], 16) for i in (0, 2, 4))


def _as_index_list(v, hex_to_idx):
    """把 [1,2,3] / ["#aabbcc", ...] / {"start":a,"end":b} / {"indices":[..]} 规整为 index 列表。"""
    if isinstance(v, dict):
        if "indices" in v:
            return _as_index_list(v["indices"], hex_to_idx)
        if "colors" in v:
            return _as_index_list(v["colors"], hex_to_idx)
        if "start" in v and "end" in v:
            return list(range(int(v["start"]), int(v["end"]) + 1))
        if "from" in v and "to" in v:
            return list(range(int(v["from"]), int(v["to"]) + 1))
        if "range" in v:
            return _as_index_list(v["range"], hex_to_idx)
        if "index" in v:
            return [int(v["index"])]
        return []
    if isinstance(v, (list, tuple)):
        out = []
        for x in v:
            if isinstance(x, bool):
                continue
            if isinstance(x, int):
                out.append(x)
            elif isinstance(x, str) and x.strip().startswith("#"):
                i = hex_to_idx.get(x.strip().lower())
                if i is not None:
                    out.append(i)
            elif isinstance(x, str) and x.strip().isdigit():
                out.append(int(x))
            elif isinstance(x, dict):
                out.extend(_as_index_list(x, hex_to_idx))
        return out
    if isinstance(v, int):
        return [v]
    if isinstance(v, str):
        if v.strip().startswith("#"):
            i = hex_to_idx.get(v.strip().lower())
            return [i] if i is not None else []
        if "-" in v:  # "5-7"
            a, b = v.split("-", 1)
            if a.strip().isdigit() and b.strip().isdigit():
                return list(range(int(a), int(b) + 1))
    return []


def load_palette(path):
    with open(path, "r", encoding="utf-8") as f:
        d = json.load(f)
    colors = []
    for i, c in enumerate(d.get("colors", [])):
        if isinstance(c, str):
            c = {"hex": c}
        colors.append({
            "index": int(c.get("index", i)),
            "hex": c["hex"].lower() if c["hex"].startswith("#") else "#" + c["hex"].lower(),
            "role": c.get("role", ""),
            "ramp": c.get("ramp", ""),
        })
    by_idx = {c["index"]: c for c in colors}
    hex_to_idx = {c["hex"]: c["index"] for c in colors}

    # ramps: dict{name:[...]} | list[{name, indices}] | list[list]
    ramps = []
    rr = d.get("ramps")
    if isinstance(rr, dict):
        for k, v in rr.items():
            ramps.append((str(k), _as_index_list(v, hex_to_idx)))
    elif isinstance(rr, list):
        for j, v in enumerate(rr):
            name = v.get("name", f"ramp{j + 1}") if isinstance(v, dict) else f"ramp{j + 1}"
            ramps.append((str(name), _as_index_list(v, hex_to_idx)))
    if not ramps:  # 由 colors[].ramp 分组
        order = []
        for c in colors:
            if c["ramp"] not in order:
                order.append(c["ramp"])
        ramps = [(r or "colors", [c["index"] for c in colors if c["ramp"] == r]) for r in order]
    # 未归入任何 ramp 的颜色
    used = {i for _, l in ramps for i in l}
    rest = [c["index"] for c in colors if c["index"] not in used]
    if rest:
        ramps.append(("other", rest))
    ramps = [(n, [i for i in l if i in by_idx]) for n, l in ramps]

    cycles = []
    cr = d.get("cycle_ranges") or []
    if isinstance(cr, dict):
        cr = [dict(v, name=k) if isinstance(v, dict) else {"name": k, "indices": v} for k, v in cr.items()]
    for j, v in enumerate(cr):
        name = v.get("name", f"cycle{j + 1}") if isinstance(v, dict) else f"cycle{j + 1}"
        idx = [i for i in _as_index_list(v, hex_to_idx) if i in by_idx]
        if idx:
            cycles.append((str(name), idx))

    fx = d.get("fx_colors") or []
    if isinstance(fx, dict):
        fx_list = []
        for v in fx.values():
            fx_list.extend(_as_index_list(v, hex_to_idx))
    else:
        fx_list = _as_index_list(fx, hex_to_idx)
    fx_list = [i for i in fx_list if i in by_idx]

    return {
        "file": os.path.basename(path),
        "name": d.get("name", os.path.splitext(os.path.basename(path))[0]),
        "name_en": d.get("name_en", ""),
        "tier": d.get("tier", len(colors)),
        "colors": colors,
        "by_idx": by_idx,
        "ramps": ramps,
        "cycles": cycles,
        "fx": fx_list,
    }


# ---------------------------------------------------------------- 字体
def find_font(user_font):
    cands = ([user_font] if user_font else []) + CJK_FONT_CANDIDATES
    for p in cands:
        if p and os.path.isfile(p):
            try:
                ImageFont.truetype(p, 12)
                return p
            except OSError:
                continue
    return None


def make_font(path, size):
    if path:
        return ImageFont.truetype(path, size)
    try:
        return ImageFont.load_default(size=size)
    except TypeError:  # 旧版 Pillow
        return ImageFont.load_default()


def has_cjk(s):
    return any("\u3000" <= ch <= "\u9fff" or "\uff00" <= ch <= "\uffef" for ch in s)


def txt(s, cjk_ok, fallback=""):
    """无中文字体时，含中文的文本改用英文后备文本。"""
    if cjk_ok or not has_cjk(s):
        return s
    return fallback or "".join(ch for ch in s if ord(ch) < 128).strip() or "?"


def ink_for(rgb):
    r, g, b = rgb
    return (20, 16, 24) if (0.299 * r + 0.587 * g + 0.114 * b) > 140 else (248, 244, 236)


# ---------------------------------------------------------------- PNG
SW, SH = 104, 76          # 色块尺寸
GAP = 8
LABEL_W = 150
PAD = 32
BG = (24, 22, 28)
FG = (236, 232, 224)
DIM = (150, 144, 156)
FX_MARK = (255, 210, 122)


def _chunks(seq, n):
    return [seq[k:k + n] for k in range(0, len(seq), n)] or [[]]


def render_png(pals, out_png, font_path, max_cols=12):
    """色块按 ramp 分行；单行超过 max_cols 自动折行；图像宽高按实际内容计算。"""
    cjk_ok = font_path is not None
    max_cols = max(4, int(max_cols))
    f_title = make_font(font_path, 26)
    f_sub = make_font(font_path, 15)
    f_sw = make_font(font_path, 14)
    f_small = make_font(font_path, 12)

    def seqs(p):
        out = [("ramp", n, l) for n, l in p["ramps"]]
        if p["fx"]:
            out.append(("fx", "fx colors", p["fx"]))
        out += [("cycle", n, l) for n, l in p["cycles"]]
        return out

    longest = max([len(l) for p in pals for _, _, l in seqs(p)] + [4])
    cols = min(longest, max_cols)
    width = PAD * 2 + LABEL_W + cols * (SW + GAP) + 70  # 右侧留给“循环”标记
    row_h = SH + 24 + GAP
    WRAP_GAP = 6

    # 先算高度（按折行后的实际行数）
    height = PAD + 60
    for p in pals:
        height += 56
        for _, _, l in seqs(p):
            nl = len(_chunks(l, cols))
            height += nl * row_h + (nl - 1) * WRAP_GAP
        height += 28
    height += PAD - 16

    im = Image.new("RGB", (width, height), BG)
    dr = ImageDraw.Draw(im)
    head = "复古像素风 · 色板色卡" if cjk_ok else "Retro Pixel Video - Palette Swatches"
    dr.text((PAD, PAD - 6), head, font=f_title, fill=FG)
    dr.text((PAD, PAD + 30),
            f"FXn = fx_colors order (core -> outer)    framed row / cyan underline = cycle_ranges    "
            f"rows wrap at {cols} columns ( ... = continued)",
            font=f_small, fill=DIM)
    y = PAD + 60

    def swatch(x, y, c, fx_order=None, in_cycle=None):
        rgb = hex_to_rgb(c["hex"])
        dr.rectangle([x, y, x + SW - 1, y + SH - 1], fill=rgb)
        ink = ink_for(rgb)
        dr.text((x + 6, y + 5), f"#{c['index']}", font=f_sw, fill=ink)
        dr.text((x + 6, y + SH - 20), c["hex"].upper(), font=f_sw, fill=ink)
        if fx_order is not None:
            bx, by = x + SW - 34, y + 4
            dr.rectangle([bx - 1, by - 1, bx + 30, by + 16], fill=(26, 16, 35))
            dr.rectangle([bx, by, bx + 29, by + 15], fill=FX_MARK)
            dr.text((bx + 3, by + 1), f"FX{fx_order}", font=f_small, fill=(26, 16, 35))
        if in_cycle:
            dr.rectangle([x, y + SH - 4, x + SW - 1, y + SH - 1], fill=(26, 16, 35))
            dr.rectangle([x + 1, y + SH - 3, x + SW - 2, y + SH - 2], fill=(184, 224, 232))
        role = c.get("role") or ""
        if role:
            role_t = txt(role, cjk_ok, "")
            if role_t:
                lim = 7 if cjk_ok and has_cjk(role_t) else 14
                role_t = role_t if len(role_t) <= lim else role_t[:lim - 1] + ("…" if cjk_ok else ".")
                dr.text((x + 2, y + SH + 3), role_t, font=f_small, fill=DIM)

    CY = (184, 224, 232)
    for p in pals:
        fx_pos = {i: k + 1 for k, i in enumerate(p["fx"])}
        cyc_set = {i for _, l in p["cycles"] for i in l}
        name = txt(p["name"], cjk_ok, p["name_en"])
        title = name + (f"  /  {p['name_en']}" if p["name_en"] and p["name_en"] != name else "")
        dr.text((PAD, y), title, font=f_title, fill=FG)
        dr.text((PAD, y + 32), f"tier {p['tier']} · {len(p['colors'])} colors · {p['file']}",
                font=f_sub, fill=DIM)
        y += 56
        for kind, sname, idxs in seqs(p):
            lines = _chunks(idxs, cols)
            if kind == "ramp":
                dr.text((PAD, y + SH // 2 - 9), f"ramp: {txt(sname, cjk_ok, 'ramp')}", font=f_sub, fill=FG)
            elif kind == "fx":
                dr.text((PAD, y + SH // 2 - 9), "fx colors", font=f_sub, fill=FX_MARK)
            else:
                dr.text((PAD, y + SH // 2 - 18), f"cycle: {txt(sname, cjk_ok, 'cycle')}", font=f_sub, fill=CY)
                dr.text((PAD, y + SH // 2 + 2), f"{idxs[0]}..{idxs[-1]}" if idxs == list(range(idxs[0], idxs[-1] + 1))
                        else ",".join(map(str, idxs)), font=f_small, fill=DIM)
            if len(lines) > 1:
                dr.text((PAD, y + SH // 2 + 22 if kind != "cycle" else y + SH // 2 + 20),
                        f"{len(idxs)} colors / {len(lines)} rows", font=f_small, fill=DIM)
            off = 0
            for li, line in enumerate(lines):
                x0 = PAD + LABEL_W
                for k, i in enumerate(line):
                    if kind == "fx":
                        swatch(x0 + k * (SW + GAP), y, p["by_idx"][i], off + k + 1, i in cyc_set)
                    else:
                        swatch(x0 + k * (SW + GAP), y, p["by_idx"][i], fx_pos.get(i),
                               True if kind == "cycle" else i in cyc_set)
                x1 = x0 + len(line) * (SW + GAP) - GAP
                if kind == "cycle":
                    dr.rectangle([x0 - 4, y - 4, x1 + 3, y - 3], fill=CY)
                    if li == 0:
                        dr.rectangle([x0 - 4, y - 4, x0 - 3, y + SH + 3], fill=CY)
                    if li == len(lines) - 1:
                        dr.rectangle([x1 + 2, y - 4, x1 + 3, y + SH + 3], fill=CY)
                        dr.text((x1 + 10, y + SH // 2 - 9), "<- 循环" if cjk_ok else "<- loop", font=f_sub, fill=CY)
                if li < len(lines) - 1:
                    dr.text((x1 + 10, y + SH // 2 - 9), "...", font=f_sub, fill=DIM)
                off += len(line)
                y += row_h + (WRAP_GAP if li < len(lines) - 1 else 0)
        y += 28
        dr.line([PAD, y - 16, width - PAD, y - 16], fill=(60, 56, 66), width=1)

    os.makedirs(os.path.dirname(out_png) or ".", exist_ok=True)
    im.save(out_png, optimize=True)
    return im.size, cjk_ok


# ---------------------------------------------------------------- HTML
def render_html(pals, out_html):
    E = html.escape
    parts = ["""<!doctype html><html lang="zh"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>复古像素风 · 色板色卡</title>
<style>
body{margin:0;padding:28px;background:#18161c;color:#ece8e0;font:14px/1.4 -apple-system,"PingFang SC","Microsoft YaHei",sans-serif}
h1{font-size:22px;margin:0 0 4px}h2{font-size:20px;margin:28px 0 2px}.meta{color:#968fa0;font-size:12px;margin-bottom:10px}
.row{display:flex;flex-wrap:wrap;align-items:flex-start;gap:8px;margin:6px 0;max-width:calc(148px + 12 * 112px)}.lab{width:140px;flex:none;padding-top:26px;font-size:13px}
.sw{width:104px;flex:none;position:relative;image-rendering:pixelated}
.chip{height:76px;position:relative;display:flex;flex-direction:column;justify-content:space-between;padding:4px 6px;box-sizing:border-box;font:600 12px ui-monospace,Menlo,monospace;cursor:pointer}
.role{font-size:11px;color:#968fa0;height:30px;overflow:hidden;margin-top:2px}
.fx{position:absolute;right:4px;top:4px;background:#ffd27a;color:#1a1023;font-size:10px;padding:0 3px;outline:1px solid #1a1023}
.cyc{box-shadow:inset 0 -3px 0 #b8e0e8}.cycwrap{display:flex;flex-wrap:wrap;max-width:calc(12 * 112px);gap:8px;border:2px solid #b8e0e8;padding:2px}
.legend{color:#968fa0;font-size:12px}.strip{display:flex;flex-wrap:wrap;height:auto;margin:8px 0 0 148px;max-width:calc(12 * 112px)}.strip i{width:24px;height:18px}
</style></head><body><h1>复古像素风 · 色板色卡</h1>
<div class="legend">FXn = fx_colors 顺序（核心→外圈）；青色下划线/框 = cycle_ranges 循环区间；点击色块复制 hex。数据内联，离线可看。</div>
"""]

    def chip(c, fxn=None, cyc=False):
        rgb = hex_to_rgb(c["hex"])
        ink = "#141018" if (0.299 * rgb[0] + 0.587 * rgb[1] + 0.114 * rgb[2]) > 140 else "#f8f4ec"
        fx = f'<span class="fx">FX{fxn}</span>' if fxn else ""
        return (f'<div class="sw"><div class="chip{" cyc" if cyc else ""}" style="background:{c["hex"]};color:{ink}" '
                f'data-hex="{c["hex"]}" title="{E(c["role"])}">#{c["index"]}{fx}<span>{c["hex"].upper()}</span></div>'
                f'<div class="role">{E(c["role"])}</div></div>')

    for p in pals:
        fx_pos = {i: k + 1 for k, i in enumerate(p["fx"])}
        cyc_set = {i for _, l in p["cycles"] for i in l}
        parts.append(f'<h2>{E(p["name"])} <span class="meta">/ {E(p["name_en"])}</span></h2>')
        parts.append(f'<div class="meta">tier {E(str(p["tier"]))} · {len(p["colors"])} colors · {E(p["file"])}</div>')
        parts.append('<div class="strip">' + "".join(
            f'<i style="background:{c["hex"]}"></i>' for c in sorted(p["colors"], key=lambda c: c["index"])) + "</div>")
        for rname, idxs in p["ramps"]:
            parts.append(f'<div class="row"><div class="lab">ramp: {E(rname)}</div>' +
                         "".join(chip(p["by_idx"][i], fx_pos.get(i), i in cyc_set) for i in idxs) + "</div>")
        if p["fx"]:
            parts.append('<div class="row"><div class="lab" style="color:#ffd27a">fx colors</div>' +
                         "".join(chip(p["by_idx"][i], k + 1, i in cyc_set) for k, i in enumerate(p["fx"])) + "</div>")
        for cname, idxs in p["cycles"]:
            parts.append(f'<div class="row"><div class="lab" style="color:#b8e0e8">cycle: {E(cname)}<br>'
                         f'<span class="meta">{",".join(map(str, idxs))} ⟲</span></div><div class="cycwrap">' +
                         "".join(chip(p["by_idx"][i], fx_pos.get(i), True) for i in idxs) + "</div></div>")

    data = [{"file": p["file"], "name": p["name"], "name_en": p["name_en"], "tier": p["tier"],
             "colors": p["colors"], "ramps": p["ramps"], "cycle_ranges": p["cycles"], "fx_colors": p["fx"]} for p in pals]
    parts.append('<script id="palette-data" type="application/json">' +
                 json.dumps(data, ensure_ascii=False).replace("</", "<\\/") + "</script>")
    parts.append("""<script>
document.querySelectorAll('.chip').forEach(function(el){el.addEventListener('click',function(){
 var h=el.dataset.hex; if(navigator.clipboard){navigator.clipboard.writeText(h).catch(function(){});}
 el.style.outline='2px solid #fff'; setTimeout(function(){el.style.outline='';},300);});});
</script></body></html>""")
    os.makedirs(os.path.dirname(out_html) or ".", exist_ok=True)
    with open(out_html, "w", encoding="utf-8") as f:
        f.write("\n".join(parts))


def main():
    ap = argparse.ArgumentParser(description="把 palettes/*.json 渲染为 swatches.png 与 swatches.html（离线单文件）。")
    ap.add_argument("--skill-dir", default=SKILL_DIR, help="Skill 根目录（默认: 本脚本上一级目录）")
    ap.add_argument("--palettes", nargs="*", default=None,
                    help="色板 JSON 路径（默认: <skill-dir>/palettes/*.json，按文件名排序）")
    ap.add_argument("--out-png", default=None, help="默认 <skill-dir>/palettes/swatches.png")
    ap.add_argument("--out-html", default=None, help="默认 <skill-dir>/palettes/swatches.html")
    ap.add_argument("--font", default=None, help="中文字体文件路径（可选；找不到中文字体时 PNG 用英文名）")
    ap.add_argument("--max-cols", type=int, default=12,
                    help="PNG 中每行最多色块数，超出自动折行（默认 12，最小 4）")
    ap.add_argument("--no-cjk", action="store_true", help="强制使用 PIL 默认字体与英文名（测试降级用）")
    a = ap.parse_args()

    pdir = os.path.join(a.skill_dir, "palettes")
    paths = a.palettes if a.palettes else sorted(glob.glob(os.path.join(pdir, "*.json")))
    if not paths:
        print(f"未找到色板 JSON: {pdir}/*.json", file=sys.stderr)
        return 2
    pals = []
    for pth in paths:
        try:
            pals.append(load_palette(pth))
        except Exception as e:  # noqa: BLE001
            print(f"[ERROR] 读取 {pth} 失败: {e}", file=sys.stderr)
            return 1
    out_png = a.out_png or os.path.join(pdir, "swatches.png")
    out_html = a.out_html or os.path.join(pdir, "swatches.html")
    font_path = None if a.no_cjk else find_font(a.font)
    size, cjk_ok = render_png(pals, out_png, font_path, a.max_cols)
    render_html(pals, out_html)
    print(f"palettes: {len(pals)} -> " + ", ".join(f"{p['file']}({len(p['colors'])})" for p in pals))
    print(f"font: {font_path or 'PIL default (英文名降级)'}")
    print(f"PNG : {out_png}  {size[0]}x{size[1]}")
    print(f"HTML: {out_html}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
