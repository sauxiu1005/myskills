#!/usr/bin/env python3
"""Emit a starting layout for a talking-head illustrated explainer, not a render."""

import argparse
from fractions import Fraction
import json
import math


def even(value):
    return int(math.ceil(value / 2) * 2)


def box(x, y, width, height):
    return {"x": round(x), "y": round(y), "width": round(width), "height": round(height)}


def plan(width, height):
    width, height = even(width), even(height)
    short = min(width, height)
    margin_x = max(12, round(width * 0.08))
    margin_y = max(12, round(height * 0.08))
    gap = max(8, round(short * 0.025))
    ratio = width / height
    header = box(margin_x, margin_y, width - 2 * margin_x, short * 0.065)
    scene_top = header["y"] + header["height"] + gap
    if ratio >= 1.30:
        mode = "landscape-side-presenter"
        diameter = round(short * 0.27)
        captions = box(margin_x, height - margin_y - short * 0.12,
                       width - 2 * margin_x, short * 0.12)
        presenter = box(width - margin_x - diameter,
                        captions["y"] - gap - diameter, diameter, diameter)
        scene = box(margin_x, scene_top, presenter["x"] - gap - margin_x,
                    captions["y"] - gap - scene_top)
    elif ratio >= 0.88:
        mode = "compact-bottom-split"
        diameter = round(short * 0.27)
        presenter = box(width - margin_x - diameter,
                        height - margin_y - diameter, diameter, diameter)
        captions = box(margin_x, presenter["y"] + diameter * 0.20,
                       presenter["x"] - gap - margin_x, diameter * 0.60)
        scene = box(margin_x, scene_top, width - 2 * margin_x,
                    presenter["y"] - gap - scene_top)
    else:
        mode = "portrait-stacked"
        diameter = round(short * 0.30)
        presenter = box(width - margin_x - diameter,
                        height - margin_y - diameter, diameter, diameter)
        caption_height = round(short * 0.16)
        captions = box(margin_x, presenter["y"] - gap - caption_height,
                       width - 2 * margin_x, caption_height)
        scene = box(margin_x, scene_top, width - 2 * margin_x,
                    captions["y"] - gap - scene_top)
    ratio_fraction = Fraction(width, height)
    return {
        "purpose": "layout-starting-point-only",
        "width": width, "height": height,
        "aspect_ratio": f"{ratio_fraction.numerator}:{ratio_fraction.denominator}",
        "layout_mode": mode,
        "safe_rect": box(margin_x, margin_y, width - 2 * margin_x, height - 2 * margin_y),
        "header_rect": header, "scene_rect": scene,
        "scene_content_safe_rect": box(scene["x"] + scene["width"] * 0.05, scene["y"] + scene["height"] * 0.05, scene["width"] * 0.90, scene["height"] * 0.90),
        "caption_rect": captions, "presenter_rect": presenter,
        "presenter_shape": "circle",
        "caption_font_px_start": max(14, round(short * 0.043)),
        "caption_max_lines_start": 2,
        "stroke_px_start": {"outer": max(2, round(short * 0.004)),
                            "detail": max(1, round(short * 0.0022))},
        "shot_overrides": [],
        "notes": ["Fit and reflow measured text; the font size is only a starting value.",
                  "Compose semantic objects per shot; do not fit the entire source movie into scene_rect.",
                  "All animated objects and motion extents stay inside scene_content_safe_rect; only the plain background fills the frame.",
                  "Keep scene cues sparse and line-only; no decorative background shapes.",
                  "Check target-platform overlays separately; these margins are generic.",
                  "No render, timing, face crop, or visual-quality validation is performed here."]
    }


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--ratio", help="Output ratio such as 9:16, 16:9, 1:1, 4:5 or 4:3")
    parser.add_argument("--short-edge", type=int, default=1080)
    parser.add_argument("--width", type=int)
    parser.add_argument("--height", type=int)
    args = parser.parse_args()
    explicit = args.width is not None or args.height is not None
    if args.ratio and explicit:
        parser.error("Choose --ratio or --width/--height, not both.")
    if explicit:
        if args.width is None or args.height is None:
            parser.error("Both --width and --height are required.")
        width, height = args.width, args.height
    elif args.ratio:
        try:
            a, b = args.ratio.split(":")
            ratio = Fraction(a) / Fraction(b)
            if ratio <= 0 or args.short_edge <= 0:
                raise ValueError()
        except (ValueError, ZeroDivisionError):
            parser.error("Ratio and short edge must be positive, for example --ratio 16:9.")
        if ratio >= 1:
            width, height = args.short_edge * ratio, args.short_edge
        else:
            width, height = args.short_edge, args.short_edge / ratio
    else:
        parser.error("Specify --ratio or --width and --height.")
    if min(width, height) < 256 or max(width, height) > 32768:
        parser.error("This layout helper accepts dimensions from 256 to 32768 pixels.")
    output = plan(width, height)
    output["requested_size"] = {"width": float(width), "height": float(height)}
    output["even_dimension_adjustment"] = (width != output["width"] or height != output["height"])
    print(json.dumps(output, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
