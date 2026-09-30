#!/usr/bin/env python3
"""
energy_analyze.py — 音频情绪张力分析，找出能量最高的片段

用于 beat-sync-editor skill 的音频预处理步骤：
识别音频中情绪张力最强的区域，并计算若干目标时长下的最佳裁剪窗口。

Usage:
    python energy_analyze.py <audio_file> [options]

Options:
    --targets       目标时长列表（秒），逗号分隔，默认 "15,30,60"
    --top-n         返回前 N 个候选区间（默认 1）
    --out           输出格式：json（默认）| text

Output (JSON):
    {
      "total_duration": 202.08,
      "bpm": 143.55,
      "energy_peak": 87.3,          # 能量最高点时间（秒）
      "sections": [                 # 能量分段（高→低排序）
        {"start": 72.0, "end": 136.0, "energy_score": 0.94, "label": "高能段"},
        ...
      ],
      "trim_options": [             # 各目标时长的最佳裁剪方案
        {
          "target_duration": 15,
          "start": 80.1,
          "end": 95.1,
          "energy_score": 0.97,
          "description": "最强节拍爆发区（副歌核心）"
        },
        {
          "target_duration": 30,
          "start": 72.0,
          "end": 102.0,
          "energy_score": 0.95,
          "description": "副歌完整段落"
        },
        ...
      ]
    }
"""

import sys
import json
import argparse


