#!/bin/sh
# 轻量版首次安装：在 engine/ 里装好 Python 依赖(.venv)、Node 依赖(node_modules)和无界面浏览器(.browser)。
# 用法：sh "<skill dir>/scripts/setup.sh"          安装（已装好的部分自动跳过，可重复运行）
#       sh "<skill dir>/scripts/setup.sh" --check  只检查，缺依赖时返回 1
# 先试国内镜像，再试官方源；每个源限时，慢了就换下一个。只装进本 Skill 的 engine/ 目录，不改系统。
set -u
SKILL_DIR=$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd); LIB="$SKILL_DIR/engine"; cd "$LIB" || exit 1
say() { printf '[setup] %s\n' "$*"; }
# 限时执行：超过 $1 秒就结束（某个源慢到不报错时，避免一直卡住）
limit() { s=$1; shift; if command -v perl >/dev/null 2>&1; then perl -e 'alarm shift; exec @ARGV' "$s" "$@"; else "$@"; fi; }

for _rt in "$HOME/.hub/runtimes/node-dist/bin" "$HOME/.hub/runtimes/python/bin"; do [ -d "$_rt" ] && PATH="$_rt:$PATH"; done; export PATH

find_browser() {
  for f in "$LIB"/.browser/chrome-headless-shell-*/chrome-headless-shell "$LIB"/.browser/*/chrome-headless-shell-*/chrome-headless-shell; do
    [ -x "$f" ] && { echo "$f"; return 0; }; done; return 1; }
py_ok() { [ -x .venv/bin/python ] && .venv/bin/python -c "import numpy, scipy, soundfile, soxr, PIL, numba, edge_tts, faster_whisper" 2>/dev/null; }
node_ok() { [ -f node_modules/playwright-core/package.json ] && [ -f node_modules/three/package.json ]; }
ff_ok() { . "$SKILL_DIR/scripts/env.sh" >/dev/null 2>&1; command -v ffmpeg >/dev/null 2>&1; }

if [ "${1:-}" = "--check" ]; then
  ok=0; py_ok || { say "缺 Python 依赖"; ok=1; }; node_ok || { say "缺 Node 依赖"; ok=1; }
  find_browser >/dev/null || { say "缺无界面浏览器"; ok=1; }; ff_ok || { say "找不到 ffmpeg"; ok=1; }
  [ $ok = 0 ] && say "依赖齐全"; exit $ok
fi

# —— Python ——
if py_ok; then say "Python 依赖已就绪，跳过"; else
  PY=""; for c in "$HOME/.hub/runtimes/python/bin/python3" python3.12 python3.13 python3.11 python3; do
    p=$(command -v "$c" 2>/dev/null) || continue
    "$p" -c 'import sys; sys.exit(0 if (3,10) <= sys.version_info[:2] <= (3,13) else 1)' 2>/dev/null && { PY=$p; break; }; done
  [ -n "$PY" ] || { say "需要 Python 3.10–3.13，未找到"; exit 1; }
  say "用 $PY 创建 .venv"; rm -rf .venv; "$PY" -m venv .venv || exit 1
  PKGS="-r requirements.txt -r requirements-music.txt edge-tts faster-whisper av<19"
  done_py=0
  for idx in "https://pypi.tuna.tsinghua.edu.cn/simple" "https://mirrors.aliyun.com/pypi/simple" "https://pypi.org/simple"; do
    for cons in "-c constraints.txt" ""; do
      say "pip 安装（源 $idx ${cons:+，固定版本}）"
      # shellcheck disable=SC2086
      limit 900 .venv/bin/python -m pip install -q --disable-pip-version-check --timeout 20 --retries 2 -i "$idx" $cons $PKGS && py_ok && { done_py=1; break 2; }
    done
  done
  [ $done_py = 1 ] || { say "Python 依赖安装失败，请检查网络后重试"; exit 1; }
  say "Python 依赖完成"
fi

# —— Node ——
command -v node >/dev/null 2>&1 && command -v npm >/dev/null 2>&1 || { say "需要 Node 20+ 和 npm，未找到"; exit 1; }
if node_ok; then say "Node 依赖已就绪，跳过"; else
  done_n=0
  for reg in "https://registry.npmmirror.com" "https://registry.npmjs.org"; do
    say "npm 安装（源 $reg）"
    limit 300 npm ci --omit=dev --no-audit --no-fund --fetch-timeout=60000 --registry "$reg" >/dev/null 2>&1 && node_ok && { done_n=1; break; }
  done
  [ $done_n = 1 ] || { say "Node 依赖安装失败，请检查网络后重试"; exit 1; }
  say "Node 依赖完成"
fi

# —— 无界面浏览器 ——
# 版本取 playwright-core 指定的那一版；用 curl 直接下载（带测速，太慢就换下一个源），解压到 .browser/
if find_browser >/dev/null; then say "无界面浏览器已就绪，跳过"; else
  URL=$(PLAYWRIGHT_BROWSERS_PATH="$LIB/.browser" node node_modules/playwright-core/cli.js install --dry-run chromium-headless-shell 2>/dev/null \
        | awk '/Chrome Headless Shell/{f=1} f && /Download url:/{print $3; exit}')
  [ -n "$URL" ] || { say "无法确定浏览器版本"; exit 1; }
  TAIL=${URL#*/cft/}                      # <版本>/<平台>/chrome-headless-shell-<平台>.zip
  ZIP="$LIB/.browser/shell.zip"; mkdir -p "$LIB/.browser"; done_b=0
  for src in "https://cdn.npmmirror.com/binaries/chrome-for-testing/$TAIL" \
             "https://storage.googleapis.com/chrome-for-testing-public/$TAIL" "$URL"; do
    say "下载无界面浏览器：$src"
    curl -fL --connect-timeout 15 --speed-limit 300000 --speed-time 20 -m 900 -o "$ZIP" "$src" 2>/dev/null \
      && unzip -qo "$ZIP" -d "$LIB/.browser" && find_browser >/dev/null && { done_b=1; break; }
    say "这个源太慢或失败，换下一个"
  done
  rm -f "$ZIP"
  [ $done_b = 1 ] || { say "浏览器下载失败，请检查网络后重试"; exit 1; }
  xattr -dr com.apple.quarantine "$LIB/.browser" 2>/dev/null || true
  say "无界面浏览器完成：$(find_browser)"
fi

ff_ok || say "提示：找不到 ffmpeg。MiniMax Design 自带 ffmpeg；独立使用时请自行安装 ffmpeg"
sh "$SKILL_DIR/scripts/setup.sh" --check
