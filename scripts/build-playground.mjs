import {headerFor} from './header.mjs';
import {themeLink} from './theme.mjs';
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import vm from 'node:vm';
const root=fileURLToPath(new URL('../',import.meta.url));const ctx={window:{}};
vm.runInNewContext(await readFile(`${root}site/content.js`,'utf8'),ctx);
const {playground:p}=ctx.window.portfolioContent;
const t=v=>String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const header=headerFor('playground');
const footer=await readFile(`${root}scripts/templates/shared-footer.html`,'utf8');
let experiments=await readFile(`${root}scripts/templates/playground-experiments.html`,'utf8');
experiments=experiments.replaceAll('class="experiment wrap"','class="experiment" hidden');
// Repeat the uploaded sequence so the hidden return never creates an empty seam.
function pin(study){
 if(study.src)return `<article class="gallery-pin" data-category="art"><button class="pin-button" data-study-id="${t(study.id)}" aria-label="Open ${t(study.title)}"><span class="pin-art pin-image"><img src="${t(study.src)}" alt="${t(study.alt)}" width="${study.width}" height="${study.height}" loading="lazy"></span></button></article>`;

 const palette=p.palettes.find(item=>item.id===study.palette);
 return `<article class="gallery-pin" data-category="${study.category}"><button class="pin-button" data-study-id="${t(study.id)}" aria-label="Open ${t(study.title)}, placeholder visual study"><span class="pin-art pin-${t(study.art)}" style="--pin-ratio:${study.ratio};${palette.colors.map((color,i)=>`--pin-${i}:${color}`).join(';')}" aria-hidden="true">${study.art==='type'?`<span class="pin-type">${t(study.words)}</span>`:'<i></i><i></i><i></i><i></i>'}</span></button></article>`;
}
await mkdir(`${root}site/playground`,{recursive:true});
await writeFile(`${root}site/playground/index.html`,`<!doctype html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Playground — Emily Dong</title><meta name="description" content="Art, illustration, and creative explorations by Emily Dong."><link rel="icon" href="/favicon.svg" type="image/svg+xml"><link rel="stylesheet" href="/style.css?v=6"><link rel="stylesheet" href="/playground.css?v=5"><script src="/content.js" defer></script><script src="/shared.js" defer></script><script src="/playground.js?v=5" defer></script>${themeLink}<link rel="stylesheet" href="/playground-arc.css"><script src="/playground-arc.js" defer></script></head><body id="top" class="playground-page"><a class="skip" href="#main">Skip to content</a>${header}<main id="main"><section class="gallery-section wrap" aria-label="Visual study gallery"><div class="arc-gallery"><div class="arc-viewport" role="region" aria-label="Artwork moving clockwise along a semicircle"><div class="arc-track">${[...p.studies,...p.studies].map(pin).join('')}</div></div><section class="gallery-intro wrap" aria-labelledby="play-title"><h1 id="play-title">Made for the fun of it</h1></section><div class="arc-controls"><button type="button" data-arc-pause aria-pressed="false">Pause motion</button></div></div></section></main>${footer}<dialog id="study-dialog" aria-labelledby="study-dialog-title"><div class="study-dialog-header"><div><p class="eyebrow">PLACEHOLDER VISUAL STUDY</p><h2 id="study-dialog-title"></h2></div><button id="close-study" aria-label="Close visual study">✕</button></div><div id="study-preview"></div><details class="study-tools"><summary>Try an experiment <span aria-hidden="true">＋</span></summary><div id="study-experiments">${experiments}</div></details><p class="study-disclaimer">An original placeholder made for this portfolio. Settings are temporary and are not saved or submitted.</p></dialog></body></html>\n`);
console.log(`Built semicircle Playground with ${p.studies.length} artworks.`);
