'use strict';
/* Siegel 5, Schritt 1: Zacharias' Reisebericht als kleine Top-Down-Erkundung.
   Rules are dependency-free (node tests); the UI part mounts into the puzzle dialog. */
const ReportWalkRules=(()=>{
 const width=1651,height=953,speed=110,cell=8;
 // Walkable ground, traced from report-route-bg.webp: 8 px cells, one row per line, spans "from-to" (exclusive).
 const ROWS='|126-128|123-128|123-128|123-128|122-124|117-124|114-122|112-121|111-118|110-117|108-116|76-82,106-115|79-83,104-114|32-37,38-41,79-84,103-113|34-40,80-85,103-112|35-39,81-86,102-112|34-39,82-86,102-113|35-40,83-89,101-112|35-42,84-91,100-111|36-45,87-94,99-110,177-178|37-46,92-110,177-181|37-47,94-110,177-184|37-46,95-110,178-185|37-47,96-110,180-186|36-44,46-47,96-110,181-187|34-37,38-43,46-47,97-110,182-188|33-36,38-39,98-110,183-189|30-36,99-111,183-190|28-35,100-111,183-192|24-35,100-111,184-192|23-34,101-111,184-193|22-33,101-111,184-193|20-33,101-112,184-194|20-32,101-112,184-195|23-33,49-60,61-65,101-112,184-195|24-33,50-59,61-63,101-113,184-195|26-34,51-59,61-63,101-113,184-195|28-35,50-63,100-114,184-195|29-37,50-65,100-114,183-195|29-40,50-73,99-115,182-195|30-45,48-82,95-101,105-107,109-120,182-195|31-101,110-124,181-195|33-101,116-129,180-195|34-100,118-133,178-195|35-99,119-140,175-194|37-99,120-145,146-165,166-194|39-98,119-194|42-96,121-193|45-93,123-172,177-191|48-92,123-171,178-191|48-92,123-165,179-189|48-91,124-165,182-186|49-89,124-165,183-184|49-70,76-90,125-164|50-70,77-90,126-163|50-58,60-67,79-90,126-163|49-57,61-62,79-80,81-91,125-145,147-161|48-56,82-91,125-144,148-155|45-56,83-92,125-144,148-153|43-55,83-93,124-143,149-152|41-54,84-93,124-140,142-143,150-151|39-54,85-95,123-138|37-53,85-96,122-137|36-53,84-97,120-134|34-52,83-99,117-134|33-50,84-101,102-105,110-132|32-47,87-131|32-45,88-130|32-45,89-129|32-44,94-127|32-43,95-127|31-43,97-126|30-42,98-123|29-42,100-122|29-42,101-122|28-41,102-121|28-42,103-121|27-41,103-120|27-41,103-119|27-41,104-119,156-158|27-41,105-118,155-159|27-41,105-117,146-149,156-159|27-41,105-117,147-149,155-159|27-40,105-117,147-159|27-39,106-117,151-160|27-39,106-117,154-166|26-40,105-117,155-166|25-39,105-117,156-166|25-38,104-118,161-166|26-38,103-119,161-166|26-37,102-120,161-167|26-37,101-120,162-169|26-37,99-121,163-171|26-37,96-123,163-171|27-36,92-125,163-172,179-180|27-36,84-97,99-107,109-127,162-182|27-36,85-94,95-96,101-104,112-131,161-179|28-36,86-93,101-103,113-135,157-178|28-36,87-92,114-145,146-176|28-35,87-90,115-174|27-35,117-173|27-36,118-172|26-37,121-156,159-163,168-171|25-38,122-145,148-153,160-163|25-39,124-144,160-162|24-39,128-130,133-139|24-39,137-138|24-40|24-40|24-41|24-42|23-42|22-44|23-44|23-45|23-46|24-46||'.split('|');
 const cols=207,grid=new Uint8Array(cols*ROWS.length);
 ROWS.forEach((row,y)=>row.split(',').filter(Boolean).forEach(span=>{const [a,b]=span.split('-').map(Number);grid.fill(1,y*cols+a,y*cols+b);}));
 const walkable=(x,y)=>{const cx=Math.floor(x/cell),cy=Math.floor(y/cell);return cx>=0&&cy>=0&&cx<cols&&cy<ROWS.length&&grid[cy*cols+cx]===1;};
 // Feet, not the head or cloak, collide; the painted map supplies the obstacles.
 const free=(x,y)=>x>=16&&x<=width-16&&y>=60&&y<=height-6&&[[x-12,y-8],[x+12,y-8],[x-12,y+2],[x+12,y+2]].every(([px,py])=>walkable(px,py));
 const start={x:250,y:890};
 // Stand points lie on reachable ground in front of each painted situation.
 const stations=[
  {id:'control',x:490,y:335,r:90,marker:'control',evidence:'control-tablet'},
  {id:'burden',x:1200,y:392,r:95,marker:'tax-burden',evidence:'tax-sack'},
  {id:'power',x:1266,y:706,r:95,marker:'roman-power',evidence:'roman-shield'},
  // The talking pair sits inside a fenced olive grove: it can be overheard from the path east of it.
  {id:'hope',x:650,y:690,r:205,mx:650,my:682,marker:'hope-dialogue',evidence:'shared-hope'}
 ];
 // An optional signpost: only a place name, deliberately not evidence.
 const sign={x:300,y:640,r:70,sprite:{x:344,y:648}};
 const valid=v=>Array.isArray(v)?[...new Set(v.filter(n=>Number.isInteger(n)&&n>=0&&n<stations.length))].sort():[];
 function create(found){return {player:{...start,direction:'north',moving:false},found:valid(found),elapsed:0,near:-1,route:null,goalStation:null};}
 // Index of the unsecured station in reach, -1 for none, 'sign' for the signpost.
 function nearby(run){
  const p=run.player;let best=-1,dist=Infinity;
  stations.forEach((s,i)=>{const d=Math.hypot(p.x-s.x,p.y-s.y);if(d<=s.r&&d<dist&&!run.found.includes(i)){best=i;dist=d;}});
  if(best<0&&Math.hypot(p.x-sign.x,p.y-sign.y)<=sign.r)return 'sign';
  return best;
 }
 // Tap-to-walk: breadth-first search on the 8 px grid (8 neighbours), then the path is thinned to straight legs.
 const G=4,cellFree=(cx,cy)=>free(cx*G+G/2,cy*G+G/2);
 function nearestFree(x,y){
  const cx=Math.round((x-G/2)/G),cy=Math.round((y-G/2)/G);
  for(let r=0;r<80;r++)for(let dy=-r;dy<=r;dy++)for(let dx=-r;dx<=r;dx++){if(Math.max(Math.abs(dx),Math.abs(dy))!==r)continue;if(cellFree(cx+dx,cy+dy))return [cx+dx,cy+dy];}
  return null;
 }
 function lineFree(a,b){const d=Math.hypot(b.x-a.x,b.y-a.y),n=Math.ceil(d/1.5);for(let i=1;i<=n;i++){const t=i/n;if(!free(a.x+(b.x-a.x)*t,a.y+(b.y-a.y)*t))return false;}return true;}
 // radius>0: any reachable cell within that distance of `to` counts as the goal (stations may sit behind fences).
 function path(from,to,radius=0){
  const s=nearestFree(from.x,from.y),g=radius?null:nearestFree(to.x,to.y);if(!s||(!radius&&!g))return null;let end=null;
  const W=Math.ceil(width/G),key=(x,y)=>y*W+x,prev=new Map([[key(...s),-1]]),q=[s];let found=false;
  for(let k=0;k<q.length;k++){const [x,y]=q[k];if(radius?Math.hypot(x*G+G/2-to.x,y*G+G/2-to.y)<=radius:(x===g[0]&&y===g[1])){found=true;end=[x,y];break;}
   for(const [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1],[1,1],[1,-1],[-1,1],[-1,-1]]){const nx=x+dx,ny=y+dy,kk=key(nx,ny);if(prev.has(kk)||!cellFree(nx,ny))continue;if(dx&&dy&&(!cellFree(x+dx,y)||!cellFree(x,y+dy)))continue;prev.set(kk,key(x,y));q.push([nx,ny]);}}
  if(!found)return null;
  const pts=[];for(let k=key(...end);k!==-1;k=prev.get(k))pts.unshift({x:(k%W)*G+G/2,y:Math.floor(k/W)*G+G/2});
  const out=[];let a={x:from.x,y:from.y};
  for(let i=1;i<pts.length;i++){if(!lineFree(a,pts[i])){out.push(pts[i-1]);a=pts[i-1];}}
  out.push(pts[pts.length-1]);return out;
 }
 function walkTo(run,x,y,station=null){const r=station===null?0:(station==='sign'?sign.r:stations[station].r)-4;const p=path(run.player,{x,y},r);run.route=p&&p.length?p:null;run.goalStation=run.route?station:null;return !!run.route;}
 function update(run,dt,input={}){
  dt=Math.max(0,Math.min(dt,.05));run.elapsed+=dt;
  const p=run.player;let dx=Number(!!input.right)-Number(!!input.left),dy=Number(!!input.down)-Number(!!input.up);
  if(dx||dy)run.route=null;
  const events=[];
  if(!dx&&!dy&&run.route){
   const t=run.route[0],ex=t.x-p.x,ey=t.y-p.y,d=Math.hypot(ex,ey),step=speed*dt;
   p.direction=Math.abs(ex)>Math.abs(ey)?(ex>0?'east':'west'):(ey>0?'south':'north');p.moving=true;
   if(d<=step){p.x=t.x;p.y=t.y;run.route.shift();if(!run.route.length){run.route=null;p.moving=false;events.push('arrived');}}
   else{p.x+=ex/d*step;p.y+=ey/d*step;}
   const before=run.near;run.near=nearby(run);if(before!==run.near)events.push('near');
   if(run.goalStation!==null&&run.near===run.goalStation){run.route=null;p.moving=false;events.push('arrived');}
   return events;
  }
  p.moving=!!(dx||dy);
  if(p.moving){
   p.direction=Math.abs(dx)>Math.abs(dy)?(dx>0?'east':'west'):(dy>0?'south':'north');
   const l=Math.hypot(dx,dy);dx=dx/l*speed*dt;dy=dy/l*speed*dt;
   if(free(p.x+dx,p.y))p.x+=dx;if(free(p.x,p.y+dy))p.y+=dy;
  }
  const before=run.near;run.near=nearby(run);
  return before!==run.near?['near']:[];
 }
 function secure(run,i){if(!Number.isInteger(i)||i<0||i>=stations.length||run.found.includes(i))return false;run.found=valid([...run.found,i]);return true;}
 const complete=run=>run.found.length===stations.length;
 return {width,height,speed,cell,cols,rowCount:ROWS.length,walkable,free,start,stations,sign,valid,create,nearby,path,walkTo,update,secure,complete};
})();
if(typeof module!=='undefined')module.exports=ReportWalkRules;
if(typeof window!=='undefined')window.ReportWalkRules=ReportWalkRules;

