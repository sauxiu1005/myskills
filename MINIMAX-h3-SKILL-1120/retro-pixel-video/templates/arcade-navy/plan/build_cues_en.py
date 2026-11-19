#!/usr/bin/env python3
"""英文 30 秒版事件表：由实测旁白生成唯一 cues.json（严格 720 帧）。渲染、字幕、混音只读本表。"""
import json, math
fps, SR, TOTAL = 24, 48000, 720
TXT = dict(l.split('\t', 1) for l in open('plan/lines_en.tsv').read().strip().split('\n'))
SMP = {a: int(b) for a, b in (l.split() for l in open('plan/samples.txt'))}
vf = lambda i: math.ceil(SMP[i] * fps / SR)
# 句内短语起点（秒）：e4/e6/e7 为 silencedetect(n=-38dB,d=0.06) 实测；e1/e2/e3/e5 句内无停顿，按词位置估计（planned）
PH = {'e1': [0, 1.85], 'e2': [0, 1.35], 'e3': [0, 1.40, 2.30], 'e4': [0, 0.931, 2.233],
      'e5': [0, 0.85], 'e6': [0, 1.471], 'e7': [0, 1.094, 1.937, 2.605]}
# (镜号=沿用中文版场景模块编号, 景别, 旁白行, 前导, 句间, 尾停)
SHOTS = [(1, 'Rooftop at dawn', ['e1'], 8, 0, 22), (2, 'Snow slope, two tracks', ['e2'], 6, 0, 30),
         (3, 'Desk top-down, two jars', ['e3', 'e4'], 6, 6, 22), (4, 'Zoom on the extra coin', ['e5'], 6, 0, 26),
         (5, 'Night desk, lamp light', ['e6'], 8, 0, 20), (7, 'Morning room, bookshelf & calendar', ['e7'], 6, 0, None)]
shots, ev, at_ = [], [], {}
t = 0
for sid, view, ls, lead, gap, tail in SHOTS:
    st = t; t += lead
    for k, i in enumerate(ls):
        if k: t += gap
        at_[i] = t; t += vf(i)
    t = TOTAL if tail is None else t + tail
    shots.append(dict(id=sid, start=st, end=t, view=view, lines=ls))
assert t == TOTAL and shots[-1]['end'] - at_['e7'] - vf('e7') >= 24, shots
S = {s['id']: s for s in shots}
at = lambda i, k: at_[i] + round(PH[i][k] * fps)
def E(id, sid, frame, dur, trig, vis, **kw):
    ev.append(dict(id=id, shot_id=sid, frame=frame, duration_frames=max(1, dur), semantic_trigger=trig, visual=vis, **kw))
for i in TXT:
    sid = next(s['id'] for s in shots if i in s['lines'])
    kw = {} if i == 'e7' else {'subtitle': {'text': TXT[i].replace('one hundred twenty-one', '121').replace('one hundred ten', '110')
                                             .replace('one hundred', '100').replace('ten percent', '10%').replace('extra one', 'extra 1')}}
    E(f'{i}-vo', sid, at_[i], vf(i), TXT[i], 'narration placed here; subtitle layer shows this line',
      narration={'file': f'audio/vo_{i}.wav', 'samples': SMP[i], 'gain_db': 0}, **kw)
E('e7-sub1', 7, at('e7', 0), at('e7', 1) - at('e7', 0), 'Pick one skill.', 'subtitle', subtitle={'text': 'Pick one skill.'})
E('e7-sub2', 7, at('e7', 1), at_['e7'] + vf('e7') - at('e7', 1), 'Practice, review...', 'subtitle',
  subtitle={'text': 'Practice, review, and let each session build on the last.'})
U = lambda a, b: b - a
# S1 rooftop
E('s1-open', 1, 0, 8, 'open', 'Dawn rooftop wide; Zhou sits on the ledge; unlit street lamps on the horizon',
  palette={'to': '黎明', 'transition_frames': 0}, music={'action': 'start', 'style': 'chiptune', 'bpm': 112, 'gain_db': -20})
E('s1-wallet', 1, at('e1', 0) + 10, 22, 'biggest advantage', 'Mid shot: wallet opens, a single coin drops into the palm', sfx={'name': 'coin', 'gain_db': -12})
E('s1-time', 1, at('e1', 1), U(at('e1', 1), S[1]['end']), 'is time', 'Zhou raises an hourglass; first street lamp lights up',
  sfx={'name': 'hourglass', 'gain_db': -10}, palette={'to': '黎明-路灯', 'transition_frames': 6, 'light': 'lamp 1 mask'})
# S2 snowball
E('s2-bricks', 2, S[2]['start'], at('e2', 0) - S[2]['start'] + 14, 'same amount', 'Top track: equal +10 bricks', sfx={'name': 'bricks', 'gain_db': -14})
E('s2-snowball', 2, at('e2', 0) + 14, at('e2', 1) - at('e2', 0) - 14, 'Compounding', 'Bottom track: snowball rolls, layered core visible')
E('s2-wrap', 2, at('e2', 1), U(at('e2', 1), S[2]['end']), 'gains earning gains', 'New snow layer wraps the whole ball incl. last round',
  sfx={'name': 'snow', 'gain_db': -10})
