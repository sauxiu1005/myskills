"""渲染 [a, b) 帧并直接管道编码为 MP4（不落 PNG）。
  python3 render_range.py 0 720 ../out/film.mp4                 # 全片；有 AUDIO 时直接复制音轨
  python3 render_range.py 241 385 ../out/sample.mp4             # 片段样片；音轨按同段截取
环境变量：AUDIO=已混好的成片或 mix.wav（可省，省略则无声）；FFMPEG=ffmpeg 路径（默认 PATH）。"""
import os, sys, subprocess, time
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import render
from engine.cues import default_cues
FF = os.environ.get("FFMPEG", "ffmpeg")
a, b, out = int(sys.argv[1]), int(sys.argv[2]), sys.argv[3]
Q = default_cues()
W, H = Q.logical[0] * Q.scale, Q.logical[1] * Q.scale
fps = Q.fps
aud = os.environ.get("AUDIO")
os.makedirs(os.path.dirname(os.path.abspath(out)), exist_ok=True)
cmd = [FF, "-y", "-v", "error", "-f", "rawvideo", "-pix_fmt", "rgb24", "-s", "%dx%d" % (W, H), "-r", str(fps), "-i", "-"]
if aud and a == 0 and b == Q.duration:
    cmd += ["-i", aud, "-map", "0:v", "-map", "1:a", "-c:a", "copy" if aud.endswith(".mp4") else "aac"]
elif aud:
    cmd += ["-ss", "%.4f" % (a / fps), "-t", "%.4f" % ((b - a) / fps), "-i", aud, "-map", "0:v", "-map", "1:a", "-c:a", "aac", "-b:a", "192k"]
cmd += ["-c:v", "libx264", "-preset", "medium", "-crf", "16", "-pix_fmt", "yuv420p", "-movflags", "+faststart", out]
p = subprocess.Popen(cmd, stdin=subprocess.PIPE)
t0 = time.time()
for f in range(a, b):
    p.stdin.write(render.render_frame(f, Q).convert("RGB").tobytes())
p.stdin.close(); p.wait()
print("DONE", p.returncode, b - a, "frames", round(time.time() - t0, 1), "s", flush=True)
