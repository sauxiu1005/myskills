#!/usr/bin/env python3
"""校验 retro-pixel-video 的事件表 cues.json（仅用 Python 标准库）。

规则见 references/cue-sheet-and-audio.md：
- fps 为正整数或有理数（"24000/1001" 或 {"num":..,"den":..}）；duration_frames 正整数
- shots 按顺序连续覆盖 [0, duration_frames)，区间 [start, end)
- 事件 id 唯一、shot_id 存在、frame/duration_frames 为整数、事件区间落在所属镜头内
- timing_status 只能是 planned / measured；audio 为空时不得标 measured
- sync_report 中 measured 条目需 timing_status=measured 且有实测数值；瞬态误差 >1 帧给 WARN
- 可选 --storyboard：与分镜 JSON 的 fps、总帧数、各镜帧数逐一比对
退出码：0 通过（可含 WARN），1 有错误，2 参数/文件错误。
"""
import argparse
import json
import sys
from fractions import Fraction
from pathlib import Path


def is_int(v):
    return isinstance(v, int) and not isinstance(v, bool)


def parse_fps(v):
    if is_int(v) and v > 0:
        return Fraction(v)
    if isinstance(v, str) and "/" in v:
        a, b = v.split("/", 1)
        if a.strip().isdigit() and b.strip().isdigit() and int(b) > 0 and int(a) > 0:
            return Fraction(int(a), int(b))
    if isinstance(v, dict) and is_int(v.get("num")) and is_int(v.get("den")) and v["num"] > 0 and v["den"] > 0:
        return Fraction(v["num"], v["den"])
    return None


