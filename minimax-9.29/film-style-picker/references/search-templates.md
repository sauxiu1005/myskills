# 各平台搜索 URL 构造规则

> 当用户选定 [风格] + [导演] + [代表作] 后，按此模板生成搜索链接。所有变量需 URL 编码（空格 → `+` 或 `%20`）。

## 优先级排序

| 排名 | 平台 | 适合场景 | 收费 |
|---|---|---|---|
| 1 | **Shotdeck** | 业内首选，按色彩/构图/灯光精搜 | 付费 ($30/月) |
| 2 | **Film-Grab** | 按电影名找全片高清截图 | 免费 |
| 3 | **Pinterest** | 海量 UGC 灵感，搜英文关键词更全 | 免费 |
| 4 | **Movies in Color** | 直接出电影截图配色板 | 免费 |
| 5 | **Cosmos** | 高质量策展型 mood board | 免费 |
| 6 | **Google Images** | 通用兜底 | 免费 |

## URL 模板

### Shotdeck
```
https://shotdeck.com/search?q={director}+{movie}
https://shotdeck.com/search?keyword={style_keyword}
```
变量：`director`、`movie` 或 `style_keyword`（英文）。
示例：`https://shotdeck.com/search?q=denis+villeneuve+blade+runner+2049`

### Film-Grab
```
https://film-grab.com/?s={movie_english_name}
```
变量：`movie_english_name`（必须英文）。
示例：`https://film-grab.com/?s=blade+runner+2049`

### Pinterest
```
https://www.pinterest.com/search/pins/?q={style}+cinematography
https://www.pinterest.com/search/pins/?q={director}+movie+stills
https://www.pinterest.com/search/pins/?q={movie}+aesthetic
```
变量：`style`、`director`、`movie`（中英文都可，英文匹配更广）。
示例：`https://www.pinterest.com/search/pins/?q=wong+kar-wai+cinematography`

### Movies in Color
```
https://moviesincolor.com/?s={movie_english_name}
```
变量：`movie_english_name`。
示例：`https://moviesincolor.com/?s=blade+runner`

### Cosmos
```
https://cosmos.so/search?q={style_or_director}
```
变量：英文风格或导演名。
示例：`https://cosmos.so/search?q=cyberpunk`

### Google Images
```
https://www.google.com/search?tbm=isch&q={director}+{movie}+film+still
```
变量：`director`、`movie`（英文）。
示例：`https://www.google.com/search?tbm=isch&q=stanley+kubrick+the+shining+film+still`

## 国内补充（不需翻墙）

| 平台 | URL 模板 |
|---|---|
| 站酷 | `https://so.zcool.com.cn/?word={style_chinese}+影视` |
| 小红书 Web | `https://www.xiaohongshu.com/search_result?keyword={style_chinese}+电影感` |
| B 站 | `https://search.bilibili.com/all?keyword={style_chinese}+调色` |
| 微博图片 | `https://s.weibo.com/pic?q={style_chinese}` |

## 抓图建议

如果用户希望直接看图（不点链接），可用 `WebFetch` 抓 Pinterest 或 Film-Grab 页面：

```python
# 示例：抓 Film-Grab 页面提取截图 URL
WebFetch(
  url="https://film-grab.com/?s=blade+runner+2049",
  prompt="Extract the URLs of the first 5 movie screenshot images from this page. Return as a list of URLs only."
)
```

返回的图 URL 直接用 markdown 图片语法 `![](url)` 展示。

## 注意事项

- **Pinterest 中文搜索效果差**，强制转英文关键词
- **Shotdeck 需要登录**，未登录只能看缩略图
- **Cosmos 需要邀请码**，没有的话用 Pinterest 替代
- **Film-Grab 收录的电影有限**，若搜不到，回退到 Pinterest
- **国内用户**优先推荐 Pinterest（中国可访问）+ 站酷 + 小红书三件套
