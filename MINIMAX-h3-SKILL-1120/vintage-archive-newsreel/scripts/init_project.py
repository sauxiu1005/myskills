#!/usr/bin/env python3
"""Create an isolated newsreel project without downloads or demo content."""
import argparse
import json
from pathlib import Path
import os
import re
import shutil
import subprocess
import sys


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("project", type=Path, help="New directory; existing paths are refused")
    args = parser.parse_args()
    skill = Path(__file__).resolve().parents[1]
    source = skill / "vendor" / "lemo-opuscar"
    target = args.project.expanduser().resolve()
    if target == skill or skill in target.parents:
        parser.error("Create the film outside the installed skill directory")
    if target.exists():
        parser.error(f"Target already exists; no files changed: {target}")
    required = ["core", "tools/fetch.sh", "tools/assets.json", "LICENSE",
                "package.json", "package-lock.json", "requirements.txt",
                "requirements-voice.txt", "requirements-music.txt"]
    footage = source / "styles/newsreel/demo/tools/footage.py"
    missing = [name for name in required if not (source / name).exists()]
    if missing or not footage.is_file():
        parser.error("Incomplete skill bundle; reimport the complete ZIP")
    target.mkdir(parents=True, exist_ok=False)
    runtime = target / "runtime"
    runtime.mkdir()
    for name in required:
        src, dst = source / name, runtime / name
        dst.parent.mkdir(parents=True, exist_ok=True)
        if src.is_dir():
            shutil.copytree(src, dst)
        else:
            shutil.copy2(src, dst)
    # Host compatibility patch on the project copy only (vendor stays untouched):
    # with FFmpeg 6.0 (bundled with Design) `-progress` reports out_time=0 when the
    # loudnorm filter is in the graph, so upstream mux.sh wrongly calls every mix
    # "damaged". Measure decoded seconds in a separate plain decode pass instead.
    mux = runtime / "core/render/mux.sh"
    anchor = """DEC=$(echo "$M" | grep '^out_time='"""
    fixed = """DEC=$(ffmpeg -hide_banner -nostats -progress pipe:2 -i "$A" -f null - 2>&1 | grep '^out_time='"""
    patches = []
    text = mux.read_text()
    if text.count(anchor) == 1:
        mux.write_text(text.replace(anchor, fixed))
        patches.append("runtime/core/render/mux.sh: decoded-duration check uses a plain decode pass (FFmpeg 6.0 loudnorm progress bug)")
    text = mux.read_text()
    a2, f2 = "aresample=48000$PAD[a]", "aresample=48000,aformat=channel_layouts=stereo$PAD[a]"
    if text.count(a2) == 1:
        # FFmpeg 6.0: loudnorm inside -filter_complex fails with "Cannot select channel
        # layout" before the AAC encoder unless the output layout is pinned.
        mux.write_text(text.replace(a2, f2))
        patches.append("runtime/core/render/mux.sh: output audio layout pinned to stereo (FFmpeg 6.0 loudnorm/AAC layout bug)")
    film = target / "film"
    for name in ["tools", "raw", "assets", "fonts", "voice", "audio", "out", "stills"]:
        (film / name).mkdir(parents=True, exist_ok=True)
    shutil.copy2(footage, film / "tools/footage.py")
    sys.dont_write_bytecode = True  # keep the installed Skill folder clean
    sys.path.insert(0, str(skill / "scripts"))
    from check_runtime import lock_version, platform_playwright_core
    pw_path, pw_ver = platform_playwright_core()
    linked_playwright = False
    if pw_path and pw_ver == lock_version("playwright-core"):
        (runtime / "node_modules").mkdir()
        os.symlink(pw_path, runtime / "node_modules" / "playwright-core")
        linked_playwright = True
    manifest = json.loads((skill / "references/upstream-manifest.json").read_text())
    meta = (skill / "meta.yaml").read_text(encoding="utf-8") if (skill / "meta.yaml").exists() else ""
    found = re.search(r"^version:\s*['\"]?([0-9]+\.[0-9]+\.[0-9]+)", meta, re.M)
    probe = subprocess.run([sys.executable, str(skill / "scripts/check_runtime.py"), str(target)],
                           capture_output=True, text=True)
    try:
        runtime_report = json.loads(probe.stdout)
    except ValueError:
        runtime_report = {"error": (probe.stderr or "runtime probe failed").strip()[-400:]}
    for name in ["SOURCES.md", "FACTS.md", "CREDITS", "QA.md", "TREATMENT.md"]:
        (film / name).touch()
    (film / "SOURCES.jsonl").touch()
    (target / ".gitignore").write_text("runtime/node_modules/\nruntime/.venv/\nfilm/raw/\nfilm/out/frames/\n")
    record = {
        "skill": "vintage-archive-newsreel",
        "version": found.group(1) if found else "unknown",
        "upstream_commit": manifest["commit"],
        "runtime": "runtime",
        "film": "film",
        "defaults": {"width": 1920, "height": 1080, "fps": 24,
                     "gate_width": 1480, "gate_height": 1080, "loudness_lufs": -14},
        "status": "initialized_only",
        "dependencies_installed": False,
        "runtime_patches": patches,
        "playwright_core": "linked to platform copy" if linked_playwright else "not linked",
        "media_downloaded": False,
        "canvas_delivery_tested": False,
        "runtime_probe": runtime_report,
    }
    (target / "project.json").write_text(json.dumps(record, ensure_ascii=False, indent=2) + "\n")
    print(json.dumps({"project": str(target), "runtime": str(runtime),
                      "film": str(film), "status": "initialized_only"}, ensure_ascii=False))


if __name__ == "__main__":
    main()
