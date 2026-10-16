'use strict';
const InterludeRules=(()=>{
 const width=1659,height=948,speed=72,guardSpeed=42,crouchFactor=.65,sightRange=185;
 // Checked against the full background. Bodies/feet collide, not cloaks or spears.
 const obstacles=[
  {x:340,y:300,w:300,h:195},{x:712,y:225,w:202,h:140},
  {x:985,y:300,w:330,h:200},{x:425,y:535,w:510,h:180},
  {x:1070,y:570,w:255,h:155},{x:60,y:265,w:137,h:200},
  {x:64,y:510,w:140,h:155},{x:322,y:635,w:105,h:110},
  {x:64,y:90,w:164,h:100},{x:278,y:100,w:210,h:130},
  {x:550,y:90,w:210,h:95},{x:845,y:85,w:340,h:145},
  {x:1185,y:190,w:130,h:90},{x:1460,y:230,w:140,h:340},
  {x:1460,y:625,w:140,h:110},
  // One extra amphora cover in the open central lane, not on a painted island.
  {x:790,y:415,w:60,h:45},{x:1550,y:580,w:55,h:42}
 ];
 const floors=[{x:60,y:170,w:1540,h:590},{x:1320,y:145,w:125,h:100},{x:200,y:700,w:115,h:225}];
 const checkpoints=[{x:245,y:875},{x:245,y:680},{x:670,y:420},{x:1375,y:545}];
 const items=[{id:'map',x:300,y:260},{id:'provisions',x:1000,y:535},{id:'permit',x:1410,y:255}];
 const routes=[[[260,260],[665,260],[665,515],[260,515]],[[690,515],[940,515],[940,260]],[[1370,300],[1370,750],[1000,750]]];
 const inside=(p,r)=>p.x>=r.x&&p.x<=r.x+r.w&&p.y>=r.y&&p.y<=r.y+r.h;
 function free(x,y){
  return [{x:x-12,y:y-17},{x:x+12,y:y-17},{x:x-12,y:y+2},{x:x+12,y:y+2}].every(p=>floors.some(r=>inside(p,r))&&!obstacles.some(r=>inside(p,r)));
 }
 function segmentHit(a,b,r){
  let low=0,high=1;
  for(const [start,delta,min,max] of [[a.x,b.x-a.x,r.x,r.x+r.w],[a.y,b.y-a.y,r.y,r.y+r.h]]){
   if(Math.abs(delta)<1e-9){if(start<min||start>max)return null;continue;}
   let t0=(min-start)/delta,t1=(max-start)/delta;if(t0>t1)[t0,t1]=[t1,t0];
   low=Math.max(low,t0);high=Math.min(high,t1);if(low>high)return null;
  }
  return low;
 }
 function rayEnd(a,angle,range){
  const b={x:a.x+Math.cos(angle)*range,y:a.y+Math.sin(angle)*range};
  let t=1;for(const r of obstacles){const hit=segmentHit(a,b,r);if(hit!==null)t=Math.min(t,hit);}
  // Stop the visual cone at the outer courtyard walls as well.
  const limit=t;for(let u=.025;u<=limit;u+=.025){if(!floors.some(r=>inside({x:a.x+(b.x-a.x)*u,y:a.y+(b.y-a.y)*u},r))){t=Math.min(t,u-.025);break;}}
  return {x:a.x+(b.x-a.x)*t,y:a.y+(b.y-a.y)*t};
 }
 function sees(guard,player,hiding=false){
  const eye={x:guard.x,y:guard.y-12},body={x:player.x,y:player.y-10};
  const dx=body.x-eye.x,dy=body.y-eye.y,d=Math.hypot(dx,dy),range=hiding?120:sightRange;
  if(d>range)return false;
  if(d>25&&(dx*Math.cos(guard.angle)+dy*Math.sin(guard.angle))/d<Math.cos(Math.PI/5.5))return false;
  return !obstacles.some(r=>segmentHit(eye,body,r)!==null);
 }
 function create(saved){
  const index=Number.isInteger(saved?.checkpoint)?Math.max(0,Math.min(saved.checkpoint,3)):0;
  return {player:{...checkpoints[index],direction:'north',moving:false,hiding:false},checkpoint:index,
   guards:routes.map((route,i)=>({x:route[0][0],y:route[0][1],target:1,sign:1,angle:i===2?Math.PI/2:0,wait:.8,moving:false})),
   collected:Array.isArray(saved?.collected)?[...new Set(saved.collected.filter(id=>items.some(i=>i.id===id)))]:[],
   detections:Number.isInteger(saved?.detections)?Math.max(0,saved.detections):0,
   elapsed:Number.isFinite(saved?.elapsed)?Math.max(0,saved.elapsed):0,phase:saved?.finished===true?'result':'play',alarm:0,immune:2.5};
 }
 function snapshot(run){return {checkpoint:run.checkpoint,collected:[...run.collected],detections:run.detections,elapsed:run.elapsed,finished:run.phase==='result'};}
 function update(run,dt,input={}){
  if(run.phase!=='play')return [];
  dt=Math.max(0,Math.min(dt,.05));run.elapsed+=dt;const events=[];
  if(run.alarm>0){run.alarm=Math.max(0,run.alarm-dt);run.player.moving=false;
   if(run.alarm===0){Object.assign(run.player,checkpoints[run.checkpoint]);run.immune=2.5;events.push('respawn');}return events;
  }
  run.immune=Math.max(0,run.immune-dt);
  const p=run.player;let dx=Number(!!input.right)-Number(!!input.left),dy=Number(!!input.down)-Number(!!input.up);
  p.hiding=!!input.hide;p.moving=!!(dx||dy);
  if(p.moving){
   p.direction=Math.abs(dx)>Math.abs(dy)?(dx>0?'east':'west'):(dy>0?'south':'north');
   const length=Math.hypot(dx,dy);dx=dx/length*speed*dt*(p.hiding?crouchFactor:1);dy=dy/length*speed*dt*(p.hiding?crouchFactor:1);
   if(free(p.x+dx,p.y))p.x+=dx;if(free(p.x,p.y+dy))p.y+=dy;
  }
  run.guards.forEach((g,i)=>{
   g.moving=false;if(g.wait>0){g.wait=Math.max(0,g.wait-dt);return;}
   const route=routes[i],target=route[g.target],dx=target[0]-g.x,dy=target[1]-g.y,d=Math.hypot(dx,dy),step=guardSpeed*dt;
   if(d<=step){g.x=target[0];g.y=target[1];g.wait=.8;if(g.target===route.length-1)g.sign=-1;if(g.target===0)g.sign=1;g.target+=g.sign;}
   else{g.angle=Math.atan2(dy,dx);g.x+=dx/d*step;g.y+=dy/d*step;g.moving=true;}
  });
  for(let i=run.checkpoint+1;i<checkpoints.length;i++)if(Math.hypot(p.x-checkpoints[i].x,p.y-checkpoints[i].y)<44){run.checkpoint=i;events.push('checkpoint');}
  for(const item of items)if(!run.collected.includes(item.id)&&Math.hypot(p.x-item.x,p.y-item.y)<35){run.collected.push(item.id);events.push('collect');}
  if(run.immune===0&&run.guards.some(g=>sees(g,p,p.hiding))){run.detections++;run.alarm=.65;p.moving=false;events.push('alarm');return events;}
  if(p.x>=1325&&p.x<=1435&&p.y>=150&&p.y<=220){run.phase='result';p.moving=false;events.push('goal');}
  return events;
 }
 function shouldStart(state){return state.solved.filter(Boolean).length===3&&!state.interludeStarted&&!state.interludeCompleted;}
 return {width,height,speed,guardSpeed,crouchFactor,sightRange,obstacles,floors,checkpoints,items,routes,inside,free,segmentHit,rayEnd,sees,create,snapshot,update,shouldStart};
})();
if(typeof module!=='undefined')module.exports=InterludeRules;
if(typeof window!=='undefined')window.InterludeRules=InterludeRules;

