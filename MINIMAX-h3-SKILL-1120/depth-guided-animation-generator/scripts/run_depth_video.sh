#!/usr/bin/env bash
set -euo pipefail

# One-command depth video extraction for Hub users.
# Usage:
#   bash scripts/run_depth_video.sh "/path/to/input.mp4" "/path/to/project/depth_video.mp4"
# Optional:
#   HF_ENDPOINT=https://hf-mirror.com bash scripts/run_depth_video.sh input.mp4 output.mp4
#   INVERT=1 bash scripts/run_depth_video.sh input.mp4 output.mp4

if [ "$#" -lt 1 ]; then
  echo "Usage: bash scripts/run_depth_video.sh <input_video> [output_video]"
  exit 1
fi

INPUT_VIDEO="$1"
OUTPUT_VIDEO="${2:-depth_video.mp4}"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SKILL_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
MODEL_DIR="${MODEL_DIR:-$SKILL_DIR/models/depth-anything-v2-small}"

echo "Checking/verifying depth model..."
MODEL_DIR="$MODEL_DIR" bash "$SCRIPT_DIR/setup_depth_models.sh"

EXTRA_ARGS=()
if [ "${INVERT:-0}" = "1" ]; then
  EXTRA_ARGS+=(--invert)
fi

mkdir -p "$(dirname "$OUTPUT_VIDEO")"
if [ "${INVERT:-0}" = "1" ]; then
  python3 "$SCRIPT_DIR/extract_depth_video.py" "$INPUT_VIDEO" --model-dir "$MODEL_DIR" --output "$OUTPUT_VIDEO" --invert
else
  python3 "$SCRIPT_DIR/extract_depth_video.py" "$INPUT_VIDEO" --model-dir "$MODEL_DIR" --output "$OUTPUT_VIDEO"
fi

echo "✅ Done. Output: $OUTPUT_VIDEO"
echo "Return to Hub and tell the assistant: 已生成，路径是 $OUTPUT_VIDEO"
