#!/usr/bin/env python3
"""校验 lyric.md 歌词格式是否符合要求。

规则：
  - 时间码格式正确：M:SS 或 MM:SS
  - 时间段必须连续，不能有间隙或重叠
  - 时长不能为负或零
  - 纯音乐段不应包含歌词
  - 歌词段至少包含 1 行歌词
"""

import re
import sys
from pathlib import Path

TIME_RE = re.compile(r"^(\d{1,2}):(\d{2})\s*-\s*(\d{1,2}):(\d{2})$")
TAG_RE = re.compile(r"^\[(prelude|interlude|outro)\]$")


def parse_time(minutes: str, seconds: str) -> float:
    return int(minutes) * 60 + int(seconds)


def parse_lyric_file(path: str) -> list[dict]:
    """解析 lyric.md，返回段落列表。"""
    text = Path(path).read_text(encoding="utf-8")

    # 提取 ``` 代码块内容
    m = re.search(r"```\n(.*?)```", text, re.DOTALL)
    if not m:
        print("ERROR: 未找到 ``` 代码块")
        sys.exit(1)

    content = m.group(1).strip()
    segments: list[dict] = []
    current_tag: str | None = None

    for line in content.split("\n"):
        line = line.strip()
        if not line:
            continue

        tag_match = TAG_RE.match(line)
        if tag_match:
            current_tag = tag_match.group(1)
            continue

        time_match = TIME_RE.match(line)
        if time_match:
            start = parse_time(time_match.group(1), time_match.group(2))
            end = parse_time(time_match.group(3), time_match.group(4))
            segments.append({
                "start": start,
                "end": end,
                "tag": current_tag,
                "lines": [],
                "raw_time": line,
            })
            current_tag = None  # tag 只作用于紧跟的段落
            continue

        # 歌词行
        if segments:
            segments[-1]["lines"].append(line)

    return segments


def validate(segments: list[dict]) -> list[str]:
    """校验段落，返回警告/错误列表。"""
    issues: list[str] = []

    for i, seg in enumerate(segments):
        duration = seg["end"] - seg["start"]
        time_label = seg["raw_time"]
        is_instrumental = seg["tag"] is not None
        line_count = len(seg["lines"])

        # 时长为负或零
        if duration <= 0:
            issues.append(f"ERROR  [{time_label}] 时长无效 ({duration:.0f}s)")
            continue

        # 单段时长上限检查 (不超过20s)
        if duration > 20:
            issues.append(f"WARN   [{time_label}] 时长过长 ({duration:.0f}s > 20s)")

        if is_instrumental:
            if line_count > 0:
                issues.append(
                    f"WARN   [{time_label}] [{seg['tag']}] 纯音乐段包含 {line_count} 行歌词"
                )
        else:
            if line_count < 1:
                issues.append(
                    f"WARN   [{time_label}] 歌词段无歌词内容"
                )

        # 连续性检查
        if i > 0:
            prev_end = segments[i - 1]["end"]
            if abs(seg["start"] - prev_end) > 0.01:
                issues.append(
                    f"ERROR  [{time_label}] 与上一段不连续 "
                    f"(上段结束 {prev_end:.0f}s, 本段开始 {seg['start']:.0f}s)"
                )

    return issues


def print_summary(segments: list[dict], issues: list[str]) -> None:
    total = len(segments)
    instrumental = sum(1 for s in segments if s["tag"])
    lyric_segs = total - instrumental
    total_duration = segments[-1]["end"] - segments[0]["start"] if segments else 0

    print(f"=== 歌词校验报告 ===\n")
    print(f"总时长: {int(total_duration // 60)}:{int(total_duration % 60):02d}")
    print(f"总段数: {total} (歌词段 {lyric_segs}, 纯音乐段 {instrumental})")
    print()

    # 段落明细
    print(f"{'时间码':<18} {'时长':>5} {'行数':>4} {'类型':<10}")
    print("-" * 45)
    for seg in segments:
        duration = seg["end"] - seg["start"]
        seg_type = f"[{seg['tag']}]" if seg["tag"] else "歌词"
        print(f"{seg['raw_time']:<18} {duration:>4.0f}s {len(seg['lines']):>4} {seg_type:<10}")

    print()
    if issues:
        print(f"发现 {len(issues)} 个问题:\n")
        for issue in issues:
            print(f"  {issue}")
    else:
        print("ALL PASS")


def main():
    if len(sys.argv) < 2:
        # 默认查找所有 lyric.md
        base = Path(__file__).resolve().parent.parent / ".mv"
        files = list(base.glob("*/lyric.md"))
        if not files:
            print("用法: python validate_lyric.py <lyric.md 路径>")
            sys.exit(1)
    else:
        files = [Path(sys.argv[1])]

    for path in files:
        print(f"\n--- {path} ---\n")
        segments = parse_lyric_file(str(path))
        issues = validate(segments)
        print_summary(segments, issues)

    # 有 ERROR 则返回非零退出码
    has_error = any("ERROR" in i for i in issues)
    sys.exit(1 if has_error else 0)


if __name__ == "__main__":
    main()
