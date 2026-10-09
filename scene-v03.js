/* v0.3 — interactive clinic blockout, no external dependencies */
(function(){
const oldClinic=clinic;
window.clinic=function(){
 shell(`<main class="screen"><div class="eye">DAY 01 · INTERACTIVE CLINIC</div><h1 style="font-size:clamp(2.6rem,6vw,5.2rem)">Your first patient<br>has arrived.</h1><p class="lead">Move through the clinic to meet your patient. Use WASD / arrow keys on desktop, or the joystick on mobile.</p>
 <section class="walk-stage" aria-label="Interactive dental clinic"><div class="walk-world"><div class="walk-room walk-main"></div><div class="walk-room walk-reception"></div><div class="walk-room walk-op"></div><div class="walk-desk"></div><div class="walk-desk-screen"></div><div class="walk-seat waiting-a"></div><div class="walk-seat waiting-b"></div><div class="walk-cabinet"></div><div class="walk-tray"></div><div class="walk-lamp"></div><div class="walk-chair"></div><div class="walk-patient" id="walk-patient"></div><div class="walk-player" id="walk-player"></div><div class="walk-floor-glow"></div></div>
 <div class="walk-overlay"><div class="walk-hint">DAY 01 &nbsp; / &nbsp; MEET PATIENT 01</div><div class="walk-joystick" id="walk-joystick" aria-label="Movement joystick"><div class="walk-stick" id="walk-stick"></div></div><div class="walk-controls"><button data-dir="up" aria-label="Move up">↑</button><button data-dir="left" aria-label="Move left">←</button><button data-dir="down" aria-label="Move down">↓</button><button data-dir="right" aria-label="Move right">→</button></div><button class="btn primary walk-action" id="walk-talk" hidden>Talk to Patient →</button><div class="walk-status" id="walk-status">Approach the patient in the waiting area</div></div></section></main>`);
 setupWalk();
};
function setupWalk(){
 const player=document.querySelector("#walk-player"),talk=document.querySelector("#walk-talk"),status=document.querySelector("#walk-status");
 if(!player)return;
 let x=Number.isFinite(s.walkX)?s.walkX:37,y=Number.isFinite(s.walkY)?s.walkY:82;
 const nearWaiting=()=>Math.hypot(x-22,y-58)<18;
 const nearChair=()=>Math.hypot(x-70,y-54)<19;
 const near=()=>s.patientSeated?nearChair():nearWaiting();
 function draw(){player.style.left=x+"%";player.style.top=y+"%";const ok=near();talk.hidden=!!s.patientTransfer||!ok;status.textContent=s.patientSeated?(ok?"Patient in range · Ask before examination":"Walk to the dental chair and speak to the patient"):s.patientTransfer?"Follow the patient to the operatory…":ok?"Patient in range · INTERACT":"Approach the patient in the waiting area";document.querySelector("#walk-patient")?.classList.toggle("walk-near",ok);s.walkX=x;s.walkY=y;save()}
 // Collision coordinates match the Three.js world: X = (x/100-.5)*12.2, Z = (y/100-.5)*8.2.
 const obstacles=[
 [-4.1,-2.5,3.4,1.0],[-4.9,1.65,1.1,1.0],[-3.45,1.65,1.1,1.0],
 [5.45,-2.1,1.2,2.7],[2.1,.8,1.65,4.3],[.05,1.7,1.3,.75],
 [.1,-2.7,.3,.35],[-1.1,-1.7,.14,5.0]
 ];
 const radius=.30;
 function clear(px,py){
 const wx=(px/100-.5)*12.2,wz=(py/100-.5)*8.2;
 if(wx< -6.1+radius||wx>6.1-radius||wz< -4.1+radius||wz>4.1-radius)return false;
 return !obstacles.some(([ox,oz,w,d])=>Math.abs(wx-ox)<w/2+radius&&Math.abs(wz-oz)<d/2+radius);
 }
 // Resolve axes independently so the doctor slides along furniture rather than sticking.
 function move(dx,dy){
 if(s.page!=="clinic")return;
 const length=Math.hypot(dx,dy);if(length>1){dx/=length;dy/=length}
 const nx=Math.max(0,Math.min(100,x+dx*3)),ny=Math.max(0,Math.min(100,y+dy*3));
 if(clear(nx,y))x=nx;
 if(clear(x,ny))y=ny;
 draw();
 }
 if(!clear(x,y)){x=37;y=82}draw();
 if(s.patientTransfer){talk.hidden=true;status.textContent="Patient is walking to the dental chair…";}if(s.patientSeated){talk.hidden=!nearChair();talk.textContent="Ask Patient Before Examination →"}talk.onclick=()=>{if(s.patientSeated){if(!nearChair()){toast("Approach the patient at the dental chair first.");return}s.patientSeated=false;save();go("preexam");return}if(talk.disabled)return;s.patientIntro=true;save();talk.disabled=true;talk.textContent="Meeting Patient…";document.querySelector(".walk-stage")?.dispatchEvent(new Event("patient-focus"));window.setTimeout(()=>{if(s.page==="clinic")go("history")},1900)};
 import("./clinic-3d.js?v=patient-preview-3").then(async m=>{await m.mountClinic3D(document.querySelector(".walk-stage"),()=>({x,y}));if(s.patientTransfer){const stage=document.querySelector(".walk-stage");stage?.addEventListener("patient-seated",()=>{if(s.page!=="clinic")return;s.patientTransfer=false;s.patientSeated=true;save();talk.hidden=!nearChair();talk.disabled=false;talk.textContent="Ask Patient Before Examination →";status.textContent="Patient seated · Walk to the dental chair to speak before examination"},{once:true});stage?.dispatchEvent(new Event("patient-to-chair"))}}).catch(e=>console.warn("3D fallback",e));
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
 if((e.key==="Enter"||e.key.toLowerCase()==="e")&&!document.querySelector("#walk-talk")?.hidden){e.preventDefault();document.querySelector("#walk-talk")?.click()}
});
if(s.page==="clinic")render();
})();