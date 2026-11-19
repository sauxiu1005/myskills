#!/bin/sh
# 打包轻量版：去掉 .venv / .browser / node_modules / core/assets 和缓存，用户首次使用时运行 scripts/setup.sh 安装。
# 用法：sh scripts/pack-lite.sh [输出 zip 路径]
set -e
SKILL_DIR=$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd); NAME=$(basename "$SKILL_DIR")
OUT=${1:-"$PWD/$NAME-lite.zip"}; rm -f "$OUT"
cd "$(dirname "$SKILL_DIR")"
zip -qr "$OUT" "$NAME" -x "$NAME/engine/.venv/*" "$NAME/engine/.browser/*" "$NAME/engine/node_modules/*" \
  "$NAME/engine/core/assets/*" "*/__pycache__/*" "*.DS_Store" "*.pyc"
ls -lh "$OUT" | awk '{print "lite:", $5, $9}'
