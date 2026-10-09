/* v1.3 — University of Dundee Permanent Dentition (CC BY 4.0).
   Tooth numbering is a preliminary left/right geometric mapping pending clinical QA. */
let activeDispose=null;
let activeInstrument=null;
export function performInstrument(tool,fdi){if(activeInstrument)activeInstrument(tool,fdi)}
export async function mountExam3D(host,onSelect){
 if(!host)return;
 const T=await import("https://cdn.jsdelivr.net/npm/three@0.160.1/build/three.module.js");
 const {GLTFLoader}=await import("https://cdn.jsdelivr.net/npm/three@0.160.1/examples/jsm/loaders/GLTFLoader.js");
 if(!host.isConnected)return;
 if(activeDispose)activeDispose();
 const scene=new T.Scene();scene.background=new T.Color(0x101d21);
 const camera=new T.PerspectiveCamera(38,1,.1,100);camera.position.set(0,2.8,-12);camera.lookAt(0,0,0);
 const renderer=new T.WebGLRenderer({antialias:true,powerPreference:"low-power"});
 renderer.setPixelRatio(Math.min(devicePixelRatio||1,1.5));renderer.outputColorSpace=T.SRGBColorSpace;
 renderer.domElement.style.cssText="width:100%;height:100%;display:block;touch-action:none";host.appendChild(renderer.domElement);
 scene.add(new T.HemisphereLight(0xffffff,0x43515b,2.7));
 const light=new T.DirectionalLight(0xffffff,2.4);light.position.set(-4,7,-5);scene.add(light);
 const root=new T.Group();root.rotation.y=Math.PI;scene.add(root);
 const arches={upper:new T.Group(),lower:new T.Group()};root.add(arches.upper,arches.lower);
 const status=document.createElement("div");status.style.cssText="position:absolute;top:92px;left:15px;right:15px;text-align:center;color:#dfcba4;font:12px sans-serif;pointer-events:none";status.textContent="Loading anatomical dentition…";host.parentElement.appendChild(status);
 let teeth=[],selected=null,drag=false,px=0,py=0,dead=false,raf=0;
 const instrument=new T.Group();scene.add(instrument);instrument.visible=false;
 const steel=new T.MeshStandardMaterial({color:0xbac9d0,metalness:.85,roughness:.22});
 const dark=new T.MeshStandardMaterial({color:0x30434a,metalness:.28,roughness:.5});
 const cotton=new T.MeshStandardMaterial({color:0xeaf5fc,roughness:1});
 function cylinder(parent,top,bottom,height,material,y){
  const mesh=new T.Mesh(new T.CylinderGeometry(top,bottom,height,12),material);
  mesh.position.y=y;parent.add(mesh);return mesh;
 }
 const coldTool=new T.Group();instrument.add(coldTool);
 cylinder(coldTool,.042,.042,.67,dark,.08);
 cylinder(coldTool,.022,.025,.24,steel,-.36);
 const pellet=new T.Mesh(new T.SphereGeometry(.082,16,12),cotton);
 pellet.scale.set(.9,.68,.9);pellet.position.y=-.51;coldTool.add(pellet);
 const percussionTool=new T.Group();instrument.add(percussionTool);
 cylinder(percussionTool,.046,.052,.78,steel,0);
 cylinder(percussionTool,.065,.065,.19,dark,.2);
 const percussionEnd=new T.Mesh(new T.SphereGeometry(.042,12,10),steel);
 percussionEnd.position.y=-.41;percussionTool.add(percussionEnd);
 const visualTool=new T.Group();instrument.add(visualTool);
 cylinder(visualTool,.025,.027,.65,steel,.06);
 const mirrorStem=cylinder(visualTool,.017,.017,.22,steel,-.37);
 mirrorStem.rotation.z=.38;
 const mirror=new T.Mesh(new T.CylinderGeometry(.14,.14,.018,28),new T.MeshStandardMaterial({color:0xc6e9f4,metalness:.72,roughness:.12,side:T.DoubleSide}));
 mirror.rotation.x=Math.PI/2;mirror.position.set(-.08,-.51,0);visualTool.add(mirror);
 const palpationTool=new T.Group();instrument.add(palpationTool);
 const glove=new T.MeshStandardMaterial({color:0x6eb6d2,roughness:.85});
 // Anatomical approximation of a gloved hand: palm, thumb and two rounded fingertips.
 const palm=new T.Mesh(new T.SphereGeometry(.22,24,18),glove);
 palm.scale.set(.94,1.35,.52);palm.position.set(0,.32,0);palpationTool.add(palm);
 for(let i=0;i<2;i++){
  const digit=new T.Group();palpationTool.add(digit);
  digit.position.set((i-.5)*.18,.06,0);
  const shaft=cylinder(digit,.061,.049,.32,glove,-.12);
  const tip=new T.Mesh(new T.SphereGeometry(.055,16,12),glove);
  tip.scale.set(1,.7,1);tip.position.y=-.29;digit.add(tip);
 }
 const thumb=cylinder(palpationTool,.074,.054,.27,glove,.12);
 thumb.rotation.z=-.8;thumb.position.x=-.22;
 const cuff=cylinder(palpationTool,.17,.18,.2,glove,.65);
 const eptTool=new T.Group();instrument.add(eptTool);
 const eptBody=cylinder(eptTool,.095,.085,.48,dark,.12);
 cylinder(eptTool,.032,.032,.27,steel,-.24);
 const probe=cylinder(eptTool,.012,.012,.16,steel,-.45);
 const eptIndicator=new T.Mesh(new T.BoxGeometry(.1,.09,.015),new T.MeshBasicMaterial({color:0x65d3a4}));
 eptIndicator.position.set(0,.2,.09);eptTool.add(eptIndicator);
 const toolGroups={"Cold Test":coldTool,"Percussion":percussionTool,"Visual":visualTool,"Palpation":palpationTool,"EPT":eptTool};
 let motion=null;
 activeInstrument=(tool,fdi)=>{
  if(!toolGroups[tool])return;
  const tooth=teeth.find(t=>t.userData.fdi===fdi&&t.parent.visible);
  if(!tooth||dead)return;
  tooth.updateWorldMatrix(true,true);
  const bounds=new T.Box3().setFromObject(tooth);
  const target=bounds.getCenter(new T.Vector3());
  Object.entries(toolGroups).forEach(([name,group])=>{group.visible=name===tool});
  instrument.visible=true;
  if(tool==="Palpation")target.add(new T.Vector3(0,fdi<30?-.36:.36,.36));
  motion={target,start:performance.now(),tool};
 };
 function clearPick(){selected=null;teeth.forEach(t=>t.traverse(o=>{if(o.isMesh&&o.userData.baseMaterial)o.material=o.userData.baseMaterial}));onSelect?.(null,null)}
 function pick(t){clearPick();selected=t;t.traverse(o=>{if(o.isMesh){o.material=o.userData.baseMaterial.clone();o.material.color.set(0xffd18b);o.material.emissive?.set(0x49300e)}});onSelect?.(t.userData.fdi,t.userData.arch)}
 function tap(e){const b=renderer.domElement.getBoundingClientRect();const p=new T.Vector2((e.clientX-b.left)/b.width*2-1,-(e.clientY-b.top)/b.height*2+1);const ray=new T.Raycaster();ray.setFromCamera(p,camera);const hit=ray.intersectObjects(teeth.filter(t=>t.parent.visible),true)[0];if(hit){let o=hit.object;while(o&&!teeth.includes(o))o=o.parent;if(o)pick(o)}}
 function setArch(mode){arches.upper.visible=mode!=="lower";arches.lower.visible=mode!=="upper";if(selected&&!selected.parent.visible)clearPick()}
 const controls=host.parentElement.querySelectorAll("[data-arch]");
 controls.forEach(b=>b.addEventListener("click",()=>{controls.forEach(x=>x.classList.toggle("active",x===b));setArch(b.dataset.arch)}));
 renderer.domElement.addEventListener("pointerdown",e=>{drag=false;px=e.clientX;py=e.clientY;renderer.domElement.setPointerCapture(e.pointerId)});
 renderer.domElement.addEventListener("pointermove",e=>{if(!renderer.domElement.hasPointerCapture(e.pointerId))return;const dx=e.clientX-px,dy=e.clientY-py;if(Math.abs(dx)+Math.abs(dy)>3)drag=true;if(drag){root.rotation.y+=dx*.008;root.rotation.x=Math.max(-1.2,Math.min(1.2,root.rotation.x+dy*.005));px=e.clientX;py=e.clientY}});
 renderer.domElement.addEventListener("pointerup",e=>{if(!drag)tap(e)});
 function zoom(delta){camera.position.z=-Math.max(6,Math.min(21,Math.abs(camera.position.z)+delta))}
 renderer.domElement.addEventListener("wheel",e=>{e.preventDefault();zoom(e.deltaY*.012)},{passive:false});
 let pinch=null;renderer.domElement.addEventListener("touchmove",e=>{if(e.touches.length!==2){pinch=null;return}e.preventDefault();const d=Math.hypot(e.touches[0].clientX-e.touches[1].clientX,e.touches[0].clientY-e.touches[1].clientY);if(pinch!==null)zoom((pinch-d)*.018);pinch=d},{passive:false});renderer.domElement.addEventListener("touchend",()=>pinch=null);
 function resize(){if(dead)return;const w=host.clientWidth,h=host.clientHeight;if(w&&h){renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix()}}
 const ro=new ResizeObserver(resize);ro.observe(host);resize();
 function frame(){if(dead)return;if(!host.isConnected){dispose();return}if(motion){
  const progress=(performance.now()-motion.start)/1000;
  if(progress>=1.45){instrument.visible=false;motion=null}
  else{
   const approach=Math.min(1,progress/.65);
   const retreat=progress>1.05?Math.min(1,(progress-1.05)/.4):0;
   const distance=.9*(1-approach+retreat);
   instrument.position.copy(motion.target).add(motion.tool==="Palpation"?new T.Vector3(.12+distance*.5,.24+distance*.4,.08+distance):new T.Vector3(.38+distance,.55+distance,.4));
   instrument.rotation.z=motion.tool==="Cold Test"?-.6:motion.tool==="Percussion"?(-.65+(progress>.65&&progress<1.05?Math.sin((progress-.65)*48)*.2:0)):motion.tool==="Visual"?-.95:motion.tool==="Palpation"?-.35:-.55;
  }
 }
 renderer.render(scene,camera);raf=requestAnimationFrame(frame)}
 function dispose(){if(dead)return;dead=true;cancelAnimationFrame(raf);ro.disconnect();renderer.dispose();renderer.domElement.remove();status.remove();if(activeInstrument){activeInstrument=null}instrument.traverse(o=>{if(o.geometry)o.geometry.dispose()});arches.upper.traverse(o=>{if(o.userData?.cariesOverlay){o.geometry.dispose();o.material.dispose()}});teeth.forEach(t=>t.traverse(o=>{if(o.isMesh&&o.material!==o.userData.baseMaterial)o.material.dispose()}));if(activeDispose===dispose)activeDispose=null}
 activeDispose=dispose;frame();
 try{
  const gltf=await new GLTFLoader().loadAsync("./permanent-dentition-mobile.glb");
  if(dead)return dispose;
  const mandible=gltf.scene.getObjectByName("Mandible_group1");
  const maxilla=gltf.scene.getObjectByName("group2");
  if(!mandible||!maxilla)throw Error("Anatomy groups not found");
  // Each immediate child represents one tooth, potentially with multiple mesh parts.
  const groups=[{source:mandible,target:arches.lower,arch:"lower",expected:16},{source:maxilla,target:arches.upper,arch:"upper",expected:14}];
  const worldBox=new T.Box3().setFromObject(gltf.scene);
  const center=worldBox.getCenter(new T.Vector3());const size=worldBox.getSize(new T.Vector3());
  const scale=5.8/Math.max(size.x,size.y,size.z);
  gltf.scene.updateMatrixWorld(true);
  for(const g of groups){
   const units=g.source.children.slice().filter(n=>{let found=false;n.traverse(o=>{if(o.isMesh)found=true});return found});
   if(units.length!==g.expected)throw Error("Unexpected tooth count: "+g.arch+" "+units.length);
   const indexed=units.map(n=>{const b=new T.Box3().setFromObject(n);return {node:n,x:b.getCenter(new T.Vector3()).x}});
   indexed.sort((a,b)=>b.x-a.x);
   const half=indexed.length/2;
   indexed.forEach(({node},i)=>{
    const tooth=new T.Group();
    // Bake the original model hierarchy transforms into a tooth-local scene.
    node.updateWorldMatrix(true,true);
    const cloned=node.clone(true);
    cloned.matrix.copy(node.matrixWorld);cloned.matrix.decompose(cloned.position,cloned.quaternion,cloned.scale);
    tooth.add(cloned);
    tooth.position.copy(center).multiplyScalar(-scale);
    tooth.scale.setScalar(scale);
    const number=i<half?half-i:i-half+1;
    const quadrant=g.arch==="upper"?(i<half?1:2):(i<half?4:3);
    tooth.userData={fdi:quadrant*10+number,arch:g.arch};
    tooth.traverse(o=>{if(o.isMesh){o.material=o.material.clone();o.userData.baseMaterial=o.material}});
    g.target.add(tooth);teeth.push(tooth);
    if(tooth.userData.fdi===26){
      // Non-destructive per-vertex staining of the existing anatomical surface.
      tooth.updateMatrixWorld(true);
      const bounds=new T.Box3().setFromObject(tooth);
      const centerPoint=bounds.getCenter(new T.Vector3());
      const dims=bounds.getSize(new T.Vector3());
      const minSpan=Math.min(dims.x,dims.z);
      // Visible occlusal caries cue for the teaching case; decorative, not a new tooth mesh.
      const lesionMaterial=new T.MeshStandardMaterial({color:0x49301b,roughness:1,transparent:true,opacity:.9,depthWrite:false,side:T.DoubleSide});
      const lesion=new T.Mesh(new T.SphereGeometry(1,20,12),lesionMaterial);
      lesion.scale.set(Math.max(.07,dims.x*.18),Math.max(.025,dims.y*.025),Math.max(.07,dims.z*.18));
      lesion.position.set(centerPoint.x,bounds.min.y+dims.y*.075,centerPoint.z);
      lesion.userData.cariesOverlay=true;
      scene.add(lesion);
      // Keep the lesion fixed to the same rotation as the anatomical arches.
      arches.upper.attach(lesion);

      const position=new T.Vector3();
      tooth.traverse(mesh=>{
        if(!mesh.isMesh||!mesh.geometry?.attributes?.position)return;
        mesh.geometry=mesh.geometry.clone();
        const vertices=mesh.geometry.attributes.position;
        const colors=new Float32Array(vertices.count*3);
        let changed=false;
        for(let v=0;v<vertices.count;v++){
          position.fromBufferAttribute(vertices,v).applyMatrix4(mesh.matrixWorld);
          const x=(position.x-centerPoint.x)/minSpan;
          const z=(position.z-centerPoint.z)/minSpan;
          const depth=(position.y-bounds.min.y)/Math.max(dims.y,.001);
          const fissure=Math.abs(z-.13*Math.sin(x*12))*.9+Math.abs(x)*.25;
          const branch=Math.abs(x+.10*Math.sin(z*15))*.9+Math.abs(z)*.45;
          const irregular=.018*Math.sin(x*43+z*27)+.012*Math.cos(z*51-x*17);
          const track=Math.min(fissure,branch);
          const edge=T.MathUtils.smoothstep(track+irregular,.035,.17);
          const crown=1-T.MathUtils.smoothstep(depth,.13,.26);
          const stain=Math.max(0,Math.min(1,(1-edge)*crown*.82));
          const warmth=.74*stain;
          colors[v*3]=1-.67*stain;
          colors[v*3+1]=1-.83*warmth;
          colors[v*3+2]=1-.9*stain;
          if(stain>.03)changed=true;
        }
        if(changed){
          mesh.geometry.setAttribute("color",new T.BufferAttribute(colors,3));
          mesh.material=mesh.material.clone();
          mesh.material.vertexColors=true;
          mesh.material.needsUpdate=true;
          mesh.userData.baseMaterial=mesh.material;
        }
      });
    }
   });
  }
  status.textContent="University of Dundee · CC BY 4.0 · Anatomical training model";
 }catch(err){console.error("Anatomical model load failed",err);status.textContent="Unable to load anatomical model. Please reload."; }
 return dispose;
}
