#!/usr/bin/env python3
"""
beat_detect.py — librosa-based beat detection for beat-sync-editor skill

Usage:
    python beat_detect.py <audio_file> [options]

Options:
    --mode          Detection mode: "beat" (default) | "onset" | "segment"
    --every-n       Only emit every N-th beat (default: 1)
    --manual        Comma-separated additional timestamps in seconds to merge in
    --min-gap       Minimum gap between beats in seconds (default: 0.25)
    --out           Output format: "json" (default) | "text"

Output (JSON):
    {
      "bpm": 128.0,
      "total_duration": 210.5,
      "beat_count": 512,
      "beat_times": [0.46, 0.93, 1.40, ...],   # seconds
      "sections": [                               # only in "segment" mode
        {"label": "intro", "start": 0.0, "end": 32.0, "beats": [...]},
        {"label": "chorus", "start": 32.0, "end": 96.0, "beats": [...]}
      ]
    }
"""

import sys
import json
import argparse


def detect_beats(audio_path, mode="beat", every_n=1,
                 manual_times=None, min_gap=0.25):
    try:
        import librosa
        import numpy as np
    except ImportError:
        print("ERROR: librosa not installed. Run: pip install librosa", file=sys.stderr)
        sys.exit(1)

    y, sr = librosa.load(audio_path, mono=True)
    total_duration = librosa.get_duration(y=y, sr=sr)

    if mode == "onset":
        # Onset detection — more sensitive to transients, great for percussion
        onset_frames = librosa.onset.onset_detect(y=y, sr=sr, units="frames")
        beat_times = librosa.frames_to_time(onset_frames, sr=sr).tolist()
        tempo = float(librosa.beat.tempo(y=y, sr=sr)[0])
    elif mode == "segment":
        # Structural segmentation via novelty curve + beat tracking
        tempo, beat_frames = librosa.beat.beat_track(y=y, sr=sr)
        beat_times = librosa.frames_to_time(beat_frames, sr=sr).tolist()
        tempo = float(tempo)
        # Segment using spectral flux novelty
        try:
            chroma = librosa.feature.chroma_cqt(y=y, sr=sr)
            bounds = librosa.segment.agglomerative(chroma, k=8)
            bound_times = librosa.frames_to_time(bounds, sr=sr).tolist()
        except Exception:
            bound_times = [total_duration * 0.15, total_duration * 0.5]
    else:
        # Default: standard beat tracking
        tempo, beat_frames = librosa.beat.beat_track(y=y, sr=sr)
        beat_times = librosa.frames_to_time(beat_frames, sr=sr).tolist()
        tempo = float(np.asarray(tempo).flat[0])

    # Apply every-N filter
    if every_n > 1:
        beat_times = beat_times[::every_n]

    # Merge manual timestamps
    if manual_times:
        beat_times = sorted(set(beat_times) | set(manual_times))

    # Enforce minimum gap between beats
    if min_gap > 0:
        filtered = []
        last = -999.0
        for t in sorted(beat_times):
            if t - last >= min_gap:
                filtered.append(round(t, 4))
                last = t
        beat_times = filtered

    result = {
        "bpm": round(tempo, 2),
        "total_duration": round(total_duration, 4),
        "beat_count": len(beat_times),
        "beat_times": [round(t, 4) for t in beat_times],
    }

    if mode == "segment":
        sections = []
        boundaries = [0.0] + bound_times + [total_duration]
        labels = ["intro"] + [f"section_{i}" for i in range(1, len(boundaries) - 2)] + ["outro"]
        for i in range(len(boundaries) - 1):
            s, e = boundaries[i], boundaries[i + 1]
            section_beats = [t for t in beat_times if s <= t < e]
            sections.append({
                "label": labels[i] if i < len(labels) else f"section_{i}",
                "start": round(s, 4),
                "end": round(e, 4),
                "beats": section_beats
            })
        result["sections"] = sections

    return result


def main():
    parser = argparse.ArgumentParser(description="Beat detection for beat-sync-editor")
    parser.add_argument("audio_file", help="Path to audio file")
    parser.add_argument("--mode", choices=["beat", "onset", "segment"], default="beat")
    parser.add_argument("--every-n", type=int, default=1, dest="every_n")
    parser.add_argument("--manual", type=str, default="", help="Comma-separated extra timestamps")
    parser.add_argument("--min-gap", type=float, default=0.25, dest="min_gap")
    parser.add_argument("--out", choices=["json", "text"], default="json")
    args = parser.parse_args()

    manual_times = []
    if args.manual:
        try:
            manual_times = [float(x.strip()) for x in args.manual.split(",") if x.strip()]
        except ValueError:
            print("ERROR: --manual must be comma-separated numbers (e.g. '8.5,32.0')", file=sys.stderr)
            sys.exit(1)

    result = detect_beats(
        audio_path=args.audio_file,
        mode=args.mode,
        every_n=args.every_n,
        manual_times=manual_times,
        min_gap=args.min_gap,
    )

    if args.out == "text":
        print(f"BPM: {result['bpm']}")
        print(f"Duration: {result['total_duration']}s")
        print(f"Beat count: {result['beat_count']}")
        print("Beat times (s):", " ".join(str(t) for t in result["beat_times"]))
    else:
        print(json.dumps(result, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
