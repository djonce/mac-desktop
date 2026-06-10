/* ============ 系统:菜单栏 / Dock / 聚焦 / 控制中心 / 通知 ============ */

/* ---------- Dock ---------- */
const Dock = (() => {
  const dockEl = () => document.getElementById('dock');

  function build() {
    const dock = dockEl();
    dock.innerHTML = Apps.dockOrder.map(id => {
      if (id === '|') return `<div class="dock-sep"></div>`;
      const app = Apps.registry[id];
      return `<button class="dock-item" data-app="${id}" data-label="${app.name}">${app.icon}<i class="dot"></i></button>`;
    }).join('');

    dock.addEventListener('click', e => {
      const item = e.target.closest('.dock-item');
      if (!item) return;
      const app = Apps.registry[item.dataset.app];
      if (app.action) { app.action(); return; }
      WM.dockActivate(item.dataset.app);
      update();
    });

    // 放大效果
    dock.addEventListener('mousemove', e => {
      dock.querySelectorAll('.dock-item').forEach(item => {
        const r = item.getBoundingClientRect();
        const d = Math.abs(e.clientX - (r.left + r.width / 2));
        const s = 1 + 0.55 * Math.max(0, 1 - (d / 130) ** 2);
        item.style.setProperty('--s', s.toFixed(3));
      });
    });
    dock.addEventListener('mouseleave', () => {
      dock.querySelectorAll('.dock-item').forEach(item => item.style.setProperty('--s', 1));
    });
  }

  function update() {
    document.querySelectorAll('.dock-item').forEach(item => {
      item.classList.toggle('running', WM.isRunning(item.dataset.app));
    });
  }

  return { build, update };
})();