def analyze_energy(audio_path, target_durations=None, top_n=1):
    try:
        import librosa
        import numpy as np
    except ImportError:
        print("ERROR: librosa not installed. Run: pip install librosa", file=sys.stderr)
        sys.exit(1)

    if target_durations is None:
        target_durations = [15, 30, 60]

    # 加载音频
    y, sr = librosa.load(audio_path, mono=True)
    total_duration = librosa.get_duration(y=y, sr=sr)

    # ── 1. 多维度能量特征 ──────────────────────────────────────────────
    hop_length = 512

    # RMS 能量（响度）
    rms = librosa.feature.rms(y=y, hop_length=hop_length)[0]

    # 频谱质心（音色明亮度）—— 高能量段通常质心更高
    centroid = librosa.feature.spectral_centroid(y=y, sr=sr, hop_length=hop_length)[0]

    # Onset 强度（节拍冲击感）
    onset_env = librosa.onset.onset_strength(y=y, sr=sr, hop_length=hop_length)

    # 归一化各特征到 [0, 1]
    def norm(x):
        mn, mx = x.min(), x.max()
        return (x - mn) / (mx - mn + 1e-8)

    rms_n = norm(rms)
    cent_n = norm(centroid)
    onset_n = norm(onset_env)

    # 综合情绪张力分数（加权求和）
    # 响度权重最高，节拍冲击其次，音色明亮度辅助
    energy_score = 0.5 * rms_n + 0.3 * onset_n + 0.2 * cent_n

    # 帧时间轴
    frame_times = librosa.frames_to_time(
        np.arange(len(energy_score)), sr=sr, hop_length=hop_length
    )

    # ── 2. 找能量峰值点 ───────────────────────────────────────────────
    peak_frame = int(np.argmax(energy_score))
    energy_peak = float(frame_times[peak_frame])

    # ── 3. 结构分段（用频谱聚类识别段落边界）─────────────────────────
    try:
        # 使用 MFCC 做结构分析
        mfcc = librosa.feature.mfcc(y=y, sr=sr, n_mfcc=12, hop_length=hop_length)
        # 检测边界
        bounds = librosa.segment.agglomerative(mfcc, k=min(8, int(total_duration / 20)))
        bound_times = librosa.frames_to_time(bounds, sr=sr, hop_length=hop_length).tolist()
        # 加首尾
        segment_boundaries = sorted(set([0.0] + bound_times + [total_duration]))
    except Exception:
        # 降级：按 20s 均匀分段
        n_segs = max(3, int(total_duration / 20))
        segment_boundaries = [i * total_duration / n_segs for i in range(n_segs + 1)]

    # 计算每个段落的平均能量分数
    sections_raw = []
    for i in range(len(segment_boundaries) - 1):
        seg_start = segment_boundaries[i]
        seg_end = segment_boundaries[i + 1]
        if seg_end - seg_start < 2.0:
            continue
        # 找该时间范围内的帧
        mask = (frame_times >= seg_start) & (frame_times < seg_end)
        if mask.sum() == 0:
            continue
        seg_score = float(energy_score[mask].mean())
        sections_raw.append({
            "start": round(seg_start, 2),
            "end": round(seg_end, 2),
            "energy_score": round(seg_score, 4),
        })

    # 按能量排序，加标签
    sections_raw.sort(key=lambda x: x["energy_score"], reverse=True)
    labels = ["高能段（副歌/高潮）", "次高能段", "中能段", "低能段（前奏/间奏）"]
    sections = []
    for idx, s in enumerate(sections_raw):
        s["label"] = labels[min(idx, len(labels) - 1)]
        sections.append(s)

    # ── 4. 为每个目标时长计算最佳裁剪窗口 ───────────────────────────
    trim_options = []
    frame_count = len(energy_score)

    for target_dur in target_durations:
        if target_dur >= total_duration:
            # 目标时长超过音频总长，直接用全曲
            trim_options.append({
                "target_duration": target_dur,
                "start": 0.0,
                "end": round(total_duration, 2),
                "actual_duration": round(total_duration, 2),
                "energy_score": round(float(energy_score.mean()), 4),
                "description": "使用完整音频（目标时长超过总时长）"
            })
            continue

        # 滑动窗口：找窗口内平均能量最高的起始点
        window_frames = int(target_dur * sr / hop_length)
        best_score = -1.0
        best_start_frame = 0

        # 步长取 0.5s 对应的帧数，平衡精度与速度
        step = max(1, int(0.5 * sr / hop_length))

        for start_f in range(0, frame_count - window_frames, step):
            end_f = start_f + window_frames
            window_score = float(energy_score[start_f:end_f].mean())
            if window_score > best_score:
                best_score = window_score
                best_start_frame = start_f

        best_start_time = float(frame_times[best_start_frame])
        best_end_time = min(best_start_time + target_dur, total_duration)

        # 生成描述
        # 判断该窗口是否覆盖了能量峰值
        covers_peak = best_start_time <= energy_peak <= best_end_time
        if covers_peak:
            desc = f"覆盖最强爆发点（{energy_peak:.1f}s），情绪张力最高"
        elif best_score >= 0.7:
            desc = "高能副歌核心区域"
        elif best_score >= 0.5:
            desc = "中高能量段落"
        else:
            desc = "最优可用段落"

        trim_options.append({
            "target_duration": target_dur,
            "start": round(best_start_time, 2),
            "end": round(best_end_time, 2),
            "actual_duration": round(best_end_time - best_start_time, 2),
            "energy_score": round(best_score, 4),
            "description": desc
        })

    # 按目标时长排序
    trim_options.sort(key=lambda x: x["target_duration"])

    # ── 5. BPM（快速估算）────────────────────────────────────────────
    try:
        import numpy as np
        tempo_val = librosa.beat.tempo(y=y, sr=sr)
        bpm = round(float(np.asarray(tempo_val).flat[0]), 2)
    except Exception:
        bpm = None

    return {
        "total_duration": round(total_duration, 2),
        "bpm": bpm,
        "energy_peak": round(energy_peak, 2),
        "sections": sections,
        "trim_options": trim_options,
    }


def main():
    parser = argparse.ArgumentParser(description="Audio energy analysis for beat-sync-editor")
    parser.add_argument("audio_file", help="Path to audio file")
    parser.add_argument(
        "--targets",
        type=str,
        default="15,30,60",
        help="Target durations in seconds, comma-separated (default: 15,30,60)"
    )
    parser.add_argument("--top-n", type=int, default=1, dest="top_n")
    parser.add_argument("--out", choices=["json", "text"], default="json")
    args = parser.parse_args()

    try:
        target_durations = [int(x.strip()) for x in args.targets.split(",") if x.strip()]
    except ValueError:
        print("ERROR: --targets must be comma-separated integers (e.g. '15,30,60')", file=sys.stderr)
        sys.exit(1)

    result = analyze_energy(
        audio_path=args.audio_file,
        target_durations=target_durations,
        top_n=args.top_n,
    )

    if args.out == "text":
        print(f"总时长: {result['total_duration']}s | BPM: {result['bpm']}")
        print(f"能量峰值点: {result['energy_peak']}s")
        print("\n=== 裁剪方案 ===")
        for opt in result["trim_options"]:
            print(f"  [{opt['target_duration']}s] {opt['start']}s → {opt['end']}s | 张力:{opt['energy_score']:.2f} | {opt['description']}")
    else:
        print(json.dumps(result, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
