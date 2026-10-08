/* v1.1 — selectable upper and lower dental arches, FDI identifiers.
   Simplified visual prototype, not diagnostic anatomical geometry. */
let disposeActive=null;
export async function mountExam3D(host,onSelect){
 if(!host)return;
 let T;try{T=await import("https://cdn.jsdelivr.net/npm/three@0.160.1/build/three.module.js")}catch(e){host.textContent="3D unavailable";return}
 if(!host.isConnected)return;
 if(disposeActive)disposeActive();
 const scene=new T.Scene();scene.background=new T.Color(0x101d21);
 const camera=new T.PerspectiveCamera(38,1,.1,60);
 camera.position.set(0,5.3,12.9);camera.lookAt(0,0,0);
 const renderer=new T.WebGLRenderer({antialias:true,powerPreference:"low-power"});
 renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,1.5));renderer.outputColorSpace=T.SRGBColorSpace;
 renderer.domElement.style.cssText="width:100%;height:100%;display:block;touch-action:none";host.appendChild(renderer.domElement);
 scene.add(new T.HemisphereLight(0xeaf8ff,0x24353b,2.4));
 const light=new T.DirectionalLight(0xfff2db,2.7);light.position.set(-4,8,7);scene.add(light);
 const gum=new T.MeshStandardMaterial({color:0xac626e,roughness:.77});
 const enamel=new T.MeshStandardMaterial({color:0xf4efe3,roughness:.33});
 const selectedMat=new T.MeshStandardMaterial({color:0xf3c978,roughness:.33,emissive:0x4e3516,emissiveIntensity:.2});
 const root=new T.Group();scene.add(root);
 const arches={upper:new T.Group(),lower:new T.Group()};root.add(arches.upper,arches.lower);
 const teeth=[];
 for(const archName of ["upper","lower"]){
  const upper=archName==="upper",arch=arches[archName],y=upper?1.12:-1.12;
  const gumArch=new T.Mesh(new T.TorusGeometry(2.4,.41,10,56,Math.PI),gum);
  gumArch.rotation.x=Math.PI/2;gumArch.position.set(0,y,-.05);arch.add(gumArch);
  for(let i=0;i<16;i++){
   const a=Math.PI*(.055+.89*i/15),x=Math.cos(a)*2.43,z=-Math.sin(a)*1.9+.34;
   const dist=Math.min(i,15-i);
   const type=dist<3?"molar":dist<5?"premolar":dist===5?"canine":"incisor";
   const dims=type==="molar"?[.42,.43,.48]:type==="premolar"?[.34,.4,.37]:type==="canine"?[.30,.48,.34]:[.32,.37,.27];
   const crown=new T.Mesh(new T.SphereGeometry(1,14,10),enamel);
   crown.scale.set(...dims);crown.position.set(x,y+(upper?-.33:.33),z);
   crown.rotation.y=-a+Math.PI/2;
   const quadrant=upper?(i<8?1:2):(i<8?4:3);
   const position=i<8?i+1:16-i;
   // Screen-left / screen-right numbering is an illustrative arrangement.
   const fdi=quadrant*10+position;
   crown.userData.fdi=fdi;crown.userData.arch=archName;
   arch.add(crown);teeth.push(crown);
  }
 }
 const ray=new T.Raycaster(),pointer=new T.Vector2();
 let selected=null,mode="both",drag=false,px=0,py=0,raf=0,dead=false;
 function pick(tooth){selected=tooth;teeth.forEach(t=>t.material=t===tooth?selectedMat:enamel);onSelect?.(tooth.userData.fdi,tooth.userData.arch)}
 function tap(e){const b=renderer.domElement.getBoundingClientRect();pointer.set((e.clientX-b.left)/b.width*2-1,-(e.clientY-b.top)/b.height*2+1);ray.setFromCamera(pointer,camera);const hit=ray.intersectObjects(teeth.filter(t=>t.parent.visible))[0];if(hit)pick(hit.object)}
 function view(next){mode=next;arches.upper.visible=mode!=="lower";arches.lower.visible=mode!=="upper";if(selected&&!selected.parent.visible){selected=null;teeth.forEach(t=>t.material=enamel);onSelect?.(null,null)}}
 const controls=host.parentElement?.querySelectorAll("[data-arch]")||[];
 controls.forEach(b=>b.addEventListener("click",()=>{controls.forEach(x=>x.classList.toggle("active",x===b));view(b.dataset.arch)}));
 renderer.domElement.addEventListener("pointerdown",e=>{drag=false;px=e.clientX;py=e.clientY;renderer.domElement.setPointerCapture(e.pointerId)});
 renderer.domElement.addEventListener("pointermove",e=>{if(!renderer.domElement.hasPointerCapture(e.pointerId))return;const dx=e.clientX-px,dy=e.clientY-py;if(Math.abs(dx)+Math.abs(dy)>3)drag=true;if(drag){root.rotation.y=Math.max(-.9,Math.min(.9,root.rotation.y+dx*.006));root.rotation.x=Math.max(-.25,Math.min(.45,root.rotation.x+dy*.004));px=e.clientX;py=e.clientY}});
 renderer.domElement.addEventListener("pointerup",e=>{if(!drag)tap(e)});
 renderer.domElement.addEventListener("wheel",e=>{e.preventDefault();camera.position.z=Math.max(8,Math.min(18,camera.position.z+e.deltaY*.012))},{passive:false});
 let pinch=null;
 renderer.domElement.addEventListener("touchmove",e=>{if(e.touches.length!==2){pinch=null;return}e.preventDefault();const d=Math.hypot(e.touches[0].clientX-e.touches[1].clientX,e.touches[0].clientY-e.touches[1].clientY);if(pinch!==null)camera.position.z=Math.max(8,Math.min(18,camera.position.z+(pinch-d)*.018));pinch=d},{passive:false});
 renderer.domElement.addEventListener("touchend",()=>{pinch=null});
 function resize(){if(dead)return;const w=host.clientWidth,h=host.clientHeight;if(!w||!h)return;renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix()}
 const ro=new ResizeObserver(resize);ro.observe(host);resize();
 function frame(){if(dead)return;if(!host.isConnected){dispose();return}renderer.render(scene,camera);raf=requestAnimationFrame(frame)}
 function dispose(){if(dead)return;dead=true;cancelAnimationFrame(raf);ro.disconnect();renderer.dispose();renderer.domElement.remove();scene.traverse(o=>o.geometry?.dispose());[gum,enamel,selectedMat].forEach(m=>m.dispose());if(disposeActive===dispose)disposeActive=null}
 disposeActive=dispose;frame();return dispose;
}
