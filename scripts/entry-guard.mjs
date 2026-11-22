// Establish entrance visibility before the browser can paint page content.
export function entryGuard(page){
 const about=page==='about';
 const classes=about?'about-entry-boot':'play-entry-boot play-layout-boot';
 const selectors=about?'.about-entry-boot #about-heading,.about-entry-boot .about-lead,.about-entry-boot .intro-paragraphs p,.about-entry-boot .life-journal,.about-entry-boot .campus-section,.about-entry-boot .about-page>footer':'.play-entry-boot #play-title,.play-entry-boot .arc-controls';
 return `<script>document.documentElement.classList.add(...${JSON.stringify(classes.split(' '))});window.addEventListener('load',()=>document.documentElement.classList.remove(...${JSON.stringify(classes.split(' '))}),{once:true});</script><style>@media(prefers-reduced-motion:no-preference){${selectors}{opacity:0!important;transition:none!important}}${about?'':'.play-layout-boot .arc-viewport{visibility:hidden}'}</style>`;
}
