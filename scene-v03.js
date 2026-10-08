/* v0.3 — interactive clinic blockout, no external dependencies */
(function(){
const oldClinic=clinic;
window.clinic=function(){
 shell(`<main class="screen"><div class="eye">DAY 01 · INTERACTIVE CLINIC</div><h1 style="font-size:clamp(2.6rem,6vw,5.2rem)">Your first patient<br>has arrived.</h1><p class="lead">Move through the clinic to meet your patient. Use WASD / arrow keys on desktop, or the joystick on mobile.</p>
 <section class="walk-stage" aria-label="Interactive dental clinic"><div class="walk-world"><div class="walk-room walk-main"></div><div class="walk-room walk-reception"></div><div class="walk-room walk-op"></div><div class="walk-desk"></div><div class="walk-desk-screen"></div><div class="walk-seat waiting-a"></div><div class="walk-seat waiting-b"></div><div class="walk-cabinet"></div><div class="walk-tray"></div><div class="walk-lamp"></div><div class="walk-chair"></div><div class="walk-patient" id="walk-patient"></div><div class="walk-player" id="walk-player"></div><div class="walk-floor-glow"></div></div>
 <div class="walk-overlay"><div class="walk-hint">DAY 01 &nbsp; / &nbsp; MEET PATIENT 01</div><div class="walk-joystick" id="walk-joystick" aria-label="Movement joystick"><div class="walk-stick" id="walk-stick"></div></div><div class="walk-controls"><button data-dir="up" aria-label="Move up">↑</button><button data-dir="left" aria-label="Move left">←</button><button data-dir="down" aria-label="Move down">↓</button><button data-dir="right" aria-label="Move right">→</button></div><button class="btn primary walk-action" id="walk-talk" hidden>Talk to Patient →</button><div class="walk-status" id="walk-status">Approach the red marker</div></div></section></main>`);
 setupWalk();
};
function setupWalk(){
 const player=document.querySelector("#walk-player"),talk=document.querySelector("#walk-talk"),status=document.querySelector("#walk-status");
 if(!player)return;
 let x=Number.isFinite(s.walkX)?s.walkX:29,y=Number.isFinite(s.walkY)?s.walkY:72;
 const near=()=>Math.hypot(x-71,y-30)<16;
 function draw(){player.style.left=x+"%";player.style.top=y+"%";const ok=near();talk.hidden=!ok;status.textContent=ok?"Patient in range · INTERACT":"Approach the red marker";document.querySelector("#walk-patient")?.classList.toggle("walk-near",ok);s.walkX=x;s.walkY=y;save()}
 function move(dx,dy){if(s.page!=="clinic")return;x=Math.max(8,Math.min(92,x+dx*3));y=Math.max(9,Math.min(90,y+dy*3));draw()}
 draw();talk.onclick=()=>go("history");
 import("./clinic-3d.js?v=050").then(m=>m.mountClinic3D(document.querySelector(".walk-stage"),()=>({x,y}))).catch(e=>console.warn("3D fallback",e));
 document.querySelectorAll("[data-dir]").forEach(b=>b.onclick=()=>{const d=b.dataset.dir;move(d==="left"?-1:d==="right"?1:0,d==="up"?-1:d==="down"?1:0)});
 const pad=document.querySelector("#walk-joystick"),stick=document.querySelector("#walk-stick");
 if(pad&&stick){
 let pointer=null,vx=0,vy=0,last=0,frame=0;
 function stop(){pointer=null;vx=vy=0;stick.style.transform="translate(-50%,-50%)";if(frame)cancelAnimationFrame(frame);frame=0}
 function tick(t){if(pointer===null||s.page!=="clinic"){stop();return}if(t-last>38){move(vx*.72,vy*.72);last=t}frame=requestAnimationFrame(tick)}
 function update(e){const r=pad.getBoundingClientRect(),cx=r.left+r.width/2,cy=r.top+r.height/2,dx=e.clientX-cx,dy=e.clientY-cy,dist=Math.hypot(dx,dy)||1,limit=38,scale=Math.min(dist,limit)/dist;vx=dx*scale/limit;vy=dy*scale/limit;stick.style.transform="translate(calc(-50% + "+(dx*scale)+"px),calc(-50% + "+(dy*scale)+"px))"}
 pad.addEventListener("pointerdown",e=>{if(pointer!==null)return;e.preventDefault();pointer=e.pointerId;pad.setPointerCapture(pointer);update(e);last=0;frame=requestAnimationFrame(tick)});
 pad.addEventListener("pointermove",e=>{if(e.pointerId===pointer){e.preventDefault();update(e)}});
 for(const type of ["pointerup","pointercancel","lostpointercapture"])pad.addEventListener(type,e=>{if(e.pointerId===pointer)stop()});
 }

}
window.addEventListener("keydown",e=>{
 if(s.page!=="clinic"||e.altKey||e.ctrlKey||e.metaKey)return;
 const m={ArrowUp:[0,-1],w:[0,-1],W:[0,-1],ArrowDown:[0,1],s:[0,1],S:[0,1],ArrowLeft:[-1,0],a:[-1,0],A:[-1,0],ArrowRight:[1,0],d:[1,0],D:[1,0]};
 if(m[e.key]){e.preventDefault();const b=document.querySelectorAll("[data-dir]");const dir=m[e.key];const name=dir[1]<0?"up":dir[1]>0?"down":dir[0]<0?"left":"right";document.querySelector('[data-dir="'+name+'"]')?.click()}
 if((e.key==="Enter"||e.key.toLowerCase()==="e")&&!document.querySelector("#walk-talk")?.hidden){e.preventDefault();go("history")}
});
if(s.page==="clinic")render();
})();