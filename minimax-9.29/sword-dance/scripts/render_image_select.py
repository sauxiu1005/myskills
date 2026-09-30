#!/usr/bin/env python3
"""启动图片选择预览服务器。

用法：python3 render_image_select.py --title "人设图选择" --images a.png b.png c.png d.png

展示候选图片供用户点击选择，选择结果写入 feedback.md，服务器自动退出。
"""

import argparse
import base64
import json
import mimetypes
import os
import sys
import threading
import webbrowser
from http.server import HTTPServer, BaseHTTPRequestHandler
from pathlib import Path

SKILL_DIR = Path(__file__).resolve().parent.parent
TEMPLATE_DIR = SKILL_DIR / "html"
PROJECT_ROOT = Path.cwd()  # MCP tool spawns with cwd = user project dir
WORK_DIR = PROJECT_ROOT / ".sword-dance"


def to_url(abs_path: str) -> str:
    encoded = base64.urlsafe_b64encode(abs_path.encode()).decode()
    try:
        mtime = int(os.path.getmtime(abs_path))
    except OSError:
        mtime = 0
    return f"/images/{encoded}?t={mtime}"


class Handler(BaseHTTPRequestHandler):
    html_content: str = ""
    feedback_path: Path = Path("feedback.md")
    server_ref: HTTPServer | None = None

    def do_GET(self):
        if self.path.startswith("/images/"):
            self._serve_image()
            return
        self.send_response(200)
        self.send_header("Content-Type", "text/html; charset=utf-8")
        self.end_headers()
        self.wfile.write(self.html_content.encode("utf-8"))

    def _serve_image(self):
        raw = self.path[len("/images/"):]
        encoded = raw.split("?")[0]  # strip cache-buster query
        try:
            img_path = Path(base64.urlsafe_b64decode(encoded).decode("utf-8"))
        except Exception:
            self.send_error(400)
            return
        if not img_path.exists():
            self.send_error(404)
            return
        mime = mimetypes.guess_type(str(img_path))[0] or "image/png"
        data = img_path.read_bytes()
        self.send_response(200)
        self.send_header("Content-Type", mime)
        self.send_header("Content-Length", str(len(data)))
        self.send_header("Cache-Control", "no-cache, no-store, must-revalidate")
        self.end_headers()
        self.wfile.write(data)

    def do_POST(self):
        if self.path == "/feedback":
            length = int(self.headers.get("Content-Length", 0))
            body = json.loads(self.rfile.read(length).decode("utf-8"))
            feedback = body.get("feedback", "").strip()
            self.send_response(200)
            self.send_header("Content-Type", "application/json")
            self.end_headers()
            if feedback:
                self.feedback_path.write_text(feedback, encoding="utf-8")
                self.wfile.write(json.dumps({"ok": True}).encode())
                print(f"FEEDBACK_FILE={self.feedback_path}")
                threading.Timer(0.5, self._shutdown).start()
            else:
                self.wfile.write(json.dumps({"ok": False}).encode())
        else:
            self.send_error(404)

    def _shutdown(self):
        if self.server_ref:
            self.server_ref.shutdown()

    def log_message(self, fmt, *args):
        pass


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--title", required=True, help="页面标题")
    parser.add_argument("--images", nargs="+", required=True, help="候选图片路径列表")
    parser.add_argument("--feedback", default=str(WORK_DIR / "feedback.md"),
                        help="反馈文件路径")
    parser.add_argument("--lang", default="", help="UI language: zh/en")
    parser.add_argument("--port", type=int, default=0)
    args = parser.parse_args()

    template_path = TEMPLATE_DIR / "preview-image_select.html"
    if not template_path.exists():
        print(f"ERROR: 模板不存在: {template_path}")
        sys.exit(1)

    feedback_path = Path(args.feedback)
    feedback_path.parent.mkdir(parents=True, exist_ok=True)

    # Build candidate data
    candidates = []
    for i, img_path in enumerate(args.images):
        p = Path(img_path).resolve()
        if not p.exists():
            print(f"WARNING: 图片不存在: {p}")
            continue
        candidates.append({
            "url": to_url(str(p)),
            "label": f"Candidate {i + 1}" if args.lang == "en" else f"候选 {i + 1}",
            "filename": p.name,
        })

    if not candidates:
        print("ERROR: 没有有效的候选图片")
        sys.exit(1)

    data = {"title": args.title, "candidates": candidates}

    template = template_path.read_text(encoding="utf-8")
    injected = template.replace(
        "const PREVIEW_DATA = null;  /* __PREVIEW_DATA__ */",
        f"const PREVIEW_DATA = {json.dumps(json.dumps(data, ensure_ascii=False))};",
    )
    injected = injected.replace(
        "const PREVIEW_LANG = null;  /* __PREVIEW_LANG__ */",
        f"const PREVIEW_LANG = {json.dumps(args.lang or None)};",
    )

    server = HTTPServer(("127.0.0.1", args.port), Handler)
    port = server.server_address[1]

    Handler.html_content = injected
    Handler.feedback_path = feedback_path
    Handler.server_ref = server

    url = f"http://127.0.0.1:{port}"
    print(f"PREVIEW_URL={url}")
    print("等待用户选择...")

    webbrowser.open(url)
    server.serve_forever()
    print("服务器已停止")


if __name__ == "__main__":
    main()
