import {themeLink} from './theme.mjs';
import {readFile, writeFile, mkdir} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import vm from 'node:vm';
const root = fileURLToPath(new URL('../', import.meta.url));
const context = {window:{}};
vm.runInNewContext(await readFile(`${root}site/content.js`, 'utf8'), context);
const {work} = context.window.portfolioContent;
const text = value => String(value).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const home = await readFile(`${root}site/index.html`, 'utf8');
const header = home.match(/<header\b[\s\S]*?<\/header>/)[0]
  .replace('href="#top"', 'href="/"').replace('Emily Dong, back to top','Emily Dong, home')
  .replace('href="/work/"', 'href="/work/" aria-current="page"')
  .replace('href="#contact"', 'href="/#contact"');
const footer = home.match(/<footer\b[\s\S]*?<\/footer>/)[0];
const contact = home.match(/<section class="contact\b[\s\S]*?<\/section>/)[0];
const dialog = home.match(/<dialog\b[\s\S]*?<\/dialog>/)[0];
await mkdir(`${root}site/work`, {recursive:true});
await writeFile(`${root}site/work/index.html`, `<!doctype html>
<html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Work — Emily Dong</title><meta name="description" content="Explore sample concepts in user experience, interface design, and visual expression in Emily Dong’s portfolio."><link rel="icon" href="/favicon.svg" type="image/svg+xml"><link rel="stylesheet" href="/style.css?v=6"><link rel="stylesheet" href="/work.css"><script src="/content.js" defer></script><script src="/project-art.js" defer></script><script src="/app.js" defer></script><script src="/shared.js" defer></script>${themeLink}</head><body class="work-page" id="top"><a class="skip" href="#main">Skip to content</a>${header}<main id="main"><section class="work-intro wrap" aria-labelledby="work-heading"><p class="eyebrow">${text(work.eyebrow)}</p><div class="work-intro-grid"><div><h1 id="work-heading">${text(work.title).replace('into form.', 'into<br><span class="serif">form.</span>')}</h1><p class="work-introduction">${text(work.description)}</p></div><div class="work-margin"><span class="work-mark" aria-hidden="true">✳</span><p class="eyebrow">THINKING, MAKING,<br>AND EVERYTHING BETWEEN.</p><ul>${work.disciplines.map(item=>`<li>${text(item)}</li>`).join('')}</ul><a class="work-jump" href="#projects-heading">Explore the collection <span aria-hidden="true">↓</span></a></div></div></section><section class="work-collection wrap" aria-labelledby="projects-heading"><div class="collection-toolbar"><h2 id="projects-heading">Selected <span class="serif">concepts.</span></h2><div class="filters" role="group" aria-label="Filter sample projects"><button class="active" data-filter="all" aria-pressed="true">All work</button><button data-filter="digital" aria-pressed="false">Digital</button><button data-filter="visual" aria-pressed="false">Visual</button></div></div><div class="collection-status"><p class="sample-note">${text(work.sampleNotice)}</p><p id="project-count" role="status" aria-live="polite"></p></div><div id="projects" class="project-grid"></div><noscript><p>Enable JavaScript to explore the interactive sample projects: Campus Compass, Everyday Rituals, and Form &amp; Feeling.</p></noscript></section><aside class="work-next wrap" aria-label="Learn more about Emily"><div><p class="eyebrow">BEHIND THE WORK</p><p>A little context.<br><span class="serif">A little about me.</span></p></div><a class="text-link" href="/about/">Meet Emily <span aria-hidden="true">↗</span></a></aside>${contact}</main>${footer}${dialog}</body></html>\n`);
console.log('Built /work/ with shared portfolio layout and project interactions.');
