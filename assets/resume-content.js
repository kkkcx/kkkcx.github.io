import {t,getLanguage,localDate} from './i18n.js';
import {translatedBio,translatedEducation,translatedAwards,translatedNews} from './content-translations.js';
import {symbol} from './ui-icons.js';
import {DATA,LINES} from './data.js';
import {PAPER_DETAILS} from './paper-details.js';
import {PUBLICATION_ORDER,NEWS,EXPERIENCES,COMPETITIONS} from './profile-details.js';
const iconPaths={
 Email:'<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 6 9 7 9-7"/>',
 Scholar:'<path d="m2 9 10-6 10 6-10 6L2 9Z"/><path d="M6 12v5c3 3 9 3 12 0v-5M22 9v8"/>',
 GitHub:'<path d="M9 20c-4 1-4-2-6-2m12 4v-4c0-1 .2-2-.6-2.7 3-.3 6-1.5 6-6A4.6 4.6 0 0 0 19 6c.2-1 .2-2-.2-3 0 0-1.2-.4-3.8 1a13 13 0 0 0-6 0C6.4 2.6 5.2 3 5.2 3A5 5 0 0 0 5 6a4.6 4.6 0 0 0-1.4 3.3c0 4.5 3 5.7 6 6-.8.7-.6 1.7-.6 2.7v4"/>',
 LinkedIn:'<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M7 10v7M7 7v.1M11 17v-7m0 3a3 3 0 0 1 6 0v4"/>'
};
export const icon=name=>`<svg class="link-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${iconPaths[name]||''}</svg>`;
export const escapeHTML=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export const links=()=>`<div class="links social-links">${DATA.links.map(l=>`<a href="${l.href}" class="social-${l.label.toLowerCase()}" ${l.href.startsWith('mailto:')?'':'target="_blank" rel="noreferrer"'}>${icon(l.label)}<span>${t('social.'+l.label)}</span><span class="external-arrow" aria-hidden="true">↗</span></a>`).join('')}</div>`;
export const portrait=(cls='')=>`<figure class="portrait ${cls}"><img src="${DATA.photo}" width="984" height="1378" alt="${t('portrait.alt')}" decoding="async"></figure>`;
export const biography=()=>`<div class="bio">${translatedBio().map(p=>`<p>${p}</p>`).join('')}</div>`;
const directionsFor=(p,line)=>line?[line,...(p.topics||[]).filter(id=>id!==line.id).map(id=>LINES.find(l=>l.id===id)).filter(Boolean)]:[];
export function paper(p,{illustrated=false,line=null}={}){
 const details=PAPER_DETAILS[p.p],image=illustrated&&details?.image;
 const directions=directionsFor(p,line);
 const tags=`<span class="venue-tag">${p.v==='Under Review'?t('venue.review'):p.v==='Technical Report'?t('venue.report'):p.v} ${p.y}</span>${directions.map(l=>`<span class="direction-tag" style="--tag-tone:${l.color}" title="${t('line.'+l.id+'.title')}">${t('line.'+l.id+'.name')}</span>`).join('')}`;
 const authors=illustrated&&details?.authors?`<p class="paper-authors">${escapeHTML(details.authors).replaceAll('Caixin Kang','<strong>Caixin Kang</strong>')}</p>`:'';
 return `<article class="paper ${image?'illustrated':'text-only'}" data-research="${line?.id||''}" data-topics="${directions.map(l=>l.id).join(' ')}" data-paper-url="${p.p}">${image?`<a class="paper-figure" href="${p.p}" target="_blank" rel="noreferrer" aria-label="${t('paper.open',{title:escapeHTML(p.t)})}"><img src="${details.image}" alt="${t('paper.figure',{title:escapeHTML(p.t)})}" loading="lazy" decoding="async"></a>`:''}<div class="paper-copy"><div class="paper-meta">${tags}</div><h3><a href="${p.p}" target="_blank" rel="noreferrer">${p.t}</a></h3>${authors}${p.toAppear?`<p class="publication-status">${t('paper.toAppear',{date:localDate(p.toAppear)})}</p>`:''}<div class="links">${[[p.resource||'Paper',p.p],['Announcement',p.announcement],['Code',p.c],['Project',p.pr],['Dataset',p.d]].filter(([,u])=>u).map(([label,u])=>`<a href="${u}" target="_blank" rel="noreferrer">${t('paper.'+label)} <span aria-hidden="true">↗</span></a>`).join('')}${p.cs?`<span class="pending">${t('paper.forthcoming')}</span>`:''}</div></div></article>`;
}
const allPapers=LINES.flatMap(line=>line.papers.map(p=>({p,line})));
const orderedPapers=PUBLICATION_ORDER.map(url=>allPapers.find(({p})=>p.p===url)).filter(Boolean);
export const papersForDirection=id=>orderedPapers.filter(({p,line})=>directionsFor(p,line).some(l=>l.id===id));
export const publications=()=>orderedPapers.map(({p,line})=>paper(p,{illustrated:true,line})).join('');
export const news=()=>NEWS.map(([date,text],i)=>`<article class="news-row ${i===0?'latest':''}"><time>${localDate(date)}</time><span class="news-symbol">${symbol('🎉')}</span><p>${translatedNews(i).replaceAll('🥈',symbol('🥈'))}</p>${i===0?`<span class="latest-tag">${t('news.latest')}</span>`:''}</article>`).join('');
export const education=()=>translatedEducation().map(([date,text],i)=>`<article class="education-row"><span class="degree-mark" aria-hidden="true">${['PhD','M.E.','B.E.'][i]}</span><div><span class="date-tag">${localDate(date.replace('Now','Present'))}</span><p>${text}</p></div></article>`).join('');
export const experiences=()=>EXPERIENCES.map((e,i)=>`<article class="experience-row"><a class="experience-image ${i===0?'shanda-logo':''}" href="${e.href}" target="_blank" rel="noreferrer" aria-label="${i===0?e.name:t('experience.tsail')}"><img src="${e.image}" alt="${i===0?e.name:t('experience.tsail')}" loading="lazy"></a><div><span class="date-tag">${localDate(e.date)}</span><h3>${t(i===0?'experience.intern':'experience.visiting')}</h3><a href="${e.href}" target="_blank" rel="noreferrer">${i===0?e.name:t('experience.tsail')} ↗</a></div></article>`).join('');
export const competitions=()=>COMPETITIONS.map((c,i)=>`<article class="competition-row"><a class="competition-image" href="${c.href}" target="_blank" rel="noreferrer" aria-label="${t(i===0?'competitions.track1':'competitions.track5')}"><img src="${c.image}" alt="${t('competitions.image',{title:t(i===0?'competitions.track1':'competitions.track5')})}" loading="lazy"></a><div><div class="competition-meta"><span class="venue-tag gold">${c.venue}</span><span class="medal-tag">${symbol('🥈')} ${t('competitions.second')}</span></div><h3 title="${c.title}" lang="${getLanguage()}"><a href="${c.href}" target="_blank" rel="noreferrer">${t(i===0?'competitions.track1':'competitions.track5')}</a></h3><p class="paper-authors">${t('competitions.team')} ${c.authors.replace('Caixin Kang','<strong>Caixin Kang</strong>')}</p><a class="text-link" href="${c.href}" target="_blank" rel="noreferrer">${t('competitions.link')} ↗</a></div></article>`).join('');
export const honors=()=>`<ul class="awards-list">${translatedAwards().map(text=>`<li>${text}</li>`).join('')}</ul>`;
export const services=()=>`<p class="service-intro">${t('reviewer')}</p><div class="service-tags">${DATA.services.replace('Reviewer: ','').split(' · ').map(t=>`<span>${t}</span>`).join('')}</div>`;
export const VISITOR_IMAGE_URL='https://mapmyvisitors.com/map.png?d=39stm5Opsx_0AY2Yb8WV2qUptsgWP2X31Vwka5-znho&cl=ffffff';
export const visitorMap=()=>`<div class="visitor-card" data-map-state="loading"><a class="visitor-map-frame" href="https://mapmyvisitors.com/web/1bz49" target="_blank" rel="noreferrer" aria-label="${t('visitor.open')}"><img class="visitor-image" src="${VISITOR_IMAGE_URL}" alt="${t('visitor.alt')}" loading="lazy" decoding="async"><span class="visitor-wait" aria-hidden="true">${t('visitor.loading')}</span></a><div class="visitor-caption"><span><i aria-hidden="true"></i> ${t('visitor.caption')}</span><a href="https://mapmyvisitors.com/web/1bz49" target="_blank" rel="noreferrer">${t('visitor.explore')} ↗</a></div><div class="visitor-feedback" hidden><p class="visitor-note" role="status"></p><button type="button" class="visitor-retry">${t('visitor.retry')}</button></div></div>`;
const visitorCleanups=new WeakMap();
export function initVisitorMaps(root=document){
 visitorCleanups.get(root)?.();const cleanups=[];visitorCleanups.set(root,()=>cleanups.forEach(cleanup=>cleanup()));
 root.querySelectorAll('.visitor-image').forEach(img=>{
  const card=img.closest('.visitor-card'),feedback=card.querySelector('.visitor-feedback'),note=card.querySelector('.visitor-note'),retry=card.querySelector('.visitor-retry');
  let timer;
  const loaded=()=>{clearTimeout(timer);if(!img.isConnected)return;card.dataset.mapState='loaded';feedback.hidden=true;};
  const failed=()=>{clearTimeout(timer);if(!img.isConnected)return;card.dataset.mapState='error';note.textContent=t('visitor.error');feedback.hidden=false;};
  const waiting=()=>{clearTimeout(timer);timer=setTimeout(()=>{
   if(!img.isConnected||card.dataset.mapState==='loaded'||card.dataset.mapState==='error')return;
   // A slow connection must not cancel or replace the original visitor image.
   card.dataset.mapState='slow';note.textContent=t('visitor.slow');feedback.hidden=false;
  },10000);};
  const reload=()=>{card.dataset.mapState='loading';feedback.hidden=true;img.loading='eager';img.removeAttribute('src');img.src=VISITOR_IMAGE_URL;waiting();};
  img.addEventListener('load',loaded);img.addEventListener('error',failed);retry.addEventListener('click',reload);
  const observer=new IntersectionObserver(entries=>{if(entries.some(e=>e.isIntersecting)){observer.disconnect();if(img.complete&&img.naturalWidth)loaded();else waiting();}});
  observer.observe(card);if(img.complete&&img.naturalWidth)loaded();
  cleanups.push(()=>{clearTimeout(timer);observer.disconnect();img.removeEventListener('load',loaded);img.removeEventListener('error',failed);retry.removeEventListener('click',reload);});
 });
}

