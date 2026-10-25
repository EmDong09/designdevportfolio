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

### Google Fonts import

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Abhaya+Libre:wght@600&family=Josefin+Sans:wght@400&family=Kokoro&display=swap" rel="stylesheet">
```

### CSS custom properties

```css
:root {
  --font-heading: 'Abhaya Libre', serif;
  --font-subheading: 'Josefin Sans', sans-serif;
  --font-body: 'Kokoro', sans-serif;

  --size-heading: 50px;
  --size-subheading: 30px;
  --size-body: 18px;

  --weight-heading: 600;
  --weight-subheading: 400;
  --weight-body: 400;
}

h1, .heading {
  font-family: var(--font-heading);
  font-size: var(--size-heading);
  font-weight: var(--weight-heading);
}

h2, .subheading {
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
- [ ] Color tokens (not yet defined in Figma file)
- [ ] Spacing/layout tokens (not yet defined in Figma file)
- [ ] Component specs (not yet defined in Figma file)

_Last synced from Figma: 2026-10-25_
