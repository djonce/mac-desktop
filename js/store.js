/* ============ App Store:发布 / 安装网页应用 ============ */
const Store = (() => {

  const tileHTML = a => `<span class="app-icon" style="background:${a.bg}">${a.icon}</span>`;

  /* 商店目录由 apps/catalog.js 提供(window.StoreCatalog) */
  const builtin = window.StoreCatalog || [];

  /* ---------- 状态 ---------- */
  let published = JSON.parse(localStorage.getItem('mw-store-published') || '[]');
  let installed = JSON.parse(localStorage.getItem('mw-store-installed') || '[]');
  const save = () => {
    localStorage.setItem('mw-store-published', JSON.stringify(published));
    localStorage.setItem('mw-store-installed', JSON.stringify(installed));
  };

  const catalog = () => [...builtin, ...published];
  const findApp = id => catalog().find(a => a.id === id);
  const isInstalled = id => installed.includes(id);
  const regId = id => 'store-' + id;

  /* ---------- 安装 / 卸载 ---------- */
  function makeRunner(app) {
    return root => {
      const iframe = document.createElement('iframe');
      iframe.style.cssText = 'flex:1;border:none;width:100%;background:#fff';
      iframe.setAttribute('sandbox', 'allow-scripts allow-pointer-lock');
      if (app.type === 'url') {
        iframe.removeAttribute('sandbox');   // 外部站点按普通 iframe 处理
        iframe.src = app.source;
      } else if (app.type === 'page') {
        iframe.src = app.source;             // 商店自带应用:独立静态文件,按需加载,保持沙箱
      } else {
        iframe.srcdoc = app.source;          // 用户发布的 HTML 代码
      }
      root.appendChild(iframe);
    };
  }

  function register(app) {
    Apps.registry[regId(app.id)] = {
      name: app.name,
      icon: tileHTML(app),
      width: app.w || 560, height: app.h || 460,
      render: makeRunner(app),
      keywords: [app.name.toLowerCase(), 'store'],
      fromStore: app.id,
    };
    const dir = Apps.FS['~/应用程序'];
    if (!dir.some(e => e.appId === regId(app.id))) {
      dir.push({ name: app.name, kind: 'app', appId: regId(app.id), glyph: tileHTML(app) });
    }
  }

  function install(id) {
    const app = findApp(id);
    if (!app || isInstalled(id)) return;
    installed.push(id); save();
    register(app);
    if (typeof System !== 'undefined') {
      System.notify('App Store', `「${app.name}」已安装,可在启动台中找到`, tileHTML(app));
    }
  }

  function uninstall(id) {
    const app = findApp(id);
    installed = installed.filter(x => x !== id); save();
    WM.quitApp(regId(id));
    delete Apps.registry[regId(id)];
    Apps.FS['~/应用程序'] = Apps.FS['~/应用程序'].filter(e => e.appId !== regId(id));
    if (typeof System !== 'undefined' && app) {
      System.notify('App Store', `「${app.name}」已卸载`, tileHTML(app));
    }
  }

  /* ---------- 发布 / 下架 ---------- */
  function publish(app) {
    app.id = 'pub-' + Date.now();
    app.mine = true;
    app.author = 'zebo(我)';
    app.ver = app.ver || '1.0';
    app.size = app.type === 'url' ? '在线' : Math.max(0.1, app.source.length / 1024 / 1024).toFixed(1) + ' MB';
    app.rating = '—'; app.dl = '0';
    published.push(app); save();
    return app;
  }

  function unpublish(id) {
    if (isInstalled(id)) uninstall(id);
    published = published.filter(a => a.id !== id); save();
  }

  /* ---------- 商店界面 ---------- */
  const CATS = ['游戏', '阅读', '工具', '效率'];
  const CAT_IC = { '游戏': '🎮', '阅读': '📖', '工具': '🔧', '效率': '⏱' };

  function renderStore(root, win) {
    let view = { type: 'home' };
    let query = '';

    root.innerHTML = `
      <div class="app-split">
        <div class="app-sidebar">
          <div class="sb-title">商店</div>
          <div class="sb-item" data-v="home"><span class="sb-ic">✨</span>发现</div>
          ${CATS.map(c => `<div class="sb-item" data-v="cat" data-cat="${c}"><span class="sb-ic">${CAT_IC[c]}</span>${c}</div>`).join('')}
          <div class="sb-title">我的</div>
          <div class="sb-item" data-v="installed"><span class="sb-ic">📦</span>已安装</div>
          <div class="sb-item" data-v="publish"><span class="sb-ic">🚀</span>发布应用</div>
        </div>
        <div class="app-main"><div class="store-main"></div></div>
      </div>`;

    const main = root.querySelector('.store-main');

    root.querySelectorAll('.sb-item').forEach(s => s.addEventListener('click', () => {
      view = s.dataset.v === 'cat' ? { type: 'cat', cat: s.dataset.cat } : { type: s.dataset.v };
      query = '';
      draw();
    }));

    const getBtn = app => {
      if (isInstalled(app.id)) return `<button class="st-get open" data-open="${app.id}">打开</button>`;
      return `<button class="st-get" data-get="${app.id}">获取</button>`;
    };

    const card = app => `
      <div class="st-card" data-app="${app.id}">
        ${tileHTML(app)}
        <div class="st-card-info">
          <b>${app.name}${app.mine ? ' <span class="st-mine">我的</span>' : ''}</b>
          <small>${app.desc}</small>
          <span class="st-cat">${app.cat} · ★ ${app.rating}</span>
        </div>
        ${getBtn(app)}
      </div>`;

    const views = {
      home() {
        const list = catalog().filter(a => !query || a.name.toLowerCase().includes(query) || a.desc.includes(query));
        const feat = catalog().find(a => a.feat) || catalog()[0];
        if (!feat) return '<p class="st-empty">商店目录为空(apps/catalog.js 未加载)</p>';
        return `
          <input class="st-search" placeholder="搜索应用…" value="${query}">
          ${query ? '' : `
          <div class="st-banner" data-app="${feat.id}">
            <div><small>本周推荐</small><h2>${feat.name}</h2><p>${feat.desc}</p></div>
            <span class="st-banner-icon">${feat.icon}</span>
          </div>`}
          <h3 class="st-sec">${query ? '搜索结果' : '热门应用'}</h3>
          <div class="st-cards">${list.map(card).join('') || '<p class="st-empty">没有找到相关应用</p>'}</div>`;
      },
      cat() {
        const list = catalog().filter(a => a.cat === view.cat);
        return `<h3 class="st-sec">${CAT_IC[view.cat]} ${view.cat}</h3>
          <div class="st-cards">${list.map(card).join('') || '<p class="st-empty">这个分类还没有应用</p>'}</div>`;
      },
      installed() {
        const list = catalog().filter(a => isInstalled(a.id));
        return `<h3 class="st-sec">已安装(${list.length})</h3>
          ${list.length ? `<div class="st-rows">${list.map(a => `
            <div class="st-row" data-app="${a.id}">
              ${tileHTML(a)}
              <div class="st-card-info"><b>${a.name}</b><small>${a.cat} · 版本 ${a.ver}</small></div>
              <button class="st-get open" data-open="${a.id}">打开</button>
              <button class="st-link" data-del="${a.id}">卸载</button>
            </div>`).join('')}</div>`
          : '<p class="st-empty">还没有安装任何应用,去"发现"逛逛吧</p>'}`;
      },
      publish() {
        return `
          <h3 class="st-sec">🚀 发布你的网页应用</h3>
          <p class="st-hint">填写信息后即可上架到本商店(保存在浏览器本地)。HTML 应用运行在沙箱 iframe 中,与系统隔离。</p>
          <div class="pub-form">
            <div class="pub-grid">
              <label>应用名称<input id="pub-name" maxlength="12" placeholder="我的小应用"></label>
              <label>图标(emoji)<input id="pub-icon" maxlength="4" value="🧩"></label>
              <label>图标背景色<input type="color" id="pub-bg" value="#7f8ff0"></label>
              <label>分类<select id="pub-cat">${CATS.map(c => `<option>${c}</option>`).join('')}</select></label>
            </div>
            <label>一句话简介<input id="pub-desc" maxlength="30" placeholder="这个应用是做什么的?"></label>
            <label>类型
              <span class="pub-radio">
                <label><input type="radio" name="pub-type" value="html" checked> HTML 代码</label>
                <label><input type="radio" name="pub-type" value="url"> 网页链接</label>
              </span>
            </label>
            <label id="pub-src-wrap">应用代码<textarea id="pub-src" rows="9" spellcheck="false"><!doctype html>
<html>
<body style="font-family:sans-serif;display:flex;height:100vh;margin:0;align-items:center;justify-content:center;background:#1c1c24;color:#fff">
  <h1>Hello, macOS Web! 👋</h1>
  <script>
    // 你的代码
  <\/script>
</body>
</html></textarea></label>
            <label id="pub-url-wrap" class="hidden">网页地址<input id="pub-url" placeholder="https://example.com"></label>
            <button class="btn primary" id="pub-submit">发布到商店</button>
            ${published.length ? `<h3 class="st-sec" style="margin-top:18px">我发布的(${published.length})</h3>
              <div class="st-rows">${published.map(a => `
                <div class="st-row" data-app="${a.id}">
                  ${tileHTML(a)}
                  <div class="st-card-info"><b>${a.name}</b><small>${a.cat} · ${a.type === 'url' ? '链接应用' : 'HTML 应用'}</small></div>
                  <button class="st-link" data-unpub="${a.id}">下架</button>
                </div>`).join('')}</div>` : ''}
          </div>`;
      },
      detail() {
        const a = findApp(view.id);
        if (!a) { view = { type: 'home' }; return views.home(); }
        return `
          <button class="st-link" data-v="back">‹ 返回</button>
          <div class="st-detail-head">
            <span class="st-detail-icon">${tileHTML(a)}</span>
            <div class="st-detail-meta">
              <h2>${a.name}${a.mine ? ' <span class="st-mine">我的</span>' : ''}</h2>
              <p>${a.desc}</p>
              <small>${a.author}</small>
            </div>
            <div class="st-detail-act">
              ${getBtn(a)}
              ${isInstalled(a.id) ? `<button class="st-link" data-del="${a.id}">卸载</button>` : ''}
            </div>
          </div>
          <div class="st-badges">
            <div><b>★ ${a.rating}</b><small>评分</small></div>
            <div><b>${a.dl}</b><small>下载</small></div>
            <div><b>${a.size}</b><small>大小</small></div>
            <div><b>${a.ver}</b><small>版本</small></div>
            <div><b>${a.cat}</b><small>分类</small></div>
          </div>
          <h3 class="st-sec">简介</h3>
          <p class="st-long">${a.long || a.desc}</p>
          ${a.mine ? `<button class="st-link" data-unpub="${a.id}" style="color:#ff453a">从商店下架</button>` : ''}`;
      },
    };

    function draw() {
      root.querySelectorAll('.sb-item').forEach(s => s.classList.toggle('active',
        s.dataset.v === view.type && (view.type !== 'cat' || s.dataset.cat === view.cat)));
      main.innerHTML = views[view.type]();
      bind();
    }

    function bind() {
      // 搜索
      const search = main.querySelector('.st-search');
      if (search) {
        search.addEventListener('input', () => {
          query = search.value.trim().toLowerCase();
          const pos = search.selectionStart;
          draw();
          const s2 = main.querySelector('.st-search');
          s2.focus(); s2.setSelectionRange(pos, pos);
        });
      }
      // 获取(带下载动画)
      main.querySelectorAll('[data-get]').forEach(b => b.addEventListener('click', e => {
        e.stopPropagation();
        b.classList.add('loading');
        setTimeout(() => { install(b.dataset.get); draw(); }, 1300);
      }));
      main.querySelectorAll('[data-open]').forEach(b => b.addEventListener('click', e => {
        e.stopPropagation();
        WM.open(regId(b.dataset.open));
      }));
      main.querySelectorAll('[data-del]').forEach(b => b.addEventListener('click', e => {
        e.stopPropagation();
        uninstall(b.dataset.del); draw();
      }));
      main.querySelectorAll('[data-unpub]').forEach(b => b.addEventListener('click', e => {
        e.stopPropagation();
        const a = findApp(b.dataset.unpub);
        unpublish(b.dataset.unpub);
        System.notify('App Store', `「${a.name}」已从商店下架`, ICON);
        draw();
      }));
      // 进入详情
      main.querySelectorAll('.st-card,[data-app].st-banner,.st-row[data-app]').forEach(c =>
        c.addEventListener('click', () => { view = { type: 'detail', id: c.dataset.app }; draw(); }));
      main.querySelector('[data-v=back]')?.addEventListener('click', e => {
        e.stopPropagation(); view = { type: 'home' }; draw();
      });
      // 发布表单
      const submit = main.querySelector('#pub-submit');
      if (submit) {
        main.querySelectorAll('[name=pub-type]').forEach(r => r.addEventListener('change', () => {
          const isUrl = main.querySelector('[name=pub-type]:checked').value === 'url';
          main.querySelector('#pub-src-wrap').classList.toggle('hidden', isUrl);
          main.querySelector('#pub-url-wrap').classList.toggle('hidden', !isUrl);
        }));
        submit.addEventListener('click', () => {
          const name = main.querySelector('#pub-name').value.trim();
          const type = main.querySelector('[name=pub-type]:checked').value;
          const source = type === 'url' ? main.querySelector('#pub-url').value.trim() : main.querySelector('#pub-src').value;
          if (!name) return System.notify('App Store', '请填写应用名称', ICON);
          if (!source || (type === 'url' && !/^https?:\/\//.test(source)))
            return System.notify('App Store', type === 'url' ? '请填写有效的网址(https://…)' : '请填写应用代码', ICON);
          const app = publish({
            name,
            icon: main.querySelector('#pub-icon').value.trim() || '🧩',
            bg: `linear-gradient(180deg,${main.querySelector('#pub-bg').value},#33334a)`,
            cat: main.querySelector('#pub-cat').value,
            desc: main.querySelector('#pub-desc').value.trim() || '一个网页应用',
            long: '', type, source,
          });
          System.notify('App Store', `「${app.name}」已发布到商店 🎉`, tileHTML(app));
          view = { type: 'detail', id: app.id };
          draw();
        });
      }
    }

    draw();
  }

  /* ---------- 商店图标与注册 ---------- */
  const ICON = `<span class="app-icon">
    <svg viewBox="0 0 64 64">
      <defs><linearGradient id="ig-as" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#41b0fb"/><stop offset="1" stop-color="#0a5fd7"/></linearGradient></defs>
      <rect width="64" height="64" fill="url(#ig-as)"/>
      <circle cx="32" cy="32" r="17.5" fill="none" stroke="#fff" stroke-width="3.4"/>
      <path d="M25.5 39.5 L32 25 L38.5 39.5 M27.8 35.2 h8.4" stroke="#fff" stroke-width="3.4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    </svg></span>`;

  function init() {
    Apps.registry.appstore = {
      name: 'App Store',
      icon: ICON,
      width: 880, height: 580,
      render: renderStore,
      keywords: ['app store', 'store', 'shangcheng', '商城', '商店'],
    };
    // Dock:放在系统设置前面
    const i = Apps.dockOrder.indexOf('settings');
    Apps.dockOrder.splice(i < 0 ? Apps.dockOrder.length : i, 0, 'appstore');
    // 访达"应用程序"目录
    Apps.FS['~/应用程序'].push({ name: 'App Store', kind: 'app', appId: 'appstore', glyph: ICON });
    // 恢复已安装的应用
    installed = installed.filter(id => {
      const app = findApp(id);
      if (app) register(app);
      return !!app;
    });
  }
  init();

  return { install, uninstall, publish, unpublish, isInstalled, catalog, installed: () => [...installed], published: () => [...published] };
})();
