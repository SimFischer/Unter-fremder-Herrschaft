'use strict';
const $=s=>document.querySelector(s),KEY='palaestina-adventure-klasse6-v2';
const fresh=()=>({version:1,solved:Array(5).fill(false),answers:Array.from({length:5},()=>({})),attempts:Array(5).fill(0)});
let state=fresh(),active=0,pending=null,opener=null,views=Array(5).fill(0),awaitingNext=false;
try{const saved=JSON.parse(localStorage.getItem(KEY));if(saved?.version===1&&Array.isArray(saved.solved)&&saved.solved.length===5&&saved.answers?.length===5&&saved.attempts?.length===5)state=saved;}catch{ }
function save(){try{localStorage.setItem(KEY,JSON.stringify(state));}catch{$('#storage-note').textContent='Der Browser kann den Fortschritt nicht speichern. Die App funktioniert für diese Sitzung weiter.';}}
function esc(t){return String(t).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}

function options(key,items){
 const shift=[...key].reduce((n,c)=>n+c.charCodeAt(0),0)%items.length;
 const order=items.map((_,i)=>(i+shift)%items.length);
 return `<div class="options">${order.map((i,j)=>`<button class="option ${state.answers[active][key]===i?'selected':''}" data-key="${key}" data-value="${i}" aria-pressed="${state.answers[active][key]===i}"><span class="choice-letter" aria-hidden="true">${String.fromCharCode(65+j)}</span><span>${esc(items[i])}</span>${state.answers[active][key]===i?'<span class="choice-state">Gewählt</span>':''}</button>`).join('')}</div>`;
}
function mission(title,text){return `<div class="mission"><span class="eyebrow">EUER AUFTRAG</span><h3>${title}</h3><p>${text}</p></div>`;}
function portrait(i){return i===3?'<div class="voice-portrait guard"><img src="roman-guard.webp" alt="Marcus, römischer Soldat"></div>':`<div class="voice-portrait people person-${i}"><img src="group-people.webp" alt="${esc(PEOPLE[i][0])}"></div>`;}
function scene(){const count=state.solved.filter(Boolean).length;$('#hotspots').innerHTML=PUZZLES.map((p,i)=>`<button class="hotspot ${state.solved[i]?'done':''}" style="left:${p.pos[0]}%;top:${p.pos[1]}%" data-open="${i}" aria-label="${p.object}: ${state.solved[i]?'gelöst':'ungelöst'}"><span class="tag-seal" aria-hidden="true"><img src="seal-${state.solved[i]?'open':'closed'}.webp" alt="">${state.solved[i]?'':`<span>${i+1}</span>`}</span><span class="tag-label">${p.object}</span></button>`).join('');$('#seals').innerHTML=state.solved.map((v,i)=>`<img class="seal" src="seal-${v?'open':'closed'}.webp" alt="Siegel ${i+1}: ${v?'offen':'geschlossen'}">`).join('');$('#progress').textContent=count===5?'Alle fünf Siegel sind geöffnet.':`${count} von 5 Siegeln geöffnet` ;$('#backdrop').src=`control-post${count===5?'-open':''}.webp`;$('#end').hidden=count!==5;requestAnimationFrame(positionMarkers);}

