// GLSL for "oriel — Clarity, in every light."  Full-screen triangles; design space 1920x1080, y down.
// Adapted from the toolkit reference (demos/12-aurora-glass/shaders.js).

export const VS = `#version 300 es
void main(){ vec2 p = vec2(float((gl_VertexID<<1)&2), float(gl_VertexID&2)); gl_Position = vec4(p*2.-1., 0., 1.); }`;

const HEAD = `#version 300 es
precision highp float;
uniform vec2 uRes;
uniform float uDPR;
out vec4 o;
vec2 designP(){ return vec2(gl_FragCoord.x, uRes.y - gl_FragCoord.y) / uDPR; }
vec2 toUV(vec2 p){ return vec2(p.x / 1920., 1. - p.y / 1080.); }
float sdRoundBox(vec2 p, vec2 b, float r){ r = min(r, min(b.x, b.y)); vec2 q = abs(p) - b + r; return length(max(q, 0.)) + min(max(q.x, q.y), 0.) - r; }
float hash12(vec2 p){ vec3 p3 = fract(vec3(p.xyx) * .1031); p3 += dot(p3, p3.yzx + 33.33); return fract((p3.x + p3.y) * p3.z); }
vec2 hash22(vec2 p){ vec3 p3 = fract(vec3(p.xyx) * vec3(.1031, .1030, .0973)); p3 += dot(p3, p3.yzx + 33.33); return fract((p3.xx + p3.yz) * p3.zy); }
float luma(vec3 c){ return dot(c, vec3(0.2126, 0.7152, 0.0722)); }
`;

const SNOISE = `
vec3 mod289(vec3 x){ return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 mod289(vec4 x){ return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 permute(vec4 x){ return mod289(((x*34.0)+10.0)*x); }
vec4 taylorInvSqrt(vec4 r){ return 1.79284291400159 - 0.85373472095314 * r; }
float snoise(vec3 v){
  const vec2 C = vec2(1.0/6.0, 1.0/3.0); const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
  vec3 i = floor(v + dot(v, C.yyy)); vec3 x0 = v - i + dot(i, C.xxx);
  vec3 g = step(x0.yzx, x0.xyz); vec3 l = 1.0 - g; vec3 i1 = min(g.xyz, l.zxy); vec3 i2 = max(g.xyz, l.zxy);
  vec3 x1 = x0 - i1 + C.xxx; vec3 x2 = x0 - i2 + C.yyy; vec3 x3 = x0 - D.yyy;
  i = mod289(i);
  vec4 p = permute(permute(permute(i.z + vec4(0.0, i1.z, i2.z, 1.0)) + i.y + vec4(0.0, i1.y, i2.y, 1.0)) + i.x + vec4(0.0, i1.x, i2.x, 1.0));
  float n_ = 0.142857142857; vec3 ns = n_ * D.wyz - D.xzx;
  vec4 j = p - 49.0 * floor(p * ns.z * ns.z); vec4 x_ = floor(j * ns.z); vec4 y_ = floor(j - 7.0 * x_);
  vec4 x = x_ * ns.x + ns.yyyy; vec4 y = y_ * ns.x + ns.yyyy; vec4 h = 1.0 - abs(x) - abs(y);
  vec4 b0 = vec4(x.xy, y.xy); vec4 b1 = vec4(x.zw, y.zw);
  vec4 s0 = floor(b0)*2.0 + 1.0; vec4 s1 = floor(b1)*2.0 + 1.0; vec4 sh = -step(h, vec4(0.0));
  vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy; vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
  vec3 p0 = vec3(a0.xy, h.x); vec3 p1 = vec3(a0.zw, h.y); vec3 p2 = vec3(a1.xy, h.z); vec3 p3 = vec3(a1.zw, h.w);
  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
  p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
  vec4 m = max(0.5 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0); m = m * m;
  return 105.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
}`;

