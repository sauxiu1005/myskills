#!/usr/bin/env python3
"""raw/ -> assets/ : one shared base grade for every source (grayscale, percentile levels,
gentle S-curve), crops, archive-film upscaling (hqdn3d -> lanczos -> light unsharp), the
projected US map, and the 1925 record excerpt.
Run with the library venv:  $LIB/.venv/bin/python tools/prep.py [--only clips|stills|map|record]
"""
import json, math, shutil, subprocess, sys
from pathlib import Path
import numpy as np
from PIL import Image

HERE = Path(__file__).resolve().parent.parent
RAW, OUT = HERE / "raw", HERE / "assets"
OUT.mkdir(exist_ok=True)
ONLY = sys.argv[sys.argv.index("--only") + 1] if "--only" in sys.argv else None
TL = json.loads((HERE / "timeline.json").read_text())


def grade(im, lo=0.6, hi=99.6, black=14, white=238, gamma=1.0):
    """same base grade for every source: luminance -> percentile stretch -> S-curve."""
    a = np.asarray(im.convert("L"), np.float32)
    p0, p1 = np.percentile(a, [lo, hi])
    x = np.clip((a - p0) / max(1, p1 - p0), 0, 1) ** gamma
    x = x + 0.18 * (x - 0.5) * (1 - np.abs(2 * x - 1))      # mild S-curve
    x = black + np.clip(x, 0, 1) * (white - black)
    return Image.fromarray(x.astype(np.uint8), "L")


def save(im, name, q=90):
    im.save(OUT / name, quality=q)
    print(name, im.size)


