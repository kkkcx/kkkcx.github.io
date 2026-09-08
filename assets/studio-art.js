// Code-drawn surfaces; museum originals and their image licenses live in art/sources.json.
export { ARTWORKS } from './gallery-data.js?v=13';
export function loadImage(path){return new Promise((resolve,reject)=>{const img=new Image();img.decoding='async';img.onload=()=>resolve(img);img.onerror=()=>reject(new Error('Could not load '+path));img.src=new URL(path,import.meta.url).href;});}
export function drawArtwork(g,w,h,image,art){
 g.fillStyle='#f5f1e7';g.fillRect(0,0,w,h);
 if(image){const inset=34,scale=Math.min((w-inset*2)/image.naturalWidth,(h-inset*2)/image.naturalHeight),iw=image.naturalWidth*scale,ih=image.naturalHeight*scale,x=(w-iw)/2,y=(h-ih)/2;g.shadowColor='#302b243b';g.shadowBlur=6;g.drawImage(image,x,y,iw,ih);g.shadowBlur=0;g.strokeStyle='#756a493d';g.lineWidth=1.4;g.strokeRect(x-.7,y-.7,iw+1.4,ih+1.4);}
 else{g.fillStyle='#6e746a';g.textAlign='center';g.font='24px Georgia,serif';g.fillText(art.title,w/2,h/2,w-60);g.textAlign='left';}
}
export function drawArtLabel(g,w,h,art,direction,color){
 g.fillStyle='#e7e5da';g.fillRect(0,0,w,h);g.fillStyle=color;g.fillRect(0,0,6,h);
 g.fillStyle='#363d37';g.font='500 23px "DM Sans",sans-serif';g.fillText(art.artist.toUpperCase(),20,28);g.font='21px Georgia,serif';g.fillText(art.title+'  ↗',20,58,w-35);
 g.fillStyle='#63695e';g.font='18px "DM Sans",sans-serif';g.fillText(art.year,20,85);g.textAlign='right';g.fillText(direction,w-14,85);g.textAlign='left';
 g.fillStyle='#626b60';g.font='12px "DM Sans",sans-serif';g.fillText(art.labelCredit,20,112,w-35);
}
const line=(g,points)=>{g.beginPath();points.forEach(([x,y],i)=>i?g.lineTo(x,y):g.moveTo(x,y));g.stroke();};
export function drawResearchBoard(g,w,h){
 g.save();g.scale(w/1024,h/724);
 const bg=g.createLinearGradient(0,0,1024,724);bg.addColorStop(0,'#293f3b');bg.addColorStop(.5,'#233834');bg.addColorStop(1,'#192e2b');g.fillStyle=bg;g.fillRect(0,0,1024,724);
 // Sparse, fixed chalk grain: no changes to the room's seeded geometry.
 let seed=3247;const rnd=()=>((seed=(1664525*seed+1013904223)>>>0)/4294967296);
 for(let i=0;i<6500;i++){g.fillStyle=`rgba(224,234,215,${rnd()*.042})`;g.fillRect(rnd()*1024,rnd()*724,1+rnd()*3,1);}
 g.strokeStyle='#b9cbb422';g.lineWidth=1;g.strokeRect(18,18,988,688);
 g.fillStyle='#a5beb0';g.font='18px "DM Sans",sans-serif';g.fillText('RESEARCH NOTES',55,62);
 g.fillStyle='#f1eedb';g.font='italic 54px Georgia,serif';g.fillText('Social intelligence',53,132);
 g.fillStyle='#b2c9bb';g.font='22px "DM Sans",sans-serif';g.fillText('Understanding people. Learning to act together.',56,174);
 g.strokeStyle='#c9d4bf66';g.lineWidth=1.5;line(g,[[56,202],[965,202]]);
 const colors=['#a8c6df','#e4a88d','#e8cf86','#b6c8b2'];
 const labels=[['Read','Perception & understanding'],['Act','Generation & action'],['Together','Interaction & cooperation'],['Trust','Robustness & reliability']];
 const coords=[[63,245],[556,245],[63,444],[556,444]];
 for(let i=0;i<4;i++){
  const [x,y]=coords[i];g.save();g.translate(x,y);g.strokeStyle=colors[i];g.fillStyle=colors[i];g.lineWidth=2.3;g.lineCap='round';
  if(i===0){g.beginPath();g.moveTo(0,43);g.bezierCurveTo(30,-5,70,-5,100,43);g.bezierCurveTo(70,87,30,87,0,43);g.stroke();g.beginPath();g.arc(50,43,18,0,Math.PI*2);g.stroke();g.beginPath();g.arc(50,43,6,0,Math.PI*2);g.fill();}
  if(i===1){g.setLineDash([3,7]);line(g,[[0,82],[103,82]]);g.setLineDash([]);g.beginPath();g.moveTo(0,63);g.bezierCurveTo(48,69,29,-8,92,21);g.stroke();line(g,[[80,9],[95,21],[78,29]]);for(const [a,b,r] of [[0,63,4],[33,39,5],[61,20,6]]){g.beginPath();g.arc(a,b,r,0,Math.PI*2);g.fill();}}
  if(i===2){for(const x0 of [19,82]){g.beginPath();g.arc(x0,16,12,0,Math.PI*2);g.stroke();g.beginPath();g.arc(x0,58,22,Math.PI,0);g.stroke();}line(g,[[25,82],[77,82],[68,75]]);line(g,[[75,103],[23,103],[32,110]]);}
  if(i===3){g.beginPath();g.moveTo(50,0);g.lineTo(91,16);g.lineTo(85,61);g.quadraticCurveTo(78,86,50,99);g.quadraticCurveTo(22,86,15,61);g.lineTo(9,16);g.closePath();g.stroke();line(g,[[31,47],[45,61],[70,33]]);}
  g.fillStyle='#e5e8d8';g.font='38px Georgia,serif';g.fillText(labels[i][0],130,43);g.fillStyle='#afc2b5';g.font='18px "DM Sans",sans-serif';g.fillText(labels[i][1],132,78);g.restore();
 }
 g.strokeStyle='#c6d0b735';g.lineWidth=1;line(g,[[510,244],[510,569]]);line(g,[[62,412],[964,412]]);
 g.strokeStyle='#d9c891';g.lineWidth=1.5;g.beginPath();g.moveTo(274,645);g.bezierCurveTo(407,657,629,630,753,643);g.stroke();g.fillStyle='#c6d0bc';g.font='italic 23px Georgia,serif';g.fillText('From seeing to sharing a world.',325,630);g.restore();
}
export function drawTokyoSky(g,w,h,night){
 g.save();g.scale(w/1536,h/768);
 const sky=g.createLinearGradient(0,0,0,768);sky.addColorStop(0,night?'#172c49':'#97b7c4');sky.addColorStop(.62,night?'#59637a':'#d8ded7');sky.addColorStop(1,night?'#c39479':'#f1dec0');g.fillStyle=sky;g.fillRect(0,0,1536,768);
 const haze=g.createRadialGradient(1170,169,10,1170,169,205);haze.addColorStop(0,night?'#eee6be33':'#fff2d891');haze.addColorStop(1,'#fff2d800');g.fillStyle=haze;g.fillRect(900,0,500,440);
 g.fillStyle=night?'#f7ecd4':'#fff1d2';g.beginPath();g.arc(1170,169,night?23:37,0,Math.PI*2);g.fill();
 let seed=672;const rnd=()=>((seed=(1664525*seed+1013904223)>>>0)/4294967296);
 for(let layer=0;layer<3;layer++){
  const c=(night?['#72818d','#526575','#354b60']:['#b3c6c7','#9db7b9','#7c9da4'])[layer];
  for(let i=0;i<39;i++){
   const x=i*42-15,top=398+rnd()*116+layer*57,bw=21+rnd()*27;
   g.fillStyle=c;g.fillRect(x,top,bw,768-top);g.fillRect(x+bw*.23,top-6,bw*.52,6);
   g.fillStyle=night?'#eed0a575':'#e5ebdf38';for(let a=0;a<4;a++)for(let b=0;b<12;b++){const lit=rnd()>.62;if(lit)g.fillRect(x+4+a*8,top+10+b*15,2.5,4);}
  }
 }
 // Tower sits in the middle window pane; its mast and upper deck clear the horizontal mullion.
 g.save();g.translate(825,0);g.lineJoin='round';g.lineCap='round';
 const orange=night?'#ffb465':'#c96d48',white=night?'#f9dca2':'#f3eee1';
 if(night){g.shadowColor='#ffb358';g.shadowBlur=7;}
 const ys=[624,560,497,438,388,337,284,244],half=[84,60,42,31,24,18,12,7];
 for(let i=0;i<ys.length-1;i++){
  g.strokeStyle=i%3===1?white:orange;g.lineWidth=i<2?5:3.7;
  line(g,[[-half[i],ys[i]],[-half[i+1],ys[i+1]]]);line(g,[[half[i],ys[i]],[half[i+1],ys[i+1]]]);
  g.lineWidth=1.8;line(g,[[-half[i],ys[i]],[half[i+1],ys[i+1]]]);line(g,[[half[i],ys[i]],[-half[i+1],ys[i+1]]]);
  line(g,[[-half[i+1],ys[i+1]],[half[i+1],ys[i+1]]]);
 }
 for(const [y,ww,hh] of [[429,87,19],[280,40,13]]){
  g.fillStyle=orange;g.fillRect(-ww/2,y,ww,hh);g.fillStyle=night?'#fff1c5':'#5b7379';g.fillRect(-ww/2+3,y+4,ww-6,6);g.fillStyle=white;g.fillRect(-ww/2-3,y-3,ww+6,3);
  g.strokeStyle=orange;g.lineWidth=2;for(let x=-ww/2+8;x<ww/2;x+=9)line(g,[[x,y+4],[x,y+10]]);
 }
 for(let y=150;y<244;y+=12){g.strokeStyle=Math.floor(y/12)%2?orange:white;g.lineWidth=y<179?3:5;line(g,[[0,y],[0,y+12]]);}
 g.shadowBlur=0;g.fillStyle=night?'#f2cfa3':'#c47b58';g.fillRect(-66,616,132,15);g.restore();
 // Low foreground buildings root the lattice structure in the city instead of floating above it.
 for(let i=0;i<40;i++){const x=i*42-8,top=654+rnd()*42,bw=29+rnd()*14;g.fillStyle=night?'#263f50':'#789b9b';g.fillRect(x,top,bw,768-top);g.fillStyle=night?'#e8c3869c':'#dae0cf50';for(let j=0;j<4;j++)g.fillRect(x+7+j*8,top+9,3,6);}
 g.restore();
}
