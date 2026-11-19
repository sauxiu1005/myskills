#!/usr/bin/env bash
# new_project.sh <target-dir> [--keep-demo]
# Scaffolds a watercolor-ink-animation project from the skill's template, checks the toolchain, then installs npm deps.
#   --keep-demo   keep the example scene hooked up in studio.html
#   -h, --help    show this help
# Env: NPM="node /path/to/npm-cli.js" if npm is not on PATH; CHROME_PATH / FFMPEG_PATH for non-standard installs.
# Exit codes: 0 ok · 1 usage error · 2 missing dependency.
set -euo pipefail
usage() { sed -n '2,7p' "$0" | sed 's/^# \{0,1\}//'; }
SKILL_DIR="$(cd "$(dirname "$0")/.." && pwd)"
TARGET="" KEEP_DEMO=""
for a in "$@"; do
  case "$a" in
    -h|--help) usage; exit 0 ;;
    --keep-demo) KEEP_DEMO=1 ;;
    -*) echo "error: unknown option $a" >&2; usage >&2; exit 1 ;;
    *) [ -z "$TARGET" ] && TARGET="$a" || { echo "error: only one target dir" >&2; exit 1; } ;;
  esac
done
[ -n "$TARGET" ] || { echo "error: missing <target-dir>" >&2; usage >&2; exit 1; }
if [ -e "$TARGET/studio.html" ]; then echo "error: $TARGET already has a studio.html; not overwriting" >&2; exit 1; fi

echo "== toolchain"
MISSING=0
if command -v node >/dev/null; then echo "node   $(node -v)"; else echo "MISSING: node (Node.js 18+: https://nodejs.org or brew install node)"; MISSING=1; fi
NPM_CMD="${NPM:-}"
if [ -z "$NPM_CMD" ] && command -v npm >/dev/null; then NPM_CMD=npm; fi
if [ -n "$NPM_CMD" ]; then echo "npm    $NPM_CMD"; else echo "MISSING: npm (comes with Node.js; or set NPM=\"node /path/to/npm-cli.js\")"; MISSING=1; fi
FF="${FFMPEG_PATH:-$(command -v ffmpeg || true)}"
if [ -n "$FF" ] && [ -x "$FF" ]; then echo "ffmpeg $FF"; else echo "MISSING: ffmpeg (brew install ffmpeg · sudo apt install ffmpeg; or set FFMPEG_PATH) — needed only to make MP4s"; FF_MISSING=1; fi
FOUND=""
for c in "${CHROME_PATH:-}" "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" /usr/bin/google-chrome /usr/bin/chromium /usr/bin/chromium-browser; do
  [ -n "$c" ] && [ -x "$c" ] && { echo "chrome $c"; FOUND=1; break; }
done
[ -n "$FOUND" ] || { echo "MISSING: Chrome/Chromium (install Google Chrome, or set CHROME_PATH)"; MISSING=1; }
if [ "$MISSING" = 1 ]; then echo "error: install the missing tools above, then re-run" >&2; exit 2; fi

mkdir -p "$TARGET"
rsync -a "$SKILL_DIR/template/" "$TARGET/"
mkdir -p "$TARGET/assets" "$TARGET/out/check"
# The demo is an example, not a template: unless asked, unhook it so the new video starts clean.
if [ -z "$KEEP_DEMO" ]; then
  sed -i.bak 's|<script src="src/scenes/demo.js"></script>|<!-- <script src="src/scenes/demo.js"></script>  (example only) -->|' "$TARGET/studio.html" && rm -f "$TARGET/studio.html.bak"
fi
cd "$TARGET"
echo "== installing p5, p5.brush, puppeteer-core"
if ! $NPM_CMD install --silent; then echo "error: npm install failed (network?). Fix it and run '$NPM_CMD install' in $TARGET" >&2; exit 2; fi
[ -n "${FF_MISSING:-}" ] && echo "note: ffmpeg is still missing; contact sheets work, MP4 export will not until it is installed"
echo "== ready: $TARGET"
