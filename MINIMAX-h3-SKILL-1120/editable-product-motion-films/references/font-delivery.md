# Font delivery / 字体交付（1.0.1）

No font binaries are shipped. The catalog, OFL text, copyright notices and exact size/SHA-256 manifest remain in `vendor/motion/fonts/`.

轻量包不包含 WOFF/WOFF2/TTF/OTF。字体目录保留目录索引、OFL 与版权说明，以及从原包生成的精确大小和 SHA-256 清单。没有替换字形、字体家族或字重。

- `om new <dir> --template <name>` fetches only the fonts in the template's copy manifest BEFORE creating the project.
- `om fonts add "<family>" <dir>` fetches the selected family's faces before changing the project.
- `om export html <dir>` fetches the share page's Inter and Noto Sans SC fonts before writing the export.
- `om fonts fetch` prefetches all 42 unique font files for offline work. `om fonts fetch Inter-var.woff` fetches a specific file.
- `OM_FONT_CACHE_DIR` overrides the writable cache location. Default: `$XDG_CACHE_HOME/…` or `~/.cache/editable-product-motion-films/fonts/<commit>/`. No write to the installed skill is needed.
- `OM_FONT_OFFLINE=1` prohibits network requests and requires verified cache entries. Missing or corrupt entries produce an actionable error, never a silent visual change.

首次获取需要访问固定提交的 GitHub Raw 地址。每个文件最多尝试三次、每次最多 45 秒；校验成功后原子写入缓存。可以从另一台联网机器运行 `om fonts fetch`，再复制缓存到离线机器并设置 `OM_FONT_CACHE_DIR`。缓存文件名与 `downloads.json` 完全对应；非原版字体不会通过校验。

字体被复制进作品的 `assets/fonts/`；已有作品渲染、Studio 播放和单文件预览不从远程 CDN 加载字体。导出的分享页附带自己的字体及许可证。`bundle-preview.mjs` 仍将作品实际使用的字体嵌入独立 HTML，并把字体放入源码包。

Boundary: a fresh machine with no fonts cached AND no network cannot create an identical-font project. Do not promise otherwise. Existing finished projects remain self-contained. Font storage moves to the cache and projects; only the skill ZIP becomes smaller.

边界：既无字体缓存又无法联网时，不能保持原字体生成新作品，应明确报告受阻。减小的是技能压缩包，不是成片项目、字体缓存或独立 HTML 的体积。
