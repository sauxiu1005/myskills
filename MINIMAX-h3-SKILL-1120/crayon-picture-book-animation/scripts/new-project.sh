#!/bin/sh
# 新建一个蜡笔绘本影片项目：sh new-project.sh <项目目录>
# 复制渲染引擎（gl.js / crayon.js / rig.js / index.html / 字体）和空白的 main.js、build.sh；
# 角色、场景、时间线、配乐、混音由每部片子自己写（可参考 examples/ 里的写法，不要照搬故事）。
set -e
[ -n "$1" ] || { echo "用法: sh new-project.sh <项目目录>"; exit 2; }
HERE=$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)
D=$1; [ -e "$D/film.js" ] && { echo "✗ $D 已经是一个项目"; exit 1; }
mkdir -p "$D/fonts" "$D/voices" "$D/music/stems" "$D/out" "$D/stills"
cp "$HERE/starter/gl.js" "$HERE/starter/crayon.js" "$HERE/starter/rig.js" "$HERE/starter/index.html" "$D/"
cp "$HERE/starter/fonts/"* "$D/fonts/"
cp "$HERE/starter/main.js" "$D/main.js"
printf '%s\n' "$HERE" > "$D/.skill-path"
cp "$HERE/starter/build.sh" "$D/build.sh"; chmod +x "$D/build.sh"
[ -f "$D/voices/dur.json" ] || echo '{}' > "$D/voices/dur.json"
echo "✓ 项目已建好：$D"
echo "  接下来写 TREATMENT.md → pal.js / chars.js / world.js / sheet.js / film.js → lines.json → music/score.py → mix.py"
