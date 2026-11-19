#!/usr/bin/env bash
# Prepare the local Python + FFmpeg runtime for this Skill inside MiniMax Design.
# Usage: source scripts/design_env.sh   (then call "$HANDDRAW_PY" scripts/handdraw_video.py ...)
# Python: MiniMax Design's bundled runtime first, then any Python 3.9+ already installed.
# FFmpeg: the copy bundled with MiniMax Design first, then any installed copy.
# When something prints MISSING, run scripts/install_runtime.sh after the user agrees, then source this file again.
SKILL_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
. "$SKILL_DIR/scripts/runtime_detect.sh"
VENV="${HANDDRAW_VENV:-$HANDDRAW_CACHE/venv}"
FFDIR="$(handdraw_find_ffmpeg_dir)" || { echo "MISSING: ffmpeg/ffprobe — run: bash \"$SKILL_DIR/scripts/install_runtime.sh\"" >&2; return 1 2>/dev/null || exit 1; }
export PATH="$FFDIR:$PATH"
if [ ! -x "$VENV/bin/python" ] || ! "$VENV/bin/python" -c 'import sys' >/dev/null 2>&1; then
  BASE_PY="$(handdraw_find_python)" || { echo "MISSING: python3 (3.9+) — run: bash \"$SKILL_DIR/scripts/install_runtime.sh\"" >&2; return 1 2>/dev/null || exit 1; }
  rm -rf "$VENV"; "$BASE_PY" -m venv "$VENV" || { echo "MISSING: python3 venv" >&2; return 1 2>/dev/null || exit 1; }
fi
if ! "$VENV/bin/python" -c "import PIL, numpy, scipy" 2>/dev/null; then
  "$VENV/bin/pip" install -q -r "$SKILL_DIR/scripts/requirements.txt" || { echo "MISSING: Python dependencies (check the network, then source this file again)" >&2; return 1 2>/dev/null || exit 1; }
fi
export HANDDRAW_PY="$VENV/bin/python" HANDDRAW_SKILL="$SKILL_DIR" PYTHONDONTWRITEBYTECODE=1
HANDDRAW_CAPTION_FONT="$(handdraw_find_caption_font)" && export HANDDRAW_CAPTION_FONT
echo "ready: python=$HANDDRAW_PY ffmpeg=$FFDIR/ffmpeg caption_font=${HANDDRAW_CAPTION_FONT:-none}"
