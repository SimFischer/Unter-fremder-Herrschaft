'use strict';
/* Freiwilliges Merkspiel „Der Weg des Boten“ – gleiches Prinzip wie „Das geheime Zeichen“ (im-zeichen-der-wende):
   Der Bote zeigt eine Folge von Zeichen, die Spielenden wiederholen sie; nach jeder Runde kommt ein Zeichen dazu. */
const BoteRules=(()=>{
 const ids=['scroll','amphora','sandal','seal'],names=['Schriftrolle','Amphore','Sandale','Kontrollstempel'];
 const SHOW=.75,GAP=.3,LEAD=.6,PRESS=.3,SUCCESS=1;
 function create(random=Math.random){
  const s={sequence:[],index:0,phase:'idle',active:-1,remaining:0,step:0,completed:0,elapsed:0};
  function next(){
   // The same sign appears at most twice in a row.
   const n=s.sequence.length,blocked=n>1&&s.sequence[n-1]===s.sequence[n-2]?s.sequence[n-1]:-1;
   const choices=[0,1,2,3].filter(i=>i!==blocked);
   s.sequence.push(choices[Math.min(choices.length-1,Math.max(0,Math.floor(random()*choices.length)))]);
   s.phase='playback';s.step=-1;s.index=0;s.active=-1;s.remaining=LEAD;
  }
  function start(){if(s.phase==='idle')next();}
  function input(i){
   if(s.phase!=='input'||!Number.isInteger(i)||i<0||i>3)return false;
   s.active=i;s.remaining=PRESS;
   if(i!==s.sequence[s.index]){s.phase='ended';return false;}
   s.index++;if(s.index===s.sequence.length){s.completed=s.sequence.length;s.phase='success';s.remaining=SUCCESS;}
   return true;
  }
  function tick(dt){
   if(s.phase==='idle'||s.phase==='ended')return;
   dt=Math.max(0,Math.min(dt,.1));s.elapsed+=dt;s.remaining-=dt;if(s.remaining>0)return;
   if(s.phase==='playback'){
    s.step++;
    if(s.step>=s.sequence.length*2){s.phase='input';s.active=-1;}
    else{s.active=s.step%2===0?s.sequence[s.step/2]:-1;s.remaining=s.active<0?GAP:SHOW;}
   }
   else if(s.phase==='success')next();
   else s.active=-1;
  }
  return {s,start,input,tick};
 }
 const time=seconds=>`${String(Math.floor(seconds/60)).padStart(2,'0')}:${String(Math.floor(seconds%60)).padStart(2,'0')}`;
 return {ids,names,create,time,SHOW,GAP};
})();
if(typeof module!=='undefined')module.exports=BoteRules;
if(typeof window!=='undefined')window.BoteRules=BoteRules;

