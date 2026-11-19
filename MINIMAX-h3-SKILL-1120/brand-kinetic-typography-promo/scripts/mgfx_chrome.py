"""Liquid-chrome shading: continuous surface normals + a black studio environment with white strip lights,
accent glow on inner/centre faces, contact darkening, bloom. Shapes: swept tubes, inflated paths (stars), spheres."""
import math
import numpy as np, skia

SS = 2

def _sst(x, a, b): x = np.clip((x - a) / (b - a), 0, 1); return x * x * (3 - 2 * x)

def env(nx, ny, nz, dark=False):
    """Black studio with strip lights. Normals in screen space (x right, y down, z to viewer). Returns luminance 0..~1.3."""
    rx, ry, rz = 2 * nz * nx, 2 * nz * ny, 2 * nz * nz - 1
    th = np.arctan2(rx, rz); el = np.arcsin(np.clip(-ry, -1, 1))
    base = 0.035 + 0.09 * _sst(el, -0.2, 1.2)
    def vstrip(t0, w, e0, e1, k=1.0): return k * (1 - _sst(np.abs(th - t0), w * 0.6, w)) * _sst(el, e0, e0 + 0.08) * (1 - _sst(el, e1 - 0.08, e1))
    L = base
    L = L + vstrip(-1.05, 0.16, -0.35, 1.0, 1.15) + vstrip(1.15, 0.1, -0.2, 0.9, 1.0) + vstrip(2.3, 0.22, -0.6, 0.7, 0.8) + vstrip(-2.4, 0.18, -0.5, 0.8, 0.7)
    L = L + 0.95 * _sst(el, 0.62, 0.74)                                   # overhead panel -> silver tops
    L = L + 0.6 * (1 - _sst(np.hypot(th - 0.45, el - 0.3), 0.07, 0.12))  # key panel highlight
    L = L + 0.25 * (1 - _sst(el, -0.7, -0.45)) * (1 - _sst(np.abs(th), 1.6, 2.4))  # faint floor card bounce
    if dark: L = 0.025 + (L - base) * 0.85
    return L

def shade(nx, ny, nz, accent, glow, dark=False, base=None):
    """glow 0..1: where the accent shows through (inner faces / centre). base: glossy coloured material instead of chrome."""
    ac = np.asarray(accent, float) / 255; L = env(nx, ny, nz, dark)
    fres = (0.35 + 0.65 * (1 - (1 - nz) ** 3))                           # edges darker before rim
    rim = _sst(1 - nz, 0.82, 0.98) * 0.35
    if base is not None:
        b = np.asarray(base, float) / 255; diff = np.clip(0.35 + 0.65 * (-0.4 * nx - 0.6 * ny + 0.7 * nz), 0, 1)
        out = b * diff[..., None] * 0.95 + (np.clip(L - 0.15, 0, None) * 0.9)[..., None]
    else:
        out = np.repeat((L * fres + rim)[..., None], 3, -1) * np.array([0.97, 0.99, 1.03])
        g = glow[..., None]
        out = out * (1 - g * 0.85) + g * ac * (0.75 + 0.5 * np.clip(L, 0, 1))[..., None]
    return np.clip(out, 0, 1.4)

def _boxblur(a, r):
    r = max(1, int(r))
    for ax in (0, 1):
        pw = [(r + 1, r), (0, 0)] if ax == 0 else [(0, 0), (r + 1, r)]
        cs = np.cumsum(np.pad(a, pw, mode='edge'), axis=ax); n = cs.shape[ax]
        a = (np.take(cs, np.arange(2 * r + 1, n), axis=ax) - np.take(cs, np.arange(0, n - 2 * r - 1), axis=ax)) / (2 * r + 1)
    return a

def _img(arr):
    return skia.Image.fromarray(np.ascontiguousarray(arr), colorType=skia.ColorType.kRGBA_8888_ColorType, alphaType=skia.AlphaType.kPremul_AlphaType)

