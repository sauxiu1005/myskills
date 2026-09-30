#!/usr/bin/env python3
"""校验 storyboard.md 分镜规划格式是否符合规范。

用法：
  python validate_storyboard.py .mv/{song}/{theme}/storyboard.md

规则：
  - 每幕必须用 ## 标题
  - 时间码格式：* M:SS - M:SS (Xs)
  - 每幕必须包含：出场角色、场景背景、场景描述、视频提示词、参考图
  - 出场角色（非"无"）对应的角色目录和 selected.jpg 必须存在
  - 场景背景对应的 backgrounds/ 目录和 selected.jpg 必须存在
  - 关键物件对应的 props/ 目录和 selected.jpg 必须存在
  - 可选：与 script.md 交叉校验幕数和时间码
"""

import re
import sys
from pathlib import Path

SCENE_RE = re.compile(r"^##\s+(.+)$")
TIME_RE = re.compile(
    r"^\*\s+(\d{1,2}):(\d{2})\s*-\s*(\d{1,2}):(\d{2})"
    r"(?:\s+\((\d+)s\))?\s*$"
)


def parse_time(minutes: str, seconds: str) -> int:
    return int(minutes) * 60 + int(seconds)


def parse_storyboard(path: str) -> list[dict]:
    """解析 storyboard.md，返回幕列表。"""
    text = Path(path).read_text(encoding="utf-8")
    lines = text.split("\n")
    scenes: list[dict] = []
    current: dict | None = None
    current_field: str | None = None

    for line_raw in lines:
        line = line_raw.strip()

        scene_match = SCENE_RE.match(line)
        if scene_match:
            if current:
                scenes.append(current)
            current = {
                "title": scene_match.group(1),
                "start": None,
                "end": None,
                "duration_tag": None,
                "time_raw": None,
                "characters": None,
                "background": None,
                "props": None,
                "has_desc": False,
                "has_prompt": False,
                "has_refs": False,
            }
            current_field = None
            continue

        if current is None:
            continue

        time_match = TIME_RE.match(line)
        if time_match:
            current["time_raw"] = line.lstrip("* ")
            current["start"] = parse_time(time_match.group(1), time_match.group(2))
            current["end"] = parse_time(time_match.group(3), time_match.group(4))
            if time_match.group(5) is not None:
                current["duration_tag"] = int(time_match.group(5))
            current_field = None
            continue

        # 字段检测 (兼容中英)
        if line.startswith(("出场角色：", "出场角色:", "Characters：", "Characters:")):
            chars = line.split("：", 1)[-1].split(":", 1)[-1].strip()
            current["characters"] = chars
            current_field = "characters"
            continue
        if line.startswith(("场景背景：", "场景背景:", "Scene Background：", "Scene Background:")):
            bg = line.split("：", 1)[-1].split(":", 1)[-1].strip()
            current["background"] = bg
            current_field = "background"
            continue
        if line.startswith(("关键物件：", "关键物件:", "Key Props：", "Key Props:")):
            props = line.split("：", 1)[-1].split(":", 1)[-1].strip()
            current["props"] = props
            current_field = "props"
            continue
        if line.startswith(("场景描述：", "场景描述:", "Scene Description：", "Scene Description:")):
            current["has_desc"] = True
            current_field = "desc"
            continue
        if line.startswith(("生图提示词：", "生图提示词:", "视频提示词：", "视频提示词:", "Video Prompt：", "Video Prompt:")):
            current["has_prompt"] = True
            current_field = "prompt"
            continue
        if line.startswith(("参考图：", "参考图:", "Reference：", "Reference:")):
            current["has_refs"] = True
            current_field = "refs"
            continue

    if current:
        scenes.append(current)

    return scenes


