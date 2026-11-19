#!/usr/bin/env python3
"""Download what git does not hold: the archive sources listed in SOURCES.jsonl (into raw/) and the
OFL fonts (into fonts/). Skips files that are already there. Needs a network connection.
    $LIB/.venv/bin/python tools/fetch_sources.py
About 500 MB: five NARA film transfers (~75–115 MB each), the 1925 record (44 MB), the book scan (57 MB).
"""
import io, json, urllib.request, zipfile
from pathlib import Path

HERE = Path(__file__).resolve().parent.parent
UA = "Mozilla/5.0 (Macintosh) lemo-opuscar-demo/1.0"
get = lambda u: urllib.request.urlopen(urllib.request.Request(u, headers={"User-Agent": UA}), timeout=300).read()

for line in (HERE / "SOURCES.jsonl").read_text().splitlines():
    r = json.loads(line)
    if r["name"] == "goodmorning":                      # zip of page scans -> the two pages the film uses
        out = HERE / "raw" / "goodmorning" / "jpg"
        if (out / "leaf_0034.jpg").exists(): continue
        from PIL import Image
        out.mkdir(parents=True, exist_ok=True)
        z = zipfile.ZipFile(io.BytesIO(get(r["url"])))
        for leaf in ("0007", "0034"):
            name = next(n for n in z.namelist() if n.endswith(f"_{leaf}.jp2"))
            Image.open(io.BytesIO(z.read(name))).convert("L").save(out / f"leaf_{leaf}.jpg", quality=92)
        print("goodmorning pages")
        continue
    dest = HERE / r["file"] if not r["file"].startswith("/") else Path(r["file"])
    if not str(dest).startswith(str(HERE)): dest = HERE / "raw" / Path(r["file"]).name
    if dest.exists(): continue
    dest.parent.mkdir(parents=True, exist_ok=True)
    print("downloading", r["name"], r["url"])
    dest.write_bytes(get(r["url"]))

GF = "https://raw.githubusercontent.com/google/fonts/main/ofl/"
FONTS = {"Limelight-Regular.ttf": "limelight/Limelight-Regular.ttf", "Oswald[wght].ttf": "oswald/Oswald%5Bwght%5D.ttf",
         "NotoSansSC-VF.ttf": "notosanssc/NotoSansSC%5Bwght%5D.ttf", "NotoSerifSC-VF.ttf": "notoserifsc/NotoSerifSC%5Bwght%5D.ttf",
         "OFL-Limelight.txt": "limelight/OFL.txt", "OFL-Oswald.txt": "oswald/OFL.txt",
         "OFL-NotoSansSC.txt": "notosanssc/OFL.txt", "OFL-NotoSerifSC.txt": "notoserifsc/OFL.txt"}
fd = HERE / "fonts"; fd.mkdir(exist_ok=True)
for name, path in FONTS.items():
    if not (fd / name).exists():
        print("font", name); (fd / name).write_bytes(get(GF + path))
