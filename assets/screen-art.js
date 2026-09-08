// Screen compositions are drawn at native texture resolution, independent of device scale.
const sans='"DM Sans",sans-serif';
function rule(g,x,y,x2,y2,color='#cbd0c5'){g.strokeStyle=color;g.lineWidth=1;g.beginPath();g.moveTo(x,y);g.lineTo(x2,y2);g.stroke();}
export function drawMonitor(g,w,h,paper){
 g.save();g.scale(w/1024,h/640);
 g.fillStyle='#c8d2cb';g.fillRect(0,0,1024,640);
 g.fillStyle='#253e3b';g.fillRect(0,0,1024,43);g.fillStyle='#e1e7da';g.font=`16px ${sans}`;g.fillText('UT-VISION  /  READING DESK',29,28);g.textAlign='right';g.fillStyle='#b3c6b7';g.fillText('hand-forecasting.pdf',995,28);g.textAlign='left';
 for(const [i,c] of ['#bd7b66','#cdb575','#93b29e'].entries()){g.fillStyle=c;g.beginPath();g.arc(946+i*21,65,4,0,Math.PI*2);g.fill();}
 g.shadowColor='#183d312f';g.shadowBlur=18;g.shadowOffsetY=6;g.fillStyle='#faf9f2';g.fillRect(25,86,720,522);g.shadowBlur=0;g.shadowOffsetY=0;
 g.fillStyle='#61827a';g.font=`17px ${sans}`;g.fillText('ROBOT LEARNING  /  RESEARCH PAPER',57,124);
 g.fillStyle='#263e3d';g.font='35px Georgia,serif';g.fillText('Streaming egocentric',55,173);g.fillText('3D hand forecasting',55,215);
 g.fillStyle='#697970';g.font=`16px ${sans}`;g.fillText('R. Liu · Y. Huang · L. Ouyang · C. Kang · Y. Sato',58,248);
 rule(g,58,266,710,266);
 if(paper){const s=Math.min(655/paper.naturalWidth,300/paper.naturalHeight),pw=paper.naturalWidth*s,ph=paper.naturalHeight*s;g.drawImage(paper,57+(655-pw)/2,279+(287-ph)/2,pw,ph);}
 else{g.fillStyle='#788d80';g.font='italic 25px Georgia,serif';g.fillText('Learning from a continuous stream.',83,403);}
 g.fillStyle='#819088';g.font=`15px ${sans}`;g.fillText('Predictive representation learning for manipulation',58,585);
 g.fillStyle='#526f62';g.font=`16px ${sans}`;g.fillText('MARGIN NOTES',782,128);rule(g,782,144,988,144,'#829c886e');
 const notes=[['01','Observe','Egocentric','video stream'],['02','Anticipate','Future 3D','hand motion'],['03','Transfer','Robotic','manipulation']];
 for(let i=0;i<notes.length;i++){const [n,title,a,b]=notes[i],y=186+i*128;g.fillStyle='#84998a';g.font=`14px ${sans}`;g.fillText(n,783,y);g.fillStyle='#304e46';g.font='25px Georgia,serif';g.fillText(title,814,y);g.fillStyle='#526e62';g.font=`18px ${sans}`;g.fillText(a,783,y+33);g.fillText(b,783,y+58);if(i<2)rule(g,783,y+83,985,y+83,'#8ca18c50');}
 g.strokeStyle='#8a5745';g.lineWidth=2;g.beginPath();g.moveTo(814,195);g.quadraticCurveTo(875,199,928,193);g.stroke();g.fillStyle='#436655';g.font=`15px ${sans}`;g.fillText('CoRL 2026',782,585);g.restore();
}
const radians=Math.PI/180;
// Precompute geographical vertices once; avoid trigonometry for each point in each frame.
export function prepareCoastlines(lines){return lines.map(ring=>ring.map(([lon,lat])=>{const p=lat*radians,l=lon*radians;return [Math.cos(p)*Math.sin(l),Math.sin(p),Math.cos(p)*Math.cos(l)];}));}
export function drawTelevision(g,w,h,coasts=[],seconds=0){
 g.save();g.scale(w/768,h/512);
 const bg=g.createLinearGradient(0,0,768,512);bg.addColorStop(0,'#122c35');bg.addColorStop(1,'#061923');g.fillStyle=bg;g.fillRect(0,0,768,512);
 g.fillStyle='#97afa6';g.font=`16px ${sans}`;g.fillText('A SHARED WORLD',32,36);g.textAlign='right';g.fillStyle='#c5bc8e';g.fillText('EARTH',736,36);g.textAlign='left';
 const cx=384,cy=260,r=188,lon=125*radians+seconds*.033,lat=20*radians,sl=Math.sin(lon),cl=Math.cos(lon),sp=Math.sin(lat),cp=Math.cos(lat);
 const project=([x,y,z])=>{const zz=x*sl+z*cl;return [(x*cl-z*sl)*r+cx,(zz*sp-y*cp)*r+cy,zz*cp+y*sp];};
 const glow=g.createRadialGradient(cx,cy,r-3,cx,cy,r+22);glow.addColorStop(0,'#95c3b23b');glow.addColorStop(1,'#75b9bb00');g.fillStyle=glow;g.beginPath();g.arc(cx,cy,r+22,0,Math.PI*2);g.fill();
 const ocean=g.createRadialGradient(cx-r*.45,cy-r*.4,10,cx,cy,r*1.3);ocean.addColorStop(0,'#35686b');ocean.addColorStop(.65,'#1f4c55');ocean.addColorStop(1,'#082330');g.fillStyle=ocean;g.beginPath();g.arc(cx,cy,r,0,Math.PI*2);g.fill();
 function path(points){g.beginPath();let prev=null;for(const v of points){const q=project(v);if(prev&&((q[2]>=0)!==(prev[2]>=0))){const f=prev[2]/(prev[2]-q[2]),x=prev[0]+(q[0]-prev[0])*f,y=prev[1]+(q[1]-prev[1])*f;if(prev[2]>=0)g.lineTo(x,y);else g.moveTo(x,y);}if(q[2]>=0){if(!prev||prev[2]<0){if(!prev)g.moveTo(q[0],q[1]);else g.lineTo(q[0],q[1]);}else g.lineTo(q[0],q[1]);}prev=q;}g.stroke();}
 g.strokeStyle='#99bcb43c';g.lineWidth=.85;
 for(let a=-60;a<=60;a+=30){const p=a*radians;const points=[];for(let b=-180;b<=180;b+=4){const l=b*radians;points.push([Math.cos(p)*Math.sin(l),Math.sin(p),Math.cos(p)*Math.cos(l)]);}path(points);}
 for(let a=-180;a<180;a+=30){const l=a*radians,points=[];for(let b=-90;b<=90;b+=4){const p=b*radians;points.push([Math.cos(p)*Math.sin(l),Math.sin(p),Math.cos(p)*Math.cos(l)]);}path(points);}
 g.strokeStyle='#c6d5b5';g.lineWidth=1.35;g.lineJoin='round';for(const ring of coasts)path(ring);
 const shade=g.createLinearGradient(cx-r,cy-r,cx+r,cy+r);shade.addColorStop(0,'#f7eccc10');shade.addColorStop(.5,'#10253000');shade.addColorStop(1,'#00131ab0');g.fillStyle=shade;g.beginPath();g.arc(cx,cy,r,0,Math.PI*2);g.fill();g.strokeStyle='#94b8af88';g.lineWidth=1;g.stroke();
 const p=35.68*radians,l=139.76*radians,tokyo=project([Math.cos(p)*Math.sin(l),Math.sin(p),Math.cos(p)*Math.cos(l)]);
 if(tokyo[2]>.18){const [x,y]=tokyo;g.fillStyle='#f4d48d';g.beginPath();g.arc(x,y,3,0,Math.PI*2);g.fill();g.strokeStyle='#e4c38699';g.beginPath();g.arc(x,y,8,0,Math.PI*2);g.stroke();const right=x<cx+100;rule(g,x+(right?10:-10),y,x+(right?31:-31),y-16,'#cfc59899');g.fillStyle='#f1e2b7';g.font=`15px ${sans}`;g.textAlign=right?'left':'right';g.fillText('TOKYO',x+(right?36:-36),y-17);g.textAlign='left';}
 // A restrained phosphor/glass finish, without flicker or fake visitor markers.
 g.fillStyle='#020e1610';for(let y=0;y<512;y+=4)g.fillRect(0,y,768,.65);
 g.fillStyle='#b4c6b7';g.font='italic 20px Georgia,serif';g.fillText('Across the same sky.',32,481);g.textAlign='right';g.font=`16px ${sans}`;g.fillStyle='#bfc79c';g.fillText('VISITORS  ↗',735,480);g.textAlign='left';g.restore();
}
