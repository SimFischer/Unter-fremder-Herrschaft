'use strict';
// One shared cache; source rectangles and anchors remain owned by the delivered metadata.
window.GameArt = (() => {
 const cache=new Map();
 let metadata;
 function image(path){
  if(!cache.has(path))cache.set(path,new Promise((resolve,reject)=>{
   const img=new Image();img.onload=()=>resolve(img);img.onerror=()=>{cache.delete(path);reject(new Error('Bild konnte nicht geladen werden: '+path));};img.src=path;
  }));
  return cache.get(path);
 }
 // Two delivered metadata sets (interlude/bonus puzzle and the newer report/messenger games) merge into one lookup.
 const SOURCES=[['docs/interlude-puzzle/SPRITES.json','docs/interlude-puzzle/QA.json'],['docs/new-game-assets/SPRITES.json','docs/new-game-assets/QA.json']];
 async function prepare(paths){
  metadata ||= Promise.all(SOURCES.flat().map(async path=>{
   const response=await fetch(path);if(!response.ok)throw new Error('Asset-Daten fehlen.');return response.json();
  })).then(([spritesA,qaA,spritesB,qaB])=>[{...spritesA,...spritesB},[...qaA,...qaB]]).catch(error=>{metadata=null;throw error;});
  const [[sprites,qa],images]=await Promise.all([metadata,Promise.all(paths.map(image))]);
  return {sprites,qa,images:Object.fromEntries(paths.map((path,i)=>[path,images[i]]))};
 }
 function entry(art,path,name){return art.sprites[path].find(s=>s.name===name);}
 function draw(ctx,art,path,name,x,y,scale){
  const s=entry(art,path,name),[x0,y0,x1,y1]=s.source_rect_xyxy,[ax,ay]=s.foot_anchor_source_xy;
  ctx.drawImage(art.images[path],x0,y0,x1-x0,y1-y0,x+(x0-ax)*scale,y+(y0-ay)*scale,(x1-x0)*scale,(y1-y0)*scale);
 }
 function icon(canvas,art,path,name){
  const s=entry(art,path,name),b=s.visible_bbox_xyxy;
  const scale=Math.min((canvas.width-6)/(b[2]-b[0]),(canvas.height-6)/(b[3]-b[1]));
  const ctx=canvas.getContext('2d');ctx.clearRect(0,0,canvas.width,canvas.height);
  draw(ctx,art,path,name,canvas.width/2,canvas.height/2+(b[3]-b[1])*scale/2,scale);
 }
 // Flexible borders preserve the painted corners on rectangular puzzle pieces.
 function nineSlice(ctx,img,box,dest,edge=24){
  const [x,y,x1,y1]=box,w=x1-x,h=y1-y,s=Math.min(w,h)*.22;
  const ex=Math.min(edge,dest.w/3),ey=Math.min(edge,dest.h/3);
  const sx=[x,x+s,x1-s,x1],sy=[y,y+s,y1-s,y1];
  const dx=[dest.x,dest.x+ex,dest.x+dest.w-ex,dest.x+dest.w],dy=[dest.y,dest.y+ey,dest.y+dest.h-ey,dest.y+dest.h];
  for(let row=0;row<3;row++)for(let col=0;col<3;col++)ctx.drawImage(img,sx[col],sy[row],sx[col+1]-sx[col],sy[row+1]-sy[row],dx[col],dy[row],dx[col+1]-dx[col],dy[row+1]-dy[row]);
 }
 return {image,prepare,entry,draw,icon,nineSlice};
})();
