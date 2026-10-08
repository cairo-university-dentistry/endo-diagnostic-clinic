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
 box(13,.25,9,0,-.18,0,materials.floor);
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
 const patient=character(materials.red,2.7,-1.55);let focusPatient=false;let focusStart=0;const focusTarget=new T.Vector3(0,0,0);stage.addEventListener("patient-focus",()=>{focusPatient=true;focusStart=performance.now()});
 // patient ring
 const ring=new T.Mesh(new T.RingGeometry(.44,.53,32),new T.MeshBasicMaterial({color:0xc8ad7c,side:T.DoubleSide}));
 ring.rotation.x=-Math.PI/2;ring.position.set(2.7,.025,-1.55);scene.add(ring);
 let disposed=false,raf=0,last=0;
 function size(){if(disposed)return;const w=stage.clientWidth,h=stage.clientHeight;if(!w||!h)return;renderer.setSize(w,h,false);const aspect=w/h;camera.left=-7.4*aspect;camera.right=7.4*aspect;camera.top=7.4;camera.bottom=-7.4;camera.updateProjectionMatrix()}
 const ro=new ResizeObserver(size);ro.observe(stage);size();
 function frame(t){if(disposed)return;if(!stage.isConnected||document.querySelector(".walk-stage")!==stage){dispose();return}
 const p=getPosition();if(p){const tx=(p.x/100-.5)*12.2,tz=(p.y/100-.5)*8.2;doctor.position.x+=(tx-doctor.position.x)*.25;doctor.position.z+=(tz-doctor.position.z)*.25;if(Math.abs(tx-doctor.position.x)+Math.abs(tz-doctor.position.z)>.04)doctor.rotation.y=Math.atan2(tx-doctor.position.x,tz-doctor.position.z)}
 patient.position.y=Math.sin(t*.0017)*.018;ring.material.opacity=.7;if(focusPatient){camera.position.lerp(new T.Vector3(6,7,9),.09);focusTarget.lerp(new T.Vector3(2.7,1,-1.55),.09);camera.lookAt(focusTarget);const u=Math.min(1,(t-focusStart)/1700);camera.zoom=1+2.7*u*u*(3-2*u);camera.updateProjectionMatrix()}
 renderer.render(scene,camera);raf=requestAnimationFrame(frame)}
 function dispose(){if(disposed)return;disposed=true;cancelAnimationFrame(raf);ro.disconnect();scene.traverse(o=>{o.geometry?.dispose();if(o.material){const ms=Array.isArray(o.material)?o.material:[o.material];ms.forEach(m=>m.dispose())}});renderer.dispose();renderer.domElement.remove();if(active?.dispose===dispose)active=null}
 active={dispose};stage.classList.add("three-ready");raf=requestAnimationFrame(frame);
 return dispose;
}
