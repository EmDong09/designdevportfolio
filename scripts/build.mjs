import {headerFor} from './header.mjs';
import {readFile,writeFile,cp,mkdir,rm,readdir} from 'node:fs/promises';
import {themeLink} from './theme.mjs';
import {createHash} from 'node:crypto';
// Home is hand-authored; secondary pages are generated from the shared shell/content.
const homePath=new URL('../site/index.html',import.meta.url);
let home=await readFile(homePath,'utf8');
home=home.replace(/<header\b[\s\S]*?<\/header>/,headerFor('work'));
const footer=await readFile(new URL('./templates/shared-footer.html',import.meta.url),'utf8');
home=/<footer\b/.test(home)?home.replace(/<footer\b[\s\S]*?<\/footer>/,footer):home.replace('</main>',`</main>${footer}`);
const typingRevision=createHash('sha256').update(await readFile(new URL('../site/hero-typewriter.js',import.meta.url))).digest('hex').slice(0,12);
home=home.replace(/src="\/hero-typewriter\.js[^"]*"/,`src="/hero-typewriter.js?v=${typingRevision}"`);
home=home.replace(/<link rel="stylesheet" href="\/?modern\.css[^\"]*">/g,'').replace('</head>',`${themeLink}</head>`);
await writeFile(homePath,home);
for(const name of ['about','work','playground','case-studies'])await import(`./build-${name}.mjs`);
console.log('Updated the shared modern theme across the portfolio.');

// Version all local scripts and styles so removed project data cannot stay cached.
const source=new URL('../site/',import.meta.url);
const revisions=new Map();
for(const relative of await readdir(source,{recursive:true})){
 if(!relative.endsWith('.html'))continue;
 const file=new URL(relative,source);
 let html=await readFile(file,'utf8');
 const assets=[...html.matchAll(/(<(?:script|link)\b[^>]*?\b(?:src|href)=")([^"]+)(")/g)];
 for(const match of assets){
  if(/^(?:[a-z]+:|\/\/)/i.test(match[2]))continue;
  const asset=new URL(match[2],`https://portfolio.invalid/${relative}`);
  if(!/\.(?:js|css)$/.test(asset.pathname))continue;
  if(!revisions.has(asset.pathname))revisions.set(asset.pathname,createHash('sha256').update(await readFile(new URL('.'+asset.pathname,source))).digest('hex').slice(0,12));
  html=html.replace(match[0],`${match[1]}${asset.pathname}?v=${revisions.get(asset.pathname)}${match[3]}`);
 }
 await writeFile(file,html);
}

const output=new URL('../dist/',import.meta.url);
await rm(output,{recursive:true,force:true});
await mkdir(output,{recursive:true});
await cp(new URL('../site/',import.meta.url),output,{recursive:true});
console.log('Built the current portfolio into dist/.');
