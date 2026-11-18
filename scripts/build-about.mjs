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
function education() {
  const ed = about.education;
  return `<section class="about-detail-section wrap education-section" aria-labelledby="education-heading"><div class="about-section-heading"><p class="eyebrow">03 / ALWAYS LEARNING</p><h2 id="education-heading">Education</h2></div><div class="education-entry"><span class="education-glyph" aria-hidden="true">↗</span><div><h3>${text(ed.institution)}</h3><p>${text(ed.program)}</p>${ed.dates ? `<p class="education-dates">${text(ed.dates)}</p>` : ''}${ed.details ? `<p>${text(ed.details)}</p>` : ''}</div></div></section>`;
}
await mkdir(`${root}site/about`, {recursive:true});
await writeFile(`${root}site/about/index.html`, `<!doctype html>
<html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>About Emily Dong</title><meta name="description" content="Meet Emily Dong, a University of Michigan student studying User Experience Design and Art and Design."><link rel="icon" href="/favicon.svg" type="image/svg+xml"><link rel="stylesheet" href="/style.css?v=6"><link rel="stylesheet" href="/about.css"><script src="/content.js" defer></script><script src="/shared.js" defer></script>${themeLink}<link rel="stylesheet" href="/about-pills.css"><script src="/vendor/matter/matter.min.js" defer></script><script src="/about-pill-physics.js" defer></script><script src="/about-entry.js" defer></script><script src="/about-pills.js" defer></script><link rel="stylesheet" href="/about-flipbook.css"><script src="/about-flipbook.js" defer></script></head><body class="about-page" id="top"><a class="skip" href="#main">Skip to content</a>${header}<main id="main">${intro()}${flipbook}${involvements()}</main>${footer}</body></html>\n`);
console.log('Built /about/ from content.js and the shared homepage shell.');
