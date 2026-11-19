#!/bin/sh
# Mux the final film: mux.sh video.mp4 mix.wav out.mp4 [fps] [grain]
# Video is output at the target frame rate (held segments get duplicated frames automatically); grain = grain strength (default 2, 0 = none; use 0 for pixel/vector styles)
# Audio: two-pass loudnorm → −14 LUFS / TP −1.2 (a single pass is off by about 0.5 LU)
V="$1"; A="$2"; O="$3"; FPS="${4:-24}"; GR="${5:-2}"
J=$(ffmpeg -hide_banner -nostats -i "$A" -af loudnorm=I=-14:TP=-1.2:LRA=11:print_format=json -f null - 2>&1 | sed -n '/{/,/}/p')
g() { echo "$J" | grep "\"$1\"" | sed 's/.*: "\(.*\)".*/\1/'; }
LN="loudnorm=I=-14:TP=-1.2:LRA=11:measured_I=$(g input_i):measured_TP=$(g input_tp):measured_LRA=$(g input_lra):measured_thresh=$(g input_thresh):offset=$(g target_offset):linear=true"
if [ "$GR" = "0" ]; then VF="fps=$FPS,format=yuv420p"; else VF="fps=$FPS,noise=c0s=$GR:allf=t,format=yuv420p"; fi
ffmpeg -y -loglevel error -i "$V" -i "$A" \
  -filter_complex "[0:v]$VF[v];[1:a]$LN,aresample=48000[a]" \
  -map "[v]" -map "[a]" -c:v libx264 -preset slow -crf ${CRF:-19} -r "$FPS" -c:a aac -b:a 256k -movflags +faststart -shortest "$O"
echo "$O"
ffmpeg -hide_banner -nostats -i "$O" -af ebur128 -f null - 2>&1 | grep -E "^\s+(I|LRA|Peak):" | head -3
