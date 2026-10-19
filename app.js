'use strict';
const $=s=>document.querySelector(s),KEY='palaestina-adventure-klasse6-v2';
const fresh=AdventureRules.fresh;
let state=fresh(),active=0,pending=null,opener=null,views=Array(5).fill(0),awaitingNext=false;
try{state=AdventureRules.migrate(JSON.parse(localStorage.getItem(KEY)));}catch{state=fresh();}
function save(){try{localStorage.setItem(KEY,JSON.stringify(state));}catch{$('#storage-note').textContent='Der Browser kann den Fortschritt nicht speichern. Die App funktioniert für diese Sitzung weiter.';}}
function esc(t){return String(t).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}

function options(key,items){
 const shift=[...key].reduce((n,c)=>n+c.charCodeAt(0),0)%items.length;
 const order=items.map((_,i)=>(i+shift)%items.length);
 return `<div class="options">${order.map((i,j)=>`<button class="option ${state.answers[active][key]===i?'selected':''}" data-key="${key}" data-value="${i}" aria-pressed="${state.answers[active][key]===i}"><span class="choice-letter" aria-hidden="true">${String.fromCharCode(65+j)}</span><span>${esc(items[i])}</span>${state.answers[active][key]===i?'<span class="choice-state">Gewählt</span>':''}</button>`).join('')}</div>`;
}
function mission(title,text){return `<div class="mission"><span class="eyebrow">EUER AUFTRAG</span><h3>${title}</h3><p>${text}</p></div>`;}
function portrait(i){return i===3?'<div class="voice-portrait guard"><img src="roman-guard.webp" alt="Marcus, römischer Soldat"></div>':`<div class="voice-portrait people person-${i}"><img src="group-people.webp" alt="${esc(PEOPLE[i][0])}"></div>`;}
function scene(){
 const count=state.solved.filter(Boolean).length;
 $('#hotspots').innerHTML=PUZZLES.map((p,i)=>`<button class="hotspot ${state.solved[i]?'done':''}" style="left:${p.anchor[0]}%;top:${p.anchor[1]}%" data-open="${i}" aria-label="${p.object}: ${state.solved[i]?'gelöst, erneut ansehen':'erkunden'}"><span aria-hidden="true">${state.solved[i]?'✓':i+1}</span><span class="tag-label">${p.object}</span></button>`).join('');
 $('#seals').innerHTML=state.solved.map((v,i)=>`<img class="seal" src="${v?'seal-'+SEALS[i]+'.png':'seal-slot-empty.png'}" alt="${['Herrschaft','Belastung','Stimmen','Land','Belege'][i]}: ${v?'erworben':'noch verschlossen'}">`).join('');
 $('#progress').textContent=count===5?'Der Wächter tritt zur Seite: „Eure Belege stimmen. Ihr könnt durch das Tor gehen.“':`${count} von 5 Erkenntnissiegeln · erkundet die Gegenstände`;
 const src=`assets/scene/control-post-v2-stage-${count}.png`;
 if($('#backdrop').getAttribute('src')!==src){
  const old=$('#scene .world-fade');if(old)old.remove();
  const fade=$('#backdrop').cloneNode();fade.removeAttribute('id');fade.alt='';fade.className='world-fade';$('#scene').prepend(fade);
  $('#backdrop').src=src;$('#backdrop').onload=()=>{fade.classList.add('vanish');setTimeout(()=>fade.remove(),650);};
 }
 $('#end').hidden=count!==5;
 $('#end').textContent='Durch das Tor nach Galiläa';
 window.dispatchEvent(new Event('adventure:state'));
}

