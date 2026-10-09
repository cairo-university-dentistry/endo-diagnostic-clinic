/* v0.5 WebGL clinic: real Three.js geometry, with CSS fallback. */
let active=null;
const THREE_URL="https://cdn.jsdelivr.net/npm/three@0.160.1/build/three.module.js";
export async function mountClinic3D(stage,getPosition){
 if(!stage||!window.WebGLRenderingContext)return;
 let T;try{T=await import(THREE_URL)}catch(e){console.warn("3D unavailable, using 2D clinic",e);return}
 if(!stage.isConnected||document.querySelector(".walk-stage")!==stage)return;
 if(active)active.dispose();
 const scene=new T.Scene();scene.background=new T.Color(0x11191c);
 const camera=new T.OrthographicCamera(-8.8,8.8,6.5,-6.5,.1,80);
 camera.position.set(13,17,19);camera.lookAt(0,0,0);
 const renderer=new T.WebGLRenderer({antialias:true,alpha:false,powerPreference:"low-power"});
 renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,1.6));
 renderer.outputColorSpace=T.SRGBColorSpace;
 renderer.shadowMap.enabled=false;
 renderer.domElement.className="webgl-clinic";
 stage.insertBefore(renderer.domElement,stage.firstChild);
 const amb=new T.HemisphereLight(0xe8f1ef,0x22272b,2.3);scene.add(amb);
 const key=new T.DirectionalLight(0xffebd0,2.4);key.position.set(-5,13,7);scene.add(key);
 const materials={floor:0x313d40,wall:0x596366,ivory:0xe8e5db,metal:0x87989a,wood:0x9e9078,teal:0x76a39c,red:0xa24b52,skin:0xc6957d,dark:0x1a2428,glass:0x92b7ba};
 function mat(c){return new T.MeshStandardMaterial({color:c,roughness:.75,metalness:c===materials.metal ? 0.35 : 0})}
 function box(w,h,d,x,y,z,c){const o=new T.Mesh(new T.BoxGeometry(w,h,d),mat(c));o.position.set(x,y,z);scene.add(o);return o}
 function cylinder(r,h,x,y,z,c){const o=new T.Mesh(new T.CylinderGeometry(r,r,h,14),mat(c));o.position.set(x,y,z);scene.add(o);return o}
 box(16,.25,11,0,-.18,0,materials.floor);
 // Expanded east-side radiology suite (visual room, imaging workflow comes later).
 box(3.1,.25,3.1,6.4,-.17,-3.0,materials.floor);
 box(3.1,1.8,.13,6.4,.78,-4.52,materials.wall);
 box(.13,1.8,3.1,7.9,.78,-3.0,materials.wall);
 box(1.8,1.1,.1,6.5,1.1,-4.43,materials.dark);
 box(1.55,.85,.04,6.5,1.1,-4.36,materials.glass);
 cylinder(.38,1.55,6.25,.7,-2.5,materials.ivory);
 box(.9,.14,.65,6.25,1.45,-2.5,materials.metal);
 box(1.5,.7,.6,6.3,.4,-3.8,materials.ivory);
 // walls and partitions
 box(13,2.1,.18,0,.9,-4.45,materials.wall);box(.18,2.1,9,-6.45,.9,0,materials.wall);
 box(.14,.7,5,-1.1,.28,-1.7,materials.metal);
 // reception counter and monitor
 box(3.4,.85,1.0,-4.1,.5,-2.5,materials.wood);
 box(.8,.55,.12,-4.0,1.23,-2.8,materials.dark);
 box(.65,.34,.04,-4,1.24,-2.72,materials.glass);
 // waiting seats
 for(const x of [-4.9,-3.45]){box(1.1,.22,1.0,x,.38,1.65,materials.teal);box(1.1,.8,.18,x,.75,2.12,materials.teal);for(const dx of [-.38,.38])box(.1,.36,.1,x+dx,.1,1.65,materials.metal)}
 // operatory cabinets
 box(1.2,1.2,2.7,5.45,.55,-2.1,materials.ivory);
 for(const z of [-3,-2.1,-1.2])box(.08,.07,.52,4.81,.78,z,materials.metal);
 // dental chair base, reclining back, headrest
 cylinder(.8,.22,2.1,.06,.8,materials.metal);
 box(1.2,.35,2.0,2.1,.66,1.05,materials.ivory);
 const back=box(1.2,.3,1.6,2.1,1.13,-.52,materials.ivory);back.rotation.x=-.43;
 box(.75,.23,.48,2.1,1.6,-1.38,materials.ivory);
 box(.72,.25,.75,2.1,.58,2.42,materials.ivory);
 // light arm and luminaire
 cylinder(.08,2.6,.1,1.25,-2.7,materials.metal);
 const arm=box(2.4,.09,.1,1.05,2.45,-2.7,materials.metal);arm.rotation.z=-.12;
 cylinder(.55,.2,2.1,2.25,-2.7,0xf4e7bc);
 // instrument trolley
 box(1.3,.12,.75,.05,1.0,1.7,materials.metal);
 for(const x of [-.5,.55])for(const z of [1.4,2])box(.08,.95,.08,x,.48,z,materials.metal);
 // v0.9 clinic environment pass — richer geometry, still mobile friendly.
 const porcelain=0xd8ded9,accent=0x8dbbb1,brass=0xbca57c,screen=0x24363d;
 // Floor tiles and subtle grout: thin strips avoid heavy texture downloads.
 for(let x=-6;x<=6;x+=1.25)box(.012,.008,9,x,-.048,0,0x445154);
 for(let z=-4;z<=4;z+=1.25)box(13,.008,.012,0,-.048,z,0x445154);
 // Baseboards and wall cladding.
 box(12.8,.16,.06,0,.09,-4.31,0x9ca7a4);
 box(.06,.16,8.8,-6.31,.09,0,0x9ca7a4);
 for(const x of [-4.8,-2.8,-.8,1.2,3.2,5.2])box(.018,1.6,.035,x,1.12,-4.31,0x687476);
 // Ceiling-like soft luminous wall panels.
 for(const x of [-3.7,.1,3.9]){
  box(2.25,.11,.09,x,1.93,-4.27,0xdcece5);
  box(2.4,.035,.12,x,1.83,-4.25,brass);
 }
 // Reception front fluting and counter surface.
 box(3.6,.11,1.13,-4.1,1.0,-2.5,porcelain);
 for(let x=-5.6;x<=-2.6;x+=.21)box(.045,.7,.035,x,.52,-1.975,0x887965);
 // Waiting zone: plant, pot and slender trunk.
 cylinder(.31,.38,-5.65,.18,3.2,porcelain);
 cylinder(.07,.72,-5.65,.7,3.2,0x69594b);
 for(let i=0;i<6;i++){const a=i*Math.PI/3;const leaf=new T.Mesh(new T.SphereGeometry(.28,8,6),mat(0x477d67));leaf.position.set(-5.65+Math.cos(a)*.23,1.08,3.2+Math.sin(a)*.23);leaf.scale.set(.65,1.3,.65);scene.add(leaf)}
 // Clinical cabinets with inset doors and countertop.
 box(1.5,.13,3.1,5.42,1.25,-2.1,porcelain);
 for(const z of [-3.18,-2.18,-1.18]){
  box(.045,.84,.85,4.64,.62,z,0xe1e4dd);
  box(.055,.055,.42,4.59,.78,z,brass);
 }
 // Examination monitor on swivel mount.
 cylinder(.07,.7,3.95,1.6,-3.45,materials.metal);
 const monitor=box(1.15,.8,.08,3.95,2.03,-3.42,screen);
 box(.94,.59,.018,3.95,2.03,-3.36,0x75a5a0);
 box(.65,.035,.025,3.95,2.08,-3.34,0xd4e9df);
 // Dental unit: chair upholstery and armrests.
 box(1.28,.07,1.8,2.1,.88,.9,accent);
 for(const x of [1.4,2.8]){
  box(.14,.12,1.15,x,.94,.8,porcelain);
  cylinder(.07,.62,x,.56,.45,materials.metal);
 }
 // Tray instruments: subtle organized metal instruments.
 for(let i=0;i<5;i++){
  const inst=box(.035,.025,.44,-.48+i*.2,1.1,1.68,materials.metal);
  inst.rotation.y=.1;
 }
 // Overhead operatory lamp housing with a luminous inset.
 const lamp=box(.85,.14,.46,2.1,2.13,-2.7,porcelain);
 box(.62,.025,.32,2.1,2.04,-2.7,0xf3dca9);
 // A compact wall clock and hygiene dispenser.
 cylinder(.27,.045,-2.05,1.53,-4.28,porcelain);
 box(.25,.4,.14,-1.65,.92,-4.18,porcelain);
 box(.18,.055,.14,-1.65,.69,-4.1,materials.metal);
 // character rig
 function character(shirt,px,pz){
 const g=new T.Group();
 const body=new T.Mesh(new T.CylinderGeometry(.31,.35,.83,12),mat(shirt));body.position.y=.75;g.add(body);
 const head=new T.Mesh(new T.SphereGeometry(.26,12,10),mat(materials.skin));head.position.y=1.42;g.add(head);
 const hair=new T.Mesh(new T.SphereGeometry(.263,12,8,0,Math.PI*2,0,Math.PI*.43),mat(materials.dark));hair.position.y=1.49;g.add(hair);
 for(const dx of [-.17,.17]){const leg=new T.Mesh(new T.CylinderGeometry(.1,.11,.5,8),mat(materials.dark));leg.position.set(dx,.19,0);g.add(leg)}
 g.position.set(px,0,pz);scene.add(g);return g;
 }
 const doctor=character(materials.teal,-3.4,2.4);
 const patient=character(materials.red,-3.45,2.95);
 const seatedPosition=new T.Vector3(-3.45,0,2.95);
 const treatmentPosition=new T.Vector3(2.1,.78,.55);
 patient.position.copy(seatedPosition);
 patient.rotation.y=Math.PI;
 let patientJourney=null;
 const journeyPoints=[new T.Vector3(-3.45,0,2.95),new T.Vector3(-2.4,0,3.5),new T.Vector3(.85,0,3.5),new T.Vector3(3.65,0,3.5),new T.Vector3(3.65,0,.35),new T.Vector3(3.15,0,-.45),treatmentPosition];
 const beginJourney=()=>{patientJourney={start:performance.now()};focusPatient=false;camera.zoom=1;camera.position.set(13,17,19);focusTarget.set(0,0,0);camera.lookAt(focusTarget);camera.updateProjectionMatrix()};
 stage.addEventListener("patient-to-chair",beginJourney);
 // Temporary complete-body patient. The previous half-body GLB had detached hands.
 // Keep this reliable stand-in until a properly rigged cinematic asset is ready.
 for(const dx of [-.36,.36]){
  const arm=new T.Mesh(new T.CapsuleGeometry(.105,.48,5,9),mat(materials.red));
  arm.position.set(dx,1.01,0);arm.rotation.z=dx>0?-.16:.16;patient.add(arm);
  const hand=new T.Mesh(new T.SphereGeometry(.105,10,8),mat(materials.skin));
  hand.position.set(dx*1.19,.65,0);patient.add(hand);
 }
 // Dental operatory: rounded sculpted chair shell instead of only rectangular blocks.
 const upholstery=new T.MeshStandardMaterial({color:0x83bcb2,roughness:.72});
 function cushion(w,h,d,x,y,z,rot=0){
  const m=new T.Mesh(new T.BoxGeometry(w,h,d,1,1,1),upholstery);
  m.position.set(x,y,z);m.rotation.x=rot;scene.add(m);
  const edge=new T.Mesh(new T.BoxGeometry(w*.92,.055,d*.9),mat(0xa5d0c5));
  edge.position.set(x,y+h*.5+.014,z);edge.rotation.x=rot;scene.add(edge);
 }
 cushion(1.12,.16,1.5,2.1,.97,.75);
 cushion(1.1,.14,1.52,2.1,1.24,-.58,-.43);
 cushion(.69,.14,.39,2.1,1.66,-1.41,-.3);
 // Foot-operated pedestal, joint and tubing holder.
 cylinder(.24,.62,2.1,.34,.7,0x8b999a);
 cylinder(.32,.12,2.1,.68,.7,0xc5cdca);
 cylinder(.12,.2,3.24,.86,-.18,materials.metal);
 box(.5,.14,.3,3.24,1.03,-.18,porcelain);
 for(let i=0;i<3;i++){
  const tool=new T.Mesh(new T.CylinderGeometry(.028,.037,.42,8),mat(0x9eacaf));
  tool.position.set(3.04+i*.2,1.25,-.2);tool.rotation.z=.24;scene.add(tool);
 }
 // Assistant-side spittoon and compact water cup.
 cylinder(.31,.12,3.4,1.02,.9,porcelain);
 cylinder(.2,.08,3.4,1.11,.9,0x8baead);
 cylinder(.075,.18,3.7,1.1,.9,0xd5e7e2);
 // Ceiling task light with segmented arm, not just a hovering disc.
 const hinge=new T.Mesh(new T.SphereGeometry(.12,10,8),mat(materials.metal));
 hinge.position.set(2.1,2.43,-2.7);scene.add(hinge);
 for(const x of [1.77,2.43]){
  const grip=new T.Mesh(new T.CapsuleGeometry(.045,.2,4,7),mat(0x687c7c));
  grip.position.set(x,2.08,-2.7);scene.add(grip);
 }
 // A restrained illuminated clinical strip under the cabinetry.
 box(.1,.035,2.5,4.66,.17,-2.1,0xb5d6cb);
 let focusPatient=false;let focusStart=0;const focusTarget=new T.Vector3(0,0,0);stage.addEventListener("patient-focus",()=>{focusPatient=true;focusStart=performance.now()});
 // patient ring
 const ring=new T.Mesh(new T.RingGeometry(.44,.53,32),new T.MeshBasicMaterial({color:0xc8ad7c,side:T.DoubleSide}));
 ring.rotation.x=-Math.PI/2;ring.position.set(-3.45,.025,2.95);scene.add(ring);
 let disposed=false,raf=0,last=0;
 function suppressIdle(){return patient.position.x>0}
 function size(){if(disposed)return;const w=stage.clientWidth,h=stage.clientHeight;if(!w||!h)return;renderer.setSize(w,h,false);const aspect=w/h;camera.left=-7.4*aspect;camera.right=7.4*aspect;camera.top=7.4;camera.bottom=-7.4;camera.updateProjectionMatrix()}
 const ro=new ResizeObserver(size);ro.observe(stage);size();
 function frame(t){if(disposed)return;if(!stage.isConnected||document.querySelector(".walk-stage")!==stage){dispose();return}
 const p=getPosition();if(p){const tx=(p.x/100-.5)*12.2,tz=(p.y/100-.5)*8.2;doctor.position.x+=(tx-doctor.position.x)*.25;doctor.position.z+=(tz-doctor.position.z)*.25;if(Math.abs(tx-doctor.position.x)+Math.abs(tz-doctor.position.z)>.04)doctor.rotation.y=Math.atan2(tx-doctor.position.x,tz-doctor.position.z)}
 if(patientJourney){
 const elapsed=performance.now()-patientJourney.start;
 const segment=Math.min(journeyPoints.length-2,Math.floor(elapsed/1100));
 const u=Math.min(1,(elapsed-segment*1100)/1100);
 const smooth=u*u*(3-2*u);
 patient.position.lerpVectors(journeyPoints[segment],journeyPoints[segment+1],smooth);
 const direction=journeyPoints[segment+1].clone().sub(journeyPoints[segment]);
 patient.rotation.y=Math.atan2(direction.x,direction.z);
 if(segment<journeyPoints.length-2)patient.position.y+=Math.abs(Math.sin(elapsed*.012))*.025;
 ring.position.x=patient.position.x;ring.position.z=patient.position.z;
 if(elapsed>=(journeyPoints.length-1)*1100){patientJourney=null;patient.position.copy(treatmentPosition);patient.rotation.y=0;stage.dispatchEvent(new Event("patient-seated"))}
 }else if(!suppressIdle()){patient.position.y=seatedPosition.y+Math.sin(t*.0017)*.012}
 ring.material.opacity=.7;if(focusPatient){camera.position.lerp(new T.Vector3(6,7,9),.09);focusTarget.lerp(new T.Vector3(-3.45,1,2.95),.09);camera.lookAt(focusTarget);const u=Math.min(1,(t-focusStart)/1700);camera.zoom=1+2.7*u*u*(3-2*u);camera.updateProjectionMatrix()}
 renderer.render(scene,camera);raf=requestAnimationFrame(frame)}
 function dispose(){if(disposed)return;disposed=true;cancelAnimationFrame(raf);ro.disconnect();scene.traverse(o=>{o.geometry?.dispose();if(o.material){const ms=Array.isArray(o.material)?o.material:[o.material];ms.forEach(m=>m.dispose())}});renderer.dispose();renderer.domElement.remove();if(active?.dispose===dispose)active=null}
 active={dispose};stage.classList.add("three-ready");raf=requestAnimationFrame(frame);
 return dispose;
}
