'use strict';
// One "Bonusspiele" entry instead of two menu buttons; unlocked after walking through the gate to Galilee.
(()=>{
 const dialog=document.querySelector('#bonus-games'),open=document.querySelector('#bonus-games-open');
 const state=()=>window.Adventure.getState();
 function progress(){
  const s=state(),motifs=new Set((s.bonusCompleted||[]).map(k=>k.split(':')[0])).size;
  dialog.querySelector('[data-progress="puzzle"]').textContent=motifs?`${motifs} von 5 Motiven gelöst`:'Noch kein Motiv gelöst';
  dialog.querySelector('[data-progress="bote"]').textContent=s.boteBest?`Bestleistung: ${s.boteBest} Zeichen`:'Noch nicht gespielt';
 }
 function sync(){open.hidden=state().gatePassed!==true;if(open.hidden&&dialog.open)dialog.close();}
 open.onclick=()=>{progress();dialog.showModal();};
 dialog.querySelector('#bonus-games-close').onclick=()=>dialog.close();
 // Capture phase: close this menu before the game's own click handler opens its dialog.
 dialog.addEventListener('click',e=>{if(e.target.closest('[data-game]'))dialog.close();},true);
 window.addEventListener('adventure:state',sync);sync();
 window.BonusMenu=Object.freeze({progress});
})();
