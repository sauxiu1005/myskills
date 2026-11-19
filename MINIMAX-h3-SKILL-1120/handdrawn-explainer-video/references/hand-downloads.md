# Hand downloads / 手部按需下载（1.0.1）

The seven full-resolution hand/pen PNGs are intentionally excluded from the skill package. Their existing GitHub Release v1.2 URLs, hashes, catalog coordinates and review records are unchanged. All 13 style anchors, 13 style previews and style recipes remain bundled unchanged.

七张手部/画笔原图不打包；原 GitHub Release v1.2 地址、哈希、笔尖/手腕坐标和审核记录保留。十三张画风参考原图、十三张画风预览和画风配方仍随包提供。

## Selection / 选择

Run `python scripts/prepare_selection.py <jobDir>`. It obtains all seven original hand/pen files through the verified resolver, and creates `<jobDir>/selection/selection.html` with local copies of those files and the unchanged style previews. Show this page or the returned image paths to the user. No defaults or automatic selections are added. The package's `assets/selection.html` is a template, not the ready-to-open page.

需要展示所有手部供选择时会下载并校验全部七张；若用户已明确具体手部，无需调用该准备命令，正常构建会按需获取并校验所选的一张。所选原图会复制进作品 `work/hands/`，后续渲染不依赖缓存长期保留。

## Cache / 缓存

- Default: `~/.cache/sweety-handdraw-video/<sha256>/<filename>`.
- Override: `HANDDRAW_ASSET_CACHE`.
- `HANDDRAW_OFFLINE=1`: use verified local/cache files only; missing or damaged files fail explicitly.
- Prefetch for offline use: `python scripts/hosted_assets.py --all`.
- Every downloaded file must match the manifest's byte count and SHA-256. A valid cache is reused. Never replace missing hands or alter their calibration silently.

首次使用需要访问 GitHub Releases。网络失败时恢复网络后重试，已通过校验的缓存会复用；也可在联网机器预取后复制缓存目录。不能保证第三方托管永久在线。压缩包变小，但实际需要的手部原图仍占用本机缓存和项目空间。
