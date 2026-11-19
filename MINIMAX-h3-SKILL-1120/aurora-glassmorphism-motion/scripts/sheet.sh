#!/bin/bash
# usage: sheet.sh out.png f1 f2 ... (up to 6, 2 columns, each 960 wide)
out=$1; shift; n=$#; inputs=(); filt=""; lay=""; i=0
for f in "$@"; do inputs+=(-i "$f"); filt+="[$i]scale=960:-1,drawtext=text='$(basename $f .png)':x=12:y=12:fontsize=26:fontcolor=yellow[v$i];"; x=$(( (i%2)*960 )); y=$(( (i/2)*540 )); lay+="${x}_${y}|"; i=$((i+1)); done
ins=""; for ((j=0;j<n;j++)); do ins+="[v$j]"; done
ffmpeg -loglevel error -y "${inputs[@]}" -filter_complex "${filt}${ins}xstack=inputs=$n:layout=${lay%|}" "$out"
