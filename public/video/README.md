# Section background clips

The `.webm` files here are **synthesized placeholder clips** (canvas-rendered, 8s, 720p, dense keyframes for smooth scroll-scrubbing). They demo the full video pipeline until the real Higgsfield Seedance 2.0 footage exists.

## Swapping in your real clips

Drop your real clips in this folder as **`.mp4`** with these exact names — they take priority over the `.webm` placeholders automatically, zero code changes:

- `hero-terminal-boot.mp4` — HERO: terminal boot (hero section)
- `the-builder.mp4` — THE BUILDER (experience section)
- `the-teacher.mp4` — THE TEACHER (portfolio section)
- `the-closer.mp4` — THE CLOSER (contact section)

Recommended: 1080p, 16:9, H.264, ~8s, no audio. For buttery scrubbing, encode with frequent keyframes, e.g.:

```
ffmpeg -i input.mp4 -c:v libx264 -crf 21 -g 12 -pix_fmt yuv420p -an hero-terminal-boot.mp4
```

Load order per section: `.mp4` (yours) → `.webm` (placeholder) → animated canvas scene.