if(typeof window!=='undefined')(()=>{
 const root=document.querySelector('#interlude'),content=root.querySelector('.run-content');
 const P='assets/interlude/checkpoint-run-',paths=['bg.webp','foreground.png','hideouts.png','route-markers.png','player.png','guards.png','collectibles.png','alert-effects.png','ui.png','result.png','start-panel.png'].map(f=>P+f);
 let art=null,run=null,phase='start',raf=0,last=0,lastSave=0,paused=false,loading=false,epoch=0;
 const held=new Set(),keyboard=new Set(),reducedMotion=matchMedia('(prefers-reduced-motion: reduce)');
 const bridge=()=>window.Adventure;
 const state=()=>bridge().getState();
 function clearInput(){held.clear();keyboard.clear();}
 function persist(){if(!run||state().interludeCompleted)return;state().interludeRun=InterludeRules.snapshot(run);bridge().save();}
 function stop(){cancelAnimationFrame(raf);raf=0;last=0;clearInput();}
 function updateReplay(){const s=state(),count=s.solved.filter(Boolean).length,b=document.querySelector('#interlude-replay');b.hidden=count<3&&!s.interludeStarted;b.textContent=s.interludeCompleted?'Zwischenetappe wiederholen':s.interludeStarted?'Zwischenetappe fortsetzen':'Zwischenetappe entdecken';}
 function auto(){updateReplay();if(InterludeRules.shouldStart(state())&&!document.querySelector('dialog[open]'))open(false);}
 async function open(replay=false){
  stop();epoch++;const token=epoch;
  if(!state().interludeStarted){state().interludeStarted=true;bridge().save();}
  updateReplay();run=state().interludeCompleted||replay?InterludeRules.create():InterludeRules.create(state().interludeRun);
  paused=false;phase=run.phase==='result'?'result':'start';loading=true;
  content.innerHTML='<p class="run-loading" role="status">Der Hof wird vorbereitet …</p>';
  if(!root.open)root.showModal();
  try{art=await GameArt.prepare(paths);if(token!==epoch||!root.open)return;loading=false;if(phase==='result')result();else startPanel();}
  catch(error){if(token!==epoch)return;loading=false;content.innerHTML='<p role="alert">Der Hof konnte nicht geladen werden. Euer Siegelstand bleibt erhalten.</p><button id="run-retry">Erneut laden</button>';content.querySelector('#run-retry').onclick=()=>open(replay);}
 }
 function paintIcon(canvas,path,name){GameArt.icon(canvas,art,P+path+'.png',name);}
 function startPanel(){
  phase='start';
  content.innerHTML=`<div class="run-start art-panel"><img src="${P}start-panel.png" alt="Historische Starttafel"><div class="run-start-copy"><h2>Unruhe am Kontrollposten</h2><p>Eine Patrouille zieht durch den Hof. Gelange zum Tor, ohne entdeckt zu werden.</p><p>Unterwegs könnt ihr drei Dinge für eure Weiterreise sichern.</p></div><div class="run-start-items">${['Karte','Proviant','Reisedokument'].map(t=>`<div><canvas width="100" height="82" aria-hidden="true"></canvas><span>${t}</span></div>`).join('')}</div><button id="run-begin">${state().interludeRun?'Weiter durch den Hof':'In den Hof'}</button></div>`;
  content.querySelectorAll('.run-start-items canvas').forEach((c,i)=>paintIcon(c,'collectibles',['map','provisions','permit'][i]));
  content.querySelector('#run-begin').onclick=play;
 }
 function play(){
  phase='play';paused=false;
  content.innerHTML=`<div class="run-hud" aria-label="Reiseausrüstung"><div class="run-collection">${['Karte','Proviant','Dokument'].map((t,i)=>`<span><canvas width="56" height="44" aria-hidden="true"></canvas><span>${t} <strong data-found="${['map','provisions','permit'][i]}">–</strong></span></span>`).join('')}</div><span class="run-undetected"><canvas width="46" height="40" aria-hidden="true"></canvas><span id="run-undetected">Unentdeckt</span></span><span class="run-target"><canvas width="40" height="40" aria-hidden="true"></canvas><span>Tor oben rechts</span></span></div><div class="run-field"><canvas id="run-canvas" width="1659" height="948" tabindex="0" role="img" aria-label="Hof aus der Vogelperspektive. Reisefigur links unten, Ziel oben rechts." aria-describedby="run-instructions"></canvas><div id="run-paused" hidden><p>Die Patrouillen warten.</p><button id="run-resume">Fortsetzen</button></div></div><div class="run-controls"><div class="run-dpad" role="group" aria-label="Bewegungssteuerung">${[['up','↑','Nach Norden'],['left','←','Nach Westen'],['down','↓','Nach Süden'],['right','→','Nach Osten']].map(([d,t,label])=>`<button data-direction="${d}" aria-label="${label}">${t}</button>`).join('')}</div><div class="run-control-help"><p id="run-instructions">Richtung halten: gehen. Loslassen: stehen. Tastatur: Pfeile oder WASD.</p><div><button id="run-hide" aria-pressed="false">Hocken</button><button id="run-pause">Pause</button></div><p id="run-message" role="status" aria-live="polite">Die drei Gegenstände sind freiwillig. Nur das Tor ist euer Ziel.</p><p class="run-orientation">Im Querformat lässt sich dieses Spiel besser spielen.</p></div></div>`;
  content.querySelectorAll('.run-collection canvas').forEach((c,i)=>paintIcon(c,'collectibles',['map','provisions','permit'][i]));
  paintIcon(content.querySelector('.run-undetected canvas'),'ui','undetected');paintIcon(content.querySelector('.run-target canvas'),'ui','target');
  // The three-slot HUD carrier is supplied art, independently cropped from its sheet.
  const carrier=document.createElement('canvas');carrier.width=360;carrier.height=96;carrier.className='run-hud-carrier';carrier.setAttribute('aria-hidden','true');
  paintIcon(carrier,'ui','three-slots');content.querySelector('.run-collection').prepend(carrier);
  content.querySelectorAll('[data-direction]').forEach(b=>{
   b.onpointerdown=e=>{e.preventDefault();held.add(b.dataset.direction);b.classList.add('held');};
   const release=()=>{held.delete(b.dataset.direction);b.classList.remove('held');};
   b.onpointerup=release;b.onpointercancel=release;b.onpointerleave=release;
   // Enter/Space can also make one deliberate step, without starting an endless hold.
   b.onclick=e=>{if(e.detail===0&&!paused){InterludeRules.update(run,.05,{[b.dataset.direction]:true});draw();}};
  });
  content.querySelector('#run-hide').onclick=e=>{const on=e.currentTarget.getAttribute('aria-pressed')!=='true';e.currentTarget.setAttribute('aria-pressed',String(on));};
  content.querySelector('#run-pause').onclick=pause;
  content.querySelector('#run-resume').onclick=()=>{paused=false;content.querySelector('#run-paused').hidden=true;content.querySelector('#run-canvas').tabIndex=0;clearInput();last=0;loop();content.querySelector('#run-canvas').focus();};
  updateHud();draw();loop();content.querySelector('#run-canvas').focus();
 }
 function pause(){
  if(phase!=='play'||!root.open)return;paused=true;stop();content.querySelector('#run-canvas').tabIndex=-1;const overlay=content.querySelector('#run-paused');overlay.hidden=false;content.querySelector('#run-resume').focus();
 }
 function updateHud(){
  for(const el of content.querySelectorAll('[data-found]'))el.textContent=run.collected.includes(el.dataset.found)?'✓':'–';
  const badge=content.querySelector('#run-undetected');if(badge)badge.textContent=run.detections===0?'Unentdeckt':'Schon entdeckt';
 }
 function loop(time){
  if(!root.open||phase!=='play'||paused||document.hidden)return;
  const dt=time&&last?Math.min((time-last)/1000,.05):0;last=time||0;
  const input=Object.fromEntries(['up','left','down','right'].map(d=>[d,held.has(d)||keyboard.has(d)]));input.hide=content.querySelector('#run-hide').getAttribute('aria-pressed')==='true';
  const events=InterludeRules.update(run,dt,input);
  if(events.length){updateHud();const status=content.querySelector('#run-message');if(events.includes('alarm')){clearInput();status.textContent='Entdeckt! Ihr kehrt gleich zum sicheren Bereich zurück. Eure Siegel bleiben erhalten.';}else if(events.includes('respawn'))status.textContent='Wieder im sicheren Bereich. Beobachtet erst die Patrouillen.';else if(events.includes('collect'))status.textContent='Reiseausrüstung gesichert. Ihr könnt weiter zum Tor.';else if(events.includes('checkpoint'))status.textContent='Ein neuer sicherer Rückkehrpunkt ist erreicht.';persist();}
  if(events.includes('goal')){stop();persist();result();return;}
  if(run.elapsed-lastSave>1){lastSave=run.elapsed;persist();}
  draw();raf=requestAnimationFrame(loop);
 }
 function draw(){
  const c=content.querySelector('#run-canvas');if(!c)return;const ctx=c.getContext('2d');ctx.imageSmoothingEnabled=false;ctx.clearRect(0,0,c.width,c.height);ctx.drawImage(art.images[P+'bg.webp'],0,0);
  // Ground markers are independent of the collision and sight geometry.
  const marker=(name,x,y,size)=>{const s=GameArt.entry(art,P+'route-markers.png',name),b=s.visible_bbox_xyxy;GameArt.draw(ctx,art,P+'route-markers.png',name,x,y,size/(b[2]-b[0]));};
  for(const [i,cp] of InterludeRules.checkpoints.entries())if(i>0)marker('safe-zone',cp.x,cp.y+20,70);
  marker('target',1380,215,52);
  for(const g of run.guards){ctx.beginPath();ctx.moveTo(g.x,g.y-12);for(let i=0;i<=24;i++){const end=InterludeRules.rayEnd({x:g.x,y:g.y-12},g.angle-Math.PI/5.5+i/24*Math.PI/2.75,InterludeRules.sightRange);ctx.lineTo(end.x,end.y);}ctx.closePath();ctx.fillStyle='rgba(170,119,39,.19)';ctx.fill();ctx.strokeStyle='rgba(103,66,25,.4)';ctx.lineWidth=2;ctx.stroke();}
  for(const item of InterludeRules.items)if(!run.collected.includes(item.id)){const s=GameArt.entry(art,P+'collectibles.png',item.id),b=s.visible_bbox_xyxy;GameArt.draw(ctx,art,P+'collectibles.png',item.id,item.x,item.y,53/(b[3]-b[1]));}
  const step=!reducedMotion.matches&&Math.floor(run.elapsed/.25)%2===1;
  const figures=run.guards.map(g=>({y:g.y,paint:()=>{let dir=Math.abs(Math.cos(g.angle))>Math.abs(Math.sin(g.angle))?(Math.cos(g.angle)>0?'east':'west'):(Math.sin(g.angle)>0?'south':'north');const frame=run.alarm>0&&InterludeRules.sees(g,run.player,run.player.hiding)?'alert':dir+'-'+(g.moving&&step?'step':'idle');GameArt.draw(ctx,art,P+'guards.png',frame,g.x,g.y,.29);}}));
  figures.push({y:460,paint:()=>GameArt.draw(ctx,art,P+'hideouts.png','amphora-stack',820,460,.18)});
  figures.push({y:run.player.y,paint:()=>{const p=run.player;GameArt.draw(ctx,art,P+'player.png',p.hiding?'hide':p.direction+'-'+(p.moving&&step?'step':'idle'),p.x,p.y,.29);if(run.immune>0){ctx.strokeStyle='#e1ca84';ctx.lineWidth=3;ctx.strokeRect(p.x-18,p.y-5,36,12);}}});
  figures.sort((a,b)=>a.y-b.y).forEach(f=>f.paint());
  GameArt.draw(ctx,art,P+'foreground.png','olive-shrub',1580,622,.18);
  if(run.alarm>0){const b=GameArt.entry(art,P+'alert-effects.png','alarm').visible_bbox_xyxy;GameArt.draw(ctx,art,P+'alert-effects.png','alarm',run.player.x,run.player.y-76,80/(b[2]-b[0]));}
 }
 function result(){
  phase='result';stop();
  content.innerHTML=`<div class="run-result art-panel"><img src="${P}result.png" alt="Ergebnistafel der Zwischenetappe"><h2>Geschafft – der Weg ist wieder frei.</h2>${[['map','Karte'],['provisions','Proviant'],['permit','Reisedokument'],['undetected','Unentdeckt']].map(([key,label],i)=>`<canvas class="run-result-icon" width="100" height="100" style="top:${[29,43,57,70][i]}%" aria-hidden="true"></canvas><p class="run-result-row" style="top:${[30,44,58,71][i]}%"><span>${label}</span><strong>${(key==='undetected'?run.detections===0:run.collected.includes(key))?'✓':'–'}</strong></p>`).join('')}<button id="run-done">Weiter zum Kontrollposten</button></div>`;
  content.querySelectorAll('.run-result-icon').forEach((canvas,i)=>paintIcon(canvas,i===3?'ui':'collectibles',['map','provisions','permit','undetected'][i]));
  content.querySelector('#run-done').onclick=()=>{
   const s=state();s.interludeCompleted=true;s.interludeStarted=true;s.interludeStats={collectibles:[...run.collected],undetected:run.detections===0};s.interludeRun=null;bridge().save();root.close();updateReplay();
  };
 }
 const map={ArrowUp:'up',w:'up',W:'up',ArrowDown:'down',s:'down',S:'down',ArrowLeft:'left',a:'left',A:'left',ArrowRight:'right',d:'right',D:'right'};
 window.addEventListener('keydown',e=>{if(root.open&&phase==='play'&&!paused&&map[e.key]){e.preventDefault();keyboard.add(map[e.key]);}});
 window.addEventListener('keyup',e=>{if(map[e.key])keyboard.delete(map[e.key]);});
 window.addEventListener('pointerup',()=>{held.clear();content.querySelectorAll('.held').forEach(b=>b.classList.remove('held'));});window.addEventListener('pointercancel',clearInput);
 window.addEventListener('blur',pause);document.addEventListener('visibilitychange',()=>{if(document.hidden)pause();});
 root.querySelector('#run-close').onclick=()=>root.close();
 root.addEventListener('close',()=>{stop();persist();epoch++;updateReplay();});
 document.querySelector('#interlude-replay').onclick=()=>open(state().interludeCompleted);
 window.addEventListener('adventure:state',()=>{updateReplay();if(!state().interludeStarted){stop();run=null;}requestAnimationFrame(auto);});
 document.querySelectorAll('dialog').forEach(d=>{if(d!==root)d.addEventListener('close',()=>requestAnimationFrame(auto));});
 requestAnimationFrame(auto);
 // Diagnostics expose the current simulation; all UI movement still uses the same update rules.
 window.Interlude=Object.freeze({open,getRun:()=>run,getPhase:()=>phase,isPaused:()=>paused});
})();
