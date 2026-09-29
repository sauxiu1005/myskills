#!/usr/bin/env python3
"""Validate youtube-creator script format compliance.

Rules:
  - File header must contain metadata (Topic, Type, Target Duration, Audience)
  - Each segment must use ## [SECTION:id] Title
  - Each segment must contain **Narration:**
  - Each segment must contain **Visual Description:**
  - Each segment must contain **Retention Tag:** (HOOK/PATTERN_INTERRUPT/SOFT_CTA/SECOND_HOOK/HARD_CTA/NORMAL)
  - Each segment must contain **Estimated Duration:** Xs
  - Segments are separated by ---
  - section_id must be unique
  - Must have at least one HOOK segment and one HARD_CTA segment
"""

import re
import sys
from pathlib import Path

SECTION_RE = re.compile(r"^##\s+\[SECTION:(\w+)\]\s+(.+)$")
DURATION_RE = re.compile(r"(\d+)s")
RETENTION_TAGS = {"HOOK", "PATTERN_INTERRUPT", "SOFT_CTA", "SECOND_HOOK", "HARD_CTA", "NORMAL"}
RETENTION_RE = re.compile(r"\*\*Retention Tag[：:]\*\*\s*(\S+)")


def parse_script(path: str) -> tuple[dict, list[dict]]:
    """Parse script.md, return (metadata, sections list)."""
    text = Path(path).read_text(encoding="utf-8")
    lines = text.split("\n")
    sections: list[dict] = []
    meta: dict = {"topic": "", "type": "", "target_duration": "", "audience": ""}
    current: dict | None = None

    in_header = True

    for line_raw in lines:
        line = line_raw.strip()

        # Parse file header metadata
        if in_header and not line.startswith("##"):
            if line.startswith("Topic:") or line.startswith("Topic："):
                meta["topic"] = line.split(":", 1)[-1].split("：", 1)[-1].strip()
            elif line.startswith("Type:") or line.startswith("Type："):
                meta["type"] = line.split(":", 1)[-1].split("：", 1)[-1].strip()
            elif line.startswith("Target Duration:") or line.startswith("Target Duration："):
                meta["target_duration"] = line.split(":", 1)[-1].split("：", 1)[-1].strip()
            elif line.startswith("Audience:") or line.startswith("Audience："):
                meta["audience"] = line.split(":", 1)[-1].split("：", 1)[-1].strip()
            continue

        in_header = False

        section_match = SECTION_RE.match(line)
        if section_match:
            if current:
                sections.append(current)
            current = {
                "id": section_match.group(1),
                "title": section_match.group(2),
                "has_narration": False,
                "has_visual": False,
                "has_retention": False,
                "has_duration": False,
                "duration_seconds": 0,
                "retention_tag": "",
            }
            continue

        if current is None:
            continue

        if line.startswith("**Narration:**") or line.startswith("**Narration：**"):
            current["has_narration"] = True
        elif line.startswith("**Visual Description:**") or line.startswith("**Visual Description：**"):
            current["has_visual"] = True
        elif line.startswith("**Retention Tag:**") or line.startswith("**Retention Tag：**"):
            current["has_retention"] = True
            m = RETENTION_RE.match(line)
            if m:
                current["retention_tag"] = m.group(1)
        elif line.startswith("**Estimated Duration:**") or line.startswith("**Estimated Duration：**"):
            current["has_duration"] = True
            m = DURATION_RE.search(line)
            if m:
                current["duration_seconds"] = int(m.group(1))

    if current:
        sections.append(current)

    return meta, sections