const CAM = `
uniform vec3 uCamO; uniform float uF;
vec3 rayDir(vec2 p){ return normalize(vec3(p.x - 960., p.y - 540., uF)); }
vec2 planeLocal(vec2 p, vec3 C, vec3 U, vec3 V, vec3 N){
  vec3 d = rayDir(p); float tt = dot(C - uCamO, N) / dot(d, N); vec3 P = uCamO + d * tt; vec3 r = P - C;
  return vec2(dot(r, U), dot(r, V));
}`;

// ---------------------------------------------------------------- aurora: 4 solid discs, gaussian-blurred (analytic), drifting
export const FS_AURORA = HEAD + SNOISE + CAM + `
uniform float uT;
uniform vec4 uBlob[4];   // xy centre, z disc radius, w intensity
uniform float uSig[4];   // gaussian blur sigma (px) of each disc: 80..150
uniform vec3 uBlobC[4];
uniform vec3 uBase;
uniform float uGain;
uniform float uWarp;
uniform vec4 uPool; uniform float uPoolK;   // deep pool behind the end lockup (legibility)
uniform vec3 uSC[6]; uniform vec3 uSU[6]; uniform vec3 uSV[6]; uniform vec3 uSN[6]; uniform vec4 uSH[6];
float erfA(float x){ float a = 0.147, x2 = x * x; return sign(x) * sqrt(1. - exp(-x2 * (1.27324 + a * x2) / (1. + a * x2))); }
void main(){
  vec2 p = designP();
  vec2 q = p / 1080.;
  float t = uT;
  // a low-frequency flow field bends the discs a little so their blend reads as a mesh gradient, not as four circles
  vec2 w = vec2(snoise(vec3(q * 0.8, t * 0.03)), snoise(vec3(q * 0.8 + vec2(5.2, 1.3), t * 0.03 + 11.)));
  vec2 pw = p + w * uWarp;
  vec3 acc = vec3(0.); float ws = 0.;
  for (int i = 0; i < 4; i++){
    float d = length(pw - uBlob[i].xy);
    // disc of radius R convolved with a gaussian of sigma s  (= CSS filter: blur(s) on a solid circle)
    float g = 0.5 * (1. - erfA((d - uBlob[i].z) / (uSig[i] * 1.41421))) * uBlob[i].w;
    acc += uBlobC[i] * g; ws += g;
  }
  vec3 mixc = acc / max(ws, 1e-4);
  float cov = pow(1. - exp(-ws * 1.35), 1.25);
  vec3 col = mix(uBase, mixc * 0.92, cov) + acc * 0.05;
  float core = smoothstep(0.9, 2.0, ws);
  col = mix(col, col * 1.15 + vec3(0.03, 0.03, 0.06), core * 0.5);
  float silk = snoise(vec3(p.x / 300. + w.x * 0.8, p.y / 1500., t * 0.045));
  col *= 1. + silk * 0.045 * cov;
  col *= uGain;
  // light motes: tiny sharp specks drifting in the light field. Seen through a pane they melt into the frost,
  // which is what makes the glass read as glass (the backdrop is visibly sharper outside than inside a card).
  for (int i = 0; i < 46; i++){
    vec2 h = hash22(vec2(float(i) * 7.13, 3.7));
    vec2 h2 = hash22(vec2(float(i) * 3.31, 9.2));
    vec2 mp = vec2(h.x * 2080. - 80., mod(h.y * 1240. - t * (6. + 14. * h2.x) + 1240., 1240.) - 80.);
    mp.x += 18. * sin(t * (0.3 + 0.4 * h2.y) + h.y * 6.28);
    float rad = 0.9 + 1.9 * h2.x;
    float dm = length(p - mp);
    float tw = 0.55 + 0.45 * sin(t * (0.8 + h2.y) + h.x * 6.28);
    col += vec3(0.82, 0.88, 1.) * (exp(-dm * dm / (rad * rad)) * 0.55 + exp(-dm / (rad * 5.)) * 0.05) * tw * (0.35 + 0.65 * cov);
  }
  if (uPoolK > 0.) {
    float sdp = sdRoundBox(p - uPool.xy, uPool.zw, min(uPool.z, uPool.w));
    float pool = uPoolK * (1. - smoothstep(-160., 260., sdp));
    col = mix(col, col * vec3(0.62, 0.6, 0.78), pool);
  }
  // soft contact shadows of the glass cards on the light field
  for (int k = 0; k < 6; k++){
    if (uSH[k].w <= 0.) continue;
    vec2 L = planeLocal(p - vec2(0., 30.), uSC[k], uSU[k], uSV[k], uSN[k]);
    float sd = sdRoundBox(L, uSH[k].xy, uSH[k].z);
    float sh = 1. - smoothstep(-40., 80., sd);
    col *= 1. - sh * 0.30 * uSH[k].w;
  }
  o = vec4(max(col, 0.), 1.);
}`;

