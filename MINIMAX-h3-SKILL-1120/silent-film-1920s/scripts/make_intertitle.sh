#!/usr/bin/env bash
# Intertitle card clip: black painted card, ornament level follows the emotion.
# Original script for the silent-film-1920s Skill. Requires ffmpeg.
# The card is rendered clean (no damage); run it through print_pass.sh afterwards so
# cards and pictures share one print.
#
# Usage: make_intertitle.sh -o card.mp4 -l narration|shout|tender [-d SECONDS]
#          -f /path/to/font.ttf "LINE 1" ["LINE 2" ...]
# Duration default = max(1.8, words/3.3 + 0.6), clamped to 2.5-3.75 s unless -d given.
# Fonts: prefer period OFL faces (e.g. Playfair Display SC for titles/shouts,
# Old Standard TT Italic for narration/dialogue); any serif .ttf works for drafts.
set -euo pipefail
OUT=""; LV=narration; DUR=""; FONT=""
while getopts "o:l:d:f:" a; do case $a in o) OUT=$OPTARG;; l) LV=$OPTARG;; d) DUR=$OPTARG;; f) FONT=$OPTARG;; *) exit 2;; esac; done
shift $((OPTIND-1)); [[ -n "$OUT" && -f "$FONT" && $# -ge 1 ]] || { echo "need -o, -f font and at least one line" >&2; exit 2; }
FF=${FFMPEG:-ffmpeg}
WORDS=$(printf '%s ' "$@" | wc -w | tr -d ' ')
if [[ -z "$DUR" ]]; then DUR=$(awk -v w="$WORDS" 'BEGIN{d=w/3.3+0.6; if(d<1.8)d=1.8; if(d<2.5)d=2.5; if(d>3.75)d=3.75; printf "%.2f", d}'); fi
W=1440; H=1080; INK=0xE8E2D2
case $LV in
  shout)    B="drawbox=x=150:y=150:w=1140:h=780:color=${INK}:t=14"; SIZE=110; SHAKE="+4*sin(t*47)";;
  tender)   B="drawbox=x=170:y=170:w=1100:h=740:color=${INK}@0.8:t=3,drawbox=x=150:y=150:w=1140:h=780:color=${INK}@0.5:t=1"; SIZE=78; SHAKE="";;
  *)        B="drawbox=x=150:y=150:w=1140:h=780:color=${INK}:t=4,drawbox=x=172:y=172:w=1096:h=736:color=${INK}:t=2,drawbox=x=150:y=150:w=60:h=60:color=${INK}:t=fill,drawbox=x=1230:y=150:w=60:h=60:color=${INK}:t=fill,drawbox=x=150:y=870:w=60:h=60:color=${INK}:t=fill,drawbox=x=1230:y=870:w=60:h=60:color=${INK}:t=fill"; SIZE=84; SHAKE="";;
esac
N=$#; LH=$(awk -v s=$SIZE 'BEGIN{printf "%d", s*1.35}'); Y0=$(( (H - N*LH)/2 ))
DT=""; i=0
for line in "$@"; do
  esc=$(printf '%s' "$line" | sed -e "s/\\\\/\\\\\\\\/g" -e "s/'/\\\\\\\\\\\\'/g" -e 's/:/\\:/g' -e 's/%/\\%/g')
  DT+=",drawtext=fontfile='${FONT}':text='${esc}':fontsize=${SIZE}:fontcolor=${INK}:x='(w-text_w)/2${SHAKE}':y=$((Y0+i*LH))"
  i=$((i+1))
done
"$FF" -y -hide_banner -loglevel error -f lavfi -i "color=c=0x0d0c0a:s=${W}x${H}:r=24:d=${DUR}" \
  -vf "${B}${DT},fade=t=in:st=0:d=0.25,fade=t=out:st=$(awk -v d=$DUR 'BEGIN{print d-0.25}'):d=0.25,format=yuv420p" \
  -c:v libx264 -crf 18 "$OUT"
echo "wrote $OUT (${DUR}s, level ${LV}, ${WORDS} words)"
