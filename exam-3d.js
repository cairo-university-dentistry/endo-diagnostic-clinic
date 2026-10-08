/* v1.0 — mobile-first 3D dental examination viewport. Visual-only training model. */
let disposeActive=null;
export async function mountExam3D(host,onSelect){
 if(!host)return;
 let T;try{T=await import("https://cdn.jsdelivr.net/npm/three@0.160.1/build/three.module.js")}catch(e){host.textContent="3D view unavailable";return}
 if(!host.isConnected)return;
 if(disposeActive)disposeActive();
 const scene=new T.Scene();scene.background=new T.Color(0x101d21);
 const camera=new T.PerspectiveCamera(37,1,.1,50);camera.position.set(0,5.4,9.7);camera.lookAt(0,0,0);
 const renderer=new T.WebGLRenderer({antialias:true,powerPreference:"low-power"});
 renderer.setPixelRatio(Math.min(devicePixelRatio||1,1.5));renderer.outputColorSpace=T.SRGBColorSpace;
 host.appendChild(renderer.domElement);renderer.domElement.style.cssText="width:100%;height:100%;display:block;touch-action:pan-y";
 scene.add(new T.HemisphereLight(0xe9f8ff,0x293a42,2.3));
 const light=new T.DirectionalLight(0xfff0dc,2.7);light.position.set(-4,8,7);scene.add(light);
 const gum=new T.MeshStandardMaterial({color:0xa65b66,roughness:.75});
 const enamel=new T.MeshStandardMaterial({color:0xf4eee0,roughness:.29});
 const selectedMat=new T.MeshStandardMaterial({color:0xe9c47f,roughness:.3,emissive:0x483016,emissiveIntensity:.18});
 const root=new T.Group();scene.add(root);
 const jaw=new T.Mesh(new T.TorusGeometry(2.45,.52,12,64,Math.PI),gum);
 jaw.rotation.x=Math.PI/2;jaw.position.z=.65;root.add(jaw);
 const teeth=[];
 // Stylized upper arch: 14 individually selectable crowns, not anatomically diagnostic.
 for(let i=0;i<14;i++){
  const a=Math.PI*(.07+.86*i/13),x=Math.cos(a)*2.4,z=-Math.sin(a)*1.95+.5;
  const molar=Math.abs(i-6.5)>3.5;
  const w=molar?.54:.38,d=molar?.59:.43;
  const tooth=new T.Mesh(new T.SphereGeometry(1,16,12),enamel);
  tooth.scale.set(w,.54,d);tooth.position.set(x,.44,z);tooth.rotation.y=-a+Math.PI/2;
  tooth.userData.index=i;root.add(tooth);teeth.push(tooth);
 }
 const base=new T.Mesh(new T.CylinderGeometry(2.95,3.1,.12,64),new T.MeshStandardMaterial({color:0x293b40,roughness:.85}));
 base.position.y=-.75;root.add(base);
 const ray=new T.Raycaster(),mouse=new T.Vector2();
 let selected=-1,drag=false,px=0,rotation=0,raf=0,dead=false;
 function select(i){selected=i;teeth.forEach((t,j)=>t.material=j===i?selectedMat:enamel);onSelect?.(i)}
 function tap(e){const r=renderer.domElement.getBoundingClientRect();mouse.set((e.clientX-r.left)/r.width*2-1,-(e.clientY-r.top)/r.height*2+1);ray.setFromCamera(mouse,camera);const hit=ray.intersectObjects(teeth)[0];if(hit)select(hit.object.userData.index)}
 renderer.domElement.addEventListener("pointerdown",e=>{drag=false;px=e.clientX});
 renderer.domElement.addEventListener("pointermove",e=>{if(e.buttons===1&&Math.abs(e.clientX-px)>4){drag=true;rotation+=(e.clientX-px)*.005;root.rotation.y=Math.max(-.65,Math.min(.65,rotation));px=e.clientX}});
 renderer.domElement.addEventListener("pointerup",e=>{if(!drag)tap(e)});
 function resize(){if(dead)return;const w=host.clientWidth,h=host.clientHeight;if(!w||!h)return;renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix()}
 const ro=new ResizeObserver(resize);ro.observe(host);resize();
 function frame(){if(dead)return;if(!host.isConnected){dispose();return}renderer.render(scene,camera);raf=requestAnimationFrame(frame)}
 function dispose(){if(dead)return;dead=true;cancelAnimationFrame(raf);ro.disconnect();renderer.dispose();renderer.domElement.remove();scene.traverse(o=>{if(o.geometry)o.geometry.dispose()});[gum,enamel,selectedMat].forEach(m=>m.dispose());if(disposeActive===dispose)disposeActive=null}
 disposeActive=dispose;frame();return dispose;
}
