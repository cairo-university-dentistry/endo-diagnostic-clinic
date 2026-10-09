/* v0.8 stylized patient portrait: lightweight procedural Three.js face */
let current=null;
let requestId=0;
let activeStage=null;
let setEmotion=null;
export function updatePatientFace(stage,expression){if(stage&&stage===activeStage&&setEmotion){setEmotion(expression);return true}return false}
export async function mountPatientFace(stage,expression="neutral"){
 const request=++requestId;
 activeStage=stage;
 if(!stage||!window.WebGLRenderingContext)return;
 let T;try{T=await import("https://cdn.jsdelivr.net/npm/three@0.160.1/build/three.module.js")}catch(e){return}
 if(!stage.isConnected||request!==requestId)return;
 // Prefer a production GLB avatar with facial blendshapes when a licensed asset is configured.
 // Until then retain the procedural prototype rather than claim it is cinematic.
 const modelUrl=window.ENDO_PATIENT_MODEL_URL;
 if(modelUrl){
   try{
     const {GLTFLoader}=await import("https://cdn.jsdelivr.net/npm/three@0.160.1/examples/jsm/loaders/GLTFLoader.js");
     const loader=new GLTFLoader();
     const gltf=await loader.loadAsync(modelUrl);
     if(!stage.isConnected||request!==requestId)return;
     return mountRiggedPortrait(stage,T,gltf,expression);
   }catch(err){console.warn("Avatar unavailable; showing prototype",err)}
 }

 if(request!==requestId||!stage.isConnected)return;
 if(current)current();
 const scene=new T.Scene(),camera=new T.PerspectiveCamera(30,1,.1,30);
 camera.position.set(0,.08,7.8);camera.lookAt(0,.05,0);
 const renderer=new T.WebGLRenderer({alpha:true,antialias:true,powerPreference:"low-power"});
 renderer.setPixelRatio(Math.min(devicePixelRatio||1,1.5));renderer.outputColorSpace=T.SRGBColorSpace;
 renderer.domElement.className="patient-3d-canvas";stage.prepend(renderer.domElement);
 const light=new T.HemisphereLight(0xffe7d2,0x493c42,2.3);scene.add(light);
 const key=new T.DirectionalLight(0xffdfbc,2.6);key.position.set(-3,5,6);scene.add(key);
 const fill=new T.DirectionalLight(0x9ab8c4,1.2);fill.position.set(3,1,3);scene.add(fill);
 const skin=new T.MeshStandardMaterial({color:0xc48c70,roughness:.87}),hair=new T.MeshStandardMaterial({color:0x241e1c,roughness:.96}),white=new T.MeshStandardMaterial({color:0xf4eee6,roughness:.3}),iris=new T.MeshStandardMaterial({color:0x493426,roughness:.25}),black=new T.MeshStandardMaterial({color:0x161514,roughness:.22}),lip=new T.MeshStandardMaterial({color:0x864d47,roughness:.82}),shirt=new T.MeshStandardMaterial({color:0x853d46,roughness:.92});
 const head=new T.Group();scene.add(head);
 function ball(parent,m,x,y,z,sx,sy,sz){const o=new T.Mesh(new T.SphereGeometry(1,28,20),m);o.position.set(x,y,z);o.scale.set(sx,sy,sz);parent.add(o);return o}
 ball(head,skin,0,.22,0,.89,1.16,.77);
 ball(head,skin,-.86,-.03,0,.16,.27,.19);ball(head,skin,.86,-.03,0,.16,.27,.19);
 ball(head,hair,0,1.17,-.11,.93,.38,.75);
 for(let i=0;i<7;i++)ball(head,hair,-.65+i*.22,1.24+Math.sin(i*1.5)*.09,.49,.25,.2,.21);
 ball(head,skin,0,-.15,.76,.16,.37,.23);
 ball(head,skin,0,-.33,.9,.23,.12,.15);
 const eyes=[],brows=[];
 for(const sign of [-1,1]){
   const x=sign*.36;
   ball(head,white,x,.38,.682,.245,.145,.105);
   ball(head,iris,x,.38,.775,.104,.11,.05);
   ball(head,black,x,.38,.818,.054,.069,.024);
   ball(head,white,x-.025,.425,.843,.023,.027,.01);
   const brow=ball(head,hair,x,.68,.71,.28,.055,.08);brows.push(brow);
   eyes.push(ball(head,skin,x,.38,.805,.26,.013,.08));
 }
 const mouth=ball(head,lip,0,-.57,.73,.29,.055,.075);
 const mouthInner=ball(head,black,0,-.57,.791,.18,.014,.012);
 const torso=ball(scene,shirt,0,-1.79,-.24,1.35,.95,.7);
 const neck=ball(scene,skin,0,-1.06,.08,.32,.48,.33);
 const configs={pain:[-.15,.7,1],uncertain:[.12,.55,.7],concerned:[-.06,.6,.85],tired:[-.07,.45,.65],neutral:[0,.55,.7]};let config=configs[expression]||configs.neutral;setEmotion=next=>{expression=next;config=configs[next]||configs.neutral;start=performance.now()};
 brows[0].rotation.z=expression==="pain"?-.28:expression==="uncertain"?.2:-.06;
 brows[1].rotation.z=expression==="pain"?.28:expression==="uncertain"?.12:.06;
 brows[0].position.y=config[1];brows[1].position.y=config[1]+(expression==="uncertain"?.13:0);
 const reduce=window.matchMedia?.("(prefers-reduced-motion: reduce)").matches||false;
 let disposed=false,raf=0,start=performance.now();
 function resize(){const w=stage.clientWidth,h=stage.clientHeight;if(!w||!h)return;renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix()}
 const ro=new ResizeObserver(resize);ro.observe(stage);resize();
 function frame(t){if(disposed)return;if(!stage.isConnected){dispose();return}
 const dt=(t-start)/1000,blink=!reduce&&(dt%4.8<.14||dt%7.1<.11);
 eyes.forEach(e=>e.scale.y=blink?.10:.013);
 const speaking=!reduce&&dt<2.9;mouth.scale.y=speaking?.055+Math.abs(Math.sin(dt*12))*.1:.055;
 mouthInner.scale.y=speaking?.014+Math.abs(Math.sin(dt*12))*.1:.014;
 brows[0].position.y+=(config[1]-brows[0].position.y)*.13;brows[1].position.y+=(config[1]-brows[1].position.y)*.13;head.rotation.z=reduce?0:config[0]+Math.sin(dt*.8)*.023;
 head.rotation.y=reduce?0:Math.sin(dt*.65)*.045;
 renderer.render(scene,camera);raf=requestAnimationFrame(frame)}
 function dispose(){if(disposed)return;disposed=true;cancelAnimationFrame(raf);ro.disconnect();scene.traverse(o=>{o.geometry?.dispose();o.material?.dispose?.()});renderer.dispose();renderer.domElement.remove();if(current===dispose)current=null}
 current=dispose;stage.classList.add("patient-three-ready");raf=requestAnimationFrame(frame);
}

