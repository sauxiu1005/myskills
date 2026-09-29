#!/usr/bin/env python3
"""
验证 nature/ 目录中的素材文件，输出类别识别结果和元数据。
用法：python validate_nature.py <nature_dir>
"""
import os, subprocess, sys, json

CATEGORY_KEYWORDS = {
    "rain": ["rain", "雨"],
    "thunder": ["thunder", "雷"],
    "fireplace": ["fireplace", "fire", "壁炉", "篝火"],
    "ocean": ["ocean", "wave", "sea", "海浪", "海"],
    "river": ["river", "stream", "creek", "brook", "waterfall", "溪流", "河", "瀑布"],
    "forest": ["forest", "森林"],
    "bird": ["bird", "鸟"],
    "cricket": ["cricket", "cicada", "蟋蟀", "蝉"],
    "wind": ["wind", "风"],
    "snow": ["snow", "雪"],
    "cafe": ["cafe", "coffee", "咖啡"],
    "clock": ["clock", "tick", "钟"],
    "keyboard": ["keyboard", "typing", "键盘"],
    "vinyl": ["vinyl", "record", "黑胶"],
    "train": ["train", "rail", "火车", "铁轨"],
    "city": ["city", "traffic", "street", "城市", "街道"],
    "subway": ["subway", "metro", "地铁"],
    "whitenoise": ["whitenoise", "white_noise", "白噪音"],
    "underwater": ["underwater", "bubble", "水下"],
    "space": ["space", "cosmic", "太空"],
}

AUDIO_EXTS = {".mp3", ".wav", ".m4a", ".flac", ".ogg", ".aac"}


def get_duration(path):
    try:
        r = subprocess.run(
            ["ffprobe", "-v", "quiet", "-show_entries", "format=duration", "-of", "csv=p=0", path],
            capture_output=True, text=True,
        )
        return float(r.stdout.strip())
    except Exception:
        return 0.0


def detect_category(filename):
    name = filename.lower()
    for cat, keywords in CATEGORY_KEYWORDS.items():
        for kw in keywords:
            if kw in name:
                return cat
    return None


def main():
    nature_dir = sys.argv[1] if len(sys.argv) > 1 else "."

    files = sorted([
        f for f in os.listdir(nature_dir)
        if os.path.splitext(f)[1].lower() in AUDIO_EXTS
    ])

    if not files:
        print(json.dumps({"error": "no audio files found", "dir": nature_dir}))
        sys.exit(1)

    results = []
    for f in files:
        path = os.path.join(nature_dir, f)
        cat = detect_category(f)
        dur = get_duration(path)
        results.append({
            "filename": f,
            "category": cat,
            "duration_s": round(dur, 1),
            "size_mb": round(os.path.getsize(path) / 1024 / 1024, 1),
            "needs_category": cat is None,
        })

    summary = {
        "total": len(results),
        "categorized": sum(1 for r in results if r["category"]),
        "uncategorized": sum(1 for r in results if not r["category"]),
        "files": results,
    }
    print(json.dumps(summary, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