# S3 jars (both jars count in parallel; numbers computed 100*1.1^n vs 100+10n)
E('s3-card1', 3, at('e3', 0), 8, 'Imagine one hundred units', 'Card: Hypothetical example: 100 units; footer: Not a promised return')
E('s3-card2', 3, at('e3', 1), 8, 'ten percent per round', 'Card: +10% per round')
E('s3-card3', 3, at('e3', 2), 8, '(card)', 'Card: No added contributions')
E('s3-simple', 3, at_['e4'] - 6, 6, '(left jar)', 'Left jar label Simple')
E('s3-compound', 3, at('e4', 0), 8, '(right jar)', 'Right jar label Compound highlighted')
E('s3-s100', 3, at('e4', 0), 8, 'one hundred', 'Left counter 100')
E('s3-c100', 3, at('e4', 0), 8, 'one hundred', 'Right counter 100')
E('s3-s110', 3, at('e4', 1), 12, 'one hundred ten', '10 coins to the tray outside the left jar: 110', sfx={'name': 'coins-tray', 'gain_db': -14})
E('s3-c110', 3, at('e4', 1), 12, 'one hundred ten', '10 coins into the right jar: 110', sfx={'name': 'coins-jar', 'gain_db': -12})
E('s3-s120', 3, at('e4', 2), 12, 'then', 'Left: 10 more to the tray: 120 (interest on 100 only)', sfx={'name': 'coins-tray', 'gain_db': -14})
E('s3-c121', 3, at('e4', 2), U(at('e4', 2), S[3]['end']), 'one hundred twenty-one', 'Right: 11 coins, the 11th glows; 121; Zhou\'s hand stops mid-air',
  sfx={'name': 'coins-jar-glow', 'gain_db': -8})
# S4 zoom (10-round chart not used in the 30 s cut: its events sit after the end and never trigger)
E('s4-zoom', 4, at('e5', 0), at('e5', 1) - at('e5', 0), 'That extra one', 'Zoom box opens from the glowing coin: The extra 1')
E('s4-interest', 4, at('e5', 1), U(at('e5', 1), S[4]['end']), 'earlier gains', 'Each of round 1\'s 10 gain coins gives 10%, merging into the 1: 10 × 10% = 1',
  sfx={'name': 'chimes', 'gain_db': -12})
E('s4-rounds', 4, TOTAL + 100, 40, '(unused)', 'not shown in this cut')
E('s4-gap', 4, TOTAL + 140, 20, '(unused)', 'not shown in this cut')
# S5 night desk
E('s5-lamp', 5, S[5]['start'], 6, 'lamp', 'Desk lamp on; local relight', palette={'to': '夜-台灯', 'transition_frames': 6, 'light': 'lamp mask'})
E('s5-skill', 5, at('e6', 0), 12, 'Learning', 'Zhou plays a chord on the guitar')
E('s5-habit', 5, at('e6', 0) + 12, at('e6', 1) - at('e6', 0) - 12, 'works similarly', 'Wall calendar ticks day by day')
E('s5-analogy', 5, at('e6', 1), 10, 'but', 'Sticky note stamped Analogy', sfx={'name': 'stamp', 'gain_db': -10})
E('s5-curve', 5, at('e6', 1) + 10, U(at('e6', 1) + 10, S[5]['end']), 'not at a fixed rate', 'Whiteboard: straight Fixed % line crossed out → stepped real curve with plateaus & dips')
# S7 action
E('s7-shelf', 7, S[7]['start'], at('e7', 0) - S[7]['start'] + 6, 'room', 'Morning room; guitar, laptop, sketchbook, sneakers on the shelf', palette={'to': '清晨', 'transition_frames': 0})
E('s7-pick', 7, at('e7', 0) + 6, at('e7', 1) - at('e7', 0) - 6, 'Pick one skill', 'Zhou takes only the guitar: Pick one', sfx={'name': 'pick', 'gain_db': -12})
E('s7-weekly', 7, at('e7', 1), at('e7', 2) - at('e7', 1), 'Practice', 'Calendar lights one square per week: 1× a week')
E('s7-review', 7, at('e7', 2), U(at('e7', 2), S[7]['end']), 'review', 'Check mark; loop Practice → Review → Next', sfx={'name': 'tick', 'gain_db': -10})
E('music-end', 7, TOTAL - 48, 48, 'ending', 'music resolves on the tonic and decays to silence', music={'action': 'end', 'fade_frames': 48})
ev.sort(key=lambda e: (e['frame'], e['id']))
CAST = {'lead': {'name': '复利示例青年', 'kind': 'legacy_zhou', 'note': '仅示例片使用；新主题在 characters/ 下手画角色并改这里'}}
cues = {'cast': CAST, 'schema': 'retro-pixel-cues/1', 'title': 'Compounding for the Young (EN 30 s)', 'language': 'en', 'fps': fps, 'duration_frames': TOTAL,
        'timing_status': 'measured',
        'audio': {'sample_rate': SR, 'trim_start_samples': 0, 'offset_frames': 0,
                  'measured_by': 'macOS say -v Samantha -r 175 per line, leading/trailing silence trimmed, sample counts measured; '
                                 'phrase onsets for e4/e6/e7 measured with silencedetect(n=-38dB,d=0.06); e1/e2/e3/e5 in-line onsets estimated by word position'},
        'canvas': {'logical': [640, 360], 'scale': 3, 'output': [1920, 1080]},
        'shots': [{k: s[k] for k in ('id', 'start', 'end', 'view')} for s in shots], 'events': ev, 'sync_report': [],
        'keyframe_events': ['s1-time', 's2-wrap', 's3-c121', 's4-interest', 's5-curve', 's7-review'],
        'note': 'frame→sample: sample = frame × 2000. Shot ids reuse the scene modules of the 48.8 s Chinese cut (1,2,3,4,5,7). Palette keys are internal state names.'}
json.dump(cues, open('cues.json', 'w'), ensure_ascii=False, indent=1)
print('total', TOTAL, 'events', len(ev))
for s in shots: print(s['id'], s['start'], s['end'], s['end'] - s['start'], s['view'])
