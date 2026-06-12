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

  { id: 'gomoku', name: '五子棋', icon: '⚫', bg: 'linear-gradient(180deg,#e2b06a,#a8732f)', cat: '游戏',
    desc: '人机对战,AI 不好惹', long: '木纹棋盘上的经典五子棋:支持人机对战(启发式 AI,会堵你的活三冲四)与本地双人对战,带悔棋和胜局高亮。执黑先行,祝你好运。',
    author: 'Pixel 工作室', ver: '1.0.0', size: '0.8 MB', rating: '4.7', dl: '5.2万',
    type: 'page', source: 'apps/gomoku/index.html', w: 520, h: 620 },

  { id: 'mines', name: '扫雷', icon: '💣', bg: 'linear-gradient(180deg,#5b6478,#343b4a)', cat: '游戏',
    desc: '经典扫雷,初级中级', long: '原汁原味的扫雷:初级 9×9 / 中级 16×16,首点必不踩雷,右键插旗(触控板可开旗标模式),计时挑战你的最快纪录。',
    author: 'Pixel 工作室', ver: '1.2.0', size: '0.6 MB', rating: '4.6', dl: '11.8万',
    type: 'page', source: 'apps/mines/index.html', w: 460, h: 580 },

  { id: 'klotski', name: '华容道', icon: '🏯', bg: 'linear-gradient(180deg,#b85843,#7c3325)', cat: '游戏',
    desc: '送曹操逃出生天', long: '中国古典滑块谜题,经典「横刀立马」开局:拖动滑块腾挪空间,把曹操送到底部出口。理论最少 81 步,你能用几步?',
    author: 'BrainLab', ver: '1.0.0', size: '0.5 MB', rating: '4.8', dl: '3.4万',
    type: 'page', source: 'apps/klotski/index.html', w: 460, h: 620 },

  { id: 'typing', name: '打字测速', icon: '⌨️', bg: 'linear-gradient(180deg,#6b7ce0,#3d4cb0)', cat: '效率',
    desc: '60 秒测出你的手速', long: '中英文双语打字测试:实时逐字着色反馈,统计字符/分钟、准确率与错字数。计时从第一个字符开始,60 秒或完成全文结束。',
    author: 'FocusLab', ver: '1.0.0', size: '0.5 MB', rating: '4.5', dl: '6.9万',
    type: 'page', source: 'apps/typing/index.html', w: 660, h: 500 },

  { id: 'markdown', name: 'Markdown', icon: '✍️', bg: 'linear-gradient(180deg,#4a5266,#2c313e)', cat: '效率',
    desc: '左手写作,右手预览', long: '极简 Markdown 编辑器:左侧编写、右侧实时渲染,支持标题、加粗斜体、列表、引用、代码块、链接与分割线,Tab 键缩进。',
    author: 'Zebo', ver: '1.1.0', size: '0.6 MB', rating: '4.6', dl: '4.7万',
    type: 'page', source: 'apps/markdown/index.html', w: 840, h: 560 },

  { id: 'noise', name: '白噪音', icon: '🎧', bg: 'linear-gradient(180deg,#4d8d9c,#2c5d6e)', cat: '效率',
    desc: '雨声海浪,专注入眠', long: '纯 Web Audio 实时合成的环境音:雨声、海浪、风声、白噪,四轨可叠加混音、独立调音量。没有任何音频文件,全靠数学。',
    author: 'FocusLab', ver: '2.0.0', size: '0.3 MB', rating: '4.8', dl: '15.6万',
    type: 'page', source: 'apps/noise/index.html', w: 420, h: 500 },

  { id: 'scicalc', name: '科学计算器', icon: '🧮', bg: 'linear-gradient(180deg,#3a3f4d,#22252e)', cat: '工具',
    desc: '三角对数,角度弧度', long: '全功能科学计算器:三角函数(deg/rad 切换)、对数、幂与开方、π/e 常量、百分号与倒数,带可点击的历史记录,支持键盘输入。',
    author: 'Zebo', ver: '1.0.0', size: '0.4 MB', rating: '4.7', dl: '9.3万',
    type: 'page', source: 'apps/scicalc/index.html', w: 380, h: 560 },

  { id: 'jsonfmt', name: 'JSON 工具', icon: '{ }', bg: 'linear-gradient(180deg,#3f8f6a,#22593f)', cat: '工具',
    desc: '格式化 · 树视图 · 路径查询', long: '开发者的 JSON 瑞士军刀:格式化 / 压缩 / 键排序、语法高亮、可折叠树视图、JSONPath 路径查询(如 $.stats.stars)。独有宽松解析,自动容错注释、单引号、尾逗号、无引号键与 Python 字面量;带行号的编辑器会高亮出错行并定位到列,还能一键转义 / 还原字符串。',
    author: 'Zebo', ver: '1.1.0', size: '0.4 MB', rating: '4.9', dl: '8.1万',
    type: 'page', source: 'apps/jsonfmt/index.html', w: 720, h: 520 },

  { id: 'colors', name: '调色盘', icon: '🌈', bg: 'linear-gradient(180deg,#e07ab8,#8d4ad0)', cat: '工具',
    desc: '取色配色,一键复制', long: '设计师的小工具:HEX / RGB / HSL 实时互转与复制,自动生成九级明暗阶和互补、分裂互补、三元、类似四套配色方案,点任意色块即可继续探索。',
    author: 'Zebo', ver: '1.0.0', size: '0.4 MB', rating: '4.6', dl: '5.5万',
    type: 'page', source: 'apps/colors/index.html', w: 560, h: 540 },

  { id: 'convert', name: '单位换算', icon: '⇄', bg: 'linear-gradient(180deg,#e0a04f,#b06a1f)', cat: '工具',
    desc: '七类单位,双向换算', long: '长度、重量、温度、面积、速度、数据、时间七大类单位双向实时换算,附常用数值速查表。支持斤两、亩、节、马赫这些教科书之外的老朋友。',
    author: 'Zebo', ver: '1.0.0', size: '0.3 MB', rating: '4.5', dl: '7.2万',
    type: 'page', source: 'apps/convert/index.html', w: 520, h: 500 },

  { id: 'osm', name: '世界地图', icon: '🗺️', bg: 'linear-gradient(180deg,#9be39b,#2f9e6e)', cat: '工具',
    desc: 'OpenStreetMap 在线地图', long: '基于 OpenStreetMap 的在线地图(URL 应用示例)。需要联网,数据来自 openstreetmap.org。',
    author: 'OSM 社区', ver: '—', size: '在线', rating: '4.7', dl: '9.6万',
    type: 'url', source: 'https://www.openstreetmap.org/export/embed.html?bbox=116.25,39.85,116.55,40.02&layer=mapnik', w: 720, h: 520 },
];
