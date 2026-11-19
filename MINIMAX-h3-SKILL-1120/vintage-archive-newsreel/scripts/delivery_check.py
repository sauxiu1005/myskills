#!/usr/bin/env python3
"""Measure a finished film before canvas delivery (read-only).

Reports real stream facts, a full decode, loudness/true peak, black segments,
faststart, file size against the canvas limit, and the SRT cue timing rules.
Usage: delivery_check.py film.mp4 [--srt film.srt] [--fps 24] [--size 1920x1080]
       [--limit-mib 50] [--out QA_delivery.json]
"""
import argparse
import json
import os
from pathlib import Path
import re
import shutil
import subprocess


def tool(name):
    hit = shutil.which(name)
    if hit:
        return hit
    import glob
    for cand in glob.glob(f"/Applications/MiniMax Design*.app/Contents/Resources/ffmpeg/{name}"):
        return cand
    raise SystemExit(f"{name} not found; run scripts/check_runtime.py")


def run(cmd):
    p = subprocess.run(cmd, capture_output=True, text=True)
    return p.returncode, p.stdout, p.stderr


def srt_check(path, latin_cps=15.0, cjk_cps=4.5):
    text = Path(path).read_text(encoding="utf-8-sig")
    cues, problems = [], []
    ts = r"(\d+):(\d+):(\d+)[,.](\d+)"
    for block in re.split(r"\n\s*\n", text.strip()):
        m = re.search(ts + r"\s*-->\s*" + ts, block)
        if not m:
            continue
        g = [int(x) for x in m.groups()]
        t0 = g[0] * 3600 + g[1] * 60 + g[2] + g[3] / 1000
        t1 = g[4] * 3600 + g[5] * 60 + g[6] + g[7] / 1000
        body = block[m.end():].strip()
        cues.append((t0, t1, body))
    for i, (t0, t1, body) in enumerate(cues):
        dur = t1 - t0
        if dur < 1.8 - 1e-3:
            problems.append(f"cue {i+1}: {dur:.2f}s < 1.8s")
        if i + 1 < len(cues) and cues[i + 1][0] - t1 < 0.05 - 1e-3:
            problems.append(f"cue {i+1}: gap to next {cues[i+1][0]-t1:.3f}s < 0.05s")
        for line in body.splitlines():
            cjk = len(re.findall(r"[\u3400-\u9fff]", line))
            words = len(line.split()) if not cjk else 0
            if cjk > 23:
                problems.append(f"cue {i+1}: {cjk} CJK chars > 23")
            if words > 14:
                problems.append(f"cue {i+1}: {words} words; check one-line width in the page SUBCHECK")
        if len(body.splitlines()) > 2:
            problems.append(f"cue {i+1}: more than two lines")
    return {"cues": len(cues), "problems": problems, "ok": not problems}


def main():
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("film")
    ap.add_argument("--srt")
    ap.add_argument("--fps", type=float, default=24)
    ap.add_argument("--size", default="1920x1080")
    ap.add_argument("--limit-mib", type=float, default=50)
    ap.add_argument("--out")
    a = ap.parse_args()
    ffmpeg, ffprobe = tool("ffmpeg"), tool("ffprobe")
    film = os.path.abspath(a.film)
    rep = {"file": film, "bytes": os.path.getsize(film)}
    rep["mib"] = round(rep["bytes"] / 1048576, 2)
    rep["canvas_size_ok"] = rep["mib"] <= a.limit_mib
    _, out, _ = run([ffprobe, "-v", "error", "-show_streams", "-show_format", "-of", "json", film])
    info = json.loads(out or "{}")
    v = next((s for s in info.get("streams", []) if s.get("codec_type") == "video"), {})
    au = next((s for s in info.get("streams", []) if s.get("codec_type") == "audio"), None)
    num, den = (v.get("r_frame_rate", "0/1").split("/") + ["1"])[:2]
    fps = float(num) / float(den or 1) if float(den or 1) else 0
    w, h = (int(x) for x in a.size.split("x"))
    rep["video"] = {"codec": v.get("codec_name"), "pix_fmt": v.get("pix_fmt"), "width": v.get("width"),
                    "height": v.get("height"), "fps": round(fps, 3), "frames": v.get("nb_frames")}
    rep["audio"] = ({"codec": au.get("codec_name"), "rate": au.get("sample_rate"), "channels": au.get("channels")}
                    if au else None)
    rep["duration"] = float(info.get("format", {}).get("duration", 0))
    rep["spec_ok"] = (v.get("width"), v.get("height")) == (w, h) and abs(fps - a.fps) < 0.01
    code, _, err = run([ffmpeg, "-v", "error", "-i", film, "-f", "null", "-"])
    rep["full_decode"] = {"ok": code == 0 and not err.strip(), "errors": err.strip().splitlines()[:5]}
    if au:
        _, _, err = run([ffmpeg, "-hide_banner", "-nostats", "-i", film, "-af", "ebur128=peak=true", "-f", "null", "-"])
        tail = err[err.rfind("Summary:"):]
        i = re.search(r"I:\s+(-?[\d.]+) LUFS", tail)
        pk = re.search(r"Peak:\s+(-?[\d.]+) dBFS", tail)
        rep["loudness"] = {"integrated_lufs": float(i.group(1)) if i else None,
                           "true_peak_dbfs": float(pk.group(1)) if pk else None}
        rep["loudness"]["ok"] = bool(i and pk and -15 <= float(i.group(1)) <= -13 and float(pk.group(1)) <= -1.0)
    _, _, err = run([ffmpeg, "-hide_banner", "-nostats", "-i", film, "-vf", "blackdetect=d=0.25:pix_th=0.06",
                     "-an", "-f", "null", "-"])
    rep["black_segments"] = [dict(zip(("start", "end", "dur"), map(float, m)))
                             for m in re.findall(r"black_start:([\d.]+) black_end:([\d.]+) black_duration:([\d.]+)", err)]
    with open(film, "rb") as fh:
        head = fh.read(1 << 20)
    moov, mdat = head.find(b"moov"), head.find(b"mdat")
    rep["faststart"] = moov != -1 and (mdat == -1 or moov < mdat)
    if a.srt:
        rep["srt"] = srt_check(a.srt)
    rep["note"] = ("File facts only. Normal-speed viewing, listening, frame-accurate action checks and "
                   "canvas player tests are recorded separately in QA.md.")
    text = json.dumps(rep, ensure_ascii=False, indent=2)
    if a.out:
        Path(a.out).write_text(text + "\n", encoding="utf-8")
    print(text)


if __name__ == "__main__":
    main()
