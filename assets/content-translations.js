import {DATA} from './data.js';
import {NEWS} from './profile-details.js';
import {getLanguage,t} from './i18n.js?v=19';

// Names without an authoritative local spelling retain the original Latin form.
// Translations describe the existing CV; they do not add qualifications or affiliations.
const a=(href,label)=>`<a href="${href}" target="_blank" rel="noreferrer">${label}</a>`;
const lab=a('https://www.ut-vision.org','UT-Vision Lab');
const rose=a('https://rose-vision.github.io/','ROSE Vision Lab');
const tsail=a('https://ml.cs.tsinghua.edu.cn/','TSAIL');
const sato=()=>a('https://sites.google.com/ut-vision.org/ysato/','佐藤洋一教授');
const wei=()=>a('https://sites.google.com/site/xingxingwei1988/','韦星星教授');
const su=()=>a('https://www.suhangss.me/',getLanguage()==='zh'?'苏航副教授':'苏航准教授');
const dong=()=>a('https://ml.cs.tsinghua.edu.cn/~yinpeng/',getLanguage()==='zh'?'董胤蓬助理教授':'董胤蓬助教');
export function translatedBio(){
 if(getLanguage()==='en')return DATA.bio;
 if(getLanguage()==='zh')return [
  `你好，我是东京大学 ${lab} 的博士研究生，导师是${sato()}。`,
  `我于 2025 年获得北京航空航天大学人工智能学院硕士学位，导师为${wei()}（${rose}）。硕士期间，我还接受了清华大学${su()}和${dong()}（${tsail}）的联合指导。此前，我于 2022 年获得四川大学计算机学院学士学位。`
 ];
 return [
  `東京大学 ${lab} の博士課程に在籍し、${sato()}の指導を受けています。`,
  `2025年に北京航空航天大学人工智能学院で修士号（M.E.）を取得しました。${wei()}（${rose}）の指導に加え、修士課程では清華大学の${su()}と${dong()}（${tsail}）から共同指導を受けました。それ以前は、2022年に四川大学計算機学院で学士号（B.E.）を取得しました。`
 ];
}
export function translatedEducation(){
 const entries={
  en:DATA.education.map(([,text])=>text),
  zh:['<b>信息科学博士在读</b>，东京大学','<b>人工智能硕士（M.E.）</b>，北京航空航天大学','<b>计算机科学与技术学士（B.E.）</b>，四川大学'],
  ja:['<b>情報科学分野・博士課程在籍</b>、東京大学','<b>人工知能分野・修士（M.E.）</b>、北京航空航天大学','<b>計算機科学・技術分野・学士（B.E.）</b>、四川大学']
 };
 return DATA.education.map(([date],i)=>[date,entries[getLanguage()][i]]);
}
export function translatedAwards(){
 const entries={
  en:DATA.awards,
  zh:[
   'BOOST NAIS — 面向下一代智能社会的高层次 AI 人才培养项目，日本科学技术振兴机构（JST），2025',
   '北京航空航天大学优秀毕业生，2025',
   '国家奖学金，中国教育部，2024',
   '海信奖学金，海信集团，2023',
   '四川省优秀毕业生，2022',
   '自力—志东奖学金，四川大学，2021'
  ],
  ja:[
   'BOOST NAIS — 次世代知能社会を先導する高度AI人材育成、科学技術振興機構（JST）、2025年',
   '北京航空航天大学 優秀卒業生表彰、2025年',
   '国家奨学金、中国教育部、2024年',
   'ハイセンス奨学金、ハイセンスグループ、2023年',
   '四川省 優秀卒業生表彰、2022年',
   '「自力—志东」奨学金、四川大学、2021年'
  ]
 };
 return entries[getLanguage()];
}
export function translatedNews(i){
 const original=NEWS[i][1],lang=getLanguage();
 if(lang==='en')return original;
 if(original.includes('BOOST NAIS')){
  const href='https://spring-gx.adm.s.u-tokyo.ac.jp/'+(lang==='ja'?'ja':'en')+'/boost/';
  return lang==='zh'
   ?`入选日本科学技术振兴机构（JST）的${a(href,'面向下一代智能社会的高层次 AI 人才培养（BOOST NAIS）')}项目。`
   :`科学技術振興機構（JST）の${a(href,'次世代知能社会を先導する高度AI人材育成（BOOST NAIS）')}プログラムに採用されました。`;
 }
 if(original.includes('https://robodrive-24.github.io/')){
  const track=a('https://robodrive-24.github.io/',t(original.includes('Track 1:')?'competitions.track1':'competitions.track5'));
  return lang==='zh'?`我们的团队在 ICRA 2024 的 ${track} 中获得第二名 🥈。`:`ICRA 2024 の ${track} で、私たちのチームが第2位 🥈 を獲得しました。`;
 }
 const venue=original.match(/<a\b[^>]*>.*?<\/a>/)?.[0];
 const year=original.match(/<\/a> (\d{4})/)?.[1];
 return t('news.accepted',{count:original.startsWith('Two')?2:1,venue,year:year?' '+year:''});
}
