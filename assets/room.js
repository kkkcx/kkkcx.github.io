import {t} from './i18n.js';
import {getTokyoClockAngles} from './tokyo-clock.js';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { LINES } from './data.js';
import { createCompanions } from './room-characters.js';
import { drawMonitor,drawTelevision,prepareCoastlines } from './screen-art.js?v=11';
import { ARTWORKS,loadImage,drawArtwork,drawArtLabel,drawResearchBoard,drawTokyoSky } from './studio-art.js?v=15';

const canvas=document.querySelector('#room-canvas'),stage=document.querySelector('#room-stage');
const reduced=matchMedia('(prefers-reduced-motion:reduce)'),small=matchMedia('(max-width:760px)');
const renderer=new THREE.WebGLRenderer({canvas,antialias:true,alpha:true,powerPreference:'low-power'});
renderer.setPixelRatio(Math.min(devicePixelRatio,2));
renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.02;
renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;
const scene=new THREE.Scene(),room=new THREE.Group();scene.add(room);
const camera=new THREE.PerspectiveCamera(36,1,.15,160);
const overviewTarget=new THREE.Vector3(0,1.55,0),overviewOffset=new THREE.Vector3(16,13.4,19);
camera.position.copy(overviewTarget).add(overviewOffset);
const controls=new OrbitControls(camera,canvas);controls.target.copy(overviewTarget);
controls.enableDamping=true;controls.dampingFactor=.08;controls.enablePan=false;controls.enableZoom=true;controls.zoomSpeed=.55;
controls.minDistance=7;controls.maxDistance=65;controls.minPolarAngle=.63;controls.maxPolarAngle=1.14;controls.minAzimuthAngle=.23;controls.maxAzimuthAngle=1.2;
controls.touches.ONE=THREE.TOUCH.ROTATE;controls.touches.TWO=THREE.TOUCH.DOLLY_ROTATE;
const hemi=new THREE.HemisphereLight(0xe2e9ec,0x8e8776,1.75);scene.add(hemi);
const key=new THREE.DirectionalLight(0xffedce,3.05);key.position.set(2.5,11,7);key.target.position.set(-1,0,-1);key.castShadow=true;key.shadow.mapSize.set(small.matches?1024:2048,small.matches?1024:2048);Object.assign(key.shadow.camera,{left:-10,right:10,top:10,bottom:-10,near:.5,far:35});key.shadow.normalBias=.025;key.shadow.bias=-.00015;key.shadow.radius=3;scene.add(key,key.target);
const rim=new THREE.DirectionalLight(0xb5cde8,.65);rim.position.set(-5,7,2);scene.add(rim);
// A local studio environment gives steel and glass real reflections, without external assets.
const env=new THREE.Scene();env.background=new THREE.Color('#bcbfb8');
for(const [x,y,z,w,h] of [[-9,7,0,8,9],[8,5,-3,7,7],[0,10,4,8,5]]){const p=new THREE.Mesh(new THREE.PlaneGeometry(w,h),new THREE.MeshBasicMaterial({color:new THREE.Color(2.3,2.2,2.05),side:THREE.DoubleSide}));p.position.set(x,y,z);p.lookAt(0,1,0);env.add(p);}
const pmrem=new THREE.PMREMGenerator(renderer),envTarget=pmrem.fromScene(env,.08);scene.environment=envTarget.texture;pmrem.dispose();env.traverse(o=>{o.geometry?.dispose();o.material?.dispose();});
const mat=(color,roughness=.8,metalness=0)=>new THREE.MeshStandardMaterial({color,roughness,metalness,envMapIntensity:.32});
const M={plaster:mat('#e0ded1'),leftWall:mat('#cecfbf'),slab:mat('#b4b2a3'),floor:mat('#c8c5b7'),white:mat('#eeece0'),ink:mat('#252a29'),red:mat('#b63225',.55),blue:mat('#224e83',.55),yellow:mat('#d4ab2d',.55),chrome:mat('#b9c1c0',.23,.78),wood:mat('#ad8963'),woodLight:mat('#c1a581'),leather:mat('#252c2b',.38),linen:mat('#c9c4ad',.95),green:mat('#4c654c'),leaf:mat('#789068'),clay:mat('#a9684b'),brass:mat('#b6a05f',.34,.65),soil:mat('#3e3d32')};
const materialCache=new Map();const colorMat=c=>{if(!materialCache.has(c))materialCache.set(c,mat(c));return materialCache.get(c);};
function box(w,h,d,material,x,y,z,parent=room,bevel=0){let g;if(bevel){const s=new THREE.Shape(),a=w/2-bevel,b=h/2-bevel;s.moveTo(-a,-b);s.lineTo(a,-b);s.lineTo(a,b);s.lineTo(-a,b);s.closePath();g=new THREE.ExtrudeGeometry(s,{depth:d-2*bevel,bevelEnabled:true,bevelSegments:3,steps:1,bevelSize:bevel,bevelThickness:bevel});g.translate(0,0,-d/2+bevel);}else g=new THREE.BoxGeometry(w,h,d);const m=new THREE.Mesh(g,material);m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;parent.add(m);return m;}
function cylinder(rt,rb,h,material,x,y,z,parent=room,segments=40){const m=new THREE.Mesh(new THREE.CylinderGeometry(rt,rb,h,segments),material);m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;parent.add(m);return m;}
function sphere(rx,ry,rz,material,x,y,z,parent=room){const m=new THREE.Mesh(new THREE.SphereGeometry(1,24,16),material);m.scale.set(rx,ry,rz);m.position.set(x,y,z);m.castShadow=true;parent.add(m);return m;}
function rod(a,b,r,material,parent=room){const start=new THREE.Vector3(...a),end=new THREE.Vector3(...b),mid=start.clone().add(end).multiplyScalar(.5);const m=cylinder(r,r,start.distanceTo(end),material,...mid.toArray(),parent,12);m.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),end.sub(start).normalize());return m;}
function tube(points,r,material,parent=room){const curve=new THREE.CatmullRomCurve3(points.map(p=>new THREE.Vector3(...p)),false,'centripetal');const mesh=new THREE.Mesh(new THREE.TubeGeometry(curve,Math.max(24,points.length*8),r,8,false),material);mesh.castShadow=true;parent.add(mesh);return mesh;}
function plane(w,h,material,x,y,z,parent=room){const mesh=new THREE.Mesh(new THREE.PlaneGeometry(w,h),material);mesh.position.set(x,y,z);mesh.receiveShadow=true;parent.add(mesh);return mesh;}
let seed=197;function random(){seed=(1664525*seed+1013904223)>>>0;return seed/4294967296;}
function texture(w,h,draw,quality=1){const c=document.createElement('canvas'),scale=Math.min(quality,renderer.capabilities.maxTextureSize/Math.max(w,h));c.width=Math.round(w*scale);c.height=Math.round(h*scale);const g=c.getContext('2d');g.scale(scale,scale);draw(g,w,h);const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;t.anisotropy=renderer.capabilities.getMaxAnisotropy();t.minFilter=THREE.LinearMipmapLinearFilter;t.magFilter=THREE.LinearFilter;return t;}
function mapped(t,basic=false){return basic?new THREE.MeshBasicMaterial({map:t}):new THREE.MeshStandardMaterial({map:t,roughness:.88,envMapIntensity:.2});}
function zone(id,label){const g=new THREE.Group();g.userData.section=id;g.userData.label=label;room.add(g);return g;}
const zones={};function register(id,label){return zones[id]=zone(id,label);}
function softShadow(w,d,x,z,alpha=.18){const t=texture(96,96,g=>{const gr=g.createRadialGradient(48,48,2,48,48,47);gr.addColorStop(0,`rgba(35,30,20,${alpha})`);gr.addColorStop(1,'rgba(35,30,20,0)');g.fillStyle=gr;g.fillRect(0,0,96,96);});const p=plane(w,d,new THREE.MeshBasicMaterial({map:t,transparent:true,depthWrite:false}),x,.037,z);p.rotation.x=-Math.PI/2;}
const ground=new THREE.Mesh(new THREE.PlaneGeometry(200,200),new THREE.ShadowMaterial({opacity:.12}));ground.rotation.x=-Math.PI/2;ground.position.y=-.34;ground.receiveShadow=true;scene.add(ground);
// A generous 12 × 8.6 metre room: gallery and workbench at the back, library and lounge at the front.
box(12.35,.32,8.75,M.slab,0,-.17,0,room,.04);
const floorTex=texture(1536,1024,(g,w,h)=>{g.fillStyle='#c6c3b5';g.fillRect(0,0,w,h);for(let i=0;i<28000;i++){const v=random()>.5?'255,253,231':'69,69,58';g.fillStyle=`rgba(${v},${random()*.09})`;g.fillRect(random()*w,random()*h,1+random()*2,1+random()*2);}g.lineWidth=1;g.strokeStyle='#aaa99c';for(let x=0;x<w;x+=192){g.beginPath();g.moveTo(x,0);g.lineTo(x,h);g.stroke();}for(let y=0;y<h;y+=170.66){g.beginPath();g.moveTo(0,y);g.lineTo(w,y);g.stroke();}});
box(12.12,.045,8.52,mapped(floorTex),0,.005,0);
box(12.35,4.75,.18,M.plaster,0,2.36,-4.32);
box(.18,4.75,8.6,M.leftWall,-6.08,2.36,0);
box(12.45,.07,.25,M.white,0,4.77,-4.32);box(.25,.07,8.75,M.white,-6.08,4.77,.02);
box(12.06,.1,.055,M.ink,0,.105,-4.204);box(.055,.1,8.47,M.ink,-5.963,.105,.02);
box(.09,4.55,.05,M.red,-5.68,2.38,-4.197);
// Four Bauhaus-era paintings, selected for each research direction and framed at native proportions.
const gallerySurfaces=[];
for(let i=0;i<4;i++){
 const art=ARTWORKS[i],group=register(LINES[i].id,LINES[i].name+' / '+LINES[i].title);
 const pw=768,ph=Math.round(700/art.ratio+68),iw=1.07,ih=iw*ph/pw,fh=ih+.075;
 const x=-4.89+(i%2)*1.35,y=(i<2?4.3:2.39)-fh/2;
 box(1.16,fh,.09,M.wood,x,y,-4.17,group,.009);
 box(1.10,ih+.022,.025,M.ink,x,y,-4.115,group,.003);
 const tex=texture(pw,ph,(g,w,h)=>drawArtwork(g,w,h,null,art),2);
 const mesh=plane(iw,ih,mapped(tex),x,y,-4.097,group);mesh.name='gallery-art-'+LINES[i].id;
 const label=texture(512,128,(g,w,h)=>drawArtLabel(g,w,h,art,LINES[i].name,LINES[i].color),2);
 const caption=plane(1.06,.265,mapped(label),x,y-fh/2-.171,-4.185,group);
 caption.name='gallery-caption-'+LINES[i].id;
 caption.userData={section:LINES[i].id,artwork:art};
 gallerySurfaces.push({art,tex,label,pw,ph,image:null});
}
// Window scene: fixed city geometry and a legible orange/white Tokyo Tower, day and night.
function skyline(night){return texture(1536,768,(g,w,h)=>drawTokyoSky(g,w,h,night),2);}
const daySky=skyline(false),nightSky=skyline(true),skyMat=new THREE.MeshBasicMaterial({map:daySky});
const windowGroup=new THREE.Group();room.add(windowGroup);plane(6.55,2.93,skyMat,2.47,3.02,-4.202,windowGroup);
for(const x of [-.85,1.36,3.57,5.79])box(.075,3.1,.18,M.ink,x,3.02,-4.12,windowGroup);
for(const y of [1.5,3.06,4.56])box(6.72,.07,.18,M.ink,2.47,y,-4.12,windowGroup);
box(6.93,.12,.5,M.white,2.47,1.455,-4.02,windowGroup);
for(const x of [1.27,3.48]){box(.025,.17,.03,M.chrome,x,2.81,-3.996,windowGroup);box(.1,.025,.025,M.chrome,x+.03,2.88,-3.98,windowGroup);}
for(let i=0;i<24;i++)box(.09,.73,.17,M.white,-.13+i*.17,.7,-4.02,room,.035);
rod([-.25,.3,-3.99],[4.07,.3,-3.99],.024,M.chrome);rod([-.25,1.04,-3.99],[4.07,1.04,-3.99],.024,M.chrome);
// A clock uses geometry so its hands remain sharp when moving close.
const wallClock=new THREE.Group();wallClock.position.set(-1.79,3.5,-4.15);room.add(wallClock);
const clockBody=cylinder(.32,.32,.055,M.ink,0,0,0,wallClock,64);clockBody.rotation.x=Math.PI/2;
const clockFace=cylinder(.29,.29,.012,M.white,0,0,.035,wallClock,64);clockFace.rotation.x=Math.PI/2;
for(let i=0;i<12;i++){const a=i*Math.PI/6;const tick=box(.012,.043,.008,M.ink,Math.sin(a)*.242,Math.cos(a)*.242,.048,wallClock);tick.rotation.z=-a;}
// Each hand rotates about the dial's center, not around its own mesh center.
wallClock.name='tokyo-wall-clock';wallClock.userData.timeZone='Asia/Tokyo';
const clockHands={};
for(const [name,width,length,depth,material] of [
 ['hour',.018,.16,.059,M.ink],['minute',.012,.23,.073,M.ink],['second',.006,.27,.087,M.red]
]){
 const pivot=new THREE.Group();pivot.name='clock-'+name;pivot.position.z=depth;wallClock.add(pivot);
 box(width,length,.008,material,0,length/2-.028,0,pivot);clockHands[name]=pivot;
}
const clockPin=cylinder(.019,.019,.012,M.red,0,0,.1,wallClock,32);clockPin.rotation.x=Math.PI/2;
let clockSample=null;
function updateWallClock(timestamp,smooth){
 const sample=smooth?timestamp:Math.floor(timestamp/1000)*1000;
 if(sample===clockSample)return false;
 const angles=getTokyoClockAngles(sample);
 for(const name of ['hour','minute','second'])clockHands[name].rotation.z=angles[name];
 clockSample=sample;wallClock.userData.sampledAt=sample;return true;
}
updateWallClock(Date.now(),false);
// A recessed chalkboard with a fine oak surround and an actual chalk ledge.
const mapGroup=register('map','Research / The complete agenda');mapGroup.position.set(-1.87,0,-4.14);
box(1.69,1.22,.075,M.wood,0,2.03,0,mapGroup,.008);
box(1.64,1.17,.018,M.ink,0,2.03,.042,mapGroup,.003);
const boardTexture=texture(1024,724,drawResearchBoard,2);
const researchBoard=plane(1.61,1.14,mapped(boardTexture),0,2.03,.053,mapGroup);researchBoard.name='research-blackboard';
box(1.69,.035,.145,M.wood,0,1.407,.065,mapGroup,.006);
for(let i=0;i<3;i++){const chalk=cylinder(.009,.009,.11,[M.white,colorMat('#dcc799'),colorMat('#acc2b5')][i],-.49+i*.18,1.44,.099,mapGroup,12);chalk.rotation.z=Math.PI/2;}
box(.15,.037,.063,M.ink,.49,1.44,.092,mapGroup,.004);
// A steel-framed working desk with a fine walnut top and blue storage pedestal.
const desk=register('about','About / At the working desk');desk.position.set(2.12,0,-2.29);
box(3.65,.115,1.39,M.woodLight,0,1.42,0,desk,.027);
for(const x of [-1.57,1.57]){tube([[x,1.36,-.5],[x,.14,-.5],[x,.07,-.42],[x,.07,.45],[x,.13,.52],[x,1.36,.52]],.031,M.chrome,desk);rod([x,1.25,-.5],[x,1.25,.52],.021,M.chrome,desk);}
box(.76,1.2,1.08,M.blue,1.15,.71,0,desk,.028);for(let i=0;i<3;i++){const y=.36+i*.36;box(.715,.325,.035,M.blue,1.15,y,.56,desk,.015);box(.21,.019,.034,M.chrome,1.15,y+.1,.59,desk);}
const deskPad=box(1.62,.009,.64,colorMat('#535c55'),-.16,1.485,.2,desk,.006);
box(1.43,.94,.075,M.ink,-.28,2.13,-.35,desk,.025);rod([-.28,1.49,-.38],[-.28,1.82,-.38],.044,M.chrome,desk);box(.58,.025,.38,M.chrome,-.28,1.499,-.31,desk,.01);
let paperImage=null;
const monitorTexture=texture(1024,640,drawMonitor,2);
const screenMaterial=new THREE.MeshBasicMaterial({map:monitorTexture,toneMapped:false});
const monitorScreen=plane(1.31,.811,screenMaterial,-.28,2.137,-.308,desk);monitorScreen.name='computer-display';
box(.92,.035,.31,M.white,-.31,1.51,.22,desk,.012);
for(let row=0;row<4;row++)for(let i=0;i<14;i++)box(.052,.008,.041,colorMat('#d3d6ca'),-.727+i*.061,1.532,.107+row*.066,desk,.002);
box(.28,.007,.043,M.white,-.32,1.538,.31,desk);sphere(.08,.033,.125,M.white,.49,1.51,.25,desk);
tube([[-.28,1.9,-.4],[-.28,1.4,-.6],[.6,1.3,-.68],[1.15,.5,-.66]],.012,M.ink,desk);
const notebook=new THREE.Group();notebook.position.set(-1.23,1.49,.13);notebook.rotation.y=.17;desk.add(notebook);
box(.58,.036,.44,M.red,0,0,0,notebook,.009);box(.55,.022,.415,M.white,0,.018,0,notebook);box(.004,.003,.41,M.ink,0,.032,0,notebook);
for(let i=0;i<7;i++)box(.2,.002,.002,colorMat('#8e9787'),-.128,.033,-.15+i*.04,notebook);
rod([-.2,.047,.18],[.22,.047,.15],.008,M.yellow,notebook);
const penCup=cylinder(.065,.065,.16,M.chrome,-1.55,1.56,-.35,desk);for(let i=0;i<4;i++)rod([-1.59+i*.025,1.59,-.35],[-1.61+i*.025,1.89,-.34],.009,[M.red,M.ink,M.blue,M.yellow][i],desk);
cylinder(.103,.079,.19,M.white,.55,1.575,-.33,desk);cylinder(.091,.091,.005,colorMat('#3d3022'),.55,1.673,-.33,desk);
const cupHandle=new THREE.Mesh(new THREE.TorusGeometry(.057,.017,10,30),M.white);cupHandle.position.set(.66,1.578,-.33);desk.add(cupHandle);
// A Wagenfeld-inspired opal lamp, with a hemisphere shade and exposed metal stem.
cylinder(.205,.215,.034,M.chrome,1.43,1.5,-.38,desk);cylinder(.025,.025,.55,M.chrome,1.43,1.79,-.38,desk);
const opal=new THREE.MeshStandardMaterial({color:'#e7e5d2',roughness:.3,emissive:'#ffe0a7',emissiveIntensity:.08,envMapIntensity:.3});
const deskShade=new THREE.Mesh(new THREE.SphereGeometry(.29,40,24,0,Math.PI*2,0,Math.PI/2),opal);deskShade.position.set(1.43,2.08,-.38);desk.add(deskShade);cylinder(.286,.286,.009,M.white,1.43,2.08,-.38,desk);
const deskLamp=new THREE.PointLight(0xffbf75,0,4.7,2);deskLamp.position.set(3.55,2.02,-2.6);scene.add(deskLamp);
softShadow(4.9,2.65,2.1,-2.2,.24);
// The cantilever chair uses a continuous steel frame, upholstery piping, and stretched leather.
function chair(parent,seatMaterial=M.leather){for(const x of [-.42,.42]){tube([[x,.12,-.54],[x,.065,-.5],[x,.065,.5],[x,.13,.55],[x,.92,.55],[x,1.09,.42],[x,1.53,.34]],.027,M.chrome,parent);tube([[x,.94,.48],[x,1.13,.35],[x,1.13,-.35]],.024,M.chrome,parent);box(.075,.06,.57,M.leather,x,1.14,-.03,parent,.015);}rod([-.42,.1,.51],[.42,.1,.51],.024,M.chrome,parent);rod([-.42,1.51,.34],[.42,1.51,.34],.024,M.chrome,parent);box(.8,.14,.87,seatMaterial,0,.88,-.035,parent,.045);const back=box(.78,.5,.115,seatMaterial,0,1.29,.38,parent,.035);back.rotation.x=-.14;for(const x of [-.372,.372]){rod([x,.964,-.4],[x,.964,.31],.005,M.white,parent);}}
const deskChair=new THREE.Group();deskChair.position.set(1.45,0,-.67);deskChair.rotation.y=.17;room.add(deskChair);chair(deskChair);softShadow(1.8,1.8,1.45,-.6);
// Modular open library: steel uprights, oak shelves, and carefully spaced book spines.
const library=register('edu','Education & work / The library');library.position.set(-5.63,0,-1.5);library.rotation.y=Math.PI/2;
for(const x of [-1.55,0,1.55])for(const z of [-.15,.33])rod([x,.07,z],[x,3.75,z],.022,M.chrome,library);
for(const y of [.23,1.1,1.97,2.84,3.71])box(3.27,.06,.66,M.woodLight,0,y,.08,library);
const bookMaterials=[M.white,M.red,M.blue,M.yellow,M.ink,M.linen,M.wood];
function book(x,y,z,w,h,d,material,parent=room){box(w,h,d,material,x,y+h/2,z,parent,.004);box(w*.76,.012,.003,M.white,x,y+.08,z+d/2+.004,parent);box(w*.76,.006,.003,M.white,x,y+h-.07,z+d/2+.004,parent);}
for(let row=0;row<4;row++){let x=-1.43;for(let i=0;i<9;i++){const w=.09+random()*.08,h=.43+random()*.25;book(x+w/2,.267+row*.87,.075,w,h,.41,bookMaterials[(i+row*3)%bookMaterials.length],library);x+=w+.155;if(x>1.2)break;}}
// Stacked journals and a geometric bookend interrupt the library grid.
box(.44,.1,.41,M.blue,1.21,3.03,.09,library);box(.43,.08,.4,M.white,1.19,3.12,.1,library);sphere(.13,.13,.13,M.yellow,1.17,3.3,.09,library);
// The left-hand noticeboard is an everyday object, separate from the research gallery.
const notice=register('news','News / The noticeboard');notice.position.set(-5.96,3.1,1.65);notice.rotation.y=Math.PI/2;
box(1.88,1.22,.07,M.wood,0,0,0,notice,.015);
plane(1.76,1.1,mapped(texture(1000,650,(g,w,h)=>{g.fillStyle='#b5a078';g.fillRect(0,0,w,h);for(let i=0;i<6000;i++){g.fillStyle=random()>.5?'#bea782':'#a8916b';g.fillRect(random()*w,random()*h,2,2);}const cards=[[55,50,310,220,'CoRL 2026','#eee9d8'],[420,57,240,280,'FIELD NOTES','#ddd8c3'],[701,98,230,205,'WHAT NEXT?','#c9d4cb'],[99,341,300,255,'RESEARCH','#d9d5bf'],[495,391,361,186,'STAY CURIOUS','#eee9d8']];for(let i=0;i<cards.length;i++){const [x,y,cw,ch,t,c]=cards[i];g.save();g.translate(x,y);g.rotate((i%2?.035:-.035));g.fillStyle=c;g.fillRect(0,0,cw,ch);g.fillStyle='#353e35';g.font='21px sans-serif';g.fillText(t,22,55);g.font='16px sans-serif';g.fillText(['Accepted.','Read. Think. Repeat.','Keep asking.','Tokyo / 2026','Ideas need room.'][i],22,89);g.strokeStyle='#9aa293';for(let j=0;j<3;j++){g.beginPath();g.moveTo(23,120+j*18);g.lineTo(cw-35,120+j*18);g.stroke();}g.fillStyle='#ad3628';g.beginPath();g.arc(cw/2,10,5,0,Math.PI*2);g.fill();g.restore();}})),0,0,.04,notice);
// A woven Bauhaus carpet draws the three primary colors into a single, quiet composition.
const rugTex=texture(1024,768,(g,w,h)=>{g.fillStyle='#bbaa85';g.fillRect(0,0,w,h);g.fillStyle='#c9bca0';g.fillRect(18,18,w-36,h-36);g.fillStyle='#aa3427';g.fillRect(38,38,260,h-76);g.fillStyle='#244e7c';g.fillRect(330,38,w-368,160);g.fillStyle='#333d38';g.fillRect(330,230,165,h-268);g.fillStyle='#c9a63f';g.beginPath();g.arc(720,469,170,0,Math.PI*2);g.fill();g.strokeStyle='rgba(230,221,194,.18)';g.lineWidth=1;for(let x=0;x<w;x+=3){g.beginPath();g.moveTo(x,0);g.lineTo(x,h);g.stroke();}for(let y=0;y<h;y+=4){g.beginPath();g.moveTo(0,y);g.lineTo(w,y);g.stroke();}});
box(4.9,.019,3.32,mapped(rugTex),-1.65,.054,1.32);
for(let i=0;i<65;i++)for(const z of [-.385,3.025])box(.015,.01,.095,M.linen,-4.065+i*.075,.058,z);
// A single tubular lounge chair keeps the reading area open.
const loungeA=new THREE.Group();loungeA.position.set(-3.39,0,1.52);loungeA.rotation.y=-.54;loungeA.scale.setScalar(1.12);room.add(loungeA);chair(loungeA,M.red);
// One lounge chair leaves the central floor open for the researcher and companion.
softShadow(2.1,2.1,-3.4,1.5,.24);
// Nesting tables, a publication, and geometric ceramic forms.
for(const [x,y,z,r,material] of [[-1.69,.73,1.37,.65,M.woodLight]]){cylinder(r,r,.045,material,x,y,z);for(let i=0;i<3;i++){const a=i*Math.PI*2/3;rod([x+Math.cos(a)*r*.68,y-.02,z+Math.sin(a)*r*.68],[x+Math.cos(a)*r*.85,.08,z+Math.sin(a)*r*.85],.021,M.chrome);}}
const journal=box(.42,.036,.57,M.white,-1.9,.775,1.35);journal.rotation.y=-.24;box(.29,.003,.24,M.red,-1.88,.795,1.41).rotation.y=-.24;
cylinder(.095,.11,.15,M.yellow,-1.4,.83,1.43);sphere(.077,.088,.077,M.yellow,-1.4,.944,1.43);cylinder(.036,.05,.07,M.yellow,-1.4,1.021,1.43);
// The listening corner: a low lacquer cabinet, detailed turntable, and two cloth speakers.
const music=register('music','Boléro / Play or pause');music.position.set(-4.16,0,3.43);music.rotation.y=.05;
box(2.67,.69,.68,M.ink,0,.59,0,music,.025);box(2.74,.06,.73,M.woodLight,0,.971,0,music,.015);
for(const x of [-1.08,1.08])for(const z of [-.24,.24])rod([x,.27,z],[x,.07,z],.024,M.chrome,music);
for(const [x,m] of [[-.875,M.blue],[0,M.white],[.875,M.red]]){box(.847,.61,.03,m,x,.59,.36,music,.006);box(.12,.018,.025,M.chrome,x+.25,.75,.386,music);}
box(.99,.09,.55,M.wood,-.09,1.049,0,music,.02);box(.95,.015,.51,M.ink,-.09,1.104,0,music);
const vinyl=cylinder(.214,.214,.015,colorMat('#171d1c'),-.2,1.124,0,music,64);
for(let r=.08;r<.208;r+=.015){const ring=new THREE.Mesh(new THREE.TorusGeometry(r,.0015,5,64),colorMat('#454b43'));ring.rotation.x=-Math.PI/2;ring.position.set(-.2,1.134,0);music.add(ring);}
const recordLabel=cylinder(.068,.068,.003,M.yellow,-.2,1.137,0,music);box(.015,.003,.046,M.red,.023,.003,0,recordLabel);cylinder(.007,.007,.025,M.chrome,-.2,1.15,0,music,16);
const tonearm=new THREE.Group();tonearm.position.set(.28,1.14,-.16);music.add(tonearm);cylinder(.031,.031,.026,M.chrome,0,0,0,tonearm,24);tube([[0,.023,0],[-.01,.023,.14],[-.035,.023,.31]],.01,M.chrome,tonearm);box(.04,.025,.065,M.ink,-.035,.015,.32,tonearm);
const fabric=texture(128,128,(g,w,h)=>{g.fillStyle='#686e62';g.fillRect(0,0,w,h);g.fillStyle='#333d35';for(let x=0;x<w;x+=4)for(let y=0;y<h;y+=4)g.fillRect(x,y,2,2);});
for(const x of [-1.05,1.05]){box(.34,.46,.34,M.ink,x,1.23,0,music,.012);plane(.285,.396,mapped(fabric),x,1.23,.176,music);}
// A display shelf with a restrained collection of geometric trophies and framed certificates.
const awards=register('awards','Honors / Above the library');awards.position.set(-5.63,3.75,-1.5);awards.rotation.y=Math.PI/2;
for(let i=0;i<3;i++){const x=-.66+i*.66;box(.35,.045,.29,M.ink,x,.025,0,awards);cylinder(.018,.024,.24,M.brass,x,.17,0,awards);if(i===0)sphere(.13,.13,.13,M.brass,x,.42,0,awards);if(i===1)box(.22,.22,.22,M.red,x,.41,0,awards);if(i===2)cylinder(0,.14,.29,M.blue,x,.41,0,awards,3);}
// A small CRT on a trolley makes the visitor map a physical object in the room.
const visitors=register('visitors','Visitors / A window to the world');visitors.position.set(4.63,0,1.36);visitors.rotation.y=-.23;
for(const x of [-.55,.55])for(const z of [-.29,.29]){rod([x,.15,z],[x,1.03,z],.025,M.chrome,visitors);const wh=cylinder(.065,.065,.045,M.ink,x,.08,z,visitors,20);wh.rotation.z=Math.PI/2;}
box(1.28,.05,.8,M.chrome,0,.99,0,visitors);box(1.22,.04,.73,M.blue,0,.34,0,visitors);
box(1.17,.83,.57,M.wood,0,1.433,0,visitors,.055);box(.94,.65,.075,M.ink,-.065,1.463,.315,visitors,.04);
let coastlines=[],tvLastDraw=0;
const tvTexture=texture(768,512,drawTelevision,2);
// Dynamic screens avoid rebuilding mipmaps on every animation frame.
tvTexture.generateMipmaps=false;tvTexture.minFilter=THREE.LinearFilter;
const tvMat=new THREE.MeshBasicMaterial({map:tvTexture,toneMapped:false});const tvScreen=plane(.81,.532,tvMat,-.065,1.464,.357,visitors);tvScreen.name='television-display';
for(const y of [1.37,1.62]){const knob=cylinder(.045,.045,.018,M.chrome,.504,y,.3,visitors,24);knob.rotation.x=Math.PI/2;}
rod([0,1.86,-.13],[-.35,2.3,-.14],.009,M.chrome,visitors);rod([0,1.86,-.13],[.3,2.24,-.14],.009,M.chrome,visitors);box(.53,.1,.36,M.ink,.14,.415,0,visitors);
// A standing lamp and a coat stand mark the edge of the reading area.
cylinder(.31,.32,.04,M.ink,-4.79,.069,.17);cylinder(.023,.023,2.8,M.chrome,-4.79,1.48,.17);
const floorShade=new THREE.Mesh(new THREE.SphereGeometry(.36,36,20,0,Math.PI*2,0,Math.PI/2),opal);floorShade.position.set(-4.79,2.88,.17);room.add(floorShade);cylinder(.355,.355,.01,M.white,-4.79,2.88,.17);
const floorLamp=new THREE.PointLight(0xffc184,0,5.8,2);floorLamp.position.set(-4.79,2.75,.17);scene.add(floorLamp);
// Foliage is posed leaf by leaf rather than represented by large spheres.
function plant(x,z,scale=1){const g=new THREE.Group();g.position.set(x,0,z);g.scale.setScalar(scale);room.add(g);cylinder(.3,.23,.61,M.clay,0,.36,0,g);cylinder(.271,.271,.012,M.soil,0,.671,0,g);for(let i=0;i<13;i++){const a=i*2.4,top=1.12+random()*.88,xx=Math.cos(a)*(.24+random()*.18),zz=Math.sin(a)*.39;rod([0,.65,0],[xx,top,zz],.011,M.green,g);const leaf=sphere(.12,.34,.023,i%3?M.green:M.leaf,xx,top,zz,g);leaf.rotation.set(.45,a,(i%2?1:-1)*.64);}softShadow(1.65*scale,1.65*scale,x,z,.2);return g;}
plant(4.96,-3.14,.98);plant(3.3,3.08,.84);
// Ceiling-free architecture is completed with a fine track and three gallery spotlights.
rod([-5.89,4.66,-3.35],[-2.66,4.66,-3.35],.019,M.ink);
for(const x of [-5.19,-4.1,-3.04]){rod([x,4.66,-3.35],[x,4.45,-3.35],.015,M.ink);const spot=cylinder(.073,.073,.2,M.ink,x,4.42,-3.4);spot.rotation.x=.65;}
// Distant evening window light and screen fill.
const screenGlow=new THREE.PointLight(0xb1d3dc,.05,4,2);screenGlow.position.set(1.84,2.1,-2.2);scene.add(screenGlow);
const warmWindow=new THREE.DirectionalLight(0x879ccf,0);warmWindow.position.set(4,6,-5);scene.add(warmWindow);
desk.userData.section='experience';desk.userData.label='Experiences / The working desk';
zones.experience=desk;zones.services=awards;zones.competitions=awards;
const companions=createCompanions(room,mat);
softShadow(1.5,1.5,.32,1.08,.14);softShadow(1.35,1.5,-1.5,2.75,.16);
let motionEnabled=!reduced.matches,animationTime=0;
window.addEventListener('room-motion',e=>{motionEnabled=e.detail;dirty=true;});
window.addEventListener('room-pet',()=>{companions.greet();dirty=true;});
reduced.addEventListener('change',e=>{motionEnabled=!e.matches;dirty=true;});
// Scene state is driven by the directory and object selection. No permanent hotspots obscure the room.
let dirty=true,modeCv=false,night=false,nightMix=0,playing=false,lastFrame=0,transition=null,dragging=false;
const focusPoints={overview:[0,1.55,0],about:[.32,1.08,1.08],experience:[1.84,2.137,-2.598],services:[-5.43,4.05,-1.5],competitions:[-5.43,4.05,-1.5],map:[-1.87,2.03,-4.1],read:[-4.89,3.4,-4.1],act:[-3.54,3.4,-4.1],together:[-4.89,1.6,-4.1],trust:[-3.54,1.6,-4.1],edu:[-5.4,1.95,-1.45],news:[-5.82,3,1.65],awards:[-5.43,4.05,-1.5],visitors:[4.63,1.3,1.4]};
// Frame a real 3D bounding box through the perspective frustum. No orthographic stretching.
const roomBounds=new THREE.Box3(new THREE.Vector3(-6.28,-.35,-4.47),new THREE.Vector3(6.28,4.85,4.52));
let activeFocus='overview',fittedDistance=28,userZoomed=false;
function fittingDistance(bounds,target,direction,aspect){
 const right=new THREE.Vector3().crossVectors(new THREE.Vector3(0,1,0),direction).normalize();
 const up=new THREE.Vector3().crossVectors(direction,right).normalize();
 const tanY=Math.tan(THREE.MathUtils.degToRad(camera.fov/2)),tanX=tanY*aspect;
 let distance=0;
 for(const x of [bounds.min.x,bounds.max.x])for(const y of [bounds.min.y,bounds.max.y])for(const z of [bounds.min.z,bounds.max.z]){
  const p=new THREE.Vector3(x,y,z).sub(target),depth=p.dot(direction);
  distance=Math.max(distance,depth+Math.abs(p.dot(right))/tanX,depth+Math.abs(p.dot(up))/tanY);
 }
 return distance*1.11;
}
function frame(id,aspect){
 const target=new THREE.Vector3(...(focusPoints[id]||focusPoints.overview));
 const paper=LINES.some(l=>l.id===id);
 const direction=(id==='overview'?overviewOffset.clone():new THREE.Vector3(...(paper?[6,5.8,16]:id==='news'||id==='edu'||id==='awards'||id==='competitions'||id==='services'?[16,9,10]:[13,10,16]))).normalize();
 const spherical=new THREE.Spherical().setFromVector3(direction);spherical.phi=THREE.MathUtils.clamp(spherical.phi,controls.minPolarAngle,controls.maxPolarAngle);spherical.theta=THREE.MathUtils.clamp(spherical.theta,controls.minAzimuthAngle,controls.maxAzimuthAngle);direction.setFromSpherical(spherical);
 let bounds=roomBounds;
 if(id!=='overview'&&zones[id]){const object=id==='about'?companions.hero:id==='experience'?monitorScreen:id==='visitors'?tvScreen:zones[id];bounds=new THREE.Box3().setFromObject(object);bounds.expandByScalar(paper ? .65 : .75);}
 const distance=Math.max(id==='overview'?12:id==='experience'||id==='visitors'?6.2:7,fittingDistance(bounds,target,direction,aspect));
 return {target,direction,distance};
}
function resize(){
 const w=stage.clientWidth,h=stage.clientHeight;if(!w||!h||modeCv)return;
 renderer.setPixelRatio(Math.min(devicePixelRatio,2));renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix();
 if(!transition){
  const ratio=camera.position.distanceTo(controls.target)/fittedDistance;
  const direction=camera.position.clone().sub(controls.target).normalize();
  const f=frame(activeFocus,camera.aspect);
  fittedDistance=activeFocus==='overview'?fittingDistance(roomBounds,controls.target,direction,camera.aspect):f.distance;
  controls.minDistance=Math.max(5,fittedDistance*.52);controls.maxDistance=fittedDistance*1.75;
  camera.position.copy(controls.target).addScaledVector(direction,fittedDistance*(userZoomed?THREE.MathUtils.clamp(ratio,.52,1.75):1));
  controls.update();
 }else transition.reframe=true;
 // Keep projection and world matrices in sync before the next animation frame.
 camera.updateMatrixWorld(true);dirty=true;
}
function focus(id){
 activeFocus=focusPoints[id]?id:'overview';userZoomed=false;const f=frame(activeFocus,stage.clientWidth/stage.clientHeight||1);
 controls.enableDamping=false;controls.update();
 transition={start:performance.now(),fromT:controls.target.clone(),fromS:new THREE.Spherical().setFromVector3(camera.position.clone().sub(controls.target)),toT:f.target,toS:new THREE.Spherical().setFromVector3(f.direction.multiplyScalar(f.distance)),duration:reduced.matches?0:850};
 fittedDistance=f.distance;controls.minDistance=Math.max(5,f.distance*.52);controls.maxDistance=f.distance*1.75;dirty=true;hideLabel();
}
window.addEventListener('room-focus',e=>focus(e.detail));window.addEventListener('room-mode',e=>{modeCv=e.detail;if(modeCv)hideLabel();else{resize();dirty=true;}});
window.addEventListener('room-light',e=>{night=e.detail;skyMat.map=night?nightSky:daySky;skyMat.needsUpdate=true;dirty=true;});window.addEventListener('room-music',e=>{playing=e.detail;dirty=true;});
new ResizeObserver(resize).observe(stage);
controls.addEventListener('change',()=>{
 if(activeFocus==='overview'&&!transition&&!userZoomed){
  const direction=camera.position.clone().sub(controls.target).normalize();
  const fit=fittingDistance(roomBounds,controls.target,direction,camera.aspect);
  camera.position.copy(controls.target).addScaledVector(direction,fit);fittedDistance=fit;
  controls.minDistance=Math.max(5,fit*.52);controls.maxDistance=fit*1.75;
 }
 dirty=true;
});
canvas.addEventListener('wheel',()=>{userZoomed=true;},{capture:true,passive:true});
const touches=new Set();canvas.addEventListener('pointerdown',e=>{if(e.pointerType==='touch'){touches.add(e.pointerId);if(touches.size>1)userZoomed=true;}},{capture:true});
for(const type of ['pointerup','pointercancel'])canvas.addEventListener(type,e=>touches.delete(e.pointerId));controls.addEventListener('start',()=>{transition=null;controls.enableDamping=true;hideLabel();});
const raycaster=new THREE.Raycaster(),pointer=new THREE.Vector2(),label=document.querySelector('#object-label');let lastPointer=null,pointerDirty=false,down=null,hovered=null;
function hideLabel(){label.hidden=true;hovered=null;canvas.style.cursor=dragging?'grabbing':'grab';}
function hitAt(x,y){const r=canvas.getBoundingClientRect();pointer.set((x-r.left)/r.width*2-1,-(y-r.top)/r.height*2+1);raycaster.setFromCamera(pointer,camera);const hit=raycaster.intersectObject(room,true)[0];let object=hit?.object;while(object&&object!==room){if(object.userData.section)return object;object=object.parent;}return null;}
function updateHover(){pointerDirty=false;if(!lastPointer||dragging||modeCv)return;hovered=hitAt(lastPointer.x,lastPointer.y);if(!hovered){hideLabel();return;}document.querySelector('#object-name').textContent=hovered.userData.artwork?t('gallery.openWork',{title:hovered.userData.artwork.title}):t('object.'+hovered.userData.section);label.hidden=false;const width=label.offsetWidth,height=label.offsetHeight;label.style.left=Math.min(innerWidth-width-12,lastPointer.x+17)+'px';label.style.top=Math.min(innerHeight-height-12,lastPointer.y+17)+'px';canvas.style.cursor='pointer';}
canvas.addEventListener('pointermove',e=>{lastPointer={x:e.clientX,y:e.clientY};if(down&&Math.hypot(e.clientX-down.x,e.clientY-down.y)>6){dragging=true;hideLabel();}else pointerDirty=true;});
canvas.addEventListener('pointerdown',e=>{down={x:e.clientX,y:e.clientY};dragging=false;});
canvas.addEventListener('pointerup',e=>{if(e.button===0&&down&&!dragging&&Math.hypot(e.clientX-down.x,e.clientY-down.y)<7){const hit=hitAt(e.clientX,e.clientY);if(hit?.userData.artwork){const art=hit.userData.artwork;hideLabel();if(window.confirm(t('gallery.confirmOpen',{title:art.title})))window.open(art.artworkUrl,'_blank','noopener,noreferrer');}else if(hit)window.dispatchEvent(new CustomEvent('room-select',{detail:hit.userData.section}));}down=null;dragging=false;pointerDirty=true;});
canvas.addEventListener('pointerleave',()=>{down=null;dragging=false;lastPointer=null;hideLabel();});canvas.addEventListener('pointercancel',()=>{down=null;dragging=false;hideLabel();});
canvas.addEventListener('keydown',e=>{if(!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','+','-','=','0'].includes(e.key))return;e.preventDefault();transition=null;if(e.key==='0'){focus('overview');return;}if(['+','=','-'].includes(e.key)){userZoomed=true;const offset=camera.position.clone().sub(controls.target);offset.setLength(THREE.MathUtils.clamp(offset.length()*(e.key==='-'?1.1:.9),controls.minDistance,controls.maxDistance));camera.position.copy(controls.target).add(offset);}else{const s=new THREE.Spherical().setFromVector3(camera.position.clone().sub(controls.target));if(e.key==='ArrowLeft')s.theta-=.08;if(e.key==='ArrowRight')s.theta+=.08;if(e.key==='ArrowUp')s.phi-=.06;if(e.key==='ArrowDown')s.phi+=.06;s.theta=THREE.MathUtils.clamp(s.theta,controls.minAzimuthAngle,controls.maxAzimuthAngle);s.phi=THREE.MathUtils.clamp(s.phi,controls.minPolarAngle,controls.maxPolarAngle);camera.position.copy(controls.target).add(new THREE.Vector3().setFromSpherical(s));}controls.update();dirty=true;});
canvas.addEventListener('webglcontextlost',e=>{e.preventDefault();modeCv=true;canvas.hidden=true;document.querySelector('#room-fallback').hidden=false;document.querySelector('#room-help').textContent=t('help.fallback');hideLabel();});
canvas.addEventListener('webglcontextrestored',()=>location.reload());
scene.updateMatrixWorld(true);const initial=frame("overview",stage.clientWidth/stage.clientHeight||1);fittedDistance=initial.distance;controls.target.copy(initial.target);camera.position.copy(initial.target).addScaledVector(initial.direction,initial.distance);resize();controls.update();renderer.render(scene,camera);document.querySelector('#room-loading').classList.add('ready');
window.dispatchEvent(new CustomEvent('room-ready'));
if(matchMedia('(pointer:coarse)').matches)document.querySelector('#room-help').textContent=t('help.touch');
function animate(now){requestAnimationFrame(animate);if(document.hidden||modeCv||now-lastFrame<32)return;const dt=Math.min((now-lastFrame)/1000,.1);lastFrame=now;
 if(transition){
  if(transition.reframe){const f=frame(activeFocus,camera.aspect);transition.toT=f.target;transition.toS.setFromVector3(f.direction.multiplyScalar(f.distance));fittedDistance=f.distance;controls.minDistance=Math.max(5,f.distance*.52);controls.maxDistance=f.distance*1.75;transition.reframe=false;}
  const t=transition.duration===0?1:Math.min((now-transition.start)/transition.duration,1),k=t*t*(3-2*t);
  const s=new THREE.Spherical(THREE.MathUtils.lerp(transition.fromS.radius,transition.toS.radius,k),THREE.MathUtils.lerp(transition.fromS.phi,transition.toS.phi,k),THREE.MathUtils.lerp(transition.fromS.theta,transition.toS.theta,k));
  controls.target.lerpVectors(transition.fromT,transition.toT,k);camera.position.copy(controls.target).add(new THREE.Vector3().setFromSpherical(s));dirty=true;
  if(t===1){transition=null;controls.enableDamping=true;}
 }
 controls.update();
 const target=night?1:0;if(Math.abs(nightMix-target)>.001){nightMix=reduced.matches?target:THREE.MathUtils.damp(nightMix,target,5,dt);hemi.intensity=1.75-nightMix*1.39;key.intensity=3.05-nightMix*2.94;rim.intensity=.65-nightMix*.35;deskLamp.intensity=nightMix*9;floorLamp.intensity=nightMix*7;screenGlow.intensity=.05+nightMix*.9;warmWindow.intensity=nightMix*.4;opal.emissiveIntensity=.08+nightMix*1.5;screenMaterial.color.setScalar(1-nightMix*.2);tvMat.color.setScalar(1-nightMix*.15);dirty=true;}
 if(updateWallClock(Date.now(),motionEnabled&&!reduced.matches))dirty=true;
 animationTime+=motionEnabled?dt:0;if(companions.update(animationTime,dt,motionEnabled))dirty=true;
 // Update the globe at 8 fps only while visible and ambient motion is enabled.
 if(motionEnabled&&now-tvLastDraw>=125){redrawSurface(tvTexture,768,512,(g,w,h)=>drawTelevision(g,w,h,coastlines,animationTime));tvLastDraw=now;dirty=true;}
 if(playing&&motionEnabled){recordLabel.rotation.y-=dt*.9;dirty=true;}const toneTarget=playing?.47:0;if(Math.abs(tonearm.rotation.y-toneTarget)>.001){tonearm.rotation.y=!motionEnabled?toneTarget:THREE.MathUtils.damp(tonearm.rotation.y,toneTarget,5,dt);dirty=true;}
 if(dirty){renderer.render(scene,camera);dirty=false;}if(pointerDirty)updateHover();}
requestAnimationFrame(animate);

// Load locally hosted art without holding up navigation or the first room render.
function redrawSurface(tex,w,h,draw){const g=tex.image.getContext('2d');g.save();g.setTransform(tex.image.width/w,0,0,tex.image.height/h,0,0);g.clearRect(0,0,w,h);draw(g,w,h);g.restore();tex.needsUpdate=true;}
const studioAssetState={paintings:0,paper:false,coastlines:false,ready:false,errors:[]};
const assetJobs=gallerySurfaces.map(surface=>loadImage('art/'+surface.art.file).then(img=>{
 surface.image=img;redrawSurface(surface.tex,surface.pw,surface.ph,(g,w,h)=>drawArtwork(g,w,h,img,surface.art));studioAssetState.paintings++;dirty=true;
}));
assetJobs.push(loadImage('../academic/images/papers/2026-corl-hand-forecasting.png').then(img=>{paperImage=img;studioAssetState.paper=true;redrawSurface(monitorTexture,1024,640,(g,w,h)=>drawMonitor(g,w,h,paperImage));dirty=true;}));
assetJobs.push(fetch(new URL('art/coastlines.json',import.meta.url)).then(r=>{if(!r.ok)throw new Error('Coastlines: '+r.status);return r.json();}).then(data=>{coastlines=prepareCoastlines(data);studioAssetState.coastlines=true;redrawSurface(tvTexture,768,512,(g,w,h)=>drawTelevision(g,w,h,coastlines,animationTime));dirty=true;}));
assetJobs.push(document.fonts.load('500 24px "DM Sans"'));
Promise.allSettled(assetJobs).then(results=>{
 studioAssetState.errors=results.filter(r=>r.status==='rejected').map(r=>String(r.reason));
 if(studioAssetState.errors.length)console.warn('Studio artwork loading:',studioAssetState.errors);
 for(let i=0;i<gallerySurfaces.length;i++){const s=gallerySurfaces[i];redrawSurface(s.label,512,128,(g,w,h)=>drawArtLabel(g,w,h,s.art,LINES[i].name,LINES[i].color));}
 redrawSurface(boardTexture,1024,724,drawResearchBoard);
 redrawSurface(monitorTexture,1024,640,(g,w,h)=>drawMonitor(g,w,h,paperImage));
 redrawSurface(tvTexture,768,512,(g,w,h)=>drawTelevision(g,w,h,coastlines,animationTime));studioAssetState.ready=true;dirty=true;
});

if(new URLSearchParams(location.search).has('qa'))window.__ROOM_QA={camera,controls,scene,room,companions,frame,roomBounds,wallClock,clockHands,studioAssetState,monitorTexture,tvTexture,boardTexture,daySky,nightSky,gallerySurfaces,get motionEnabled(){return motionEnabled;},get transitioning(){return !!transition;},get activeFocus(){return activeFocus;}};

window.addEventListener('language-change',()=>{hideLabel();pointerDirty=true;});