def validate(scenes: list[dict], theme_dir: Path) -> list[str]:
    """校验幕列表，返回问题列表。"""
    issues: list[str] = []

    if not scenes:
        issues.append("ERROR  未找到任何 ## 场景标题")
        return issues

    for i, sc in enumerate(scenes):
        label = sc["title"]

        # 时间码
        if sc["start"] is None:
            issues.append(f"ERROR  [{label}] 缺少时间码行（格式：* M:SS - M:SS (Xs)）")
        else:
            duration = sc["end"] - sc["start"]
            if duration <= 0:
                issues.append(f"ERROR  [{label}] 时长无效 ({duration}s)")
            if sc["duration_tag"] is not None and sc["duration_tag"] != duration:
                issues.append(
                    f"ERROR  [{label}] 时长标签 ({sc['duration_tag']}s) "
                    f"与实际时长 ({duration}s) 不一致"
                )
            # 连续性
            if i > 0 and scenes[i - 1]["end"] is not None:
                prev_end = scenes[i - 1]["end"]
                if abs(sc["start"] - prev_end) > 1:
                    issues.append(
                        f"ERROR  [{label}] 与上一幕不连续 "
                        f"(上幕结束 {_fmt(prev_end)}, 本幕开始 {_fmt(sc['start'])})"
                    )

        # 必填字段
        if sc["characters"] is None:
            issues.append(f"ERROR  [{label}] 缺少 出场角色/Characters")
        if sc["background"] is None:
            issues.append(f"ERROR  [{label}] 缺少 场景背景/Scene Background")
        if not sc["has_desc"]:
            issues.append(f"ERROR  [{label}] 缺少 场景描述/Scene Description")
        if not sc["has_prompt"]:
            issues.append(f"ERROR  [{label}] 缺少 视频提示词/Video Prompt")
        if not sc["has_refs"]:
            issues.append(f"WARN   [{label}] 缺少 参考图/Reference")

        # 出场角色 → 角色目录 + selected.jpg 检查
        if sc["characters"] and sc["characters"].lower() not in ("（无）", "(无)", "无", "none", "(none)", "n/a"):
            char_names = [c.strip() for c in sc["characters"].split("、")]
            if len(char_names) == 1:
                char_names = [c.strip() for c in sc["characters"].split(",")]
            for cname in char_names:
                if not cname:
                    continue
                char_dir = theme_dir / "characters" / cname
                if not char_dir.exists():
                    issues.append(
                        f"WARN   [{label}] 角色目录不存在: characters/{cname}/"
                    )
                else:
                    sel = char_dir / "selected.jpg"
                    sel_png = char_dir / "selected.png"
                    if not sel.exists() and not sel_png.exists():
                        issues.append(
                            f"WARN   [{label}] 角色 {cname} 缺少 selected.jpg/png"
                        )

        # 场景背景 → backgrounds/ 目录 + selected.jpg 检查
        if sc["background"]:
            bg_dir = theme_dir / "backgrounds" / sc["background"]
            if not bg_dir.exists():
                issues.append(
                    f"WARN   [{label}] 背景目录不存在: backgrounds/{sc['background']}/"
                )
            else:
                sel = bg_dir / "selected.jpg"
                sel_png = bg_dir / "selected.png"
                if not sel.exists() and not sel_png.exists():
                    issues.append(
                        f"WARN   [{label}] 背景 {sc['background']} 缺少 selected.jpg/png"
                    )

        # 关键物件 → props/ 目录 + selected.jpg 检查
        if sc["props"] and sc["props"].lower() not in ("（无）", "(无)", "无", "", "none", "(none)", "n/a"):
            prop_names = [p.strip() for p in sc["props"].split("、")]
            if len(prop_names) == 1:
                prop_names = [p.strip() for p in sc["props"].split(",")]
            for pname in prop_names:
                if not pname:
                    continue
                prop_dir = theme_dir / "props" / pname
                if not prop_dir.exists():
                    issues.append(
                        f"WARN   [{label}] 物件目录不存在: props/{pname}/"
                    )
                else:
                    sel = prop_dir / "selected.jpg"
                    sel_png = prop_dir / "selected.png"
                    if not sel.exists() and not sel_png.exists():
                        issues.append(
                            f"WARN   [{label}] 物件 {pname} 缺少 selected.jpg/png"
                        )

    # 与 script.md 交叉校验
    script_path = theme_dir / "script.md"
    if script_path.exists():
        _cross_validate_script(scenes, script_path, issues)

    return issues


