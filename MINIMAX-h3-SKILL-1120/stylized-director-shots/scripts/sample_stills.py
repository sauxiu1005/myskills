"""Sample colour roles from stills for a custom (temporary) director branch.

Usage:  python3 scripts/sample_stills.py [--user] <out.json> <still1> [<still2> ...]
        --user marks the stills as user-supplied (default: web stills).
Pass the stills of ONE scheme (one film or one lighting group, 2-3 frames).
Writes a draft "roles" object for schemes.json: background_main, shadow, light_highlight,
and accent candidates. It is a median-cut sample of those frames only, not a LUT or a
whole-film statistic; review and edit before rendering cards. Skin is never sampled into
a role (skin_protection stays empty)."""
import json, sys, colorsys
from PIL import Image


def palette(paths, k=8):
    ims = []
    for p in paths:
        im = Image.open(p).convert("RGB"); im.thumbnail((320, 320)); ims.append(im)
    # Pack only sampled source pixels; a rectangular collage adds padding colours.
    pixels = b"".join(i.tobytes() for i in ims)
    sheet = Image.frombytes("RGB", (len(pixels) // 3, 1), pixels)
    q = sheet.quantize(colors=k, method=Image.Quantize.MEDIANCUT)
    pal = q.getpalette()[:k * 3]; counts = sorted(q.getcolors(), reverse=True)
    tot = sum(c for c, _ in counts); out = []
    for c, idx in counts:
        r, g, b = pal[idx * 3:idx * 3 + 3]
        h, l, s = colorsys.rgb_to_hls(r / 255, g / 255, b / 255)
        out.append({"hex": "#%02X%02X%02X" % (r, g, b), "share": round(c / tot, 3), "light": l, "sat": s})
    return out


def roles(cols, prov):
    by_l = sorted(cols, key=lambda c: c["light"])
    shadow = by_l[:2]
    hi = [by_l[-1]]
    rest = [c for c in cols if c not in shadow and c not in hi]
    bg = sorted(rest, key=lambda c: -c["share"])[:2]
    acc = [c for c in cols if c["sat"] > 0.45 and c["share"] < 0.08]
    f = lambda cs: [c["hex"] for c in cs]
    return {
        "background_main": {"hex": f(bg), "desc": "TODO: 大面积环境是什么", "provenance": prov, "suggested_area": "建议 50–60%"},
        "shadow": {"hex": f(shadow), "desc": "TODO: 暗部偏什么色", "provenance": prov, "suggested_area": "建议 25–35%"},
        "light_highlight": {"hex": f(hi), "desc": "TODO: 光源与高光", "provenance": prov, "suggested_area": "建议 5–10%"},
        "accent_small": {"hex": f(acc[:1]), "desc": "TODO: 只给剧本真实物件或光源；无则清空", "provenance": prov},
        "skin_protection": {"hex": [], "desc": "保留角色原本肤色，环境色只影响光照", "provenance": "manual_suggestion"},
    }, cols


if __name__ == "__main__":
    args = sys.argv[1:]
    user = args and args[0] == "--user"
    if user:
        args = args[1:]
    out, paths = args[0], args[1:]
    prov = "sampled_from_user_still" if user else "sampled_from_web_still"
    r, cols = roles(palette(paths), prov)
    json.dump({"roles": r, "raw_palette": cols, "stills": paths}, open(out, "w"), ensure_ascii=False, indent=2)
    print(json.dumps(r, ensure_ascii=False, indent=1))
