#!/usr/bin/env python3
"""
Dynamic poster brief validator.
Validates the format and content of a poster brief file.

Usage:
    python3 validate_poster_brief.py <brief_path>
"""

import argparse
import re
import sys
from pathlib import Path


def validate_brief(brief_path: str) -> tuple[bool, list[str]]:
    """Validate a dynamic poster brief file. Returns (passed, errors)."""
    errors = []
    warnings = []
    path = Path(brief_path)

    if not path.exists():
        return False, [f"File not found: {brief_path}"]

    content = path.read_text(encoding="utf-8")

    # --- Required fields ---
    required_fields = {
        "Brand": r"Brand\s*[:：]\s*\S+",
        "Product Category": r"Product Category\s*[:：]\s*\S+",
        "Brand Colors": r"Brand Colors\s*[:：]\s*\S+",
        "Product Texture": r"Product Texture\s*[:：]\s*\S+",
        "Key Visual Elements": r"Key Visual Elements\s*[:：]\s*\S+",
    }

    for field, pattern in required_fields.items():
        if not re.search(pattern, content):
            errors.append(f"Missing or empty required field: {field}")

    # --- Brand Colors validation ---
    color_match = re.search(r"Brand Colors\s*[:：]\s*(.+)", content)
    if color_match:
        color_line = color_match.group(1)
        hex_colors = re.findall(r"#[0-9A-Fa-f]{6}", color_line)
        if not hex_colors:
            errors.append(
                "Brand Colors must include at least one hex color value (e.g., #2D5A3D)"
            )

    # --- Duration validation ---
    duration_match = re.search(r"Duration\s*[:：]\s*(\d+)", content)
    if duration_match:
        duration = int(duration_match.group(1))
        if duration < 3 or duration > 15:
            errors.append(f"Duration {duration}s out of range (3-15s)")
    else:
        warnings.append("No Duration field found")

    # --- Aspect Ratio validation ---
    ratio_match = re.search(r"Aspect Ratio\s*[:：]\s*(.+)", content)
    if ratio_match:
        ratio = ratio_match.group(1).strip()
        valid_ratios = {"9:16", "16:9", "4:5", "1:1"}
        if ratio not in valid_ratios:
            warnings.append(
                f"Aspect Ratio '{ratio}' not standard. Expected: {', '.join(sorted(valid_ratios))}"
            )

    # --- Logo fields (optional but validate if present) ---
    logo_match = re.search(r"Logo Type\s*[:：]\s*(.+)", content)
    if logo_match:
        logo_type = logo_match.group(1).strip().lower()
        valid_logo_types = {"wordmark", "icon", "combo", "none"}
        if not any(lt in logo_type for lt in valid_logo_types):
            warnings.append(
                f"Logo Type '{logo_match.group(1).strip()}' not recognized. "
                f"Expected: {', '.join(sorted(valid_logo_types))}"
            )

    # --- Creative Concept validation (if present in same file) ---
    has_concept = "# Creative Concept" in content or "# Selected Concept" in content
    if has_concept:
        if not re.search(r"Creative Dimension\s*[:：]\s*\S+", content):
            errors.append("Creative Concept found but missing 'Creative Dimension'")
        if not re.search(r"The Impossible Thing\s*[:：]\s*\S+", content):
            errors.append("Creative Concept found but missing 'The Impossible Thing'")
        if not re.search(r"Conflict", content):
            warnings.append("Creative Concept missing conflict arc (Setup → Escalation → Payoff)")

    passed = len(errors) == 0
    return passed, errors + [f"WARNING: {w}" for w in warnings]


def main():
    parser = argparse.ArgumentParser(description="Validate dynamic poster brief format")
    parser.add_argument("brief_path", help="Path to the brief.md file")
    args = parser.parse_args()

    passed, messages = validate_brief(args.brief_path)

    errors = [m for m in messages if not m.startswith("WARNING:")]
    warnings = [m for m in messages if m.startswith("WARNING:")]

    if passed:
        print("PASSED: Brief validation successful")
        print(f"  File: {args.brief_path}")
        if warnings:
            print(f"  Warnings: {len(warnings)}")
            for w in warnings:
                print(f"    - {w}")
        sys.exit(0)
    else:
        print(f"FAILED: Brief validation found {len(errors)} error(s)")
        print(f"  File: {args.brief_path}")
        for i, err in enumerate(errors, 1):
            print(f"  {i}. {err}")
        if warnings:
            print(f"  Warnings:")
            for w in warnings:
                print(f"    - {w}")
        sys.exit(1)


if __name__ == "__main__":
    main()
