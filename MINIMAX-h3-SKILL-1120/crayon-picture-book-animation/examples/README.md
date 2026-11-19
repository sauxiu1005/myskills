# 示例项目（只学写法，不照搬故事）

两部 15 秒中文测试片的完整源码，都是本 Skill 的引擎做的。成片、配音、音频文件没有收进来，只保留可读的源码和方案。

| 目录 | 片名 | 能学到的写法 |
|---|---|---|
| `crayon-seed-rain/` | 《下雨啦》小兔、小熊、乌云 | 户外大页面；两道水彩带依次刷过；白蜡雨滴显影；叶子下面留干（水彩挖空）；换张表演（转圈、耳朵耷拉）；乌云被涂成粉色 = 情绪变化 |
| `goodnight-kitten/` | 《晚安，小猫》小猫、小狗 | 室内卧室；角色从画外跑进来再跳上床；"涂出一床被子"作为动作；水彩只刷窗玻璃（矩形裁切）；白蜡星星连成星座；台灯暖光 + 笔触抖动渐静的收尾 |

每个目录里：`TREATMENT.md` 方案、`pal.js` 蜡笔盒、`chars.js` 角色、`world.js` 场景与水彩、`film.js` 时间线/镜头/事件/字幕、`sheet.js` 角色设定页、`lines.json` 配音设置、`music/score.py` 配乐、`mix.py` 混音、`build.sh`。

渲染引擎文件（`gl.js`、`crayon.js`、`rig.js`、`index.html`、字体）没有重复放在这里，在 `starter/` 里。要重新跑某个示例：

```sh
sh "<skill dir>/scripts/new-project.sh" <新目录>
cp examples/goodnight-kitten/*.js examples/goodnight-kitten/*.json examples/goodnight-kitten/mix.py <新目录>/
cp examples/goodnight-kitten/music/score.py <新目录>/music/
sh <新目录>/build.sh      # 会联网重新生成配音
```
