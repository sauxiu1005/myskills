#!/bin/sh
# 一条命令重建《晚安，小猫》：配音 → 事件 → 配乐 → 混音 → 逐帧渲染 → 合成
set -e
HERE=$(cd "$(dirname "$0")" && pwd)
. "$HOME/Movies/Hub/skills/crayon-picture-book-animation/scripts/env.sh"
cd "$LIB"
[ -f "$HERE/voices/l1.wav" ] || .venv/bin/python core/tts/tts_zh.py "$HERE/lines.json" "$HERE/voices"
node core/render/events.mjs "$HERE"
mkdir -p "$HERE/music/stems"; .venv/bin/python "$HERE/music/score.py"
mkdir -p "$HERE/out"; .venv/bin/python "$HERE/mix.py"
node core/render/video.mjs "$HERE" --fps 24 --workers 4 --out "$HERE/out/video.mp4"
.venv/bin/python core/render/srt.py "$HERE/subs.json" "$HERE/goodnight-kitten.srt"
CRF=24 sh core/render/mux.sh "$HERE/out/video.mp4" "$HERE/out/mix.wav" "$HERE/goodnight-kitten.mp4" 24 0
