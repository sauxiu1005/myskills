#!/usr/bin/env python3
"""
Extract an algorithmic depth-map video from an input video using Depth Anything V2 HF.

Output convention:
- white = near
- black = far
- single-channel depth is encoded as grayscale RGB mp4 for preview/control use

Example:
  python scripts/extract_depth_video.py input.mp4 --model-dir ./models/depth-anything-v2-small --output depth_video.mp4
"""
import argparse
import os
import shutil
import subprocess
import tempfile
from pathlib import Path

import cv2
import numpy as np
import torch
from PIL import Image
from transformers import AutoImageProcessor, AutoModelForDepthEstimation


def run_ffmpeg_mux(video_no_audio: Path, source_video: Path, output: Path):
    """Try to copy source timing/audio metadata minimally; output remains silent by default."""
    # Keep silent output. Use ffmpeg only to ensure broadly compatible yuv420p mp4.
    tmp = output.with_suffix('.tmp.mp4')
    cmd = [
        'ffmpeg', '-y', '-i', str(video_no_audio),
        '-an', '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', str(tmp)
    ]
    subprocess.run(cmd, check=True)
    tmp.replace(output)


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('input', help='Input video path')
    parser.add_argument('--model-dir', default='./models/depth-anything-v2-small', help='Local HF model directory')
    parser.add_argument('--output', default='depth_video.mp4', help='Output mp4 path')
    parser.add_argument('--max-frames', type=int, default=0, help='Debug limit; 0 = all frames')
    parser.add_argument('--smooth', type=float, default=0.25, help='Temporal smoothing strength 0..1; 0 disables')
    parser.add_argument('--invert', action='store_true', help='Use black=near, white=far instead of default white=near')
    args = parser.parse_args()

    input_path = Path(args.input).expanduser().resolve()
    output_path = Path(args.output).expanduser().resolve()
    model_dir = Path(args.model_dir).expanduser().resolve()

    if not input_path.exists():
        raise FileNotFoundError(input_path)
    if not model_dir.exists():
        raise FileNotFoundError(f'Model dir not found: {model_dir}. Run scripts/setup_depth_models.sh first.')

    device = 'cuda' if torch.cuda.is_available() else ('mps' if torch.backends.mps.is_available() else 'cpu')
    dtype = torch.float16 if device == 'cuda' else torch.float32
    print(f'Loading model from {model_dir} on {device}...')
    processor = AutoImageProcessor.from_pretrained(str(model_dir))
    model = AutoModelForDepthEstimation.from_pretrained(str(model_dir), torch_dtype=dtype).to(device).eval()

    cap = cv2.VideoCapture(str(input_path))
    if not cap.isOpened():
        raise RuntimeError(f'Cannot open video: {input_path}')

    fps = cap.get(cv2.CAP_PROP_FPS) or 24
    width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
    height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
    total = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    if args.max_frames and args.max_frames > 0:
        total = min(total, args.max_frames)

    print(f'Video: {width}x{height}, fps={fps:.3f}, frames={total}')

    tmpdir = Path(tempfile.mkdtemp(prefix='depth_extract_'))
    depth_paths = []
    global_min, global_max = float('inf'), float('-inf')

    prev = None
    try:
        # Pass 1: infer and store float depth maps; collect global min/max.
        idx = 0
        with torch.inference_mode():
            while idx < total:
                ok, frame_bgr = cap.read()
                if not ok:
                    break
                frame_rgb = cv2.cvtColor(frame_bgr, cv2.COLOR_BGR2RGB)
                pil = Image.fromarray(frame_rgb)
                inputs = processor(images=pil, return_tensors='pt')
                inputs = {k: v.to(device) for k, v in inputs.items()}
                outputs = model(**inputs)
                pred = outputs.predicted_depth
                pred = torch.nn.functional.interpolate(
                    pred.unsqueeze(1), size=(height, width), mode='bicubic', align_corners=False
                ).squeeze().float().cpu().numpy()

                # Depth Anything predicted_depth is relative. Larger often means nearer; normalize later.
                if args.smooth > 0 and prev is not None:
                    pred = (1.0 - args.smooth) * pred + args.smooth * prev
                prev = pred

                p = tmpdir / f'depth_{idx:06d}.npy'
                np.save(p, pred.astype(np.float32))
                depth_paths.append(p)
                global_min = min(global_min, float(np.percentile(pred, 1)))
                global_max = max(global_max, float(np.percentile(pred, 99)))
                if idx % 20 == 0:
                    print(f'Inferred {idx}/{total}')
                idx += 1

        cap.release()
        if not depth_paths:
            raise RuntimeError('No frames processed')

        if global_max <= global_min:
            global_min, global_max = 0.0, 1.0
        print(f'Global depth range p1..p99: {global_min:.5f}..{global_max:.5f}')

        # Pass 2: global normalization and encode mp4.
        fourcc = cv2.VideoWriter_fourcc(*'mp4v')
        raw_mp4 = tmpdir / 'raw_depth.mp4'
        writer = cv2.VideoWriter(str(raw_mp4), fourcc, fps, (width, height), isColor=True)
        if not writer.isOpened():
            raise RuntimeError('Cannot open VideoWriter')

        for i, p in enumerate(depth_paths):
            d = np.load(p)
            x = (d - global_min) / (global_max - global_min)
            x = np.clip(x, 0, 1)
            # Default white=near. If model direction appears inverted for a specific source, use --invert.
            if args.invert:
                x = 1.0 - x
            gray = (x * 255).astype(np.uint8)
            rgb = cv2.cvtColor(gray, cv2.COLOR_GRAY2BGR)
            writer.write(rgb)
        writer.release()

        if shutil.which('ffmpeg'):
            run_ffmpeg_mux(raw_mp4, input_path, output_path)
        else:
            shutil.copy2(raw_mp4, output_path)

        print(f'✅ Wrote depth video: {output_path}')
        print('Convention: white=near, black=far (unless --invert was used). Drag this file back to Hub canvas/chat.')
    finally:
        shutil.rmtree(tmpdir, ignore_errors=True)


if __name__ == '__main__':
    main()