export const FS_DOWN = HEAD + `
uniform sampler2D uSrc; uniform vec2 uSrcTexel; uniform float uThresh;
void main(){
  vec2 uv = gl_FragCoord.xy / uRes;
  vec3 c = texture(uSrc, uv + uSrcTexel * vec2(-1., -1.)).rgb + texture(uSrc, uv + uSrcTexel * vec2(1., -1.)).rgb
         + texture(uSrc, uv + uSrcTexel * vec2(-1., 1.)).rgb + texture(uSrc, uv + uSrcTexel * vec2(1., 1.)).rgb;
  c *= 0.25;
  if (uThresh > 0.) { float l = luma(c); c *= smoothstep(uThresh, uThresh + 0.35, l); }
  o = vec4(c, 1.);
}`;

export const FS_BLUR = HEAD + `
uniform sampler2D uSrc; uniform vec2 uDir; uniform float uOff[16]; uniform float uW[16]; uniform int uN;
void main(){
  vec2 uv = gl_FragCoord.xy / uRes; vec2 tx = uDir / uRes;
  vec3 c = texture(uSrc, uv).rgb * uW[0];
  for (int i = 1; i < 16; i++){ if (i >= uN) break; c += (texture(uSrc, uv + tx * uOff[i]).rgb + texture(uSrc, uv - tx * uOff[i]).rgb) * uW[i]; }
  o = vec4(c, 1.);
}`;

