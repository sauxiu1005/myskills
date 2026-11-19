#!/usr/bin/env python3
"""角色姿态小样 + 自查：python3 tools/char_sheet.py characters.owner [输出.png]
读取模块里的 POSES，逐像素放大成一张小样，并打印每材质色阶数与孤立像素。开工前先跑它、看一眼再继续。"""
import os, sys, importlib
PROJ = os.path.dirname(os.path.dirname(os.path.abspath(__file__))); sys.path.insert(0, PROJ)
from engine.sprite import sheet, lint

mod = sys.argv[1] if len(sys.argv) > 1 else sys.exit("用法：char_sheet.py characters.<角色模块> [out.png]")
if mod.endswith("_TEMPLATE"):
    sys.exit("characters/_TEMPLATE.py 只是空骨架，请复制改名并按本主题手画角色。")
m = importlib.import_module(mod)
out = sys.argv[2] if len(sys.argv) > 2 else os.path.join(PROJ, "..", "review", "char_%s.png" % mod.split(".")[-1])
os.makedirs(os.path.dirname(os.path.abspath(out)), exist_ok=True)
bad = 0
for sp in m.POSES:
    rep, issues = lint(sp); print(rep); bad += len(issues)
    for i in issues:
        print("  ! " + i)
print("SHEET", os.path.abspath(sheet(m.POSES, out)), "ISSUES", bad)
