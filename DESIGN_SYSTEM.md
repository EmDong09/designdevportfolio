# Design System Reference

Source of truth: [Figma — designdevportfolio](https://www.figma.com/design/U0ROucMkonvX987FVEWyjs/designdevportfolio?node-id=0-1)

This file is the working reference for design tokens pulled from Figma. Keep it in sync as the Figma file evolves.

## Typography

Three-tier type scale, pulled from the Figma "Headings / Subheadings / Body text" frame (node `1:2`).

| Role | Font Family | Size | Weight | Notes |
|---|---|---|---|---|
| Heading | **Abhaya Libre** | 50px | SemiBold (600) | Serif display font |
| Subheading | **Josefin Sans** | 30px | Regular (400) | Geometric sans |
| Body | **Kokoro** | 18px | Regular (400) | Variable font; axes `CTGR 0, wdth 100` |

### Font sources

- **Abhaya Libre** and **Josefin Sans** are self-hosted via Fontsource (`@fontsource/abhaya-libre`, `@fontsource/josefin-sans`, OFL-1.1), imported in `src/main.tsx`. No requests go to Google Fonts.
- **Kokoro** is not available on Google Fonts or Fontsource, so it is likely only available inside Figma or installed locally there. Until its font files (and license) are supplied, body text falls back to the system sans stack. To enable it, add the `.woff2` files under `src/assets/fonts/`, declare an `@font-face` for `'Kokoro'` in `src/styles/global.css`, and record the license in the README. `--font-body` already lists Kokoro first.

### CSS custom properties

```css
:root {
  --font-heading: 'Abhaya Libre', serif;
  --font-subheading: 'Josefin Sans', sans-serif;
  --font-body: 'Kokoro', system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;

  --size-heading: 50px;
  --size-subheading: 30px;
  --size-body: 18px;

  --weight-heading: 600;
  --weight-subheading: 400;
  --weight-body: 400;
}

h1, h2, .heading {
  font-family: var(--font-heading);
  font-size: var(--size-heading);
  font-weight: var(--weight-heading);
}

h3, .subheading {
  font-family: var(--font-subheading);
  font-size: var(--size-subheading);
  font-weight: var(--weight-subheading);
}

body, p, .body-text {
  font-family: var(--font-body);
  font-size: var(--size-body);
  font-weight: var(--weight-body);
  font-variation-settings: "CTGR" 0, "wdth" 100;
}
```

## Status

- [x] Typography tokens extracted
- [ ] Kokoro font files + license (needed to render the body font on the web)
- [ ] Color tokens (not yet defined in Figma file; the site's palette lives in `src/styles/tokens.css`)
- [ ] Spacing/layout tokens (not yet defined in Figma file)
- [ ] Component specs (not yet defined in Figma file)

_Last synced from Figma: 2026-10-25_
