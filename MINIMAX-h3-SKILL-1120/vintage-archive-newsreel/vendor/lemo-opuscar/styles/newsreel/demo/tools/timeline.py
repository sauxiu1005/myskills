#!/usr/bin/env python3
"""Writes timeline.json: the one clock for page, score, foley, voice and subtitles.
Everything is in bars of the 200 BPM grid (1 beat = 0.3 s, 1 bar = 1.2 s) except the voice
starts, which sit just after the cut they belong to.
    python3 tools/timeline.py
"""
import json
from pathlib import Path

HERE = Path(__file__).resolve().parent.parent
BPM = 200
BEAT = 60 / BPM
BAR = 4 * BEAT
b = lambda bars: round(bars * BAR, 4)
REC = -0.12   # the 1925 record's beat sits 0.12 s ahead of the film grid (its final chord is held back); cuts inside the record follow the record

# section id -> (start bar, end bar)
SECS = [
    ("logo", 0, 3), ("paper", 3, 7), ("map", 7, 11), ("grid", 11, 13.25), ("flip", 13.25, 15),
    ("card", 15, 17.5), ("orch", 17.5, 18.5), ("violin", 18.5, 19), ("oldman", 19, 20),
    ("book", 20, 22.5), ("circle", 22.5, 23.5), ("split", 23.5, 27),
    ("pav", 27, 29), ("pav2", 29, 30), ("tap", 30, 31), ("solo", 31, 32), ("tap2", 32, 33),
    ("quad", 33, 35), ("kids", 35, 37),
    ("button", 37, 39), ("endlogo", 39, 42), ("endcard", 42, 45.5),
]
HITS = {
    "beams_on": 0.15, "logo_iris": b(2.5),
    "paper_fly": b(3), "paper_slam": b(4), "paper_punch": b(6), "knee_ring": b(6) + .3,
    "wipe_map": b(7), "ny": b(7) + .15, "line_hollywood": 10.2, "line_austin": 10.55,
    "map_push": 12.7, "flip_grid": b(11), "grid0": b(11), "flipbook": b(13.25),
    "blinds_card": b(15), "stop_card": b(15), "iris_orch": b(17.5),
    "cut_violin": b(18.5), "cut_oldman": b(19), "book_slam": b(20), "page_turn": b(20.5),
    "ul_jazz": 25.87, "ul_vogue": 26.9, "cut_circle": b(22.5),
    "split_in": b(23.5), "needle": b(27), "push_over": b(27),
    "cut_pav2": b(29) + REC, "cut_tap": b(30) + REC, "cut_solo": b(31) + REC, "cut_tap2": b(32) + REC,
    "quad": b(33) + REC, "clock_kids": b(35) + REC,
    "rec_end": b(37), "freeze": b(37), "iris_end": b(39), "end_hit1": b(39), "end_hit2": b(39) + 1.5 * BEAT,
    "endcard": b(42),
}
LINES = [("L1", 4.95), ("L2", 8.7), ("L3", 13.5), ("L4", 18.05), ("L5", 21.45), ("L6", 25.03),
         ("L7", 28.87), ("L8", 42.15), ("L9", 44.95), ("L10", 47.35)]
# lower-third tags: id, t0, t1, en, zh
TAGS = [
    ("paper", 5.0, 8.3, "AUSTIN · MARCH 5, 1926", "奥斯汀的报纸"),
    ("grid", 13.4, 17.85, "PHOTOPLAY · OCT. 1925", "好莱坞影迷杂志"),
    ("ford", 21.02, 24.02, "FORD FILMS 1925–26", "福特影片"),
    ("book", 24.05, 27.1, "GOOD MORNING · 1926", "福特出的书"),
    ("picnic", 32.6, 36.2, "FORD WORKERS’ PICNIC · 1924", "福特员工野餐会"),
]
# archive clips: source, start (s in the transfer), length (s)
CLIPS = {
    "orch":    {"src": "ford_orchestra.mp4", "ss": 7.2, "dur": 1.7},
    "violin":  {"src": "ford_orchestra.mp4", "ss": 27.4, "dur": 1.0, "lo": 1.5, "hi": 99.7, "gamma": .85},
    "oldman":  {"src": "ford_mandancing.mp4", "ss": 35.0, "dur": 1.7, "lo": 1.0, "hi": 99.8, "gamma": .8},
    "circle":  {"src": "ford_botsford.mp4", "ss": 160.0, "dur": 6.0},
    "kidsR":   {"src": "ford1924.mp4", "ss": 259.0, "dur": 4.6},
    "pav":     {"src": "ford1924.mp4", "ss": 44.0, "dur": 2.8},
    "tap":     {"src": "ford1924.mp4", "ss": 216.8, "dur": 1.6},
    "solo":    {"src": "ford1924.mp4", "ss": 224.0, "dur": 1.6},
    "pav2":    {"src": "ford1924.mp4", "ss": 49.6, "dur": 1.6},
    "tap2":    {"src": "ford1924.mp4", "ss": 220.4, "dur": 1.6},
    "g1":      {"src": "ford1924.mp4", "ss": 38.6, "dur": 2.8},
    "g2":      {"src": "ford1924.mp4", "ss": 48.0, "dur": 2.8},
    "g3":      {"src": "ford1924.mp4", "ss": 229.5, "dur": 2.8},
    "g4":      {"src": "ford1924.mp4", "ss": 234.0, "dur": 2.8},
    "kids":    {"src": "ford1924.mp4", "ss": 255.6, "dur": 2.9},
}
# the record: its final chord (src_end, s in the UCSB transfer) lands on the freeze
RECORD = {"src_end": 245.95, "src_t0": 233.4, "src_bpm": 197.9, "film_end": b(37)}

secs = [{"id": i, "t0": b(a), "t1": b(z), "bar0": a} for i, a, z in SECS]
ON_RECORD = {"pav2", "tap", "solo", "tap2", "quad", "kids"}          # cuts that follow the record's own beat
for k, s_ in enumerate(secs):
    if s_["id"] in ON_RECORD:
        s_["t0"] = round(s_["t0"] + REC, 4); secs[k - 1]["t1"] = s_["t0"]
lines = json.loads((HERE / "voice" / "lines.json").read_text())
meta = {L["id"]: L for L in lines}
tl = {
    "bpm": BPM, "beat": BEAT, "bar": BAR, "dur": b(45.5), "secs": secs, "hits": HITS,
    "lines": [{"id": i, "t": t, "zh": meta[i]["zh"], "en": meta[i]["en"]} for i, t in LINES],
    "tags": [{"sec": s, "t0": a, "t1": z, "en": en, "zh": zh} for s, a, z, en, zh in TAGS],
    "clips": CLIPS, "record": RECORD,
}
(HERE / "timeline.json").write_text(json.dumps(tl, ensure_ascii=False, indent=1))
print("timeline.json", tl["dur"], "s")
