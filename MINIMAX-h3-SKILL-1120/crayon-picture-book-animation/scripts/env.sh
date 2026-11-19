# 运行任何引擎命令前先 source：  . "<skill dir>/scripts/env.sh"
# 设置 LIB（本 Skill 自带引擎目录），接入 MiniMax Design 自带的 ffmpeg、宿主 Python/Node，以及随附的无界面浏览器。
_CPB_DIR=${SKILL_DIR:-$(CDPATH= cd -- "$(dirname -- "${BASH_SOURCE:-$0}")/.." 2>/dev/null && pwd)}
[ -d "$_CPB_DIR/engine/core/render" ] || {
  echo '[env] 无法定位引擎；请将 SKILL_DIR 设为实际 Skill 安装目录后再加载 env.sh' >&2
  return 1
}
SKILL_DIR="$_CPB_DIR"; LIB="$_CPB_DIR/engine"; export SKILL_DIR LIB
for _ff in "/Applications/MiniMax Design 2.app/Contents/Resources/ffmpeg" "/Applications/MiniMax Design.app/Contents/Resources/ffmpeg"; do
  if [ -x "$_ff/ffmpeg" ]; then PATH="$_ff:$PATH"; break; fi
done
for _rt in "$HOME/.hub/runtimes/node-dist/bin" "$HOME/.hub/runtimes/python/bin"; do
  [ -d "$_rt" ] && case ":$PATH:" in *":$_rt:"*) ;; *) PATH="$PATH:$_rt" ;; esac
done
export PATH
for _hs in "$LIB"/.browser/chrome-headless-shell-*/chrome-headless-shell "$LIB"/.browser/*/chrome-headless-shell-*/chrome-headless-shell; do
  [ -x "$_hs" ] && { PLAYWRIGHT_CHROME="$_hs"; export PLAYWRIGHT_CHROME; break; }
done
[ -d "$LIB/.venv" ] && [ -d "$LIB/node_modules" ] && [ -n "${PLAYWRIGHT_CHROME:-}" ] || echo "[env] 依赖未安装：先运行 sh \"$SKILL_DIR/scripts/setup.sh\"（首次约 750 MB，需联网）" >&2
unset _ff _rt _hs _CPB_DIR