if(typeof window!=='undefined')(()=>{
 const T='assets/puzzles/report-topdown/',P={bg:T+'report-route-bg.webp',player:T+'report-player.png',markers:T+'report-markers.png',evidence:T+'report-evidence.png',frame:T+'report-evidence-frame.png',fore:T+'report-foreground.png'};
 const R=ReportWalkRules,reducedMotion=matchMedia('(prefers-reduced-motion: reduce)');
 let art=null,run=null,root=null,options=null,raf=0,last=0,paused=false,card=null,token=0,tapMark=null,autoInspect=null;
 const held=new Set(),keyboard=new Set();
 const esc=t=>String(t).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const active=()=>!!(root&&root.isConnected&&root.closest('dialog[open]'));
 function stop(){cancelAnimationFrame(raf);raf=0;last=0;held.clear();keyboard.clear();root?.querySelectorAll('.held').forEach(b=>b.classList.remove('held'));}
 async function mount(container,opts){
  stop();options=opts;root=container;run=R.create(opts.found);paused=false;card=null;const id=++token;
  // Walk controls are self-contained: their clicks never reach the puzzle dialog's generic answer handler.
  root.addEventListener('click',e=>e.stopPropagation());
  root.innerHTML='<p class="walk-loading" role="status">Der Reiseweg wird vorbereitet …</p>';
  try{art=await GameArt.prepare(Object.values(P));}
  catch{if(id!==token)return;root.innerHTML='<p role="alert">Die Reisekarte konnte nicht geladen werden. Euer Fortschritt bleibt erhalten.</p><button class="walk-retry">Erneut laden</button>';root.querySelector('.walk-retry').onclick=()=>mount(container,opts);return;}
  if(id!==token||!root.isConnected)return;
  const S=opts.stations;
  root.innerHTML=`<div class="walk-hud" aria-label="Gesicherte Belege">${S.map((s,i)=>`<span class="walk-slot" data-slot="${i}"><canvas width="96" height="96" aria-hidden="true"></canvas><span class="walk-slot-label">${esc(s.evidenceName)}</span></span>`).join('')}<strong class="walk-count" role="status"></strong></div>
<div class="walk-stage"><div class="walk-field"><canvas class="walk-canvas" width="${R.width}" height="${R.height}" tabindex="0" role="img" aria-label="Reiseweg aus der Vogelperspektive. Ihr startet am Tor unten links. Vier Stationen: Straßensperre oben links, Markt oben rechts, Wachposten unten rechts, Gespräch unter dem Olivenbaum unten in der Mitte." aria-describedby="walk-help"></canvas>
<div class="walk-card" hidden role="dialog" aria-modal="false" aria-labelledby="walk-card-title"></div>
<div class="walk-paused" hidden><p>Die Reise wartet.</p><button class="walk-resume">Weitergehen</button></div></div>
<div class="walk-controls"><div class="walk-dpad" role="group" aria-label="Bewegungssteuerung">${[['up','↑','Nach Norden'],['left','←','Nach Westen'],['down','↓','Nach Süden'],['right','→','Nach Osten']].map(([d,t,l])=>`<button type="button" data-walk="${d}" aria-label="${l}">${t}</button>`).join('')}</div>
<div class="walk-help"><p id="walk-help"><span class="walk-help-touch">Tippt auf die Karte: Zacharias geht dorthin. Tippt auf ein Zeichen am Boden: Er geht hin und untersucht es.</span><span class="walk-help-keys">Tippt oder klickt auf die Karte, um dorthin zu gehen. Tastatur: Pfeile oder WASD, Leertaste oder E: untersuchen.</span></p><div class="walk-actions"><button type="button" class="walk-inspect" disabled>Untersuchen</button><button type="button" class="walk-pause">Pause</button></div><p class="walk-message" role="status" aria-live="polite"></p><p class="walk-orientation">Im Querformat lässt sich der Weg besser erkunden.</p></div></div></div>`;
  root.querySelectorAll('[data-walk]').forEach(b=>{
   b.onpointerdown=e=>{e.preventDefault();if(card||paused)return;held.add(b.dataset.walk);b.classList.add('held');};
   const release=()=>{held.delete(b.dataset.walk);b.classList.remove('held');};
   b.onpointerup=release;b.onpointercancel=release;b.onpointerleave=release;
   // Keyboard activation of a d-pad button makes one deliberate step.
   b.onclick=e=>{if(e.detail===0&&!paused&&!card){for(let k=0;k<4;k++)R.update(run,.05,{[b.dataset.walk]:true});afterMove(['near']);draw();}};
  });
  root.querySelector('.walk-inspect').onclick=inspect;
  // Tap-to-walk on the map itself: thumbs and eyes stay on the same spot.
  const canvas=root.querySelector('.walk-canvas');
  canvas.addEventListener('pointerdown',e=>{
   if(paused||card)return;e.preventDefault();const r=canvas.getBoundingClientRect(),x=(e.clientX-r.left)*R.width/r.width,y=(e.clientY-r.top)*R.height/r.height;
   // A tap on (or close to) an unsecured station's marker walks there and opens it on arrival.
   let target=null,best=70;
   R.stations.forEach((s,i)=>{if(run.found.includes(i))return;const d=Math.hypot(x-(s.mx??s.x),y-((s.my??s.y)-10));if(d<best){best=d;target=i;}});
   if(target===null&&Math.hypot(x-R.sign.sprite.x,y-(R.sign.sprite.y-25))<60)target='sign';
   if(target!==null&&run.near===target){inspect();return;}
   const goal=target===null?{x,y}:target==='sign'?R.sign:R.stations[target];
   if(R.walkTo(run,goal.x,goal.y,target)){tapMark={x:run.route[run.route.length-1].x,y:run.route[run.route.length-1].y,t:run.elapsed};autoInspect=target;if(!raf)loop();}
   else message('Dorthin führt kein Weg. Tippt auf eine Stelle auf dem Weg.');
  });
  root.querySelector('.walk-pause').onclick=pause;
  root.querySelector('.walk-resume').onclick=resume;
  hud();message(run.found.length===R.stations.length?'Alle vier Beobachtungen sind gesichert. Als Nächstes ordnet ihr sie ein.':run.found.length?'Sucht die übrigen Stationen auf dem Reiseweg.':'Folgt dem Weg vom Tor aus. An vier Orten hat Zacharias etwas beobachtet.');
  draw();loop();
  // Bring HUD, map and controls into view together (the mission text may scroll away).
  root.scrollIntoView({block:'nearest'});
 }
 function message(t){const m=root?.querySelector('.walk-message');if(m)m.textContent=t;}
 function hud(){
  if(!root)return;
  root.querySelectorAll('[data-slot]').forEach(slot=>{
   const i=Number(slot.dataset.slot),c=slot.querySelector('canvas'),ctx=c.getContext('2d'),got=run.found.includes(i);
   ctx.clearRect(0,0,c.width,c.height);ctx.imageSmoothingEnabled=false;
   const f=GameArt.entry(art,P.frame,'evidence-slot').visible_bbox_xyxy;ctx.drawImage(art.images[P.frame],f[0],f[1],f[2]-f[0],f[3]-f[1],0,0,c.width,c.height);
   if(got){const s=GameArt.entry(art,P.evidence,R.stations[i].evidence),b=s.visible_bbox_xyxy,scale=Math.min(58/(b[2]-b[0]),58/(b[3]-b[1]));GameArt.draw(ctx,art,P.evidence,R.stations[i].evidence,48+((b[0]+b[2])/2-s.foot_anchor_source_xy[0])*scale,48+(b[3]-b[1])*scale/2,scale);}
   slot.classList.toggle('found',got);slot.setAttribute('aria-label',`${options.stations[i].evidenceName}: ${got?'gesichert':'noch nicht gefunden'}`);
  });
  root.querySelector('.walk-count').textContent=`${run.found.length} von 4 Belegen`;
 }
 function afterMove(events){
  if(!events.length)return;const b=root.querySelector('.walk-inspect'),n=run.near;
  b.disabled=n===-1;b.textContent=n==='sign'?'Wegweiser lesen':'Untersuchen';
  if(events.includes('near')){
   if(n==='sign')message('Hier steht ein Wegweiser.');
   else if(n!==-1)message(`${options.stations[n].place}: Hier gibt es etwas zu beobachten. Tippt auf das Zeichen oder auf „Untersuchen“.`);
   // Leaving a station clears its hint, so no stale place name stays on screen.
   else message(run.found.length?`Noch ${4-run.found.length} Station${4-run.found.length===1?'':'en'}. Folgt dem Weg weiter.`:'Folgt dem Weg vom Tor aus. An vier Orten hat Zacharias etwas beobachtet.');
  }
  if(events.includes('arrived')){tapMark=null;if(autoInspect!==null&&run.near===autoInspect){autoInspect=null;inspect();}else autoInspect=null;}
 }
 function inspect(){
  const n=run.near;if(n===-1||card||paused)return;stop();
  const c=root.querySelector('.walk-card');
  if(n==='sign'){card='sign';c.innerHTML=`<h3 id="walk-card-title">Ein Wegweiser</h3><p>${esc(options.sign)}</p><div class="walk-card-actions"><button type="button" class="walk-card-close">Weitergehen</button></div>`;}
  else{
   const s=options.stations[n];card=n;
   c.innerHTML=`<span class="eyebrow">AUS ZACHARIAS’ BERICHT</span><h3 id="walk-card-title">${esc(s.place)}</h3><div class="walk-card-body"><canvas width="120" height="120" aria-hidden="true"></canvas><blockquote>${esc(s.text)}</blockquote></div><div class="walk-card-actions"><button type="button" class="walk-card-secure">Beobachtung sichern</button><button type="button" class="walk-card-close paper-quiet">Später</button></div>`;
   GameArt.icon(c.querySelector('canvas'),art,P.evidence,R.stations[n].evidence);
   c.querySelector('.walk-card-secure').onclick=()=>{
    if(R.secure(run,n)){options.onSecure?.([...run.found]);}
    closeCard();hud();run.near=R.nearby(run);afterMove(['near']);
    if(R.complete(run)){message('Alle vier Beobachtungen sind gesichert.');options.onComplete?.();}
    else message(`Beleg gesichert: ${s.evidenceName}. Noch ${4-run.found.length} Station${4-run.found.length===1?'':'en'}.`);
   };
  }
  c.querySelector('.walk-card-close').onclick=()=>{closeCard();afterMove(['near']);};
  c.hidden=false;(c.querySelector('.walk-card-secure')||c.querySelector('.walk-card-close')).focus({preventScroll:true});
 }
 function closeCard(){card=null;const c=root?.querySelector('.walk-card');if(c){c.hidden=true;c.innerHTML='';}if(!paused){root?.querySelector('.walk-canvas')?.focus({preventScroll:true});loop();}}
 function pause(){if(!root||paused)return;paused=true;stop();const o=root.querySelector('.walk-paused');o.hidden=false;o.querySelector('button').focus({preventScroll:true});}
 function resume(){paused=false;root.querySelector('.walk-paused').hidden=true;root.querySelector('.walk-canvas').focus({preventScroll:true});if(!card)loop();}
 function loop(time){
  if(!active()||paused||card||document.hidden){raf=0;return;}
  const dt=time&&last?Math.min((time-last)/1000,.05):0;last=time||0;
  const input=Object.fromEntries(['up','left','down','right'].map(d=>[d,held.has(d)||keyboard.has(d)]));
  afterMove(R.update(run,dt,input));draw();raf=requestAnimationFrame(loop);
 }
 function draw(){
  const c=root?.querySelector('.walk-canvas');if(!c||!art)return;const ctx=c.getContext('2d');ctx.imageSmoothingEnabled=false;
  ctx.drawImage(art.images[P.bg],0,0);
  const t=run.elapsed,bob=reducedMotion.matches?0:Math.sin(t*3)*2;
  // Subtle, small markers: the pupils still have to look around the scene.
  R.stations.forEach((s,i)=>{if(run.found.includes(i))return;const e=GameArt.entry(art,P.markers,s.marker),b=e.visible_bbox_xyxy,scale=30/(b[2]-b[0]);
   if(run.near===i){ctx.beginPath();ctx.ellipse(s.mx??s.x,(s.my??s.y)+2,26,9,0,0,Math.PI*2);ctx.fillStyle='rgba(240,214,140,.45)';ctx.fill();}
   GameArt.draw(ctx,art,P.markers,s.marker,s.mx??s.x,(s.my??s.y)-10+bob,scale);});
  if(tapMark&&run.route){const a=.5+.3*Math.sin(t*6);ctx.beginPath();ctx.ellipse(tapMark.x,tapMark.y,16,7,0,0,Math.PI*2);ctx.strokeStyle=`rgba(90,58,24,${a})`;ctx.lineWidth=3;ctx.stroke();}
  const fig=[{y:R.sign.sprite.y,paint:()=>GameArt.draw(ctx,art,P.fore,'signpost',R.sign.sprite.x,R.sign.sprite.y,.16)},
   {y:run.player.y,paint:()=>{const p=run.player,step=!reducedMotion.matches&&p.moving&&Math.floor(t/.22)%2===1;GameArt.draw(ctx,art,P.player,p.direction+'-'+(step?'step':'idle'),p.x,p.y,.21);}}];
  fig.sort((a,b)=>a.y-b.y).forEach(f=>f.paint());
 }
 const keys={ArrowUp:'up',w:'up',W:'up',ArrowDown:'down',s:'down',S:'down',ArrowLeft:'left',a:'left',A:'left',ArrowRight:'right',d:'right',D:'right'};
 window.addEventListener('keydown',e=>{
  if(!active()||paused||card)return;
  if(keys[e.key]&&(e.target===document.body||e.target.closest?.('.report-walk'))){e.preventDefault();keyboard.add(keys[e.key]);if(!raf)loop();}
  else if((e.key===' '||e.key==='e'||e.key==='E')&&e.target.classList?.contains('walk-canvas')){e.preventDefault();inspect();}
 });
 window.addEventListener('keyup',e=>{if(keys[e.key])keyboard.delete(keys[e.key]);});
 window.addEventListener('pointerup',()=>{held.clear();root?.querySelectorAll('.held').forEach(b=>b.classList.remove('held'));});
 window.addEventListener('blur',()=>{if(active()&&!card)pause();});
 document.addEventListener('visibilitychange',()=>{if(document.hidden&&active()&&!card)pause();});
 function unmount(){stop();token++;root=null;run=null;card=null;}
 window.ReportWalk=Object.freeze({mount,unmount,getRun:()=>run,isPaused:()=>paused,inspect});
})();