function open(i){
 active=i;pending=null;awaitingNext=false;opener=document.activeElement;
 views[i]=state.solved[i]?0:Math.min(state.answers[i].stage||0,TOTALS[i]-1);
 $('#chapter').textContent=`SIEGEL ${i+1} · ${PUZZLES[i].object}`;$('#title').textContent=BRIEFS[i][0];
 $('#knowledge-text').innerHTML=PUZZLES[i].knowledge.map(k=>`<p><strong>${KNOWLEDGE[k][0]}.</strong> ${KNOWLEDGE[k][1]}</p>`).join('');
 $('#knowledge').open=false;$('#feedback').textContent='';$('#feedback').className='';
 render();$('#puzzle').showModal();$('#puzzle .scroll').scrollTop=0;
}
function render(){
 const a=state.answers[active],round=views[active],total=TOTALS[active],unlocked=Math.min(a.stage||0,total-1);
 let html='';
 if(active===0&&round===0){
  const pairs=a.pairs||{};
  html=mission('Welche Folge passt?','Tippt links auf einen Eingriff Roms und rechts auf seine wichtigste Folge. Ihr könnt Verbindungen wieder ändern.');
  html+=`<div class="match-board"><div class="board-labels"><span>Rom greift ein</span><span>Das verändert sich</span></div><div class="columns"><div class="stack">${LEFT.map((t,i)=>`<button class="card ${pending===i?'selected':''} ${pairs[i]!==undefined?'connected':''}" data-left="${i}" aria-pressed="${pending===i}"><span class="card-pin">${i+1}</span><span>${t}${pairs[i]!==undefined?`<small class="connection">Verbunden mit ${String.fromCharCode(65+pairs[i])}</small>`:''}</span></button>`).join('')}</div><div class="stack">${[3,0,4,2,1].map(i=>`<button class="card ${Object.values(pairs).includes(i)?'connected':''}" data-right="${i}"><span class="card-pin">${String.fromCharCode(65+i)}</span><span>${RIGHT[i]}</span></button>`).join('')}</div></div></div><p class="selection-note">${Object.keys(pairs).length} von 5 Verbindungen gelegt${pending!==null?' · Wählt jetzt eine Folge rechts.':''}</p>`;
 }
 if(active===0&&round>0){
  const c=CHAINS[round-1],key='chain'+(round-1),chosen=a[key]||[];
  html=mission(c.start,'Legt drei Zettel in eine sinnvolle Reihenfolge: Was geschieht zuerst? Was folgt daraus? Ein Zettel passt nicht in die Kette.');
  html+=`<div class="chain-path">${[0,1,2].map((_,i)=>`<div class="chain-slot ${chosen[i]!==undefined?'filled':''}"><span>${['Eingriff / Ausgangslage','Direkte Folge','Erfahrung der Menschen'][i]}</span><strong>${chosen[i]!==undefined?c.tiles[chosen[i]]:'Zettel '+(i+1)+' hier ablegen'}</strong></div>`).join('')}</div><div class="tile-bank">${c.tiles.map((t,i)=>`<button class="order-tile ${chosen.includes(i)?'selected':''}" data-order="${key}" data-value="${i}" aria-pressed="${chosen.includes(i)}">${chosen.includes(i)?`<span class="tile-number">${chosen.indexOf(i)+1}</span>`:''}${t}</button>`).join('')}</div><button class="paper-quiet" data-order-reset="${key}">Kette neu legen</button><p class="selection-note">Antippen legt den Zettel ab. Noch einmal antippen nimmt ihn zurück.</p>`;
 }
 if(active===1&&round===0){
  const marked=a.marked||[];
  html=mission('Welche drei Einträge sind verdreht?','Lest die Akte wie Spurensucher. Markiert genau drei Aussagen, die fachlich nicht stimmen. Danach berichtigt ihr sie.');
  html+=`<div class="dossier"><div class="document-caption"><strong>KONTROLLAKTE</strong><span>Abschrift vom Kontrollposten</span></div>${STATEMENTS.map((t,i)=>`<button class="record ${marked.includes(i)?'selected':''}" data-mark="${i}" aria-pressed="${marked.includes(i)}"><span class="record-number">${String(i+1).padStart(2,'0')}</span><span>${t}</span><span class="record-box" aria-hidden="true">${marked.includes(i)?'×':''}</span></button>`).join('')}</div><p class="selection-note">${marked.length} von 3 Einträgen markiert</p>`;
 }
 if(active===1&&round>0){
  const i=[0,3,5][round-1];
  html=mission('Repariert den Eintrag','Welcher neue Satz behebt den Fehler genau? Prüft auch die kleinen Unterschiede.');
  html+=`<div class="torn-note"><span class="stamp">ZU BERICHTIGEN</span><p>${STATEMENTS[i]}</p></div>${options('correct'+i,CORRECTIONS[i].options)}`;
 }
 if(active===2&&round<4){
  const p=PEOPLE[round];
  html=`<div class="voice-scene">${portrait(round)}<div class="speech"><span class="eyebrow">STIMME ${round+1} VON 4</span><h3>${p[0]}</h3><blockquote>„${p[1]}“</blockquote></div></div>`;
  html+=`<div class="voice-choice"><h4>1 · Welche Haltung zeigt diese Stimme?</h4>${options('att'+round,ATTITUDES)}<h4>2 · Welche Begründung passt genau dazu?</h4>${options('reason'+round,REASONS)}</div>`;
 }
 if(active===2&&round===4){
  html=mission('Was könnt ihr aus den Stimmen schließen?','Vier Menschen – vier unterschiedliche Wege. Welche Aussage wird durch ihre Stimmen gestützt?');
  html+=`<div class="voice-strip">${PEOPLE.map((p,i)=>`<div>${portrait(i)}<strong>${p[0].split(' · ')[0]}</strong></div>`).join('')}</div>${options('overall',OVERALL)}`;
 }
 if(active===3){
  html=`<div class="map-layout"><div class="map"><img src="palestine-map.webp" alt="Gezeichnete Karte Palästinas mit Galiläa, Samaria, Judäa, Jordan und Städten">${PLACES.map((p,i)=>`<button data-place="${i}" style="left:${p[1]}%;top:${p[2]}%" class="${a['place'+round]===i?'selected':''}">${p[0]}</button>`).join('')}</div><div class="travel-note">`;
  if(round<6)html+=`<span class="stamp">REISEHINWEIS ${round+1}</span><h3>Findet die Spur auf der Karte</h3><p class="question">${CLUES[round][0]}</p><p class="selection-note">${a['place'+round]!==undefined?'Eure Wahl: '+PLACES[a['place'+round]][0]:'Tippt auf den passenden Namen auf der Karte.'}</p>`;
  else html+=`<span class="stamp">DIE REISE GEHT WEITER</span><h3>${TRANSFER[round-6].question}</h3>${options('transfer'+(round-6),TRANSFER[round-6].options)}`;
  html+='</div></div>';
 }
 if(active===4&&round===0){
  const marked=a.marked||[];
  html=mission('Sichert vier Belege','Markiert die vier Abschnitte, die zeigen, wie Rom das Leben der Menschen prägte. Die Ortsangabe am Anfang beschreibt nur, wo die Geschichte beginnt.');
  html+=`<div class="report-paper"><div class="document-caption"><strong>ZACHARIAS’ REISEBERICHT</strong><span>Beobachtungen auf dem Heimweg</span></div>${REPORT.map((t,i)=>`<button class="passage ${marked.includes(i)?'selected':''}" data-mark="${i}" aria-pressed="${marked.includes(i)}"><span class="record-number">${i+1}</span><span>${t}</span>${marked.includes(i)?'<span class="evidence-stamp">Beleg gesichert</span>':''}</button>`).join('')}</div><p class="selection-note">${marked.length} von 4 Belegen markiert</p>`;
 }
 if(active===4&&round>0&&round<5){
  const e=EVIDENCE[round-1];
  html=`<div class="evidence-note"><span class="stamp">BELEG ${round} VON 4</span><blockquote>„${REPORT[e.fragment]}“</blockquote></div>${mission(e.question,'Ordnet den Beleg nach dem Schwerpunkt dieser Frage ein.')}${options('category'+e.fragment,CATEGORIES)}`;
 }
 if(active===4&&round===5){
  html=mission('Euer Satz öffnet das letzte Siegel','Erklärt in ein oder zwei Sätzen: Warum war die römische Herrschaft für viele Menschen belastend? Verbindet mindestens zwei Beobachtungen.');
  html+=`<div class="writing-paper"><div class="word-bank"><span>Herrscher</span><span>Abgaben</span><span>Kontrolle</span><span>unterschiedliche Reaktionen</span></div><label for="sentence">Eure Erklärung</label><textarea id="sentence" placeholder="Für viele Menschen war die Herrschaft belastend, weil …">${esc(a.sentence||'')}</textarea><small>Mindestens 40 Zeichen. Euer Inhalt wird nicht automatisch benotet. Vergleicht ihn danach mit der Musterlösung.</small></div>${state.solved[4]?`<details class="model"><summary>Musterlösung ansehen und vergleichen</summary><p>${MODEL}</p></details>`:''}`;
 }
 const art=['objects/edict-board','objects/coin-table','characters/group-people','objects/map-table','objects/report-scroll'][active];
 const banner=`<div class="artifact-banner theme-${active}"><img src="${art.split("/").pop()}.webp" alt="${PUZZLES[active].object}"><div><span class="eyebrow">${['ZETTEL VERBINDEN & KETTEN LEGEN','FEHLER ENTDECKEN & BERICHTIGEN','STIMMEN DEUTEN & VERGLEICHEN','SPUREN FINDEN & WEITERDENKEN','BELEGE SICHERN & ERKLÄREN'][active]}</span><p>${BRIEFS[active][1]}</p></div></div>`;
 const nav=`<nav class="round-nav" aria-label="Rätselschritte">${Array.from({length:total},(_,i)=>`<button data-round="${i}" ${i>unlocked&&!state.solved[active]?'disabled':''} class="${i===round?'current':''} ${i<(a.stage||0)?'complete':''}" aria-label="Schritt ${i+1}${i<(a.stage||0)?', geschafft':''}" ${i===round?'aria-current="step"':''}>${i+1}</button>`).join('')}<span>Schritt ${round+1} von ${total}</span></nav>`;
 $('#task').innerHTML=banner+nav+`<div class="exercise-body exercise-${active}">${html}</div>`;
 $('#solved').textContent=state.solved[active]?'Siegel offen · ihr könnt weiter nachlesen':'';
 $('#check').textContent=awaitingNext?(round===total-1?'Zur Szene':'Weiter →'):'Diesen Schritt prüfen';
}
function failure(message='Da passt noch etwas nicht. Prüft eure Auswahl noch einmal. „Wissen nachlesen“ kann euch helfen.'){
 state.attempts[active]++;save();$('#feedback').className='needs-help';
 $('#feedback').textContent=message+(state.attempts[active]>=2?' Tipp: '+PUZZLES[active].hint:'');
}
function check(){
 const a=state.answers[active],round=views[active];
 if(awaitingNext){
  awaitingNext=false;$('#feedback').textContent='';$('#feedback').className='';
  if(round===TOTALS[active]-1){$('#puzzle').close();if(state.solved.every(Boolean))$('#finale').showModal();return;}
  views[active]++;pending=null;render();$('#puzzle .scroll').scrollTop=0;return;
 }
 let ok=false,why='';
 if(active===0){
  if(round===0){ok=LEFT.every((_,i)=>a.pairs?.[i]===i);why='Die fünf Verbindungen zeigen: Rom beeinflusste Politik, Geld, Glauben und Alltag. Jetzt untersucht ihr, wie daraus Belastungen entstanden.';}
  else{const c=CHAINS[round-1],order=a['chain'+(round-1)]||[];ok=order.length===3&&order.every((v,i)=>v===c.answer[i]);why=c.why;}
 }
 if(active===1){
  if(round===0){ok=a.marked?.length===3&&[0,3,5].every(i=>a.marked.includes(i));why='Ihr habt die drei verdrehten Einträge gefunden. Repariert sie nun genauer – bei Herrschaft, Abgaben und Kaiserbild.';}
  else{const i=[0,3,5][round-1];ok=a['correct'+i]===CORRECTIONS[i].answer;why=CORRECTIONS[i].why;}
 }
 if(active===2){
  if(round<4){const p=PEOPLE[round];ok=a['att'+round]===p[2]&&a['reason'+round]===p[3];why=[
   'Miriam versucht, ihren Alltag zu sichern. Sich zu arrangieren bedeutet nicht automatisch, eine Herrschaft gerecht zu finden.',
   'Jakob hofft auf Selbstbestimmung. Aus dieser Hoffnung allein folgt noch kein gewaltsamer Widerstand.',
   'Eleasar will bewaffneten Widerstand. Das war eine mögliche Reaktion, aber nicht die Reaktion der gesamten jüdischen Bevölkerung.',
   'Marcus kontrolliert im Auftrag Roms. Seine Stimme zeigt die Sicht der römischen Ordnungsmacht.'
  ][round];}
  else{ok=a.overall===1;why='Anpassung, Hoffnung und bewaffneter Widerstand sind verschiedene Reaktionen. Aus wenigen Stimmen kann man nicht ableiten, wie die gesamte Bevölkerung dachte.';}
 }
 if(active===3){
  if(round<6){ok=a['place'+round]===CLUES[round][1];why=['Galiläa liegt im Norden. Der See Genezareth gehört zu dieser Region.','Samaria liegt zwischen Galiläa im Norden und Judäa im Süden.','Jerusalem liegt in Judäa. Dort stand der Tempel.','Kafarnaum lag am Nordufer des Sees Genezareth.','Nazareth liegt in Galiläa und ist eng mit Jesus verbunden.','Der Jordan verbindet den See Genezareth mit dem Toten Meer.'][round];}
  else{const t=TRANSFER[round-6];ok=a['transfer'+(round-6)]===t.answer;why=t.why;}
 }
 if(active===4){
  if(round===0){ok=a.marked?.length===4&&[1,2,3,4].every(i=>a.marked.includes(i));why='Die Belege zeigen konkrete Erfahrungen: Soldaten kontrollieren, Münzen zeigen Macht, Abgaben belasten und Menschen hoffen auf Freiheit.';}
  else if(round<5){const e=EVIDENCE[round-1];ok=a['category'+e.fragment]===e.answer;why=e.why;}
  else{ok=(a.sentence||'').trim().length>=40;why='Eure Erklärung ist festgehalten. Öffnet die Musterlösung und vergleicht: Nennt ihr mindestens zwei Belastungen? Macht ihr deutlich, dass Menschen unterschiedlich betroffen waren?';}
 }
 if(!ok){failure();return;}
 a.stage=Math.max(a.stage||0,round+1);state.attempts[active]=0;
 if(a.stage>=TOTALS[active])state.solved[active]=true;
 awaitingNext=true;save();scene();render();
 $('#feedback').className='success';$('#feedback').textContent='Dieser Schritt passt. '+why;
 $('#feedback').scrollIntoView({block:'nearest',behavior:'instant'});
}
$('#task').addEventListener('click',e=>{
 const b=e.target.closest('button');if(!b||b.disabled)return;
 const a=state.answers[active];
 if(b.dataset.round!==undefined){views[active]=Number(b.dataset.round);awaitingNext=false;pending=null;$('#feedback').textContent='';$('#feedback').className='';render();$('#puzzle .scroll').scrollTop=0;return;}
 if(b.dataset.key){a[b.dataset.key]=Number(b.dataset.value);}
 else if(b.dataset.order){const key=b.dataset.order,i=Number(b.dataset.value);a[key]||=[];a[key]=a[key].includes(i)?a[key].filter(v=>v!==i):a[key].length<3?[...a[key],i]:a[key];}
 else if(b.dataset.orderReset){a[b.dataset.orderReset]=[];}
 else if(b.dataset.left!==undefined){pending=Number(b.dataset.left);}
 else if(b.dataset.right!==undefined){if(pending===null){$('#feedback').textContent='Wählt zuerst einen Eingriff Roms links.';return;}a.pairs||={};const right=Number(b.dataset.right);for(const k in a.pairs)if(a.pairs[k]===right)delete a.pairs[k];a.pairs[pending]=right;pending=null;}
 else if(b.dataset.mark!==undefined){const i=Number(b.dataset.mark);a.marked||=[];a.marked=a.marked.includes(i)?a.marked.filter(x=>x!==i):[...a.marked,i].sort();}
 else if(b.dataset.place!==undefined){a['place'+views[active]]=Number(b.dataset.place);}
 awaitingNext=false;$('#feedback').textContent='';$('#feedback').className='';
 const scroll=$('#puzzle .scroll').scrollTop;save();render();$('#puzzle .scroll').scrollTop=scroll;
 const attr=['key','order','orderReset','left','right','mark','place'].find(k=>b.dataset[k]!==undefined);
 if(attr){const name=attr.replace(/[A-Z]/g,c=>'-'+c.toLowerCase());let selector=`[data-${name}="${b.dataset[attr]}"]`;if(b.dataset.value!==undefined)selector+=`[data-value="${b.dataset.value}"]`;$('#task').querySelector(selector)?.focus({preventScroll:true});}
});
$('#task').addEventListener('input',e=>{if(e.target.id==='sentence'){state.answers[4].sentence=e.target.value;if(awaitingNext){awaitingNext=false;$('#check').textContent='Diesen Schritt prüfen';$('#feedback').textContent='';}save();}});
$('#puzzle').setAttribute('aria-labelledby','title');$('#finale').setAttribute('aria-label','Der Weg ist frei');$('#reset-dialog').setAttribute('aria-label','Fortschritt zurücksetzen');
$('#hotspots').addEventListener('click',e=>{const b=e.target.closest('[data-open]');if(b)open(Number(b.dataset.open));});$('#check').onclick=check;$('#close').onclick=()=>$('#puzzle').close();$('#puzzle').addEventListener('close',()=>opener?.focus());$('#end').onclick=()=>{if(state.solved.every(Boolean))$('#finale').showModal();};$('#return').onclick=()=>$('#finale').close();$('#reset').onclick=()=>$('#reset-dialog').showModal();$('#cancel-reset').onclick=()=>$('#reset-dialog').close();$('#confirm-reset').onclick=()=>{state=fresh();save();scene();$('#reset-dialog').close();};scene();