def round_half_up(x: Fraction) -> int:
    return int((x + Fraction(1, 2)) // 1)


def frame_to_sample(frame, fps, sample_rate, trim=0, offset_frames=0):
    """视频帧 → 音频文件内的采样索引（有理数计算，半数向上取整）。"""
    return round_half_up(Fraction(frame - offset_frames) * sample_rate / fps) + trim


def check(path, storyboard=None, sample_rate=None):
    errs, warns = [], []
    try:
        d = json.loads(Path(path).read_text(encoding="utf-8"))
    except Exception as e:  # noqa: BLE001
        return [f"无法读取 JSON：{e}"], [], None

    fps = parse_fps(d.get("fps"))
    if fps is None:
        errs.append(f"fps 无效：{d.get('fps')!r}（需正整数或有理数，如 \"24000/1001\"；不接受小数近似）")
    total = d.get("duration_frames")
    if not (is_int(total) and total > 0):
        errs.append(f"duration_frames 必须是正整数：{total!r}")
        total = None

    status = d.get("timing_status")
    audio = d.get("audio")
    if status not in ("planned", "measured"):
        errs.append(f"timing_status 必须是 planned 或 measured：{status!r}")
    if status == "measured":
        if not audio:
            errs.append("audio 为空却标记 timing_status=measured（没有音频不能声称已实测同步）")
        else:
            for k in ("path", "sample_rate"):
                if not audio.get(k):
                    errs.append(f"measured 需要 audio.{k}")
    if audio:
        sr = audio.get("sample_rate")
        if sr is not None and not (is_int(sr) and sr > 0):
            errs.append(f"audio.sample_rate 必须是正整数：{sr!r}")
        for k in ("trim_start_samples", "offset_frames"):
            if k not in audio:
                warns.append(f"audio.{k} 未写明（裁切/偏移不明会导致整体错位）")
            elif not is_int(audio[k]):
                errs.append(f"audio.{k} 必须是整数：{audio[k]!r}")

    # shots
    shots = {}
    prev_end = 0
    for i, s in enumerate(d.get("shots") or []):
        sid, a, b = s.get("id"), s.get("start"), s.get("end")
        if sid in shots:
            errs.append(f"镜头 id 重复：{sid!r}")
        if not (is_int(a) and is_int(b) and a < b):
            errs.append(f"镜头 {sid!r} 区间非法：[{a!r}, {b!r})")
            continue
        if a != prev_end:
            errs.append(f"镜头 {sid!r} 起点 {a} 与上一镜终点 {prev_end} 不连续")
        prev_end = b
        shots[sid] = (a, b)
    if not shots:
        errs.append("shots 为空")
    elif total is not None and prev_end != total:
        errs.append(f"镜头终点 {prev_end} ≠ duration_frames {total}")

    # events
    ids = set()
    subs = []
    for i, ev in enumerate(d.get("events") or []):
        eid = ev.get("id")
        tag = f"事件[{i}] {eid!r}"
        if not isinstance(eid, str) or not eid:
            errs.append(f"{tag}：缺少字符串 id")
        elif eid in ids:
            errs.append(f"{tag}：id 重复")
        ids.add(eid)
        f = ev.get("frame")
        dur = ev.get("duration_frames", 1)
        if not is_int(f):
            errs.append(f"{tag}：frame 必须是整数帧（不接受秒或小数）：{f!r}")
            continue
        if not (is_int(dur) and dur > 0):
            errs.append(f"{tag}：duration_frames 必须是正整数：{dur!r}")
            continue
        if total is not None and not (0 <= f and f + dur <= total):
            errs.append(f"{tag}：区间 [{f}, {f + dur}) 越出全片 [0, {total})")
        sid = ev.get("shot_id")
        if sid not in shots:
            errs.append(f"{tag}：shot_id {sid!r} 不存在")
        else:
            a, b = shots[sid]
            if not (a <= f and f + dur <= b):
                errs.append(f"{tag}：区间 [{f}, {f + dur}) 不在所属镜头 {sid} [{a}, {b}) 内")
        for k in ("semantic_trigger", "visual"):
            if not isinstance(ev.get(k), str) or not ev.get(k).strip():
                errs.append(f"{tag}：缺少 {k}")
        sub = ev.get("subtitle")
        if sub is not None:
            if not isinstance(sub, dict) or not str(sub.get("text", "")).strip():
                errs.append(f"{tag}：subtitle 需要非空 text")
            else:
                subs.append((f, f + dur, eid))
        pal = ev.get("palette")
        if pal is not None:
            if not isinstance(pal, dict) or not pal.get("to"):
                errs.append(f"{tag}：palette 需要 to")
            elif "transition_frames" in pal and not (is_int(pal["transition_frames"]) and pal["transition_frames"] >= 0):
                errs.append(f"{tag}：palette.transition_frames 必须是非负整数")
        sfx = ev.get("sfx")
        if sfx is not None and (not isinstance(sfx, dict) or not sfx.get("name")):
            errs.append(f"{tag}：sfx 需要 name")
    subs.sort()
    for (a1, b1, e1), (a2, b2, e2) in zip(subs, subs[1:]):
        if a2 < b1:
            warns.append(f"字幕重叠：{e1} [{a1},{b1}) 与 {e2} [{a2},{b2})")

    # sync report
    measured_n = 0
    for r in d.get("sync_report") or []:
        eid = r.get("event_id")
        if eid not in ids:
            errs.append(f"sync_report：事件 {eid!r} 不存在")
        st = r.get("status")
        if st == "measured":
            measured_n += 1
            if status != "measured" or not audio:
                errs.append(f"sync_report {eid!r} 标 measured，但事件表不是实测状态或没有音频")
            for k in ("target_frame", "video_frame_measured", "audio_onset_sample", "error_frames"):
                if r.get(k) is None:
                    errs.append(f"sync_report {eid!r} 标 measured 但缺少 {k}")
            ef = r.get("error_frames")
            if isinstance(ef, (int, float)) and abs(ef) > 1:
                warns.append(f"sync_report {eid!r} 误差 {ef} 帧 > 1 帧（瞬态建议 ≤1 帧）")
        elif st != "not_measured":
            errs.append(f"sync_report {eid!r} status 必须是 measured / not_measured：{st!r}")

    # storyboard cross-check
    if storyboard:
        try:
            sb = json.loads(Path(storyboard).read_text(encoding="utf-8"))
            if parse_fps(sb.get("fps")) != fps:
                errs.append(f"与分镜 fps 不一致：{sb.get('fps')} vs {d.get('fps')}")
            if sb.get("total_frames") != total:
                errs.append(f"与分镜总帧数不一致：{sb.get('total_frames')} vs {total}")
            pos = 0
            for s in sb.get("shots", []):
                sid = s.get("id")
                exp = (pos, pos + s.get("frames", 0))
                pos = exp[1]
                if shots.get(sid) != exp:
                    errs.append(f"镜头 {sid} 与分镜不一致：事件表 {shots.get(sid)} vs 分镜 {exp}")
            if len(sb.get("shots", [])) != len(shots):
                errs.append(f"镜头数量不一致：分镜 {len(sb.get('shots', []))} vs 事件表 {len(shots)}")
        except Exception as e:  # noqa: BLE001
            errs.append(f"无法读取分镜：{e}")

    info = dict(fps=fps, total=total, status=status, audio=audio, n_events=len(ids),
                n_shots=len(shots), measured_n=measured_n, events=d.get("events") or [])
    if sample_rate and fps and not errs:
        info["samples"] = [(e["id"], e["frame"], frame_to_sample(
            e["frame"], fps, sample_rate,
            (audio or {}).get("trim_start_samples", 0), (audio or {}).get("offset_frames", 0)))
            for e in info["events"]]
    return errs, warns, info


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("cues", nargs="+", help="cues.json 路径（可多个）")
    ap.add_argument("--storyboard", help="与之比对的分镜 JSON（仅单个 cues 时使用）")
    ap.add_argument("--sample-rate", type=int, help="打印各事件对应的音频采样索引（如 48000）")
    a = ap.parse_args()
    if a.storyboard and len(a.cues) > 1:
        ap.error("--storyboard 只能配合单个 cues 文件")
    bad = 0
    for p in a.cues:
        if not Path(p).is_file():
            print(f"文件不存在：{p}", file=sys.stderr)
            sys.exit(2)
        errs, warns, info = check(p, a.storyboard, a.sample_rate)
        print(f"== {p}")
        if info:
            print(f"   fps={info['fps']}  total={info['total']} 帧  镜头 {info['n_shots']}  事件 {info['n_events']}  timing_status={info['status']}")
            if "samples" in info:
                for eid, f, s in info["samples"]:
                    print(f"     {eid:<16} frame {f:>5} → sample {s}")
        for w in warns:
            print(f"   [WARN] {w}")
        for e in errs:
            print(f"   [FAIL] {e}")
        if info and not errs:
            if info["status"] != "measured" or info["measured_n"] == 0:
                print("   提示：声画同步未实测（时间为拟定或无实测条目），不得声称已同步。")
        print(f"   结论: {'FAIL' if errs else 'PASS'}")
        bad += bool(errs)
    print(f"\n总计 {len(a.cues)} 个文件: {len(a.cues) - bad} PASS, {bad} FAIL")
    sys.exit(1 if bad else 0)


if __name__ == "__main__":
    main()
