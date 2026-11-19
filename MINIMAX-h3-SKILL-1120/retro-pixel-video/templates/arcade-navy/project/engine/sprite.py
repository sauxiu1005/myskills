"""网格真像素角色（sprite）：在实际逻辑网格上用字符矩阵逐像素画剪影与像素簇。

为什么：矢量/圆滑卡通画完再降采样，会出现细碎尖发、糊边和大块白眼镜；字符矩阵让每个像素都是有意落下的。
  rows   : 字符串列表，'.' 透明；每个字符在 legend 里映射到 (ramp, step)
  anchor : (col,row) 接触点（脚底中心 / 后脑贴枕处），draw 时对齐到 (x,y)
  face   : 1 原样，-1 水平镜像（镜像不重画，保证同一角色两侧一致）
"""
import numpy as np
from .canvas import C, T, PAL


class Sprite:
    def __init__(self, rows, legend, anchor=None, name="", details="ew"):
        w = max(len(r) for r in rows)
        self.rows = [r.ljust(w, ".") for r in rows]
        self.legend, self.w, self.h, self.name = legend, w, len(rows), name
        self.anchor = anchor or (w // 2, self.h - 1)
        self.details = details          # 有意的单像素细节（眼白/瞳孔），自查时不算噪点

    def variant(self, patch=None, legend=None, name=None):
        """patch = {(col,row): ch}：同一身份的小改（睁眼/闭眼/张嘴），不另画一套。"""
        rows = [list(r) for r in self.rows]
        for (c, r), ch in (patch or {}).items():
            rows[r][c] = ch
        return Sprite(["".join(r) for r in rows], dict(self.legend, **(legend or {})), self.anchor, name or self.name, self.details)

    def draw(self, cv, x, y, face=1, clip=None):
        ax, ay = self.anchor
        for j, row in enumerate(self.rows):
            for i, ch in enumerate(row):
                if ch == ".":
                    continue
                px = x + (i - ax if face >= 0 else ax - i)
                py = y + j - ay
                if 0 <= px < cv.w and 0 <= py < cv.h and (clip is None or clip[py, px]):
                    cv.a[py, px] = C(*self.legend[ch])
        return (x - ax, y - ay, self.w, self.h)


def outline(rows, ch="o"):
    """只写填色、不画轮廓：按 4 邻接在外侧补 1 像素墨线（画布四周各扩 1 格）。轮廓阶梯由填色形状决定，干净不打结。"""
    h, w = len(rows), max(len(r) for r in rows)
    g = [list("." * (w + 2))] + [list("." + r.ljust(w, ".") + ".") for r in rows] + [list("." * (w + 2))]
    out = [r[:] for r in g]
    for j in range(h + 2):
        for i in range(w + 2):
            if g[j][i] == "." and any(0 <= j + dj < h + 2 and 0 <= i + di < w + 2 and g[j + dj][i + di] != "."
                                      for dj, di in ((-1, 0), (1, 0), (0, -1), (0, 1))):
                out[j][i] = ch
    return ["".join(r) for r in out]


def lint(sp):
    """自查：每材质色阶数、孤立像素（四邻全异色的单点，常是噪点或碎发）、尺寸。返回 (报告, 问题列表)。"""
    used = {}
    for row in sp.rows:
        for ch in row:
            if ch != ".":
                r, s = sp.legend[ch]
                used.setdefault(r, set()).add(s)
    g = np.array([list(r) for r in sp.rows])
    iso = []
    for j in range(sp.h):
        for i in range(sp.w):
            ch = g[j, i]
            if ch == "." or ch in sp.details or sp.legend[ch][0] == "ink":
                continue
            nb = [g[jj, ii] for jj, ii in ((j - 1, i), (j + 1, i), (j, i - 1), (j, i + 1)) if 0 <= jj < sp.h and 0 <= ii < sp.w]
            if nb and all(n != ch for n in nb) and not any(sp.legend.get(n, ("",))[0] == sp.legend[ch][0] for n in nb if n != "."):
                iso.append((i, j, ch))
    issues = ["材质 %s 用了 %d 阶（上限 3）" % (r, len(s)) for r, s in used.items() if r != "ink" and len(s) > 3]
    issues += ["孤立像素 %s" % (iso,)] if iso else []
    rep = "%s %dx%d 材质阶数 %s" % (sp.name, sp.w, sp.h, {r: len(s) for r, s in used.items()})
    return rep, issues


def sheet(sprites, path, scale=8, bg=("night", 1), pal_map="街机", pad=6):
    """角色姿态小样：所有姿态按逻辑像素 ×scale 最近邻放大并排，附 1px 网格，供开工前自查。"""
    from PIL import Image
    W = sum(s.w + pad for s in sprites) + pad
    H = max(s.h for s in sprites) + pad * 2
    a = np.full((H, W), C(*bg), np.uint8)
    x = pad
    for s in sprites:
        for j, row in enumerate(s.rows):
            for i, ch in enumerate(row):
                if ch != ".":
                    a[pad + (H - pad * 2 - s.h) + j, x + i] = C(*s.legend[ch])
        x += s.w + pad
    m = PAL.maps.get(pal_map) or next(iter(PAL.maps.values()))
    rgb = PAL.rgb[m["base"][a]]
    im = Image.fromarray(rgb).resize((W * scale, H * scale), Image.NEAREST)
    g = np.array(im)
    g[::scale, :, :] = (g[::scale, :, :] * 0.8).astype(np.uint8)
    g[:, ::scale, :] = (g[:, ::scale, :] * 0.8).astype(np.uint8)
    Image.fromarray(g).save(path)
    return path
