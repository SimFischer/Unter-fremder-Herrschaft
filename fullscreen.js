'use strict';
(()=>{
 const root=document.documentElement,button=document.querySelector('#fullscreen-toggle');
 // iPadOS can identify as a desktop Mac. Never request native fullscreen on Apple touch devices.
 const ios=/iPad|iPhone|iPod/.test(navigator.userAgent)||(/Mac/.test(navigator.platform||navigator.userAgent)&&navigator.maxTouchPoints>1);
 const nativeElement=()=>document.fullscreenElement||document.webkitFullscreenElement;
 const pseudo=()=>root.classList.contains('app-fullscreen');
 const editable=e=>e instanceof HTMLElement&&e.matches('input:not([type="checkbox"]):not([type="radio"]),textarea,[contenteditable="true"]');
 let previousScroll=0,busy=false,frame=0;
 function sync(){const on=pseudo()||!!nativeElement();button.setAttribute('aria-pressed',String(on));button.textContent=on?'Vollbild verlassen':'Vollbild';}
 function viewport(){
  if(!pseudo())return;
  const v=window.visualViewport;
  root.style.setProperty('--app-viewport-height',`${v?.height||innerHeight}px`);
  root.style.setProperty('--app-viewport-top',`${v?.offsetTop||0}px`);
  cancelAnimationFrame(frame);frame=requestAnimationFrame(()=>{
   if(pseudo()&&editable(document.activeElement))document.activeElement.scrollIntoView({block:'nearest',inline:'nearest',behavior:'instant'});
  });
 }
 function setPseudo(on){
  if(on){previousScroll=scrollY;root.classList.add('app-fullscreen');viewport();}
  else{root.classList.remove('app-fullscreen');cancelAnimationFrame(frame);root.style.removeProperty('--app-viewport-height');root.style.removeProperty('--app-viewport-top');window.scrollTo(0,previousScroll);}
  sync();
 }
 button.addEventListener('click',async()=>{
  if(busy)return;busy=true;
  try{
   if(nativeElement()){const exit=document.exitFullscreen||document.webkitExitFullscreen;await exit?.call(document);}
   else if(pseudo())setPseudo(false);
   else if(ios)setPseudo(true);
   else{const request=root.requestFullscreen||root.webkitRequestFullscreen;
    if(request){try{await request.call(root);}catch{setPseudo(true);}}
    else setPseudo(true);
   }
  }finally{busy=false;sync();}
 });
 for(const event of ['fullscreenchange','webkitfullscreenchange'])document.addEventListener(event,sync);
 window.addEventListener('resize',viewport);
 window.visualViewport?.addEventListener('resize',viewport);
 window.visualViewport?.addEventListener('scroll',viewport);
 document.addEventListener('focusin',viewport);
 document.addEventListener('keydown',e=>{if(e.key==='Escape'&&pseudo()&&!document.querySelector('dialog[open]')&&!editable(e.target))setPseudo(false);});
 sync();
})();
