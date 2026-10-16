'use strict';
const BonusPuzzleRules=(()=>{
 const motifs=[
  {id:'control-post',name:'Der Kontrollposten',width:1658,height:949},
  {id:'map-palestine',name:'Die Reise durch Palästina',width:1659,height:948},
  {id:'taxes-market',name:'Abgaben und Markt',width:1660,height:948},
  {id:'people-under-rome',name:'Menschen unter römischer Herrschaft',width:1659,height:948},
  {id:'road-galilee',name:'Der Weg nach Galiläa',width:1659,height:948}
 ].map(m=>({...m,path:'assets/bonus/puzzle-motifs/motif-'+m.id+'.webp'}));
 const solved=n=>Array.from({length:n*n},(_,i)=>i);
 const complete=tiles=>tiles.every((v,i)=>v===i);
 function neighbors(i,n){return [i%n>0?i-1:-1,i%n<n-1?i+1:-1,i>=n?i-n:-1,i<n*(n-1)?i+n:-1].filter(v=>v>=0);}
 function shuffle(n,mode,random=Math.random){
  const tiles=solved(n);
  if(mode==='slide'){
   let empty=n*n-1,previous=-1;
   for(let i=0;i<n*n*30;i++){
    const choices=neighbors(empty,n).filter(i=>i!==previous),next=choices[Math.floor(random()*choices.length)];
    [tiles[empty],tiles[next]]=[tiles[next],tiles[empty]];previous=empty;empty=next;
   }
   if(complete(tiles)){const next=neighbors(empty,n)[0];[tiles[empty],tiles[next]]=[tiles[next],tiles[empty]];}
  }else{
   for(let i=tiles.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[tiles[i],tiles[j]]=[tiles[j],tiles[i]];}
   if(complete(tiles))[tiles[0],tiles[1]]=[tiles[1],tiles[0]];
  }
  return tiles;
 }
 function bounds(i,n,w,h){const col=i%n,row=Math.floor(i/n),x=Math.round(col*w/n),y=Math.round(row*h/n);return {x,y,w:Math.round((col+1)*w/n)-x,h:Math.round((row+1)*h/n)-y};}
 function create(settings,random=Math.random){return {...settings,tiles:shuffle(settings.size,settings.mode,random),selected:null,done:false};}
 function choose(game,index){
  if(game.done||!Number.isInteger(index)||index<0||index>=game.tiles.length)return 'ignored';
  if(game.mode==='swap'){
   if(game.selected===index){game.selected=null;return 'deselected';}
   if(game.selected===null){game.selected=index;return 'selected';}
   const first=game.selected;[game.tiles[first],game.tiles[index]]=[game.tiles[index],game.tiles[first]];game.selected=null;
  }else{
   const empty=game.tiles.indexOf(game.size*game.size-1);
   if(!neighbors(empty,game.size).includes(index))return 'blocked';
   [game.tiles[empty],game.tiles[index]]=[game.tiles[index],game.tiles[empty]];
  }
  game.done=complete(game.tiles);return game.done?'complete':'moved';
 }
 function settings(raw){return {motif:motifs.some(m=>m.id===raw?.motif)?raw.motif:'control-post',mode:raw?.mode==='slide'?'slide':'swap',size:[3,4,5].includes(raw?.size)?raw.size:3};}
 return {motifs,solved,complete,neighbors,shuffle,bounds,create,choose,settings};
})();
if(typeof module!=='undefined')module.exports=BonusPuzzleRules;
if(typeof window!=='undefined')window.BonusPuzzleRules=BonusPuzzleRules;

