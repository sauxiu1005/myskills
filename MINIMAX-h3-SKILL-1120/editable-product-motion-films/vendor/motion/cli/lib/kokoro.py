# Kokoro text-to-speech for `om voice` (run with the Kokoro venv's python; see voice.js).
#   python kokoro.py <model.onnx> <voices.bin> <text-file> <voice> <speed> <out.wav>
# Prints one JSON line: {"ok": true, "seconds": …} or {"ok": false, "error": "…"}.
# Long scripts are spoken sentence by sentence: the model reads at most ~510 phoneme tokens at a time.
import inspect
import json
import re
import sys

# The language a Kokoro voice speaks, from its prefix (af_heart → American English, zf_xiaobei → Mandarin).
# Without it the model reads everything as English: Chinese came out as a long, unintelligible string.
LANG = {"a": "en-us", "b": "en-gb", "z": "cmn", "j": "ja", "e": "es", "f": "fr-fr", "h": "hi", "i": "it", "p": "pt-br"}


def main():
    model, voices, text_file, voice, speed, out = sys.argv[1:7]
    try:
        import kokoro_onnx
        import numpy as np
        import soundfile as sf
    except ImportError as e:
        print(json.dumps({"ok": False, "error": f"kokoro-onnx is not installed ({e.name})"}))
        return 1
    text = open(text_file, encoding="utf-8").read().strip()
    tts = kokoro_onnx.Kokoro(model, voices)
    lang = LANG.get(voice[:1])
    extra = {"lang": lang} if lang and "lang" in inspect.signature(tts.create).parameters else {}
    parts = [p for p in re.split(r"(?<=[。！？!?；;\n])", text) if p.strip()] or [text]
    audio, rate = [], 24000

    def speak(chunk):
        try:
            return tts.create(chunk, voice=voice, speed=float(speed), **extra)
        except IndexError:  # too many tokens for one pass: halve at a space or comma and try again
            if len(chunk) < 4:
                raise
            mid = len(chunk) // 2
            cut = max((i for i, c in enumerate(chunk) if c in "，, " and i <= mid), default=mid)
            a, ra = speak(chunk[: cut + 1])
            b, _ = speak(chunk[cut + 1 :])
            return np.concatenate([a, b]), ra

    for p in parts:
        samples, rate = speak(p.strip())
        audio.append(samples)
    data = np.concatenate(audio) if audio else np.zeros(1)
    sf.write(out, data, rate)
    print(json.dumps({"ok": True, "seconds": round(len(data) / rate, 3), "rate": rate}))
    return 0


if __name__ == "__main__":
    sys.exit(main())
