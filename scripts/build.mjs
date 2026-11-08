import {readFile,writeFile,cp,mkdir,rm} from 'node:fs/promises';
import {themeLink} from './theme.mjs';
import {createHash} from 'node:crypto';
// Home is hand-authored; secondary pages are generated from the shared shell/content.
const homePath=new URL('../site/index.html',import.meta.url);
let home=await readFile(homePath,'utf8');
const typingRevision=createHash('sha256').update(await readFile(new URL('../site/hero-typewriter.js',import.meta.url))).digest('hex').slice(0,12);
home=home.replace(/src="\/hero-typewriter\.js[^"]*"/,`src="/hero-typewriter.js?v=${typingRevision}"`);
home=home.replace(/<link rel="stylesheet" href="\/?modern\.css[^\"]*">/g,'').replace('</head>',`${themeLink}</head>`);
await writeFile(homePath,home);
for(const name of ['about','work','playground','case-studies'])await import(`./build-${name}.mjs`);
console.log('Updated the shared modern theme on all seven portfolio pages.');

const output=new URL('../dist/',import.meta.url);
await rm(output,{recursive:true,force:true});
await mkdir(output,{recursive:true});
await cp(new URL('../site/',import.meta.url),output,{recursive:true});
console.log('Built the current portfolio into dist/.');