// ---------------------------------------------------------------- frosted glass card (perspective plane, analytic SDF)  v2
// recipe: backdrop blur(35px) + saturate(+5%) + 7 % white fill + ~2 % frost grain, read as a slab of cut glass:
//   * edge band (~14 px): the SHARP backdrop is bent through the bevel, with a slight R/G/B split (thickness)
//   * bevel: 1 px 40 % screen highlight on the lit (top-left) facet, a softer facet glow, shaded far facet
//   * fresnel: edges mirror more of the light field than the centre; directional specular from the top-left
export const FS_CARD = HEAD + CAM + `
uniform vec3 uC, uU, uV, uN; uniform vec2 uHalf; uniform float uRad;
uniform float uOpacity, uContentA, uLod, uDefocus, uFill, uStroke, uSeed, uDepthDim;
uniform sampler2D uBlurTex; uniform sampler2D uContent; uniform sampler2D uSharp;
uniform vec2 uLight;
uniform float uSheen;
uniform vec2 uCatch;
uniform vec3 uSweep;      // light sweep: band position (px along SW dir), amplitude, width
uniform float uSweepOff, uChroma;
float screenB(float a, float b){ return 1. - (1. - a) * (1. - b); }
vec3 screen3(vec3 a, vec3 b){ return 1. - (1. - a) * (1. - b); }
void main(){
  vec2 p = designP();
  vec2 L = planeLocal(p, uC, uU, uV, uN);
  float sd = sdRoundBox(L, uHalf, uRad);
  float pxw = max(fwidth(sd), 1e-4);
  float sdS = sd / pxw;
  float dw = max(uDefocus, 0.5);
  float cov = clamp(0.5 - sdS / (2. * dw), 0., 1.);
  if (cov <= 0.) discard;
  float r = min(uRad, min(uHalf.x, uHalf.y));
  vec2 qq = abs(L) - uHalf + r;
  vec2 g = qq.x > 0. && qq.y > 0. ? normalize(qq) : (qq.x > qq.y ? vec2(1., 0.) : vec2(0., 1.));
  g *= sign(L + 1e-6);
  float inside = -sdS;                                   // screen px from the rim, inward
  vec2 uvn = L / uHalf;
  // ---- frosted body: blur(35px), saturate +5 %
  vec3 bb = texture(uBlurTex, toUV(p)).rgb;
  float l = luma(bb);
  bb = max(mix(vec3(l), bb, 1.05), 0.);
  // ---- glass edge: the sharp backdrop seen through the bevel, compressed + bent outward, slight dispersion
  float band = 1. - smoothstep(0., 16., inside);
  float bend = pow(band, 1.6);
  vec2 o1 = g * bend * 22.;
  vec3 edge = vec3(texture(uSharp, toUV(p + o1 * 1.00)).r, texture(uSharp, toUV(p + o1 * 1.18)).g, texture(uSharp, toUV(p + o1 * 1.36)).b);
  edge = mix(vec3(luma(edge)), edge, 1.12) * 1.06;
  vec3 col = mix(bb, edge, smoothstep(0.05, 0.9, band) * 0.85);
  col = col + vec3(uFill) + vec3(0.004, 0.004, 0.016);
  // ---- frost grain (~2 %), fixed to the glass so it travels with the pane
  vec2 gp = floor(L * 1.0) + uSeed * 37.;
  float fn = hash12(gp) + hash12(gp * 1.71 + 3.1) - 1.;
  col += fn * 0.02 * (0.5 + l);
  // ---- light: top-left key
  vec2 Ld = normalize(uLight - uN.xy * 4.0);             // the key light as seen by this tilted pane
  float facing = clamp(dot(g, Ld), -1., 1.);             // +1 on the lit facet
  // light sweep: one band travelling through every pane in turn (offset by depth)
  float sbx = dot(p, normalize(vec2(1., 0.3))) - (uSweep.x + uSweepOff);
  float swp = uSweep.y * exp(-sbx * sbx / (uSweep.z * uSweep.z));
  float lit = pow(max(facing, 0.), 1.5), far = pow(max(-facing, 0.), 1.5);
  // fresnel: the rim mirrors the light field
  float fr = exp(-inside / 26.);
  vec3 refl = texture(uBlurTex, toUV(p - g * 90.)).rgb * 1.5 + 0.06;
  col = mix(col, screen3(col, refl * 0.55), fr * (0.35 + 0.45 * lit));
  // bevel facet (2..12 px): lit facet glows, far facet is shaded -> thickness
  float facet = smoothstep(1.5, 4., inside) * (1. - smoothstep(6., 14., inside));
  col += vec3(0.95, 0.97, 1.) * facet * (0.10 * lit + 0.30 * swp);
  col *= 1. - facet * 0.16 * far;
  // directional specular: a broad soft reflection in the top-left of the pane + a slow sheen band
  vec2 sp = uvn - vec2(-0.62, -0.95) - uN.xy * vec2(9., 7.);   // the reflection slides across the pane as it tilts
  col += vec3(1.) * 0.075 * exp(-(sp.x * sp.x / 0.55 + sp.y * sp.y / 0.10));
  float bandS = dot(uvn, normalize(vec2(0.8, 0.6)));
  col += vec3(1.) * 0.05 * exp(-pow((bandS - uSheen) / 0.42, 2.));
  col += vec3(1.) * 0.018 * (1. - clamp((uvn.y + uvn.x * 0.4 + 1.) * 0.5, 0., 1.));
  col += vec3(0.92, 0.95, 1.) * swp * (0.07 + 0.10 * fr);
  // depth: far panes lose a little contrast toward the light field
  col = mix(col, bb, uDepthDim);
  // ---- content
  vec2 cuv = (L + uHalf) / (2. * uHalf);
  vec4 c = texture(uContent, cuv, uLod) * uContentA;
  col = col * (1. - c.a) + c.rgb;
  // ---- 1 px rim: 40 % screen on the lit edge, ~16 % on the far one; a hairline of shade just inside it
  float sw = 0.9 + (dw - 0.5) * 1.5;
  float stroke = clamp(1. - abs(inside - sw) / sw, 0., 1.) * (0.9 / sw);
  float sa = uStroke * mix(0.4, 1.35, clamp(facing * 0.5 + 0.5, 0., 1.));
  float sR = clamp(1. - abs(inside - (sw + 1.3)) / sw, 0., 1.) * (0.9 / sw);
  float sB = clamp(1. - abs(inside - max(sw - 0.7, 0.35)) / sw, 0., 1.) * (0.9 / sw);
  float ch = clamp(uChroma * (0.25 + 0.75 * lit + 1.2 * swp), 0., 1.);
  vec3 strokeC = mix(vec3(stroke), vec3(sR * 0.9 + stroke * 0.2, stroke, sB * 0.9 + stroke * 0.2), ch);
  col = screen3(col, strokeC * (sa + 0.9 * swp));
  float inner = clamp(1. - abs(inside - 2.6) / 1.1, 0., 1.);
  col *= 1. - inner * 0.10 * (0.4 + far);
  if (uCatch.y > 0.) {
    float a = atan(L.y / uHalf.y, L.x / uHalf.x);
    float s = fract((a + 3.14159 * 0.75) / 6.28318);
    float dd = s - uCatch.x;
    float along = exp(-dd * dd / 0.0009) + 0.55 * exp(dd / 0.07) * step(dd, 0.) * step(-0.35, dd);
    float bandC = clamp(1. - abs(inside - sw) / (sw + 0.35), 0., 1.);
    col += vec3(0.95, 0.97, 1.) * along * uCatch.y * (bandC * 1.25 + 0.18 * exp(-inside / 7.));
  }
  o = vec4(col, 1.) * cov * uOpacity;
}`;