function open(i){
 active=i;pending=null;awaitingNext=false;opener=document.activeElement;
 hintLevel=0;if(!state.discoveries.includes(i))state.discoveries.push(i);save();
 views[i]=state.solved[i]?0:Math.min(state.answers[i].stage||0,TOTALS[i]-1);
 $('#chapter').textContent=`SIEGEL ${i+1} · ${PUZZLES[i].object}`;$('#title').textContent=BRIEFS[i][0];
 $('#core-info').innerHTML=`<p>${CORE[i]}</p><div class="discovery-actions">${READINGS[i].map((r,j)=>`<button data-discover="${j}">${['Untersuchen','Nachfragen','Weiterforschen'][j]}: ${r[0]}</button>`).join('')}</div><div id="discovery-detail"></div>`;$('#hint-panel').hidden=true;$('#hint-open').textContent='Eine Spur erfragen';$('#feedback').textContent='';$('#feedback').className='';
 render();$('#puzzle').showModal();$('#puzzle .scroll').scrollTop=0;
}
function render(){
 const a=state.answers[active],round=views[active],total=TOTALS[active],unlocked=Math.min(a.stage||0,total-1);
 $('#core-info').hidden=round>0;
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
  html+=`<div class="dossier"><div class="document-caption"><strong>KONTROLLAKTE</strong><span>Abschrift vom Kontrollposten</span></div>${STATEMENTS.map((t,i)=>`<button class="record ${marked.includes(i)?'selected':''}" data-mark="${i}" aria-pressed="${marked.includes(i)}"><span class="record-number">${String(i+1).padStart(2,'0')}</span><span>${t}<small class="record-state">${a['correct'+i]===CORRECTIONS[i]?.answer&&[0,3,5].includes(i)?'Berichtigt':(a.stage||0)>0?([0,3,5].includes(i)?'Beanstandet':'Nach Aktenvergleich bestätigt'):marked.includes(i)?'Ausgewählt – noch nicht geprüft':'Ungeprüft'}</small></span><span class="record-box" aria-hidden="true">${marked.includes(i)?'×':''}</span></button>`).join('')}</div><p class="selection-note">${marked.length} von 3 Einträgen markiert</p>`;
 }
 if(active===1&&round>0){
  const i=[0,3,5][round-1];
  html=mission('Repariert den Eintrag','Welcher neue Satz behebt den Fehler genau? Prüft auch die kleinen Unterschiede.');
  html+=`<div class="torn-note"><span class="stamp">ZU BERICHTIGEN</span><p>${STATEMENTS[i]}</p></div>${options('correct'+i,CORRECTIONS[i].options)}`;
 }
 if(active===2&&round<4){
  const p=PEOPLE[round];
  html=`<div class="voice-scene">${portrait(round)}<div class="speech"><span class="eyebrow">STIMME ${round+1} VON 4</span><h3>${p[0]}</h3><blockquote>„${p[1]}“</blockquote></div></div>`;
  html+=`<p class="speaker-state">${a['att'+round]===undefined?'Die Person spricht. Hört auf ihre eigenen Worte.':'Ihr habt eine Haltung gewählt. Begründet eure Deutung.'}</p>${awaitingNext?`<p class="speaker-response">${['Miriam nickt: „Meine Familie muss vom Handel leben.“','Jakob: „Ich hoffe auf eine andere Zukunft.“','Eleasar: „Ich fordere ausdrücklich den Kampf mit Waffen.“','Marcus: „Die Kontrolle gehört zu meinem Auftrag.“'][round]}</p>`:''}<div class="voice-choice"><h4>1 · Welche Haltung zeigt diese Stimme?</h4>${options('att'+round,ATTITUDES)}${a['att'+round]!==undefined?`<h4>2 · Welche Begründung passt genau dazu?</h4>${options('reason'+round,REASONS)}`:'<p>Wählt zuerst eine Haltung. Danach könnt ihr sie begründen.</p>'}</div>`;
 }
 if(active===2&&round===4){
  html=mission('Was könnt ihr aus den Stimmen schließen?','Vier Menschen – vier unterschiedliche Wege. Welche Aussage wird durch ihre Stimmen gestützt?');
  html+=`<div class="voice-strip">${PEOPLE.map((p,i)=>`<div>${portrait(i)}<strong>${p[0].split(' · ')[0]}</strong></div>`).join('')}</div>${options('overall',OVERALL)}`;
 }
 if(active===3){
  // Silent map (map revision 3): numbered markers; a name appears once the place has been found.
  const task=MapRules.tasks[round],choice=round<8&&MapRules.isChoice(round),chosen=round<8?MapRules.chosen(a,round):[];
  const known=MapRules.known(a.stage||0,round),shown=round<8?(choice?task.show:task.candidates):[];
  const sc=MapRules.scale;
  html=`<div class="map-layout"><div class="map"><img src="assets/puzzles/map/map-table-large-v2.png" alt="Stumme Karte mit Gebietsgrenzen: Mittelmeer im Westen, See Genezareth im Nordosten, Jordan zum Toten Meer im Südosten. Die Orte sind nummeriert."><img class="orientation" src="assets/puzzles/map/map-compass.png" alt="Orientierungsscheibe: Norden oben, kein Magnetkompass"><div class="map-scale" style="--scale-h:${sc.heightPercent}%" aria-label="Maßstab: Die Leiste entspricht ${sc.km} km"><span class="map-scale-bar"></span><span>${sc.km} km</span></div>${shown.length?`<svg class="map-anchors" viewBox="0 0 1000 665" aria-hidden="true">${shown.map(i=>{const p=PLACES[i];return `<path d="M ${p[1]*10} ${p[2]*6.65} L ${p[5]*10} ${p[6]*6.65}"/><circle cx="${p[1]*10}" cy="${p[2]*6.65}" r="5"/>`;}).join('')}</svg>`+shown.map(i=>{const p=PLACES[i],selected=chosen.includes(i),name=known.has(i),num=MapRules.number(i);return `<button data-place="${i}" ${choice?'disabled':''} style="left:${p[5]}%;top:${p[6]}%" class="map-marker map-${p[4]==='Region'?'region':p[4]==='Ort'?'town':'water'} ${selected?'selected':''} ${name?'named':'silent'}" aria-pressed="${selected}" aria-label="Marker ${num}${name?': '+p[0]:''}${selected?', Markierung '+(chosen.indexOf(i)+1):''}"><span>${selected&&!task.unordered?chosen.indexOf(i)+1+' · ':''}${name?p[0]:num}</span></button>`;}).join(''):''}<div class="route-proof">${sprite('assets/puzzles/map/map-route-strip.png','footprints')}<span>${Math.min(a.stage||0,8)} Reisemarken gesichert</span></div></div><div class="travel-note">`;
  if(round<8&&choice)html+=`<span class="stamp">REISEHINWEIS ${round+1} VON 8</span><h3>Messen und rechnen</h3><p class="question">${task.question}</p>${options('mapChoice'+round,task.options)}<button class="paper-quiet" data-map-hint>Den Kartenschreiber fragen</button><p id="map-hint" role="status" ${hintLevel===0?'hidden':''}>${hintLevel?esc(task.hints[Math.min(hintLevel-1,2)]):''}</p>`;
  else if(round<8)html+=`<span class="stamp">REISEHINWEIS ${round+1} VON 8</span><h3>Plant den nächsten Wegabschnitt</h3><p class="question">${task.question}</p><p class="selection-note" role="status">${chosen.length?'Eure Wahl: '+chosen.map(i=>known.has(i)?PLACES[i][0]:'Marker '+MapRules.number(i)).join(task.unordered?' + ':' → '):'Tippt auf die passenden Marker auf der Karte. Die Namen erscheinen, sobald ihr einen Ort gefunden habt.'} · ${chosen.length} von ${task.answer.length}</p>${task.answer.length>1?'<button class="paper-quiet" data-map-reset>Markierungen zurücknehmen</button><p class="map-instruction">Erneutes Antippen nimmt eine Markierung zurück.</p>':''}<button class="paper-quiet" data-map-hint>Den Kartenschreiber fragen</button><p id="map-hint" role="status" ${hintLevel===0?'hidden':''}>${hintLevel?esc(task.hints[Math.min(hintLevel-1,2)]):''}</p>`;
  else html+=`<span class="stamp">DIE REISE GEHT WEITER</span><h3>${TRANSFER[round-8].question}</h3>${options('transfer'+(round-8),TRANSFER[round-8].options)}`;
  html+='</div></div>';
 }
 if(active===4&&round===0){
  html=mission('Folgt Zacharias’ Reiseweg','Geht vom Tor aus durch die Gegend. An vier Orten hat Zacharias etwas beobachtet. Untersucht die Stellen und sichert seine Beobachtungen als Belege.');
  html+='<div class="report-walk"></div>';
 }
 if(active===4&&round===1){
  html=mission('Ordnet die Belege ein','Tippt zuerst einen Beleg an und danach das passende Feld auf dem Tableau. Jedes Feld bekommt genau einen Beleg. Antippen eines belegten Feldes nimmt den Beleg wieder auf.');
  html+=`<div class="report-tray" role="group" aria-label="Gesicherte Belege">${[2,0,3,1].map(i=>{const placed=a['category'+i];return `<button class="report-evidence ${pending===i?'selected':''} ${placed!==undefined?'placed':''}" data-evidence="${i}" aria-pressed="${pending===i}">${sprite(EV,STATION_EVIDENCE[i],'report-evidence-icon')}<span><strong>${esc(REPORT_STATIONS[i].evidenceName)} · ${esc(REPORT_STATIONS[i].place)}</strong><small>${esc(REPORT_STATIONS[i].text)}</small>${placed!==undefined?`<em>Liegt bei: ${CATEGORIES[placed]}</em>`:''}</span></button>`;}).join('')}</div>`;
  html+=`<div class="report-board"><img src="assets/puzzles/report-topdown/report-category-board-v2.png" alt="">${CATEGORIES.map((c,k)=>{const items=[0,1,2,3].filter(i=>a['category'+i]===k);return `<button class="report-zone report-zone-${k}" data-zone="${k}" aria-label="${c}${items.length?': '+items.map(i=>REPORT_STATIONS[i].evidenceName).join(', '):': noch leer'}"><span class="report-zone-label">${c}</span><span class="report-zone-question">${CATEGORY_QUESTIONS[k]}</span><span class="report-zone-items">${items.map(i=>`<span>${sprite(EV,STATION_EVIDENCE[i])}${esc(REPORT_STATIONS[i].evidenceName)}</span>`).join('')}</span></button>`;}).join('')}</div>`;
  html+=`<p class="selection-note">${[0,1,2,3].filter(i=>a['category'+i]!==undefined).length} von 4 Belegen eingeordnet${pending!==null?` · Wählt jetzt ein Feld für „${REPORT_STATIONS[pending].evidenceName}“.`:''}</p>`;
 }
 if(active===4&&round===2){
  html=mission('Die Argumentationswerkstatt','Wählt je einen Baustein: Beobachtung → Zusammenhang → Schlussfolgerung. Die drei Teile müssen dieselbe Erklärung tragen. Es gibt zwei passende Wege.');
  const parts=['obs','link','conclusion'].filter(k=>a[k]!==undefined).map(k=>ARGUMENTS[k][a[k]]);
  html+=`<div class="report-result"><img src="assets/puzzles/report-topdown/report-result-panel-v2.png" alt=""><h4 class="report-result-title">Zacharias’ Belege</h4>${[0,1,2,3].map(i=>`<div class="report-result-evidence rr-${i}">${sprite(EV,STATION_EVIDENCE[i])}<span class="visually-hidden">${esc(REPORT_STATIONS[i].evidenceName)}</span></div><div class="report-result-category rr-${i}" title="${CATEGORIES[REPORT_ANSWERS[i]]}">${CATEGORY_SHORT[REPORT_ANSWERS[i]]}</div>`).join('')}<p class="report-result-explanation" aria-live="polite">${parts.length?esc(parts.join(' ')):'Wählt unten drei Bausteine. Hier entsteht eure Erklärung.'}</p></div>`;
  html+=['obs','link','conclusion'].map((key,j)=>`<section class="argument-group"><h4>${j+1} · ${['Beobachtung','Zusammenhang','Schlussfolgerung'][j]}</h4><div class="report-tile-bank">${ARGUMENTS[key].map((t,i)=>`<button class="report-tile ${a[key]===i?'selected':''}" data-key="${key}" data-value="${i}" aria-pressed="${a[key]===i}">${sprite(AT,(i+j)%2?'medium-b':'medium-a')}<span>${esc(t)}</span></button>`).join('')}</div></section>`).join('');
  html+='<p>Optional: Erklärt eure fertige Argumentation einem Partner mündlich.</p>';
 }
 const nav=`<nav class="round-nav" aria-label="Rätselschritte">${Array.from({length:total},(_,i)=>`<button data-round="${i}" ${i>unlocked&&!state.solved[active]&&!window.Teacher?.active?'disabled':''} class="${i===round?'current':''} ${i<(a.stage||0)?'complete':''}" aria-label="Schritt ${i+1}${i<(a.stage||0)?', geschafft':''}" ${i===round?'aria-current="step"':''}>${i+1}</button>`).join('')}<span>Schritt ${round+1} von ${total}</span></nav>`;
 if(window.Teacher?.solutions)html+=`<p class="teacher-solution"><strong>Lösung (Lehrkräftemodus):</strong> ${esc(solutionText(active,round))}</p>`;
 $('#task').innerHTML=nav+`<div class="exercise-body exercise-${active}">${html}</div>`;
 if(active===4&&round===0)ReportWalk.mount($('#task .report-walk'),{found:a.found||[],stations:REPORT_STATIONS,sign:REPORT_SIGN,
  onSecure:found=>{a.found=found;save();},
  onComplete:()=>{if(active===4&&views[4]===0&&!awaitingNext)check();}});
 else window.ReportWalk?.unmount();
 requestAnimationFrame(drawConnections);
 $('#solved').textContent=state.solved[active]?'Siegel offen · ihr könnt weiter nachlesen':'';
 $('#check').textContent=awaitingNext?(round===total-1?'Zur Szene':'Weiter →'):state.solved[active]?'Wiederholung prüfen':'Diesen Schritt prüfen';
}
function failure(message){
 state.attempts[active]++;save();$('#feedback').className='needs-help';
 $('#feedback').textContent=message||failureDetail();
}
function check(){
 const a=state.answers[active],round=views[active];
 if(awaitingNext){
  awaitingNext=false;$('#feedback').textContent='';$('#feedback').className='';
  if(round===TOTALS[active]-1){$('#puzzle').close();return;}
  views[active]++;hintLevel=0;pending=null;render();$('#puzzle .scroll').scrollTop=0;return;
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
  if(round<8){ok=MapRules.correct(round,MapRules.isChoice(round)?a['mapChoice'+round]:MapRules.chosen(a,round));why=MapRules.tasks[round].why;}
  else{const t=TRANSFER[round-8];ok=a['transfer'+(round-8)]===t.answer;why=t.why;}
 }
 if(active===4){
  if(round===0){ok=(a.found||[]).length===4;why='Ihr habt vier konkrete Erfahrungen gesichert: Kontrolle, Abgaben, ein Machtzeichen und eine Hoffnung. Jetzt ordnet ihr sie ein.';}
  else if(round===1){ok=REPORT_ANSWERS.every((v,i)=>a['category'+i]===v);why='Jeder Beleg zeigt eine andere Seite der römischen Herrschaft. '+EVIDENCE_WHY[2];}
  else{ok=AdventureRules.argument(a);why='Beobachtung, Zusammenhang und Schlussfolgerung stützen einander. '+(a.obs===0?'Eine gleiche Abgabe trifft Menschen je nach Vorrat unterschiedlich.':'Der Wunsch nach Freiheit ist noch kein Aufruf zum Kampf.');}
 }
 if(!ok){failure();return;}
 pending=null;
 a.stage=Math.max(a.stage||0,round+1);state.attempts[active]=0;
 const newlyAwarded=a.stage>=TOTALS[active]&&AdventureRules.award(state,active);
 awaitingNext=true;$('#hint-panel').hidden=true;save();scene();render();
 $('#feedback').className='success';$('#feedback').textContent='Dieser Schritt passt. '+why;
 $('#feedback').scrollIntoView({block:'nearest',behavior:'instant'});if(newlyAwarded)showReward(active);
}
$('#task').addEventListener('click',e=>{
 const b=e.target.closest('button');if(!b||b.disabled||b.closest('.report-walk'))return;
 const a=state.answers[active];
 if(b.dataset.round!==undefined){views[active]=Number(b.dataset.round);hintLevel=0;awaitingNext=false;pending=null;$('#feedback').textContent='';$('#feedback').className='';render();$('#puzzle .scroll').scrollTop=0;return;}
 if(b.dataset.key){a[b.dataset.key]=Number(b.dataset.value);if(b.dataset.key.startsWith('att'))delete a['reason'+views[active]];}
 else if(b.dataset.order){const key=b.dataset.order,i=Number(b.dataset.value);a[key]||=[];a[key]=a[key].includes(i)?a[key].filter(v=>v!==i):a[key].length<3?[...a[key],i]:a[key];}
 else if(b.dataset.orderReset){a[b.dataset.orderReset]=[];}
 else if(b.dataset.left!==undefined){pending=Number(b.dataset.left);}
 else if(b.dataset.right!==undefined){if(pending===null){$('#feedback').textContent='Wählt zuerst einen Eingriff Roms links.';return;}a.pairs||={};const right=Number(b.dataset.right);for(const k in a.pairs)if(a.pairs[k]===right)delete a.pairs[k];a.pairs[pending]=right;pending=null;}
 else if(b.dataset.evidence!==undefined){const i=Number(b.dataset.evidence);pending=pending===i?null:i;}
 else if(b.dataset.zone!==undefined){const k=Number(b.dataset.zone);
  if(pending===null){const here=[0,1,2,3].find(i=>a['category'+i]===k);if(here===undefined){$('#feedback').textContent='Wählt zuerst oben einen Beleg.';return;}pending=here;}
  else{for(let i=0;i<4;i++)if(a['category'+i]===k)delete a['category'+i];a['category'+pending]=k;pending=null;}}
 else if(b.dataset.mark!==undefined){const i=Number(b.dataset.mark);a.marked||=[];a.marked=a.marked.includes(i)?a.marked.filter(x=>x!==i):[...a.marked,i].sort();}
 else if(b.dataset.mapHint!==undefined){showMapHint();return;}
 else if(b.dataset.mapReset!==undefined){a['mapStep'+views[active]]=[];}
 else if(b.dataset.place!==undefined){MapRules.select(a,views[active],Number(b.dataset.place));}
 awaitingNext=false;$('#feedback').textContent='';$('#feedback').className='';
 const scroll=$('#puzzle .scroll').scrollTop;save();render();$('#puzzle .scroll').scrollTop=scroll;
 const attr=['key','order','orderReset','left','right','mark','place','evidence','zone'].find(k=>b.dataset[k]!==undefined);
 if(attr){const name=attr.replace(/[A-Z]/g,c=>'-'+c.toLowerCase());let selector=`[data-${name}="${b.dataset[attr]}"]`;if(b.dataset.value!==undefined)selector+=`[data-value="${b.dataset.value}"]`;$('#task').querySelector(selector)?.focus({preventScroll:true});}
});
$('#puzzle').setAttribute('aria-labelledby','title');$('#reset-dialog').setAttribute('aria-label','Fortschritt zurücksetzen');
$('#hotspots').addEventListener('click',e=>{const b=e.target.closest('[data-open]');if(b)open(Number(b.dataset.open));});
$('#check').onclick=check;$('#close').onclick=()=>$('#puzzle').close();$('#puzzle').addEventListener('close',()=>opener?.focus());
$('#end').onclick=()=>{if(state.solved.every(Boolean)){if(!state.gatePassed){state.gatePassed=true;save();window.dispatchEvent(new Event('adventure:state'));}renderFinale();$('#finale').showModal();}};
$('#return').onclick=()=>$('#finale').close();$('#reset').onclick=()=>$('#reset-dialog').showModal();$('#cancel-reset').onclick=()=>$('#reset-dialog').close();
$('#confirm-reset').onclick=()=>{state=fresh();views=Array(5).fill(0);save();scene();$('#reset-dialog').close();};
scene();
let hintLevel=0,spriteId=0,wiresObserver;
// SVG viewBox crops use the native, nonuniform rectangles from ASSET-SPRITES.json.
const EV='assets/puzzles/report-topdown/report-evidence.png',AT='assets/puzzles/report-topdown/report-argument-tiles-v2.png',STATION_EVIDENCE=['control-tablet','tax-sack','roman-shield','shared-hope'];
function sprite(path,name,cls=''){
 const [x,y,w,h]=SPRITES[path][name];
 const [width,height]=SHEET_SIZES[path]||[Math.max(...Object.values(SPRITES[path]).map(r=>r[0]+r[2])),Math.max(...Object.values(SPRITES[path]).map(r=>r[1]+r[3]))];
 const id=`crop-${++spriteId}`;
 return `<svg class="sprite ${cls}" viewBox="0 0 ${w} ${h}" aria-hidden="true" focusable="false"><defs><clipPath id="${id}"><rect width="${w}" height="${h}"/></clipPath></defs><g clip-path="url(#${id})"><image href="${path}" x="${-x}" y="${-y}" width="${width}" height="${height}"/></g></svg>`;
}
function failureDetail(){
 const a=state.answers[active],r=views[active];
 if(active===0&&r===0){const i=LEFT.findIndex((_,i)=>a.pairs?.[i]!==i);return `Prüft „${LEFT[i]}“: Welche direkte Folge entsteht gerade durch diese Maßnahme? Die Verbindung ${i+1} passt noch nicht.`;}
 if(active===0)return 'Die Kette braucht diese Richtung: Ausgangslage → unmittelbare Wirkung → Erfahrung der Menschen. '+CHAINS[r-1].why;
 if(active===1&&r===0)return 'Nicht jede Erwähnung Roms ist falsch. Sucht genau drei falsche Schlussfolgerungen über Herrscherwahl, gleiche Abgaben und Münznutzung.';
 if(active===1)return CORRECTIONS[[0,3,5][r-1]].why+' Wählt eine Berichtigung, die genau diesen Unterschied ausdrückt.';
 if(active===2&&r<4)return a['att'+r]===undefined?'Wählt zuerst, was die Person ausdrücklich tut oder hofft.':`Vergleicht Haltung und Begründung mit „${PEOPLE[r][1]}“. Hoffnung allein ist kein Kampfplan; Alltagsanpassung ist keine Zustimmung.`;
 if(active===2)return 'Eine einzelne Stimme steht nicht für alle. Achtet darauf, welche Schlussfolgerung die unterschiedlichen Reaktionen offenlässt.';
 if(active===3&&r<8)return MapRules.feedback(r,MapRules.isChoice(r)?a['mapChoice'+r]:MapRules.chosen(a,r));
 if(active===3)return TRANSFER[r-8].why+' Wählt die dazu passende Begründung.';
 if(r===0){const n=4-(a.found||[]).length;return `Es fehl${n===1?'t':'en'} noch ${n} Beobachtung${n===1?'':'en'}. Sucht die Stationen auf dem Reiseweg und sichert, was Zacharias dort erlebt hat.`;}
 if(r===1){const open=[0,1,2,3].filter(i=>a['category'+i]===undefined);if(open.length)return 'Legt alle vier Belege auf das Tableau. Jedes Feld bekommt genau einen Beleg.';
  const wrong=[0,1,2,3].filter(i=>a['category'+i]!==REPORT_ANSWERS[i]);
  return `${wrong.length} Beleg${wrong.length===1?' liegt':'e liegen'} noch im falschen Feld. Fragt bei jedem Beleg: Was passiert hier genau?`+(state.attempts[active]>=2?` Prüft besonders „${REPORT_STATIONS[wrong[0]].evidenceName}“: ${CATEGORY_QUESTIONS[REPORT_ANSWERS[wrong[0]]]}`:'');}
 return 'Die Bausteine erklären noch nicht denselben Zusammenhang. Verbindet entweder Ernte und Abgaben mit Vorräten und Not oder Kontrolle mit dem Wunsch nach Freiheit. Münznutzung beweist keine Verehrung.';
}
$('#core-info').addEventListener('click',e=>{
 const b=e.target.closest('[data-discover]');if(!b)return;
 const r=READINGS[active][Number(b.dataset.discover)];
 $('#discovery-detail').innerHTML=`<article class="found-note"><h3>${r[0]}</h3><p>${r[1]}</p><small>Im Reisebuch nachlesbar.</small></article>`;
});
function showMapHint(){
 hintLevel=Math.min(hintLevel+1,3);const text=MapRules.tasks[views[active]].hints[hintLevel-1];
 const target=$('#map-hint');target.hidden=false;target.textContent=['Denkimpuls: ','Räumliche Spur: ','Letzte Spur: '][hintLevel-1]+text;
}
$('#hint-open').onclick=()=>{
 if(active===3&&views[active]<8){showMapHint();$('#map-hint').scrollIntoView({block:'nearest',behavior:'instant'});return;}
 $('#hint-panel').hidden=false;
 const level=Math.min(hintLevel,2);
 const hints=active===4?HINTS[4][views[4]]:HINTS[active];
 $('#hint-text').textContent=`${['Denkimpuls','Konkrete Spur','Lösungsnaher Hinweis'][level]}: ${hints[level]}`;
 hintLevel=Math.min(hintLevel+1,2);$('#hint-open').textContent=hintLevel===2?'Letzte Spur ansehen':'Genauere Spur erfragen';
};
function showReward(i){
 $('#reward-title').textContent=`Erkenntnissiegel ${['Herrschaft','Belastung','Stimmen','Land','Belege'][i]}`;
 $('#reward-seal').src=`seal-${SEALS[i]}.png`;$('#reward-insight').textContent=INSIGHTS[i];
 // Close the exercise first: there is never an interactive dialog behind another one.
 $('#puzzle').close();$('#reward').showModal();
}
$('#reward-close').onclick=()=>$('#reward').close();
function openNotebook(){
 renderNotebook(state.discoveries[0]);$('#notebook').showModal();
}
function renderNotebook(i){
 const discovered=state.discoveries;
 $('#notebook-pages').innerHTML=`<nav class="book-nav" aria-label="Entdeckte Stationen">${discovered.map(n=>`<button data-book="${n}" ${n===i?'aria-current="page"':''}>${PUZZLES[n].object}${state.solved[n]?' · ✓':''}</button>`).join('')}<button data-book="time" ${i==='time'?'aria-current="page"':''}>Zeit und Quellen</button></nav>`;
 if(i===undefined){$('#notebook-pages').insertAdjacentHTML('beforeend','<div class="book-spread"><section tabindex="0"><h3>Die Reise beginnt</h3><p>Untersucht einen Gegenstand am Kontrollposten. Das dort zugängliche Wissen sammelt ihr hier.</p></section><section tabindex="0"><h3>Fünf Erkenntnisse</h3><p>Herrschaft · Belastung · Stimmen · Land · Belege</p><p>Ihr könnt jederzeit nachlesen. Hinweise und Reisebuch verändern euren Fortschritt nicht.</p></section></div>');return;}
 if(i==='time'){
  $('#notebook-pages').insertAdjacentHTML('beforeend',`<div class="book-spread"><section tabindex="0"><h3>Zeit und Spielwelt</h3><p>Wir reisen in einer erfundenen Geschichte um 30 n. Chr. Die Figuren und dieser Posten sind keine belegten Einzelereignisse. „Palästina“ bezeichnet hier die historische Landschaft; ihre Regionen hatten unterschiedliche Herrscher.</p><p>Antipas war ein von Rom abhängiger Tetrarch, kein römischer Präfekt. Kaiserverehrung konnte Spannungen auslösen, bedeutete aber kein allgemeines Verbot jüdischen Glaubens.</p></section><section tabindex="0"><h3>Genauer hinsehen</h3><p>Die Zeloten als organisierte Gruppe sind erst aus dem späteren Krieg gegen Rom (ab 66 n. Chr.) bekannt. Nicht alle früheren Gegner Roms gehörten zu ihr.</p><h4>Fachliche Quellen</h4><p><a href="https://academic.oup.com/edited-volume/61673/chapter-abstract/548933893?login=false" target="_blank" rel="noopener">Oxford Classical Dictionary: Herod Antipas</a></p><p><a href="https://journals.sagepub.com/doi/10.1177/0142064X05052506" target="_blank" rel="noopener">J. S. McLaren: Jews and the Imperial Cult</a></p><p><a href="https://byustudies.byu.edu/article/revolutionaries-in-the-first-century/" target="_blank" rel="noopener">K. P. Jackson: Revolutionaries in the First Century</a></p></section></div>`);return;
 }
 $('#notebook-pages').insertAdjacentHTML('beforeend',`<div class="book-spread"><section tabindex="0"><h3>${PUZZLES[i].object}</h3><p>${CORE[i]}</p>${state.solved[i]?`<h4>Eure Erkenntnis</h4><p>${INSIGHTS[i]}</p>`:'<p>Hier habt ihr Spuren entdeckt. Das Siegel könnt ihr an der Station erwerben.</p>'}</section><section tabindex="0"><h3>Fundstücke und Gespräche</h3>${READINGS[i].map(r=>`<details><summary>${r[0]}</summary><p>${r[1]}</p></details>`).join('')}<details><summary>Weitere Einordnung</summary>${PUZZLES[i].knowledge.map(k=>`<p>${KNOWLEDGE[k][1]}</p>`).join('')}</details></section></div>`);
}
$('#notebook-pages').onclick=e=>{const b=e.target.closest('[data-book]');if(b){renderNotebook(b.dataset.book==='time'?'time':Number(b.dataset.book));$('#notebook-pages').querySelector(`[data-book="${b.dataset.book}"]`)?.focus({preventScroll:true});}};
$('#notebook-open').onclick=openNotebook;
document.querySelectorAll('[data-close]').forEach(b=>b.onclick=()=>document.getElementById(b.dataset.close).close());
function renderFinale(){
 const step=state.finale;
 $('#finale-content').innerHTML=step===0?`<img class="finale-road" src="assets/scenes/finale-road-galilee.webp" alt="Ein Weg durch die Landschaft Galiläas"><h2 id="finale-title">Auf dem Weg nach Galiläa</h2><p>Ihr habt den Kontrollposten hinter euch gelassen. Ihr versteht nun besser, wie Herrschaft und Abgaben das Leben prägen und warum Menschen unterschiedlich reagieren.</p>`:step===1?`<img class="finale-road" src="assets/scenes/finale-road-galilee.webp" alt="Die Landschaft Galiläas"><h2 id="finale-title">Jesus von Nazareth</h2><p>In Galiläa lebte und wirkte Jesus, ein jüdischer Wanderprediger. Auch diese Region stand unter Roms Einfluss; hier regierte Herodes Antipas.</p><p>Welche Botschaft verkündete Jesus in dieser Welt? Mit dieser Frage geht eure nächste Lernreise weiter.</p>`:`<div class="travel-permit"><img src="assets/ui/finale-travel-permit.png" alt=""><div class="permit-text"><h2 id="finale-title">Eure Reisegenehmigung</h2><p>Fünf Erkenntnisse begleiten euch nach Galiläa.</p><p>Herrschaft · Belastung · Stimmen · Land · Belege</p></div><div class="permit-seals">${SEALS.map((s,i)=>`<img src="seal-${s}.png" alt="Siegel ${['Herrschaft','Belastung','Stimmen','Land','Belege'][i]}">`).join('')}</div></div>`;
 $('#finale-next').textContent=['In Galiläa ankommen','Reisegenehmigung ansehen','Reise abschließen'][step];
}
$('#finale-next').onclick=()=>{if(!state.solved.every(Boolean))return;if(state.finale<2){state.finale++;save();renderFinale();$('#finale .scroll').scrollTop=0;$('#finale-next').focus();}else $('#finale').close();};
$('#finale-book').onclick=()=>{$('#finale').close();openNotebook();};
// Native modal dialogs supply focus trapping and Escape; restore the trigger on every close.
const dialogTriggers=new WeakMap();
const showModal=HTMLDialogElement.prototype.showModal;
HTMLDialogElement.prototype.showModal=function(){dialogTriggers.set(this,document.activeElement);showModal.call(this);};
document.querySelectorAll('dialog').forEach(d=>d.addEventListener('close',()=>{const b=dialogTriggers.get(d);if(b?.isConnected&&!b.closest('dialog:not([open])'))b.focus({preventScroll:true});}));
// Station artwork belongs to the same coordinate system as its marker (full, uncropped scene).
// Scene v2 (asset update 3): all five stations are painted into every stage, so no separate cut-outs are layered on top.

