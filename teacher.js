'use strict';
/* Lehrkräftemodus: den Titel 5 Sekunden gedrückt halten. Kein Code; der Modus endet beim Neuladen. */
(()=>{
 const HOLD=5000,NAMES=['Herrschaft','Belastung','Stimmen','Land','Belege'];
 const title=document.querySelector('header h1'),dialog=document.querySelector('#teacher'),body=dialog.querySelector('.teacher-content');
 const A=()=>window.Adventure,S=()=>A().getState();
 const T={active:false,solutions:false};
 window.Teacher=T;
 // Long press without any visible feedback (pupils must not notice it); release, cancel or leave before 5 s aborts.
 let timer=0;
 function startHold(){clearTimeout(timer);title.classList.add('holding');timer=setTimeout(()=>{stopHold();enter();},HOLD);}
 function stopHold(){clearTimeout(timer);title.classList.remove('holding');}
 title.addEventListener('pointerdown',e=>{if(e.button>0)return;startHold();});
 for(const ev of ['pointerup','pointerleave','pointercancel'])title.addEventListener(ev,stopHold);
 title.addEventListener('contextmenu',e=>{if(title.classList.contains('holding'))e.preventDefault();});
 const badge=document.createElement('button');badge.id='teacher-badge';badge.hidden=true;badge.textContent='Lehrkräftemodus';badge.onclick=()=>show();
 document.querySelector('header nav').prepend(badge);

 function enter(){T.active=true;badge.hidden=false;document.body.classList.add('teacher-mode');show();}
 function leave(){T.active=false;T.solutions=false;badge.hidden=true;document.body.classList.remove('teacher-mode');dialog.close();A().refresh();}
 function show(){render();document.querySelectorAll('dialog[open]').forEach(d=>{if(d!==dialog)d.close();});if(!dialog.open)dialog.showModal();}
 const esc=t=>String(t).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 function render(){
  const s=S(),totals=AdventureRules.totals,motifs=new Set((s.bonusCompleted||[]).map(k=>k.split(':')[0])).size;
  body.innerHTML=`<section><h3>Stand auf diesem Gerät</h3><table class="teacher-table"><thead><tr><th>Siegel</th><th>Status</th><th>Schritt</th><th>Fehlversuche</th><th></th></tr></thead><tbody>${PUZZLES.map((p,i)=>`<tr><td><strong>${i+1} · ${esc(p.object)}</strong><br><small>${NAMES[i]}</small></td><td>${s.solved[i]?'offen ✓':'verschlossen'}</td><td>${Math.min(s.answers[i].stage||0,totals[i])} / ${totals[i]}</td><td>${s.attempts[i]}</td><td class="teacher-actions"><button data-seal-open="${i}" ${s.solved[i]?'disabled':''}>Öffnen</button><button data-seal-reset="${i}">Zurücksetzen</button></td></tr>`).join('')}</tbody></table>
<p>Zwischenetappe: <strong>${s.interludeCompleted?`geschafft${s.interludeStats.undetected?', unentdeckt':''} · ${s.interludeStats.collectibles.length} von 3 Gegenständen`:s.interludeStarted?'begonnen':'noch nicht gespielt'}</strong> · Bonusspiele: <strong>${s.gatePassed?'freigeschaltet':'gesperrt'}</strong> · Bote: <strong>${s.boteBest} Zeichen</strong> · Puzzle: <strong>${motifs} von 5 Motiven</strong></p></section>
<section><h3>Freischalten</h3><div class="teacher-row"><button data-act="all">Alle Siegel öffnen</button><button data-act="interlude">Zwischenetappe als erledigt markieren</button><button data-act="bonus">Bonusspiele freigeben</button></div></section>
<section><h3>Direkt springen</h3><div class="teacher-row">${PUZZLES.map((p,i)=>`<label class="teacher-jump">Siegel ${i+1}<select data-jump-step="${i}">${Array.from({length:totals[i]},(_,r)=>`<option value="${r}">Schritt ${r+1}</option>`).join('')}</select><button data-jump="${i}">Öffnen</button></label>`).join('')}</div>
<div class="teacher-row"><button data-act="walk">Reiseweg (Siegel 5)</button><button data-act="run">Zwischenetappe</button><button data-act="finale">Finale</button><button data-act="games">Bonusspiele</button></div></section>
<section><h3>Lösungen</h3><label class="teacher-toggle"><input type="checkbox" data-act="solutions" ${T.solutions?'checked':''}> Lösungen in allen Rätseln einblenden</label></section>
<section><h3>Zurücksetzen</h3><div class="teacher-row"><button data-act="reset" class="teacher-danger">Gesamten Fortschritt zurücksetzen</button></div></section>`;
 }
 function solveSeal(s,i){s.solved[i]=true;s.answers[i].stage=AdventureRules.totals[i];if(!s.discoveries.includes(i))s.discoveries.push(i);}
 body.addEventListener('click',e=>{
  const b=e.target.closest('button');if(!b)return;const s=S();
  if(b.dataset.sealOpen!==undefined){solveSeal(s,+b.dataset.sealOpen);A().refresh();}
  else if(b.dataset.sealReset!==undefined){const i=+b.dataset.sealReset;s.solved[i]=false;s.answers[i]={stage:0};s.attempts[i]=0;if(!s.solved.every(Boolean)){s.gatePassed=false;s.finale=0;}A().refresh();}
  else if(b.dataset.jump!==undefined){const i=+b.dataset.jump;dialog.close();A().openStation(i,+body.querySelector(`[data-jump-step="${i}"]`).value);return;}
  else{const act=b.dataset.act;
   if(act==='all'){for(let i=0;i<5;i++)solveSeal(s,i);s.interludeStarted=true;s.interludeCompleted=true;s.interludeRun=null;A().refresh();}
   else if(act==='interlude'){s.interludeStarted=true;s.interludeCompleted=true;s.interludeRun=null;A().refresh();}
   else if(act==='bonus'){for(let i=0;i<5;i++)solveSeal(s,i);s.interludeStarted=true;s.interludeCompleted=true;s.interludeRun=null;s.gatePassed=true;A().refresh();}
   else if(act==='walk'){dialog.close();A().openStation(4,0);return;}
   else if(act==='run'){dialog.close();window.Interlude.open(true);return;}
   else if(act==='finale'){if(!s.solved.every(Boolean)){for(let i=0;i<5;i++)solveSeal(s,i);}s.interludeStarted=s.interludeCompleted=true;s.gatePassed=true;A().refresh();dialog.close();A().openFinale();return;}
   else if(act==='games'){s.gatePassed=true;if(!s.solved.every(Boolean))for(let i=0;i<5;i++)solveSeal(s,i);s.interludeStarted=s.interludeCompleted=true;A().refresh();dialog.close();document.querySelector('#bonus-games-open').click();return;}
   else if(act==='reset'){if(!b.dataset.confirm){b.dataset.confirm='1';b.textContent='Wirklich alles zurücksetzen? Noch einmal tippen.';return;}A().replace(AdventureRules.fresh());}
  }
  render();
 });
 body.addEventListener('change',e=>{if(e.target.dataset.act==='solutions')T.solutions=e.target.checked;});
 dialog.querySelector('#teacher-leave').onclick=leave;
 dialog.querySelector('#teacher-close').onclick=()=>dialog.close();
})();
