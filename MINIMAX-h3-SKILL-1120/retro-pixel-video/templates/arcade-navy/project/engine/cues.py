"""唯一时间来源：cues.json。

渲染代码里不出现任何落点帧号——所有时间都通过本模块按 event id / shot id 查询：
  C.ev("s3-c121")         -> 事件 dict（frame / duration_frames / ...）
  C.t(f, "s3-c121")       -> 相对事件起点的帧数（可为负）
  C.p(f, "s3-c121", frac) -> 0..1 进度，跨度 = duration_frames × frac（默认整个事件）
  C.on(f, "s3-c121")      -> f >= 事件起点
  C.shot_at(f)            -> 当前镜 dict
  C.subtitle_at(f)        -> 当前字幕事件（带 subtitle 字段且 frame <= f < frame+duration）
  C.palette_state(f, default) -> 当前色板映射 / 过渡状态 / 光源描述
场景代码中只允许出现「事件内部的动画时长常量」（例如落币下落 6 帧），且一律相对事件起点。
"""
import json, math, os


class Cues:
    def __init__(self, path, offset=0):
        with open(path, encoding="utf-8") as f:
            d = json.load(f)
        self.path = path
        self.fps = d["fps"]
        self.offset = offset  # 仅用于自检：整体平移事件表，验证画面随表移动
        self.duration = d["duration_frames"] + offset
        self.logical = tuple(d["canvas"]["logical"])
        self.scale = d["canvas"]["scale"]
        self.shots = []
        for s in d["shots"]:
            s = dict(s); s["start"] += offset; s["end"] += offset
            self.shots.append(s)
        self.events = []
        self._ev = {}
        for e in d["events"]:
            e = dict(e); e["frame"] += offset
            self.events.append(e)
            self._ev[e["id"]] = e
        self.raw = d

    # ---- 事件查询 ----
    def ev(self, eid):
        return self._ev[eid]

    def start(self, eid):
        return self._ev[eid]["frame"]

    def dur(self, eid):
        return self._ev[eid]["duration_frames"]

    def end(self, eid):
        e = self._ev[eid]
        return e["frame"] + e["duration_frames"]

    def t(self, f, eid):
        return f - self._ev[eid]["frame"]

    def on(self, f, eid):
        return f >= self._ev[eid]["frame"]

    def active(self, f, eid):
        e = self._ev[eid]
        return e["frame"] <= f < e["frame"] + e["duration_frames"]

    def p(self, f, eid, frac=1.0, span=None):
        e = self._ev[eid]
        L = span if span is not None else max(1, e["duration_frames"] * frac)
        return max(0.0, min(1.0, (f - e["frame"]) / L))

    # ---- 镜头 ----
    def shot_at(self, f):
        for s in self.shots:
            if s["start"] <= f < s["end"]:
                return s
        return self.shots[-1] if f >= self.shots[-1]["start"] else self.shots[0]

    def shot(self, sid):
        for s in self.shots:
            if s["id"] == sid:
                return s
        raise KeyError(sid)

    def shot_events(self, sid):
        return [e for e in self.events if e["shot_id"] == sid]

    # ---- 字幕 ----
    def subtitle_at(self, f):
        cur = None
        for e in self.events:
            if "subtitle" in e and e["frame"] <= f < e["frame"] + e["duration_frames"]:
                cur = e
        return cur

    # ---- 色板 ----
    def palette_state(self, f, default):
        """返回 dict(src, dst, k, steps, light)：
        镜内最近一次 frame<=f 的 palette 事件决定 dst；src 为它之前的状态（镜内上一个事件或镜默认）。
        过渡期内 k/steps 为当前完成的步数（一拍二：steps 缺省 = ceil(T/2)）。"""
        sh = self.shot_at(f)
        evs = [e for e in self.events if e["shot_id"] == sh["id"] and "palette" in e and e["frame"] <= f]
        if not evs:
            return {"src": default, "dst": default, "k": 1, "steps": 1, "light": None, "event": None}
        e = evs[-1]
        src = evs[-2]["palette"]["to"] if len(evs) > 1 else default
        pe = e["palette"]
        T = pe.get("transition_frames", 0)
        if T <= 0:
            return {"src": src, "dst": pe["to"], "k": 1, "steps": 1, "light": pe.get("light"), "event": e["id"]}
        steps = pe.get("steps", int(math.ceil(T / 2)))
        k = min(steps, int((f - e["frame"]) * steps // T) + 1)
        return {"src": src, "dst": pe["to"], "k": k, "steps": steps, "light": pe.get("light"), "event": e["id"]}


def default_cues(offset=0):
    here = os.path.dirname(os.path.abspath(__file__))
    return Cues(os.path.normpath(os.path.join(here, "..", "..", "cues.json")), offset=offset)
