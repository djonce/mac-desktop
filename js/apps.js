/* ============ 应用与图标 ============ */
const Apps = (() => {

  /* ---------- 图标 ---------- */
  const tile = (bg, glyph, extra = '') =>
    `<span class="app-icon" style="background:${bg};${extra}">${glyph}</span>`;
  const svgTile = svg => `<span class="app-icon">${svg}</span>`;

  const finderSVG = `<svg viewBox="0 0 64 64">
    <defs><linearGradient id="ig-fndr" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#8ecdf7"/><stop offset="1" stop-color="#1668d8"/></linearGradient></defs>
    <rect width="64" height="64" fill="url(#ig-fndr)"/>
    <path d="M0 0 H37 C30.5 21 30.5 43 37 64 H0 Z" fill="#fbfcfe" opacity=".94"/>
    <rect x="17" y="17" width="4.6" height="13" rx="2.3" fill="#1b3f8f"/>
    <rect x="43" y="17" width="4.6" height="13" rx="2.3" fill="#fff"/>
    <path d="M13 41 Q32 53 51 41" fill="none" stroke="#1b3f8f" stroke-width="4" stroke-linecap="round"/>
  </svg>`;

  const termSVG = `<svg viewBox="0 0 64 64">
    <rect width="64" height="64" fill="#17171a"/>
    <text x="9" y="29" font-family="Menlo,Consolas,monospace" font-size="19" font-weight="700" fill="#39d353">&gt;_</text>
  </svg>`;

  const notesSVG = `<svg viewBox="0 0 64 64">
    <rect width="64" height="64" fill="#fffefa"/>
    <rect width="64" height="16" fill="#f7c64a"/>
    <line x1="11" y1="30" x2="53" y2="30" stroke="#d9d9de" stroke-width="2.6"/>
    <line x1="11" y1="40" x2="53" y2="40" stroke="#d9d9de" stroke-width="2.6"/>
    <line x1="11" y1="50" x2="40" y2="50" stroke="#d9d9de" stroke-width="2.6"/>
  </svg>`;

  const calcSVG = `<svg viewBox="0 0 64 64">
    <rect width="64" height="64" fill="#2e2e33"/>
    <rect x="11" y="9" width="42" height="13" rx="3" fill="#191a1c"/>
    <circle cx="18" cy="33" r="4.6" fill="#eee"/><circle cx="32" cy="33" r="4.6" fill="#eee"/><circle cx="46" cy="33" r="4.6" fill="#ff9f0a"/>
    <circle cx="18" cy="47" r="4.6" fill="#eee"/><circle cx="32" cy="47" r="4.6" fill="#eee"/><circle cx="46" cy="47" r="4.6" fill="#ff9f0a"/>
  </svg>`;

  const calSVG = (d => `<svg viewBox="0 0 64 64">
    <rect width="64" height="64" fill="#fff"/>
    <rect width="64" height="17" fill="#ff3b30"/>
    <text x="32" y="13" text-anchor="middle" font-size="9.5" fill="#fff" font-family="-apple-system,'PingFang SC',sans-serif">周${'日一二三四五六'[d.getDay()]}</text>
    <text x="32" y="51" text-anchor="middle" font-size="31" font-weight="300" fill="#3a3a3c" font-family="-apple-system,sans-serif">${d.getDate()}</text>
  </svg>`)(new Date());

  /* ---------- 虚拟文件系统 ---------- */
  const WELCOME = `欢迎来到 macOS Web! 🎉

这是一个纯前端实现的 macOS 风格网页操作系统。

可以试试:
 · 拖动、缩放窗口,点红绿灯按钮
 · Dock 图标的放大效果与弹跳启动
 · 右键点击桌面
 · 菜单栏右侧的聚焦搜索(⌘K)与控制中心
 · 终端里输入 neofetch
 · 系统设置里换壁纸、开深色模式
 · 给"信息"里的 Claude 发条消息
 · 去 App Store 安装小游戏,或发布你自己写的网页应用

玩得开心!`;

  const fo = name => ({ name, kind: 'folder', glyph: '📁' });
  const fi = (name, glyph) => ({ name, kind: 'file', glyph });
  const tf = (name, content) => ({ name, kind: 'file', glyph: '📄', content });
  const ap = (name, appId, glyph) => ({ name, kind: 'app', appId, glyph });

  const FS = {
    '~': [fo('应用程序'), fo('文稿'), fo('下载'), fo('图片'), fo('音乐'), fo('桌面'), tf('欢迎使用.txt', WELCOME)],
    '~/文稿': [tf('周报.md', '# 本周工作\n\n- 用 HTML/CSS/JS 复刻了一个 macOS\n- 修复了 0 个 bug(因为没有 bug)\n- 摸鱼 2 小时'), fi('简历.pdf', '📕'), fo('旧项目')],
    '~/文稿/旧项目': [tf('main.c', '#include <stdio.h>\n\nint main() {\n    printf("Hello, macOS Web!\\n");\n    return 0;\n}')],
    '~/下载': [fi('Sequoia壁纸包.zip', '🗜️'), fi('Xcode.dmg', '💿'), fi('表情包.gif', '🖼️')],
    '~/图片': [fi('IMG_0001.jpg', '🌅'), fi('IMG_0002.jpg', '🏔️'), fi('IMG_0003.jpg', '🌃'), fi('自拍.heic', '🤳')],
    '~/音乐': [fi('夜曲.mp3', '🎵'), fi('Bohemian Rhapsody.mp3', '🎵'), fi('海阔天空.flac', '🎵')],
    '~/桌面': [tf('待办.txt', '1. 给网页 macOS 加个亿点细节\n2. 喝水\n3. 早睡(大概)')],
    '~/应用程序': [],   // 启动时根据注册表填充
    '~/最近使用': [tf('欢迎使用.txt', WELCOME), fi('IMG_0003.jpg', '🌃'), tf('待办.txt', '1. 给网页 macOS 加个亿点细节\n2. 喝水\n3. 早睡(大概)')],
  };

  function openEntry(entry, finderState) {
    if (entry.kind === 'app') { WM.open(entry.appId); return; }
    if (entry.kind === 'file') {
      if (entry.content != null) {
        WM.createWindow('textview', { title: entry.name, text: entry.content, width: 520, height: 400 });
      } else {
        System.notify('访达', `没有可以打开"${entry.name}"的应用`, registry.finder.icon);
      }
    }
  }

  /* ---------- 访达 ---------- */
  function renderFinder(root, win) {
    const state = { path: '~', back: [], fwd: [] };
    root.innerHTML = `
      <div class="app-split">
        <div class="app-sidebar">
          <div class="sb-title">个人收藏</div>
          <div class="sb-item" data-p="~/最近使用"><span class="sb-ic">🕘</span>最近使用</div>
          <div class="sb-item" data-p="~/应用程序"><span class="sb-ic">⊞</span>应用程序</div>
          <div class="sb-item" data-p="~/桌面"><span class="sb-ic">🖥</span>桌面</div>
          <div class="sb-item" data-p="~/文稿"><span class="sb-ic">📄</span>文稿</div>
          <div class="sb-item" data-p="~/下载"><span class="sb-ic">⬇️</span>下载</div>
          <div class="sb-item" data-p="~/图片"><span class="sb-ic">🖼</span>图片</div>
          <div class="sb-item" data-p="~/音乐"><span class="sb-ic">🎵</span>音乐</div>
          <div class="sb-title">位置</div>
          <div class="sb-item" data-p="~"><span class="sb-ic">💽</span>Macintosh HD</div>
        </div>
        <div class="app-main">
          <div class="finder-toolbar">
            <button class="tool-btn" data-act="back">‹</button>
            <button class="tool-btn" data-act="fwd">›</button>
            <span class="finder-path"></span>
          </div>
          <div class="finder-grid"></div>
          <div class="finder-status"></div>
        </div>
      </div>`;

    const grid = root.querySelector('.finder-grid');
    const pathEl = root.querySelector('.finder-path');
    const statusEl = root.querySelector('.finder-status');

    function nav(p, push = true) {
      if (push && p !== state.path) { state.back.push(state.path); state.fwd = []; }
      state.path = p;
      draw();
    }
    function draw() {
      const items = FS[state.path] || [];
      pathEl.textContent = state.path === '~' ? 'Macintosh HD' : state.path.split('/').pop();
      win.el.querySelector('.title').textContent = pathEl.textContent;
      statusEl.textContent = `${items.length} 个项目 · 可用空间 256 GB`;
      root.querySelectorAll('.sb-item').forEach(s => s.classList.toggle('active', s.dataset.p === state.path));
      grid.innerHTML = items.length
        ? items.map((it, i) => `
            <div class="fi" data-i="${i}">
              <span class="fi-glyph">${it.glyph}</span>
              <span class="fi-name">${it.name}</span>
            </div>`).join('')
        : `<div class="finder-empty">文件夹为空</div>`;
    }

    grid.addEventListener('click', e => {
      const fiEl = e.target.closest('.fi');
      grid.querySelectorAll('.fi').forEach(x => x.classList.toggle('selected', x === fiEl));
    });
    grid.addEventListener('dblclick', e => {
      const fiEl = e.target.closest('.fi');
      if (!fiEl) return;
      const entry = (FS[state.path] || [])[+fiEl.dataset.i];
      if (!entry) return;
      if (entry.kind === 'folder') nav(state.path + '/' + entry.name);
      else openEntry(entry, state);
    });
    root.querySelectorAll('.sb-item[data-p]').forEach(s =>
      s.addEventListener('click', () => nav(s.dataset.p)));
    root.querySelector('[data-act=back]').addEventListener('click', () => {
      if (state.back.length) { state.fwd.push(state.path); state.path = state.back.pop(); draw(); }
    });
    root.querySelector('[data-act=fwd]').addEventListener('click', () => {
      if (state.fwd.length) { state.back.push(state.path); state.path = state.fwd.pop(); draw(); }
    });

    nav(win.opts.path || '~', false);
  }

  /* ---------- Safari ---------- */
  function renderSafari(root) {
    root.innerHTML = `
      <div class="safari-bar">
        <button class="tool-btn" data-act="back">‹</button>
        <button class="tool-btn" data-act="fwd">›</button>
        <button class="tool-btn" data-act="home" title="起始页">⌂</button>
        <input class="safari-url" placeholder="搜索或输入网站名称" spellcheck="false">
        <button class="tool-btn" data-act="reload">⟳</button>
      </div>
      <div class="safari-body">
        <iframe class="hidden" referrerpolicy="no-referrer"></iframe>
        <div class="safari-start">
          <h2>个人收藏</h2>
          <div class="fav-grid">
            <button class="fav" data-url="https://www.bing.com"><span class="fav-ic" style="background:linear-gradient(135deg,#00b294,#0078d4);color:#fff">b</span>Bing</button>
            <button class="fav" data-url="https://zh.wikipedia.org"><span class="fav-ic" style="background:#fff;color:#000;font-family:serif;font-weight:700">W</span>维基百科</button>
            <button class="fav" data-url="https://www.openstreetmap.org/export/embed.html?bbox=116.2,39.8,116.6,40.05"><span class="fav-ic">🗺️</span>地图</button>
            <button class="fav" data-url="https://example.com"><span class="fav-ic">🌐</span>Example</button>
            <button class="fav" data-url="https://developer.mozilla.org"><span class="fav-ic" style="background:#1b1b1f;color:#fff;font-weight:800">M</span>MDN</button>
          </div>
          <p class="safari-tip">提示:这是一个真实的内嵌浏览器(iframe)。<br>部分站点(如 Google、知乎)出于安全策略会拒绝被嵌入,打开后可能显示空白 —— 这不是 bug,是对方网站的限制。</p>
        </div>
      </div>`;

    const url = root.querySelector('.safari-url');
    const frame = root.querySelector('iframe');
    const start = root.querySelector('.safari-start');

    function go(raw) {
      let u = raw.trim();
      if (!u) return;
      if (!/^https?:\/\//.test(u)) {
        u = /\.[a-z]{2,}($|\/)/i.test(u) ? 'https://' + u : 'https://www.bing.com/search?q=' + encodeURIComponent(u);
      }
      url.value = u;
      frame.src = u;
      frame.classList.remove('hidden');
      start.classList.add('hidden');
    }
    url.addEventListener('keydown', e => { if (e.key === 'Enter') go(url.value); });
    root.querySelectorAll('.fav').forEach(f => f.addEventListener('click', () => go(f.dataset.url)));
    root.querySelector('[data-act=reload]').addEventListener('click', () => { if (frame.src) frame.src = frame.src; });
    root.querySelector('[data-act=back]').addEventListener('click', () => history.length && frame.contentWindow && window.history.length); // iframe 历史受同源限制,仅作装饰
    root.querySelector('[data-act=home]').addEventListener('click', () => {
      frame.classList.add('hidden'); frame.src = 'about:blank';
      start.classList.remove('hidden'); url.value = '';
    });
  }

  /* ---------- 备忘录 ---------- */
  function renderNotes(root) {
    let notes = JSON.parse(localStorage.getItem('mw-notes') || 'null') || [
      { id: 1, body: '欢迎使用备忘录 ✍️\n\n内容会自动保存到浏览器本地,刷新页面也不会丢。\n\n点左上角 + 新建一条试试。', time: Date.now() }
    ];
    let cur = notes[0]?.id ?? null;
    const save = () => localStorage.setItem('mw-notes', JSON.stringify(notes));

    root.innerHTML = `
      <div class="notes-toolbar">
        <button class="tool-btn" data-act="new" title="新建备忘录">📝</button>
        <button class="tool-btn" data-act="del" title="删除">🗑</button>
      </div>
      <div class="app-split">
        <div class="notes-list"></div>
        <div class="notes-editor"><textarea placeholder="开始输入…"></textarea></div>
      </div>`;

    const list = root.querySelector('.notes-list');
    const ta = root.querySelector('textarea');

    function drawList() {
      list.innerHTML = notes.map(n => {
        const lines = n.body.split('\n').filter(Boolean);
        return `<div class="note-row ${n.id === cur ? 'active' : ''}" data-id="${n.id}">
          <b>${(lines[0] || '新备忘录').slice(0, 30)}</b>
          <small>${new Date(n.time).toLocaleDateString('zh-CN')} ${(lines[1] || '无附加文字').slice(0, 24)}</small>
        </div>`;
      }).join('');
    }
    function load() {
      const n = notes.find(x => x.id === cur);
      ta.value = n ? n.body : '';
      ta.disabled = !n;
    }
    drawList(); load();

    list.addEventListener('click', e => {
      const row = e.target.closest('.note-row');
      if (!row) return;
      cur = +row.dataset.id; drawList(); load();
    });
    ta.addEventListener('input', () => {
      const n = notes.find(x => x.id === cur);
      if (!n) return;
      n.body = ta.value; n.time = Date.now();
      save(); drawList();
    });
    root.querySelector('[data-act=new]').addEventListener('click', () => {
      const n = { id: Date.now(), body: '', time: Date.now() };
      notes.unshift(n); cur = n.id;
      save(); drawList(); load(); ta.focus();
    });
    root.querySelector('[data-act=del]').addEventListener('click', () => {
      notes = notes.filter(x => x.id !== cur);
      cur = notes[0]?.id ?? null;
      save(); drawList(); load();
    });
  }

  /* ---------- 计算器 ---------- */
  function renderCalc(root) {
    root.innerHTML = `
      <div class="calc">
        <div class="calc-display">0</div>
        <div class="calc-grid">
          <button class="fn" data-k="ac">AC</button><button class="fn" data-k="neg">⁺∕₋</button><button class="fn" data-k="pct">%</button><button class="op" data-k="/">÷</button>
          <button data-k="7">7</button><button data-k="8">8</button><button data-k="9">9</button><button class="op" data-k="*">×</button>
          <button data-k="4">4</button><button data-k="5">5</button><button data-k="6">6</button><button class="op" data-k="-">−</button>
          <button data-k="1">1</button><button data-k="2">2</button><button data-k="3">3</button><button class="op" data-k="+">+</button>
          <button class="zero" data-k="0">0</button><button data-k=".">.</button><button class="op" data-k="=">=</button>
        </div>
      </div>`;

    const disp = root.querySelector('.calc-display');
    let cur = '0', acc = null, op = null, fresh = true;

    const fmt = n => {
      if (!isFinite(n)) return '错误';
      const s = String(+(+n).toPrecision(12));
      return s.length > 12 ? (+n).toExponential(5) : s;
    };
    const show = () => {
      disp.textContent = cur;
      root.querySelectorAll('.op').forEach(b =>
        b.classList.toggle('hl', fresh && op === b.dataset.k));
    };
    const compute = () => {
      const b = parseFloat(cur);
      let r = acc;
      if (op === '+') r = acc + b;
      if (op === '-') r = acc - b;
      if (op === '*') r = acc * b;
      if (op === '/') r = b === 0 ? Infinity : acc / b;
      cur = fmt(r); acc = parseFloat(cur);
    };

    root.querySelector('.calc-grid').addEventListener('click', e => {
      const k = e.target.dataset?.k;
      if (!k) return;
      if (/^[0-9.]$/.test(k)) {
        if (fresh) { cur = k === '.' ? '0.' : k; fresh = false; }
        else if (!(k === '.' && cur.includes('.'))) cur = (cur === '0' && k !== '.') ? k : cur + k;
        if (cur.replace(/[-.]/g, '').length > 12) cur = cur.slice(0, -1);
      } else if (k === 'ac') { cur = '0'; acc = null; op = null; fresh = true; }
      else if (k === 'neg') cur = cur.startsWith('-') ? cur.slice(1) : (cur !== '0' ? '-' + cur : cur);
      else if (k === 'pct') { cur = fmt(parseFloat(cur) / 100); }
      else if (k === '=') { if (op != null && acc != null) { compute(); op = null; fresh = true; } }
      else { // + - * /
        if (op != null && acc != null && !fresh) compute();
        else acc = parseFloat(cur);
        op = k; fresh = true;
      }
      show();
    });
  }

  /* ---------- 终端 ---------- */
  function renderTerminal(root, win) {
    root.innerHTML = `<div class="term"><div class="term-out"></div>
      <div class="term-input-row"><span class="term-prompt"></span><input spellcheck="false" autocomplete="off"></div></div>`;
    const term = root.querySelector('.term');
    const out = root.querySelector('.term-out');
    const input = root.querySelector('input');
    const promptEl = root.querySelector('.term-prompt');
    let cwd = '~';
    const history = []; let hIdx = 0;
    const bootTime = Date.now();

    const promptStr = () => `zebo@MacBook-Web ${cwd.split('/').pop() || '~'} %`;
    const print = (text = '') => {
      const div = document.createElement('div');
      div.className = 'term-line';
      div.textContent = text;
      out.appendChild(div);
    };
    const printPrompt = cmd => {
      const div = document.createElement('div');
      div.className = 'term-line';
      div.innerHTML = `<span class="term-prompt"></span> `;
      div.querySelector('.term-prompt').textContent = promptStr();
      div.append(cmd);
      out.appendChild(div);
    };

    const cmds = {
      help: () => print('可用命令: help ls cd pwd cat echo date whoami uname neofetch open clear exit'),
      pwd: () => print(cwd === '~' ? '/Users/zebo' : cwd.replace('~', '/Users/zebo')),
      whoami: () => print('zebo'),
      date: () => print(new Date().toString()),
      uname: a => print(a[0] === '-a' ? 'Darwin MacBook-Web 25.5.0 WebKernel x86_64 JavaScript' : 'Darwin'),
      clear: () => { out.innerHTML = ''; },
      exit: () => WM.close(win),
      echo: a => print(a.join(' ')),
      ls: () => {
        const items = FS[cwd];
        if (!items) return print('');
        print(items.map(i => i.kind === 'folder' ? i.name + '/' : i.name).join('   '));
      },
      cd: a => {
        const t = a[0];
        if (!t || t === '~') { cwd = '~'; return; }
        if (t === '..') { if (cwd !== '~') cwd = cwd.split('/').slice(0, -1).join('/') || '~'; return; }
        const target = t.startsWith('~') ? t : cwd + '/' + t.replace(/\/$/, '');
        if (FS[target]) cwd = target;
        else print(`cd: no such file or directory: ${t}`);
      },
      cat: a => {
        if (!a[0]) return print('usage: cat <file>');
        const f = (FS[cwd] || []).find(i => i.name === a[0]);
        if (!f) return print(`cat: ${a[0]}: No such file or directory`);
        if (f.content == null) return print(`cat: ${a[0]}: 是二进制文件(假装的)`);
        print(f.content);
      },
      open: a => {
        const q = (a[0] || '').toLowerCase();
        const id = Object.keys(registry).find(k =>
          k === q || registry[k].name === a[0] || (registry[k].keywords || []).includes(q));
        if (id && !registry[id].hidden) { WM.open(id); print(`正在打开 ${registry[id].name}…`); }
        else print(`open: 找不到应用 "${a[0] || ''}",试试 open safari`);
      },
      neofetch: () => {
        const up = Math.max(1, Math.round((Date.now() - bootTime) / 60000));
        print(`
                    zebo@MacBook-Web
         .:'        -----------------
     __ :'__        OS: macOS Web 1.0 (Sequoia 风)
  .'\`__\`-'__\`\`.     Host: 你的浏览器
 :__________.-'     Kernel: JavaScript (V8/JSC)
 :_________:        Uptime: ${up} min
  :_________\`-;     Shell: zsh (仿)
   \`.__.-.__.'      Resolution: ${innerWidth}x${innerHeight}
                    Theme: ${document.body.classList.contains('dark') ? 'Dark' : 'Light'}
                    Memory: 16 GB(我猜的)`);
      },
      sudo: () => print('zebo 不在 sudoers 文件中。此事将被报告。'),
    };

    function run(line) {
      printPrompt(line);
      const [cmd, ...args] = line.trim().split(/\s+/);
      if (cmd) {
        if (cmds[cmd]) cmds[cmd](args);
        else print(`zsh: command not found: ${cmd}`);
      }
      promptEl.textContent = promptStr();
      term.scrollTop = term.scrollHeight;
    }

    print('Last login: ' + new Date().toLocaleString('zh-CN') + ' on ttys000');
    print('输入 help 查看可用命令。');
    promptEl.textContent = promptStr();

    input.addEventListener('keydown', e => {
      if (e.key === 'Enter') {
        const v = input.value; input.value = '';
        if (v.trim()) { history.push(v); hIdx = history.length; }
        run(v);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (hIdx > 0) input.value = history[--hIdx] || '';
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (hIdx < history.length) input.value = history[++hIdx] || '';
      }
    });
    term.addEventListener('click', () => input.focus());
    setTimeout(() => input.focus(), 50);
  }

  /* ---------- 日历 ---------- */
  function renderCalendar(root) {
    let view = new Date();
    root.innerHTML = `
      <div class="cal">
        <div class="cal-head">
          <h2></h2>
          <div class="cal-nav">
            <button class="tool-btn" data-n="-1">‹</button>
            <button class="tool-btn" data-n="0">今天</button>
            <button class="tool-btn" data-n="1">›</button>
          </div>
        </div>
        <div class="cal-grid"></div>
      </div>`;
    const grid = root.querySelector('.cal-grid');
    const title = root.querySelector('h2');

    function draw() {
      const y = view.getFullYear(), m = view.getMonth();
      title.textContent = `${y}年${m + 1}月`;
      const first = new Date(y, m, 1).getDay();
      const days = new Date(y, m + 1, 0).getDate();
      const prevDays = new Date(y, m, 0).getDate();
      const today = new Date();
      let html = ['日', '一', '二', '三', '四', '五', '六'].map(d => `<div class="cal-dow">${d}</div>`).join('');
      for (let i = first - 1; i >= 0; i--) html += `<div class="cal-day dim">${prevDays - i}</div>`;
      for (let d = 1; d <= days; d++) {
        const isToday = d === today.getDate() && m === today.getMonth() && y === today.getFullYear();
        html += `<div class="cal-day ${isToday ? 'today' : ''}">${d}</div>`;
      }
      const total = first + days;
      for (let i = 1; i <= (7 - total % 7) % 7; i++) html += `<div class="cal-day dim">${i}</div>`;
      grid.innerHTML = html;
    }
    root.querySelectorAll('.cal-nav .tool-btn').forEach(b => b.addEventListener('click', () => {
      const n = +b.dataset.n;
      view = n === 0 ? new Date() : new Date(view.getFullYear(), view.getMonth() + n, 1);
      draw();
    }));
    draw();
  }

  /* ---------- 音乐 ---------- */
  function renderMusic(root, win) {
    const songs = [
      { t: '夜曲', a: '周杰伦 — 十一月的萧邦', cover: '🌙', dur: 237 },
      { t: '海阔天空', a: 'Beyond — 乐与怒', cover: '🌊', dur: 326 },
      { t: 'Bohemian Rhapsody', a: 'Queen — A Night at the Opera', cover: '👑', dur: 354 },
      { t: 'Levitating', a: 'Dua Lipa — Future Nostalgia', cover: '🪩', dur: 203 },
      { t: 'Lemon', a: '米津玄師 — BOOTLEG', cover: '🍋', dur: 256 },
      { t: '稻香', a: '周杰伦 — 魔杰座', cover: '🌾', dur: 223 },
    ];
    let idx = -1, playing = false, pos = 0, timer = null;

    root.innerHTML = `
      <div class="music">
        <div class="music-list">
          ${songs.map((s, i) => `
            <div class="song-row" data-i="${i}">
              <span class="song-cover">${s.cover}</span>
              <div><b>${s.t}</b><small>${s.a}</small></div>
              <span class="song-dur">${Math.floor(s.dur / 60)}:${String(s.dur % 60).padStart(2, '0')}</span>
            </div>`).join('')}
        </div>
      </div>
      <div class="music-now">
        <span class="song-cover" id="now-cover">💿</span>
        <div class="music-meta"><b id="now-title">未在播放</b><small id="now-artist">—</small></div>
        <div class="music-ctrl">
          <button class="tool-btn" data-c="prev">⏮</button>
          <button class="tool-btn" data-c="play">▶️</button>
          <button class="tool-btn" data-c="next">⏭</button>
        </div>
        <div class="music-prog"><div class="fill"></div></div>
      </div>`;

    const $ = s => root.querySelector(s);
    const fill = $('.music-prog .fill');

    function tick() {
      pos++;
      if (pos >= songs[idx].dur) return play((idx + 1) % songs.length);
      fill.style.width = (pos / songs[idx].dur * 100) + '%';
    }
    function syncUI() {
      root.querySelectorAll('.song-row').forEach((r, i) => r.classList.toggle('playing', i === idx));
      $('#now-cover').textContent = idx >= 0 ? songs[idx].cover : '💿';
      $('#now-cover').classList.toggle('spin', playing);
      $('#now-title').textContent = idx >= 0 ? songs[idx].t : '未在播放';
      $('#now-artist').textContent = idx >= 0 ? songs[idx].a : '—';
      $('[data-c=play]').textContent = playing ? '⏸' : '▶️';
    }
    function play(i) {
      idx = i; pos = 0; playing = true;
      fill.style.width = '0%';
      clearInterval(timer);
      timer = setInterval(tick, 1000);
      syncUI();
    }
    function pause() { playing = false; clearInterval(timer); syncUI(); }

    root.querySelectorAll('.song-row').forEach(r =>
      r.addEventListener('dblclick', () => play(+r.dataset.i)));
    $('[data-c=play]').addEventListener('click', () => {
      if (idx < 0) return play(0);
      playing ? pause() : (playing = true, timer = setInterval(tick, 1000), syncUI());
    });
    $('[data-c=next]').addEventListener('click', () => play(idx < 0 ? 0 : (idx + 1) % songs.length));
    $('[data-c=prev]').addEventListener('click', () => play(idx <= 0 ? songs.length - 1 : idx - 1));

    win.onCleanup = () => clearInterval(timer);
  }

  /* ---------- 信息 ---------- */
  function renderMessages(root) {
    const contacts = [
      { id: 'claude', name: 'Claude', av: '✳️', bg: 'linear-gradient(180deg,#e8855e,#c4633a)', last: '有什么可以帮你的?' },
      { id: 'mom', name: '老妈', av: '👩', bg: 'linear-gradient(180deg,#f093fb,#f5576c)', last: '记得吃饭' },
      { id: 'xm', name: '王小明', av: '🧑', bg: 'linear-gradient(180deg,#4facfe,#00f2fe)', last: '周末打球吗' },
    ];
    const chats = {
      claude: [{ me: 0, t: '你好!我是 Claude。这个网页版 macOS 不错吧?有什么可以帮你的?' }],
      mom: [{ me: 0, t: '在干嘛呢' }, { me: 1, t: '在写代码' }, { me: 0, t: '记得吃饭' }],
      xm: [{ me: 0, t: '周末打球吗' }],
    };
    const replies = {
      claude: ['收到!不过我只是这个演示系统里的占位 AI 😄', '建议试试终端里的 neofetch,挺帅的。', '这个窗口可以拖动和缩放,试试看?', '深色模式在控制中心,一键切换。', '好问题!可惜我的上下文只有这个聊天框这么大。'],
      mom: ['多喝热水', '早点睡', '记得吃饭', '钱够不够花?'],
      xm: ['好嘞', '哈哈哈哈', '可以可以', '下次一定'],
    };
    let cur = 'claude';
    const rIdx = { claude: 0, mom: 0, xm: 0 };

    root.innerHTML = `
      <div class="app-split">
        <div class="msg-contacts"></div>
        <div class="msg-pane">
          <div class="msg-scroll"></div>
          <div class="msg-inputbar">
            <input placeholder="信息" autocomplete="off">
            <button class="tool-btn" data-act="send" style="color:var(--accent);opacity:1">⬆️</button>
          </div>
        </div>
      </div>`;

    const cEl = root.querySelector('.msg-contacts');
    const scroll = root.querySelector('.msg-scroll');
    const input = root.querySelector('input');

    function drawContacts() {
      cEl.innerHTML = contacts.map(c => `
        <div class="contact-row ${c.id === cur ? 'active' : ''}" data-id="${c.id}">
          <span class="avatar" style="background:${c.bg}">${c.av}</span>
          <div><b>${c.name}</b><small>${c.last}</small></div>
        </div>`).join('');
    }
    function drawChat() {
      scroll.innerHTML = chats[cur].map(m =>
        `<div class="bubble ${m.me ? 'me' : 'them'}">${m.t}</div>`).join('');
      scroll.scrollTop = scroll.scrollHeight;
    }
    drawContacts(); drawChat();

    cEl.addEventListener('click', e => {
      const row = e.target.closest('.contact-row');
      if (!row) return;
      cur = row.dataset.id; drawContacts(); drawChat();
    });

    function send() {
      const v = input.value.trim();
      if (!v) return;
      input.value = '';
      const who = cur;
      chats[who].push({ me: 1, t: v });
      drawChat();
      setTimeout(() => {
        const pool = replies[who];
        const reply = pool[rIdx[who]++ % pool.length];
        chats[who].push({ me: 0, t: reply });
        contacts.find(c => c.id === who).last = reply;
        drawContacts();
        if (cur === who) drawChat();
        System.notify(contacts.find(c => c.id === who).name, reply, registry.messages.icon);
      }, 900 + Math.random() * 800);
    }
    input.addEventListener('keydown', e => { if (e.key === 'Enter') send(); });
    root.querySelector('[data-act=send]').addEventListener('click', send);
  }

  /* ---------- 系统设置 ---------- */
  function renderSettings(root, win) {
    const panes = {
      appearance: () => `
        <h2>外观</h2>
        <div class="st-section"><h3>外观</h3>
          <div class="theme-cards">
            <button class="theme-card" data-theme="light"><span class="theme-prev light"></span>浅色</button>
            <button class="theme-card" data-theme="dark"><span class="theme-prev dark"></span>深色</button>
          </div>
        </div>
        <div class="st-section"><h3>强调色</h3>
          <div class="accent-row">
            ${['#0a84ff', '#bf5af2', '#ff2d55', '#ff9f0a', '#ffd60a', '#30d158', '#8e8e93'].map(c =>
              `<button class="accent-dot" data-c="${c}" style="background:${c};color:${c}"></button>`).join('')}
          </div>
        </div>`,
      wallpaper: () => `
        <h2>墙纸</h2>
        <div class="wall-grid">
          ${System.wallpapers.map((w, i) =>
            `<button class="wall-item" data-i="${i}"><span class="wall-prev" style="background:${w.css}"></span><span>${w.name}</span></button>`).join('')}
        </div>`,
      dock: () => `
        <h2>桌面与程序坞</h2>
        <div class="st-section"><h3>程序坞大小</h3>
          <div class="st-row">小 <input type="range" id="st-dock" min="38" max="76" value="${System.prefs.dockSize}"> 大</div>
        </div>`,
      about: () => `
        <h2>关于</h2>
        <div class="about" style="padding:0">
          <div class="mac-emoji">💻</div>
          <h2>MacBook Web Pro</h2>
          <div class="ver">macOS Web 1.0</div>
          <table>
            <tr><td>芯片</td><td>Browser Engine M∞</td></tr>
            <tr><td>内存</td><td>取决于你开了几个标签页</td></tr>
            <tr><td>序列号</td><td>WEBJS2026CN</td></tr>
          </table>
        </div>`,
    };

    root.innerHTML = `
      <div class="app-split">
        <div class="app-sidebar">
          <div class="sb-item" data-pane="appearance"><span class="sb-ic">🎨</span>外观</div>
          <div class="sb-item" data-pane="wallpaper"><span class="sb-ic">🖼</span>墙纸</div>
          <div class="sb-item" data-pane="dock"><span class="sb-ic">▭</span>桌面与程序坞</div>
          <div class="sb-item" data-pane="about"><span class="sb-ic">ℹ️</span>关于</div>
        </div>
        <div class="app-main"><div class="st-pane"></div></div>
      </div>`;

    const paneEl = root.querySelector('.st-pane');

    function show(name) {
      root.querySelectorAll('.sb-item').forEach(s => s.classList.toggle('active', s.dataset.pane === name));
      paneEl.innerHTML = panes[name]();
      syncState();
      // 绑定
      paneEl.querySelectorAll('.theme-card').forEach(b =>
        b.addEventListener('click', () => { System.setTheme(b.dataset.theme); syncState(); }));
      paneEl.querySelectorAll('.accent-dot').forEach(b =>
        b.addEventListener('click', () => { System.setAccent(b.dataset.c); syncState(); }));
      paneEl.querySelectorAll('.wall-item').forEach(b =>
        b.addEventListener('click', () => { System.setWallpaper(+b.dataset.i); syncState(); }));
      paneEl.querySelector('#st-dock')?.addEventListener('input', e => System.setDockSize(+e.target.value));
    }
    function syncState() {
      paneEl.querySelectorAll('.theme-card').forEach(b =>
        b.classList.toggle('active', b.dataset.theme === (document.body.classList.contains('dark') ? 'dark' : 'light')));
      paneEl.querySelectorAll('.accent-dot').forEach(b =>
        b.classList.toggle('active', b.dataset.c === System.prefs.accent));
      paneEl.querySelectorAll('.wall-item').forEach(b =>
        b.classList.toggle('active', +b.dataset.i === System.prefs.wallpaper));
    }
    root.querySelectorAll('.sb-item').forEach(s =>
      s.addEventListener('click', () => show(s.dataset.pane)));
    show(win.opts.pane || 'appearance');
  }

  /* ---------- 关于本机 ---------- */
  function renderAbout(root) {
    root.innerHTML = `
      <div class="about">
        <div class="mac-emoji">🖥️</div>
        <h2>macOS Web</h2>
        <div class="ver">版本 1.0(Sequoia 风格)</div>
        <table>
          <tr><td>型号</td><td>MacBook Web Pro (2026)</td></tr>
          <tr><td>芯片</td><td>Browser Engine M∞</td></tr>
          <tr><td>内核</td><td>HTML + CSS + 原生 JavaScript</td></tr>
          <tr><td>显示器</td><td>${innerWidth} × ${innerHeight}</td></tr>
        </table>
        <button class="btn" onclick="WM.open('settings')">更多信息…</button>
      </div>`;
  }

  /* ---------- 文本预览 ---------- */
  function renderTextview(root, win) {
    root.innerHTML = `<div class="textview"></div>`;
    root.querySelector('.textview').textContent = win.opts.text || '';
  }

  /* ---------- 废纸篓 ---------- */
  function renderTrash(root) {
    root.innerHTML = `
      <div class="trash-empty">
        <span>🗑️</span>
        <b>废纸篓为空</b>
        <small>你删除的项目会先放到这里(才怪,这是网页)</small>
      </div>`;
  }

  /* ---------- 注册表 ---------- */
  const registry = {
    finder:     { name: '访达', icon: svgTile(finderSVG), width: 780, height: 500, render: renderFinder, keywords: ['finder', 'file'] },
    launchpad:  { name: '启动台', icon: tile('linear-gradient(180deg,#ececf2,#b9b9c9)', '🚀'), action: () => System.toggleLaunchpad(), keywords: ['launchpad'] },
    safari:     { name: 'Safari 浏览器', icon: tile('linear-gradient(180deg,#fafbfc,#cfd8e2)', '🧭'), width: 900, height: 600, render: renderSafari, keywords: ['safari', 'browser', 'web'] },
    messages:   { name: '信息', icon: tile('linear-gradient(180deg,#6ee477,#1fb637)', '💬'), width: 680, height: 480, render: renderMessages, keywords: ['messages', 'chat', 'xinxi'] },
    notes:      { name: '备忘录', icon: svgTile(notesSVG), width: 720, height: 480, render: renderNotes, keywords: ['notes', 'beiwanglu'] },
    calendar:   { name: '日历', icon: svgTile(calSVG), width: 560, height: 480, render: renderCalendar, keywords: ['calendar', 'rili'] },
    music:      { name: '音乐', icon: tile('linear-gradient(180deg,#fb5c74,#fa233b)', '<span style="color:#fff">♫</span>'), width: 620, height: 480, render: renderMusic, keywords: ['music', 'yinyue'] },
    calculator: { name: '计算器', icon: svgTile(calcSVG), width: 280, height: 440, render: renderCalc, keywords: ['calculator', 'jisuanqi'] },
    terminal:   { name: '终端', icon: svgTile(termSVG), width: 640, height: 420, render: renderTerminal, single: false, keywords: ['terminal', 'zhongduan', 'shell'] },
    settings:   { name: '系统设置', icon: tile('linear-gradient(180deg,#e3e3e8,#9d9da8)', '⚙️'), width: 720, height: 500, render: renderSettings, keywords: ['settings', 'shezhi', 'preferences'] },
    trash:      { name: '废纸篓', icon: tile('linear-gradient(180deg,#fbfbfd,#d9d9e0)', '🗑️'), width: 520, height: 380, render: renderTrash, keywords: ['trash'] },
    about:      { name: '关于本机', icon: tile('linear-gradient(180deg,#e3e3e8,#9d9da8)', '🖥️'), width: 420, height: 420, render: renderAbout, hidden: true },
    textview:   { name: '文本编辑', icon: tile('#fff', '📄'), width: 520, height: 400, render: renderTextview, hidden: true, single: false },
  };

  // 把应用塞进 访达 的"应用程序"目录
  FS['~/应用程序'] = Object.entries(registry)
    .filter(([id, a]) => !a.hidden && id !== 'trash')
    .map(([id, a]) => ap(a.name, id, a.icon));

  const dockOrder = ['finder', 'launchpad', 'safari', 'messages', 'notes', 'calendar', 'music', 'calculator', 'terminal', 'settings', '|', 'trash'];

  return { registry, dockOrder, FS, openEntry };
})();
