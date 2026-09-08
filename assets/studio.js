import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const canvas=document.querySelector('#scene');
const wrap=document.querySelector('#scene-wrap');
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
const renderer=new THREE.WebGLRenderer({canvas,antialias:true,alpha:true,powerPreference:'low-power'});
renderer.setPixelRatio(Math.min(devicePixelRatio,innerWidth<640?1.5:2));
renderer.outputColorSpace=THREE.SRGBColorSpace;
renderer.toneMapping=THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure=1.18;
renderer.shadowMap.enabled=true;
renderer.shadowMap.type=THREE.PCFSoftShadowMap;
const scene=new THREE.Scene();
const camera=new THREE.OrthographicCamera(-5,5,5,-5,.1,80);
camera.position.set(9,8.1,10.5);
const target=new THREE.Vector3(0,1.15,0);
const controls=new OrbitControls(camera,canvas);
controls.target.copy(target);controls.enableDamping=true;controls.dampingFactor=.09;
controls.enableZoom=false;controls.enablePan=false;
controls.minPolarAngle=.64;controls.maxPolarAngle=1.18;
controls.minAzimuthAngle=.15;controls.maxAzimuthAngle=1.25;
// A one-finger vertical gesture still scrolls the page on touch devices.
controls.touches.ONE=THREE.TOUCH.PAN;controls.touches.TWO=THREE.TOUCH.DOLLY_ROTATE;canvas.style.touchAction='pan-y';
const hemi=new THREE.HemisphereLight(0xfdf6e8,0xa09c88,2.4);scene.add(hemi);
const sun=new THREE.DirectionalLight(0xffe4bf,4.1);sun.position.set(3.5,8,4);sun.castShadow=true;
sun.shadow.mapSize.set(2048,2048);sun.shadow.camera.left=-7;sun.shadow.camera.right=7;sun.shadow.camera.top=7;sun.shadow.camera.bottom=-7;sun.shadow.camera.near=.5;sun.shadow.camera.far=25;sun.shadow.normalBias=.025;sun.shadow.bias=-.0001;sun.shadow.radius=4;scene.add(sun);
const fill=new THREE.DirectionalLight(0xe2edfa,.8);fill.position.set(-4,5,6);scene.add(fill);
const lampLight=new THREE.PointLight(0xffb76f,0,4,2);lampLight.position.set(1.65,2.12,-1.05);scene.add(lampLight);
const monitorLight=new THREE.PointLight(0xb9d7dc,.15,2,2);monitorLight.position.set(.45,1.65,-1);scene.add(monitorLight);
const room=new THREE.Group();scene.add(room);
const mat=(color,roughness=.85,metalness=0)=>new THREE.MeshStandardMaterial({color,roughness,metalness});
const M={wall:mat('#e4ded0'),edge:mat('#c2b8a2'),oak:mat('#b99a72'),oakLight:mat('#ccb18a'),dark:mat('#3d433c'),green:mat('#66745c'),rust:mat('#ac553c'),brass:mat('#ae9461',.35,.65),paper:mat('#f4efdf'),blue:mat('#789294'),clay:mat('#c38568'),cream:mat('#eae5d8')};
function box(w,h,d,material,x,y,z,parent=room,bevel=0){let g;
 if(bevel){const s=new THREE.Shape();const a=w/2-bevel,b=h/2-bevel;s.moveTo(-a,-b);s.lineTo(a,-b);s.lineTo(a,b);s.lineTo(-a,b);s.closePath();g=new THREE.ExtrudeGeometry(s,{depth:d-2*bevel,bevelEnabled:true,bevelSegments:3,steps:1,bevelSize:bevel,bevelThickness:bevel,curveSegments:1});g.translate(0,0,-d/2+bevel);}else g=new THREE.BoxGeometry(w,h,d);
 const mesh=new THREE.Mesh(g,material);mesh.position.set(x,y,z);mesh.castShadow=true;mesh.receiveShadow=true;parent.add(mesh);return mesh;}