def _blit(c, rgb, cov, x0, y0, accent, glowmask, bloom=1.0, shadow=None):
    h, w = cov.shape; h2, w2 = h // SS, w // SS
    ds = lambda a: a[:h2 * SS, :w2 * SS].reshape(h2, SS, w2, SS, *a.shape[2:]).mean((1, 3))
    cov = ds(cov); rgb = ds(rgb); gm = ds(glowmask)
    a = np.clip(cov, 0, 1)[..., None]
    if shadow:
        dy, bl, al = shadow; sh = np.zeros((h2, w2, 4), np.uint8); sh[..., 3] = (a[..., 0] * 255).astype(np.uint8)
        p = skia.Paint(); p.setImageFilter(skia.ImageFilters.Blur(bl, bl)); p.setAlphaf(al); c.drawImage(_img(sh), x0, y0 + dy, skia.SamplingOptions(), p)
    arr = (np.clip(np.concatenate([np.clip(rgb, 0, 1) * a, a], -1), 0, 1) * 255 + 0.5).astype(np.uint8)
    c.drawImage(_img(arr), x0, y0, skia.SamplingOptions(skia.FilterMode.kLinear), skia.Paint())
    if bloom > 0:                                                         # bloom: over-bright highlights + accent glow
        ac = np.asarray(accent, float) / 255
        b = np.clip(rgb.max(-1) - 0.92, 0, None)[..., None] * 2.5 * np.ones(3) + gm[..., None] * ac * 0.55
        b = np.clip(b * a * bloom, 0, 1); ba = b.max(-1, keepdims=True)
        barr = (np.concatenate([b, ba], -1) * 255).astype(np.uint8)
        sg = max(4, min(w2, h2) * 0.035); p = skia.Paint(); p.setImageFilter(skia.ImageFilters.Blur(sg, sg)); p.setBlendMode(skia.BlendMode.kPlus)
        c.drawImage(_img(barr), x0, y0, skia.SamplingOptions(skia.FilterMode.kLinear), p)

def _smooth_normals(N, cov, r, passes=2):
    w = (cov > 0).astype(np.float32); ws = w.copy()
    for _ in range(passes): ws = _boxblur(ws, r)
    out = []
    for k in range(3):
        a = N[..., k] * w
        for _ in range(passes): a = _boxblur(a, r)
        out.append(a / (ws + 1e-6))
    n = np.stack(out, -1); n[..., 2] = np.maximum(n[..., 2], 0)
    n /= np.linalg.norm(n, axis=-1, keepdims=True) + 1e-6
    edge = _sst(1 - N[..., 2], 0.75, 0.97)[..., None]           # keep true silhouette normals for the rim
    n = n * (1 - edge) + N * edge; n /= np.linalg.norm(n, axis=-1, keepdims=True) + 1e-6
    return n * w[..., None]

def _ao(zb, cov, r):
    z = np.where(cov > 0, zb, np.nan); fill = np.nanmax(z) if np.isfinite(z).any() else 0
    z = np.where(cov > 0, zb, fill); zb_ = _boxblur(z, r); return np.clip((z - zb_) * 2.2, 0, 1) * (cov > 0)

def tube(c, sx, sy, r, d, rw, accent, dark=False, closed=True, shadow=None, bloom=1.0, glow_k=1.0):
    """Swept tube through projected centreline points: continuous capsule segments with a z-buffer."""
    n = len(sx); pad = 6
    x0 = int(math.floor((sx - r).min())) - pad; y0 = int(math.floor((sy - r).min())) - pad
    x1 = int(math.ceil((sx + r).max())) + pad; y1 = int(math.ceil((sy + r).max())) + pad
    W, H = (x1 - x0) * SS, (y1 - y0) * SS
    if W <= 0 or H <= 0: return
    zb = np.full((H, W), np.inf, np.float32); N = np.zeros((H, W, 3), np.float32); cov = np.zeros((H, W), np.float32)
    X_ = (sx - x0) * SS; Y_ = (sy - y0) * SS; R_ = r * SS
    for i in range(n if closed else n - 1):
        j = (i + 1) % n; ax, ay, bx, by, ra, rb = X_[i], Y_[i], X_[j], Y_[j], R_[i], R_[j]
        rm = max(ra, rb) + 1.5
        a0, a1 = max(0, int(min(ax, bx) - rm)), min(W, int(max(ax, bx) + rm) + 2); b0, b1 = max(0, int(min(ay, by) - rm)), min(H, int(max(ay, by) + rm) + 2)
        if a1 <= a0 or b1 <= b0: continue
        px = np.arange(a0, a1, dtype=np.float32)[None, :] + 0.5; py = np.arange(b0, b1, dtype=np.float32)[:, None] + 0.5
        ex, ey = bx - ax, by - ay; L2 = ex * ex + ey * ey + 1e-6
        t = np.clip(((px - ax) * ex + (py - ay) * ey) / L2, 0, 1)
        dx = px - (ax + t * ex); dy = py - (ay + t * ey); rr = ra + t * (rb - ra); dist = np.sqrt(dx * dx + dy * dy)
        cv = np.clip(rr - dist + 0.5, 0, 1)
        m = cv > 0
        if not m.any(): continue
        u = np.clip(dist / rr, 0, 1); q = np.sqrt(1 - u * u)
        z = (d[i] + t * (d[j] - d[i])) - q * (rw[i] + t * (rw[j] - rw[i]))
        sub = zb[b0:b1, a0:a1]; upd = m & (z < sub)
        if not upd.any(): continue
        sub[upd] = z[upd]; cs = cov[b0:b1, a0:a1]; cs[upd] = np.maximum(cs[upd], cv[upd])
        nn = N[b0:b1, a0:a1]; nn[..., 0][upd] = (dx / rr)[upd]; nn[..., 1][upd] = (dy / rr)[upd]; nn[..., 2][upd] = q[upd]
    N = _smooth_normals(N, cov, max(2, R_.mean() * 0.18))
    nx, ny, nz = N[..., 0], N[..., 1], N[..., 2]
    gy, gx = np.mgrid[0:H, 0:W].astype(np.float32); ccx, ccy = (sx.mean() - x0) * SS, (sy.mean() - y0) * SS
    vx, vy = ccx - gx, ccy - gy; vl = np.sqrt(vx * vx + vy * vy) + 1e-3
    inward = np.clip((nx * vx + ny * vy) / vl, 0, 1)                         # faces turned to the object's centre
    ao = _ao(zb, cov, R_.mean() * 0.6)
    glow = np.clip(_sst(inward, 0.15, 0.85) * 0.85 + ao * 0.6, 0, 1) * glow_k * (cov > 0)
    rgb = shade(nx, ny, nz, accent, glow, dark) * (1 - 0.55 * ao)[..., None]
    _blit(c, rgb, cov, x0, y0, accent, glow, bloom, shadow)

