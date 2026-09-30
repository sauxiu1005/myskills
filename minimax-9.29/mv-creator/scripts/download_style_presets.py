#!/usr/bin/env python3
"""下载 mv-creator 内置风格预设图到本地缓存。

用法：
  python3 download_style_presets.py <cache_dir>
  python3 download_style_presets.py <cache_dir> --style cinematic

也可作为模块导入，调用 ensure_style_presets(cache_dir) 获取本地路径。

CDN 源仅在本脚本内部使用，不对外暴露。下载到本地后，所有调用方
（render_preview.py / 生图工具的 image_paths）都使用本地路径。
"""

import argparse
import sys
import urllib.request
from pathlib import Path

# Internal CDN source — do not reference these URLs from markdown or other code.
_CDN_BASE = "https://cdn.hailuoai.com/hailuo-video-web/public_assets"
_PRESETS = {
    "cinematic": ["01_highway.png", "02_bar.png", "03_canyon.png", "04_starry.png"],
    "oil-painting": ["01_highway.png", "02_bar.png", "03_prairie.png", "04_campfire.png"],
    "noir-illustration": ["01_highway.png", "02_bar.png", "03_stage.png"],
}

PRESET_STYLES: tuple[str, ...] = tuple(_PRESETS.keys())


def _fetch_one(style_id: str, filename: str, cache_dir: Path) -> Path | None:
    """Download a single preset image; skip if already cached.

    Returns the local path on success (cached or freshly downloaded), or None
    if the download failed.
    """
    out_dir = cache_dir / style_id
    out_dir.mkdir(parents=True, exist_ok=True)
    local = out_dir / filename
    if local.exists():
        return local
    url = f"{_CDN_BASE}/{style_id}/{filename}"
    try:
        urllib.request.urlretrieve(url, local)
    except Exception as exc:  # noqa: BLE001 — log and continue
        print(f"WARN: failed to download {url}: {exc}", file=sys.stderr)
        return None
    return local


def ensure_style_presets(
    cache_dir: Path,
    styles: tuple[str, ...] | None = None,
) -> dict[str, list[Path]]:
    """Ensure preset images exist under cache_dir; download missing ones.

    Args:
        cache_dir: Directory to cache preset images. Created if absent.
        styles: Optional subset of style ids to ensure. Defaults to all known.

    Returns:
        {style_id: [local_path, ...]} — only includes styles with at least one
        successfully cached image.
    """
    targets = styles or PRESET_STYLES
    result: dict[str, list[Path]] = {}
    for style_id in targets:
        filenames = _PRESETS.get(style_id)
        if not filenames:
            print(f"WARN: unknown style id: {style_id}", file=sys.stderr)
            continue
        paths: list[Path] = []
        for fn in filenames:
            local = _fetch_one(style_id, fn, cache_dir)
            if local is not None:
                paths.append(local)
        if paths:
            result[style_id] = paths
    return result


def main() -> int:
    parser = argparse.ArgumentParser(description="Download mv-creator built-in style presets")
    parser.add_argument("cache_dir", type=Path, help="Local cache directory")
    parser.add_argument(
        "--style",
        action="append",
        choices=PRESET_STYLES,
        help="Only download specific style(s); may be passed multiple times",
    )
    args = parser.parse_args()

    cache_dir: Path = args.cache_dir.resolve()
    selected = tuple(args.style) if args.style else None
    result = ensure_style_presets(cache_dir, styles=selected)

    if not result:
        print("ERROR: no presets cached", file=sys.stderr)
        return 1

    for style_id, paths in result.items():
        print(f"{style_id}: {len(paths)} files")
        for p in paths:
            print(f"  {p}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
