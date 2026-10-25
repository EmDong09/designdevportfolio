# Emily Dong — Portfolio

A portfolio homepage for Emily Dong (UX Design + Art and Design, University of Michigan), built with React, TypeScript, and Vite.

Design tokens (typography, in particular) are sourced from the project's [Figma file](https://www.figma.com/design/U0ROucMkonvX987FVEWyjs/designdevportfolio) — see [`DESIGN_SYSTEM.md`](./DESIGN_SYSTEM.md).

## Getting started

```bash
npm install
npm run dev       # start the dev server (http://localhost:5173)
npm run build     # type-check and build for production into dist/
npm run preview   # preview the production build locally
npm run lint      # run ESLint
```

## Project structure

```
src/
  content.ts          # all editable copy, project data, and optional contact/resume URLs
  components/          # Header, Hero, SelectedWork, ProjectCard, PreviewDialog,
                        # About, Explorations, Contact, Footer, and their *Art.tsx
                        # original SVG illustrations
  styles/
    tokens.css          # design tokens: color, type scale, spacing, radii, motion
    global.css          # resets, base element styles, shared utility classes
DESIGN_SYSTEM.md       # typography reference pulled from Figma
```

## Replacing placeholder content

Everything editable lives in **`src/content.ts`**, typed so a missing field fails to compile rather than silently rendering a broken link.

- **Projects** — replace entries in the `projects` array. Each needs a `title`, `description`, `overview` (shown in the preview dialog), `tags`, and a `motif` (`'compass' | 'ritual' | 'form'`, used to pick an abstract SVG preview in `ProjectPreviewArt.tsx`). Set `isSample: false` once it's real work, and update or remove `selectedWorkSampleNote` once no samples remain.
- **Artwork** — the hero, project preview, and exploration graphics (`HeroArt.tsx`, `ProjectPreviewArt.tsx`, `ExplorationArt.tsx`) are original inline SVGs built for this project. Swap in real artwork/photography by replacing the component's returned markup, or drop image files into `src/assets/` and reference them — keep `width`/`height` set to avoid layout shift, and add real `alt` text if the image becomes meaningful content rather than decoration.
- **Resume** — set `resumeUrl` in `content.ts` to a real URL once one exists; the nav link appears automatically. Leave it `undefined` until then.
- **Contact** — set `contact.email` and/or `contact.linkedin` in `content.ts`. While both are `undefined`, the Contact section shows `comingSoonMessage` instead of a dead link.
- **Explorations** — replace the three `explorations` entries with real artwork once available; update or remove the "Placeholder visual study" label per item as it stops applying.

- **Body font (Kokoro)** — specified in Figma but not published on Google Fonts or Fontsource, so it isn't bundled. Body text uses the system sans until the font files are added; see `DESIGN_SYSTEM.md` → *Font sources* for the steps.

## Licenses / third-party assets

- **Fonts**: Abhaya Libre and Josefin Sans, self-hosted via [Fontsource](https://fontsource.org) npm packages; both are SIL Open Font License 1.1. No font requests go to third-party servers.
- **Artwork**: all illustration in this project (hero composition, project previews, exploration studies, favicon) is original inline SVG authored for this project — no third-party images or assets are used.

## Verification notes

- `npm run build` (TypeScript project build + Vite build) and `npm run lint` both pass cleanly.
- Checked with Playwright at 320px, 375px, 768px, and 1440px viewport widths — no horizontal overflow at any size, no console errors, no external network requests.
- Every in-page anchor (`#top`, `#main-content`, `#work`, `#about`, `#contact`) resolves to an element; no `#` placeholder links.
- Keyboard-tested: skip link (hidden until focused), tab order, visible focus, and the project preview dialog (focus moves to the close button on open and stays inside while open; Escape, the close button, and a backdrop click all close it and return focus to its trigger).
- Verified `prefers-reduced-motion: reduce` disables transitions and smooth scrolling.
- axe-core (WCAG 2.0/2.1/2.2 A + AA and best-practice rules): 0 violations. Axe could only leave the decorative "Aa" glyph inside a hidden SVG undecided for contrast.
- Checked text/background color pairs against WCAG 2.2 AA (4.5:1 text, 3:1 UI boundaries) using a contrast calculator; all pass.
- These checks are automated and manual spot checks, not a formal accessibility audit or certification.
- Browsing the visual-inspiration reference (belleduffner.com) was not available in this environment, so the design direction was implemented from the written brief alone, not a direct visual review of that site.

## What Emily still needs to supply

- Real project case studies to replace the three labeled sample projects.
- Real artwork for the "Art & explorations" gallery, if the abstract placeholder studies aren't meant to stay.
- An email address and/or LinkedIn URL for the Contact section.
- A resume file or link, if one should appear in the nav.
- Kokoro font files and their license, if the Figma body font should render on the web.
