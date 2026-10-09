/* v1.3 — University of Dundee Permanent Dentition (CC BY 4.0).
   Tooth numbering is a preliminary left/right geometric mapping pending clinical QA. */
let activeDispose=null;
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
 function frame(){if(dead)return;if(!host.isConnected){dispose();return}renderer.render(scene,camera);raf=requestAnimationFrame(frame)}
 function dispose(){if(dead)return;dead=true;cancelAnimationFrame(raf);ro.disconnect();renderer.dispose();renderer.domElement.remove();status.remove();teeth.forEach(t=>t.traverse(o=>{if(o.isMesh&&o.material!==o.userData.baseMaterial)o.material.dispose()}));if(activeDispose===dispose)activeDispose=null}
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
