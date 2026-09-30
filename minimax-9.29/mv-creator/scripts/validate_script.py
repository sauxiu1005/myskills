#!/usr/bin/env python3
"""校验 script.md 脚本格式是否符合预览解析器要求。

规则：
  - 每幕必须用 ## 标题
  - 时间码格式：* M:SS - M:SS (Xs)（不加粗、不带段落标签）
  - 每幕时长必须为 4～15 秒的整数
  - 时间段连续，不能有间隙或重叠
  - 每幕必须包含 **场景描述：**
  - 每幕可选包含 **关键物件：**
  - 每幕必须包含 **视觉风格：**
  - 每幕必须包含 **转场：**
  - 可选：与 lyric.md 交叉校验时间码
"""

import re
import sys
from pathlib import Path

MIN_DURATION = 4
MAX_DURATION = 15

SCENE_RE = re.compile(r"^##\s+(.+)$")
TIME_RE = re.compile(
    r"^\*\s+(\d{1,2}):(\d{2})\s*-\s*(\d{1,2}):(\d{2})"
    r"(?:\s+\((\d+)s\))?\s*$"
)
BAD_TIME_BOLD_RE = re.compile(r"^\*\s+\*\*")


def parse_time(minutes: str, seconds: str) -> int:
    return int(minutes) * 60 + int(seconds)


def parse_script(path: str) -> list[dict]:
    """解析 script.md，返回幕列表。"""
    text = Path(path).read_text(encoding="utf-8")
    lines = text.split("\n")
    scenes: list[dict] = []
    current: dict | None = None

    for line_raw in lines:
        line = line_raw.strip()

        scene_match = SCENE_RE.match(line)
        if scene_match:
            if current:
                scenes.append(current)
            current = {
                "title": scene_match.group(1),
                "time_raw": None,
                "start": None,
                "end": None,
                "duration_tag": None,
                "has_lyrics": False,
                "has_desc": False,
                "has_props": False,
                "has_style": False,
                "has_transition": False,
                "raw_lines": [],
            }
            continue

        if current is None:
            continue

        current["raw_lines"].append(line)

        time_match = TIME_RE.match(line)
        if time_match:
            current["time_raw"] = line.lstrip("* ")
            current["start"] = parse_time(time_match.group(1), time_match.group(2))
            current["end"] = parse_time(time_match.group(3), time_match.group(4))
            if time_match.group(5) is not None:
                current["duration_tag"] = int(time_match.group(5))
            continue

        if line.startswith(">"):
            current["has_lyrics"] = True
        if line.startswith("**场景描述：**") or line.startswith("**场景描述:**"):
            current["has_desc"] = True
        if line.startswith("**关键物件：**") or line.startswith("**关键物件:**"):
            current["has_props"] = True
        if line.startswith("**视觉风格：**") or line.startswith("**视觉风格:**"):
            current["has_style"] = True
        if line.startswith("**转场：**") or line.startswith("**转场:**"):
            current["has_transition"] = True

    if current:
        scenes.append(current)

    return scenes