function cylinder(rt,rb,h,material,x,y,z,parent=room,segments=40){const m=new THREE.Mesh(new THREE.CylinderGeometry(rt,rb,h,segments),material);m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;parent.add(m);return m;}
function sphere(rx,ry,rz,material,x,y,z,parent=room){const m=new THREE.Mesh(new THREE.SphereGeometry(1,24,16),material);m.scale.set(rx,ry,rz);m.position.set(x,y,z);m.castShadow=true;parent.add(m);return m;}
function rod(a,b,r,material,parent=room){const start=new THREE.Vector3(...a),end=new THREE.Vector3(...b);const mid=start.clone().add(end).multiplyScalar(.5);const m=cylinder(r,r,start.distanceTo(end),material,...mid.toArray(),parent,12);m.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),end.sub(start).normalize());return m;}
let seed=29;function random(){seed=(1664525*seed+1013904223)>>>0;return seed/4294967296;}
function texture(width,height,draw){const c=document.createElement('canvas');c.width=width;c.height=height;draw(c.getContext('2d'),width,height);const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;t.anisotropy=Math.min(renderer.capabilities.getMaxAnisotropy(),8);return t;}
function plane(w,h,material,x,y,z,parent=room){const m=new THREE.Mesh(new THREE.PlaneGeometry(w,h),material);m.position.set(x,y,z);parent.add(m);return m;}
function shadow(w,d,x,z,opacity=.22){const tex=texture(128,128,g=>{const a=g.createRadialGradient(64,64,3,64,64,63);a.addColorStop(0,`rgba(30,25,15,${opacity})`);a.addColorStop(1,'rgba(30,25,15,0)');g.fillStyle=a;g.fillRect(0,0,128,128);});const m=plane(w,d,new THREE.MeshBasicMaterial({map:tex,transparent:true,depthWrite:false}),x,.021,z);m.rotation.x=-Math.PI/2;}
// A warm architectural model, with a substantial plinth and finely laid oak boards.
const floorTex=texture(1024,1024,(g,w,h)=>{g.fillStyle='#c5b295';g.fillRect(0,0,w,h);for(let row=0;row<16;row++){const y=row*64;g.fillStyle=`rgba(${random()>.5?'255,243,211':'109,79,45'},.06)`;g.fillRect(0,y,w,64);g.strokeStyle='rgba(100,80,54,.18)';g.lineWidth=1;g.beginPath();g.moveTo(0,y);g.lineTo(w,y);g.stroke();for(let i=0;i<55;i++){g.strokeStyle=`rgba(101,77,42,${random()*.07})`;const yy=y+random()*64;g.beginPath();g.moveTo(0,yy);g.bezierCurveTo(300,yy+random()*4,600,yy-random()*4,w,yy);g.stroke();}for(let x=(row%3)*120;x<w;x+=350){g.strokeStyle='rgba(100,80,54,.15)';g.beginPath();g.moveTo(x,y);g.lineTo(x,y+64);g.stroke();}}});
box(6.25,.28,5.25,M.edge,0,-.16,0,room,.045);
box(6.1,.045,5.1,new THREE.MeshStandardMaterial({map:floorTex,roughness:.92}),0,0,0);
box(6.25,3.48,.16,M.wall,0,1.72,-2.57);
box(.16,3.48,5.1,mat('#d4d1bf'),-3.045,1.72,0);
box(6.07,.1,.055,M.cream,0,.08,-2.46);
box(.055,.1,5.04,M.cream,-2.945,.08,0);
box(6.3,.07,.22,M.cream,0,3.49,-2.57);
box(.22,.07,5.17,M.cream,-3.045,3.49,.015);
const ground=new THREE.Mesh(new THREE.PlaneGeometry(200,200),new THREE.ShadowMaterial({opacity:.12}));ground.rotation.x=-Math.PI/2;ground.position.y=-.32;ground.receiveShadow=true;scene.add(ground);
// The window is an original painted skyline, embedded locally as a canvas texture.
function skyTexture(night){return texture(768,768,(g,w,h)=>{const grad=g.createLinearGradient(0,0,0,h);grad.addColorStop(0,night?'#283b4c':'#a8c0c0');grad.addColorStop(.7,night?'#5a6470':'#e6daca');grad.addColorStop(1,night?'#b58a68':'#f5e6c8');g.fillStyle=grad;g.fillRect(0,0,w,h);g.fillStyle=night?'#f3d4a6':'#f8edda';g.beginPath();g.arc(535,175,49,0,Math.PI*2);g.fill();for(let layer=0;layer<3;layer++){g.fillStyle=night?['#52606a','#44515b','#34454e'][layer]:['#bac6bf','#a1b5ad','#839e96'][layer];for(let i=0;i<17;i++){const x=i*51+layer*15,top=430+random()*120+layer*55;g.fillRect(x,top,35+random()*20,h-top);if(night){g.fillStyle='#d9b882';for(let a=0;a<3;a++)for(let b=0;b<5;b++)if(random()>.4)g.fillRect(x+6+a*9,top+12+b*19,3,5);g.fillStyle=['#52606a','#44515b','#34454e'][layer];}}}g.strokeStyle=night?'#d9a788':'#8fa9a1';g.lineWidth=5;g.beginPath();g.moveTo(372,680);g.lineTo(403,352);g.lineTo(435,680);g.moveTo(381,548);g.lineTo(426,548);g.moveTo(386,493);g.lineTo(420,493);g.moveTo(403,352);g.lineTo(403,300);g.stroke();});}
const skyDay=skyTexture(false),skyNight=skyTexture(true);
const windowMat=new THREE.MeshBasicMaterial({map:skyDay});
plane(2.53,1.99,windowMat,1.36,2.14,-2.465);
for(const x of [.05,2.68])box(.075,2.14,.17,M.cream,x,2.14,-2.39);
for(const y of [1.105,3.175])box(2.72,.075,.17,M.cream,1.36,y,-2.39);
box(.045,2.07,.09,M.cream,1.36,2.14,-2.35);box(2.64,.045,.09,M.cream,1.36,2.11,-2.35);
box(2.92,.095,.4,M.paper,1.36,1.075,-2.34,room,.015);
// Quiet sunlight on the floor, cut into the rhythm of the window frame.
const sunPatch=new THREE.Group();room.add(sunPatch);
for(let i=0;i<2;i++)for(let j=0;j<2;j++){const p=plane(.93,1.05,new THREE.MeshBasicMaterial({color:0xfff2c9,transparent:true,opacity:.15,depthWrite:false}),.55+i*1.03,.033,.05+j*1.13,sunPatch);p.rotation.x=-Math.PI/2;p.rotation.z=-.27;}
// Four research prints, individually drawn as original geometric compositions.
const artColors=['#637b83','#b75a40','#ad8b47','#74816b'];
function artTexture(i){return texture(384,512,(g,w,h)=>{g.fillStyle='#f0e8d6';g.fillRect(0,0,w,h);g.fillStyle='#49483e';g.font='14px sans-serif';g.fillText('STUDIES IN SOCIAL INTELLIGENCE',27,38);g.fillStyle=artColors[i];g.strokeStyle=artColors[i];g.lineWidth=3;
 if(i===0){for(let k=0;k<5;k++){g.beginPath();g.ellipse(192,245,135-k*23,100,0,0,Math.PI*2);g.stroke();}g.beginPath();g.arc(192,245,30,0,Math.PI*2);g.fill();}
 if(i===1){g.fillRect(68,150,108,195);g.beginPath();g.arc(215,208,70,-Math.PI/2,Math.PI/2);g.fill();g.fillStyle='#dbb983';g.beginPath();g.arc(221,307,38,0,Math.PI*2);g.fill();}
 if(i===2){g.globalAlpha=.8;g.beginPath();g.arc(136,249,95,0,Math.PI*2);g.fill();g.globalAlpha=.6;g.beginPath();g.arc(243,249,95,0,Math.PI*2);g.fill();g.globalAlpha=1;g.strokeStyle='#f0e8d6';g.beginPath();g.moveTo(135,150);g.lineTo(245,347);g.stroke();}
 if(i===3){for(let k=0;k<5;k++){g.strokeRect(65+k*22,125+k*22,253-k*44,253-k*44);}g.fillRect(163,223,57,57);}
 g.fillStyle='#393d35';g.font='38px Georgia,serif';g.fillText(['Read.','Act.','Together.','Trust.'][i],27,445);g.font='12px sans-serif';g.fillText('0'+(i+1)+'   /   CAIXIN KANG',28,480);});}