export const FS_OVER = HEAD + `
uniform sampler2D uTex; uniform float uA;
void main(){ vec2 p = designP(); vec4 c = texture(uTex, vec2(p.x / 1920., p.y / 1080.)); o = c * uA; }`;

// ---------------------------------------------------------------- Liquid-glass lens v2: a real magnifier over the composite
// The lens samples the finished composite (light field + glass cards + text).  Radial mapping inside a convex SDF shape:
//   rho = normalised radius (0 centre .. 1 rim, measured along the ray from the centre)
//   rho_src = rho / M + a * rho^4,   a = (1 + e) - 1/M
// -> near the centre a uniform ~M x magnification (text stays readable), toward the rim strong barrel compression
//    that pulls in content from just OUTSIDE the lens (edges visibly bend), per-wavelength M/e -> RGB split at the rim.
export const FS_LENS = HEAD + `
uniform sampler2D uScene; uniform sampler2D uBlur;
uniform vec2 uLC; uniform vec2 uLH; uniform float uLR;
uniform float uOn, uMag, uEdge, uDisp, uStr, uLift, uGlint, uIris, uIrisRot, uRimGlow, uFres;
uniform mat2 uSt, uStI; uniform float uStMin, uHalo, uBright;
uniform vec3 uLight3;
float lensSDF(vec2 p){ return sdRoundBox(uStI * (p - uLC), uLH, uLR) * uStMin; }   // stretched along its motion (liquid)
vec2 inFrame(vec2 s){ vec2 lo = vec2(1.), hi = vec2(1919., 1079.); s = mix(s, 2. * lo - s, step(s, lo)); s = mix(s, 2. * hi - s, step(hi, s)); return clamp(s, lo, hi); }
vec3 spectrum(float x){ return clamp(vec3(1.5 - abs(4. * x - 1.), 1.5 - abs(4. * x - 2.2), 1.5 - abs(4. * x - 3.3)), 0., 1.); }
void main(){
  vec2 p = designP();
  vec3 base = texture(uScene, toUV(p)).rgb;
  if (uOn <= 0.) { o = vec4(base, 1.); return; }
  float sd = lensSDF(p);
  // soft contact shadow + a faint caustic crescent cast on the scene (glass floats above the UI)
  {
    float s2 = lensSDF(p - vec2(6., 16. + 18. * uLift));
    float sh = (1. - smoothstep(-30., 70., s2)) * (0.16 + 0.10 * uLift) * uOn;
    float s3 = lensSDF(p - vec2(-4., 10.));
    float ca = exp(-pow(s3 / 9., 2.)) * step(0., sd) * 0.10 * uOn * uLift;
    base = base * (1. - sh) + vec3(0.85, 0.92, 1.) * ca;
    // birth: a drop of light -> soft bright halo around it
    if (uHalo > 0.) base += vec3(0.86, 0.92, 1.) * uHalo * (exp(-max(sd, 0.) / 10.) * 0.55 + exp(-max(sd, 0.) / 40.) * 0.18);
  }
  if (sd > 2.) { o = vec4(base, 1.); return; }
  vec2 C = uLC;
  vec2 v = uStI * (p - C); float lv = length(v); vec2 dir = lv > 1e-3 ? v / lv : vec2(0., 1.);
  float din = max(-sdRoundBox(v, uLH, uLR), 0.);
  float Rr = max(lv + din, 1.);
  float rho = clamp(lv / Rr, 0., 1.);
  // 7 wavelengths
  const vec3 SW[7] = vec3[7](vec3(0.00, 0.00, 0.30), vec3(0.00, 0.10, 0.40), vec3(0.00, 0.25, 0.25), vec3(0.05, 0.35, 0.05),
                             vec3(0.25, 0.25, 0.00), vec3(0.40, 0.05, 0.00), vec3(0.30, 0.00, 0.00));
  vec3 acc = vec3(0.);
  float r4 = rho * rho * rho * rho;
  for (int i = 0; i < 7; i++){
    float k = (3. - float(i)) / 3.;                          // +1 violet .. -1 red
    float M = uMag * (1. + 0.012 * k * uDisp);
    float e = uEdge * (1. + 0.30 * k * uDisp);
    float a = (1. + e) - 1. / M;
    float rs = rho / M + a * r4;
    rs = mix(rho, rs, uStr);
    vec2 s = C + uSt * (dir * rs * Rr);
    acc += texture(uScene, toUV(inFrame(s))).rgb * SW[i];
  }
  vec3 col = acc;
  col = mix(vec3(luma(col)), col, 1.06) * 1.04 + vec3(0.004, 0.006, 0.014);
  // birth: the interior is a drop of light (bright refracted aurora, never a dark bead)
  if (uBright > 0.) {
    vec3 bl = mix(texture(uBlur, toUV(p)).rgb * 1.6, vec3(0.74, 0.74, 1.0), 0.6) + vec3(0.08, 0.09, 0.14);
    bl += vec3(0.95, 0.97, 1.) * 0.35 * exp(-rho * rho / 0.18);
    col = mix(col, 1. - (1. - col) * (1. - bl), uBright);
  }
  // dome normal (for light): slope grows steeply toward the rim
  float slope = 2.4 * pow(rho, 3.);
  vec3 N = normalize(vec3(dir * slope, 1.));
  vec3 Lk = normalize(uLight3);
  vec2 l2 = normalize(uLight3.xy);
  float facing = dot(dir, l2);
  float lit = pow(max(facing, 0.), 2.), far = pow(max(-facing, 0.), 2.);
  // thickness: the far inner rim darkens, the lit one brightens
  float rimZone = smoothstep(0.72, 0.98, rho);
  col *= 1. - rimZone * 0.22 * far * (1. - uBright);
  // fresnel: the rim mirrors the surrounding light field
  float F = pow(rho, 7.) * uFres;
  vec3 refl = texture(uBlur, toUV(inFrame(p + dir * 110.))).rgb * 1.45 + 0.08;
  col = mix(col, 1. - (1. - col) * (1. - refl * 0.8), clamp(F, 0., 0.75));
  // iridescent prism band on the bezel (the Oriel mark)
  float an = atan(v.y, v.x);
  float bandW = smoothstep(0.70, 0.84, rho) * (1. - smoothstep(0.93, 0.995, rho));
  vec3 iri = spectrum(fract((rho - 0.7) * 2.4 + 0.12 * sin(an * 2. + uIrisRot) + 0.05));
  col = 1. - (1. - col) * (1. - iri * uIris * bandW * (0.55 + 0.45 * (0.5 + 0.5 * sin(an + uIrisRot * 0.7))));
  // specular: crisp key crescent top-left, soft interior bloom, weaker bounce bottom-right
  float cres = smoothstep(0.80, 0.90, rho) * (1. - smoothstep(0.93, 0.985, rho));
  col += vec3(1.) * cres * pow(max(facing, 0.), 5.) * 0.85;
  col += vec3(0.85, 0.92, 1.) * cres * pow(max(-facing, 0.), 7.) * 0.30;
  vec2 lp = v / max(uLH, vec2(1.));
  vec2 hp = lp - vec2(-0.42, -0.52);
  col += vec3(1.) * 0.20 * exp(-(pow(hp.x * 0.9 + hp.y * 0.45, 2.) / 0.010 + pow(-hp.x * 0.45 + hp.y * 0.9, 2.) / 0.045));
  float sk = pow(max(dot(reflect(-Lk, N), vec3(0., 0., 1.)), 0.), 40.);
  col += vec3(1.) * sk * 0.35;
  // 1 px rim line + soft outer glow
  float line = clamp(1. - abs(-sd - 0.8) / 1.0, 0., 1.);
  col = mix(col, vec3(1.), line * (0.35 + 0.55 * lit));
  col += vec3(1.) * exp(-din / 5.) * (0.05 + 0.14 * lit) * uRimGlow;
  // travelling glint
  col += exp(-pow((dot(lp, normalize(vec2(1., -0.45))) - uGlint) / 0.10, 2.)) * (1. - rimZone) * 0.07;
  float cov = clamp(0.5 - sd, 0., 1.) * uOn;
  o = vec4(mix(base, col, cov), 1.);
}`;

