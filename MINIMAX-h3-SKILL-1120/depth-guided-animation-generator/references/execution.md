# 执行配置 / Execution Notes

- Model selection: prefer MiniMax H3 when it supports the approved stage. The final transformation must accept the full depth video together with one style frame. Verify current capabilities, honor a compatible user choice, and obtain agreement before changing the route or its deliverable. A model name alone is not proof of input support.
- scripts/setup_depth_models.sh prepares the model; scripts/extract_depth_video.py extracts full depth; scripts/run_depth_video.sh is a convenience wrapper. Inspect scripts and local dependencies before running.
- models/depth-anything-v2-small requires config.json, preprocessor_config.json, model.safetensors and successful local loading by AutoImageProcessor and AutoModelForDepthEstimation. Existing files alone are not proof of readiness.
- Depth convention: white near, black far. Preserve full temporal sequence and frame rate. Verify objective dimensions, duration, frame count, decoding and audio-track presence.

## 已观察案例 / Observed Case

A 2560×1440 RGB PNG anchor with an 832×480, 24fps H.264/yuv420p depth video failed twice with a generic parameter error. Trimming 10.125 seconds to 10 seconds and explicitly requesting 10 seconds did not resolve it. A later attempt succeeded with the image reduced to 1280×720 and depth proportionally resized to 1248×720, padded 16 pixels on both sides to 1280×720, and re-encoded as H.264/yuv420p MP4, 240 frames at 24fps. Prompt and other generation settings were retained for that compatibility test.

This supports input normalization as a diagnostic step, not proof of a particular provider limit. Size, ratio, re-encoding, and transient service behavior were not isolated. Do not claim 480p or fractional seconds are prohibited. Prefer matching standard input dimensions for the selected output format when authorized; do not force every project to 720p or 16:9. Preserve original content and maintain consistent coordinate transforms. Black padding in depth denotes far space; explain padding before changing a confirmed composition.

Generic provider errors require actual request records and field-level diagnostics where available. Do not claim a specific root cause without evidence. Paid generation requires approval; do not silently repeat attempts.

## Setup and distribution boundary

The distributable excludes model weights. Configuration files alone do not make the model ready. Check local files and loadability before extracting depth; request setup permission if needed. The convenience wrapper invokes setup and can download dependencies and weights, so do not run it without the relevant setup authorization. Use the extractor directly when a ready local model is already available. No install or download is performed by this format audit.
