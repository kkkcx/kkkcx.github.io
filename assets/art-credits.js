import {ARTWORKS} from './gallery-data.js?v=26';
import {getLanguage,setLanguage} from './i18n.js?v=29';
const copy={
 en:{title:'Gallery',back:'← The studio',original:'Original title',sources:'Sources & image rights',record:'Museum record',image:'Image source',rights:'Rights reference',unchanged:'Complete image, displayed at its original aspect ratio; no image edits.',policy:'Source, collection, and image-rights information accompany each work.'},
 zh:{title:'画廊',back:'← 返回工作室',original:'原题',sources:'来源与图片授权',record:'馆藏记录',image:'图片来源',rights:'权利说明',unchanged:'完整保留画面，按原图比例展示；未编辑图片内容。',policy:'每幅作品均保留来源、收藏机构与图片授权信息。'},
 ja:{title:'ギャラリー',back:'← スタジオに戻る',original:'原題',sources:'出典と画像の利用条件',record:'所蔵館の記録',image:'画像の出典',rights:'権利に関する情報',unchanged:'画像は編集せず、元の縦横比で全体を表示しています。',policy:'各作品に出典、所蔵館、画像の利用条件を記載しています。'}
};
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function render(){
 const lang=getLanguage(),c=copy[lang];document.documentElement.lang=lang;document.title=c.title+' · Caixin Kang';
 for(const key of ['title','policy'])document.getElementById(key).textContent=c[key];
 const back=document.getElementById('back');back.textContent=c.back;back.href='./?lang='+lang+'#overview';document.querySelector('#language').value=lang;
 document.getElementById('paintings').innerHTML=ARTWORKS.map(a=>`<figure id="${a.id}"><a class="painting" href="${esc(a.artworkUrl)}" target="_blank" rel="noreferrer"><img src="assets/art/${a.file}?v=${a.sha256.slice(0,12)}" alt="${esc(a.artist+' — '+a.title)}" width="${a.dimensions[0]}" height="${a.dimensions[1]}" decoding="async"></a><figcaption><div class="meta"><span>${esc(a.artist)} · ${a.year}</span></div><h2 lang="en">${esc(a.title)}</h2>${a.originalTitle&&a.originalTitle!==a.title?`<p class="original">${c.original}: <span lang="${a.originalLanguage||'de'}">${esc(a.originalTitle)}</span></p>`:''}<p class="museum">${esc(a.museum)}</p><details><summary>${c.sources}</summary><p>${esc(a.credit)}<br><a href="${a.licenseUrl}" target="_blank" rel="noreferrer">${a.license}</a></p><p class="source-links"><a href="${esc(a.source)}" target="_blank" rel="noreferrer">${c.record} ↗</a><a href="${esc(a.imageSource)}" target="_blank" rel="noreferrer">${c.image} ↗</a><a href="${esc(a.rightsSource)}" target="_blank" rel="noreferrer">${c.rights} ↗</a></p><p>${c.unchanged}</p></details></figcaption></figure>`).join('');
 if(location.hash)requestAnimationFrame(()=>document.getElementById(location.hash.slice(1))?.scrollIntoView({block:'start'}));
}
document.querySelector('#language').addEventListener('change',e=>{setLanguage(e.target.value);render();});render();
