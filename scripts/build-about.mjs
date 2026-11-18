import {headerFor} from './header.mjs';
import {themeLink} from './theme.mjs';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';
const root = fileURLToPath(new URL('../', import.meta.url));
const context = {window: {}};
vm.runInNewContext(await readFile(`${root}site/content.js`, 'utf8'), context);
const content = context.window.portfolioContent;
const about = content.about;
const escape = value => String(value).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const text = value => escape(value ?? '');
const url = value => {
  if (!value) return null;
  if (/^(https?:\/\/|mailto:|\/(?!\/))/.test(value)) return text(value);
  if (!/^[a-z]+:/i.test(value) && !value.startsWith('//')) return text(`/${value.replace(/^\.\//, '')}`);
  throw new Error('Use a local path or an https/http URL for content links and assets.');
};
// Reuse the existing homepage shell to avoid a separate navigation/footer design.
const header=headerFor('about');
const footer=await readFile(`${root}scripts/templates/shared-footer.html`,'utf8');
const flipbook=await readFile(`${root}scripts/templates/about-flipbook.html`,'utf8');
function image(item, index) {
  if (!item) return '';
  const source = url(item.src);
  return `<figure class="about-image about-image-${index}">${source
    ? `<img src="${source}" alt="${text(item.alt)}" width="${item.width}" height="${item.height}" ${index ? 'loading="lazy"' : 'fetchpriority="high"'} decoding="async">`
    : `<div class="image-placeholder placeholder-${index}" aria-hidden="true"><span class="placeholder-frame"></span><span class="placeholder-form"></span><span class="placeholder-spark">✳</span><span class="placeholder-index">${index ? '02 / PROCESS' : '01 / PORTRAIT'}</span></div>`}<figcaption>${text(item.caption)}</figcaption></figure>`;
}
function intro() {
  return `<section class="about-landing" aria-labelledby="about-heading"><div class="about-pill-stage" aria-hidden="true">${about.pills.map((pill,i)=>`<div class="about-pill-body" data-about-pill="${i}" style="--pill-fill:${text(pill.fill)}"><div class="intro-capsule about-physics-pill">${pill.src?`<img class="about-pill-fill" src="${url(pill.src)}" alt="${text(pill.alt)}">`:'<span class="about-pill-fill"></span>'}</div></div>`).join('')}</div><div class="about-landing-copy"><h1 id="about-heading">${text(about.title)}</h1><p class="about-lead">${text(about.lead)}</p><div class="intro-paragraphs">${about.paragraphs.map(p=>`<p>${text(p)}</p>`).join('')}</div></div></section>`;
}
function involvements() {
  return `<section class="campus-section wrap" aria-labelledby="campus-heading"><h2 id="campus-heading">Campus Involvements</h2><ul class="campus-list">${(about.involvements || []).map(item=>`<li class="campus-card"><div class="campus-thumbnail${item.image?.kind==='logo'?' campus-logo-panel':''}" data-organization="${text(item.id)}">${item.hoverImage?`<img class="campus-hover-image" src="${url(item.hoverImage.src)}" alt="${text(item.hoverImage.alt || item.organization)}" loading="lazy" decoding="async">`:""}${item.image?`<img src="${url(item.image.src || item.image)}" alt="${text(item.image.alt || item.organization)}" loading="lazy" decoding="async">`:'<div class="campus-thumbnail-placeholder" aria-hidden="true"></div>'}</div><div class="campus-card-header"><h3>${item.url?`<a href="${url(item.url)}">${text(item.organization)}</a>`:text(item.organization || 'Organization name')}</h3></div><ul class="campus-roles">${(item.roles || [{title:item.role || 'Your role',dates:item.dates || 'Dates'}]).map(role=>`<li><span class="campus-role">${text(role.title)}</span></li>`).join('')}</ul><p class="campus-description">${text(item.description || 'Add a short description of your involvement and contributions.')}</p></li>`).join('')}</ul></section>`;
}
// One layout map for the six existing tools; coordinates are percentages of the book surround.
const TOOL_POSITIONS = [
  {x:14,y:18,rotation:-28}, {x:86,y:18,rotation:28},
  {x:10,y:47,rotation:18}, {x:90,y:47,rotation:-18},
  {x:18,y:76,rotation:-32}, {x:82,y:76,rotation:32}
];
function journalTools() {
  const figmaIcon='<svg viewBox="0 0 30 44" aria-hidden="true"><path fill="#f24e1e" d="M8 1a7 7 0 0 0 0 14h7V1Z"/><path fill="#ff7262" d="M15 1h7a7 7 0 0 1 0 14h-7Z"/><path fill="#a259ff" d="M8 15a7 7 0 0 0 0 14h7V15Z"/><circle fill="#1abcfe" cx="22" cy="22" r="7"/><path fill="#0acf83" d="M8 29a7 7 0 1 0 7 7v-7Z"/></svg>';
  return `<div class="journal-tool-cloud" aria-label="My design tools">${about.tools.map((tool,i)=>{
    const position=TOOL_POSITIONS[i];
    const colors={figjam:'#66528c',illustrator:'#ffad00',photoshop:'#38aafa',notion:'#272727','claude-code':'#c37e60'};
    // Preserve the toolkit's existing SVG and lettermark artwork as contain-fit images.
    const mark=tool.id==='figma'?figmaIcon:`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><text x="32" y="34" text-anchor="middle" dominant-baseline="middle" font-family="${tool.id==='notion'?'Georgia':'Arial'},sans-serif" font-size="${tool.id==='claude-code'?60:44}" fill="${colors[tool.id]}">${tool.id==='claude-code'?'✳':text(tool.icon)}</text></svg>`;
    const source=`data:image/svg+xml,${encodeURIComponent(mark.replace('<svg viewBox','<svg xmlns="http://www.w3.org/2000/svg" viewBox'))}`;
    return `<div class="journal-tool-position" style="--tool-x:${position.x}%;--tool-y:${position.y}%;--tool-angle:${position.rotation}deg;--tool-enter-delay:${i*80}ms;--tool-exit-delay:${(about.tools.length-1-i)*80}ms;--hover-tilt:${i%2?-3:3}deg"><span class="intro-capsule journal-tool-pill" role="img" aria-label="${text(tool.name)}"><img src="${text(source)}" alt="${text(tool.name)}" width="32" height="32"></span></div>`;
  }).join('')}</div>`;
}