/* ---------- 系统 ---------- */
const System = (() => {

  /* ===== 偏好设置 ===== */
  const wallpapers = [
    { name: 'Sequoia', css: 'linear-gradient(160deg,#1b2b6b 0%,#3753b8 35%,#b06ab3 75%,#e96d8d 100%)' },
    { name: 'Sonoma', css: 'radial-gradient(120% 130% at 15% 0%,#f8b500 0%,rgba(248,181,0,0) 50%),radial-gradient(120% 120% at 100% 10%,#fd6e6a 0%,rgba(253,110,106,0) 55%),linear-gradient(180deg,#2b5876 0%,#4e4376 100%)' },
    { name: 'Ventura', css: 'linear-gradient(135deg,#ff9966 0%,#ff5e62 40%,#a8326e 80%,#5b2c6f 100%)' },
    { name: 'Monterey', css: 'radial-gradient(100% 140% at 80% 0%,#cf5af0 0%,rgba(207,90,240,0) 55%),linear-gradient(160deg,#0f2027 0%,#203a8f 55%,#2c5364 100%)' },
    { name: 'Big Sur', css: 'linear-gradient(180deg,#071f4d 0%,#1456a0 38%,#3f9bd8 62%,#f7b7a3 88%,#ee8f6e 100%)' },
    { name: '石墨', css: 'linear-gradient(160deg,#16161a 0%,#2c2c34 60%,#494951 100%)' },
    { name: '青柠', css: 'linear-gradient(140deg,#0ba360 0%,#3cba92 55%,#aee9d1 100%)' },
  ];

  const prefs = Object.assign(
    { theme: 'light', wallpaper: 0, accent: '#0a84ff', dockSize: 54 },
    JSON.parse(localStorage.getItem('mw-prefs') || '{}')
  );
  const savePrefs = () => localStorage.setItem('mw-prefs', JSON.stringify(prefs));

  function setTheme(t) {
    prefs.theme = t; savePrefs();
    document.body.classList.toggle('dark', t === 'dark');
    document.querySelector('#cc-dark')?.classList.toggle('on', t === 'dark');
  }
  function setWallpaper(i) {
    prefs.wallpaper = i; savePrefs();
    document.getElementById('wallpaper').style.background = wallpapers[i].css;
  }
  function setAccent(c) {
    prefs.accent = c; savePrefs();
    document.documentElement.style.setProperty('--accent', c);
  }
  function setDockSize(px) {
    prefs.dockSize = px; savePrefs();
    document.documentElement.style.setProperty('--dock-size', px + 'px');
  }
  function applyPrefs() {
    setTheme(prefs.theme); setWallpaper(prefs.wallpaper);
    setAccent(prefs.accent); setDockSize(prefs.dockSize);
  }

  /* ===== 时钟 ===== */
  function startClock() {
    const el = document.getElementById('mb-clock');
    const tick = () => {
      const d = new Date();
      const pad = n => String(n).padStart(2, '0');
      el.textContent = `${d.getMonth() + 1}月${d.getDate()}日 周${'日一二三四五六'[d.getDay()]} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
    };
    tick();
    setInterval(tick, 1000 * 15);
  }

  /* ===== 菜单栏 ===== */
  let menuOpen = false;        // 菜单栏处于激活状态(悬停可切换)
  let currentDD = null;        // 当前下拉菜单元素
  let currentItem = null;

  function closeMenus() {
    currentDD?.remove(); currentDD = null;
    currentItem?.classList.remove('open'); currentItem = null;
    menuOpen = false;
  }

  function showDropdown(itemEl, items, alignRight = false) {
    currentDD?.remove();
    currentItem?.classList.remove('open');
    currentItem = itemEl;
    itemEl.classList.add('open');

    const dd = document.createElement('div');
    dd.className = 'dropdown';
    items.forEach(it => {
      if (it === '-') {
        dd.insertAdjacentHTML('beforeend', '<div class="dd-sep"></div>');
        return;
      }
      const div = document.createElement('div');
      div.className = 'dd-item' + (it.disabled ? ' disabled' : '');
      div.innerHTML = `<span></span>${it.key ? `<span class="dd-key">${it.key}</span>` : ''}`;
      div.querySelector('span').textContent = it.label;
      if (it.action) div.addEventListener('click', () => { closeMenus(); it.action(); });
      else div.addEventListener('click', closeMenus);
      dd.appendChild(div);
    });
    document.body.appendChild(dd);
    const r = itemEl.getBoundingClientRect();
    dd.style.top = '30px';
    if (alignRight) dd.style.left = Math.min(r.left, innerWidth - dd.offsetWidth - 8) + 'px';
    else dd.style.left = Math.max(8, r.left) + 'px';
    currentDD = dd;
    menuOpen = true;
  }

  const appleMenu = () => [
    { label: '关于本机', action: () => WM.open('about') },
    '-',
    { label: '系统设置…', action: () => WM.open('settings') },
    { label: 'App Store…', action: () => notify('App Store', '网页版暂未上架,敬请期待 😉', Apps.registry.launchpad.icon) },
    '-',
    { label: '强制退出…', key: '⌥⌘⎋', action: () => { const w = WM.getFocused(); if (w) WM.close(w); } },
    '-',
    { label: '睡眠', action: sleep },
    { label: '重新启动…', action: () => location.reload() },
    { label: '关闭系统…', action: shutdown },
    '-',
    { label: '锁定屏幕', key: '⌃⌘Q', action: sleep },
  ];

  const appNameMenu = appId => {
    const app = Apps.registry[appId];
    return [
      { label: `关于"${app.name}"`, action: () => WM.open('about') },
      '-',
      { label: '设置…', key: '⌘,', action: () => WM.open('settings') },
      '-',
      { label: `隐藏"${app.name}"`, key: '⌘H', action: () => WM.windowsOf(appId).forEach(w => !w.minimized && WM.minimize(w)) },
      '-',
      { label: `退出"${app.name}"`, key: '⌘Q', action: () => WM.quitApp(appId) },
    ];
  };

  const standardMenus = appId => ({
    '文件': [
      { label: '新建窗口', key: '⌘N', action: () => { const a = Apps.registry[appId]; a.single === false ? WM.createWindow(appId) : WM.open(appId); } },
      { label: '关闭窗口', key: '⌘W', action: () => { const w = WM.getFocused(); if (w) WM.close(w); } },
      '-',
      { label: '打印…', key: '⌘P', disabled: true },
    ],
    '编辑': [
      { label: '撤销', key: '⌘Z', disabled: true },
      { label: '重做', key: '⇧⌘Z', disabled: true },
      '-',
      { label: '剪切', key: '⌘X', disabled: true },
      { label: '拷贝', key: '⌘C', disabled: true },
      { label: '粘贴', key: '⌘V', disabled: true },
      { label: '全选', key: '⌘A', disabled: true },
    ],
    '显示': [
      { label: '进入全屏幕', key: '⌃⌘F', action: () => { const w = WM.getFocused(); if (w) WM.toggleMaximize(w); } },
    ],
    '窗口': [
      { label: '最小化', key: '⌘M', action: () => { const w = WM.getFocused(); if (w) WM.minimize(w); } },
      { label: '缩放', action: () => { const w = WM.getFocused(); if (w) WM.toggleMaximize(w); } },
      '-',
      { label: '前置全部窗口', action: () => WM.windowsOf(appId).forEach(w => w.minimized && WM.restore(w)) },
    ],
    '帮助': [
      { label: '欢迎指南', action: () => WM.createWindow('textview', { title: '欢迎使用.txt', text: Apps.FS['~'].find(f => f.content)?.content || '', width: 520, height: 420 }) },
    ],
  });

  let activeAppId = 'finder';
  function setActiveApp(appId) {
    activeAppId = appId;
    const app = Apps.registry[appId];
    document.getElementById('mb-appname').textContent = app ? app.name.replace(/ .*/, '') : '访达';
    const menusEl = document.getElementById('mb-menus');
    menusEl.innerHTML = '';
    Object.keys(standardMenus(appId)).forEach(title => {
      const item = document.createElement('div');
      item.className = 'mb-item';
      item.textContent = title;
      bindMenuItem(item, () => standardMenus(activeAppId)[title]);
      menusEl.appendChild(item);
    });
  }

  function bindMenuItem(el, getItems, alignRight = false) {
    el.addEventListener('mousedown', e => {
      e.stopPropagation();
      if (currentItem === el) closeMenus();
      else showDropdown(el, getItems(), alignRight);
    });
    el.addEventListener('mouseenter', () => {
      if (menuOpen && currentItem !== el) showDropdown(el, getItems(), alignRight);
    });
  }

  function initMenubar() {
    bindMenuItem(document.getElementById('mb-apple'), appleMenu);
    bindMenuItem(document.getElementById('mb-appname'), () => appNameMenu(activeAppId));
    setActiveApp('finder');

    document.getElementById('mb-search').addEventListener('mousedown', e => { e.stopPropagation(); closeMenus(); toggleSpotlight(); });
    document.getElementById('mb-cc').addEventListener('mousedown', e => { e.stopPropagation(); closeMenus(); toggleCC(); });

    document.addEventListener('mousedown', e => {
      if (currentDD && !e.target.closest('.dropdown')) closeMenus();
      if (!e.target.closest('#control-center') && !e.target.closest('#mb-cc'))
        document.getElementById('control-center').classList.add('hidden');
    });
  }

  /* ===== 聚焦搜索 ===== */
  function toggleSpotlight(force) {
    const sp = document.getElementById('spotlight');
    const show = force ?? sp.classList.contains('hidden');
    sp.classList.toggle('hidden', !show);
    if (show) {
      const input = document.getElementById('spotlight-input');
      input.value = '';
      document.getElementById('spotlight-results').innerHTML = '';
      setTimeout(() => input.focus(), 30);
    }
  }

  function initSpotlight() {
    const sp = document.getElementById('spotlight');
    const input = document.getElementById('spotlight-input');
    const results = document.getElementById('spotlight-results');

    sp.addEventListener('mousedown', e => { if (e.target === sp) toggleSpotlight(false); });

    function search(q) {
      q = q.trim().toLowerCase();
      results.innerHTML = '';
      if (!q) return;
      // 算术彩蛋
      if (/^[\d+\-*/().\s%]+$/.test(q) && /\d/.test(q)) {
        try {
          const val = Function(`"use strict";return (${q.replace(/%/g, '/100')})`)();
          if (typeof val === 'number' && isFinite(val)) {
            results.innerHTML = `<div class="sp-item active"><span class="app-icon" style="background:#2e2e33;color:#ff9f0a">=</span><div><b>${+val.toFixed(8)}</b></div><small>计算器</small></div>`;
            return;
          }
        } catch (_) { /* 不是算式 */ }
      }
      const hits = Object.entries(Apps.registry).filter(([id, a]) =>
        !a.hidden && (a.name.toLowerCase().includes(q) || (a.keywords || []).some(k => k.includes(q))));
      results.innerHTML = hits.map(([id, a], i) =>
        `<div class="sp-item ${i === 0 ? 'active' : ''}" data-app="${id}">${a.icon}<div><b>${a.name}</b></div><small>应用程序</small></div>`).join('');
    }

    input.addEventListener('input', () => search(input.value));
    input.addEventListener('keydown', e => {
      if (e.key === 'Enter') {
        const first = results.querySelector('.sp-item[data-app]');
        if (first) { toggleSpotlight(false); WM.open(first.dataset.app); Dock.update(); }
      } else if (e.key === 'Escape') toggleSpotlight(false);
    });
    results.addEventListener('click', e => {
      const item = e.target.closest('.sp-item[data-app]');
      if (item) { toggleSpotlight(false); WM.open(item.dataset.app); Dock.update(); }
    });
  }

  /* ===== 启动台 ===== */
  function toggleLaunchpad(force) {
    const lp = document.getElementById('launchpad');
    const show = force ?? lp.classList.contains('hidden');
    lp.classList.toggle('hidden', !show);
    if (show) {
      drawLaunchpad('');
      const input = document.getElementById('lp-input');
      input.value = '';
      setTimeout(() => input.focus(), 30);
    }
  }
  function drawLaunchpad(q) {
    const grid = document.getElementById('lp-grid');
    q = q.trim().toLowerCase();
    grid.innerHTML = Object.entries(Apps.registry)
      .filter(([id, a]) => !a.hidden && !a.action &&
        (!q || a.name.toLowerCase().includes(q) || (a.keywords || []).some(k => k.includes(q))))
      .map(([id, a]) => `<button class="lp-app" data-app="${id}">${a.icon}<span class="lp-name">${a.name}</span></button>`)
      .join('');
  }
  function initLaunchpad() {
    const lp = document.getElementById('launchpad');
    lp.addEventListener('mousedown', e => {
      if (!e.target.closest('.lp-app') && !e.target.closest('.lp-search')) toggleLaunchpad(false);
    });
    lp.addEventListener('click', e => {
      const b = e.target.closest('.lp-app');
      if (b) { toggleLaunchpad(false); WM.open(b.dataset.app); Dock.update(); }
    });
    document.getElementById('lp-input').addEventListener('input', e => drawLaunchpad(e.target.value));
  }

  /* ===== 控制中心 ===== */
  function toggleCC() {
    document.getElementById('control-center').classList.toggle('hidden');
  }
  function initCC() {
    const cc = document.getElementById('control-center');
    cc.addEventListener('mousedown', e => e.stopPropagation());

    cc.querySelectorAll('.cc-row[data-toggle]').forEach(row => {
      row.addEventListener('click', () => {
        const ic = row.querySelector('.cc-ic');
        ic.classList.toggle('on');
        const small = row.querySelector('small');
        const name = row.querySelector('b').textContent;
        const on = ic.classList.contains('on');
        if (name === 'Wi-Fi') small.textContent = on ? 'ZeboHome-5G' : '未连接';
        else if (name === '蓝牙') small.textContent = on ? '打开' : '关闭';
        else small.textContent = on ? '仅限联系人' : '关闭';
      });
    });

    document.getElementById('cc-dark').addEventListener('click', () =>
      setTheme(document.body.classList.contains('dark') ? 'light' : 'dark'));
    document.getElementById('cc-focus').addEventListener('click', e =>
      e.currentTarget.classList.toggle('on'));
    document.getElementById('cc-bright').addEventListener('input', e => {
      document.getElementById('brightness-overlay').style.opacity = (100 - e.target.value) / 130;
    });
    document.getElementById('cc-music').addEventListener('click', () => {
      toggleCC(); WM.open('music'); Dock.update();
    });
  }

  /* ===== 通知 ===== */
  function notify(title, body, iconHTML) {
    const box = document.getElementById('notifications');
    const n = document.createElement('div');
    n.className = 'notif';
    n.innerHTML = `${iconHTML || '<span class="app-icon" style="background:linear-gradient(180deg,#e3e3e8,#9d9da8)">🔔</span>'}<div><b></b><small></small></div>`;
    n.querySelector('b').textContent = title;
    n.querySelector('small').textContent = body;
    box.appendChild(n);
    const dismiss = () => { n.classList.add('out'); setTimeout(() => n.remove(), 420); };
    n.addEventListener('click', dismiss);
    setTimeout(dismiss, 5200);
  }

  /* ===== 桌面图标与右键菜单 ===== */
  const deskIcons = [
    { name: 'Macintosh HD', glyph: '💽', open: () => WM.open('finder') },
    { name: '欢迎使用.txt', glyph: '📄', open: () => Apps.openEntry(Apps.FS['~'].find(f => f.name === '欢迎使用.txt')) },
  ];
  let folderSeq = 0;

  function drawDesktopIcons() {
    const box = document.getElementById('desktop-icons');
    box.innerHTML = deskIcons.map((d, i) => `
      <div class="desk-icon" data-i="${i}">
        <span class="di-glyph">${d.glyph}</span>
        <span class="di-name">${d.name}</span>
      </div>`).join('');
  }
  function initDesktop() {
    drawDesktopIcons();
    const box = document.getElementById('desktop-icons');
    box.addEventListener('click', e => {
      const ic = e.target.closest('.desk-icon');
      box.querySelectorAll('.desk-icon').forEach(x => x.classList.toggle('selected', x === ic));
    });
    box.addEventListener('dblclick', e => {
      const ic = e.target.closest('.desk-icon');
      if (!ic) return;
      const d = deskIcons[+ic.dataset.i];
      if (d.open) d.open(); else WM.open('finder');
      Dock.update();
    });
    document.getElementById('desktop').addEventListener('mousedown', e => {
      if (e.target.id === 'wallpaper') {
        box.querySelectorAll('.desk-icon').forEach(x => x.classList.remove('selected'));
        setActiveApp('finder');
      }
    });

    // 右键菜单
    const ctx = document.getElementById('context-menu');
    document.getElementById('desktop').addEventListener('contextmenu', e => {
      if (e.target.closest('.window')) return;   // 窗口内不拦截
      e.preventDefault();
      const items = [
        { label: '新建文件夹', action: () => { deskIcons.push({ name: `未命名文件夹${folderSeq ? ' ' + folderSeq : ''}`, glyph: '📁' }); folderSeq++; drawDesktopIcons(); } },
        '-',
        { label: '更改墙纸…', action: () => WM.createWindow('settings', { pane: 'wallpaper' }) },
        { label: document.body.classList.contains('dark') ? '使用浅色模式' : '使用深色模式', action: () => setTheme(document.body.classList.contains('dark') ? 'light' : 'dark') },
        '-',
        { label: '整理图标', action: () => notify('访达', '图标已经很整齐了 ✨', Apps.registry.finder.icon) },
      ];
      ctx.innerHTML = '';
      items.forEach(it => {
        if (it === '-') { ctx.insertAdjacentHTML('beforeend', '<div class="dd-sep"></div>'); return; }
        const div = document.createElement('div');
        div.className = 'dd-item';
        div.textContent = it.label;
        div.addEventListener('click', () => { ctx.classList.add('hidden'); it.action(); Dock.update(); });
        ctx.appendChild(div);
      });
      ctx.classList.remove('hidden');
      ctx.style.left = Math.min(e.clientX, innerWidth - 220) + 'px';
      ctx.style.top = Math.min(e.clientY, innerHeight - ctx.offsetHeight - 10) + 'px';
    });
    document.addEventListener('mousedown', e => {
      if (!e.target.closest('#context-menu')) ctx.classList.add('hidden');
    });
  }

  /* ===== 睡眠 / 关机 / 开机 ===== */
  function sleep() {
    const ov = document.getElementById('sleep-overlay');
    ov.classList.remove('hidden');
    const wake = () => {
      ov.classList.add('hidden');
      document.removeEventListener('keydown', wake);
      ov.removeEventListener('mousedown', wake);
    };
    setTimeout(() => {
      ov.addEventListener('mousedown', wake);
      document.addEventListener('keydown', wake);
    }, 400);
  }
  function shutdown() {
    const ov = document.getElementById('power-overlay');
    ov.classList.remove('hidden');
    setTimeout(() => ov.addEventListener('mousedown', () => location.reload(), { once: true }), 500);
  }
  function boot(done) {
    const boot = document.getElementById('boot');
    const bar = boot.querySelector('.boot-bar');
    let p = 0;
    const t = setInterval(() => {
      p += 8 + Math.random() * 18;
      bar.style.width = Math.min(100, p) + '%';
      if (p >= 100) {
        clearInterval(t);
        setTimeout(() => {
          boot.classList.add('fade');
          setTimeout(() => { boot.remove(); done && done(); }, 650);
        }, 350);
      }
    }, 180);
  }

  /* ===== 快捷键 ===== */
  function initKeys() {
    document.addEventListener('keydown', e => {
      const mod = e.metaKey || e.ctrlKey;
      if (mod && e.key.toLowerCase() === 'k') { e.preventDefault(); toggleSpotlight(); }
      else if (e.key === 'Escape') {
        toggleSpotlight(false); toggleLaunchpad(false);
        document.getElementById('control-center').classList.add('hidden');
        closeMenus();
      } else if (mod && e.key.toLowerCase() === 'm') {
        const w = WM.getFocused();
        if (w && !e.target.closest('input,textarea')) { e.preventDefault(); WM.minimize(w); }
      }
    });
  }

  function init() {
    applyPrefs();
    startClock();
    initMenubar();
    initSpotlight();
    initLaunchpad();
    initCC();
    initDesktop();
    initKeys();
    Dock.build();
    // 随机电量,纯装饰
    const pct = 60 + Math.floor(Math.random() * 40);
    document.getElementById('battery-pct').textContent = pct + '%';
    document.getElementById('battery-fill').setAttribute('width', String(18 * pct / 100));
  }

  return {
    init, boot, notify, sleep, shutdown,
    setActiveApp, setTheme, setWallpaper, setAccent, setDockSize,
    toggleLaunchpad, toggleSpotlight,
    wallpapers, prefs,
  };
})();