# ------------------------------------------------------------------ stills
if ONLY in (None, "stills"):
    # newspaper: top fold only (headline + Bee Jackson + the dancing teacher's rules); the unrelated
    # stories lower on the page stay out of frame
    p = Image.open(RAW / "austin.jpg"); W, H = p.size
    save(grade(p.crop((0, 0, W, int(H * 0.326))), lo=0.3, hi=99.0, black=30, white=236), "paper.jpg")
    # "Good Morning" (1926): title page and page 30 (the 'tendency to jazz' paragraph)
    gm = RAW / "goodmorning" / "jpg"
    for leaf, name in (("0007", "book_title.jpg"), ("0034", "book_p30.jpg")):
        im = Image.open(gm / f"leaf_{leaf}.jpg")
        save(grade(im, lo=0.2, hi=99.7, black=26, white=232), name)
    # Photoplay, Oct. 1925: nine steps, each fitted into a 3:4 cell (padded, never stretched)
    for i in range(1, 10):
        im = Image.open(RAW / "photoplay" / f"pp_step{i}.jpg")
        g = grade(im, lo=0.4, hi=99.6)
        cw, ch = 600, 800
        s = min(cw / g.width, ch / g.height)
        g = g.resize((round(g.width * s), round(g.height * s)), Image.LANCZOS)
        a = np.asarray(g, np.float32)
        bg = float(np.median(np.concatenate([a[:, :8].ravel(), a[:, -8:].ravel()])))   # photo's own backdrop
        cell = Image.new("L", (cw, ch), int(bg)); cell.paste(g, ((cw - g.width) // 2, ch - g.height))
        save(cell, f"pp{i}.jpg")

# ------------------------------------------------------------------ map (Natural Earth, public domain)
if ONLY in (None, "map"):
    d = json.loads((RAW / "map" / "ne_110m_admin_1_states_provinces_lakes.geojson").read_text())
    # Albers equal-area conic for the lower 48 (standard parallels 29.5 / 45.5, centre 96 W 37.5 N)
    p1, p2, l0, f0 = map(math.radians, (29.5, 45.5, -96, 37.5))
    n = (math.sin(p1) + math.sin(p2)) / 2; C = math.cos(p1) ** 2 + 2 * n * math.sin(p1)
    r0 = math.sqrt(C - 2 * n * math.sin(f0)) / n
    def proj(lon, lat):
        l, f = math.radians(lon), math.radians(lat)
        r = math.sqrt(C - 2 * n * math.sin(f)) / n; th = n * (l - l0)
        return r * math.sin(th), r0 - r * math.cos(th)
    states = []
    for ft in d["features"]:
        if ft["properties"].get("postal") in ("AK", "HI"):
            continue
        g = ft["geometry"]; polys = g["coordinates"] if g["type"] == "MultiPolygon" else [g["coordinates"]]
        for poly in polys:
            states.append([[proj(*pt) for pt in ring] for ring in poly][0])
    xs = [x for s in states for x, _ in s]; ys = [y for s in states for _, y in s]
    x0, x1, y0, y1 = min(xs), max(xs), min(ys), max(ys)
    GW, GH, M = 1480, 1080, 120
    k = min((GW - 2 * M) / (x1 - x0), (GH - 2 * M - 80) / (y1 - y0))
    ox = (GW - (x1 - x0) * k) / 2; oy = (GH - (y1 - y0) * k) / 2 - 10
    tr = lambda x, y: (round(ox + (x - x0) * k, 1), round(oy + (y1 - y) * k, 1))
    out = {"states": [[tr(x, y) for x, y in s] for s in states]}
    cities = {"newyork": (-73.99, 40.76), "hollywood": (-118.33, 34.10), "austin": (-97.74, 30.27),
              "dearborn": (-83.18, 42.32)}
    out["cities"] = {c: tr(*proj(*ll)) for c, ll in cities.items()}
    (OUT / "us.json").write_text(json.dumps(out))
    print("us.json", len(states), "polygons", out["cities"])

# ------------------------------------------------------------------ archive film (NARA, Ford Motor Co. film collection)
# 720x480 NTSC transfers of silent 35 mm, treated as 4:3. 1.37 crop -> 1480x1080 (2.31x, under the 2.5x cap).
VF = ("scale=640:480:flags=lanczos,crop=640:467:0:6,hqdn3d=4:3:6:5,"
      "scale=1480:1080:flags=lanczos,unsharp=5:5:0.55:5:5:0,format=gray")
if ONLY in (None, "clips"):
    for k, c in TL["clips"].items():
        d = OUT / k
        shutil.rmtree(d, ignore_errors=True); d.mkdir()
        vf = VF if not c.get("crop") else VF.replace("crop=640:467:0:6", c["crop"])
        subprocess.run(["ffmpeg", "-v", "error", "-ss", str(c["ss"]), "-t", str(c["dur"]), "-i", str(RAW / c["src"]),
                        "-vf", vf + ",fps=24", "-q:v", "3", str(d / "%03d.png")], check=True)
        files = sorted(d.glob("*.png"))
        # one level-set for the whole clip (no per-frame pumping)
        stack = np.concatenate([np.asarray(Image.open(f), np.float32).ravel()[::97] for f in files])
        p0, p1 = np.percentile(stack, [c.get("lo", 0.8), c.get("hi", 99.5)])
        gam = c.get("gamma", 1.0)
        for i, f in enumerate(files):
            a = np.asarray(Image.open(f), np.float32)
            x = np.clip((a - p0) / (p1 - p0), 0, 1) ** gam
            x = x + 0.18 * (x - 0.5) * (1 - np.abs(2 * x - 1))
            Image.fromarray((14 + x * 224).astype(np.uint8), "L").save(d / f"{i:03d}.jpg", quality=86)
            f.unlink()
        print(k, len(files), "frames")

# ------------------------------------------------------------------ the 1925 record excerpt
if ONLY in (None, "record"):
    import soundfile as sf, soxr
    R = TL["record"]
    x, sr = sf.read(RAW / "rec_charleston1925.wav", dtype="float32")
    if x.ndim > 1: x = x.mean(1)
    a, b = int((R["src_t0"] - 0.6) * sr), int((R["src_end"] + 1.6) * sr)
    seg = x[a:b]
    # stretch so its beat matches the film's 200 BPM (record ~R['src_bpm'] BPM): resample = varispeed,
    # exactly what a turntable running a hair fast does (pitch up ~R% of a semitone)
    ratio = R["src_bpm"] / TL["bpm"]
    seg = soxr.resample(seg, sr, sr * ratio)
    sf.write(OUT / "record.wav", seg.astype(np.float32), sr)
    print("record.wav", len(seg) / sr, "s; ratio", ratio)
