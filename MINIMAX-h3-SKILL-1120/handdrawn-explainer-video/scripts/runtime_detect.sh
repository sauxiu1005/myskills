#!/usr/bin/env bash
# Shared runtime discovery for design_env.sh and install_runtime.sh (sourced, not executed).
# Order: MiniMax Design bundled tools -> tools already on this computer -> tools this Skill installed earlier.
HANDDRAW_CACHE="${HANDDRAW_CACHE:-$HOME/.cache/sweety-handdraw-video}"

handdraw_app_dirs() {
  # HANDDRAW_APP_ROOTS (colon-separated .app paths) overrides the search, e.g. for tests.
  local app
  if [ -n "${HANDDRAW_APP_ROOTS+x}" ]; then
    local IFS=:
    for app in $HANDDRAW_APP_ROOTS; do [ -d "$app/Contents/Resources" ] && echo "$app/Contents/Resources"; done
    return 0
  fi
  for app in "/Applications/MiniMax Design.app" "/Applications/MiniMax Design "*.app "$HOME/Applications/MiniMax Design.app" "$HOME/Applications/MiniMax Design "*.app; do
    [ -d "$app/Contents/Resources" ] && echo "$app/Contents/Resources"
  done
}

handdraw_python_ok() {
  # Python 3.9+ with venv support. Skip the macOS /usr/bin/python3 stub when Command Line Tools are absent,
  # because calling it opens a system install dialog instead of running Python.
  local candidate="$1"
  [ -x "$candidate" ] || return 1
  if [ "$candidate" = "/usr/bin/python3" ] && [ "$(uname)" = "Darwin" ] && ! xcode-select -p >/dev/null 2>&1; then return 1; fi
  "$candidate" -c 'import sys, venv, ensurepip; sys.exit(sys.version_info < (3, 9))' >/dev/null 2>&1
}

handdraw_find_python() {
  # HANDDRAW_PYTHON_CANDIDATES (colon-separated) overrides the search, e.g. for tests.
  local candidate list
  list="${HANDDRAW_PYTHON_CANDIDATES-${HANDDRAW_BASE_PYTHON:-}:$HOME/.hub/runtimes/python/bin/python3:$(command -v python3 2>/dev/null):/opt/homebrew/bin/python3:/usr/local/bin/python3:/usr/bin/python3}"
  local IFS=:
  for candidate in $list; do
    [ -n "$candidate" ] && handdraw_python_ok "$candidate" && { echo "$candidate"; return 0; }
  done
  unset IFS
  if [ -x "$HOME/.local/bin/uv" ]; then
    candidate="$("$HOME/.local/bin/uv" python find '>=3.9' 2>/dev/null)"
    [ -n "$candidate" ] && handdraw_python_ok "$candidate" && { echo "$candidate"; return 0; }
  fi
  return 1
}

handdraw_find_ffmpeg_dir() {
  local dir resources
  dir="${HANDDRAW_FFMPEG_DIR:-}"
  [ -n "$dir" ] && [ -x "$dir/ffmpeg" ] && [ -x "$dir/ffprobe" ] && { echo "$dir"; return 0; }
  while IFS= read -r resources; do
    dir="$resources/ffmpeg"
    [ -x "$dir/ffmpeg" ] && [ -x "$dir/ffprobe" ] && { echo "$dir"; return 0; }
  done < <(handdraw_app_dirs)
  if command -v ffmpeg >/dev/null 2>&1 && command -v ffprobe >/dev/null 2>&1; then dirname "$(command -v ffmpeg)"; return 0; fi
  for dir in /opt/homebrew/bin /usr/local/bin "$HANDDRAW_CACHE/bin"; do
    [ -x "$dir/ffmpeg" ] && [ -x "$dir/ffprobe" ] && { echo "$dir"; return 0; }
  done
  return 1
}

handdraw_find_brew() {
  local candidate
  for candidate in "$(command -v brew 2>/dev/null)" /opt/homebrew/bin/brew /usr/local/bin/brew; do
    [ -n "$candidate" ] && [ -x "$candidate" ] && { echo "$candidate"; return 0; }
  done
  return 1
}

handdraw_find_caption_font() {
  local resources font
  while IFS= read -r resources; do
    font="$resources/app-resources/fonts/NotoSansCJKsc-Regular.otf"
    [ -f "$font" ] && { echo "$font"; return 0; }
  done < <(handdraw_app_dirs)
  for font in "/System/Library/Fonts/Hiragino Sans GB.ttc" "/System/Library/Fonts/STHeiti Medium.ttc"; do
    [ -f "$font" ] && { echo "$font"; return 0; }
  done
  return 1
}
