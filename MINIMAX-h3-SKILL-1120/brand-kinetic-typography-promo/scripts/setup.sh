#!/usr/bin/env bash
# Create an isolated render environment: bash setup.sh <venv_dir>
set -e
VENV="${1:-./mgfx-venv}"
PY="$(command -v python3)"
"$PY" -m venv "$VENV"
"$VENV/bin/pip" install -q --disable-pip-version-check numpy skia-python imageio-ffmpeg
"$VENV/bin/python" -c "import skia, imageio_ffmpeg; print('skia', skia.__version__, '| ffmpeg', imageio_ffmpeg.get_ffmpeg_exe())"