async function mountRiggedPortrait(stage,T,gltf,expression){
 if(current)current();
 const scene=new T.Scene(),camera=new T.PerspectiveCamera(32,1,.1,100);
 const renderer=new T.WebGLRenderer({alpha:true,antialias:true,powerPreference:"low-power"});
 renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,1.5));
 renderer.outputColorSpace=T.SRGBColorSpace;
 renderer.domElement.className="patient-3d-canvas";stage.prepend(renderer.domElement);
 scene.add(new T.HemisphereLight(0xffeadb,0x344350,2.1));
 const key=new T.DirectionalLight(0xffe5cf,2.3);key.position.set(-3,5,5);scene.add(key);
 const rim=new T.DirectionalLight(0xa5c7d8,1.3);rim.position.set(3,2,-3);scene.add(rim);
 const avatar=gltf.scene;scene.add(avatar);avatar.updateMatrixWorld(true);
 // Hide disconnected arms in the temporary half-body model.
 const initial=new T.Box3().setFromObject(avatar),origin=initial.getCenter(new T.Vector3()),span=initial.getSize(new T.Vector3());
 avatar.traverse(part=>{
  if(!part.isMesh)return;
  const mid=new T.Box3().setFromObject(part).getCenter(new T.Vector3());
  if(/hand|finger|wrist|arm/i.test(part.name)||Math.abs(mid.x-origin.x)>span.x*.29)part.visible=false;
 });
 const box=new T.Box3().setFromObject(avatar),center=box.getCenter(new T.Vector3()),size=box.getSize(new T.Vector3());
 // Portrait crop: focus on upper torso, not full-body bounds.
 const focusY=box.max.y-size.y*.13;
 const portraitHeight=Math.max(size.y*.28,size.x*.4);
 const dist=portraitHeight/(2*Math.tan(T.MathUtils.degToRad(camera.fov/2)))*.95;
 camera.position.set(center.x,focusY,center.z+dist);
 camera.lookAt(center.x,focusY,center.z);
 const meshes=[],headBones=[];
 avatar.traverse(o=>{
   if(o.isMesh&&o.morphTargetDictionary)meshes.push(o);
   if(o.isBone&&/^(head|mixamorighead|rig_head)$/i.test(o.name))headBones.push({bone:o,rotation:o.rotation.clone()});
 });
 const expressions={
   pain:{browDownLeft:.75,browDownRight:.75,eyeSquintLeft:.5,eyeSquintRight:.5,mouthFrownLeft:.6,mouthFrownRight:.6},
   uncertain:{browOuterUpLeft:.8,browOuterUpRight:.25,browInnerUp:.3,mouthPressLeft:.25,mouthPressRight:.25},
   concerned:{browInnerUp:.7,eyeWideLeft:.25,eyeWideRight:.25,mouthFrownLeft:.35,mouthFrownRight:.35},
   tired:{eyeSquintLeft:.55,eyeSquintRight:.55,browInnerUp:.25,mouthFrownLeft:.25,mouthFrownRight:.25}
 };
 let emotion=expressions[expression]||{};
 setEmotion=(next)=>{expression=next;emotion=expressions[next]||{}};
 let disposed=false,raf=0;const start=performance.now(),reduce=window.matchMedia?.("(prefers-reduced-motion: reduce)").matches||false;
 function resize(){const w=stage.clientWidth,h=stage.clientHeight;if(!w||!h)return;renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix()}
 const ro=new ResizeObserver(resize);ro.observe(stage);resize();
 function frame(t){
   if(disposed)return;if(!stage.isConnected){dispose();return}
   const seconds=(t-start)/1000,blink=!reduce&&(seconds%4.9<.12),talk=!reduce&&seconds<2.8?Math.abs(Math.sin(seconds*10))*.35:0;
   for(const mesh of meshes){
     for(const [name,index] of Object.entries(mesh.morphTargetDictionary)){
       const target=blink&&/eyeBlink(Left|Right)|eyesClosed/i.test(name)?1:
        /jawOpen|mouthOpen/i.test(name)?talk:(emotion[name]||0);
       mesh.morphTargetInfluences[index]+=(target-mesh.morphTargetInfluences[index])*.14;
     }
   }
   for(const {bone,rotation} of headBones){
     bone.rotation.y=rotation.y+(reduce?0:Math.sin(seconds*.7)*.045);
     bone.rotation.z=rotation.z+(reduce?0:Math.sin(seconds*.6)*.025);
   }
   renderer.render(scene,camera);raf=requestAnimationFrame(frame)
 }
 function dispose(){
   if(disposed)return;disposed=true;cancelAnimationFrame(raf);ro.disconnect();
   avatar.traverse(o=>{o.geometry?.dispose();if(o.material){const mats=Array.isArray(o.material)?o.material:[o.material];mats.forEach(m=>m.dispose())}});
   renderer.dispose();renderer.domElement.remove();stage.classList.remove("patient-three-ready");if(current===dispose)current=null;if(activeStage===stage){activeStage=null;setEmotion=null}
 }
 current=dispose;stage.classList.add("patient-three-ready");raf=requestAnimationFrame(frame);
}