const heading=(mark,title,extra='')=>`<h2><span class="section-emoji">${symbol(mark)}</span>${title}${extra}</h2>`;
const publicationFilters=()=>`<div class="publication-filters" role="group" aria-label="${t('research.filter')}"><button type="button" data-publication-filter="all" aria-pressed="true">${t('research.all')}</button>${LINES.map(l=>`<button type="button" data-publication-filter="${l.id}" style="--tag-tone:${l.color}" aria-pressed="false" aria-label="${t('research.choose',{direction:t('line.'+l.id+'.title')})}" title="${t('line.'+l.id+'.title')}">${t('line.'+l.id+'.name')}</button>`).join('')}</div><p id="publication-filter-status" class="filter-status" role="status" aria-live="polite">${t('research.allDirections')}</p>`;
export const resume=()=>`<header class="cv-header" id="cv-about"><div><span class="profile-eyebrow">${t('site.eyebrow')}</span><h1>${DATA.name}</h1><p>${t('site.role')}</p>${links()}</div>${portrait('cv-portrait')}</header>${biography()}<section class="cv-section" id="cv-news">${heading('🔥',t('nav.news'))}${news()}</section><section class="cv-section" id="cv-map">${heading('📝',t('nav.map'))}<p class="bio">${t('research.overview')}</p>${publicationFilters()}<div id="publication-list">${publications()}</div><section class="cv-subsection" id="cv-competitions"><h3 class="subsection-title">${t('nav.competitions')} ${symbol('🥈')}</h3>${competitions()}</section></section><section class="cv-section" id="cv-experience">${heading('💻',t('nav.experience'))}${experiences()}</section><section class="cv-section" id="cv-awards">${heading('🏆',t('nav.awards'))}${honors()}<section class="cv-subsection" id="cv-services"><h3 class="subsection-title">${t('nav.services')}</h3>${services()}</section></section><section class="cv-section" id="cv-edu">${heading('📖',t('nav.edu'))}${education()}</section><section class="cv-section" id="cv-visitors">${heading('🌍',t('nav.visitors'))}${visitorMap()}</section><footer class="cv-footer">© 2026 Caixin Kang · <a href="https://kkkcx.github.io/" target="_blank" rel="noreferrer">${t('footer.homepage')} ↗</a> · <a href="art-credits.html?lang=${getLanguage()}" target="_blank" rel="noreferrer">${t('footer.art')} ↗</a><p class="music-credit" style="margin-top:14px">${t('footer.music')} · <a href="https://commons.wikimedia.org/wiki/File:Bolero-Maurice_Ravel-Paris_Orchestra-Charles_Munch-1956.ogg" target="_blank" rel="noreferrer">${t('footer.credits')} ↗</a></p></footer>`;
