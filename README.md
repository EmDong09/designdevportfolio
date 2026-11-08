# Emily Dong — portfolio

The current portfolio for Emily Dong, a University of Michigan student studying User Experience Design + Art and Design. It includes Home, Work, Playground, About, and three dedicated sample case-study pages.

This version uses HTML, CSS, and JavaScript with original SVG/CSS artwork. It has no runtime or development dependencies. The earlier React application has been removed from the current source tree.

## Preview and build

Requires Node.js 20 or newer. No dependency installation is needed.

```sh
npm run dev
# Open http://127.0.0.1:5173/

npm run build
# Regenerates pages and copies the finished site to dist/

npm run preview
# Serves the production build from dist/
```

To choose another port: `npm run dev -- --port 5174` or `npm run preview -- --port 5174`.

The preview is local to your computer. These commands and GitHub pushes do not publish the site. Stop the preview with Ctrl+C. A future static host should serve the contents of `dist/`, with directory index support for direct route loading.

## Source structure

- `site/index.html`: editable homepage and shared navigation/contact/footer shell.
- `site/content.js`: editable identity, sample projects, About copy, FAQs, tools, case-study narratives/metadata, and Playground studies. Optional contact and resume destinations remain empty until real details are supplied.
- `site/modern.css`: shared modern visual theme, loaded after structural styles. Includes reduced card radii, black pill buttons, centered serif headings, and hover tilts for the hero pills.
- `site/style.css`: shared structure and original artwork styling.
- `site/hero-typewriter.js`: headline entrance. Text types at a continuous pace, then the pills fade and expand into the lines; reduced-motion preferences skip the animation.
- `site/project-art.js` and `site/app.js`: shared artwork, project links, filters, and homepage study dialogs.
- `site/about.css`, `site/work.css`, `site/playground.css`, and `site/case-study.css`: page-specific structure.
- `scripts/build-*.mjs`: generators for About, Work, Playground, and case-study pages.
- `scripts/templates/playground-experiments.html`: interactive panels for the gallery previews.
- `scripts/serve.mjs`: local-only development and production preview server.

After editing shared copy, navigation, templates, or styles, run `npm run build` to update all generated pages and their stylesheet/script revisions. Do not edit generated secondary-page HTML directly.

## Routes and interactions

- `/`: landing page, selected work and visual studies.
- `/work/`: filterable project collection.
- `/playground/`: masonry gallery with filters and accessible enlarged previews.
- `/about/`: introduction, independent native FAQ accordions, sample toolkit, and education.
- `/work/campus-compass/`, `/work/everyday-rituals/`, `/work/form-and-feeling/`: sample case studies, project metadata, section-title sidebar, interactive concept demonstrations, and related projects.

The top navigation scrolls offscreen. Case-study section navigation enters beside the introduction and stays fixed thereafter; mobile layouts use labeled tabs. Its Back link aligns with the section text. Projects open full pages rather than project dialogs.

## Replacing placeholders

Projects, toolkit entries, biography filler, artwork and case-study narratives are explicitly samples or placeholders. Replace them with real work before removing their labels. No research results, employment, awards, dates, team members, tools used, or contact details have been invented. Missing team/tool/timeline metadata displays “To be added.” Gallery artwork is original placeholder art, not a claim of Emily’s submitted work.

To add real artwork, put local files under `site/`, provide accurate alt text and intrinsic dimensions, and update the relevant content or generator. Keep optional URLs absent until genuine destinations exist. All demo inputs/settings remain in the browser and are not saved or submitted.

## Assets and verification

Artwork is original CSS/SVG. Display fonts use local Bodoni/Didot with serif fallbacks; body fonts use a system sans stack. No reference-site photos, portraits, logos, font downloads, or third-party media are included.

The broad design references were belleduffner.com, jessicahsu.design/about, and a user-supplied landing-page image. Their assets and copy were not reproduced.

Build and JavaScript syntax checks pass. Local route and asset checks cover all seven pages. Sidebar state was checked in code for its reveal, section selection, footer and mobile behavior. Visual/keyboard browser and viewport QA remain unverified because local browser-agent access was blocked by a saved permission setting; these checks are not an accessibility certification.
