const {webkit}=require('playwright'),assert=require('node:assert/strict');
(async()=>{
 const server=await require('./server.cjs')(),browser=await webkit.launch({headless:true});
 try{
 for(const device of [{ua:'Mozilla/5.0 (iPad; CPU OS 18_0 like Mac OS X)',platform:'iPad',touch:5},{ua:'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15) AppleWebKit/605.1.15 Version/18.0 Safari/605.1.15',platform:'MacIntel',touch:5},{ua:'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X)',platform:'iPhone',touch:5},{ua:'Desktop',platform:'Win32',touch:0}]){
  const context=await browser.newContext({viewport:{width:1194,height:834},hasTouch:device.touch>0,userAgent:device.ua}),page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.addInitScript(device=>{
   Object.defineProperty(navigator,'platform',{get:()=>device.platform});Object.defineProperty(navigator,'maxTouchPoints',{get:()=>device.touch});
   window.nativeRequests=0;window.nativeExits=0;window.nativeOn=false;
   Object.defineProperty(document,'fullscreenElement',{get:()=>window.nativeOn?document.documentElement:null});
   const request=async()=>{window.nativeRequests++;if(device.touch)throw Error('iOS must never request native fullscreen');window.nativeOn=true;document.dispatchEvent(new Event('fullscreenchange'));};
   Element.prototype.requestFullscreen=request;Element.prototype.webkitRequestFullscreen=request;
   document.exitFullscreen=async()=>{window.nativeExits++;window.nativeOn=false;document.dispatchEvent(new Event('fullscreenchange'));};
  },device);
  await page.goto(server.url);await page.locator('#fullscreen-toggle').click();
  assert.equal(await page.locator('#fullscreen-toggle').getAttribute('aria-pressed'),'true');
  assert.equal(await page.evaluate(()=>nativeRequests),device.touch?0:1);
  if(device.touch){
   assert.equal(await page.locator('body').evaluate(e=>getComputedStyle(e).position),'fixed');
   await page.evaluate(()=>{const task=document.querySelector('#task');task.innerHTML='<label>Name<input id="test-name"></label><label>Code<input id="test-code" inputmode="numeric"></label><div style="height:600px"></div><label>Argument<textarea id="test-argument"></textarea></label><button id="test-submit">Übernehmen</button>';document.querySelector('#test-submit').onclick=e=>e.stopPropagation();document.querySelector('#puzzle').showModal();});
   await page.locator('#test-name').fill('Miriam');await page.locator('#test-code').fill('1234');await page.locator('#test-argument').fill('Mein begründetes Argument.');
   await page.evaluate(()=>{window.mockHeight=300;window.mockTop=32;Object.defineProperty(visualViewport,'height',{configurable:true,get:()=>mockHeight});Object.defineProperty(visualViewport,'offsetTop',{configurable:true,get:()=>mockTop});visualViewport.dispatchEvent(new Event('resize'));});
   await page.waitForTimeout(100);
   const box=await page.locator('#test-argument').boundingBox();assert.ok(box.y>=32&&box.y+box.height<=332,JSON.stringify(box));
   await page.locator('#test-submit').click();assert.equal(await page.locator('#test-argument').inputValue(),'Mein begründetes Argument.');
   await page.evaluate(()=>{document.activeElement.blur();mockHeight=834;mockTop=0;visualViewport.dispatchEvent(new Event('resize'));});
   await page.setViewportSize({width:1024,height:768});await page.evaluate(()=>{mockHeight=768;visualViewport.dispatchEvent(new Event('resize'));});await page.waitForTimeout(50);
   assert.equal(await page.locator('body').evaluate(e=>Math.round(e.getBoundingClientRect().height)),768);
   await page.locator('#close').click();await page.locator('#fullscreen-toggle').click();assert.equal(await page.evaluate(()=>nativeRequests),0);assert.equal(await page.locator('html').evaluate(e=>e.classList.contains('app-fullscreen')),false);
   // Escape closes a modal first, and only exits pseudo fullscreen when no input/modal is active.
   await page.locator('#fullscreen-toggle').click();await page.evaluate(()=>document.querySelector('#puzzle').showModal());await page.keyboard.press('Escape');assert.equal(await page.locator('html').evaluate(e=>e.classList.contains('app-fullscreen')),true);await page.locator('#fullscreen-toggle').focus();await page.keyboard.press('Escape');assert.equal(await page.locator('html').evaluate(e=>e.classList.contains('app-fullscreen')),false);
  }else{await page.locator('#fullscreen-toggle').click();assert.equal(await page.evaluate(()=>nativeExits),1);}
  assert.equal(await page.locator('#fullscreen-toggle').getAttribute('aria-pressed'),'false');assert.deepEqual(errors,[]);await context.close();
 }
 console.log('PASS: iPad/iPadOS desktop UA/iPhone: zero native calls, text/code/name input, keyboard viewport shrink/restore, landscape resize, Escape; desktop native enter/exit.');
 }finally{await browser.close();await server.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
