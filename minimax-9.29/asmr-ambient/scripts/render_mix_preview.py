#!/usr/bin/env python3
"""启动助眠音频混合预览服务器。

用法：
  python3 render_mix_preview.py <preview_data.json> [--port PORT]

流程：
  1. 读取 JSON 数据文件（包含各轨道路径、参数配置）
  2. 注入 HTML 模板，启动本地 HTTP 服务器
  3. 在浏览器中打开预览页面
  4. 用户提交反馈后，写入 feedback.md + mix_settings.json，服务器自动退出
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
from socketserver import ThreadingMixIn

SKILL_DIR = Path(__file__).resolve().parent.parent
TEMPLATE_DIR = SKILL_DIR / "html"


class ThreadingHTTPServer(ThreadingMixIn, HTTPServer):
    daemon_threads = True


class PreviewHandler(BaseHTTPRequestHandler):
    html_content: str = ""
    feedback_path: Path = Path("feedback.md")
    settings_path: Path = Path("mix_settings.json")
    server_ref: HTTPServer | None = None

    def do_GET(self):
        if self.path.startswith("/audio/"):
            self._serve_audio()
            return
        self.send_response(200)
        self.send_header("Content-Type", "text/html; charset=utf-8")
        self.end_headers()
        self.wfile.write(self.html_content.encode("utf-8"))

    def _serve_audio(self):
        encoded = self.path[len("/audio/"):]
        try:
            audio_path = Path(base64.urlsafe_b64decode(encoded).decode("utf-8"))
        except Exception:
            self.send_error(400, "invalid audio path")
            return
        if not audio_path.exists():
            self.send_error(404, "audio not found")
            return
        mime = mimetypes.guess_type(str(audio_path))[0] or "audio/mpeg"
        file_size = audio_path.stat().st_size

        try:
            self._send_audio(audio_path, mime, file_size)
        except BrokenPipeError:
            pass

    def _send_audio(self, audio_path, mime, file_size):
        range_header = self.headers.get("Range")
        if range_header:
            # Parse Range: bytes=start-end
            range_spec = range_header.replace("bytes=", "")
            parts = range_spec.split("-")
            start = int(parts[0]) if parts[0] else 0
            end = int(parts[1]) if parts[1] else file_size - 1
            end = min(end, file_size - 1)
            length = end - start + 1

            self.send_response(206)
            self.send_header("Content-Type", mime)
            self.send_header("Content-Range", f"bytes {start}-{end}/{file_size}")
            self.send_header("Content-Length", str(length))
            self.send_header("Accept-Ranges", "bytes")
            self.send_header("Cache-Control", "max-age=3600")
            self.end_headers()

            with open(audio_path, "rb") as f:
                f.seek(start)
                self.wfile.write(f.read(length))
        else:
            self.send_response(200)
            self.send_header("Content-Type", mime)
            self.send_header("Content-Length", str(file_size))
            self.send_header("Accept-Ranges", "bytes")
            self.send_header("Cache-Control", "max-age=3600")
            self.end_headers()

            with open(audio_path, "rb") as f:
                while True:
                    chunk = f.read(65536)
                    if not chunk:
                        break
                    self.wfile.write(chunk)

    def do_POST(self):
        if self.path == "/feedback":
            self._handle_feedback()
        else:
            self.send_error(404)

    def _handle_feedback(self):
        length = int(self.headers.get("Content-Length", 0))
        body = self.rfile.read(length).decode("utf-8")
        data = json.loads(body)
        feedback = data.get("feedback", "").strip()
        settings = data.get("settings", {})

        self.send_response(200)
        self.send_header("Content-Type", "application/json")
        self.end_headers()

        if feedback:
            self.feedback_path.write_text(feedback, encoding="utf-8")
            if settings:
                self.settings_path.write_text(
                    json.dumps(settings, ensure_ascii=False, indent=2),
                    encoding="utf-8",
                )
            self.wfile.write(json.dumps({"ok": True}).encode())
            print(f"FEEDBACK_FILE={self.feedback_path}")
            if settings:
                print(f"SETTINGS_FILE={self.settings_path}")
            threading.Timer(0.5, self._shutdown).start()
        else:
            self.wfile.write(json.dumps({"ok": False, "msg": "empty"}).encode())

    def _shutdown(self):
        if self.server_ref:
            self.server_ref.shutdown()

    def log_message(self, format, *args):
        pass


def to_audio_url(abs_path: str) -> str:
    """将绝对路径转为 /audio/<base64> URL"""
    encoded = base64.urlsafe_b64encode(abs_path.encode()).decode()
    return f"/audio/{encoded}"


def prepare_data(raw_data: dict) -> dict:
    """将各轨道的绝对路径转为可访问的 /audio/ URL。

    数据结构：
    - voice.path → voice.audioUrl
    - nature.path → nature.audioUrl
    - music.path → music.audioUrl (可选)
    - mixed.path → mixed.audioUrl
    """
    if raw_data.get("voice") and raw_data["voice"].get("path"):
        raw_data["voice"]["audioUrl"] = to_audio_url(raw_data["voice"]["path"])

    if raw_data.get("nature") and raw_data["nature"].get("path"):
        raw_data["nature"]["audioUrl"] = to_audio_url(raw_data["nature"]["path"])

    if raw_data.get("music") and raw_data["music"].get("path"):
        raw_data["music"]["audioUrl"] = to_audio_url(raw_data["music"]["path"])

    if raw_data.get("mixed") and raw_data["mixed"].get("path"):
        raw_data["mixed"]["audioUrl"] = to_audio_url(raw_data["mixed"]["path"])

    return raw_data


def main():
    parser = argparse.ArgumentParser(description="启动助眠音频混合预览服务器")
    parser.add_argument("data_file", help="JSON 数据文件路径")
    parser.add_argument("--port", type=int, default=0, help="端口号，默认自动分配")
    parsed = parser.parse_args()

    data_path = Path(parsed.data_file).resolve()
    if not data_path.exists():
        print(f"ERROR: 数据文件不存在: {data_path}")
        sys.exit(1)

    raw_data = json.loads(data_path.read_text(encoding="utf-8"))
    preview_data = prepare_data(raw_data)

    template_path = TEMPLATE_DIR / "preview-mix_feedback.html"
    if not template_path.exists():
        print(f"ERROR: 模板不存在: {template_path}")
        sys.exit(1)

    template = template_path.read_text(encoding="utf-8")
    injected = template.replace(
        "const PREVIEW_TYPE = null;  /* __PREVIEW_TYPE__ */",
        'const PREVIEW_TYPE = "mix_feedback";',
    ).replace(
        "const PREVIEW_DATA = null;  /* __PREVIEW_DATA__ */",
        f"const PREVIEW_DATA = {json.dumps(json.dumps(preview_data, ensure_ascii=False))};",
    )

    feedback_dir = data_path.parent
    server = ThreadingHTTPServer(("127.0.0.1", parsed.port), PreviewHandler)
    port = server.server_address[1]

    PreviewHandler.html_content = injected
    PreviewHandler.feedback_path = feedback_dir / "feedback.md"
    PreviewHandler.settings_path = feedback_dir / "mix_settings.json"
    PreviewHandler.server_ref = server

    url = f"http://127.0.0.1:{port}"
    print(f"PREVIEW_URL={url}")
    print("等待用户提交...")

    webbrowser.open(url)
    server.serve_forever()
    print("服务器已停止")


if __name__ == "__main__":
    main()