if(typeof window!=='undefined')(()=>{
 const dialog=document.querySelector('#bote'),body=dialog.querySelector('.bote-content');
 const B='assets/bonus/bote/',paths=[B+'bote-board.png',B+'bote-symbols.png',B+'bote-active.png',B+'bote-result.png',B+'bote-record-seal.png'];
 let art=null,model=null,raf=0,last=0,token=0,initialBest=0,lastKey='',resultTimer=0;
 const state=()=>window.Adventure.getState();
 const unlocked=()=>state().solved.every(Boolean);
 const best=()=>state().boteBest||0;
 function stop(){cancelAnimationFrame(raf);raf=0;last=0;clearTimeout(resultTimer);}
 async function open(){
  if(!unlocked())return;const id=++token;if(!dialog.open)dialog.showModal();
  body.innerHTML='<p role="status">Der Bote macht sich bereit …</p>';
  try{art=await GameArt.prepare(paths);if(id!==token||!dialog.open)return;intro();}
  catch{if(id!==token)return;body.innerHTML='<p role="alert">Das Spielbrett konnte nicht geladen werden.</p><button id="bote-retry">Erneut laden</button>';body.querySelector('#bote-retry').onclick=open;}
 }
 function intro(){
  stop();model=null;
  body.innerHTML=`<div class="bote-intro"><div class="bote-board bote-intro-board" aria-hidden="true"><img class="bote-board-art" src="${B}bote-board.png" alt="">${BoteRules.ids.map((_,i)=>`<span class="bote-field bote-field-${i}"><canvas width="300" height="300"></canvas></span>`).join('')}</div><div><h3>Eine Botschaft für Galiläa</h3><p>Ein Bote trägt eine Nachricht durch das Land. An jeder Station zeigt er seine Zeichen in einer festen Reihenfolge: Schriftrolle, Amphore, Sandale oder Kontrollstempel.</p><p>Merkt euch die Folge und tippt sie danach nach. Nach jeder geschafften Runde kommt ein Zeichen hinzu. Ein Fehler beendet den Durchlauf.</p><p class="bote-best-line">Eure Bestleistung: ${best()} Zeichen</p><button id="bote-start" class="bote-primary">Dem Boten folgen</button></div></div>`;
  body.querySelectorAll('.bote-intro-board canvas').forEach((c,i)=>GameArt.icon(c,art,B+'bote-symbols.png',BoteRules.ids[i]));
  body.querySelector('#bote-start').onclick=play;body.querySelector('#bote-start').focus({preventScroll:true});
 }
 function play(){
  stop();model=BoteRules.create();initialBest=best();lastKey='';
  body.innerHTML=`<div class="bote-game"><div class="bote-board"><img class="bote-board-art" src="${B}bote-board.png" alt="Spielbrett mit vier Feldern: Schriftrolle oben links, Amphore oben rechts, Sandale unten links, Kontrollstempel unten rechts" draggable="false">${BoteRules.ids.map((id,i)=>`<button type="button" class="bote-field bote-field-${i}" data-field="${i}" data-state="normal" aria-label="${BoteRules.names[i]}" disabled><img class="bote-glow" src="${B}bote-active.png" alt="" draggable="false"><canvas width="300" height="300" aria-hidden="true"></canvas><span class="bote-key" aria-hidden="true">${i+1}</span></button>`).join('')}</div>
<div class="bote-panel"><p class="bote-kicker">Unterwegs mit dem Boten</p><h3 class="bote-round">Folge: 1 Zeichen</h3><div class="bote-stats"><p class="bote-series"></p><p class="bote-time"></p><p class="bote-record"></p></div><p class="bote-status" role="status" aria-live="polite"></p><p class="bote-record-notice" role="status"></p><p class="bote-hint">Erst die Zeichen ansehen.<br>Dann die Folge nachtippen. Tastatur: 1–4.</p></div></div>`;
  body.querySelectorAll('.bote-field canvas').forEach((c,i)=>GameArt.icon(c,art,B+'bote-symbols.png',BoteRules.ids[i]));
  body.querySelectorAll('[data-field]').forEach(b=>b.onclick=()=>press(Number(b.dataset.field)));
  model.start();render();loop();
 }
 function press(i){
  if(!model||model.s.phase!=='input')return;model.input(i);render();
  if(model.s.phase==='ended'){clearTimeout(resultTimer);resultTimer=setTimeout(result,matchMedia('(prefers-reduced-motion: reduce)').matches?500:1300);}
 }
 // Painted result board (docs/asset-update-2): every value sits in its own free field.
 function result(){
  if(!dialog.open||!model||model.s.phase!=='ended')return;const s=model.s,record=s.completed>initialBest;
  body.innerHTML=`<div class="bote-result art-panel"><img src="${B}bote-result.png" alt="Ergebnistafel des Boten"><h3 class="bote-r-title">Durchlauf beendet</h3>${record?`<img class="bote-r-seal" src="${B}bote-record-seal.png" alt="Siegel: Neue Bestleistung">`:''}<p class="bote-r-value bote-r-1 bote-result-score">Serie: ${s.completed} Zeichen</p><p class="bote-r-value bote-r-2">Zeit: ${BoteRules.time(s.elapsed)}</p><p class="bote-r-value bote-r-3">Bestleistung: ${best()} Zeichen</p><p class="bote-r-hint" role="status">${record?'Neue Bestleistung! ':''}Richtig wäre gewesen: ${BoteRules.names[s.sequence[s.index]]}.</p><button type="button" class="bote-r-retry bote-restart">Noch einmal</button><button type="button" class="bote-r-back bote-back">Zurück zur Reise</button></div>`;
  body.querySelector('.bote-restart').onclick=play;body.querySelector('.bote-back').onclick=()=>dialog.close();
  body.querySelector('.bote-restart').focus({preventScroll:true});
 }
 function render(){
  const s=model.s;
  if(s.completed>best()){state().boteBest=s.completed;window.Adventure.save();}
  const key=[s.phase,s.active,s.index,s.sequence.length,s.completed,Math.floor(s.elapsed)].join();if(key===lastKey)return;lastKey=key;
  const root=body.querySelector('.bote-game');if(!root)return;root.dataset.phase=s.phase;
  root.querySelector('.bote-round').textContent=`Folge: ${s.sequence.length||1} Zeichen`;
  root.querySelector('.bote-series').textContent=`Serie: ${s.completed} Zeichen`;
  root.querySelector('.bote-time').textContent=`Zeit: ${BoteRules.time(s.elapsed)}`;
  root.querySelector('.bote-record').textContent=`Bestleistung: ${best()} Zeichen`;
  root.querySelector('.bote-record-notice').textContent=s.completed>initialBest&&(s.phase==='success'||s.phase==='ended')?'Neue Bestleistung!':'';
  root.querySelector('.bote-status').textContent=s.phase==='ended'?`Das war nicht die Folge des Boten. Richtig wäre gewesen: ${BoteRules.names[s.sequence[s.index]]}.`:s.phase==='success'?'Richtig! Der Bote zeigt ein weiteres Zeichen.':s.phase==='input'?`Ihr seid dran · ${s.index} von ${s.sequence.length}`:'Schaut genau hin …';
  root.querySelector('.bote-hint').hidden=s.phase==='ended';
  root.querySelectorAll('[data-field]').forEach((b,i)=>{b.disabled=s.phase!=='input';b.dataset.state=s.active===i?(s.phase==='ended'?'error':'active'):'normal';});
 }
 function loop(time){
  if(!dialog.open||!model)return;
  const dt=time&&last?Math.min((time-last)/1000,.1):0;last=time||0;
  model.tick(dt);render();
  if(model.s.phase==='ended'){raf=0;return;}
  raf=requestAnimationFrame(loop);
 }
 window.addEventListener('keydown',e=>{if(dialog.open&&model?.s.phase==='input'&&/^[1-4]$/.test(e.key)){e.preventDefault();press(Number(e.key)-1);}});
 document.addEventListener('visibilitychange',()=>{if(!document.hidden&&dialog.open&&model&&model.s.phase!=='ended'&&!raf){last=0;loop();}});
 dialog.querySelector('#bote-close').onclick=()=>dialog.close();
 dialog.addEventListener('close',()=>{token++;stop();model=null;body.innerHTML='';});
 document.querySelector('#bote-open').onclick=open;
 document.querySelector('#finale-bote').onclick=()=>{document.querySelector('#finale').close();open();};
 function sync(){document.querySelector('#bote-open').hidden=!unlocked();document.querySelector('#finale-bote').hidden=!unlocked();}
 window.addEventListener('adventure:state',sync);sync();
 window.Bote=Object.freeze({open,getModel:()=>model});
})();
