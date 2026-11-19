#!/usr/bin/env python3
"""Zip a finished newsreel project as an editable, rebuildable source package.

Excludes reinstallable dependencies, caches, rendered frame dumps and raw
downloads (their recovery is documented in SOURCES.jsonl). Reports the size so
the agent can choose canvas upload (small) or local delivery plus a canvas note.
Usage: pack_project.py PROJECT_ROOT OUT.zip [--include-raw] [--limit-mib 50]
"""
import argparse
import json
import os
from pathlib import Path
import zipfile

SKIP_DIRS = {"node_modules", ".venv", "__pycache__", ".cache", "frames"}


def main():
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("project", type=Path)
    ap.add_argument("out", type=Path)
    ap.add_argument("--include-raw", action="store_true")
    ap.add_argument("--limit-mib", type=float, default=50)
    a = ap.parse_args()
    root = a.project.expanduser().resolve()
    out = a.out.expanduser().resolve()
    if not (root / "project.json").exists():
        raise SystemExit("not a project created by init_project.py (project.json missing)")
    for need in ["film/index.html", "film/timeline.json", "film/SOURCES.jsonl", "film/FACTS.md", "film/CREDITS"]:
        if not (root / need).exists():
            print(f"warning: {need} missing; the package may not rebuild")
    count = 0
    with zipfile.ZipFile(out, "w", zipfile.ZIP_DEFLATED) as zf:
        for dirpath, dirnames, filenames in os.walk(root):
            rel = Path(dirpath).relative_to(root)
            dirnames[:] = [d for d in dirnames if d not in SKIP_DIRS
                           and not (not a.include_raw and rel == Path("film") and d == "raw")]
            for name in filenames:
                path = Path(dirpath) / name
                if path == out or name == ".DS_Store":
                    continue
                zf.write(path, Path(root.name) / path.relative_to(root))
                count += 1
    mib = out.stat().st_size / 1048576
    print(json.dumps({"zip": str(out), "files": count, "mib": round(mib, 2),
                      "canvas_upload": mib <= a.limit_mib,
                      "delivery": "canvas" if mib <= a.limit_mib else "local path + canvas text note"},
                     ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
