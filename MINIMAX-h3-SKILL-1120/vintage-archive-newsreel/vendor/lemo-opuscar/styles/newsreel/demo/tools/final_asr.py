#!/usr/bin/env python3
"""Speech check on the finished film: cuts every announcer line out of the final audio (with the
period treatment, music and foley under it) and runs core/tts/asr_check.py on those cuts.
    $LIB/.venv/bin/python tools/final_asr.py <film.mp4>
"""
import json, subprocess, sys
from pathlib import Path
import soundfile as sf

HERE = Path(__file__).resolve().parent.parent
LIB = Path(__file__).resolve().parents[4] if (Path(__file__).resolve().parents[4] / "core").exists() else Path.cwd()
film = Path(sys.argv[1])
out = HERE / "out" / "final_asr"; out.mkdir(parents=True, exist_ok=True)
wav = out / "film.wav"
subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", str(film), "-ac", "1", "-ar", "24000", str(wav)], check=True)
x, sr = sf.read(wav)
TL = json.loads((HERE / "timeline.json").read_text())
VD = json.loads((HERE / "voice" / "out" / "dur.json").read_text())
lines = {L["id"]: L for L in json.loads((HERE / "voice" / "lines.json").read_text())}
spec = []
for L in TL["lines"]:
    a, b = int((L["t"] - .05) * sr), int((L["t"] + VD[L["id"]] + .25) * sr)
    sf.write(out / f"{L['id']}.wav", x[a:b], sr)
    d = dict(lines[L["id"]])
    if "asr_final" in d: d["asr"] = d["asr_final"]   # homophones Whisper hears through the period treatment
    spec.append(d)
(out / "lines.json").write_text(json.dumps(spec, ensure_ascii=False, indent=1))
r = subprocess.run([sys.executable, str(LIB / "core" / "tts" / "asr_check.py"), str(out / "lines.json"), str(out), "--lang", "en"])
sys.exit(r.returncode)
