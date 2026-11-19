#!/usr/bin/env python3
"""timeline.json + voice durations -> out/cues.json, with the same timing rule as the burned-in
subtitles (start = line start, length = max(1.8 s, spoken + 0.6 s), cut 50 ms before the next cue).
Each cue is one Chinese line over one English line."""
import json
from pathlib import Path
HERE = Path(__file__).resolve().parent.parent
TL = json.loads((HERE / "timeline.json").read_text())
VD = json.loads((HERE / "voice" / "out" / "dur.json").read_text())
L = TL["lines"]; cues = []
for i, l in enumerate(L):
    t1 = l["t"] + max(1.8, VD[l["id"]] + .6)
    if i + 1 < len(L): t1 = min(t1, L[i + 1]["t"] - .05)
    cues.append({"t0": l["t"], "t1": round(t1, 3), "text": l["zh"] + "\n" + l["en"]})
    if t1 - l["t"] < max(1.8, VD[l["id"]] + .6) - 1e-6: print("short cue", l["id"], round(t1 - l["t"], 2))
(HERE / "out").mkdir(exist_ok=True)
(HERE / "out" / "cues.json").write_text(json.dumps(cues, ensure_ascii=False, indent=1))
print(len(cues), "cues")
