#!/usr/bin/env bash
# Install Python and/or FFmpeg when this computer lacks them, then hand back to design_env.sh.
# Usage: bash scripts/install_runtime.sh [--check|--dry-run]
#   --check    only report what is present or missing (exit 1 when something is missing)
#   --dry-run  print the install commands that would run, without running them
# Run the install only after the user agrees: it downloads software from the internet.
set -u
SKILL_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
. "$SKILL_DIR/scripts/runtime_detect.sh"
MODE="${1:-install}"
run() { if [ "$MODE" = "--dry-run" ]; then echo "would run: $*"; else echo "running: $*"; "$@"; fi; }

PYTHON="$(handdraw_find_python || true)"
FFDIR="$(handdraw_find_ffmpeg_dir || true)"
BREW="$(handdraw_find_brew || true)"
echo "python: ${PYTHON:-MISSING}"
echo "ffmpeg: ${FFDIR:-MISSING}"
echo "homebrew: ${BREW:-not installed}"
if [ "$MODE" = "--check" ]; then [ -n "$PYTHON" ] && [ -n "$FFDIR" ]; exit $?; fi
status=0

if [ -z "$PYTHON" ]; then
  if [ -n "$BREW" ]; then
    run "$BREW" install python@3.12
  else
    # No Homebrew: install uv (user-level, no administrator password) and a managed Python 3.12.
    if [ ! -x "$HOME/.local/bin/uv" ]; then
      if [ "$MODE" = "--dry-run" ]; then echo "would run: curl -LsSf https://astral.sh/uv/install.sh | sh"
      else echo "running: uv installer"; curl -LsSf https://astral.sh/uv/install.sh | env UV_NO_MODIFY_PATH=1 sh || status=1; fi
    fi
    [ "$status" = 0 ] && run "$HOME/.local/bin/uv" python install 3.12
  fi
  [ "$MODE" = "--dry-run" ] || { PYTHON="$(handdraw_find_python || true)"; [ -n "$PYTHON" ] || { echo "MISSING: python (install failed)" >&2; status=1; }; }
fi

if [ -z "$FFDIR" ]; then
  if [ -n "$BREW" ]; then
    run "$BREW" install ffmpeg
    [ "$MODE" = "--dry-run" ] || { FFDIR="$(handdraw_find_ffmpeg_dir || true)"; [ -n "$FFDIR" ] || { echo "MISSING: ffmpeg (install failed)" >&2; status=1; }; }
  else
    echo "MISSING: ffmpeg — MiniMax Design normally bundles it. Update or reinstall MiniMax Design, or install Homebrew (https://brew.sh, needs the administrator password in Terminal) and run: brew install ffmpeg" >&2
    status=1
  fi
fi

[ "$status" = 0 ] && [ "$MODE" != "--dry-run" ] && echo "runtime installed; now run: source scripts/design_env.sh"
exit $status
