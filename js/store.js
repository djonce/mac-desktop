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

  const EBOOK_SRC = `<!doctype html><html lang="zh"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<style>
*{margin:0;padding:0;box-sizing:border-box;-webkit-user-select:none;user-select:none}
:root{
  --bg:#f6f3ec;--fg:#2f2b25;--fg2:#9a948a;--ui:#fbf9f4;--line:rgba(0,0,0,.07);
  --accent:#b5854b;--fs:19px;--lh:1.85;--bookfont:'Songti SC','STSong',Georgia,serif;
}
html,body{height:100%;overflow:hidden;background:var(--bg);
  font-family:-apple-system,'PingFang SC','Helvetica Neue',sans-serif;color:var(--fg);
  transition:background .45s ease,color .45s ease;-webkit-font-smoothing:antialiased}
[data-theme=sepia]{--bg:#f1e6cf;--fg:#5a4d38;--fg2:#a79874;--ui:#f6eedb;--line:rgba(90,60,20,.1);--accent:#9c7434}
[data-theme=night]{--bg:#16161a;--fg:#c6c2b9;--fg2:#6c6960;--ui:#1d1d22;--line:rgba(255,255,255,.08);--accent:#c79a5e}
button{font-family:inherit;color:inherit;cursor:pointer;border:none;background:none}

/* ===== 视图容器 ===== */
#app{position:relative;height:100%;overflow:hidden}
.view{position:absolute;inset:0;transition:opacity .4s ease,transform .45s cubic-bezier(.32,.72,.2,1)}
#shelf{overflow-y:auto;padding:26px 28px 40px}
#shelf.out{opacity:0;transform:scale(1.04);pointer-events:none}
#reader{opacity:0;transform:translateY(14px);pointer-events:none;display:flex;flex-direction:column}
#reader.in{opacity:1;transform:none;pointer-events:auto}

/* ===== 书架 ===== */
.shelf-head{margin:6px 4px 22px}
.shelf-head h1{font-size:25px;font-weight:600;letter-spacing:.5px}
.shelf-head p{font-size:13px;color:var(--fg2);margin-top:3px}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(132px,1fr));gap:30px 22px}
.book{cursor:pointer;display:flex;flex-direction:column;align-items:center;gap:11px;
  transition:transform .28s cubic-bezier(.3,.8,.3,1)}
.book:hover{transform:translateY(-7px)}
.cover{position:relative;width:128px;height:178px;border-radius:5px 9px 9px 5px;overflow:hidden;
  box-shadow:0 1px 1px rgba(0,0,0,.2),0 16px 30px -12px rgba(0,0,0,.5);
  display:flex;color:#fff}
.cover::before{content:'';position:absolute;left:0;top:0;bottom:0;width:11px;
  background:linear-gradient(90deg,rgba(0,0,0,.28),rgba(0,0,0,0) 60%);z-index:2}
.cover::after{content:'';position:absolute;left:11px;top:0;bottom:0;width:2px;background:rgba(255,255,255,.18);z-index:2}
.cover .title{writing-mode:vertical-rl;margin:20px 0 0 auto;padding-right:18px;
  font-family:var(--bookfont);font-size:21px;font-weight:600;letter-spacing:4px;
  text-shadow:0 1px 5px rgba(0,0,0,.35)}
.cover .author{position:absolute;left:20px;bottom:15px;font-size:11px;opacity:.82;letter-spacing:1px}
.book .meta{text-align:center}
.book .bn{font-size:13.5px;font-weight:500;color:var(--fg)}
.book .ba{font-size:11.5px;color:var(--fg2);margin-top:2px}

/* ===== 阅读视图 ===== */
.bar{position:absolute;left:0;right:0;z-index:6;display:flex;align-items:center;
  background:var(--ui);transition:opacity .3s,transform .3s;border-color:var(--line)}
.immersive .bar{opacity:0;pointer-events:none}
.topbar{top:0;height:50px;padding:0 14px;gap:6px;border-bottom:1px solid var(--line)}
.immersive .topbar{transform:translateY(-100%)}
.botbar{bottom:0;height:46px;padding:0 20px;gap:14px;border-top:1px solid var(--line);font-size:12px;color:var(--fg2)}
.immersive .botbar{transform:translateY(100%)}
.tbtn{width:38px;height:34px;border-radius:8px;font-size:17px;display:flex;align-items:center;justify-content:center;
  transition:background .15s}
.tbtn:hover{background:var(--line)}
.bar .bt-title{flex:1;text-align:center;font-size:14px;font-weight:500;
  white-space:nowrap;overflow:hidden;text-overflow:ellipsis;font-family:var(--bookfont)}
.progress-wrap{flex:1;height:3px;border-radius:2px;background:var(--line);overflow:hidden}
.progress-wrap .fill{height:100%;width:0;background:var(--accent);transition:width .35s ease}
.botbar .pct{min-width:34px;text-align:right;font-variant-numeric:tabular-nums}
.botbar .chap{min-width:90px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;font-family:var(--bookfont)}

.stage{position:absolute;inset:0;overflow:hidden;touch-action:pan-y}
.flow{height:100%;margin:0 52px;padding:62px 0 54px;
  column-fill:auto;column-gap:104px;
  font-family:var(--bookfont);font-size:var(--fs);line-height:var(--lh);color:var(--fg);
  transition:transform .42s cubic-bezier(.33,.72,.32,1)}
.flow.drag{transition:none}
.flow section{break-inside:avoid-column}
.flow h2{font-size:calc(var(--fs) + 5px);font-weight:600;text-align:center;
  margin:6px 0 26px;letter-spacing:2px;break-after:avoid-column}
.flow h2.first{margin-top:30px}
.flow p{text-indent:2em;margin-bottom:.55em;text-align:justify;
  -webkit-hyphens:auto;hyphens:auto}
.flow p.nf{text-indent:0}
.flow .poem{text-indent:0;text-align:center;line-height:2.1;margin:.2em 0 1.1em}
.flow .note{text-indent:0;font-size:calc(var(--fs) - 4px);color:var(--fg2);
  border-left:2px solid var(--line);padding-left:12px;margin:.3em 0 1.3em}
.flow .dash{text-indent:0;text-align:center;color:var(--fg2);margin:1em 0}

/* 翻页热区 */
.tap{position:absolute;top:50px;bottom:46px;width:32%;z-index:4}
.tap.l{left:0;cursor:w-resize}
.tap.r{right:0;cursor:e-resize}

/* ===== 抽屉:目录 / 设置 ===== */
.scrim{position:absolute;inset:0;z-index:8;background:rgba(0,0,0,.32);opacity:0;
  pointer-events:none;transition:opacity .3s}
.scrim.show{opacity:1;pointer-events:auto}
.toc{position:absolute;top:0;left:0;bottom:0;width:288px;max-width:80%;z-index:9;
  background:var(--ui);box-shadow:8px 0 30px rgba(0,0,0,.25);
  transform:translateX(-100%);transition:transform .34s cubic-bezier(.32,.72,.2,1);
  display:flex;flex-direction:column}
.toc.open{transform:none}
.toc h3{font-size:13px;color:var(--fg2);padding:18px 20px 12px;letter-spacing:1px}
.toc-list{overflow-y:auto;padding:0 10px 16px}
.toc-item{padding:11px 14px;border-radius:8px;font-size:14px;font-family:var(--bookfont);
  cursor:pointer;transition:background .15s;display:flex;justify-content:space-between;gap:10px}
.toc-item:hover{background:var(--line)}
.toc-item.cur{color:var(--accent);font-weight:600}
.toc-item .pg{font-size:11px;color:var(--fg2);font-family:-apple-system,sans-serif}

.settings{position:absolute;left:0;right:0;bottom:0;z-index:9;background:var(--ui);
  border-top:1px solid var(--line);box-shadow:0 -10px 30px rgba(0,0,0,.18);
  border-radius:16px 16px 0 0;padding:20px 22px 26px;
  transform:translateY(115%);transition:transform .36s cubic-bezier(.32,.72,.2,1)}
.settings.open{transform:none}
.set-row{display:flex;align-items:center;gap:14px;margin-bottom:18px}
.set-row:last-child{margin-bottom:0}
.set-row .lab{width:46px;font-size:12px;color:var(--fg2);flex-shrink:0}
.themes{display:flex;gap:12px}
.sw{width:40px;height:40px;border-radius:50%;border:2px solid var(--line);position:relative;transition:transform .2s}
.sw:hover{transform:scale(1.08)}
.sw.on{border-color:var(--accent);box-shadow:0 0 0 2px var(--ui),0 0 0 4px var(--accent)}
.sw.paper{background:#f6f3ec}.sw.sepia{background:#f1e6cf}.sw.night{background:#16161a}
.seg{display:flex;background:var(--line);border-radius:9px;padding:3px;gap:3px;flex:1}
.seg button{flex:1;padding:7px 0;border-radius:7px;font-size:13px;transition:background .18s,color .18s}
.seg button.on{background:var(--ui);color:var(--fg);box-shadow:0 1px 3px rgba(0,0,0,.12);font-weight:500}
.stepper{display:flex;align-items:center;gap:0;flex:1;background:var(--line);border-radius:9px;overflow:hidden}
.stepper button{flex:1;padding:8px 0;font-size:17px;transition:background .15s}
.stepper button:hover{background:rgba(0,0,0,.06)}
.stepper .val{flex:1.4;text-align:center;font-size:13px;color:var(--fg);font-variant-numeric:tabular-nums}
</style></head>
<body>
<div id="app">
  <!-- 书架 -->
  <div id="shelf" class="view">
    <div class="shelf-head"><h1>书阁</h1><p>轻点封面,开始阅读</p></div>
    <div class="grid" id="grid"></div>
  </div>
  <!-- 阅读 -->
  <div id="reader" class="view">
    <div class="bar topbar">
      <button class="tbtn" id="back" title="书架">‹</button>
      <button class="tbtn" id="tocBtn" title="目录">☰</button>
      <div class="bt-title" id="rTitle"></div>
      <button class="tbtn" id="setBtn" title="显示设置" style="font-size:15px">Aa</button>
    </div>
    <div class="stage" id="stage">
      <div class="flow" id="flow"></div>
    </div>
    <div class="tap l" id="tapL"></div>
    <div class="tap r" id="tapR"></div>
    <div class="bar botbar">
      <span class="chap" id="bChap"></span>
      <div class="progress-wrap"><div class="fill" id="bFill"></div></div>
      <span class="pct" id="bPct">0%</span>
    </div>
    <div class="scrim" id="scrim"></div>
    <div class="toc" id="toc"><h3>目录</h3><div class="toc-list" id="tocList"></div></div>
    <div class="settings" id="settings">
      <div class="set-row"><span class="lab">主题</span>
        <div class="themes">
          <button class="sw paper on" data-theme="paper"></button>
          <button class="sw sepia" data-theme="sepia"></button>
          <button class="sw night" data-theme="night"></button>
        </div>
      </div>
      <div class="set-row"><span class="lab">字体</span>
        <div class="seg" id="fontSeg">
          <button data-f="song" class="on">宋体</button>
          <button data-f="hei">黑体</button>
        </div>
      </div>
      <div class="set-row"><span class="lab">字号</span>
        <div class="stepper"><button data-fs="-1">A−</button><span class="val" id="fsVal">19</span><button data-fs="1">A+</button></div>
      </div>
      <div class="set-row"><span class="lab">行距</span>
        <div class="stepper"><button data-lh="-1">紧</button><span class="val" id="lhVal">1.85</span><button data-lh="1">松</button></div>
      </div>
    </div>
  </div>
</div>
<script>
/* ============ 书籍数据(公共领域文本 + 原创) ============ */
var P=function(){var a=[].slice.call(arguments);return{p:a}};      /* 普通段 */
function ch(t){var c={t:t,b:[]};for(var i=1;i<arguments.length;i++)c.b.push(arguments[i]);return c}
function p(){return{k:'p',x:[].slice.call(arguments).join('')}}
function poem(){return{k:'poem',x:[].slice.call(arguments)}}
function note(s){return{k:'note',x:s}}
function nf(s){return{k:'nf',x:s}}

var BOOKS=[
 {id:'daode',name:'道德经',author:'老子',cover:'linear-gradient(155deg,#33403c,#10201d)',tcol:'#e8c98a',
  chapters:[
   ch('第一章',
     p('道可道,非常道;名可名,非常名。'),
     p('无名天地之始,有名万物之母。故常无欲,以观其妙;常有欲,以观其徼。'),
     p('此两者,同出而异名,同谓之玄。玄之又玄,众妙之门。')),
   ch('第二章',
     p('天下皆知美之为美,斯恶已;皆知善之为善,斯不善已。'),
     p('故有无相生,难易相成,长短相形,高下相倾,音声相和,前后相随。'),
     p('是以圣人处无为之事,行不言之教;万物作焉而不辞,生而不有,为而不恃,功成而弗居。夫唯弗居,是以不去。')),
   ch('第八章',
     p('上善若水。水善利万物而不争,处众人之所恶,故几于道。'),
     p('居善地,心善渊,与善仁,言善信,正善治,事善能,动善时。夫唯不争,故无尤。')),
   ch('第十一章',
     p('三十辐,共一毂,当其无,有车之用。埏埴以为器,当其无,有器之用。凿户牖以为室,当其无,有室之用。'),
     p('故有之以为利,无之以为用。')),
   ch('第二十二章',
     p('曲则全,枉则直,洼则盈,敝则新,少则得,多则惑。'),
     p('是以圣人抱一为天下式。不自见,故明;不自是,故彰;不自伐,故有功;不自矜,故长。'),
     p('夫唯不争,故天下莫能与之争。')),
   ch('第三十三章',
     p('知人者智,自知者明。胜人者有力,自胜者强。'),
     p('知足者富,强行者有志。不失其所者久,死而不亡者寿。')),
   ch('第六十四章',
     p('其安易持,其未兆易谋;其脆易泮,其微易散。为之于未有,治之于未乱。'),
     p('合抱之木,生于毫末;九层之台,起于累土;千里之行,始于足下。')),
   ch('第八十一章',
     p('信言不美,美言不信。善者不辩,辩者不善。知者不博,博者不知。'),
     p('圣人不积,既以为人己愈有,既以与人己愈多。天之道,利而不害;圣人之道,为而不争。'))
  ]},
 {id:'tang',name:'唐诗选',author:'李白 等',cover:'linear-gradient(155deg,#7d2b2b,#3a1212)',tcol:'#f1d8a8',
  chapters:[
   ch('静夜思 · 李白',
     poem('床前明月光,疑是地上霜。','举头望明月,低头思故乡。'),
     note('二十字,写尽千年游子心。明白如话,而余味无穷。')),
   ch('登鹳雀楼 · 王之涣',
     poem('白日依山尽,黄河入海流。','欲穷千里目,更上一层楼。'),
     note('后两句已成格言:登高方能望远。')),
   ch('相思 · 王维',
     poem('红豆生南国,春来发几枝。','愿君多采撷,此物最相思。'),
     note('以红豆寄相思,温润含蓄,王维本色。')),
   ch('春晓 · 孟浩然',
     poem('春眠不觉晓,处处闻啼鸟。','夜来风雨声,花落知多少。'),
     note('听觉写春,惜花之情藏于问句之中。')),
   ch('鹿柴 · 王维',
     poem('空山不见人,但闻人语响。','返景入深林,复照青苔上。'),
     note('以声衬静,以光写幽,禅意盎然。')),
   ch('江雪 · 柳宗元',
     poem('千山鸟飞绝,万径人踪灭。','孤舟蓑笠翁,独钓寒江雪。'),
     note('二十字一幅水墨,孤绝清冷,见其风骨。')),
   ch('月下独酌 · 李白',
     poem('花间一壶酒,独酌无相亲。','举杯邀明月,对影成三人。'),
     note('独而不孤——邀月与影,豪情自遣。')),
   ch('登高 · 杜甫',
     poem('风急天高猿啸哀,渚清沙白鸟飞回。','无边落木萧萧下,不尽长江滚滚来。'),
     note('被誉为「七律第一」。沉郁顿挫,气象万千。'))
  ]},
 {id:'shishuo',name:'世说新语',author:'刘义庆',cover:'linear-gradient(155deg,#3a6b62,#1b3a35)',tcol:'#e6efe0',
  chapters:[
   ch('咏雪',
     p('谢太傅寒雪日内集,与儿女讲论文义。俄而雪骤,公欣然曰:「白雪纷纷何所似?」'),
     p('兄子胡儿曰:「撒盐空中差可拟。」兄女曰:「未若柳絮因风起。」公大笑乐。'),
     note('「柳絮因风起」遂成咏雪名喻,谢道韫由此称「咏絮之才」。')),
   ch('陈太丘与友期',
     p('陈太丘与友期行,期日中。过中不至,太丘舍去,去后乃至。元方时年七岁,门外戏。'),
     p('客问元方:「尊君在不?」答曰:「待君久不至,已去。」友人便怒,元方曰:「君与家君期日中,日中不至,则是无信;对子骂父,则是无礼。」友人惭,下车引之。元方入门不顾。'),
     note('七岁孩童,以理服人。诚信与礼,古今同重。')),
   ch('雪夜访戴',
     p('王子猷居山阴,夜大雪,眠觉,开室命酌酒,四望皎然。因起彷徨,咏左思《招隐诗》,忽忆戴安道。'),
     p('时戴在剡,即便夜乘小船就之。经宿方至,造门不前而返。人问其故,王曰:「吾本乘兴而行,兴尽而返,何必见戴?」'),
     note('乘兴而行,兴尽而返——魏晋风度的极致写照。')),
   ch('管宁割席',
     p('管宁、华歆共园中锄菜,见地有片金,管挥锄与瓦石不异,华捉而掷去之。'),
     p('又尝同席读书,有乘轩冕过门者,宁读如故,歆废书出看。宁割席分坐,曰:「子非吾友也。」'),
     note('道不同不相为谋。一割,见取舍之严。')),
   ch('王子猷爱竹',
     p('王子猷尝暂寄人空宅住,便令种竹。或问:「暂住何烦尔?」王啸咏良久,直指竹曰:「何可一日无此君?」'),
     note('「不可一日无此君」,竹之高洁,士之自况。')),
   ch('周处除三害',
     p('周处年少时,凶强侠气,为乡里所患。又义兴水中有蛟,山中有白额虎,并皆暴犯百姓,义兴人谓为「三横」,而处尤剧。'),
     p('或说处杀虎斩蛟,实冀三横唯余其一。处即刺杀虎,又入水击蛟,经三日三夜,乡里皆谓已死,更相庆。竟杀蛟而出,闻里人相庆,始知为人情所患,有自改意。终为忠臣孝子。'),
     note('知错能改,善莫大焉。三害之中,人心最难除。'))
  ]},
 {id:'manual',name:'本机手册',author:'macOS Web',cover:'linear-gradient(155deg,#4f7cf5,#8b3fd4)',tcol:'#ffffff',
  chapters:[
   ch('欢迎',
     p('欢迎使用 macOS Web——一个用纯 HTML、CSS 和原生 JavaScript 写成的网页操作系统。你现在正在它的「书阁」里读这本手册,而书阁本身,是从 App Store 里安装来的一个应用。'),
     p('它没有后端,没有框架,所有窗口、动画与应用都在你的浏览器里运行。下面几页,带你认识它。')),
   ch('窗口与程序坞',
     p('每个应用都是一个可拖动、可缩放的窗口。左上角三颗灯:红色关闭,黄色最小化(会「吸」进程序坞),绿色缩放。双击标题栏也能最大化。'),
     p('屏幕底部的程序坞会随鼠标靠近而放大;正在运行的应用下方有一个小圆点。')),
   ch('聚焦与启动台',
     p('按下 ⌘K 唤出聚焦搜索,输入应用名即可启动,甚至能直接当计算器用——试试输入 12*8。'),
     p('点按程序坞上的火箭进入启动台,这里陈列着所有应用,支持搜索。')),
   ch('App Store',
     p('App Store 里可以一键安装小游戏与工具,安装后它们会出现在启动台、聚焦搜索和访达里。'),
     p('你也可以发布自己的网页应用:贴一段 HTML 代码,或填一个网址,就能上架。这本「书阁」便是一个范例——它证明了一个完整的应用可以多精致。')),
   ch('终端彩蛋',
     p('打开「终端」,输入 neofetch,会看到一张用字符拼成的系统信息卡片。还可以试试 ls、cd、cat,以及——如果你好奇的话——sudo。'),
     note('提示:这台 Mac 的 sudo 没那么好说话。')),
   ch('关于',
     p('macOS Web 由 Zebo 与 Claude 一同打造,在线运行于 desktop.19ba.cn。'),
     p('愿你在这方寸屏幕之间,也能找到一点把玩系统的乐趣。翻到这里,手册就读完了——合上书,去探索吧。'),
     nf('— 完 —'))
  ]}
];

/* ============ 状态 ============ */
var app=document.getElementById('app'),shelf=document.getElementById('shelf'),
    reader=document.getElementById('reader'),stage=document.getElementById('stage'),
    flow=document.getElementById('flow');
var PAD=52,GAP=104;
var curBook=null,page=0,pages=1,chapPages=[],chapEls=[];

/* ============ 书架 ============ */
(function buildShelf(){
  var g=document.getElementById('grid'),h='';
  for(var i=0;i<BOOKS.length;i++){var b=BOOKS[i];
    h+='<div class="book" data-i="'+i+'">'+
       '<div class="cover" style="background:'+b.cover+';color:'+b.tcol+'">'+
       '<div class="title">'+b.name+'</div><div class="author">'+b.author+'</div></div>'+
       '<div class="meta"><div class="bn">'+b.name+'</div><div class="ba">'+b.author+'</div></div></div>';
  }
  g.innerHTML=h;
  g.addEventListener('click',function(e){var el=e.target.closest('.book');if(el)openBook(+el.dataset.i)});
})();

/* ============ 打开 / 渲染一本书 ============ */
function openBook(i){
  curBook=BOOKS[i];page=0;
  document.getElementById('rTitle').textContent=curBook.name;
  var html='',j,k;
  for(j=0;j<curBook.chapters.length;j++){
    var c=curBook.chapters[j];
    html+='<section data-ch="'+j+'"><h2'+(j===0?' class="first"':'')+'>'+c.t+'</h2>';
    for(k=0;k<c.b.length;k++){var blk=c.b[k];
      if(blk.k==='p')html+='<p>'+blk.x+'</p>';
      else if(blk.k==='nf')html+='<p class="nf dash">'+blk.x+'</p>';
      else if(blk.k==='note')html+='<p class="note">'+blk.x+'</p>';
      else if(blk.k==='poem')html+='<p class="poem">'+blk.x.join('<br>')+'</p>';
    }
    html+='</section>';
  }
  flow.innerHTML=html;
  shelf.classList.add('out');
  reader.classList.add('in');
  requestAnimationFrame(function(){requestAnimationFrame(layout)});
  if(document.fonts&&document.fonts.ready)document.fonts.ready.then(function(){if(reader.classList.contains('in'))reflow()});
}
function backToShelf(){
  reader.classList.remove('in');shelf.classList.remove('out');
  closeToc();closeSettings();
}

/* ============ 分页(多栏测量) ============ */
function stageW(){return stage.clientWidth}
function layout(){
  var w=stageW();if(!w)return;
  flow.classList.add('drag');                 /* 关闭动画测量 */
  flow.style.columnWidth=(w-PAD*2)+'px';
  flow.style.columnGap=GAP+'px';
  flow.style.transform='translateX(0)';
  pages=Math.max(1,Math.round((flow.scrollWidth+GAP)/w));
  /* 记录每章页码 */
  chapEls=flow.querySelectorAll('section');
  chapPages=[];var f0=flow.getBoundingClientRect().left;
  for(var i=0;i<chapEls.length;i++){
    var x=chapEls[i].getBoundingClientRect().left-f0;
    chapPages.push(Math.max(0,Math.round(x/w)));
  }
  if(page>pages-1)page=pages-1;
  buildToc();
  requestAnimationFrame(function(){flow.classList.remove('drag');render()});
}
function render(){
  flow.style.transform='translateX('+(-page*stageW())+'px)';
  var pct=pages>1?Math.round(page/(pages-1)*100):100;
  document.getElementById('bFill').style.width=pct+'%';
  document.getElementById('bPct').textContent=pct+'%';
  /* 当前章名 */
  var ci=0;for(var i=0;i<chapPages.length;i++)if(chapPages[i]<=page)ci=i;
  document.getElementById('bChap').textContent=curBook?curBook.chapters[ci].t:'';
  var items=document.querySelectorAll('.toc-item');
  for(var j=0;j<items.length;j++)items[j].classList.toggle('cur',+items[j].dataset.ch===ci);
}
function go(d){var n=page+d;if(n<0||n>pages-1)return bounce(d);page=n;render()}
function bounce(d){              /* 边界回弹 */
  flow.style.transform='translateX('+(-page*stageW()-d*26)+'px)';
  setTimeout(render,160);
}

/* ============ 目录 ============ */
function buildToc(){
  var h='';for(var i=0;i<curBook.chapters.length;i++)
    h+='<div class="toc-item" data-ch="'+i+'"><span>'+curBook.chapters[i].t+'</span><span class="pg">'+(chapPages[i]+1)+'</span></div>';
  document.getElementById('tocList').innerHTML=h;
}
function openToc(){document.getElementById('toc').classList.add('open');document.getElementById('scrim').classList.add('show')}
function closeToc(){document.getElementById('toc').classList.remove('open');if(!document.getElementById('settings').classList.contains('open'))document.getElementById('scrim').classList.remove('show')}
document.getElementById('tocList').addEventListener('click',function(e){
  var it=e.target.closest('.toc-item');if(!it)return;
  page=chapPages[+it.dataset.ch];render();closeToc();
});

/* ============ 设置 ============ */
function openSettings(){document.getElementById('settings').classList.add('open');document.getElementById('scrim').classList.add('show')}
function closeSettings(){document.getElementById('settings').classList.remove('open');if(!document.getElementById('toc').classList.contains('open'))document.getElementById('scrim').classList.remove('show')}
var rootStyle=document.documentElement.style,fs=19,lh=1.85;
document.querySelectorAll('.sw').forEach(function(b){b.addEventListener('click',function(){
  document.querySelectorAll('.sw').forEach(function(x){x.classList.remove('on')});b.classList.add('on');
  document.documentElement.setAttribute('data-theme',b.dataset.theme==='paper'?'':b.dataset.theme);
})});
document.getElementById('fontSeg').addEventListener('click',function(e){
  var b=e.target.closest('button');if(!b)return;
  document.querySelectorAll('#fontSeg button').forEach(function(x){x.classList.remove('on')});b.classList.add('on');
  rootStyle.setProperty('--bookfont',b.dataset.f==='hei'?"-apple-system,'PingFang SC',sans-serif":"'Songti SC','STSong',Georgia,serif");
  reflow();
});
document.querySelectorAll('[data-fs]').forEach(function(b){b.addEventListener('click',function(){
  fs=Math.min(26,Math.max(15,fs+ +b.dataset.fs));rootStyle.setProperty('--fs',fs+'px');
  document.getElementById('fsVal').textContent=fs;reflow();
})});
document.querySelectorAll('[data-lh]').forEach(function(b){b.addEventListener('click',function(){
  lh=Math.min(2.4,Math.max(1.5,+(lh+ +b.dataset.lh*0.15).toFixed(2)));rootStyle.setProperty('--lh',lh);
  document.getElementById('lhVal').textContent=lh.toFixed(2);reflow();
})});
function reflow(){var r=pages>1?page/(pages-1):0;layout();requestAnimationFrame(function(){page=Math.round(r*(pages-1));render()})}

/* ============ 交互:点击热区 / 拖拽 / 键盘 ============ */
document.getElementById('back').addEventListener('click',backToShelf);
document.getElementById('tocBtn').addEventListener('click',openToc);
document.getElementById('setBtn').addEventListener('click',openSettings);
document.getElementById('scrim').addEventListener('click',function(){closeToc();closeSettings()});
document.getElementById('tapL').addEventListener('click',function(){go(-1)});
document.getElementById('tapR').addEventListener('click',function(){go(1)});

/* 拖拽手势(跟手滑动) */
var dragging=false,startX=0,baseX=0,moved=0;
stage.addEventListener('pointerdown',function(e){
  if(e.target.closest('.tap'))return;       /* 热区交给 click */
  dragging=true;moved=0;startX=e.clientX;baseX=-page*stageW();
  flow.classList.add('drag');stage.setPointerCapture(e.pointerId);
});
stage.addEventListener('pointermove',function(e){
  if(!dragging)return;var dx=e.clientX-startX;moved=dx;
  /* 边界阻尼 */
  if((page===0&&dx>0)||(page===pages-1&&dx<0))dx*=0.34;
  flow.style.transform='translateX('+(baseX+dx)+'px)';
});
stage.addEventListener('pointerup',function(e){
  if(!dragging)return;dragging=false;flow.classList.remove('drag');
  var w=stageW();
  if(Math.abs(moved)<6){                     /* 当作点击:中间区切换沉浸 */
    reader.classList.toggle('immersive');render();return;
  }
  if(moved<=-w*0.16)go(1);
  else if(moved>=w*0.16)go(-1);
  else render();                              /* 回弹 */
});
addEventListener('keydown',function(e){
  if(!reader.classList.contains('in'))return;
  if(e.key==='ArrowRight'||e.key==='ArrowDown'||e.key===' '){go(1);e.preventDefault()}
  else if(e.key==='ArrowLeft'||e.key==='ArrowUp'){go(-1);e.preventDefault()}
  else if(e.key==='Escape'){closeToc();closeSettings();if(reader.classList.contains('in'))backToShelf()}
});

/* 窗口尺寸变化 → 保持进度重排 */
var ro=new ResizeObserver(function(){if(reader.classList.contains('in'))reflow()});
ro.observe(stage);
<\/script></body></html>
`;

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
    { id: 'reader', name: '书阁', icon: '📖', bg: 'linear-gradient(160deg,#caa86a,#8a5a2b)', cat: '阅读',
      desc: '丝滑翻页的电子书阅读器', long: '一款界面考究的电子书阅读器:用 CSS 多栏实现真实分页,配合手势跟手翻页,顺滑如纸。内置《道德经》《唐诗选》《世说新语》及一本原创《本机手册》(均为公共领域或原创文本)。支持目录跳转、纸 / 米黄 / 夜间三种主题,以及字号、行距、字体调节。',
      author: 'Zebo', ver: '1.0.0', size: '0.4 MB', rating: '4.9', dl: '7.7万', type: 'html', source: EBOOK_SRC, w: 760, h: 560 },
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