// ---------------------------------------------------------------- final: bloom, ~4 % grain, vignette, dither
export const FS_FINAL = HEAD + `
uniform sampler2D uSrc; uniform sampler2D uBloom; uniform sampler2D uGrain;
uniform float uBloomAmt, uGrainAmt, uFrame, uVig, uDither, uDarkGrain;
void main(){
  vec2 p = designP();
  vec2 uv = toUV(p);
  vec3 c = texture(uSrc, uv).rgb;
  c += texture(uBloom, uv).rgb * uBloomAmt;
  vec3 hi = max(c - 0.82, 0.);
  c = c - hi + hi / (1. + hi * 2.2);
  vec2 v = (p - vec2(960., 540.)) / vec2(1250., 880.);
  c *= 1. - uVig * pow(clamp(dot(v, v), 0., 1.6), 1.25);
  // contrast: the dark core of the gradient drops ~8 %, the lights keep their level
  float l0 = luma(c);
  c *= mix(0.92, 1.0, smoothstep(0.04, 0.42, l0));
  c = max(c + (c - 0.5) * 0.04 * smoothstep(0.35, 0.8, l0), 0.);
  // dynamic fine grain, soft-light blend (~3.5 %)
  vec2 go = hash22(vec2(uFrame * 0.618, uFrame * 1.303)) * 2048.;
  float g = texture(uGrain, (gl_FragCoord.xy + go) / 2048.).r - 0.5;
  float b = clamp(0.5 + g * uGrainAmt, 0., 1.);
  vec3 sl = mix(c - (1. - 2. * b) * c * (1. - c), c + (2. * b - 1.) * (sqrt(max(c, 0.)) - c), step(0.5, b));
  c = sl + g * 0.010;
  // v5: soft-light grain vanishes in the blacks -> add a linear grain there so the deep gradients never quantise into bands
  c += g * uDarkGrain * (1. - smoothstep(0.03, 0.32, l0));
  float d = hash12(gl_FragCoord.xy + uFrame * 17.31) + hash12(gl_FragCoord.xy * 1.37 + uFrame * 3.1) - 1.;
  c += vec3(d * uDither * 0.5 + d / 255.);
  o = vec4(clamp(c, 0., 1.), 1.);
}`;
