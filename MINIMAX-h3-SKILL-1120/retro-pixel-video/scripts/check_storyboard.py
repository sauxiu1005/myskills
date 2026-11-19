#!/usr/bin/env python3
"""check_storyboard.py — 校验复古像素风分镜 JSON 的帧数账本。

支持格式:
  {"fps":24,"total_frames":360,"shots":[{"id":1,"frames":60}, ...]}
  {"fps":24,"total_seconds":15,"shots":[{"id":1,"seconds":2.5}, ...]}
  (每镜可用 frames 或 seconds；顶层可用 total_frames 或 total_seconds)

规则:
  * fps 为正整数
  * 每镜帧数为正整数；seconds*fps 必须能整除为整数帧，否则报错
  * 各镜帧数之和严格等于总长
可选字段（0.2.0）:
  canvas {"logical":[w,h],"scale":n,"output":[W,H]}  校验 logical×scale==output（均为正整数），
      打印档位：640×360 / 360×640 及以上 = 高细节；320×180 / 180×320 及以下 = 低分辨率复古
      （低分辨率且顶层无 "low_res_retro": true 时 WARN，不 FAIL）
  shots[].title / viewpoint / narration  narration 按中文字数 ÷ 4 字/秒估算朗读时长，超过该镜时长则 WARN
  顶层 low_res_retro / note 仅作说明
通过退出码 0（WARN 不影响退出码），失败退出码 1，用法/读取错误退出码 2。

不传路径时默认检查本脚本所在 Skill 目录下 examples/*.storyboard.json。
"""
import argparse
import glob
import json
import os
import sys
from fractions import Fraction

SKILL_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


def to_frames(value, fps, what):
    """把秒数精确换算为整数帧（用 Fraction 避免浮点误差）。"""
    try:
        sec = Fraction(str(value))
    except (ValueError, ZeroDivisionError):
        raise ValueError(f"{what}: 秒数无法解析: {value!r}")
    fr = sec * fps
    if fr.denominator != 1:
        raise ValueError(f"{what}: {value}s × {fps}fps = {float(fr):.4f} 帧，不是整数帧")
    return int(fr)


def count_cjk(text):
    return sum(1 for ch in str(text) if "\u4e00" <= ch <= "\u9fff" or "\u3400" <= ch <= "\u4dbf")


def is_pos_int(v):
    return isinstance(v, int) and not isinstance(v, bool) and v > 0


def check_canvas(data, errors, warns, lines):
    cv = data.get("canvas")
    if cv is None:
        return
    if not isinstance(cv, dict):
        errors.append("canvas 必须为对象")
        return
    lg, sc, out = cv.get("logical"), cv.get("scale"), cv.get("output")
    ok_shape = (isinstance(lg, list) and len(lg) == 2 and all(is_pos_int(v) for v in lg))
    if not ok_shape:
        errors.append(f"canvas.logical 必须为两个正整数，实际 {lg!r}")
    if not is_pos_int(sc):
        errors.append(f"canvas.scale 必须为正整数，实际 {sc!r}")
    if out is not None and not (isinstance(out, list) and len(out) == 2 and all(is_pos_int(v) for v in out)):
        errors.append(f"canvas.output 必须为两个正整数，实际 {out!r}")
        out = None
    if not ok_shape or not is_pos_int(sc):
        return
    calc = [lg[0] * sc, lg[1] * sc]
    if out is not None and calc != out:
        errors.append(f"canvas: logical {lg[0]}×{lg[1]} × scale {sc} = {calc[0]}×{calc[1]} ≠ output {out[0]}×{out[1]}")
    long_, short_ = max(lg), min(lg)
    if long_ >= 640 and short_ >= 360:
        tier = "高细节"
    elif long_ <= 320 and short_ <= 180:
        tier = "低分辨率复古"
    else:
        tier = "中等细节"
    lines.append(f"   canvas: logical {lg[0]}×{lg[1]} ×{sc} → {calc[0]}×{calc[1]}" +
                 (f" (output {out[0]}×{out[1]})" if out else "") + f"  档位: {tier}")
    if tier == "低分辨率复古" and data.get("low_res_retro") is not True:
        warns.append(f"逻辑画布 {lg[0]}×{lg[1]} 属于低分辨率复古档，未声明 \"low_res_retro\": true；"
                     "知识讲解/游戏场景建议 640×360 及以上")


