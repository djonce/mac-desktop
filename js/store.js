/* ============ App Store:发布 / 安装网页应用 ============ */
const Store = (() => {

  const tileHTML = a => `<span class="app-icon" style="background:${a.bg}">${a.icon}</span>`;

  /* ---------- 内置商店应用(srcdoc 沙箱运行) ---------- */

  const SNAKE_SRC = `<!doctype html><html><head><meta charset="utf-8"><style>
html,body{height:100%;margin:0;display:flex;flex-direction:column;align-items:center;justify-content:center;background:#15151d;color:#eee;font-family:-apple-system,'PingFang SC',sans-serif;user-select:none}
#score{margin-bottom:10px;font-size:15px}
canvas{background:#0d0d14;border-radius:10px}
#ov{position:fixed;inset:0;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,.6);font-size:17px;cursor:pointer;text-align:center}
</style></head><body>
<div id="score">分数 0</div><canvas id="c" width="320" height="320"></canvas><div id="ov">点击开始<br>(方向键 / WASD 控制)</div>
<script>
var cv=document.getElementById('c'),ctx=cv.getContext('2d'),ov=document.getElementById('ov'),sc=document.getElementById('score');
var N=16,S=20,snake,dir,nd,food,score,timer;
function reset(){snake=[{x:8,y:8},{x:7,y:8},{x:6,y:8}];dir={x:1,y:0};nd=dir;score=0;place()}
function place(){do{food={x:Math.floor(Math.random()*N),y:Math.floor(Math.random()*N)}}while(snake.some(function(s){return s.x===food.x&&s.y===food.y}))}
function rr(x,y){ctx.beginPath();ctx.roundRect(x*S+1,y*S+1,S-2,S-2,5);ctx.fill()}
function draw(){ctx.clearRect(0,0,320,320);ctx.fillStyle='#ff453a';rr(food.x,food.y);snake.forEach(function(s,i){ctx.fillStyle=i?'#30d158':'#8effa9';rr(s.x,s.y)})}
function step(){dir=nd;var h={x:(snake[0].x+dir.x+N)%N,y:(snake[0].y+dir.y+N)%N};
if(snake.some(function(s){return s.x===h.x&&s.y===h.y})){over();return}
snake.unshift(h);
if(h.x===food.x&&h.y===food.y){score+=10;place()}else snake.pop();
draw();sc.textContent='分数 '+score}
function over(){clearInterval(timer);ov.innerHTML='游戏结束,分数 '+score+'<br>点击重玩';ov.style.display='flex'}
function start(){reset();ov.style.display='none';clearInterval(timer);timer=setInterval(step,120);draw()}
ov.addEventListener('click',start);
addEventListener('keydown',function(e){
if(ov.style.display!=='none'){start();return}
var k=e.key.toLowerCase();
if((k==='arrowup'||k==='w')&&dir.y!==1)nd={x:0,y:-1};
if((k==='arrowdown'||k==='s')&&dir.y!==-1)nd={x:0,y:1};
if((k==='arrowleft'||k==='a')&&dir.x!==1)nd={x:-1,y:0};
if((k==='arrowright'||k==='d')&&dir.x!==-1)nd={x:1,y:0};
e.preventDefault()});
reset();draw();
<\/script></body></html>`;

  const G2048_SRC = `<!doctype html><html><head><meta charset="utf-8"><style>
html,body{height:100%;margin:0;display:flex;flex-direction:column;align-items:center;justify-content:center;background:#faf8ef;font-family:-apple-system,'PingFang SC',sans-serif;user-select:none}
#top{display:flex;align-items:center;gap:14px;margin-bottom:14px;color:#776e65}
#top h1{margin:0;font-size:30px}
#score{background:#bbada0;color:#fff;border-radius:6px;padding:5px 14px;font-weight:700}
#re{border:none;background:#8f7a66;color:#fff;border-radius:6px;padding:6px 13px;cursor:pointer;font-size:13px}
#board{position:relative;display:grid;grid-template-columns:repeat(4,72px);grid-template-rows:repeat(4,72px);gap:9px;background:#bbada0;padding:9px;border-radius:9px}
.t{display:flex;align-items:center;justify-content:center;border-radius:5px;font-weight:800;font-size:26px;background:rgba(238,228,218,.35);color:#776e65}
#ov{position:absolute;inset:0;display:none;align-items:center;justify-content:center;background:rgba(238,228,218,.8);font-size:24px;font-weight:800;color:#776e65;border-radius:9px;cursor:pointer}
</style></head><body>
<div id="top"><h1>2048</h1><span id="score">0</span><button id="re">重开</button></div>
<div id="board"></div>
<script>
var board=document.getElementById('board'),scoreEl=document.getElementById('score');
var C={2:'#eee4da',4:'#ede0c8',8:'#f2b179',16:'#f59563',32:'#f67c5f',64:'#f65e3b',128:'#edcf72',256:'#edcc61',512:'#edc850',1024:'#edc53f',2048:'#edc22e'};
var g,score,ov;
function init(){g=[[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]];score=0;add();add();render()}
function cells(){var r=[],i,j;for(i=0;i<4;i++)for(j=0;j<4;j++)if(!g[i][j])r.push([i,j]);return r}
function add(){var e=cells();if(!e.length)return;var p=e[Math.floor(Math.random()*e.length)];g[p[0]][p[1]]=Math.random()<0.9?2:4}
function slide(row){var a=row.filter(function(x){return x});for(var i=0;i<a.length-1;i++){if(a[i]===a[i+1]){a[i]*=2;score+=a[i];a.splice(i+1,1)}}while(a.length<4)a.push(0);return a}
function t(){var n=[[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]],i,j;for(i=0;i<4;i++)for(j=0;j<4;j++)n[j][i]=g[i][j];g=n}
function move(d){var old=JSON.stringify(g);
if(d===2||d===3)t();
g=g.map(function(r){return d===1||d===3?slide(r.slice().reverse()).reverse():slide(r)});
if(d===2||d===3)t();
if(JSON.stringify(g)!==old){add();render();if(dead())end()}}
function dead(){if(cells().length)return false;for(var i=0;i<4;i++)for(var j=0;j<4;j++){if(j<3&&g[i][j]===g[i][j+1])return false;if(i<3&&g[i][j]===g[i+1][j])return false}return true}
function render(){var h='';for(var i=0;i<4;i++)for(var j=0;j<4;j++){var v=g[i][j];
h+='<div class="t" style="'+(v?'background:'+C[v]+';color:'+(v>4?'#f9f6f2':'#776e65')+(v>=128?';font-size:22px':''):'')+'">'+(v||'')+'</div>'}
h+='<div id="ov">游戏结束,点击重开</div>';
board.innerHTML=h;scoreEl.textContent=score;
ov=document.getElementById('ov');ov.addEventListener('click',init)}
function end(){ov.style.display='flex'}
document.getElementById('re').addEventListener('click',init);
addEventListener('keydown',function(e){var m={ArrowLeft:0,ArrowRight:1,ArrowUp:2,ArrowDown:3,a:0,d:1,w:2,s:3}[e.key];
if(m!==undefined){move(m);e.preventDefault()}});
init();
<\/script></body></html>`;

  const PAINT_SRC = `<!doctype html><html><head><meta charset="utf-8"><style>
html,body{height:100%;margin:0;display:flex;flex-direction:column;font-family:-apple-system,'PingFang SC',sans-serif;background:#ececf0}
#bar{display:flex;align-items:center;gap:10px;padding:8px 12px;background:#fff;border-bottom:1px solid #ddd;flex-shrink:0}
#bar input[type=color]{width:34px;height:26px;border:none;background:none;cursor:pointer}
#bar button{border:1px solid #ccc;background:#fff;border-radius:6px;padding:4px 12px;cursor:pointer;font-size:13px}
#bar button.on{background:#0a84ff;color:#fff;border-color:#0a84ff}
canvas{flex:1;cursor:crosshair;touch-action:none}
</style></head><body>
<div id="bar"><input type="color" id="col" value="#ff3b30"><input type="range" id="sz" min="2" max="36" value="5"><button id="er">橡皮</button><button id="cl">清空</button><span id="tip" style="font-size:12px;color:#999">按住拖动来画画</span></div>
<canvas id="c"></canvas>
<script>
var c=document.getElementById('c'),x=c.getContext('2d'),er=document.getElementById('er');
var eraser=false,down=false,px,py;
function size(){var t=document.createElement('canvas');t.width=c.width;t.height=c.height;t.getContext('2d').drawImage(c,0,0);
c.width=c.clientWidth;c.height=c.clientHeight;x.fillStyle='#fff';x.fillRect(0,0,c.width,c.height);x.drawImage(t,0,0)}
addEventListener('resize',size);
requestAnimationFrame(function(){size()});
c.addEventListener('pointerdown',function(e){down=true;px=e.offsetX;py=e.offsetY;dot(e)});
c.addEventListener('pointermove',function(e){if(down)dot(e)});
addEventListener('pointerup',function(){down=false});
function dot(e){x.strokeStyle=eraser?'#fff':document.getElementById('col').value;
x.lineWidth=document.getElementById('sz').value*(eraser?2:1);x.lineCap='round';x.lineJoin='round';
x.beginPath();x.moveTo(px,py);x.lineTo(e.offsetX,e.offsetY);x.stroke();px=e.offsetX;py=e.offsetY}
er.addEventListener('click',function(){eraser=!eraser;er.classList.toggle('on',eraser)});
document.getElementById('cl').addEventListener('click',function(){x.fillStyle='#fff';x.fillRect(0,0,c.width,c.height)});
<\/script></body></html>`;

  const POMO_SRC = `<!doctype html><html><head><meta charset="utf-8"><style>
html,body{height:100%;margin:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:18px;background:#1c1c24;color:#fff;font-family:-apple-system,'PingFang SC',sans-serif;user-select:none}
#mode button{border:1px solid #444;background:none;color:#aaa;border-radius:14px;padding:5px 14px;cursor:pointer;font-size:13px;margin:0 4px}
#mode button.on{background:#ff6b5e;border-color:#ff6b5e;color:#fff}
#wrap{position:relative;width:210px;height:210px}
svg{transform:rotate(-90deg)}
#time{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-size:44px;font-weight:200;font-variant-numeric:tabular-nums}
#ctrl button{border:none;border-radius:8px;padding:9px 26px;cursor:pointer;font-size:15px;margin:0 5px}
#st{background:#ff6b5e;color:#fff}#rs{background:#3a3a44;color:#ddd}
</style></head><body>
<div id="mode"><button data-m="25" class="on">专注 25</button><button data-m="5">休息 5</button></div>
<div id="wrap"><svg width="210" height="210"><circle cx="105" cy="105" r="94" fill="none" stroke="#33333d" stroke-width="9"/><circle id="prog" cx="105" cy="105" r="94" fill="none" stroke="#ff6b5e" stroke-width="9" stroke-linecap="round" stroke-dasharray="590.6" stroke-dashoffset="0"/></svg><div id="time">25:00</div></div>
<div id="ctrl"><button id="st">开始</button><button id="rs">重置</button></div>
<script>
var total=1500,left=1500,timer=null;
var timeEl=document.getElementById('time'),prog=document.getElementById('prog'),st=document.getElementById('st');
function show(){var m=Math.floor(left/60),s=left%60;
timeEl.textContent=(m<10?'0':'')+m+':'+(s<10?'0':'')+s;
prog.setAttribute('stroke-dashoffset',590.6*(1-left/total))}
function beep(){try{var a=new (window.AudioContext||window.webkitAudioContext)();
[0,0.25,0.5].forEach(function(d){var o=a.createOscillator(),g=a.createGain();o.connect(g);g.connect(a.destination);
o.frequency.value=880;g.gain.setValueAtTime(0.25,a.currentTime+d);g.gain.exponentialRampToValueAtTime(0.001,a.currentTime+d+0.2);
o.start(a.currentTime+d);o.stop(a.currentTime+d+0.22)})}catch(e){}}
function tick(){left--;show();if(left<=0){stop();beep();timeEl.textContent='完成!'}}
function stop(){clearInterval(timer);timer=null;st.textContent='开始'}
st.addEventListener('click',function(){
if(timer){stop()}else{if(left<=0)left=total;timer=setInterval(tick,1000);st.textContent='暂停'}});
document.getElementById('rs').addEventListener('click',function(){stop();left=total;show()});
document.querySelectorAll('#mode button').forEach(function(b){b.addEventListener('click',function(){
document.querySelectorAll('#mode button').forEach(function(x){x.classList.remove('on')});
b.classList.add('on');stop();total=left=b.dataset.m*60;show()})});
show();
<\/script></body></html>`;

  const WATCH_SRC = `<!doctype html><html><head><meta charset="utf-8"><style>
html,body{height:100%;margin:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:16px;background:#101016;color:#fff;font-family:-apple-system,'PingFang SC',sans-serif;user-select:none}
#t{font-size:54px;font-weight:200;font-variant-numeric:tabular-nums}
#ctrl button{border:none;border-radius:50%;width:72px;height:72px;cursor:pointer;font-size:14px;margin:0 9px}
#go{background:#0c3;color:#cfc}#go.stop{background:#c33;color:#fcc}#lap{background:#333;color:#ddd}
ol{max-height:130px;overflow:auto;font-size:13px;color:#aaa;min-width:170px;padding-left:34px;font-variant-numeric:tabular-nums}
</style></head><body>
<div id="t">00:00.00</div>
<div id="ctrl"><button id="lap">计次</button><button id="go">启动</button></div>
<ol id="laps"></ol>
<script>
var t0=0,acc=0,raf=null;
var tEl=document.getElementById('t'),go=document.getElementById('go');
function fmt(ms){var m=Math.floor(ms/60000),s=Math.floor(ms%60000/1000),c=Math.floor(ms%1000/10);
return (m<10?'0':'')+m+':'+(s<10?'0':'')+s+'.'+(c<10?'0':'')+c}
function loop(){tEl.textContent=fmt(acc+performance.now()-t0);raf=requestAnimationFrame(loop)}
go.addEventListener('click',function(){
if(raf){acc+=performance.now()-t0;cancelAnimationFrame(raf);raf=null;go.textContent='启动';go.classList.remove('stop')}
else{t0=performance.now();loop();go.textContent='停止';go.classList.add('stop')}});
document.getElementById('lap').addEventListener('click',function(){
if(raf){var li=document.createElement('li');li.textContent=fmt(acc+performance.now()-t0);document.getElementById('laps').prepend(li)}
else{acc=0;tEl.textContent='00:00.00';document.getElementById('laps').innerHTML=''}});
<\/script></body></html>`;

  const MEMORY_SRC = `<!doctype html><html><head><meta charset="utf-8"><style>
html,body{height:100%;margin:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:14px;background:#12141c;color:#eee;font-family:-apple-system,'PingFang SC',sans-serif;user-select:none}
#grid{display:grid;grid-template-columns:repeat(4,72px);gap:9px}
.card{height:72px;border:none;border-radius:10px;background:#2c3145;font-size:32px;cursor:pointer;color:transparent;transition:transform .15s,background .2s}
.card.open{background:#46518a;color:#fff;transform:scale(1.05)}
.card.done{background:#1f7a4d;color:#fff;cursor:default}
#ov{position:fixed;inset:0;display:none;align-items:center;justify-content:center;background:rgba(0,0,0,.65);font-size:22px;cursor:pointer;text-align:center}
</style></head><body>
<div id="info">步数 0</div><div id="grid"></div><div id="ov"></div>
<script>
var E=['🍎','🚀','🐱','🌙','🎲','🍩','⚽','🎧'];
var grid=document.getElementById('grid'),info=document.getElementById('info'),ov=document.getElementById('ov');
var deck,first,lock,moves,done;
function init(){deck=E.concat(E).sort(function(){return Math.random()-0.5});
first=null;lock=false;moves=0;done=0;info.textContent='步数 0';ov.style.display='none';
grid.innerHTML=deck.map(function(e,i){return '<button class="card" data-i="'+i+'">'+e+'</button>'}).join('')}
grid.addEventListener('click',function(ev){
var b=ev.target.closest('.card');
if(!b||lock||b.classList.contains('open')||b.classList.contains('done'))return;
b.classList.add('open');
if(!first){first=b;return}
moves++;info.textContent='步数 '+moves;
var a=first;first=null;
if(deck[a.dataset.i]===deck[b.dataset.i]){a.classList.add('done');b.classList.add('done');a.classList.remove('open');b.classList.remove('open');done++;
if(done===8){ov.innerHTML='🎉 完成!共 '+moves+' 步<br>点击再来一局';ov.style.display='flex'}}
else{lock=true;setTimeout(function(){a.classList.remove('open');b.classList.remove('open');lock=false},700)}});
ov.addEventListener('click',init);
init();
<\/script></body></html>`;

  const builtin = [
    { id: 'snake', name: '贪吃蛇', icon: '🐍', bg: 'linear-gradient(180deg,#3dd86e,#0f9d44)', cat: '游戏',
      desc: '经典街机,方向键走起', long: '最经典的贪吃蛇:方向键或 WASD 控制,吃到红色食物加 10 分,撞到自己游戏结束。穿墙是特性,不是 bug。',
      author: 'Pixel 工作室', ver: '2.1.0', size: '1.2 MB', rating: '4.8', dl: '12.4万', type: 'html', source: SNAKE_SRC, w: 420, h: 470 },
    { id: 'g2048', name: '2048', icon: '🔢', bg: 'linear-gradient(180deg,#f7d774,#eda93b)', cat: '游戏',
      desc: '滑动合并,冲向 2048', long: '风靡全球的数字合并游戏。方向键滑动方块,相同数字合并翻倍,试着拼出 2048!支持 WASD。',
      author: 'Pixel 工作室', ver: '1.6.2', size: '0.9 MB', rating: '4.9', dl: '45.1万', type: 'html', source: G2048_SRC, w: 420, h: 520 },
    { id: 'memory', name: '记忆翻牌', icon: '🃏', bg: 'linear-gradient(180deg,#7f8ff0,#4a5ad8)', cat: '游戏',
      desc: '考验记忆力的配对游戏', long: '翻开两张牌,图案相同即可消除。用最少的步数清空整个棋盘,挑战你的瞬时记忆。',
      author: 'BrainLab', ver: '1.0.4', size: '0.7 MB', rating: '4.6', dl: '3.8万', type: 'html', source: MEMORY_SRC, w: 420, h: 500 },
    { id: 'paint', name: '画板', icon: '🎨', bg: 'linear-gradient(180deg,#fdfdfd,#d8dde6)', cat: '工具',
      desc: '随手涂鸦的小画板', long: '简洁的自由绘画工具:调色板、笔刷粗细、橡皮擦、一键清空。灵感来了就画两笔。',
      author: 'Zebo', ver: '1.3.0', size: '0.5 MB', rating: '4.5', dl: '6.2万', type: 'html', source: PAINT_SRC, w: 680, h: 500 },
    { id: 'pomo', name: '番茄钟', icon: '🍅', bg: 'linear-gradient(180deg,#ff8a7a,#e8493a)', cat: '效率',
      desc: '25 分钟专注一件事', long: '基于番茄工作法的极简计时器:专注 25 分钟、休息 5 分钟,带环形进度和完成提示音。',
      author: 'FocusLab', ver: '3.0.1', size: '0.6 MB', rating: '4.7', dl: '20.3万', type: 'html', source: POMO_SRC, w: 380, h: 460 },
    { id: 'watch', name: '秒表', icon: '⏱️', bg: 'linear-gradient(180deg,#3c3c46,#17171d)', cat: '效率',
      desc: '精确到百分之一秒', long: '简洁的秒表:启动 / 停止 / 计次 / 复位,精确到 10 毫秒,适合掐一切需要掐的东西。',
      author: 'FocusLab', ver: '1.1.0', size: '0.4 MB', rating: '4.4', dl: '8.9万', type: 'html', source: WATCH_SRC, w: 380, h: 460 },
    { id: 'osm', name: '世界地图', icon: '🗺️', bg: 'linear-gradient(180deg,#9be39b,#2f9e6e)', cat: '工具',
      desc: 'OpenStreetMap 在线地图', long: '基于 OpenStreetMap 的在线地图(URL 应用示例)。需要联网,数据来自 openstreetmap.org。',
      author: 'OSM 社区', ver: '—', size: '在线', rating: '4.7', dl: '9.6万', type: 'url',
      source: 'https://www.openstreetmap.org/export/embed.html?bbox=116.25,39.85,116.55,40.02&layer=mapnik', w: 720, h: 520 },
  ];

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
      } else {
        iframe.srcdoc = app.source;
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
  const CATS = ['游戏', '工具', '效率'];
  const CAT_IC = { '游戏': '🎮', '工具': '🔧', '效率': '⏱' };

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
        const feat = findApp('g2048');
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
