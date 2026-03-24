# DEEMS — Digital Zine Archive

A web-based zine gallery featuring 3D spinning zine objects, an interactive tornado text landing page, and a full-page reader with magazine-style spread view.

**Live site:** [it-143.github.io/zine-press](https://it-143.github.io/zine-press/)

---

## Overview

DEEMS is an independent digital zine archive built as a single static site hosted on GitHub Pages. The project combines several visual and interactive elements:
![Tornado](screenshots/tornado.gif)
- **Tornado Landing Page** — An animated canvas of words (Discover, Envision, Experiment, Metaphor, Synthesis, DEEMS) spiraling in a 3D funnel shape. Hover to highlight, click to zoom, click again to navigate into different sections of the site.
![Zine Rack](screenshots/zinerack.gif)
- **3D Zine Gallery** — Nine volumes of DEEMS displayed as spinning 3D objects built with Three.js. Each zine has its actual front and back cover art mapped as textures. The renderer uses a low pixel ratio for a pixelated aesthetic with CRT-style scanlines.
![Cover Shot](screenshots/covershot.png)
- **Magazine Reader** — Click any zine to open a full-screen reader. On desktop, interior pages display as two-page spreads like an open magazine. On mobile, pages show one at a time with swipe-to-flip support. All pages render crisp and clear, contrasting the pixelated gallery behind.
![Zine Spread](screenshots/zinespread.png)
- **Breathing Background** — A canvas-based gradient made of drifting color blobs that expand and contract on sine waves, rendered in chunky pixel blocks.
![Dropdown](screenshots/dropdown.png)
- **Dropdown Navigation** — A minimal "DEEMS is [select]" dropdown in the corner of the landing page, inspired by yungjake.com.

## Site Structure

```
zine-press/
├── index.html          # Tornado landing page
├── zines.html          # 3D zine gallery + reader
├── style.css           # Gallery and reader styles
├── app.js              # Three.js scene, interaction, reader logic
├── images.js           # Base64-encoded cover textures for 3D objects
├── images/
│   └── vol1/           # Full-quality page images for Vol 1
│       ├── front.jpg
│       ├── page1.jpg
│       ├── page2.jpg
│       ├── ...
│       ├── page22.jpg
│       └── back.jpg
├── discover.html       # Placeholder pages
├── envision.html
├── experiment.html
├── metaphor.html
├── synthesis.html
└── contact.html
```

## Tech Stack

- **Three.js (r128)** — 3D zine rendering via CDN
- **Canvas API** — Breathing gradient background, tornado text animation, procedural textures
- **Vanilla JavaScript** — No frameworks, no build step
- **GitHub Pages** — Static hosting

## Adding Pages to a Volume

1. Export your zine pages as JPGs (~800px wide, ~80% JPEG quality, aim for 100-250KB each)
2. Name them: `front.jpg`, `page1.jpg`, `page2.jpg`, ..., `back.jpg`
3. Create a folder `images/volX/` in the repo and upload the JPGs
4. In `app.js`, find the volume in the `ZINES` array and add a `pages` property:

```js
{ id:2, title:"DEEMS Vol.2", ..., frontImg:F2, backImg:B2,
  pages: [
    'images/vol2/front.jpg',
    'images/vol2/page1.jpg',
    'images/vol2/page2.jpg',
    // ...
    'images/vol2/back.jpg'
  ] },
```

5. Push to GitHub — the reader will automatically show all pages with spread view on desktop and single-page view on mobile.

Volumes without a `pages` array will still display their front and back covers in the reader.

## Responsive Behavior

- **Desktop (600px+):** 3×3 grid of spinning zines, two-page spread reader
- **Mobile (<600px):** 2-column grid with larger zines, single-page reader with swipe navigation, touch-to-tap support

## Key Design Decisions

- **Pixelated 3D, crisp reader:** The gallery deliberately renders at a low pixel ratio (0.4) with `image-rendering: pixelated` for a lo-fi aesthetic. The reader switches to `image-rendering: auto` so pages are sharp and readable.
- **Projection-based click detection:** Three.js raycasting breaks with low pixel ratios, so click detection projects 3D positions to screen coordinates and checks proximity instead.
- **Self-contained:** Cover textures are base64-encoded in `images.js` so the 3D gallery works without any image loading. Interior pages load from the `images/` folder on demand.

---

Built with Claude.
