// Keep image slots explicit until the corresponding process images are supplied.
export function renderAspectDesign(sections, escape) {
 const placeholder = label => `<figure class="aspect-design-image"><div class="aspect-image-slot" role="img" aria-label="${escape(label)} — image to be added"><span>Image to be added</span></div><figcaption>${escape(label)}</figcaption></figure>`;
 const comparison = label => `<div class="aspect-comparison" role="group" aria-label="${escape(label)} before and after">${placeholder(`Before · ${label}`)}${placeholder(`After · ${label}`)}</div>`;
 const renderBlock = (section, showHeading = true) => `<div class="aspect-design-block">${showHeading ? `<h4>${escape(section.title)}</h4>` : ''}${section.text ? `<p>${escape(section.text)}</p>` : ''}${section.items ? `<ul>${section.items.map(item=>`<li>${escape(item)}</li>`).join('')}</ul>` : ''}${section.images ? `<div class="aspect-input-images">${section.images.map(placeholder).join('')}</div>` : ''}${section.comparison ? comparison(section.comparison) : ''}${section.feedback ? `<div class="aspect-feedback">${section.feedback.map(item=>`<article><h5>${escape(item.title)}</h5><p>${escape(item.text)}</p>${comparison(item.comparison)}</article>`).join('')}</div>` : ''}${section.principles ? `<div class="aspect-principles">${section.principles.map(item=>`<article><h4>${escape(item.title)}</h4>${item.text ? `<p>${escape(item.text)}</p>` : ''}${item.colors ? `<ul class="aspect-color-key">${item.colors.map(color=>`<li><span class="aspect-color-swatch" style="--swatch:${color.color}" aria-hidden="true"></span><span><strong>${escape(color.name)}</strong> — ${escape(color.meaning)}</span></li>`).join('')}</ul>` : ''}</article>`).join('')}</div>` : ''}</div>`;
 const groups = [
  {id:'design-starting-point', title:'Starting Point', blocks:sections.slice(0,3)},
  {id:'design-iterations', title:'Iterations', blocks:sections.slice(3,6)},
  {id:'design-principles', title:'Design Principles', blocks:sections.slice(6), hideBlockHeading:true}
 ];
 return `<div class="aspect-design-process">${groups.map(group=>`<div id="${group.id}" class="aspect-design-group" role="region" aria-labelledby="${group.id}-title"><h3 id="${group.id}-title">${group.title}</h3>${group.blocks.map(block=>renderBlock(block,!group.hideBlockHeading)).join('')}</div>`).join('')}</div>`;
}
