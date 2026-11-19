#!/usr/bin/env python3
"""Validate a shared animation timeline and compile time/coordinate metadata.

Standard library only. Does not render, model, or synthesize audio.
"""
import argparse
import hashlib
import json
import math
from pathlib import Path


def require(condition, message):
    if not condition:
        raise ValueError(message)


def number(value, label, positive=False):
    require(isinstance(value, (int, float)) and not isinstance(value, bool)
            and math.isfinite(value), f"{label}: expected finite number")
    if positive:
        require(value > 0, f"{label}: must be positive")
    return value


def vector(value, size, label):
    require(isinstance(value, list) and len(value) == size,
            f"{label}: expected {size} numbers")
    return [number(v, label) for v in value]


def compile_timeline(data):
    require(isinstance(data, dict), "timeline must be an object")
    fmt = data.get("format", {})
    require(isinstance(fmt, dict), "format must be an object")
    fps = fmt.get("fps")
    require(type(fps) is int and fps > 0, "fps must be a positive integer")
    duration = number(fmt.get("duration_s"), "duration_s", True)
    count = duration * fps
    require(math.isclose(count, round(count), abs_tol=1e-7, rel_tol=0),
            "duration_s * fps must be an integer")
    count = round(count)
    require(count > 0, "timeline requires at least one frame")
    sample_rate = fmt.get("sample_rate", 48000)
    require(type(sample_rate) is int and sample_rate > 0,
            "sample_rate must be a positive integer")
    layout = data.get("layout", {})
    require(isinstance(layout, dict), "layout must be an object")
    width = number(layout.get("width"), "layout.width", True)
    height = number(layout.get("height"), "layout.height", True)
    scale = number(layout.get("world_scale"), "layout.world_scale", True)
    targets = layout.get("targets", {})
    require(isinstance(targets, dict), "targets must be an object")
    for tid, target in targets.items():
        require(isinstance(tid, str) and tid, "target ID must be nonempty")
        require(isinstance(target, dict), f"{tid}: target must be an object")
        x, y, w, h = vector(target.get("rect"), 4, f"{tid}.rect")
        require(w > 0 and h > 0 and x >= 0 and y >= 0
                and x+w <= width and y+h <= height,
                f"{tid}: rectangle must lie inside initial layout")

    def frame(value, label):
        require(type(value) is int and 0 <= value < count,
                f"{label}: expected frame 0..{count-1}")
        return value

    def world(point):
        u, v, h = point
        return [(u-width/2)*scale, (height/2-v)*scale, h*scale]

    events = data.get("events")
    require(isinstance(events, list) and events, "events must be a nonempty list")
    ids, sound_ids, output = set(), set(), []
    for event in events:
        require(isinstance(event, dict), "event must be an object")
        eid = event.get("id")
        require(isinstance(eid, str) and eid and eid not in ids,
                "event ID must be nonempty and unique")
        ids.add(eid)
        require(isinstance(event.get("action"), str) and event["action"].strip(),
                f"{eid}: action required")
        start = frame(event.get("start_frame"), f"{eid}.start_frame")
        end = frame(event.get("end_frame"), f"{eid}.end_frame")
        require(start <= end, f"{eid}: start after end")
        contact = event.get("contact_frame")
        if contact is not None:
            frame(contact, f"{eid}.contact_frame")
            require(start <= contact <= end, f"{eid}: contact outside action")
        compiled = dict(event)
        compiled["seconds"] = {"start": start/fps, "end": end/fps}
        compiled["blender_frames"] = {"start": start+1, "end": end+1}
        if contact is not None:
            compiled["seconds"]["contact"] = contact/fps
            compiled["blender_frames"]["contact"] = contact+1
        tid = event.get("target")
        if tid is not None:
            require(isinstance(tid, str) and tid in targets, f"{eid}: unknown target")
            require(contact is not None, f"{eid}: targeted event needs contact")
            x, y, w, h = targets[tid]["rect"]
            uv = vector(event.get("contact_uv", [x+w/2, y+h/2]), 2,
                        f"{eid}.contact_uv")
            require(x <= uv[0] <= x+w and y <= uv[1] <= y+h,
                    f"{eid}: contact outside target")
            compiled["contact_uv"] = uv
            compiled["contact_world_local"] = world(uv+[0])
            effect = event.get("effect")
            require(isinstance(effect, dict) and "before" in effect and "after" in effect,
                    f"{eid}: targeted event needs before/after effect")
            require(effect["before"] != effect["after"], f"{eid}: no visible state change")
        effect = event.get("effect")
        if effect is not None:
            require(isinstance(effect, dict), f"{eid}: effect must be an object")
            ef = frame(effect.get("frame", contact if contact is not None else start),
                       f"{eid}.effect.frame")
            require((contact if contact is not None else start) <= ef <= end,
                    f"{eid}: effect outside post-contact action")
            compiled["effect_frame"] = ef
            compiled["effect_seconds"] = ef/fps
        path = event.get("path")
        if path is not None:
            require(isinstance(path, list) and len(path) == 4,
                    f"{eid}: cubic path requires four points")
            points = [vector(p, 3, f"{eid}.path") for p in path]
            require(contact is not None and contact > start,
                    f"{eid}: path requires a positive interval ending at contact")
            require(tid is not None, f"{eid}: contact path needs target")
            require(math.dist(points[-1][:2], compiled["contact_uv"]) <= .01
                    and abs(points[-1][2]) <= .01,
                    f"{eid}: path endpoint must equal target contact at surface height")
            compiled["path_world_local"] = [world(p) for p in points]
        audio = event.get("audio", [])
        require(isinstance(audio, list), f"{eid}: audio must be a list")
        compiled["audio"] = []
        for cue in audio:
            require(isinstance(cue, dict), f"{eid}: cue must be an object")
            sid = cue.get("id")
            require(isinstance(sid, str) and sid and sid not in sound_ids,
                    f"{eid}: audio ID must be nonempty and unique")
            sound_ids.add(sid)
            af = frame(cue.get("frame"), f"{sid}.frame")
            require(cue.get("sync") in (None, "contact"), f"{sid}: unsupported sync")
            if cue.get("sync") == "contact":
                require(contact is not None and af == contact,
                        f"{sid}: audio must align with contact frame")
            compiled["audio"].append(dict(cue, seconds=af/fps,
                                          sample=round(af/fps*sample_rate)))
        output.append(compiled)
    canonical = json.dumps(data, ensure_ascii=False, sort_keys=True,
                           separators=(",", ":")).encode("utf-8")
    return {
        "schema_version": 1,
        "source_sha256": hashlib.sha256(canonical).hexdigest(),
        "format": dict(fmt, frame_count=count, sample_rate=sample_rate),
        "layout": layout,
        "events": sorted(output, key=lambda e: (e["start_frame"], e["id"])),
        "coordinate_note": "Initial board-local coordinates; apply dynamic panel transforms and contact offsets.",
    }


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("input", type=Path)
    parser.add_argument("--out", type=Path, required=True)
    args = parser.parse_args()
    if args.input.resolve() == args.out.resolve():
        parser.exit(2, "error: output must not overwrite source timeline\n")
    try:
        result = compile_timeline(json.loads(args.input.read_text(encoding="utf-8")))
        args.out.parent.mkdir(parents=True, exist_ok=True)
        args.out.write_text(json.dumps(result, ensure_ascii=False, indent=2)+"\n",
                            encoding="utf-8")
    except (ValueError, OSError) as exc:
        parser.exit(2, f"error: {exc}\n")
    print(f"OK: {result['format']['frame_count']} frames, {len(result['events'])} events -> {args.out}")


if __name__ == "__main__":
    main()