for(let i=0;i<4;i++){const x=-2.24+(i%2)*1.02,y=i<2?2.68:1.39;box(.84,1.14,.07,M.oak,x,y,-2.435);plane(.76,1.06,new THREE.MeshStandardMaterial({map:artTexture(i),roughness:.95}),x,y,-2.392);}
// Low green storage, linen rug, and a walnut record player.
box(1.48,.67,.64,M.green,-2,.39,1.5,room,.025);
for(const x of [-2.56,-1.44])for(const z of [1.29,1.72])cylinder(.035,.027,.13,M.oak,x,.08,z);
for(const x of [-2.36,-1.64]){box(.7,.58,.025,M.green,x,.4,1.835,room,.01);sphere(.025,.025,.025,M.brass,x+.2,.44,1.861);}
box(1.54,.065,.71,M.oakLight,-2,.76,1.5,room,.015);
const rugTex=texture(512,512,(g,w,h)=>{g.fillStyle='#cc9875';g.fillRect(0,0,w,h);g.fillStyle='#d9b194';g.fillRect(24,24,w-48,h-48);g.strokeStyle='#af7656';g.lineWidth=3;for(let i=0;i<4;i++)g.strokeRect(37+i*8,37+i*8,w-74-i*16,h-74-i*16);g.strokeStyle='rgba(243,224,189,.22)';g.lineWidth=1;for(let i=0;i<w;i+=3){g.beginPath();g.moveTo(i,0);g.lineTo(i,h);g.stroke();}for(let i=0;i<h;i+=4){g.beginPath();g.moveTo(0,i);g.lineTo(w,i);g.stroke();}});
const rug=box(2.45,.015,2.2,new THREE.MeshStandardMaterial({map: rugTex,roughness:1}),.25,.045,.65);rug.rotation.y=.02;
for(let i=0;i<32;i++){box(.018,.011,.08,M.cream,-.94+i*.075,.045,1.79);box(.018,.011,.08,M.cream,-.94+i*.075,.045,-.49);}
const recordBase=box(.99,.11,.51,mat('#8b6849'),-2,.86,1.5,room,.023);
box(.93,.022,.46,M.dark,-2,.93,1.5,room,.01);
const vinyl=cylinder(.193,.193,.017,mat('#242922',.38),-2.12,.953,1.5);
for(let r=.075;r<.187;r+=.014){const ring=new THREE.Mesh(new THREE.TorusGeometry(r,.0018,5,70),mat('#41433a',.65));ring.rotation.x=-Math.PI/2;ring.position.set(-2.12,.963,1.5);room.add(ring);}
const label=cylinder(.065,.065,.002,M.rust,-2.12,.966,1.5);
box(.024,.002,.055,M.paper,0,.004,0,label);
cylinder(.008,.008,.025,M.brass,-2.12,.98,1.5);
const tonearm=new THREE.Group();tonearm.position.set(-1.68,.983,1.35);room.add(tonearm);rod([0,0,0],[-.025,0,.28],.012,M.brass,tonearm);box(.045,.025,.065,M.dark,-.025,-.01,.3,tonearm);
// Floating shelves with books: varied spines, fine gold rules, and small ceramics.
for(const y of [1.2,2.08]){box(.6,.06,1.8,M.oakLight,-2.64,y,-.65);box(.03,.17,.1,M.brass,-2.89,y-.1,-1.27);box(.03,.17,.1,M.brass,-2.89,y-.1,-.02);}
const bookMats=[M.rust,M.paper,M.blue,M.dark,M.green,mat('#c2a363')];
for(let row=0;row<2;row++)for(let i=0;i<9;i++){const h=.31+random()*.25,z=-1.37+i*.15,material=bookMats[(i+row*3)%bookMats.length];box(.34,h,.105,material,-2.61,1.24+row*.88+h/2,z,room,.006);box(.003,.008,.071,M.brass,-2.433,1.3+row*.88,z);box(.003,.008,.071,M.brass,-2.433,1.34+row*.88,z);}
cylinder(.1,.07,.24,M.clay,-2.62,2.25,.13);cylinder(.061,.095,.16,M.clay,-2.62,2.42,.13);
rod([-2.62,2.48,.13],[-2.59,2.9,.18],.008,M.dark);sphere(.055,.12,.025,M.green,-2.57,2.71,.18).rotation.z=-.6;
// The desk is the center of the room. Rounded oak edges, a quiet green chair.
box(2.64,.115,1.06,M.oakLight,.99,1.17,-1.31,room,.035);
for(const x of [-.15,2.13])for(const z of [-1.7,-.93]){rod([x,1.12,z],[x+(x<0?-.08:.08),.04,z+.05],.038,M.oak);}
box(.62,.38,.78,M.oak,1.78,.91,-1.36,room,.017);for(const y of [.82,1]){box(.58,.16,.015,M.oakLight,1.78,y,-.958);box(.13,.02,.025,M.brass,1.78,y,-.933);}
shadow(3,1.8,1,-1.2,.19);
// Monitor with a bespoke research terminal texture.
box(.88,.61,.065,M.dark,.5,1.71,-1.59,room,.025);
const screenTex=texture(640,420,(g,w,h)=>{g.fillStyle='#283e3c';g.fillRect(0,0,w,h);g.fillStyle='#c0cabc';g.font='13px monospace';g.fillText('UT-VISION / RESEARCH IN PROGRESS',35,42);g.strokeStyle='#59736a';g.beginPath();g.moveTo(35,65);g.lineTo(605,65);g.stroke();g.fillStyle='#ede3c9';g.font='45px Georgia,serif';g.fillText('Hello, world.',35,144);g.font='19px Georgia,serif';g.fillText('Let’s understand each other.',35,183);g.strokeStyle='#c4ae80';g.lineWidth=1.5;for(let i=0;i<5;i++){g.beginPath();g.ellipse(470,280,90-i*15,57,0,0,Math.PI*2);g.stroke();}g.fillStyle='#a2b7a0';g.font='14px monospace';g.fillText('> perceive',35,273);g.fillText('> interact',35,305);g.fillText('> understand_',35,337);});
const screenMat=new THREE.MeshStandardMaterial({map:screenTex,emissive:0xffffff,emissiveMap:screenTex,emissiveIntensity:.35,roughness:.55});
plane(.799,.513,screenMat,.5,1.72,-1.551);rod([.5,1.22,-1.61],[.5,1.45,-1.61],.032,M.dark);box(.37,.018,.22,M.dark,.5,1.239,-1.55,room,.007);
box(.65,.028,.23,M.cream,.51,1.244,-1.12,room,.008);for(let row=0;row<4;row++)for(let i=0;i<12;i++)box(.041,.008,.034,M.paper,.233+i*.048,1.263,-1.203+row*.048);
sphere(.065,.026,.094,M.cream,1.06,1.263,-1.11);
// Open notebook, pencil, and coffee. Tiny objects provide a human scale.
const notebook=new THREE.Group();notebook.position.set(-.06,1.238,-1.19);notebook.rotation.y=-.2;room.add(notebook);
box(.41,.015,.31,M.paper,0,0,0,notebook);box(.005,.003,.3,M.oak,0,.01,0,notebook);
for(let i=0;i<5;i++)box(.135,.002,.002,M.blue,-.098,.01,-.09+i*.035,notebook);
rod([-.16,.024,.13],[.19,.024,.1],.006,M.rust,notebook);
const coffee=cylinder(.075,.059,.14,M.cream,1.34,1.295,-1.28);cylinder(.063,.063,.002,mat('#544234'),1.34,1.366,-1.28);
const handle=new THREE.Mesh(new THREE.TorusGeometry(.044,.014,10,24),M.cream);handle.position.set(1.418,1.3,-1.28);room.add(handle);
// Articulated brass desk lamp; its pool of light changes with the studio state.
cylinder(.13,.14,.033,M.dark,1.92,1.251,-1.52);
rod([1.92,1.27,-1.52],[1.92,1.8,-1.52],.019,M.brass);rod([1.92,1.8,-1.52],[1.58,2.03,-1.36],.019,M.brass);
sphere(.035,.035,.035,M.dark,1.92,1.8,-1.52);
const shade=cylinder(.055,.19,.17,M.green,1.58,1.97,-1.36);shade.rotation.z=-.18;
const bulbMat=new THREE.MeshStandardMaterial({color:0xffe6bb,emissive:0xffcc7c,emissiveIntensity:.2});cylinder(.165,.165,.008,bulbMat,1.566,1.885,-1.36);
// Chair: soft upholstery, arched back, brass-tipped legs.
const chair=new THREE.Group();chair.position.set(.7,0,.05);chair.rotation.y=-.18;room.add(chair);
box(.7,.17,.64,M.green,0,.64,0,chair,.065);box(.72,.47,.13,M.green,0,.99,.25,chair,.065);
for(const x of [-.27,.27])for(const z of [-.22,.22]){rod([x,.57,z],[x*1.2,.045,z*1.35],.025,M.dark,chair);cylinder(.026,.026,.07,M.brass,x*1.2,.06,z*1.35,chair,12);}
rod([-.25,.57,.23],[-.25,1.02,.25],.021,M.dark,chair);rod([.25,.57,.23],[.25,1.02,.25],.021,M.dark,chair);
shadow(1.4,1.3,.7,.08,.2);
// Plant with individually posed leaves, beside a stack of well-read books.
cylinder(.255,.18,.5,M.clay,2.23,.28,1.63);cylinder(.23,.23,.017,mat('#534938'),2.23,.536,1.63);
for(let i=0;i<10;i++){const angle=i*2.4,top=.9+random()*.65,x=2.23+Math.cos(angle)*(.2+random()*.2),z=1.63+Math.sin(angle)*.32;rod([2.23,.53,1.63],[x,top,z],.01,M.green);const leaf=sphere(.11,.27,.035,i%2?M.green:mat('#849172'),x,top,z);leaf.rotation.set(.4,angle,(i%2?1:-1)*.6);}
shadow(1.1,1.1,2.23,1.63,.17);
box(.52,.07,.39,M.blue,1.7,.083,1.22);box(.49,.08,.36,M.paper,1.71,.158,1.23).rotation.y=.13;box(.51,.05,.34,M.rust,1.7,.224,1.22).rotation.y=-.09;
// A small round side table with a ceramic sculptural object.
cylinder(.37,.37,.07,M.oakLight,-.62,.49,1.35);cylinder(.055,.07,.44,M.dark,-.62,.24,1.35);cylinder(.23,.23,.025,M.dark,-.62,.029,1.35);
cylinder(.07,.1,.16,M.cream,-.7,.61,1.35);sphere(.078,.095,.07,M.cream,-.7,.73,1.35);cylinder(.032,.052,.075,M.cream,-.7,.82,1.35);
box(.23,.022,.3,M.rust,-.51,.541,1.35).rotation.y=.17;
// Left wall noticeboard, facing inward.
const notice=new THREE.Group();notice.position.set(-2.946,2.3,1.33);notice.rotation.y=Math.PI/2;room.add(notice);
box(.92,.84,.025,M.oak,0,0,0,notice);
plane(.84,.76,new THREE.MeshStandardMaterial({map:texture(384,384,(g,w,h)=>{g.fillStyle='#bca27a';g.fillRect(0,0,w,h);for(let i=0;i<4500;i++){g.fillStyle=random()>.5?'#c6ad87':'#af946f';g.fillRect(random()*w,random()*h,2,2);}for(let i=0;i<3;i++){g.save();g.translate(35+i*92,45+(i%2)*65);g.rotate((i-1)*.08);g.fillStyle=['#efe7d5','#d5dfd0','#ded3bd'][i];g.fillRect(0,0,120,155);g.fillStyle='#4b5146';g.font='13px sans-serif';g.fillText(['A new','Keep','What if'][i],12,50);g.fillText(['perspective.','asking.','we could?'][i],12,70);g.fillStyle='#a95035';g.beginPath();g.arc(60,8,4,0,Math.PI*2);g.fill();g.restore();}}),roughness:1}),0,0,.017,notice);

