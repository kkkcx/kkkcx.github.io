import {createMusicController} from './music-controller.js?v=16';
import {t,getLanguage,setLanguage} from './i18n.js';
import { ARTWORKS } from './gallery-data.js?v=13';
import { DATA, LINES } from './data.js';
import { links,portrait,biography,paper,papersForDirection,news,education,experiences,competitions,honors,services,visitorMap,initVisitorMaps,resume } from './resume-content.js';
const $=s=>document.querySelector(s);
const mobile=matchMedia('(max-width:760px)'), reduced=matchMedia('(prefers-reduced-motion:reduce)');
const items=[['overview','The studio'],['about','About me'],['news','News'],['map','Publications'],...LINES.map(l=>[l.id,l.name[0]+l.name.slice(1).toLowerCase()]),['competitions','Competitions'],['experience','Experiences'],['awards','Awards'],['services','Services'],['edu','Educations'],['visitors','Visiting Map']];
let publicationFilter='all';
let section='overview',cv=false,night=false,sourceFocus=null;
const sectionName=id=>t(LINES.some(l=>l.id===id)?'line.'+id+'.name':'nav.'+id);
const activeIndexSection=()=>!cv&&section==='services'?'awards':cv&&LINES.some(l=>l.id===section)?'map':section;
function renderIndex(){
 const visible=items.filter(([id])=>cv?id!=='overview'&&!LINES.some(l=>l.id===id):id!=='services');
 $('#index-nav').innerHTML=visible.map(([id,name])=>{const line=LINES.find(l=>l.id===id),sub=id==='competitions'||id==='services';
  return `<button data-section="${id}" class="${line?'research-child':sub?'section-child':''}" aria-current="${id===activeIndexSection()}"><span class="nav-mark" aria-hidden="true" ${line?`style="--tone:${line.color}"`:''}></span><span>${!cv&&id==='map'?t('nav.research'):sectionName(id)}</span></button>`;
 }).join('');
}
renderIndex();
function setIndex(open){$('#index').classList.toggle('collapsed',!open);$('#index-toggle').setAttribute('aria-expanded',String(open));$('#index-symbol').textContent=open?'−':'+';}
setIndex(!mobile.matches);$('#index-toggle').addEventListener('click',()=>setIndex($('#index').classList.contains('collapsed')));
document.addEventListener('click',e=>{if(cv&&!e.target.closest('#index'))setIndex(false);});
const galleryNote=id=>{const a=ARTWORKS.find(a=>a.id===id);return `<details class="gallery-note"><summary>${t('gallery.connection')} · <span lang="en">${a.title}</span></summary><p>${a.meaning[getLanguage()]}</p><a class="artwork-link" data-artwork="${id}" href="${a.artworkUrl}" target="_blank" rel="noopener noreferrer">${t('gallery.original')} ↗</a> · <a href="art-credits.html?lang=${getLanguage()}#${id}" target="_blank" rel="noreferrer">${t('footer.art')} ↗</a></details>`;};
const map=()=>LINES.map(l=>`<button class="line-link" data-section="${l.id}" style="--tone:${l.color}"><i aria-hidden="true"></i><span><b>${l.name}</b>${getLanguage()==='en'?'':`<small>${t('line.'+l.id+'.title')}</small>`}</span><span>↗</span></button>`).join('');
$('#resume-content').innerHTML=resume();initVisitorMaps($('#resume-content'));
function applyPublicationFilter(){
 let first=true;
 document.querySelectorAll('#publication-list .paper').forEach(el=>{
  el.hidden=publicationFilter!=='all'&&!el.dataset.topics.split(' ').includes(publicationFilter);
  el.classList.toggle('first-visible',!el.hidden&&first);if(!el.hidden)first=false;
 });
 document.querySelectorAll('[data-publication-filter]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.publicationFilter===publicationFilter)));
 $('#publication-filter-status').textContent=publicationFilter==='all'?t('research.allDirections'):t('research.showing',{direction:t('line.'+publicationFilter+'.title')});
}
applyPublicationFilter();
document.addEventListener('click',e=>{const b=e.target.closest('[data-publication-filter]');if(b)navigate(b.dataset.publicationFilter==='all'?'map':b.dataset.publicationFilter);});
function updatePanelAccessibility(){const modal=mobile.matches&&!$('#reading-panel').hidden;const panel=$('#reading-panel');if(modal){panel.setAttribute('role','dialog');panel.setAttribute('aria-modal','true');}else{panel.removeAttribute('role');panel.removeAttribute('aria-modal');}document.querySelectorAll('.identity,#index,#view-toggle,#language-switch,#room-view,#room-tools,.skip').forEach(el=>el.inert=modal);}
function closePanel(restore=false){$('#reading-panel').hidden=true;document.body.classList.remove('panel-open','news-open');updatePanelAccessibility();if(restore&&sourceFocus?.isConnected)sourceFocus.focus();}
function openPanel(id,{focus=true}={}){let title='',kicker='',content='';const line=LINES.find(l=>l.id===id);
 if(line){title=t('line.'+line.id+'.title');kicker=`${t('nav.research')} / ${line.name}`;content=`<p class="intro">${t('line.'+line.id+'.sub')}</p>${galleryNote(id)}${papersForDirection(id).map(({p,line})=>paper(p,{line})).join('')}<p class="music-credit"><a href="art-credits.html?lang=${getLanguage()}" target="_blank" rel="noreferrer">${t('footer.art')} ↗</a></p>`;}
 else if(id==='about'){title=DATA.name;kicker=t('panel.researcher');content=`<div class="profile-row">${portrait('panel-portrait')}<p>${t('site.shortRole')}<br>UT-Vision Lab<br>${t('site.university')}</p></div>${biography()}${links()}`;}
 else if(id==='map'){title=t('panel.social');kicker=t('panel.researchWall');content=`<p class="intro">${t('research.overview')}</p>${map()}`;}
 else if(id==='edu'){title=t('nav.edu');kicker=t('panel.library');content=education();}
 else if(id==='experience'){title=t('nav.experience');kicker=t('panel.collaboration');content=experiences();}
 else if(id==='services'){title=t('nav.services');kicker=t('panel.community');content=services();}
 else if(id==='competitions'){title=t('nav.competitions');kicker='RoboDrive / ICRA 2024';content=competitions();}
 else if(id==='news'){title=t('nav.news');kicker=t('panel.noticeboard');content=news();}
 else if(id==='awards'){title=t('nav.awards');kicker=t('panel.aboveLibrary');content=honors()+`<h3 class="subsection-title">${t('nav.services')}</h3>${services()}`;}
 else if(id==='visitors'){title=t('nav.visitors');kicker=t('panel.world');content=visitorMap();}
 else return;
 document.body.classList.toggle('news-open',id==='news');$('#reading-panel').dataset.section=id;
 $('#panel-kicker').textContent=kicker.toUpperCase();$('#panel-content').innerHTML=`<h2 id="panel-title" tabindex="-1">${title}</h2>${content}`;$('#reading-panel').hidden=false;$('#reading-panel').scrollTop=0;document.body.classList.add('panel-open');updatePanelAccessibility();if(focus)$('#panel-title').focus({preventScroll:true});initVisitorMaps($('#panel-content'));
}
function navigate(id){const hash=cv?`cv/${id}`:id;if(location.hash.slice(1)===hash)route();else location.hash=hash;}
document.addEventListener('click',e=>{const link=e.target.closest('a.artwork-link');if(link){const art=ARTWORKS.find(a=>a.id===link.dataset.artwork);if(!art||!window.confirm(t('gallery.confirmOpen',{title:art.title})))e.preventDefault();return;}const button=e.target.closest('button[data-section]');if(button){sourceFocus=button; if(cv||mobile.matches)setIndex(false);navigate(button.dataset.section);}});
function route(){const hash=decodeURIComponent(location.hash.slice(1));const nextCv=hash==='cv'||hash.startsWith('cv/');const id=nextCv?hash.slice(3)||'about':hash||'overview';section=items.some(([key])=>key===id)?id:'overview';const modeChanged=cv!==nextCv;cv=nextCv;if(modeChanged){renderIndex();setIndex(!cv&&!mobile.matches);}document.body.classList.toggle('cv-mode',cv);$('#resume-view').hidden=!cv;$('#view-toggle').setAttribute('aria-pressed',String(cv));$('#view-toggle').querySelector('span').textContent=cv?t('mode.room'):t('mode.cv');$('#view-toggle').setAttribute('aria-label',cv?t('mode.toRoom'):t('mode.toCv'));closePanel();$('#object-label').hidden=true;
 document.querySelectorAll('#index-nav button').forEach(b=>b.setAttribute('aria-current',String(b.dataset.section===activeIndexSection())));
 window.dispatchEvent(new CustomEvent('room-mode',{detail:cv}));
 if(cv){if(section==='map'||LINES.some(l=>l.id===section)){publicationFilter=section==='map'?'all':section;applyPublicationFilter();}requestAnimationFrame(()=>{const el=LINES.some(l=>l.id===section)?$('#cv-map'):$(`#cv-${section==='overview'?'about':section}`);el?.scrollIntoView({block:'start',behavior:'instant'});});}
 else{if(section!=='overview')openPanel(section);window.dispatchEvent(new CustomEvent('room-focus',{detail:section}));$('#room-caption').firstElementChild.textContent=section==='overview'?t('room.caption'):t('room.exploring',{section:sectionName(section)});}
}
$('#view-toggle').addEventListener('click',()=>{sourceFocus=$('#view-toggle');location.hash=cv?'overview':'cv';if(mobile.matches)setIndex(false);});
function returnToRoom(){const anchor=mobile.matches?$('#index-toggle'):$('#index-nav [data-section="'+section+'"]');navigate('overview');requestAnimationFrame(()=>anchor?.focus());}
$('#panel-close').addEventListener('click',returnToRoom);
$('#reset-room').addEventListener('click',()=>navigate('overview'));
window.addEventListener('hashchange',route);
window.addEventListener('room-select',e=>{if(e.detail==='cat'){window.dispatchEvent(new CustomEvent('room-pet'));}else if(e.detail==='music')$('#sound-toggle').click();else{sourceFocus=$('#index-nav button[data-section="'+e.detail+'"]');if(mobile.matches)setIndex(false);navigate(e.detail);}});
window.addEventListener('room-ready',()=>{window.dispatchEvent(new CustomEvent('room-mode',{detail:cv}));window.dispatchEvent(new CustomEvent('room-focus',{detail:section}));});
mobile.addEventListener('change',()=>{setIndex(!cv&&!mobile.matches);updatePanelAccessibility();});
document.addEventListener('keydown',e=>{if(e.key==='Escape'){if(!$('#reading-panel').hidden){returnToRoom();}else if(cv||mobile.matches){setIndex(false);$('#index-toggle').focus();}}if(e.key==='Tab'&&mobile.matches&&!$('#reading-panel').hidden){const focusables=[...$('#reading-panel').querySelectorAll('button,a[href]')].filter(el=>el.getClientRects().length);const first=focusables[0],last=focusables.at(-1);if(e.shiftKey&&(document.activeElement===first||document.activeElement===$('#panel-title'))){e.preventDefault();last.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}}});
$('#light-toggle').addEventListener('click',()=>{night=!night;document.body.classList.toggle('night',night);$('#light-toggle').setAttribute('aria-pressed',String(night));$('#light-toggle').setAttribute('aria-label',night?t('light.day'):t('light.night'));$('#light-toggle').title=t(night?'light.day':'light.night');window.dispatchEvent(new CustomEvent('room-light',{detail:night}));});
const audio=$('#room-audio'),sound=$('#sound-toggle');audio.volume=.3;
let messageTimer;function message(text){clearTimeout(messageTimer);$('#status-message').textContent=text;messageTimer=setTimeout(()=>$('#status-message').textContent='',3500);}
const music=createMusicController({audio,button:sound,message,t,notify:playing=>window.dispatchEvent(new CustomEvent('room-music',{detail:playing}))});
let ambientMotion=!reduced.matches;
function updateMotion(){const button=$('#motion-toggle');button.setAttribute('aria-pressed',String(!ambientMotion));button.setAttribute('aria-label',ambientMotion?t('motion.pause'):t('motion.resume'));button.title=ambientMotion?t('motion.pause'):t('motion.resume');button.querySelector('span').textContent=ambientMotion?'Ⅱ':'▷';window.dispatchEvent(new CustomEvent('room-motion',{detail:ambientMotion}));}
$('#motion-toggle').addEventListener('click',()=>{ambientMotion=!ambientMotion;updateMotion();});
reduced.addEventListener('change',e=>{ambientMotion=!e.matches;updateMotion();});
window.addEventListener('room-ready',updateMotion);updateMotion();
applyTranslations();
route();
import('./room.js?v=15').catch(e=>{console.warn('3D studio unavailable',e);$('#room-loading').hidden=true;$('#room-canvas').hidden=true;$('#room-fallback').hidden=false;$('#light-toggle').disabled=true;$('#room-help').textContent=t('help.fallback');});

// Language changes only update DOM copy; camera, mode, music and motion are retained.
function applyTranslations(){
 const lang=getLanguage();document.documentElement.lang=lang==='zh'?'zh-CN':lang;
 document.title=t('site.title');$('meta[name="description"]').content=t('site.description');
 $('.identity small').textContent=t('site.studio');$('.identity a').setAttribute('aria-label',t('reset'));
 $('.skip').textContent=t('skip');$('#index-toggle').firstElementChild.textContent=t('nav.index');
 $('#index-nav').setAttribute('aria-label',t('nav.index'));$('.index-foot').innerHTML=`UT-Vision Lab<br>${t('site.university')}`;
 $('#room-view').setAttribute('aria-label',t('room.label'));$('#room-canvas').setAttribute('aria-label',t('room.canvas'));
 $('#room-fallback').alt=t('room.fallbackAlt');$('#room-loading').lastElementChild.textContent=t('room.loading');
 $('#room-help').textContent=t(!$('#room-fallback').hidden?'help.fallback':matchMedia('(pointer:coarse)').matches?'help.touch':'help.mouse');
 $('#room-caption').firstElementChild.textContent=section==='overview'?t('room.caption'):t('room.exploring',{section:sectionName(section)});
 $('#studio-quote-text').textContent=t('room.captionSub');$('#studio-quote-source').textContent=t('room.quoteCredit');$('#resume-view').setAttribute('aria-label',t('mode.cv'));
 $('#view-toggle').querySelector('span').textContent=cv?t('mode.room'):t('mode.cv');$('#view-toggle').setAttribute('aria-label',t(cv?'mode.toRoom':'mode.toCv'));
 const labels={'#panel-close':'panel.close','#reset-room':'reset','#light-toggle':night?'light.day':'light.night','#motion-toggle':ambientMotion?'motion.pause':'motion.resume','#sound-toggle':sound.getAttribute('aria-busy')==='true'||!audio.paused?'sound.pause':'sound.play'};
 for(const [selector,key] of Object.entries(labels)){$(selector).setAttribute('aria-label',t(key));$(selector).title=t(key);}
 document.querySelectorAll('.language-switch').forEach(el=>el.setAttribute('aria-label',t('language.label')));
 document.querySelectorAll('[data-language]').forEach(button=>{button.setAttribute('aria-pressed',String(button.dataset.language===lang));button.setAttribute('aria-label',t('language.'+button.dataset.language));button.title=t('language.'+button.dataset.language);});
}
function readingAnchor(root){
 const top=cv?(mobile.matches?150:112):$('#reading-panel').getBoundingClientRect().top+20;
 const candidates=[...root.querySelectorAll('h2,h3,.paper,.news-row,.education-row,.experience-row,.competition-row,.awards-list li,.bio p,.cv-header,.visitor-card')];
 const index=candidates.findIndex(el=>el.getBoundingClientRect().bottom>top);
 return index<0?null:{index,offset:candidates[index].getBoundingClientRect().top,candidates:()=>[...root.querySelectorAll('h2,h3,.paper,.news-row,.education-row,.experience-row,.competition-row,.awards-list li,.bio p,.cv-header,.visitor-card')]};
}
window.addEventListener('language-change',()=>{
 const languageAtChange=getLanguage(),hashAtChange=location.hash;
 const panelOpen=!$('#reading-panel').hidden,root=cv?$('#resume-content'):$('#panel-content');
 const anchor=(cv||panelOpen)?readingAnchor(root):null;
 $('#resume-content').innerHTML=resume();initVisitorMaps($('#resume-content'));applyPublicationFilter();renderIndex();
 if(panelOpen)openPanel(section,{focus:false});applyTranslations();
 const restore=()=>{if(!anchor)return;const current=anchor.candidates()[anchor.index];if(current){const delta=current.getBoundingClientRect().top-anchor.offset;if(cv)document.body.scrollTop+=delta;else $('#reading-panel').scrollTop+=delta;}};
 restore();const scroller=cv?document.body:$('#reading-panel'),scrollAfterChange=scroller.scrollTop;
 document.fonts.ready.then(()=>{if(getLanguage()===languageAtChange&&location.hash===hashAtChange&&Math.abs(scroller.scrollTop-scrollAfterChange)<2)restore();});
 message(t('language.changed'));
});
document.addEventListener('click',e=>{const button=e.target.closest('[data-language]');if(button)setLanguage(button.dataset.language);});
