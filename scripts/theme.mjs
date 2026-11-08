import {readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
const revision=createHash('sha256').update(await readFile(new URL('../site/modern.css',import.meta.url))).digest('hex').slice(0,12);
export const themeLink=`<link rel="stylesheet" href="/modern.css?v=${revision}">`;