if(typeof window!=='undefined')(()=>{
 const dialog=document.querySelector('#bonus'),body=dialog.querySelector('.bonus-puzzle-content');
 const U='assets/bonus/puzzle-ui/',paths=[...BonusPuzzleRules.motifs.map(m=>m.path),...['puzzle-selection-panel.png','puzzle-frame.png','puzzle-complete.png','tile-selected.png','tile-swap-hint.png','empty-tile.png','mode-icons.png'].map(f=>U+f)];
 let art=null,game=null,phase='selection',timer=0,token=0,settings=BonusPuzzleRules.settings();
 const state=()=>window.Adventure.getState();
 function saveSettings(){state().bonusSettings={...settings};window.Adventure.save();}
 function unlocked(){return state().solved.every(Boolean);}
 async function open(){
  if(!unlocked())return;
  const id=++token;if(!dialog.open)dialog.showModal();
  if(art&&game&&phase==='play'){board();return;}
  body.innerHTML='<p role="status">Die Puzzlemotive werden bereitgelegt …</p>';
  try{art=await GameArt.prepare(paths);if(id!==token||!dialog.open)return;settings=BonusPuzzleRules.settings(state().bonusSettings);selection();}
  catch{if(id!==token)return;body.innerHTML='<p role="alert">Die Motive konnten nicht geladen werden. Euer Spielfortschritt bleibt erhalten.</p><button id="bonus-retry">Erneut laden</button>';body.querySelector('#bonus-retry').onclick=open;}
 }
 function selection(){
  phase='selection';clearTimeout(timer);settings=BonusPuzzleRules.settings(settings);
  const slots=[[11.5,22.7,23.7,19.3],[38.3,22.7,23.7,19.3],[65.2,22.7,23.7,19.3],[23.1,46.7,25.3,19.5],[52.1,46.7,25.3,19.5]];
  body.innerHTML=`<div class="bonus-selection art-panel"><img class="bonus-selection-art" src="${U}puzzle-selection-panel.png" alt="Historisches Auswahlbrett"><h3>Wählt euer Puzzlemotiv</h3><div class="motif-choices">${BonusPuzzleRules.motifs.map((m,i)=>`<button data-motif="${m.id}" aria-pressed="${settings.motif===m.id}" style="left:${slots[i][0]}%;top:${slots[i][1]}%;width:${slots[i][2]}%;height:${slots[i][3]}%"><img src="${m.path}" alt="Vorschau: ${m.name}"><span>${m.name}</span><strong class="motif-selected" ${settings.motif===m.id?'':'hidden'}>✓</strong></button>`).join('')}</div><div class="mode-choices" role="group" aria-label="Puzzlemodus">${[['swap','Einfach – Tauschen','easy-swap'],['slide','Klassisch – Schieben','classic-slide']].map(([mode,name,icon])=>`<button data-mode="${mode}" aria-pressed="${settings.mode===mode}"><canvas width="48" height="40" data-mode-icon="${icon}" aria-hidden="true"></canvas><span>${name}</span></button>`).join('')}</div><div class="size-choices" role="group" aria-label="Puzzlegröße">${[3,4,5].map((n,i)=>`<button data-size="${n}" aria-label="${n} mal ${n} – ${['Schnell','Normal','Knifflig'][i]}" aria-pressed="${settings.size===n}">${n}×${n}</button>`).join('')}</div></div><div class="bonus-selection-footer"><p id="bonus-choice-summary" role="status">${summary()} · Beide Spielmodi sind gleichwertig.</p><button id="bonus-begin">Puzzle beginnen</button></div>`;
  body.querySelectorAll('[data-mode-icon]').forEach(c=>GameArt.icon(c,art,U+'mode-icons.png',c.dataset.modeIcon));
  body.querySelector('#bonus-begin').onclick=()=>{saveSettings();game=BonusPuzzleRules.create(settings);board();};
 }
 function summary(){const m=BonusPuzzleRules.motifs.find(m=>m.id===settings.motif);return `${m.name} · ${settings.mode==='swap'?'Einfach – Tauschen':'Klassisch – Schieben'} · ${settings.size}×${settings.size} – ${['Schnell','Normal','Knifflig'][settings.size-3]}`;}
 function board(){
  phase='play';clearTimeout(timer);
  const m=BonusPuzzleRules.motifs.find(m=>m.id===game.motif),image=art.images[m.path],w=image.naturalWidth,h=image.naturalHeight;
  body.innerHTML=`<div class="bonus-toolbar"><button id="bonus-change">Motiv / Modus / Größe</button><span>${m.name} · ${game.size}×${game.size}</span><label><input id="bonus-numbers" type="checkbox"> Nummern zeigen</label></div><p id="bonus-play-message" role="status">${game.mode==='swap'?(game.selected===null?'Tippt ein Bildteil und danach ein beliebiges zweites an.':'Wähle jetzt das Bildteil, mit dem du tauschen möchtest.'):'Nur ein Teil direkt neben der freien Stelle kann hineinrutschen.'}</p><div class="puzzle-frame"><img class="puzzle-frame-art" src="${U}puzzle-frame.png" alt=""><div class="puzzle-opening"><div class="puzzle-board" style="--motif-ratio:${w}/${h}"><canvas id="puzzle-canvas" width="${w}" height="${h}" aria-hidden="true"></canvas><div id="puzzle-targets" role="group" aria-label="Puzzleteile"></div></div></div></div>`;
  body.querySelector('#bonus-change').onclick=selection;
  body.querySelector('#bonus-numbers').onchange=e=>body.querySelector('#puzzle-targets').classList.toggle('show-numbers',e.target.checked);
  renderTiles();paint();
 }
 function renderTiles(){
  const image=art.images[BonusPuzzleRules.motifs.find(m=>m.id===game.motif).path],w=image.naturalWidth,h=image.naturalHeight;
  body.querySelector('#puzzle-targets').innerHTML=game.tiles.map((value,i)=>{
   const r=BonusPuzzleRules.bounds(i,game.size,w,h),style=`left:${r.x/w*100}%;top:${r.y/h*100}%;width:${r.w/w*100}%;height:${r.h/h*100}%`;
   if(game.mode==='slide'&&value===game.size*game.size-1&&!game.done)return `<div class="puzzle-gap" style="${style}" role="img" aria-label="Freie Stelle, Reihe ${Math.floor(i/game.size)+1}, Spalte ${i%game.size+1}"></div>`;
   return `<button class="puzzle-target" data-tile="${i}" style="${style}" aria-label="Puzzleteil ${value+1} von ${game.tiles.length}, Reihe ${Math.floor(i/game.size)+1}, Spalte ${i%game.size+1}" aria-pressed="${game.selected===i}"><span>${value+1}</span>${game.selected===i?'<strong>Gewählt</strong>':''}</button>`;
  }).join('');
 }
 function paint(hintIndex=null){
  const canvas=body.querySelector('#puzzle-canvas');if(!canvas)return;
  const ctx=canvas.getContext('2d'),w=canvas.width,h=canvas.height,m=BonusPuzzleRules.motifs.find(m=>m.id===game.motif),image=art.images[m.path];
  ctx.clearRect(0,0,w,h);
  if(game.done){ctx.drawImage(image,0,0,w,h);return;}
  const overlay=(file,r)=>{const qa=art.qa.find(a=>a.path===U+file);GameArt.nineSlice(ctx,art.images[U+file],qa.visible_bbox,r,22);};
  game.tiles.forEach((value,i)=>{
   const dest=BonusPuzzleRules.bounds(i,game.size,w,h);
   if(game.mode==='slide'&&value===game.size*game.size-1){overlay('empty-tile.png',dest);return;}
   const source=BonusPuzzleRules.bounds(value,game.size,w,h);ctx.drawImage(image,source.x,source.y,source.w,source.h,dest.x,dest.y,dest.w,dest.h);
   ctx.strokeStyle='rgba(60,37,15,.7)';ctx.lineWidth=2;ctx.strokeRect(dest.x+1,dest.y+1,dest.w-2,dest.h-2);
   if(game.selected===i)overlay('tile-selected.png',dest);if(hintIndex===i)overlay('tile-swap-hint.png',dest);
  });
 }
 function success(){
  const id=`${game.motif}:${game.mode}:${game.size}`;state().bonusCompleted ||= [];if(!state().bonusCompleted.includes(id))state().bonusCompleted.push(id);window.Adventure.save();
  // The solved original appears without tile seams before the quiet result panel.
  const wait=matchMedia('(prefers-reduced-motion: reduce)').matches?0:650;
  body.querySelector('#bonus-play-message').textContent='Motiv geschafft!';body.querySelectorAll('[data-tile]').forEach(b=>b.disabled=true);
  timer=setTimeout(()=>{if(!dialog.open||!game?.done)return;phase='result';body.innerHTML=`<div class="bonus-complete art-panel"><img src="${U}puzzle-complete.png" alt="Historische Erfolgstafel"><div class="bonus-complete-copy"><h3>Motiv geschafft!</h3><p>${summary()}</p></div><button id="bonus-again">Noch einmal</button><button id="bonus-other">Anderes Motiv</button></div>`;body.querySelector('#bonus-again').onclick=()=>{game=BonusPuzzleRules.create(settings);board();};body.querySelector('#bonus-other').onclick=selection;body.querySelector('#bonus-again').focus();},wait);
 }
 body.onclick=e=>{
  const button=e.target.closest('button');if(!button)return;
  if(button.dataset.motif){settings.motif=button.dataset.motif;saveSettings();selection();body.querySelector(`[data-motif="${settings.motif}"]`).focus({preventScroll:true});}
  else if(button.dataset.mode){settings.mode=button.dataset.mode;saveSettings();selection();body.querySelector(`[data-mode="${settings.mode}"]`).focus({preventScroll:true});}
  else if(button.dataset.size){settings.size=Number(button.dataset.size);saveSettings();selection();body.querySelector(`[data-size="${settings.size}"]`).focus({preventScroll:true});}
  else if(button.dataset.tile!==undefined){
   const index=Number(button.dataset.tile),result=BonusPuzzleRules.choose(game,index),status=body.querySelector('#bonus-play-message');
   status.textContent={selected:'Wähle jetzt das Bildteil, mit dem du tauschen möchtest.',deselected:'Auswahl aufgehoben. Wählt ein erstes Bildteil.',blocked:'Dieses Teil grenzt nicht an die freie Stelle. Wählt ein Teil direkt daneben.',moved:game.mode==='swap'?'Die beiden Bildteile wurden getauscht.':'Das Bildteil ist in die freie Stelle gerutscht.',complete:'Motiv geschafft!'}[result]||status.textContent;
   renderTiles();paint(result==='moved'&&game.mode==='swap'?index:null);body.querySelector(`[data-tile="${index}"]`)?.focus({preventScroll:true});
   clearTimeout(timer);if(result==='complete')success();else if(result==='moved')timer=setTimeout(()=>{if(phase==='play')paint();},350);
  }
 };
 dialog.querySelector('#bonus-close').onclick=()=>dialog.close();
 dialog.addEventListener('close',()=>{token++;clearTimeout(timer);if(game?.done){phase='selection';game=null;}});
 document.querySelector('#bonus-open').onclick=open;
 document.querySelector('#finale-bonus').onclick=()=>{document.querySelector('#finale').close();open();};
 function sync(){const b=document.querySelector('#bonus-open');b.hidden=!unlocked();if(!state().solved.some(Boolean)){game=null;phase='selection';settings=BonusPuzzleRules.settings(state().bonusSettings);}}
 window.addEventListener('adventure:state',sync);sync();
 window.BonusPuzzle=Object.freeze({open,getGame:()=>game,getPhase:()=>phase});
})();
