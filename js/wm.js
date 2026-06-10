/* ============ 窗口管理器 ============ */
const WM = (() => {
  const MENUBAR_H = 28;
  const wins = new Map();   // id -> win
  let zTop = 10;
  let idSeq = 1;
  let cascade = 0;
  let focusedWin = null;

  const layer = () => document.getElementById('windows-layer');

  /* 打开应用(单例应用聚焦已有窗口) */
  function open(appId, opts = {}) {
    const app = Apps.registry[appId];
    if (!app) return null;
    if (app.action) { app.action(); return null; }
    if (app.single !== false) {
      const exist = [...wins.values()].find(w => w.appId === appId);
      if (exist) {
        if (exist.minimized) restore(exist);
        focus(exist);
        return exist;
      }
    }
    return createWindow(appId, opts);
  }

  function createWindow(appId, opts = {}) {
    const app = Apps.registry[appId];
    const id = idSeq++;
    const W = Math.min(opts.width || app.width || 640, innerWidth - 40);
    const H = Math.min(opts.height || app.height || 440, innerHeight - 100);
    cascade = (cascade + 1) % 8;
    const x = opts.x ?? Math.max(10, (innerWidth - W) / 2 + cascade * 26 - 80);
    const y = opts.y ?? Math.max(MENUBAR_H + 8, (innerHeight - H) / 2.4 + cascade * 22 - 60);

    const el = document.createElement('div');
    el.className = 'window';
    el.style.cssText = `left:${x}px;top:${y}px;width:${W}px;height:${H}px;z-index:${++zTop}`;
    el.innerHTML = `
      <div class="titlebar">
        <div class="traffic">
          <span class="tl close" title="关闭"></span>
          <span class="tl min" title="最小化"></span>
          <span class="tl max" title="缩放"></span>
        </div>
        <div class="title">${opts.title || app.name}</div>
      </div>
      <div class="win-content"></div>
      ${['n','s','e','w','ne','nw','se','sw'].map(d => `<div class="rs rs-${d}" data-dir="${d}"></div>`).join('')}
    `;
    layer().appendChild(el);

    const win = { id, appId, el, opts, minimized: false, maximized: false, prevRect: null };
    wins.set(id, win);

    // 红绿灯
    el.querySelector('.tl.close').addEventListener('click', e => { e.stopPropagation(); close(win); });
    el.querySelector('.tl.min').addEventListener('click', e => { e.stopPropagation(); minimize(win); });
    el.querySelector('.tl.max').addEventListener('click', e => { e.stopPropagation(); toggleMaximize(win); });

    // 点击聚焦
    el.addEventListener('pointerdown', () => focus(win));

    // 拖动标题栏
    const titlebar = el.querySelector('.titlebar');
    titlebar.addEventListener('pointerdown', e => {
      if (e.target.closest('.tl') || win.maximized) return;
      e.preventDefault();
      const sx = e.clientX, sy = e.clientY;
      const ox = el.offsetLeft, oy = el.offsetTop;
      const move = ev => {
        el.style.left = Math.min(innerWidth - 60, Math.max(60 - el.offsetWidth, ox + ev.clientX - sx)) + 'px';
        el.style.top = Math.min(innerHeight - 50, Math.max(MENUBAR_H, oy + ev.clientY - sy)) + 'px';
      };
      const up = () => {
        document.removeEventListener('pointermove', move);
        document.removeEventListener('pointerup', up);
      };
      document.addEventListener('pointermove', move);
      document.addEventListener('pointerup', up);
    });
    titlebar.addEventListener('dblclick', e => {
      if (!e.target.closest('.tl')) toggleMaximize(win);
    });

    // 边缘缩放
    el.querySelectorAll('.rs').forEach(h => {
      h.addEventListener('pointerdown', e => {
        if (win.maximized) return;
        e.preventDefault(); e.stopPropagation();
        focus(win);
        const dir = h.dataset.dir;
        const sx = e.clientX, sy = e.clientY;
        const r = { x: el.offsetLeft, y: el.offsetTop, w: el.offsetWidth, h: el.offsetHeight };
        const minW = 320, minH = 200;
        const move = ev => {
          const dx = ev.clientX - sx, dy = ev.clientY - sy;
          let { x, y, w, h: hh } = r;
          if (dir.includes('e')) w = Math.max(minW, r.w + dx);
          if (dir.includes('s')) hh = Math.max(minH, r.h + dy);
          if (dir.includes('w')) { w = Math.max(minW, r.w - dx); x = r.x + r.w - w; }
          if (dir.includes('n')) { hh = Math.max(minH, r.h - dy); y = Math.max(MENUBAR_H, r.y + r.h - hh); hh = r.y + r.h - y; }
          el.style.left = x + 'px'; el.style.top = y + 'px';
          el.style.width = w + 'px'; el.style.height = hh + 'px';
        };
        const up = () => {
          document.removeEventListener('pointermove', move);
          document.removeEventListener('pointerup', up);
        };
        document.addEventListener('pointermove', move);
        document.addEventListener('pointerup', up);
      });
    });

    // 渲染应用内容
    app.render(el.querySelector('.win-content'), win);

    focus(win);
    if (typeof Dock !== 'undefined') Dock.update();
    return win;
  }

  function focus(win) {
    if (focusedWin === win && !win.minimized) {
      // 仍然置顶,防止 z 错乱
      win.el.style.zIndex = ++zTop;
      return;
    }
    focusedWin = win;
    wins.forEach(w => w.el.classList.toggle('focused', w === win));
    win.el.style.zIndex = ++zTop;
    if (typeof System !== 'undefined') System.setActiveApp(win.appId);
  }

  function close(win) {
    if (win.onCleanup) win.onCleanup();
    const app = Apps.registry[win.appId];
    if (app && app.onClose) app.onClose(win);
    win.el.remove();
    wins.delete(win.id);
    if (focusedWin === win) {
      focusedWin = null;
      // 聚焦剩余最顶层窗口
      const rest = [...wins.values()].filter(w => !w.minimized);
      if (rest.length) {
        const top = rest.reduce((a, b) => (+a.el.style.zIndex > +b.el.style.zIndex ? a : b));
        focus(top);
      } else if (typeof System !== 'undefined') {
        System.setActiveApp('finder');
      }
    }
    if (typeof Dock !== 'undefined') Dock.update();
  }

  function minimize(win) {
    const el = win.el;
    // 飞向 Dock 上对应图标
    const dockIcon = document.querySelector(`.dock-item[data-app="${win.appId}"]`);
    const target = dockIcon ? dockIcon.getBoundingClientRect() : { left: innerWidth / 2, top: innerHeight, width: 0 };
    const r = el.getBoundingClientRect();
    const tx = target.left + target.width / 2 - (r.left + r.width / 2);
    const ty = target.top - (r.top + r.height / 2);
    el.classList.add('anim');
    el.style.transform = `translate(${tx}px,${ty}px) scale(.08)`;
    el.style.opacity = '0';
    setTimeout(() => {
      el.style.display = 'none';
      el.classList.remove('anim');
    }, 300);
    win.minimized = true;
    if (focusedWin === win) focusedWin = null;
  }

  function restore(win) {
    const el = win.el;
    el.style.display = '';
    requestAnimationFrame(() => {
      el.classList.add('anim');
      el.style.transform = '';
      el.style.opacity = '';
      setTimeout(() => el.classList.remove('anim'), 320);
    });
    win.minimized = false;
    focus(win);
  }

  function toggleMaximize(win) {
    const el = win.el;
    el.classList.add('anim');
    if (!win.maximized) {
      win.prevRect = { l: el.offsetLeft, t: el.offsetTop, w: el.offsetWidth, h: el.offsetHeight };
      el.style.left = '0px';
      el.style.top = MENUBAR_H + 'px';
      el.style.width = innerWidth + 'px';
      el.style.height = (innerHeight - MENUBAR_H) + 'px';
      win.maximized = true;
    } else {
      const p = win.prevRect;
      el.style.left = p.l + 'px'; el.style.top = p.t + 'px';
      el.style.width = p.w + 'px'; el.style.height = p.h + 'px';
      win.maximized = false;
    }
    setTimeout(() => el.classList.remove('anim'), 280);
  }

  /* 工具函数 */
  const isRunning = appId => [...wins.values()].some(w => w.appId === appId);
  const windowsOf = appId => [...wins.values()].filter(w => w.appId === appId);
  const getFocused = () => focusedWin;

  function quitApp(appId) {
    windowsOf(appId).forEach(close);
  }

  /* Dock 图标点击行为 */
  function dockActivate(appId) {
    const ws = windowsOf(appId);
    if (!ws.length) {
      // 启动新应用,带弹跳
      const icon = document.querySelector(`.dock-item[data-app="${appId}"]`);
      if (icon) {
        icon.classList.add('bounce');
        setTimeout(() => { icon.classList.remove('bounce'); open(appId); }, 480);
      } else {
        open(appId);
      }
    } else {
      const minimized = ws.filter(w => w.minimized);
      if (minimized.length) minimized.forEach(restore);
      else focus(ws[ws.length - 1]);
    }
  }

  return { open, createWindow, close, minimize, restore, toggleMaximize, focus, isRunning, windowsOf, getFocused, quitApp, dockActivate, wins };
})();
