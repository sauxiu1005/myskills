#!/bin/sh
# 一条命令重建：配音 → 事件 → 配乐 → 混音 → 逐帧渲染 → 字幕 → 合成
set -e
HERE=$(cd "$(dirname "$0")" && pwd)
SKILL_DIR=${SKILL_DIR:-$(cat "$HERE/.skill-path")}
. "$SKILL_DIR/scripts/env.sh"
NAME=$(basename "$HERE")
cd "$LIB"
[ -f "$HERE/voices/l1.wav" ] || .venv/bin/python core/tts/tts_zh.py "$HERE/lines.json" "$HERE/voices"
node core/render/events.mjs "$HERE"
mkdir -p "$HERE/music/stems"; .venv/bin/python "$HERE/music/score.py"
mkdir -p "$HERE/out"; .venv/bin/python "$HERE/mix.py"
node core/render/video.mjs "$HERE" --fps 24 --workers 4 --out "$HERE/out/video.mp4"
[ -f "$HERE/subs.json" ] && .venv/bin/python core/render/srt.py "$HERE/subs.json" "$HERE/$NAME.srt"
CRF=24 sh core/render/mux.sh "$HERE/out/video.mp4" "$HERE/out/mix.wav" "$HERE/$NAME.mp4" 24 0
