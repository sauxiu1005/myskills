#!/usr/bin/env bash
# Silent-film print pass: motion sampling + per-output-frame print damage + 4:3 gate.
# Original script for the silent-film-1920s Skill (concepts paraphrased from
# lemo-opuscar styles/silent-film, MIT; no code copied). Requires ffmpeg.
#
# Key idea: motion is SAMPLED at a low rate (16 fps calm / 18-20 fps undercranked)
# while grain, flicker, weave and scratches change on EVERY output frame (24 fps).
# Order matters: resample first, damage after. Doing damage first would freeze the
# grain on held frames and read as "low frame rate", not "projected film".
#
# Usage:
#   print_pass.sh -i in.mp4 -o out.mp4 [-s 16] [-c 1.0] [-t 0.2] [-d 0.5]
#                 [-g gate|full] [--curtain curtain.png] [--iris-in] [--iris-out T]
#                 [--iris-x 0.5] [--iris-y 0.45] [--keep-audio]
#   -s  motion sample fps (16 calm, 18-20 chase/panic)      default 16
#   -c  crank speed multiplier (1.0 normal, 1.2-1.4 undercranked chase) default 1.0
#   -t  sepia amount 0..0.4 (warmer = tender, lower = cold/harsh) default 0.2
#   -d  damage strength 0..1 (raise when things go wrong)  default 0.5
#   -g  gate: 1440x1080 aperture centred in 1920x1080 (default) | full: 1440x1080 only
#   --curtain  optional 1920x1080 PNG with transparent centre (theatre drapes)
#   --iris-in       iris opens over the first 0.8 s
#   --iris-out T    iris closes from time T (s, output timeline): 0.9 s to a held
#                   head-size circle, 1.0 s hold (the look to the audience), 0.4 s to black
#   --iris-x/--iris-y  iris centre in normalised film coordinates (track the face!)
set -euo pipefail
IN=""; OUT=""; S=16; C=1.0; T=0.2; D=0.5; G=gate; CUR=""; IRIN=0; IROUT=""; IX=0.5; IY=0.45; AUD=0
while [[ $# -gt 0 ]]; do case "$1" in
  -i) IN="$2"; shift 2;; -o) OUT="$2"; shift 2;; -s) S="$2"; shift 2;; -c) C="$2"; shift 2;;
  -t) T="$2"; shift 2;; -d) D="$2"; shift 2;; -g) G="$2"; shift 2;; --curtain) CUR="$2"; shift 2;;
  --iris-in) IRIN=1; shift;; --iris-out) IROUT="$2"; shift 2;; --iris-x) IX="$2"; shift 2;;
  --iris-y) IY="$2"; shift 2;; --keep-audio) AUD=1; shift;;
  -h|--help) sed -n '2,30p' "$0"; exit 0;; *) echo "unknown arg $1" >&2; exit 2;; esac; done
[[ -f "$IN" && -n "$OUT" ]] || { echo "need -i existing input and -o output" >&2; exit 2; }
FF=${FFMPEG:-ffmpeg}
calc(){ awk "BEGIN{printf \"%.4f\", $1}"; }
GG=$(calc "1-0.11*$T"); BB=$(calc "1-0.30*$T")
GRAIN=$(calc "8+18*$D"); FLK=$(calc "0.015+0.045*$D"); WV=$(calc "1+3*$D")
SCR_ON=$(awk "BEGIN{print int(2+6*$D)}")   # scratch frames per 17
# 1) crank + motion sampling, 2) monochrome print look, 3) per-frame damage
VF="setpts=PTS/${C},fps=${S},fps=24"
VF+=",scale=1456:1092:force_original_aspect_ratio=increase,crop=1456:1092"
VF+=",format=gray,format=gbrp,colorchannelmixer=rr=1:gg=${GG}:bb=${BB}"
VF+=",curves=all='0/0 0.25/0.2 0.75/0.82 1/1'"
VF+=",colorlevels=romin=0.055:gomin=0.055:bomin=0.055:romax=0.93:gomax=0.93:bomax=0.93"
VF+=",crop=1440:1080:'8+${WV}*sin(n*1.3)+if(eq(mod(n,97),0),3,0)':'6+${WV}*sin(n*0.77+1)+if(eq(mod(n,97),0),5,0)'"
VF+=",eq=brightness='${FLK}*(sin(n*2.1)+0.6*sin(n*5.3))':eval=frame"
VF+=",noise=alls=${GRAIN}:allf=t"
VF+=",drawbox=x='iw*(0.15+0.7*abs(sin(t*8.88)))':y=0:w=2:h=ih:color=white@0.35:t=fill:enable='lt(mod(n,17),${SCR_ON})'"
VF+=",drawbox=x='iw*(0.1+0.8*abs(sin(t*21.84+2)))':y='ih*0.2':w=1:h='ih*0.6':color=black@0.4:t=fill:enable='lt(mod(n,23),${SCR_ON})'"
VF+=",vignette=angle=PI/4.2"
if [[ $IRIN == 1 || -n "$IROUT" ]]; then
  CX="$(calc "$IX*1440")"; CY="$(calc "$IY*1080")"; RMAX=1400; RH=200
  R="$RMAX"
  [[ $IRIN == 1 ]] && R="if(lt(T,0.8),${RMAX}*T/0.8,${R})"
  if [[ -n "$IROUT" ]]; then
    R="if(gte(T,${IROUT}),if(lt(T,${IROUT}+0.9),${RMAX}-(${RMAX}-${RH})*(T-${IROUT})/0.9,if(lt(T,${IROUT}+1.9),${RH},max(0,${RH}*(1-(T-${IROUT}-1.9)/0.4)))),${R})"
  fi
  M="clip((${R}-hypot(X-${CX},Y-${CY}))/6,0,1)"
  VF+=",format=gbrp,geq=r='r(X,Y)*${M}':g='g(X,Y)*${M}':b='b(X,Y)*${M}'"
fi
if [[ "$G" == gate ]]; then
  VF+=",pad=1920:1080:240:0:color=0x0b0907"
fi
VF+=",format=yuv420p"
ARGS=(-y -hide_banner -loglevel error -i "$IN")
if [[ -n "$CUR" && "$G" == gate ]]; then
  ARGS+=(-i "$CUR")
  FC="[0:v]${VF}[v];[1:v]scale=1920:1080,format=rgba[c];[v][c]overlay=0:0:format=auto,format=yuv420p[o]"
else
  FC="[0:v]${VF}[o]"
fi
ARGS+=(-filter_complex "$FC" -map "[o]")
# Audio is only kept at crank 1.0; the score is normally laid in afterwards anyway.
if [[ $AUD == 1 ]]; then ARGS+=(-map "0:a?" -c:a aac -b:a 192k); else ARGS+=(-an); fi
"$FF" "${ARGS[@]}" -r 24 -c:v libx264 -tune grain -crf 23 -pix_fmt yuv420p "$OUT"
echo "wrote $OUT (motion ${S} fps sampled, output 24 fps, crank x${C}, sepia ${T}, damage ${D}, gate ${G})"
