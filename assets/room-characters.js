import * as THREE from 'three';

// Smooth, sculpted studio companions. Original orange / ochre / red identities are retained.
export function createCompanions(parent, material) {
 const sphereGeometry=new THREE.SphereGeometry(1,36,28),up=new THREE.Vector3(0,1,0);
 const mesh=(geometry,mat,p,pos=[0,0,0])=>{const m=new THREE.Mesh(geometry,mat);m.position.set(...pos);m.castShadow=true;m.receiveShadow=true;p.add(m);return m;};
 const ellipsoid=(p,mat,pos,scale)=>{const m=mesh(sphereGeometry,mat,p,pos);m.scale.set(...scale);return m;};
 const curve=(p,mat,points,r=.008)=>mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points.map(a=>new THREE.Vector3(...a))),32,r,8,false),mat,p);
 const lathe=(p,mat,profile,pos=[0,0,0])=>{const points=new THREE.SplineCurve(profile.map(a=>new THREE.Vector2(...a))).getPoints(44);return mesh(new THREE.LatheGeometry(points,56),mat,p,pos);};
 const rounded=(p,mat,w,h,d,pos,bevel=.02)=>{const x=w/2-bevel,y=h/2-bevel,s=new THREE.Shape();s.moveTo(-x,-y);s.lineTo(x,-y);s.lineTo(x,y);s.lineTo(-x,y);s.closePath();const g=new THREE.ExtrudeGeometry(s,{depth:Math.max(.002,d-2*bevel),steps:1,bevelEnabled:true,bevelSegments:4,bevelSize:bevel,bevelThickness:bevel});g.translate(0,0,-d/2+bevel);return mesh(g,mat,p,pos);};
 const limb=(p,mat,a,b,r1,r2)=>{const av=new THREE.Vector3(...a),bv=new THREE.Vector3(...b),len=av.distanceTo(bv);const m=mesh(new THREE.CylinderGeometry(r2,r1,len,28,1),mat,p);m.position.copy(av).add(bv).multiplyScalar(.5);m.quaternion.setFromUnitVectors(up,bv.sub(av).normalize());ellipsoid(p,mat,a,[r1,r1,r1]);ellipsoid(p,mat,b,[r2,r2,r2]);return m;};
 const basic=c=>new THREE.MeshBasicMaterial({color:c});
 const fur=material('#d8954b',.64),furLight=material('#e9ac62',.7),cream=material('#f5dfb5',.75),stripe=material('#ac632e',.78),pink=material('#cc8984',.66),dark=material('#302b27',.34),ivory=material('#fff4d9',.55),iris=material('#72946b',.32),glint=basic('#fffaf0');
 const cat=new THREE.Group();cat.name='studio-cat';cat.position.set(-1.5,.035,2.75);cat.rotation.y=.48;cat.scale.setScalar(.94);cat.userData={section:'cat',label:'Studio companion / Say hello'};parent.add(cat);
 const catBody=new THREE.Group();cat.add(catBody);
 const body=lathe(catBody,fur,[[.06,.025],[.23,.07],[.305,.22],[.29,.42],[.235,.65],[.18,.88],[.12,.96]]);body.scale.z=1.04;
 const bib=ellipsoid(catBody,cream,[0,.64,.247],[.148,.224,.06]);bib.rotation.x=-.13;
 // Rounded, grounded paws with subtle toes, instead of a stack of visible joints.
 for(const side of [-1,1]){
  ellipsoid(cat,fur,[side*.225,.18,.0],[.123,.17,.18]);
  // Closed, curved forelegs: the upper ends taper back inside the chest.
  // The previous open lathe ended in front of the body, exposing a cut-off rim.
  const leg=lathe(cat,furLight,[[0,.055],[.048,.075],[.067,.14],[.061,.34],[.071,.51],[.069,.61],[.038,.69],[0,.735]],[side*.117,0,.27]);
  leg.name=side<0?'cat-foreleg-left':'cat-foreleg-right';
  const positions=leg.geometry.attributes.position;
  for(let i=0;i<positions.count;i++)positions.setZ(i,positions.getZ(i)-THREE.MathUtils.smoothstep(positions.getY(i),.2,.735)*.18);
  positions.needsUpdate=true;leg.geometry.computeVertexNormals();
  ellipsoid(cat,cream,[side*.124,.073,.371],[.083,.057,.124]);
  for(const dx of [-.022,.022])curve(cat,stripe,[[side*.124+dx,.097,.458],[side*.124+dx,.11,.429],[side*.124+dx,.111,.411]],.0022);
 }
 const catHead=new THREE.Group();catHead.position.set(0,1.02,.13);cat.add(catHead);
 ellipsoid(catHead,furLight,[0,0,0],[.283,.251,.236]);
 ellipsoid(catHead,cream,[0,-.12,.157],[.13,.072,.096]);
 for(const side of [-1,1])ellipsoid(catHead,cream,[side*.075,-.065,.208],[.084,.061,.045]);
 const noseShape=new THREE.Shape();noseShape.moveTo(-.033,.006);noseShape.quadraticCurveTo(0,.027,.033,.006);noseShape.quadraticCurveTo(.021,-.016,0,-.028);noseShape.quadraticCurveTo(-.02,-.016,-.033,.006);
 const nose=mesh(new THREE.ExtrudeGeometry(noseShape,{depth:.013,bevelEnabled:true,bevelSize:.003,bevelThickness:.003,bevelSegments:3,steps:1}),pink,catHead,[0,-.051,.252]);
 curve(catHead,dark,[[0,-.075,.254],[0,-.1,.252],[-.036,-.11,.245]],.0035);curve(catHead,dark,[[0,-.097,.254],[.021,-.112,.25],[.043,-.106,.237]],.0035);
 const catEyes=[],ears=[];
 for(const side of [-1,1]){
  const eye=new THREE.Group();eye.position.set(side*.117,.034,.207);eye.rotation.y=side*.18;catHead.add(eye);
  ellipsoid(eye,dark,[0,0,0],[.064,.074,.034]);ellipsoid(eye,iris,[0,.0,.026],[.049,.059,.016]);ellipsoid(eye,dark,[0,.0,.039],[.016,.049,.008]);ellipsoid(eye,glint,[-.013,.021,.045],[.010,.010,.003]);ellipsoid(eye,glint,[.014,-.016,.045],[.004,.004,.002]);catEyes.push(eye);
  curve(catHead,stripe,[[side*.174,.095,.186],[side*.126,.117,.207],[side*.082,.1,.219]],.006);
  const ear=new THREE.Group();ear.position.set(side*.183,.169,-.018);ear.rotation.z=-side*.19;ear.rotation.y=side*.12;catHead.add(ear);
  const outline=new THREE.Shape();outline.moveTo(-.105,-.07);outline.bezierCurveTo(-.102,.016,-.053,.21,-.025,.217);outline.bezierCurveTo(.024,.204,.103,.026,.105,-.057);outline.quadraticCurveTo(0,-.106,-.105,-.07);
  mesh(new THREE.ExtrudeGeometry(outline,{depth:.04,bevelEnabled:true,bevelSegments:5,bevelSize:.017,bevelThickness:.018,curveSegments:16,steps:1}),fur,ear);
  const inner=mesh(new THREE.ShapeGeometry(outline,20),pink,ear,[0,.012,.06]);inner.scale.set(.61,.72,1);ears.push({g:ear,baseZ:ear.rotation.z});
  for(let i=0;i<3;i++)curve(catHead,cream,[[side*.075,-.067-i*.016,.253],[side*.19,-.05-i*.019,.258],[side*(.32+i*.014),-.019-i*.038,.215]],.0019);
  for(let i=0;i<3;i++)ellipsoid(catHead,stripe,[side*(.1+i*.027),-.048-(i%2)*.02,.249-(i*.005)],[.003,.003,.002]);
  // Short tapered tabby marks following the face, deliberately distinct from the whiskers.
  for(let i=0;i<2;i++)curve(catHead,stripe,[[side*.266,.03-i*.07,.071],[side*.257,.015-i*.07,.117],[side*.221,.014-i*.07,.153]],.009-i*.002);
 }
 for(const x of [-.069,0,.069])curve(catHead,stripe,[[x*.65,.231,.078],[x,.202,.134],[x*.75,.145,.187]],x===0?.012:.008);
 // Continuous curved tail; deform its tube without the old segmented silhouette.
 const tailCurve=new THREE.CatmullRomCurve3([[.27,.19,-.22],[.43,.24,-.35],[.47,.49,-.35],[.46,.79,-.29],[.33,.93,-.17],[.24,.86,-.1]].map(a=>new THREE.Vector3(...a)));
 const tailGeo=new THREE.TubeGeometry(tailCurve,56,.064,12,false),tail=mesh(tailGeo,fur,cat);const tailRest=tailGeo.attributes.position.array.slice();
 const colors=[];const c0=new THREE.Color('#d8954b'),c1=new THREE.Color('#a75e30');for(let i=0;i<=56;i++){const t=i/56,c=t>.87||((t>.23)&&Math.sin(t*36)>.65)?c1:c0;for(let j=0;j<=12;j++)colors.push(c.r,c.g,c.b);}tailGeo.setAttribute('color',new THREE.Float32BufferAttribute(colors,3));tail.material=new THREE.MeshStandardMaterial({vertexColors:true,roughness:.67,envMapIntensity:.32});
 // Fine tabby stripes across the back remain part of the sculpted silhouette.
 for(let i=0;i<3;i++){const y=.32+i*.15,r=.289-i*.029;curve(catBody,stripe,[[-r*.82,y,-.15],[-r*.42,y+.018,-r*.91],[0,y+.028,-r*1.04],[r*.42,y+.018,-r*.91],[r*.82,y,-.15]],.009);}

 const hero=new THREE.Group();hero.name='researcher';hero.position.set(.32,.025,1.08);hero.rotation.y=.52;hero.scale.setScalar(.91);hero.userData={section:'about',label:'Caixin / Meet the researcher'};parent.add(hero);
 const coat=material('#bc914a',.78),seam=material('#9e783d',.8),scarf=material('#9e4437',.83),scarfEdge=material('#c26450',.83),skin=material('#efc7a7',.53),skinWarm=material('#dcad92',.62),hair=material('#342a26',.48),hairLight=material('#574033',.62),trousers=material('#344750',.82),shoes=material('#343b3b',.49),sole=material('#79786a',.85),paperMat=material('#f4ead5',.86),coverMat=material('#254e62',.64);
 // Shoes have a shaped upper, a separate sole, stitching and laces.
 for(const side of [-1,1]){
  const leg=lathe(hero,trousers,[[.094,.13],[.11,.25],[.107,.48],[.119,.7]],[side*.155,0,0]);
  curve(hero,material('#51636a',.9),[[side*.155,.18,.096],[side*.155,.41,.105],[side*.155,.62,.107]],.003);
  rounded(hero,sole,.215,.062,.363,[side*.155,.052,.07],.024);
  ellipsoid(hero,shoes,[side*.155,.111,.077],[.103,.086,.169]);
  for(let i=0;i<3;i++)curve(hero,ivory,[[side*.155-.046,.165-i*.004,.024+i*.034],[side*.155,.172-i*.004,.032+i*.034],[side*.155+.044,.166-i*.004,.037+i*.034]],.0034);
 }
 const torso=new THREE.Group();torso.position.y=1.1;hero.add(torso);
 const coatBody=lathe(torso,coat,[[.22,-.52],[.305,-.43],[.31,-.22],[.285,.10],[.29,.32],[.23,.43],[.125,.47]]);coatBody.scale.z=.72;
 curve(torso,seam,[[.0,-.43,.221],[0,-.1,.215],[0,.26,.214],[0,.42,.145]],.0045);
 for(const y of [-.3,-.055,.19]){const button=ellipsoid(torso,material('#5f573f',.62),[0,y,.226],[.021,.021,.009]);for(const x of [-.005,.005])ellipsoid(torso,seam,[x,y,.235],[.0025,.003,.0015]);}
 for(const side of [-1,1]){
  rounded(torso,coat,.105,.145,.025,[side*.184,-.274,.197],.009).rotation.z=-side*.05;
  curve(torso,seam,[[side*.133,-.218,.213],[side*.185,-.212,.216],[side*.23,-.218,.208]],.003);
  const collar=rounded(torso,coat,.135,.2,.055,[side*.093,.369,.133],.013);collar.rotation.z=-side*.47;
 }
 // Two turns of a soft scarf and a stitched, tapered hanging end.
 const scarfRing=mesh(new THREE.TorusGeometry(.133,.049,16,56),scarf,torso,[0,.465,0]);scarfRing.rotation.x=Math.PI/2;scarfRing.scale.z=.82;
 const scarfTop=mesh(new THREE.TorusGeometry(.131,.038,16,56),scarf,torso,[0,.52,0]);scarfTop.rotation.x=Math.PI/2;
 const scarfTail=rounded(torso,scarf,.104,.41,.047,[.113,.3,.216],.012);scarfTail.rotation.z=-.12;
 curve(torso,scarfEdge,[[.065,.46,.246],[.076,.26,.254],[.097,.11,.25]],.003);
 for(let i=0;i<5;i++)curve(torso,scarf,[[.073+i*.014,.11,.244],[.074+i*.015,.068,.24]],.004);
 // An actual open book: bevelled covers, page edges, engraved typesetting and a bookmark.
 const book=new THREE.Group();book.position.set(0,-.032,.441);book.rotation.x=-.34;torso.add(book);
 rounded(book,coverMat,.036,.359,.055,[0,0,-.021],.007);
 for(const side of [-1,1]){
  const page=new THREE.Group();page.rotation.y=side*.22;book.add(page);
  rounded(page,coverMat,.247,.368,.034,[side*.137,0,-.025],.009);
  rounded(page,paperMat,.228,.341,.043,[side*.126,.002,.004],.006);
  for(let j=0;j<5;j++)curve(page,material('#c9bda4',.87),[[side*.021,-.163+j*.003,.009+j*.006],[side*.232,-.163+j*.003,.009+j*.006]],.001);
  for(let row=0;row<12;row++)rounded(page,material(row===0?'#325369':'#a7a18d',.95),row===0?.131:.145-(row%4===3?.026:0),row===0?.008:.003,.001,[side*.126,.127-row*.019,.029],.0003);
 }
 rounded(book,scarf,.019,.155,.002,[.049,-.2,-.017],.0004);
 // Tailored sleeves and cuffs, with individual thumbs and fingers holding the book.
 for(const side of [-1,1]){
  const a=[side*.277,.315,.012],b=[side*.438,.063,.18],c=[side*.25,-.188,.456];
  limb(torso,coat,a,b,.105,.085);limb(torso,coat,b,c,.085,.061);
  const cuff=limb(torso,ivory,[side*.279,-.152,.422],c,.063,.055);
  ellipsoid(torso,skin,[side*.255,-.19,.475],[.052,.067,.035]);
  for(let i=0;i<3;i++)ellipsoid(torso,skin,[side*(.237+i*.017),-.205-i*.004,.497],[.010,.028,.013]);
  const thumb=ellipsoid(torso,skin,[side*.221,-.164,.495],[.017,.034,.016]);thumb.rotation.z=side*.45;
 }
 const headPivot=new THREE.Group();headPivot.position.set(0,1.93,.007);hero.add(headPivot);
 const neck=limb(hero,skin,[0,1.57,0],[0,1.7,0],.087,.092);
 const head=ellipsoid(headPivot,skin,[0,0,0],[.291,.342,.258]);
 for(const side of [-1,1]){ellipsoid(headPivot,skin,[side*.287,-.015,.001],[.051,.083,.044]);ellipsoid(headPivot,skinWarm,[side*.309,-.014,.025],[.017,.043,.014]);}
 ellipsoid(headPivot,skin,[0,-.046,.253],[.046,.07,.052]);ellipsoid(headPivot,skinWarm,[0,-.077,.284],[.031,.013,.013]);
 curve(headPivot,material('#a96f61',.6),[[-.064,-.15,.225],[0,-.163,.24],[.06,-.146,.226]],.0055);
 ellipsoid(headPivot,skinWarm,[-.16,-.078,.21],[.041,.021,.005]);ellipsoid(headPivot,skinWarm,[.16,-.078,.21],[.041,.021,.005]);
 const eyes=[];
 for(const side of [-1,1]){
  const eye=new THREE.Group();eye.position.set(side*.108,.014,.228);eye.rotation.y=side*.2;headPivot.add(eye);
  ellipsoid(eye,ivory,[0,0,0],[.053,.032,.018]);ellipsoid(eye,material('#4c3930',.3),[0,0,.016],[.024,.026,.01]);ellipsoid(eye,dark,[0,0,.024],[.013,.018,.006]);ellipsoid(eye,glint,[-.006,.01,.03],[.006,.006,.002]);eyes.push(eye);
  curve(headPivot,hair,[[side*.157,.079,.213],[side*.109,.092,.238],[side*.065,.081,.246]],.008);
  curve(eye,skinWarm,[[-.05,.009,.009],[0,.033,.015],[.05,.008,.009]],.005);
 }
 // A continuous hair cap with a raised forehead and a lower nape, plus swept locks.
 const positions=[],indices=[],nu=56,nv=24;
 for(let v=0;v<=nv;v++)for(let u=0;u<=nu;u++){const a=u/nu*Math.PI*2,front=(Math.cos(a)+1)/2,limit=1.94-front*.82,t=v/nv*limit;positions.push(Math.sin(a)*Math.sin(t)*.303,Math.cos(t)*.358+.017,Math.cos(a)*Math.sin(t)*.273-.008);}
 for(let v=0;v<nv;v++)for(let u=0;u<nu;u++){const a=v*(nu+1)+u,b=a+nu+1;indices.push(a,b,a+1,b,b+1,a+1);}
 const hg=new THREE.BufferGeometry();hg.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));hg.setIndex(indices);hg.computeVertexNormals();mesh(hg,hair,headPivot);
 for(let i=0;i<7;i++){const offset=i*.027;curve(headPivot,hair,[[.21-offset*.35,.253+offset*.15,.094],[.17-offset,.263,.201],[-.023-offset*.8,.178+offset*.14,.273],[-.18-offset*.22,.105+offset*.14,.209]],.029-i*.0012);}
 for(let i=0;i<8;i++){const offset=i*.024;curve(headPivot,hairLight,[[.202-offset*.55,.265+offset*.11,.111],[.137-offset,.272,.207],[-.04-offset*.7,.198+offset*.2,.279]],.0018);}
 // Breathing, glances and blinks are small enough to preserve the sculpted silhouette.
 let greeting=0;
 function greet(){greeting=2.6;}
 function update(t,dt,moving){
  if(!moving)return false;greeting=Math.max(0,greeting-dt);const hello=greeting>0?Math.min(1,greeting/.4):0;
  torso.position.y=1.1+Math.sin(t*1.65)*.005;torso.scale.y=1+Math.sin(t*1.65)*.006;
  headPivot.rotation.x=.04+Math.sin(t*.7)*.025;headPivot.rotation.y=Math.sin(t*.29)*.085;book.rotation.x=-.34+Math.sin(t*.51)*.018;
  const blink=(time,period)=>{const x=time%period;return x<.18?Math.max(.06,Math.abs(x-.09)/.09):1;};eyes.forEach(e=>e.scale.y=blink(t+1,4.8));catEyes.forEach(e=>e.scale.y=blink(t+.7,3.8));
  cat.rotation.y=.48+Math.sin(t*.35)*.075;catHead.rotation.y=Math.sin(t*.5+.6)*.25+hello*.15;catHead.rotation.x=Math.sin(t*.9)*.035-hello*.15;catHead.rotation.z=Math.sin(t*.31)*.035;catBody.scale.y=1+Math.sin(t*1.9)*.008;
  ears.forEach((e,i)=>e.g.rotation.z=e.baseZ+Math.sin(t*5+i*2)*(((t+i)%5)<.3?.08:.01));
  const pos=tailGeo.attributes.position;for(let i=0;i<pos.count;i++){const f=Math.floor(i/13)/56;pos.array[i*3]=tailRest[i*3]+Math.sin(t*(hello?3:1.4)+f*1.8)*.055*f*f;pos.array[i*3+2]=tailRest[i*3+2]+Math.sin(t*1.1+f)*.025*f;}
  pos.needsUpdate=true;tailGeo.computeVertexNormals();return true;
 }
 return {hero,cat,update,greet,rig:{torso,headPivot,book,eyes},catRig:{root:cat,head:catHead,ears,eyes:catEyes,body:catBody,tailMesh:tail}};
}