function drawConnections(){
 wiresObserver?.disconnect();
 const board=$('.match-board');if(!board)return;
 function paint(){
  board.querySelector('.cords')?.remove();const r=board.getBoundingClientRect();
  const pairs=state.answers[0].pairs||{};
  const paths=Object.entries(pairs).map(([left,right])=>{
   const a=board.querySelector(`[data-left="${left}"]`)?.getBoundingClientRect(),b=board.querySelector(`[data-right="${right}"]`)?.getBoundingClientRect();if(!a||!b)return '';
   const x1=a.right-r.left-6,y1=a.top-r.top+a.height/2,x2=b.left-r.left+6,y2=b.top-r.top+b.height/2;
   return `<path d="M${x1},${y1} C${x1+24},${y1} ${x2-24},${y2} ${x2},${y2}"/><circle cx="${x1}" cy="${y1}" r="4"/><circle cx="${x2}" cy="${y2}" r="4"/>`;
  }).join('');
  board.insertAdjacentHTML('afterbegin',`<svg class="cords" viewBox="0 0 ${r.width} ${r.height}" aria-hidden="true">${paths}</svg>`);
 }
 paint();wiresObserver=new ResizeObserver(paint);wiresObserver.observe(board);
}

let bookReturn=null;
$('#puzzle-book').onclick=()=>{bookReturn={i:active,round:views[active]};$('#puzzle').close();openNotebook();$('#notebook [data-close]').textContent='Zum Rätsel zurück';};
$('#notebook').addEventListener('close',()=>{if(bookReturn){const back=bookReturn;bookReturn=null;open(back.i);views[back.i]=back.round;render();}$('#notebook [data-close]').textContent='Schließen ×';});
$('#hint-close').onclick=()=>{$('#hint-panel').hidden=true;$('#hint-open').focus();};

