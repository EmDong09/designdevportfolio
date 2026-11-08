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
const contact=await readFile(`${root}scripts/templates/shared-contact.html`,'utf8');
function image(item, index) {
  if (!item) return '';
  const source = url(item.src);
  return `<figure class="about-image about-image-${index}">${source
    ? `<img src="${source}" alt="${text(item.alt)}" width="${item.width}" height="${item.height}" ${index ? 'loading="lazy"' : 'fetchpriority="high"'} decoding="async">`
    : `<div class="image-placeholder placeholder-${index}" aria-hidden="true"><span class="placeholder-frame"></span><span class="placeholder-form"></span><span class="placeholder-spark">✳</span><span class="placeholder-index">${index ? '02 / PROCESS' : '01 / PORTRAIT'}</span></div>`}<figcaption>${text(item.caption)}</figcaption></figure>`;
}
function intro() {
  return `<section class="about-intro wrap" aria-labelledby="about-heading"><div class="intro-copy"><p class="eyebrow">THE PERSON BEHIND THE PIXELS</p><h1 id="about-heading">${text(about.title).replace('about me', '<span class="serif">about me.</span>')}</h1><p class="about-lead">${text(about.lead)}</p><div class="intro-paragraphs">${about.paragraphs.map(p => `<p>${text(p)}</p>`).join('')}</div>${about.placeholderNotice ? `<p class="page-notice"><span aria-hidden="true">✳</span>${text(about.placeholderNotice)}</p>` : ''}</div><div class="about-images">${about.images.map(image).join('')}</div></section>`;
}
function faqs() {
  return `<section class="about-detail-section wrap" aria-labelledby="faq-heading"><div class="about-section-heading"><p class="eyebrow">01 / A FEW MORE THINGS</p><h2 id="faq-heading">More <span class="serif">about me.</span></h2><p>Questions, curiosities,<br>and a little context.</p></div><div class="faq-list">${about.faqs.map((faq, i) => `<details id="faq-${text(faq.id)}"${i === 0 ? ' open' : ''}><summary>${text(faq.question)}<span class="faq-indicator" aria-hidden="true"></span></summary><p>${text(faq.answer)}</p></details>`).join('')}</div></section>`;
}
function tools() {
  return `<section class="about-detail-section wrap" aria-labelledby="tools-heading"><div class="about-section-heading"><p class="eyebrow">02 / THE TOOLKIT</p><h2 id="tools-heading">Tools powering <br><span class="serif">my work</span></h2>${about.sampleToolkit ? '<p class="toolkit-note">Sample toolkit — being personalized.</p>' : ''}</div><ul class="tool-list">${about.tools.map(tool => `<li><span class="tool-icon" aria-hidden="true">${text(tool.icon || tool.name.slice(0, 2))}</span><div class="tool-description"><h3>${tool.url ? `<a href="${url(tool.url)}">${text(tool.name)} <span aria-hidden="true">↗</span></a>` : text(tool.name)}</h3><p>${text(tool.description)}</p></div><span class="tool-category">${text(tool.category)}</span></li>`).join('')}</ul></section>`;
}
function education() {
  const ed = about.education;
  return `<section class="about-detail-section wrap education-section" aria-labelledby="education-heading"><div class="about-section-heading"><p class="eyebrow">03 / ALWAYS LEARNING</p><h2 id="education-heading">Education</h2></div><div class="education-entry"><span class="education-glyph" aria-hidden="true">↗</span><div><h3>${text(ed.institution)}</h3><p>${text(ed.program)}</p>${ed.dates ? `<p class="education-dates">${text(ed.dates)}</p>` : ''}${ed.details ? `<p>${text(ed.details)}</p>` : ''}</div></div></section>`;
}
await mkdir(`${root}site/about`, {recursive:true});
await writeFile(`${root}site/about/index.html`, `<!doctype html>
<html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>About Emily Dong</title><meta name="description" content="Meet Emily Dong, a University of Michigan student studying User Experience Design and Art and Design."><link rel="icon" href="/favicon.svg" type="image/svg+xml"><link rel="stylesheet" href="/style.css?v=6"><link rel="stylesheet" href="/about.css"><script src="/content.js" defer></script><script src="/shared.js" defer></script>${themeLink}</head><body class="about-page" id="top"><a class="skip" href="#main">Skip to content</a>${header}<main id="main">${intro()}${faqs()}${tools()}${education()}<section class="about-closing wrap"><p>${text(about.closing)}</p><a class="primary" href="/#work">Explore my work</a></section>${contact}</main>${footer}</body></html>\n`);
console.log('Built /about/ from content.js and the shared homepage shell.');
