/* ============ App Store 商店目录 ============
 * 每个应用一条记录;新增应用 = 在 apps/ 下建目录写 index.html,这里加一条。
 * type: 'page' = 本地静态应用(沙箱 iframe 按需加载,source 为路径)
 *       'url'  = 外部网页应用(普通 iframe)
 * feat: true   = 发现页"本周推荐"横幅(取第一个命中的)
 */
window.StoreCatalog = [
  { id: 'snake', name: '贪吃蛇', icon: '🐍', bg: 'linear-gradient(180deg,#3dd86e,#0f9d44)', cat: '游戏',
    desc: '经典街机,方向键走起', long: '最经典的贪吃蛇:方向键或 WASD 控制,吃到红色食物加 10 分,撞到自己游戏结束。穿墙是特性,不是 bug。',
    author: 'Pixel 工作室', ver: '2.1.0', size: '1.2 MB', rating: '4.8', dl: '12.4万',
    type: 'page', source: 'apps/snake/index.html', w: 420, h: 470 },

  { id: 'g2048', name: '2048', icon: '🔢', bg: 'linear-gradient(180deg,#f7d774,#eda93b)', cat: '游戏', feat: true,
    desc: '滑动合并,冲向 2048', long: '风靡全球的数字合并游戏。方向键滑动方块,相同数字合并翻倍,试着拼出 2048!支持 WASD。',
    author: 'Pixel 工作室', ver: '1.6.2', size: '0.9 MB', rating: '4.9', dl: '45.1万',
    type: 'page', source: 'apps/2048/index.html', w: 420, h: 520 },

  { id: 'memory', name: '记忆翻牌', icon: '🃏', bg: 'linear-gradient(180deg,#7f8ff0,#4a5ad8)', cat: '游戏',
    desc: '考验记忆力的配对游戏', long: '翻开两张牌,图案相同即可消除。用最少的步数清空整个棋盘,挑战你的瞬时记忆。',
    author: 'BrainLab', ver: '1.0.4', size: '0.7 MB', rating: '4.6', dl: '3.8万',
    type: 'page', source: 'apps/memory/index.html', w: 420, h: 500 },

  { id: 'reader', name: '书阁', icon: '📖', bg: 'linear-gradient(160deg,#caa86a,#8a5a2b)', cat: '阅读',
    desc: '丝滑翻页的电子书阅读器', long: '一款界面考究的电子书阅读器:用 CSS 多栏实现真实分页,配合手势跟手翻页,顺滑如纸。内置《道德经》《唐诗选》《世说新语》及一本原创《本机手册》(均为公共领域或原创文本)。支持目录跳转、纸 / 米黄 / 夜间三种主题,以及字号、行距、字体调节。',
    author: 'Zebo', ver: '1.0.0', size: '0.4 MB', rating: '4.9', dl: '7.7万',
    type: 'page', source: 'apps/reader/index.html', w: 760, h: 560 },

  { id: 'paint', name: '画板', icon: '🎨', bg: 'linear-gradient(180deg,#fdfdfd,#d8dde6)', cat: '工具',
    desc: '随手涂鸦的小画板', long: '简洁的自由绘画工具:调色板、笔刷粗细、橡皮擦、一键清空。灵感来了就画两笔。',
    author: 'Zebo', ver: '1.3.0', size: '0.5 MB', rating: '4.5', dl: '6.2万',
    type: 'page', source: 'apps/paint/index.html', w: 680, h: 500 },

  { id: 'pomo', name: '番茄钟', icon: '🍅', bg: 'linear-gradient(180deg,#ff8a7a,#e8493a)', cat: '效率',
    desc: '25 分钟专注一件事', long: '基于番茄工作法的极简计时器:专注 25 分钟、休息 5 分钟,带环形进度和完成提示音。',
    author: 'FocusLab', ver: '3.0.1', size: '0.6 MB', rating: '4.7', dl: '20.3万',
    type: 'page', source: 'apps/pomo/index.html', w: 380, h: 460 },

  { id: 'watch', name: '秒表', icon: '⏱️', bg: 'linear-gradient(180deg,#3c3c46,#17171d)', cat: '效率',
    desc: '精确到百分之一秒', long: '简洁的秒表:启动 / 停止 / 计次 / 复位,精确到 10 毫秒,适合掐一切需要掐的东西。',
    author: 'FocusLab', ver: '1.1.0', size: '0.4 MB', rating: '4.4', dl: '8.9万',
    type: 'page', source: 'apps/watch/index.html', w: 380, h: 460 },

  { id: 'osm', name: '世界地图', icon: '🗺️', bg: 'linear-gradient(180deg,#9be39b,#2f9e6e)', cat: '工具',
    desc: 'OpenStreetMap 在线地图', long: '基于 OpenStreetMap 的在线地图(URL 应用示例)。需要联网,数据来自 openstreetmap.org。',
    author: 'OSM 社区', ver: '—', size: '在线', rating: '4.7', dl: '9.6万',
    type: 'url', source: 'https://www.openstreetmap.org/export/embed.html?bbox=116.25,39.85,116.55,40.02&layer=mapnik', w: 720, h: 520 },
];
