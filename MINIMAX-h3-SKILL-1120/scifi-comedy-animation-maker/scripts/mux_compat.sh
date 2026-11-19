#!/bin/sh
# Fallback mux for flat-toon films when runtime core/render/mux.sh misfires.
# Verified on ffmpeg 6.0: mux.sh's decode-length guard under-reports decoded time
# ("only 5.1 s of the 8.0 s could be decoded"), and scipy-written WAVs carry no
# channel layout. Same target as upstream: two-pass loudnorm -14 LUFS / TP -1.2, grain 0.
# Usage: sh mux_compat.sh picture.mp4 mix.wav out.mp4 DURATION_SECONDS [FPS]
set -eu
[ $# -ge 4 ] || { echo "usage: $0 picture.mp4 mix.wav out.mp4 DUR [FPS]" >&2; exit 2; }
V=$1; A=$2; O=$3; DUR=$4; FPS=${5:-24}
J=$(ffmpeg -hide_banner -nostats -i "$A" -af aformat=channel_layouts=stereo,loudnorm=I=-14:TP=-1.2:LRA=11:print_format=json -f null - 2>&1 | sed -n '/{/,/}/p')
LN=$(printf '%s' "$J" | python3 -c '
import json, math, sys
data = json.load(sys.stdin)
keys = ("input_i", "input_tp", "input_lra", "input_thresh", "target_offset")
values = [float(data[key]) for key in keys]
if not all(math.isfinite(value) for value in values):
    print("Non-finite loudness measurement (including silence); skipping normalization", file=sys.stderr)
    print("anull")
else:
    i, tp, lra, threshold, offset = values
    print(f"loudnorm=I=-14:TP=-1.2:LRA=11:measured_I={i}:measured_TP={tp}:measured_LRA={lra}:measured_thresh={threshold}:offset={offset}:linear=true")
')
ffmpeg -y -loglevel error -i "$V" -i "$A" -filter_complex \
  "[0:v]fps=$FPS,format=yuv420p[v];[1:a]aformat=channel_layouts=stereo,$LN,aresample=48000,aformat=channel_layouts=stereo,atrim=0:$DUR[a]" \
  -map "[v]" -map "[a]" -c:v libx264 -preset slow -crf 19 -r "$FPS" -c:a aac -b:a 256k -movflags +faststart "$O"
ffmpeg -hide_banner -nostats -i "$O" -af ebur128=peak=true -f null - 2>&1 | grep -E "^\s+(I|LRA|Peak):" || true
