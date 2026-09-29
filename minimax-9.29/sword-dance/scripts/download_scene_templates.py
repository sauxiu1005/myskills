#!/usr/bin/env python3
"""下载 sword-dance 内置预设场景图到本地缓存。

用法：
  python3 download_scene_templates.py <cache_dir>
  python3 download_scene_templates.py <cache_dir> --scene scene-01

也可作为模块导入，调用 ensure_scene_templates(cache_dir) 获取本地路径。

CDN 源仅在本脚本内部使用，不对外暴露。下载到本地后，所有调用方
（render_scene_select.py / Phase 2 reference_image_paths）都使用本地路径。
"""

import argparse
import sys
import urllib.request
from pathlib import Path

# Internal CDN source — do not reference these URLs from markdown or other code.
_CDN_BASE = "https://cdn.hailuoai.com/hailuo-video-web/public_assets"
_PRESETS = {
    "scene-01": ["cell_1.png", "cell_2.png", "cell_3.png", "cell_4.png"],
    "scene-02": ["cell_1.png", "cell_2.png", "cell_3.png", "cell_4.png"],
    "scene-03": ["cell_1.png", "cell_2.png", "cell_3.png", "cell_4.png"],
}

PRESET_SCENES: tuple[str, ...] = tuple(_PRESETS.keys())


def _fetch_one(scene_id: str, filename: str, cache_dir: Path) -> Path | None:
    """Download a single preset image; skip if already cached.

    Returns the local path on success (cached or freshly downloaded), or None
    if the download failed.
    """
    out_dir = cache_dir / scene_id
    out_dir.mkdir(parents=True, exist_ok=True)
    local = out_dir / filename
    if local.exists():
        return local
    url = f"{_CDN_BASE}/{scene_id}/{filename}"
    try:
        urllib.request.urlretrieve(url, local)
    except Exception as exc:  # noqa: BLE001 — log and continue
        print(f"WARN: failed to download {url}: {exc}", file=sys.stderr)
        return None
    return local


def ensure_scene_templates(
    cache_dir: Path,
    scenes: tuple[str, ...] | None = None,
) -> dict[str, list[Path]]:
    """Ensure preset scene images exist under cache_dir; download missing ones.

    Args:
        cache_dir: Directory to cache preset images. Created if absent.
        scenes: Optional subset of scene ids to ensure. Defaults to all known.

    Returns:
        {scene_id: [local_path, ...]} — only includes scenes with at least one
        successfully cached image.
    """
    targets = scenes or PRESET_SCENES
    result: dict[str, list[Path]] = {}
    for scene_id in targets:
        filenames = _PRESETS.get(scene_id)
        if not filenames:
            print(f"WARN: unknown scene id: {scene_id}", file=sys.stderr)
            continue
        paths: list[Path] = []
        for fn in filenames:
            local = _fetch_one(scene_id, fn, cache_dir)
            if local is not None:
                paths.append(local)
        if paths:
            result[scene_id] = paths
    return result


def main() -> int:
    parser = argparse.ArgumentParser(description="Download sword-dance built-in scene templates")
    parser.add_argument("cache_dir", type=Path, help="Local cache directory")
    parser.add_argument(
        "--scene",
        action="append",
        choices=PRESET_SCENES,
        help="Only download specific scene(s); may be passed multiple times",
    )
    args = parser.parse_args()

    cache_dir: Path = args.cache_dir.resolve()
    selected = tuple(args.scene) if args.scene else None
    result = ensure_scene_templates(cache_dir, scenes=selected)

    if not result:
        print("ERROR: no scene templates cached", file=sys.stderr)
        return 1

    for scene_id, paths in result.items():
        print(f"{scene_id}: {len(paths)} files")
        for p in paths:
            print(f"  {p}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