def validate(scenes: list[dict]) -> list[str]:
    """校验幕列表，返回问题列表。"""
    issues: list[str] = []

    if not scenes:
        issues.append("ERROR  未找到任何 ## 场景标题")
        return issues

    for i, sc in enumerate(scenes):
        label = sc["title"]

        # 检查时间码
        if sc["start"] is None:
            issues.append(f"ERROR  [{label}] 缺少时间码行（格式：* M:SS - M:SS (Xs)）")
            continue

        # 检查加粗时间码
        for raw_line in sc["raw_lines"]:
            if BAD_TIME_BOLD_RE.match(raw_line):
                issues.append(f"ERROR  [{label}] 时间码不应加粗（去掉 **）")
                break

        duration = sc["end"] - sc["start"]
        if duration <= 0:
            issues.append(f"ERROR  [{label}] 时长无效 ({duration}s)")
            continue

        # 时长标签检查
        if sc["duration_tag"] is None:
            issues.append(f"ERROR  [{label}] 缺少时长标签（格式：* M:SS - M:SS (Xs)）")
        elif sc["duration_tag"] != duration:
            issues.append(
                f"ERROR  [{label}] 时长标签 ({sc['duration_tag']}s) "
                f"与实际时长 ({duration}s) 不一致"
            )

        # 时长范围检查
        if not (MIN_DURATION <= duration <= MAX_DURATION):
            issues.append(
                f"ERROR  [{label}] 时长 {duration}s 超出范围 "
                f"(要求 {MIN_DURATION}～{MAX_DURATION}s)"
            )

        # 整数检查（时间码本身是整数秒，这里 double check）
        if duration != int(duration):
            issues.append(f"ERROR  [{label}] 时长必须为整数秒 (当前 {duration}s)")

        # 连续性检查
        if i > 0 and scenes[i - 1]["end"] is not None:
            prev_end = scenes[i - 1]["end"]
            if abs(sc["start"] - prev_end) > 1:
                issues.append(
                    f"ERROR  [{label}] 与上一幕不连续 "
                    f"(上幕结束 {_fmt(prev_end)}, 本幕开始 {_fmt(sc['start'])})"
                )

        # 必填字段检查
        if not sc["has_desc"]:
            issues.append(f"WARN   [{label}] 缺少 **场景描述：**")
        if not sc["has_style"]:
            issues.append(f"WARN   [{label}] 缺少 **视觉风格：**")
        if not sc["has_transition"]:
            issues.append(f"WARN   [{label}] 缺少 **转场：**")

    return issues


def _fmt(seconds: float) -> str:
    return f"{int(seconds // 60)}:{int(seconds % 60):02d}"


def print_summary(scenes: list[dict], issues: list[str]) -> None:
    total = len(scenes)
    with_lyrics = sum(1 for s in scenes if s["has_lyrics"])
    total_duration = 0
    if scenes and scenes[-1]["end"] is not None and scenes[0]["start"] is not None:
        total_duration = scenes[-1]["end"] - scenes[0]["start"]

    print("=== 脚本校验报告 ===\n")
    print(f"总时长: {_fmt(total_duration)}")
    print(f"总幕数: {total} (歌词幕 {with_lyrics}, 纯画面幕 {total - with_lyrics})")
    print(f"时长约束: {MIN_DURATION}～{MAX_DURATION}s")
    print()

    print(f"{'幕名':<20} {'时间码':<20} {'时长':>5} {'歌词':>4} {'描述':>4} {'物件':>4} {'风格':>4} {'转场':>4}")
    print("-" * 82)
    for sc in scenes:
        duration = (sc["end"] - sc["start"]) if sc["start"] is not None else 0
        time_str = sc["time_raw"] or "缺失"
        check = lambda v: "Y" if v else "-"
        title = sc["title"][:18]
        ok = "  " if MIN_DURATION <= duration <= MAX_DURATION else "!!"
        print(
            f"{title:<20} {time_str:<20} {duration:>3.0f}s{ok}"
            f"{check(sc['has_lyrics']):>4} {check(sc['has_desc']):>4} "
            f"{check(sc['has_props']):>4} {check(sc['has_style']):>4} "
            f"{check(sc['has_transition']):>4}"
        )

    print()
    if issues:
        print(f"发现 {len(issues)} 个问题:\n")
        for issue in issues:
            print(f"  {issue}")
    else:
        print("ALL PASS")


def main():
    if len(sys.argv) < 2:
        print("用法: python validate_script.py <script.md 路径>")
        sys.exit(1)

    script_path = Path(sys.argv[1])
    if not script_path.exists():
        print(f"ERROR: 文件不存在: {script_path}")
        sys.exit(1)

    print(f"\n--- {script_path} ---\n")
    scenes = parse_script(str(script_path))
    issues = validate(scenes)
    print_summary(scenes, issues)

    has_error = any("ERROR" in i for i in issues)
    sys.exit(1 if has_error else 0)


if __name__ == "__main__":
    main()