// Narrow integration boundary for the two optional game modules; core puzzle rules stay here.
// Solutions for the teacher mode, derived from the same data the checks use.
function solutionText(i,r){
 if(i===0)return r===0?LEFT.map((_,k)=>`${k+1} → ${String.fromCharCode(65+k)}`).join(', '):CHAINS[r-1].answer.map(k=>CHAINS[r-1].tiles[k]).join(' → ');
 if(i===1)return r===0?'Einträge 01, 04 und 06 sind verdreht.':CORRECTIONS[[0,3,5][r-1]].options[CORRECTIONS[[0,3,5][r-1]].answer];
 if(i===2)return r<4?`${ATTITUDES[PEOPLE[r][2]]} – ${REASONS[PEOPLE[r][3]]}`:OVERALL[1];
 if(i===3){if(r>=8)return TRANSFER[r-8].options[TRANSFER[r-8].answer];const t=MapRules.tasks[r];return MapRules.isChoice(r)?t.options[t.answer]:t.answer.map(k=>`${PLACES[k][0]} (Marker ${MapRules.number(k)})`).join(t.unordered?' + ':' → ');}
 if(r===0)return 'Alle vier Stationen besuchen und sichern: '+REPORT_STATIONS.map(s=>s.place).join(', ')+'.';
 if(r===1)return REPORT_STATIONS.map((s,k)=>`${s.evidenceName} → ${CATEGORIES[REPORT_ANSWERS[k]]}`).join('; ');
 return `Weg 1: ${ARGUMENTS.obs[0]} / ${ARGUMENTS.link[0]} / ${ARGUMENTS.conclusion[0]} – oder Weg 2: ${ARGUMENTS.obs[1]} / ${ARGUMENTS.link[1]} / ${ARGUMENTS.conclusion[1]}`;
}
function openStation(i,round=0){if(document.querySelector('dialog[open]'))document.querySelectorAll('dialog[open]').forEach(d=>d.close());open(i);views[i]=round;render();}
function openFinale(){document.querySelectorAll('dialog[open]').forEach(d=>d.close());renderFinale();$('#finale').showModal();}
window.Adventure=Object.freeze({getState:()=>state,save,refresh:()=>{save();scene();},replace:s=>{state=AdventureRules.migrate(JSON.parse(JSON.stringify(s)));views=Array(5).fill(0);save();scene();},openStation,openFinale,solutionText});