function positionMarkers(){
 const layer=$('#object-markers'),image=$('#backdrop');if(!layer||!image.naturalWidth)return;
 const base=layer.getBoundingClientRect(),r=image.getBoundingClientRect();
 const scale=Math.min(r.width/image.naturalWidth,r.height/image.naturalHeight);
 const width=image.naturalWidth*scale,height=image.naturalHeight*scale;
 const offsetX=r.left-base.left+(r.width-width)/2,offsetY=r.top-base.top+(r.height-height)/2;
 layer.replaceChildren();
 PUZZLES.forEach((p,i)=>{
  const label=$(`[data-open="${i}"]`).getBoundingClientRect();
  const targetX=offsetX+width*p.anchor[0]/100,targetY=offsetY+height*p.anchor[1]/100;
  const x=Math.max(label.left+8,Math.min(base.left+targetX,label.right-8))-base.left;
  const y=(base.top+targetY>=label.bottom?label.bottom:label.top)-base.top;
  const dx=targetX-x,dy=targetY-y;
  const line=document.createElement('span');line.className='object-line';
  line.style.cssText=`left:${x}px;top:${y}px;width:${Math.hypot(dx,dy)}px;transform:rotate(${Math.atan2(dy,dx)}rad)`;
  const dot=document.createElement('span');dot.className='object-point';dot.dataset.object=i;
  dot.style.cssText=`left:${targetX}px;top:${targetY}px`;
  layer.append(line,dot);
 });
}
const markerLayer=document.createElement('div');markerLayer.id='object-markers';markerLayer.setAttribute('aria-hidden','true');$('#scene').insertBefore(markerLayer,$('#hotspots'));
new ResizeObserver(positionMarkers).observe($('#scene'));
$('#backdrop').addEventListener('load',positionMarkers);
$('#hotspots').addEventListener('pointerover',e=>{const b=e.target.closest('[data-open]');if(b)markerLayer.querySelector(`[data-object="${b.dataset.open}"]`)?.classList.add('lit');});
$('#hotspots').addEventListener('pointerout',()=>markerLayer.querySelectorAll('.lit').forEach(e=>e.classList.remove('lit')));
requestAnimationFrame(positionMarkers);
