#!/usr/bin/env bash
set -euo pipefail

# Setup Depth Anything V2 Small for the Hub depth-guided-animation-generator Skill.
# Installation succeeds only when the local model directory is loadable by
# AutoImageProcessor / AutoModelForDepthEstimation.

MODEL_DIR="${MODEL_DIR:-./models/depth-anything-v2-small}"
HF_MODEL_ID="${HF_MODEL_ID:-depth-anything/Depth-Anything-V2-Small-hf}"
export PIP_INDEX_URL="${PIP_INDEX_URL:-https://pypi.tuna.tsinghua.edu.cn/simple}"
export HF_ENDPOINT="${HF_ENDPOINT:-https://hf-mirror.com}"
export HF_HUB_DISABLE_XET="${HF_HUB_DISABLE_XET:-1}"
PIP_FALLBACK_INDEX_URL="${PIP_FALLBACK_INDEX_URL:-https://pypi.org/simple}"
HF_FALLBACK_ENDPOINT="${HF_FALLBACK_ENDPOINT:-https://huggingface.co}"

required_files=(config.json preprocessor_config.json model.safetensors)

is_model_complete() {
  for f in "${required_files[@]}"; do
    [ -s "$MODEL_DIR/$f" ] || return 1
  done
  return 0
}

verify_model_loadable() {
  python3 - <<'PYVERIFY'
from pathlib import Path
from transformers import AutoImageProcessor, AutoModelForDepthEstimation
model_dir = Path(__import__('os').environ.get('MODEL_DIR_FOR_VERIFY')).expanduser().resolve()
AutoImageProcessor.from_pretrained(str(model_dir))
AutoModelForDepthEstimation.from_pretrained(str(model_dir))
print('Verified loadable model:', model_dir)
PYVERIFY
}

export MODEL_DIR_FOR_VERIFY="$MODEL_DIR"
echo "Model output dir: $MODEL_DIR"
echo "Using PIP_INDEX_URL=$PIP_INDEX_URL"
echo "Using HF_ENDPOINT=$HF_ENDPOINT"
echo "Using HF_HUB_DISABLE_XET=$HF_HUB_DISABLE_XET"

if is_model_complete; then
  echo "Existing model files found. Verifying..."
  if verify_model_loadable; then
    echo "✅ Depth model is already ready."
    exit 0
  fi
  echo "⚠️ Existing model files are incomplete or not loadable; re-downloading."
fi

echo "Installing Python dependencies..."
set +e
python3 -m pip install --timeout 30 --retries 2 -U huggingface_hub transformers accelerate safetensors torch torchvision opencv-python pillow numpy
PIP_STATUS=$?
set -e
if [ "$PIP_STATUS" -ne 0 ]; then
  echo "⚠️ pip install failed/slow, switching to $PIP_FALLBACK_INDEX_URL"
  export PIP_INDEX_URL="$PIP_FALLBACK_INDEX_URL"
  python3 -m pip install --timeout 60 --retries 5 -U huggingface_hub transformers accelerate safetensors torch torchvision opencv-python pillow numpy
fi

mkdir -p "$MODEL_DIR"

download_hf() {
  local endpoint="$1"
  echo "Downloading HF-compatible model via $endpoint: $HF_MODEL_ID"
  for file in config.json preprocessor_config.json model.safetensors; do
    echo "Downloading $file"
    HF_ENDPOINT="$endpoint" HF_HUB_DISABLE_XET=1 hf download "$HF_MODEL_ID" "$file" --local-dir "$MODEL_DIR" || return $?
  done
}

set +e
download_hf "$HF_ENDPOINT"
DL_STATUS=$?
if [ "$DL_STATUS" -ne 0 ] && [ "$HF_ENDPOINT" != "$HF_FALLBACK_ENDPOINT" ]; then
  echo "⚠️ Primary endpoint failed, trying fallback: $HF_FALLBACK_ENDPOINT"
  download_hf "$HF_FALLBACK_ENDPOINT"
  DL_STATUS=$?
fi
set -e

if [ "$DL_STATUS" -ne 0 ]; then
  echo "❌ Depth model download failed."
  echo "This Skill requires an HF-compatible Depth Anything V2 Small model directory containing:"
  printf '  - %s\n' "${required_files[@]}"
  echo "You can retry later, or manually place those files under: $MODEL_DIR"
  exit "$DL_STATUS"
fi

if ! is_model_complete; then
  echo "❌ Download finished but required files are still missing."
  printf 'Required: %s\n' "${required_files[*]}"
  exit 2
fi

verify_model_loadable

echo "✅ Depth model is ready at $MODEL_DIR"
echo "Next: run scripts/run_depth_video.sh on your video."