def validate(meta: dict, sections: list[dict]) -> list[str]:
    """Validate and return list of issues."""
    issues: list[str] = []

    # Metadata check
    if not meta["topic"]:
        issues.append("WARN   Header missing Topic:")
    if not meta["type"]:
        issues.append("WARN   Header missing Type:")
    if not meta["target_duration"]:
        issues.append("WARN   Header missing Target Duration:")

    if not sections:
        issues.append("ERROR  No ## [SECTION:xxx] segments found")
        return issues

    # section_id uniqueness
    ids = [s["id"] for s in sections]
    seen = set()
    for sid in ids:
        if sid in seen:
            issues.append(f"ERROR  Duplicate section_id: {sid}")
        seen.add(sid)

    total_duration = 0
    retention_tags_found: list[str] = []

    for sc in sections:
        label = f"[{sc['id']}] {sc['title']}"

        if not sc["has_narration"]:
            issues.append(f"ERROR  {label} missing **Narration:**")
        if not sc["has_visual"]:
            issues.append(f"ERROR  {label} missing **Visual Description:**")
        if not sc["has_retention"]:
            issues.append(f"ERROR  {label} missing **Retention Tag:**")
        elif sc["retention_tag"] and sc["retention_tag"] not in RETENTION_TAGS:
            issues.append(
                f"ERROR  {label} invalid Retention Tag: {sc['retention_tag']}, "
                f"expected {'/'.join(sorted(RETENTION_TAGS))}"
            )
        if not sc["has_duration"]:
            issues.append(f"ERROR  {label} missing **Estimated Duration:**")
        elif sc["duration_seconds"] <= 0:
            issues.append(f"ERROR  {label} Estimated Duration format error (should be Xs, e.g. 15s)")
        elif sc["duration_seconds"] > 120:
            issues.append(f"WARN   {label} segment too long ({sc['duration_seconds']}s > 120s)")

        total_duration += sc["duration_seconds"]
        if sc["retention_tag"]:
            retention_tags_found.append(sc["retention_tag"])

    # Retention tag checks
    if "HOOK" not in retention_tags_found:
        issues.append("ERROR  Script missing HOOK segment (opening must have a Hook)")
    if "HARD_CTA" not in retention_tags_found:
        issues.append("WARN   Script missing HARD_CTA segment (recommend adding subscribe prompt at end)")

    # Pattern interrupt density check
    pi_count = retention_tags_found.count("PATTERN_INTERRUPT")
    if total_duration > 180 and pi_count == 0:
        issues.append("WARN   Video exceeds 3 minutes but has no PATTERN_INTERRUPT — recommend one every 60-90s")

    # Total duration check
    if total_duration > 0:
        target = meta.get("target_duration", "")
        if "1-3" in target or "1 min" in target or "2 min" in target or "3 min" in target:
            if total_duration > 210:
                issues.append(
                    f"WARN   Total duration {total_duration}s exceeds target (1-3 min ≈ 60-180s)"
                )
        elif "5-8" in target or "5 min" in target:
            if total_duration > 540:
                issues.append(
                    f"WARN   Total duration {total_duration}s exceeds target (5-8 min ≈ 300-480s)"
                )

    return issues


def print_summary(meta: dict, sections: list[dict], issues: list[str]) -> None:
    total_duration = sum(s["duration_seconds"] for s in sections)

    # Retention tag statistics
    tag_counts: dict[str, int] = {}
    for s in sections:
        tag = s.get("retention_tag", "UNKNOWN") or "UNKNOWN"
        tag_counts[tag] = tag_counts.get(tag, 0) + 1

    print("=== YouTube Video Script Validation Report ===\n")
    print(f"Topic: {meta.get('topic', 'Not specified')}")
    print(f"Type: {meta.get('type', 'Not specified')}")
    print(f"Target Duration: {meta.get('target_duration', 'Not specified')}")
    print(f"Audience: {meta.get('audience', 'Not specified')}")
    print(f"Total Segments: {len(sections)}")
    print(f"Estimated Total Duration: {total_duration}s ({total_duration // 60}m{total_duration % 60}s)")
    print()

    # Retention tag distribution
    print("Retention Tag Distribution:")
    for tag in ["HOOK", "PATTERN_INTERRUPT", "SOFT_CTA", "SECOND_HOOK", "HARD_CTA", "NORMAL"]:
        count = tag_counts.get(tag, 0)
        if count > 0:
            print(f"  {tag:<20} {count}x")
    print()

    check = lambda v: "Y" if v else "-"
    print(f"{'Section ID':<14} {'Title':<16} {'Dur':>5} {'Narr':>4} {'Vis':>4} {'Retention Tag':<20}")
    print("-" * 70)
    for sc in sections:
        sid = sc["id"][:12]
        title = sc["title"][:14]
        dur = f"{sc['duration_seconds']}s" if sc["duration_seconds"] > 0 else "?"
        tag = sc.get("retention_tag", "-") or "-"
        print(
            f"{sid:<14} {title:<16} {dur:>5} "
            f"{check(sc['has_narration']):>4} {check(sc['has_visual']):>4} "
            f"{tag:<20}"
        )

    print()
    if issues:
        errors = [i for i in issues if "ERROR" in i]
        warns = [i for i in issues if "WARN" in i]
        print(f"Found {len(errors)} error(s), {len(warns)} warning(s):\n")
        for issue in issues:
            print(f"  {issue}")
    else:
        print("ALL PASS")


def main():
    if len(sys.argv) < 2:
        print("Usage: python validate_script.py <script.md path>")
        sys.exit(1)

    script_path = Path(sys.argv[1])
    if not script_path.exists():
        print(f"ERROR: File not found: {script_path}")
        sys.exit(1)

    print(f"\n--- {script_path} ---\n")
    meta, sections = parse_script(str(script_path))
    issues = validate(meta, sections)
    print_summary(meta, sections, issues)

    has_error = any("ERROR" in i for i in issues)
    sys.exit(1 if has_error else 0)


if __name__ == "__main__":
    main()