def _warp(path, fn, n=480):
    pm = skia.PathMeasure(path, True); L = pm.getLength(); out = skia.Path()
    for k in range(n):
        pos, _ = pm.getPosTan(L * k / n); x, y = fn(pos.x(), pos.y())
        out.moveTo(x, y) if k == 0 else out.lineTo(x, y)
    out.close(); return out

def inflated(c, path, accent, dark=False, base=None, puff=0.22, shadow=None, bloom=1.0, center_glow=0.85):
    """Inflate a closed path into a pillow: chrome with accent-glowing centre, or glossy colour (`base`)."""
    b = path.computeTightBounds(); pad = 6
    x0, y0 = int(b.left()) - pad, int(b.top()) - pad; x1, y1 = int(b.right()) + pad, int(b.bottom()) + pad
    W, H = (x1 - x0) * SS, (y1 - y0) * SS
    if W <= 2 or H <= 2: return
    surf = skia.Surface.MakeRaster(skia.ImageInfo.Make(W, H, skia.ColorType.kRGBA_8888_ColorType, skia.AlphaType.kPremul_AlphaType))
    cc = surf.getCanvas(); cc.clear(0); cc.scale(SS, SS); cc.translate(-x0, -y0); cc.drawPath(path, skia.Paint(AntiAlias=True, Color=skia.ColorWHITE))
    m = surf.makeImageSnapshot().toarray()[..., 3].astype(np.float32) / 255
    R = min(b.width(), b.height()) * SS * puff
    h = m.copy()
    for _ in range(6): h = _boxblur(h, R / 3.0)
    h = np.clip(h, 0, 1); h = (1 - (1 - h) ** 2.2) * m          # rounded pillow profile, no ridge
    for _ in range(3): h = _boxblur(h, max(2, R * 0.06)) * (m > 0)
    gy, gx = np.gradient(h * R * 1.0)
    n = np.stack([-gx, -gy, np.ones_like(gx)], -1); n /= np.linalg.norm(n, axis=-1, keepdims=True)
    hn = h / (h.max() + 1e-6); glow = _sst(hn, 0.35, 0.95) * center_glow * (m > 0)
    rgb = shade(n[..., 0], n[..., 1], n[..., 2], accent, glow, dark, base)
    _blit(c, rgb, m, x0, y0, accent, glow if base is None else glow * 0.3, bloom, shadow)

def sphere(c, x, y, r, accent, dark=False, tint=None, bloom=0.6, shadow=None):
    """tint=(dx, dy, rgb): reflected colour of a neighbour in that screen direction."""
    pad = 4; x0, y0 = int(x - r) - pad, int(y - r) - pad; W = H = int(2 * r + 2 * pad) * SS
    gy, gx = np.mgrid[0:H, 0:W].astype(np.float32); X = ((gx + 0.5) / SS + x0 - x) / r; Y = ((gy + 0.5) / SS + y0 - y) / r
    d = np.sqrt(X * X + Y * Y); cov = np.clip((1 - d) * r * SS + 0.5, 0, 1); u = np.clip(d, 0, 1); q = np.sqrt(1 - u * u)
    rgb = shade(X * (d < 1), Y * (d < 1), q, accent, np.zeros_like(q), dark)
    if tint:
        tx, ty, tc = tint; tl = math.hypot(tx, ty) or 1; k = np.clip((X * tx + Y * ty) / tl, 0, 1) ** 2 * (1 - q) ** 0.5
        rgb = rgb + (np.asarray(tc, float) / 255)[None, None, :] * (k * 0.8)[..., None]
    _blit(c, rgb, cov, x0, y0, accent, np.zeros_like(q), bloom, shadow)