function education() {
  const ed = about.education;
  return `<section class="about-detail-section wrap education-section" aria-labelledby="education-heading"><div class="about-section-heading"><p class="eyebrow">03 / ALWAYS LEARNING</p><h2 id="education-heading">Education</h2></div><div class="education-entry"><span class="education-glyph" aria-hidden="true">↗</span><div><h3>${text(ed.institution)}</h3><p>${text(ed.program)}</p>${ed.dates ? `<p class="education-dates">${text(ed.dates)}</p>` : ''}${ed.details ? `<p>${text(ed.details)}</p>` : ''}</div></div></section>`;
}
await mkdir(`${root}site/about`, {recursive:true});
await writeFile(`${root}site/about/index.html`, `<!doctype html>
<html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>About Emily Dong</title><meta name="description" content="Meet Emily Dong, a University of Michigan student studying User Experience Design and Art and Design."><link rel="icon" href="/favicon.svg" type="image/svg+xml"><link rel="stylesheet" href="/style.css?v=6"><link rel="stylesheet" href="/about.css"><script src="/content.js" defer></script><script src="/shared.js" defer></script>${themeLink}<link rel="stylesheet" href="/about-pills.css"><script src="/vendor/matter/matter.min.js" defer></script><script src="/about-pill-physics.js" defer></script><script src="/about-entry.js" defer></script><script src="/about-pills.js" defer></script><link rel="stylesheet" href="/about-flipbook.css"><script src="/about-flipbook.js" defer></script><script src="/about-journal-tools.js" defer></script></head><body class="about-page" id="top"><a class="skip" href="#main">Skip to content</a>${header}<main id="main">${intro()}${flipbook.replace('<!-- JOURNAL_TOOLS -->',journalTools())}${involvements()}</main>${footer}</body></html>\n`);
console.log('Built /about/ from content.js and the shared homepage shell.');
