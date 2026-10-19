import assert from 'node:assert/strict';
import {readFileSync, existsSync} from 'node:fs';
import {createHash} from 'node:crypto';
import test from 'node:test';
import {ARTWORKS} from '../assets/gallery-data.js';
import {ART_RESEARCH} from '../assets/art-research.js';
import {LINES} from '../assets/data.js';
import {PUBLICATION_ORDER} from '../assets/profile-details.js';
import {drawResearchBoard} from '../assets/studio-art.js';

test('four distinct artists, with complete local images and source records',()=>{
  assert.equal(ARTWORKS.length,4);
  assert.equal(new Set(ARTWORKS.map(a=>a.artist)).size,4);
  for(const art of ARTWORKS){
    const file=new URL('../assets/art/'+art.file,import.meta.url);
    assert(existsSync(file));
    assert.equal(createHash('sha256').update(readFileSync(file)).digest('hex'),art.sha256);
    assert.equal(art.ratio,art.dimensions[0]/art.dimensions[1]);
    for(const field of ['source','imageSource','rightsSource','licenseUrl','artworkUrl'])assert(new URL(art[field]).protocol==='https:');
    assert(!('meaning' in art));
    for(const lang of ['en','zh','ja'])assert(ART_RESEARCH[art.id][lang]);
  }
  assert.deepEqual(JSON.parse(readFileSync(new URL('../assets/art/sources.json',import.meta.url),'utf8')),ARTWORKS);
});

test('gallery has no research interpretation; studio keeps the short notes',()=>{
  const gallery=readFileSync(new URL('../assets/art-credits.js',import.meta.url),'utf8');
  assert(!/Four paintings, four artists|四幅画，四位画家|4点の絵画、4人の画家/.test(gallery));
  const galleryPage=readFileSync(new URL('../art-credits.html',import.meta.url),'utf8');
  assert(!galleryPage.includes('id="intro"'));
  assert(!gallery.includes("'intro'"));
  assert(!/a\.meaning|c\.directions|ART_RESEARCH|Art & research|画作与研究|作品と研究/.test(gallery));
  const studio=readFileSync(new URL('../assets/room-ui.js',import.meta.url),'utf8');
  assert(studio.includes('ART_RESEARCH[id][getLanguage()]'));
  const scene=readFileSync(new URL('../assets/room.js',import.meta.url),'utf8');
  assert(scene.includes('LINES.find(l=>l.id===art.id)'));
  assert(!scene.includes('LINES[i]'));
});

test('directions follow the agreed order, with DIFFender cross-listed without duplicate papers',()=>{
  assert.deepEqual(LINES.map(l=>l.id),['read','together','trust','act']);
  assert.equal(LINES.at(-1).title,'Generative Modeling');
  assert.equal(LINES[2].title,'Trustworthy AI');
  assert.equal(LINES[2].name,'TRUSTWORTHY');
  const papers=LINES.flatMap(l=>l.papers);
  assert.equal(papers.length,21);
  assert.equal(new Set(papers.map(p=>p.p)).size,21);
  assert.deepEqual(new Set(papers.map(p=>p.p)),new Set(PUBLICATION_ORDER));
  const diffender=LINES.find(l=>l.id==='trust').papers.filter(p=>p.c==='https://github.com/kkkcx/DIFFender');
  assert.equal(diffender.length,2);
  assert(diffender.every(p=>p.topics.includes('act')));
});

test('painting hover and the blackboard reuse current research labels',()=>{
  const scene=readFileSync(new URL('../assets/room.js',import.meta.url),'utf8');
  assert(scene.includes("t('line.'+section+'.title')"));
  const translations=readFileSync(new URL('../assets/i18n.js',import.meta.url),'utf8');
  assert(!/["']object\.(read|act|together|trust)["']/.test(translations));
  assert(translations.includes('["Trustworthy","可信","信頼性"]'));
  assert(translations.includes('["Trustworthy AI","可信人工智能","信頼できるAI"]'));
  const drawn=[];
  const context=new Proxy({
    fillText(text){drawn.push(text);},
    createLinearGradient(){return {addColorStop(){}};}
  },{get(target,key){return key in target?target[key]:()=>{};}});
  drawResearchBoard(context,1024,724);
  for(const label of ['Understanding','Interaction','Trustworthy','Generation'])assert(drawn.includes(label));
  assert(!drawn.some(text=>/Robustness|Trustworthy &/.test(text)));
});

test('replacement files match their rights records; retained Mondrian has museum-specific evidence',()=>{
  for(const id of ['read','together']){
    const art=ARTWORKS.find(a=>a.id===id);
    assert.equal(art.imageSource,art.rightsSource);
    assert.equal(new URL(art.download).hostname,'upload.wikimedia.org');
    assert.equal(decodeURIComponent(new URL(art.download).pathname.split('/').at(-1)),decodeURIComponent(new URL(art.rightsSource).pathname.split('/File:')[1]));
    assert.equal(art.verified,'2026-10-19');
    assert(art.rightsBasis.includes('PD-Art'));
  }
  const art=ARTWORKS.find(a=>a.id==='trust');
  assert.equal(art.title,'Composition (No. 1) Gray-Red');
  assert.equal(art.licenseUrl,'https://creativecommons.org/publicdomain/zero/1.0/');
  assert.equal(new URL(art.rightsRecord).pathname,'/api/v1/artworks/65821');
  assert.equal(art.rightsPolicyApi,'https://api.artic.edu/api/v1/generic-pages/410');
  assert.equal(art.imageManifest,'https://api.artic.edu/api/v1/artworks/65821/manifest.json');
  assert(art.rightsBasis.includes('does not independently establish US expiry'));
});