def _cross_validate_script(scenes: list[dict], script_path: Path, issues: list[str]):
    """与 script.md 交叉校验幕数和时间码。"""
    text = script_path.read_text(encoding="utf-8")
    script_scenes = []
    for line in text.split("\n"):
        line = line.strip()
        sm = SCENE_RE.match(line)
        if sm:
            script_scenes.append({"title": sm.group(1), "start": None, "end": None})
        tm = TIME_RE.match(line)
        if tm and script_scenes:
            script_scenes[-1]["start"] = parse_time(tm.group(1), tm.group(2))
            script_scenes[-1]["end"] = parse_time(tm.group(3), tm.group(4))

    if len(scenes) != len(script_scenes):
        issues.append(
            f"WARN   [交叉校验] 分镜幕数 ({len(scenes)}) "
            f"与脚本幕数 ({len(script_scenes)}) 不一致"
        )
        return

    for i, (sb, sc) in enumerate(zip(scenes, script_scenes)):
        if sb["start"] is not None and sc["start"] is not None:
            if sb["start"] != sc["start"] or sb["end"] != sc["end"]:
                issues.append(
                    f"WARN   [交叉校验] 第 {i+1} 幕时间码与脚本不一致 "
                    f"(分镜 {sb['time_raw']}, 脚本 {_fmt(sc['start'])}-{_fmt(sc['end'])})"
                )


def _fmt(seconds: int) -> str:
    return f"{seconds // 60}:{seconds % 60:02d}"


def print_summary(scenes: list[dict], issues: list[str]) -> None:
    total = len(scenes)
    total_duration = 0
    if scenes and scenes[-1]["end"] is not None and scenes[0]["start"] is not None:
        total_duration = scenes[-1]["end"] - scenes[0]["start"]
    with_chars = sum(
        1 for s in scenes
        if s["characters"] and s["characters"].lower() not in ("（无）", "(无)", "无", "none", "(none)", "n/a")
    )

    print("=== 分镜规划校验报告 ===\n")
    print(f"总时长: {_fmt(total_duration)}")
    print(f"总幕数: {total} (含角色 {with_chars}, 纯空镜 {total - with_chars})")
    print()

    print(
        f"{'幕名':<20} {'时间码':<20} {'时长':>5} {'角色':>4} "
        f"{'背景':>4} {'描述':>4} {'prompt':>6}"
    )
    print("-" * 78)
    for sc in scenes:
        duration = (sc["end"] - sc["start"]) if sc["start"] is not None else 0
        time_str = sc["time_raw"] or "缺失"
        check = lambda v: "Y" if v else "-"
        has_char = sc["characters"] is not None and sc["characters"].lower() not in ("（无）", "(无)", "无", "none", "(none)", "n/a")
        has_bg = sc["background"] is not None
        title = sc["title"][:18]
        print(
            f"{title:<20} {time_str:<20} {duration:>3}s  "
            f"{check(has_char):>4} {check(has_bg):>4} "
            f"{check(sc['has_desc']):>4} {check(sc['has_prompt']):>6}"
        )

    print()
    if issues:
        errors = [i for i in issues if "ERROR" in i]
        warns = [i for i in issues if "WARN" in i]
        infos = [i for i in issues if "INFO" in i]
        print(f"发现 {len(issues)} 个问题 ({len(errors)} 错误, {len(warns)} 警告, {len(infos)} 信息):\n")
        for issue in issues:
            print(f"  {issue}")
    else:
        print("ALL PASS")


def main():
    if len(sys.argv) < 2:
        print("用法: python validate_storyboard.py <storyboard.md 路径>")
        sys.exit(1)

    sb_path = Path(sys.argv[1]).resolve()
    if not sb_path.exists():
        print(f"ERROR: 文件不存在: {sb_path}")
        sys.exit(1)

    theme_dir = sb_path.parent

    print(f"\n--- 分镜规划校验 ---\n")
    scenes = parse_storyboard(str(sb_path))
    issues = validate(scenes, theme_dir)
    print_summary(scenes, issues)

    has_error = any("ERROR" in i for i in issues)
    sys.exit(1 if has_error else 0)


if __name__ == "__main__":
    main()
