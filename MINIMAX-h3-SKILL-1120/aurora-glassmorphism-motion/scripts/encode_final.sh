#!/bin/bash
# Final delivery encode for dark aurora gradients: lossless master (.mkv from render.mjs --mkv) + audio.wav -> H.264 MP4.
# Error-diffusion dither on RGB->YUV, two-pass ~37 Mb/s, tune grain, dark-biased AQ. Keeps 10 s 1080p under ~50 MB.
# usage: encode_final.sh master.mkv audio.wav out.mp4 [video_bitrate, default 37M]
set -e
IN=$1; AUD=$2; OUT=$3; BR=${4:-37M}
[ -f "$IN" ] && [ -f "$AUD" ] && [ -n "$OUT" ] || { echo "usage: $0 master.mkv audio.wav out.mp4 [bitrate]"; exit 1; }
if ffmpeg -hide_banner -filters 2>/dev/null | grep -q ' zscale '; then
  VF="zscale=m=709:r=limited:d=error_diffusion,format=yuv420p"
else
  VF="scale=out_color_matrix=bt709:out_range=tv:flags=lanczos+accurate_rnd+full_chroma_int+error_diffusion,format=yuv420p"
fi
X264="aq-mode=3:aq-strength=1.3:deadzone-inter=0:deadzone-intra=0:no-dct-decimate=1"
COMMON=(-vf "$VF" -c:v libx264 -preset slow -profile:v high -tune grain -b:v "$BR" -maxrate 60M -bufsize 80M
  -x264-params "$X264" -colorspace bt709 -color_primaries bt709 -color_trc bt709 -color_range tv -r 30)
LOG=$(mktemp -d)/x264
ffmpeg -y -hide_banner -loglevel error -i "$IN" "${COMMON[@]}" -pass 1 -passlogfile "$LOG" -an -f mp4 /dev/null
ffmpeg -y -hide_banner -loglevel error -i "$IN" -i "$AUD" -map 0:v:0 -map 1:a:0 "${COMMON[@]}" -pass 2 -passlogfile "$LOG" \
  -af apad -c:a aac -b:a 320k -ar 48000 -shortest -movflags +faststart "$OUT"
echo "done -> $OUT ($(du -h "$OUT" | cut -f1))"