def check(path, quiet=False):
    errors = []
    warns = []
    lines = []
    try:
        with open(path, "r", encoding="utf-8") as f:
            data = json.load(f)
    except Exception as e:  # noqa: BLE001
        print(f"[ERROR] {path}: 无法读取 JSON: {e}")
        return False

    fps = data.get("fps")
    if not isinstance(fps, int) or isinstance(fps, bool) or fps <= 0:
        print(f"[FAIL] {path}: fps 必须为正整数，实际 {fps!r}")
        return False

    total = None
    if "total_frames" in data:
        t = data["total_frames"]
        if isinstance(t, int) and not isinstance(t, bool) and t > 0:
            total = t
        else:
            errors.append(f"total_frames 必须为正整数，实际 {t!r}")
    if "total_seconds" in data:
        try:
            ts = to_frames(data["total_seconds"], fps, "total_seconds")
            if total is not None and ts != total:
                errors.append(f"total_frames={total} 与 total_seconds 换算的 {ts} 帧不一致")
            total = ts if total is None else total
        except ValueError as e:
            errors.append(str(e))
    if total is None and not errors:
        errors.append("缺少 total_frames 或 total_seconds")

    shots = data.get("shots")
    if not isinstance(shots, list) or not shots:
        errors.append("shots 必须为非空数组")
        shots = []

    cursor = 0
    title = data.get("title", os.path.basename(path))
    lines.append(f"== {title}  ({path})")
    lines.append(f"   fps={fps}  total={total} 帧" + (f" = {total / fps:.3f}s" if total else ""))
    check_canvas(data, errors, warns, lines)
    lines.append(f"   {'shot':>6} {'frames':>7} {'start':>6} {'end':>6} {'start_s':>8} {'end_s':>8}")
    for i, s in enumerate(shots):
        sid = s.get("id", i + 1) if isinstance(s, dict) else i + 1
        fr = None
        if not isinstance(s, dict):
            errors.append(f"shot #{i}: 不是对象")
            continue
        if "frames" in s:
            v = s["frames"]
            if isinstance(v, int) and not isinstance(v, bool) and v > 0:
                fr = v
            else:
                errors.append(f"shot {sid}: frames 必须为正整数，实际 {v!r}")
        elif "seconds" in s:
            try:
                fr = to_frames(s["seconds"], fps, f"shot {sid}")
                if fr <= 0:
                    errors.append(f"shot {sid}: 帧数必须为正，实际 {fr}")
                    fr = None
            except ValueError as e:
                errors.append(str(e))
        else:
            errors.append(f"shot {sid}: 缺少 frames 或 seconds")
        if fr is None:
            lines.append(f"   {sid!s:>6} {'?':>7}")
            continue
        start, end = cursor, cursor + fr - 1
        extra = []
        if s.get("title"):
            extra.append(str(s["title"]))
        if s.get("viewpoint"):
            extra.append(f"[{s['viewpoint']}]")
        nar = s.get("narration")
        if nar:
            n = count_cjk(nar)
            est = n / 4.0
            dur = fr / fps
            extra.append(f"旁白 {n} 字≈{est:.2f}s/{dur:.2f}s")
            if est > dur + 1e-9:
                warns.append(f"shot {sid}: 旁白 {n} 字按 4 字/秒约 {est:.2f}s，超过该镜 {dur:.2f}s（{fr} 帧）")
        lines.append(f"   {sid!s:>6} {fr:>7} {start:>6} {end:>6} {start / fps:>8.3f} {(end + 1) / fps:>8.3f}"
                     + (("  " + " ".join(extra)) if extra else ""))
        cursor += fr

    lines.append(f"   sum={cursor} 帧 ({cursor / fps:.3f}s)  total={total}")
    if total is not None and cursor != total:
        errors.append(f"各镜帧数之和 {cursor} ≠ 总长 {total}（差 {cursor - total:+d} 帧）")

    ok = not errors
    if not quiet or not ok:
        print("\n".join(lines))
    for w in warns:
        print(f"   [WARN] {w}")
    for e in errors:
        print(f"   [FAIL] {e}")
    print(f"   结论: {'FAIL' if not ok else ('PASS (有 WARN)' if warns else 'PASS')}")
    return ok


def main():
    ap = argparse.ArgumentParser(
        description="校验分镜 JSON：每镜正整数帧、秒数可整除为整数帧、求和严格等于总长；可选 canvas 档位/倍率校验与旁白时长估算（WARN 不影响退出码）。失败退出码 1。")
    ap.add_argument("paths", nargs="*",
                    help="分镜 JSON 路径；省略时检查 <Skill目录>/examples/*.storyboard.json")
    ap.add_argument("--skill-dir", default=SKILL_DIR,
                    help="Skill 根目录（默认: 本脚本上一级目录）")
    ap.add_argument("-q", "--quiet", action="store_true", help="只打印失败项与结论")
    a = ap.parse_args()

    paths = a.paths or sorted(glob.glob(os.path.join(a.skill_dir, "examples", "*.storyboard.json")))
    if not paths:
        print("未找到任何分镜 JSON", file=sys.stderr)
        return 2
    results = [check(p, a.quiet) for p in paths]
    n_ok = sum(results)
    print(f"\n总计 {len(results)} 个文件: {n_ok} PASS, {len(results) - n_ok} FAIL")
    return 0 if all(results) else 1


if __name__ == "__main__":
    sys.exit(main())
