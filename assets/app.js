import { DATA, LINES } from './data.js';

const $ = s => document.querySelector(s);
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
const palettes = {
  read: { tone: '#637b83', tint: '#e7ece8', desc: 'Understanding the signals that make us human.' },
  act: { tone: '#b75a40', tint: '#f0e5dc', desc: 'From social perception to meaningful action.' },
  together: { tone: '#ab8c48', tint: '#f1ebdb', desc: 'Intelligence that learns to live alongside us.' },
  trust: { tone: '#74816b', tint: '#e7eadd', desc: 'A more robust foundation for human trust.' },
};
const drawings = [
  '<path d="M20 65Q75-7 130 65Q75 137 20 65Z" fill="currentColor" opacity=".14"/><path d="M20 65Q75-7 130 65Q75 137 20 65Z" fill="none" stroke="currentColor"/><circle cx="75" cy="65" r="27" fill="none" stroke="currentColor"/><circle cx="75" cy="65" r="13" fill="currentColor"/><path d="M75 8v14M75 108v14M6 65h12M132 65h12" stroke="currentColor"/><circle cx="81" cy="59" r="3" fill="#f4f1e9"/>',
  '<circle cx="61" cy="69" r="39" fill="currentColor" opacity=".14"/><path d="M22 69h78M61 30v78" stroke="currentColor" opacity=".45"/><circle cx="61" cy="69" r="39" fill="none" stroke="currentColor"/><path d="m51 90 62-62M81 28h32v32" stroke="currentColor" stroke-width="2" fill="none"/><circle cx="51" cy="90" r="7" fill="currentColor"/>',
  '<circle cx="53" cy="65" r="35" fill="currentColor" opacity=".15"/><circle cx="97" cy="65" r="35" fill="currentColor" opacity=".15"/><circle cx="53" cy="65" r="35" fill="none" stroke="currentColor"/><circle cx="97" cy="65" r="35" fill="none" stroke="currentColor"/><path d="M53 65h44" stroke="currentColor"/><circle cx="53" cy="65" r="5" fill="currentColor"/><circle cx="97" cy="65" r="5" fill="currentColor"/><path d="M75 12v14M75 104v14" stroke="currentColor"/>',
  '<path d="m75 17 45 18v31c0 25-23 42-45 53-22-11-45-28-45-53V35Z" fill="currentColor" opacity=".12"/><path d="m75 17 45 18v31c0 25-23 42-45 53-22-11-45-28-45-53V35Z" fill="none" stroke="currentColor"/><path d="M75 17v102M30 57h90" stroke="currentColor" opacity=".35"/><path d="m54 66 15 15 28-32" fill="none" stroke="currentColor" stroke-width="2"/>',
];
$('#directions').innerHTML = LINES.map((l,i) => `<button class="direction" data-filter="${l.id}" aria-pressed="false" aria-label="Explore ${l.name.toLowerCase()}: ${l.title}" style="--tone:${palettes[l.id].tone};--tint:${palettes[l.id].tint}"><div class="direction-top"><span>0${i+1} / ${l.name}</span><span>${String(l.papers.length).padStart(2,'0')} WORKS</span></div><div class="direction-art" aria-hidden="true"><svg viewBox="0 0 150 130">${drawings[i]}</svg></div><h3>${l.name[0]+l.name.slice(1).toLowerCase()}.</h3><p>${palettes[l.id].desc}</p><span class="direction-arrow">↗</span></button>`).join('');
$('#filters').innerHTML = [{id:'all',name:'All work'},...LINES.map(l=>({id:l.id,name:l.name[0]+l.name.slice(1).toLowerCase()}))].map(l=>`<button data-filter="${l.id}" aria-pressed="${l.id==='all'}">${l.name}</button>`).join('');
const papers = LINES.flatMap(l=>l.papers.map(p=>({...p,line:l.id}))).sort((a,b)=>b.y-a.y);
// The opening selection represents all four directions; the full archive stays chronological.
const featured=new Set([LINES[0].papers[0].p,LINES[0].papers[2].p,LINES[1].papers[0].p,LINES[2].papers[1].p,LINES[3].papers[0].p]);
let activeFilter='all', expanded=false, search='';
function paperMarkup(p,i) {
  const links = [['Paper',p.p],['Code',p.c],['Project',p.pr],['Dataset',p.d]].filter(([,url])=>url).map(([label,url])=>`<a href="${url}" target="_blank" rel="noreferrer">${label} ↗</a>`).join('');
  return `<article class="paper"><span class="paper-no">${String(i+1).padStart(2,'0')}</span><div><h4 class="paper-title"><a href="${p.p}" target="_blank" rel="noreferrer">${p.t}</a></h4><div class="paper-links">${links}${p.cs?'<span class="pending">Code forthcoming</span>':''}</div></div><div class="paper-meta">${p.v}<small>${p.y} · ${p.line.toUpperCase()}</small></div><a class="paper-arrow" href="${p.p}" target="_blank" rel="noreferrer" aria-label="Read ${p.t}">↗</a></article>`;
}
function renderPapers() {
  const matches=papers.filter(p=>(activeFilter==='all'||p.line===activeFilter)&&`${p.t} ${p.v} ${p.y}`.toLowerCase().includes(search));
  const visible=expanded||activeFilter!=='all'||search?matches:matches.filter(p=>featured.has(p.p));
  $('#papers').innerHTML=visible.length?visible.map(paperMarkup).join(''):'<p class="empty-state">No papers match this search. Try another title, venue, or year.</p>';
  $('#paper-count').textContent=`${matches.length} ${matches.length===1?'work':'works'}`;
  $('#show-all').hidden=activeFilter!=='all'||!!search||matches.length<=5;
  $('#show-all').innerHTML=expanded?'Show selected publications <span>↑</span>':`View all ${papers.length} publications <span>↓</span>`;
  document.querySelectorAll('[data-filter]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.filter===activeFilter)));
}
function setFilter(id,scroll=false) {
  activeFilter=LINES.some(l=>l.id===id)?id:'all';
  search='';$('#paper-search').value='';renderPapers();
  if(scroll) $('.publications-head').scrollIntoView({behavior:reduced.matches?'instant':'smooth',block:'start'});
}
document.addEventListener('click',e=>{const b=e.target.closest('[data-filter]');if(b)setFilter(b.dataset.filter,b.classList.contains('direction'));});
$('#paper-search').addEventListener('input',e=>{search=e.target.value.trim().toLowerCase();renderPapers();});
$('#show-all').addEventListener('click',()=>{expanded=!expanded;renderPapers();if(!expanded)$('.publications-head').scrollIntoView({behavior:reduced.matches?'instant':'smooth'});});
renderPapers();
$('#bio').innerHTML=DATA.bio.map(p=>`<p>${p}</p>`).join('');
$('#social-links').innerHTML=DATA.links.map(l=>`<a href="${l.href}" ${l.href.startsWith('mailto:')?'':'target="_blank" rel="noreferrer"'}>${l.label} ↗</a>`).join('');
const journeyMarkup=()=>`<h3>EDUCATION</h3>${DATA.education.map(([date,body])=>`<div class="journey-row"><span>${date.replace('Now','Present')}</span><p>${body}</p></div>`).join('')}<h3>EXPERIENCE</h3>${DATA.experience.map(([date,body])=>`<div class="journey-row"><span>${date}</span><p>${body}</p></div>`).join('')}`;
$('#journey').innerHTML=journeyMarkup();
$('#honors-content').innerHTML=`<ul>${[...DATA.awards,...DATA.competitions].map(a=>`<li>${a}</li>`).join('')}</ul><p>${DATA.services}</p>`;
let allNews=false;
function newsMarkup(all){return DATA.news.slice(0,all?DATA.news.length:4).map(([date,body])=>`<article class="news-row"><time>${date}</time><p>${body}</p><span aria-hidden="true">✳</span></article>`).join('');}
$('#news').innerHTML=newsMarkup(false);
$('#more-news').addEventListener('click',()=>{allNews=!allNews;$('#news').innerHTML=newsMarkup(allNews);$('#more-news').innerHTML=allNews?'Recent notes <span>↑</span>':'Earlier notes <span>↓</span>';});
function updateTime(){$('#tokyo-clock').textContent=new Intl.DateTimeFormat('en-GB',{timeZone:'Asia/Tokyo',hour:'2-digit',minute:'2-digit',hour12:false}).format(new Date())+' JST';}
updateTime();setInterval(updateTime,60000);

const audio=$('#music-audio'), play=$('#music-play');audio.volume=.35;
function syncAudio(){const playing=!audio.paused;play.setAttribute('aria-pressed',String(playing));play.setAttribute('aria-label',playing?'Pause Boléro':'Play Boléro');$('#music-label').textContent=playing?'BOLÉRO · ON':'SOUND OFF';$('.sound-dock').classList.toggle('playing',playing);window.dispatchEvent(new CustomEvent('studio-music',{detail:playing}));}
play.addEventListener('click',async()=>{if(!audio.paused){audio.pause();return;}play.disabled=true;$('#music-label').textContent='LOADING…';try{await audio.play();}catch{$('#music-label').textContent='RETRY SOUND';}finally{play.disabled=false;}});
audio.addEventListener('play',syncAudio);audio.addEventListener('pause',syncAudio);audio.addEventListener('error',()=>{$('#music-label').textContent='SOUND UNAVAILABLE';play.disabled=false;});
$('#music-volume').addEventListener('input',e=>audio.volume=Number(e.target.value));

const studio=$('#studio'), dialog=$('#detail-dialog');let expandedStudio=false,returnFocus=null;
function toggleStudio(force) {
  expandedStudio=typeof force==='boolean'?force:!expandedStudio;
  document.querySelectorAll('body > header, body > footer, .sound-dock, .skip-link, main > :not(.hero), .hero-copy').forEach(el=>el.inert=expandedStudio);
  studio.classList.toggle('expanded',expandedStudio);document.body.classList.toggle('studio-open',expandedStudio);$('#exit-studio').hidden=!expandedStudio;$('#expand-studio').setAttribute('aria-expanded',String(expandedStudio));$('#expand-studio').setAttribute('aria-label',expandedStudio?'Exit expanded studio':'Expand studio');
  if(expandedStudio){returnFocus=document.activeElement;studio.setAttribute('role','dialog');studio.setAttribute('aria-modal','true');$('#exit-studio').focus();}else{studio.removeAttribute('role');studio.removeAttribute('aria-modal');returnFocus?.focus();}
  window.dispatchEvent(new CustomEvent('studio-resize'));
}
$('#enter-studio').addEventListener('click',()=>toggleStudio(true));$('#expand-studio').addEventListener('click',()=>toggleStudio());$('#exit-studio').addEventListener('click',()=>toggleStudio(false));
// Keep the expanded room keyboard-accessible without moving its canvas between parents.
document.addEventListener('keydown',e=>{if(!expandedStudio||dialog.open)return;if(e.key==='Escape'){toggleStudio(false);return;}if(e.key==='Tab'){const items=[...studio.querySelectorAll('button:not([hidden]),canvas[tabindex]')].filter(el=>el.getClientRects().length);const first=items[0],last=items.at(-1);if(e.shiftKey&&(document.activeElement===first||!studio.contains(document.activeElement))){e.preventDefault();last.focus();}else if(!e.shiftKey&&(document.activeElement===last||!studio.contains(document.activeElement))){e.preventDefault();first.focus();}}});
function openDetails(id) {
  const line=LINES.find(l=>l.id===id);let content='';
  if(line) content=`<span class="eyebrow">RESEARCH DIRECTION / ${line.name}</span><h2 id="dialog-title">${line.title}</h2><p>${line.sub}</p>${line.papers.map((p,i)=>paperMarkup({...p,line:id},i)).join('')}<button class="text-button dialog-jump" data-jump="${id}">Explore in the research archive ↗</button>`;
  else if(id==='map')content=`<span class="eyebrow">ON THE RESEARCH WALL</span><h2 id="dialog-title">Four directions.<br><em>One human question.</em></h2><p>${DATA.tagline}</p><div class="dialog-directions">${LINES.map(l=>`<button class="dialog-direction" data-open-direction="${l.id}"><span>${l.name}</span><p>${l.title}</p><span>↗</span></button>`).join('')}</div>`;
  else if(id==='about')content=`<span class="eyebrow">AT THE DESK</span><h2 id="dialog-title">Hello, I’m Caixin.</h2><div class="bio">${DATA.bio.map(p=>`<p>${p}</p>`).join('')}</div><div class="social-links">${$('#social-links').innerHTML}</div>`;
  else if(id==='edu')content=`<span class="eyebrow">ON THE BOOKSHELF</span><h2 id="dialog-title">A continuing education.</h2><div class="journey">${journeyMarkup()}</div>`;
  else if(id==='news')content=`<span class="eyebrow">ON THE NOTICEBOARD</span><h2 id="dialog-title">From the notebook.</h2>${newsMarkup(true)}`;
  else if(id==='visitors')content='<span class="eyebrow">A WINDOW TO THE WORLD</span><h2 id="dialog-title">Glad you’re here.</h2><p>This little studio is open to curious minds, wherever you are.</p><a class="visitor-link" href="https://mapmyvisitors.com/web/1bz49" target="_blank" rel="noreferrer">View the visitor map ↗</a>';
  else if(id==='music'){play.click();return;}
  else return;
  $('#dialog-content').innerHTML=content;if(!dialog.open)dialog.showModal();$('#close-dialog').focus();
}
window.addEventListener('studio-select',e=>openDetails(e.detail));
$('#close-dialog').addEventListener('click',()=>dialog.close());
dialog.addEventListener('click',e=>{const direction=e.target.closest('[data-open-direction]');if(direction){openDetails(direction.dataset.openDirection);return;}if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();}const b=e.target.closest('[data-jump]');if(b){dialog.close();if(expandedStudio)toggleStudio(false);setFilter(b.dataset.jump,true);}});
// Earlier shared links still lead directly to their research content.
const route=()=>{const id=location.hash.slice(1);if(LINES.some(l=>l.id===id))openDetails(id);else if(['edu','awards','map','visitors'].includes(id)){if(id==='map')$('#research').scrollIntoView();else if(id==='awards'){$('.honors').open=true;$('.honors').scrollIntoView();}else openDetails(id);}};
window.addEventListener('hashchange',route);route();
let printState;window.addEventListener('beforeprint',()=>{printState={activeFilter,expanded,search,allNews};activeFilter='all';expanded=true;search='';renderPapers();$('#news').innerHTML=newsMarkup(true);});window.addEventListener('afterprint',()=>{if(printState){({activeFilter,expanded,search,allNews}=printState);renderPapers();$('#news').innerHTML=newsMarkup(allNews);}});

// Content works independently of the WebGL module, including when graphics are unavailable.
const idle=window.requestIdleCallback||((fn)=>setTimeout(fn,40));
idle(()=>import('./studio.js').catch(e=>{console.warn('Studio unavailable:',e);$('#scene-loading').hidden=true;$('#scene').hidden=true;$('#scene-fallback').hidden=false;$('#scene-hint').textContent='A QUIET VIEW OF THE STUDIO';$('#theme-toggle').disabled=true;$('#reset-view').disabled=true;}));
