import {readFile} from 'node:fs/promises';
const template=(await readFile(new URL('./templates/shared-header.html',import.meta.url),'utf8')).trim();
export function headerFor(section){
 const destination={work:'/#work',playground:'/playground/',about:'/about/'}[section];
 return destination?template.replace(`href="${destination}"`,`href="${destination}" aria-current="page"`):template;
}