// These are real scene anchors, projected each frame into accessible DOM buttons.
const definitions=[
 {id:'map',label:'The research wall',n:'01',position:[-1.68,3.1,-2.3]},
 {id:'about',label:'Meet the researcher',n:'02',position:[.53,2.12,-1.48]},
 {id:'edu',label:'Education & experience',n:'03',position:[-2.35,2.7,-.62]},
 {id:'music',label:'Play / pause Boléro',n:'♪',position:[-1.99,1.05,1.5]},
 {id:'news',label:'Notes from the lab',n:'04',position:[-2.78,2.65,1.38]},
];
const anchors=definitions.map(a=>{const button=document.createElement('button');button.className='hotspot';button.setAttribute('aria-label',a.label);button.innerHTML=`${a.n}<span class="hotspot-label">${a.label}</span>`;button.addEventListener('click',()=>window.dispatchEvent(new CustomEvent('studio-select',{detail:a.id})));document.querySelector('#hotspots').append(button);return {...a,button,point:new THREE.Vector3(...a.position)};});
const projected=new THREE.Vector3();
function updateAnchors(){for(const a of anchors){projected.copy(a.point).project(camera);const x=(projected.x*.5+.5)*wrap.clientWidth,y=(-projected.y*.5+.5)*wrap.clientHeight;a.button.classList.toggle('label-left',x>wrap.clientWidth*.6);a.button.style.left=`${x}px`;a.button.style.top=`${y}px`;a.button.hidden=projected.z>1||x<12||y<12||x>wrap.clientWidth-12||y>wrap.clientHeight-12;}}
function resize(){const w=wrap.clientWidth,h=wrap.clientHeight;if(!w||!h)return;renderer.setSize(w,h,false);const aspect=w/h;const size=aspect<1?8.25/aspect:8.25;camera.left=-size*aspect/2;camera.right=size*aspect/2;camera.top=size/2;camera.bottom=-size/2;camera.updateProjectionMatrix();dirty=true;}
let dirty=true,visible=true,night=false,nightMix=0,musicPlaying=false,last=0;
const observer=new ResizeObserver(resize);observer.observe(wrap);
new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;if(visible)dirty=true;},{rootMargin:'100px'}).observe(wrap);
window.addEventListener('studio-resize',()=>{const expanded=document.querySelector('#studio').classList.contains('expanded');controls.touches.ONE=expanded?THREE.TOUCH.ROTATE:THREE.TOUCH.PAN;canvas.style.touchAction=expanded?'none':'pan-y';resize();});
controls.addEventListener('change',()=>dirty=true);
document.querySelector('#reset-view').addEventListener('click',()=>{camera.position.set(9,8.1,10.5);controls.target.copy(target);controls.update();dirty=true;});
document.querySelector('#theme-toggle').addEventListener('click',()=>{night=!night;document.querySelector('#theme-toggle').setAttribute('aria-pressed',String(night));document.querySelector('#theme-toggle').setAttribute('aria-label',night?'Switch studio to daytime':'Switch studio to nighttime');windowMat.map=night?skyNight:skyDay;windowMat.needsUpdate=true;dirty=true;});
window.addEventListener('studio-music',e=>{musicPlaying=e.detail;dirty=true;});
canvas.addEventListener('keydown',e=>{if(!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(e.key))return;e.preventDefault();const offset=camera.position.clone().sub(controls.target),s=new THREE.Spherical().setFromVector3(offset);if(e.key==='ArrowLeft')s.theta-=.08;if(e.key==='ArrowRight')s.theta+=.08;if(e.key==='ArrowUp')s.phi-=.06;if(e.key==='ArrowDown')s.phi+=.06;s.theta=THREE.MathUtils.clamp(s.theta,.15,1.25);s.phi=THREE.MathUtils.clamp(s.phi,.64,1.18);camera.position.copy(controls.target).add(new THREE.Vector3().setFromSpherical(s));controls.update();dirty=true;});
canvas.addEventListener('webglcontextlost',e=>{e.preventDefault();canvas.hidden=true;document.querySelector('#scene-fallback').hidden=false;document.querySelector('#hotspots').hidden=true;document.querySelector('#scene-hint').textContent='A QUIET VIEW OF THE STUDIO';});
canvas.addEventListener('webglcontextrestored',()=>location.reload());
if(matchMedia('(pointer: coarse)').matches)document.querySelector('#scene-hint').textContent='TWO FINGERS TO ROTATE · TAP TO DISCOVER';
resize();controls.update();renderer.render(scene,camera);updateAnchors();document.querySelector('#scene-loading').classList.add('loaded');
function animate(now){requestAnimationFrame(animate);if(document.hidden||!visible||now-last<32)return;const dt=Math.min((now-last)/1000,.1);last=now;controls.update();const destination=night?1:0;if(Math.abs(nightMix-destination)>.001){nightMix=reduced.matches?destination:THREE.MathUtils.damp(nightMix,destination,5,dt);hemi.intensity=2.4-nightMix*1.7;sun.intensity=4.1-nightMix*3.85;fill.intensity=.8+nightMix*.3;lampLight.intensity=nightMix*5;monitorLight.intensity=.15+nightMix*.6;screenMat.emissiveIntensity=.35+nightMix*.4;bulbMat.emissiveIntensity=.2+nightMix*2;sunPatch.visible=nightMix<.5;dirty=true;}
 if(musicPlaying&&!reduced.matches){label.rotation.y-=dt*.6;dirty=true;}const armTarget=musicPlaying?.42:0;if(Math.abs(tonearm.rotation.y-armTarget)>.001){tonearm.rotation.y=reduced.matches?armTarget:THREE.MathUtils.damp(tonearm.rotation.y,armTarget,5,dt);dirty=true;}
 if(dirty){renderer.render(scene,camera);updateAnchors();dirty=false;}}
requestAnimationFrame(animate);
