# Sahil Rashid — Cinematic 3D-Scroll Portfolio

**Live:** https://sahilrashid10.github.io/AINotion/

A scroll-driven personal portfolio for Sahil Rashid, Data Engineer (Power BI, ETL Pipelines & Business Intelligence). Near-black `#0B0B0D`, warm amber `#FF7A18`, bone-white `#ECE7DF`, huge condensed display type, film grain, and scrub-pinned cinematic sequences on every section.

## Signature moment

A Three.js holographic terminal in the hero that **unfolds and rotates in 3D driven directly by scroll**, with a live code-screen texture, amber wireframe edges, particles, and bloom — composited over a scroll-scrubbed background clip.

## Stack

- [Vite](https://vite.dev) + TypeScript (no framework)
- [Lenis](https://lenis.darkroom.engineering/) smooth scroll bridged into GSAP
- [GSAP ScrollTrigger](https://gsap.com/scrolltrigger/) — every section scrub-pinned
- [Three.js](https://threejs.org) hero centerpiece (lazy-loaded chunk)

## Develop

```bash
npm install
npm run dev      # http://localhost:5173/AINotion/
npm run build    # production build in dist/
```

## Deployment

Pushes to `main` auto-deploy to GitHub Pages via `.github/workflows/deploy-pages.yml`.

## Section background clips

Each video section resolves its source as: **`.mp4` → `.webm` → animated canvas scene**. The repo ships with synthesized `.webm` placeholder clips; drop real footage into `public/video/` as `.mp4` with the same basenames and it takes priority automatically. See [`public/video/README.md`](public/video/README.md). Placeholders can be regenerated with `node scripts/genclips.mjs`.

## Performance notes

- Initial JS ~144 KB (54 KB gzip); Three.js loads as an async chunk
- All canvas loops pause off-screen (IntersectionObserver)
- The hero terminal adapts quality (bloom → resolution) to measured FPS
- Fonts load non-blocking; ScrollTrigger refreshes on `document.fonts.ready`
- `prefers-reduced-motion` gets native scrolling with no grain
