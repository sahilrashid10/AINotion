import { ScrollTrigger } from "gsap/ScrollTrigger";

const AMBER = "255, 122, 24";
const BONE = "236, 231, 223";

interface Particle {
  x: number;
  y: number;
  r: number;
  speed: number;
  alpha: number;
}

/**
 * Cinematic ambient placeholder — an amber holographic glow field with a
 * drifting data-grid horizon and particles, scroll-progress driven. Stands
 * in for the Higgsfield clip behind a section until real footage is dropped
 * into /public/video (same canvas, same scrub pipeline).
 */
function buildGlowSprite(rgb: string, coreAlpha: number, midAlpha: number): HTMLCanvasElement {
  const size = 256;
  const c = document.createElement("canvas");
  c.width = size;
  c.height = size;
  const gctx = c.getContext("2d")!;
  const grad = gctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  grad.addColorStop(0, `rgba(${rgb}, ${coreAlpha})`);
  grad.addColorStop(0.5, `rgba(${rgb}, ${midAlpha})`);
  grad.addColorStop(1, `rgba(${rgb}, 0)`);
  gctx.fillStyle = grad;
  gctx.fillRect(0, 0, size, size);
  return c;
}

const amberGlow = buildGlowSprite(AMBER, 0.16, 0.06);
const boneGlow = buildGlowSprite(BONE, 0.05, 0.02);

export function drawPlaceholderScene(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  t: number,
  progress: number,
  particles: Particle[],
  vignette?: HTMLCanvasElement
) {
  // base wash
  ctx.fillStyle = "#0b0b0d";
  ctx.fillRect(0, 0, w, h);

  // drifting glows, position tied to scroll progress — pre-rendered sprites
  // blitted at size instead of building radial gradients every frame
  const gx = w * (0.25 + progress * 0.5) + Math.sin(t * 0.15) * w * 0.06;
  const gy = h * (0.35 + Math.sin(t * 0.1 + progress * 3) * 0.12);
  const glowR = Math.max(w, h) * 0.55;
  ctx.drawImage(amberGlow, gx - glowR, gy - glowR, glowR * 2, glowR * 2);

  const gx2 = w * (0.75 - progress * 0.4) + Math.cos(t * 0.12) * w * 0.05;
  const gy2 = h * 0.7;
  const glowR2 = glowR * 0.6;
  ctx.drawImage(boneGlow, gx2 - glowR2, gy2 - glowR2, glowR2 * 2, glowR2 * 2);

  // perspective data-grid horizon
  ctx.save();
  ctx.strokeStyle = `rgba(${AMBER}, 0.14)`;
  ctx.lineWidth = 1;
  const horizonY = h * (0.62 + Math.sin(progress * Math.PI) * 0.04);
  const vanishX = w * 0.5;
  for (let i = -6; i <= 6; i++) {
    const xOffset = i * (w * 0.09) + ((t * 12) % (w * 0.09));
    ctx.beginPath();
    ctx.moveTo(vanishX + xOffset * 0.06, horizonY);
    ctx.lineTo(vanishX + xOffset, h);
    ctx.stroke();
  }
  for (let j = 1; j <= 5; j++) {
    const ly = horizonY + (h - horizonY) * (j / 5) ** 1.6;
    ctx.beginPath();
    ctx.moveTo(0, ly);
    ctx.lineTo(w, ly);
    ctx.globalAlpha = 0.5;
    ctx.stroke();
    ctx.globalAlpha = 1;
  }
  ctx.restore();

  // floating particles
  for (const p of particles) {
    p.y -= p.speed;
    if (p.y < -10) {
      p.y = h + 10;
      p.x = Math.random() * w;
    }
    ctx.beginPath();
    ctx.fillStyle = `rgba(${AMBER}, ${p.alpha})`;
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fill();
  }

  // vignette (pre-rendered once per resize when provided)
  if (vignette) {
    ctx.drawImage(vignette, 0, 0);
  } else {
    const grad = ctx.createRadialGradient(w / 2, h / 2, Math.min(w, h) * 0.3, w / 2, h / 2, Math.max(w, h) * 0.75);
    grad.addColorStop(0, "rgba(11,11,13,0)");
    grad.addColorStop(1, "rgba(11,11,13,0.85)");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);
  }
}

function buildVignette(w: number, h: number): HTMLCanvasElement {
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  const vctx = c.getContext("2d")!;
  const grad = vctx.createRadialGradient(w / 2, h / 2, Math.min(w, h) * 0.3, w / 2, h / 2, Math.max(w, h) * 0.75);
  grad.addColorStop(0, "rgba(11,11,13,0)");
  grad.addColorStop(1, "rgba(11,11,13,0.85)");
  vctx.fillStyle = grad;
  vctx.fillRect(0, 0, w, h);
  return c;
}

export function createPlaceholderScene(canvas: HTMLCanvasElement, trigger: string | Element) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return { destroy() {} };

  let vignette: HTMLCanvasElement | undefined;

  function resize() {
    const rect = canvas.getBoundingClientRect();
    // ambient background behind a dark scrim — soft glows upscale invisibly,
    // and rendering ~5x fewer pixels keeps the gradient fills cheap
    canvas.width = Math.max(1, Math.round(rect.width * 0.45));
    canvas.height = Math.max(1, Math.round(rect.height * 0.45));
    vignette = buildVignette(canvas.width, canvas.height);
  }
  resize();
  window.addEventListener("resize", resize);

  const particles: Particle[] = Array.from({ length: 60 }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    r: Math.random() * 1.6 + 0.4,
    speed: Math.random() * 0.35 + 0.08,
    alpha: Math.random() * 0.5 + 0.15,
  }));

  let progress = 0;
  const st = ScrollTrigger.create({
    trigger,
    start: "top bottom",
    end: "bottom top",
    onUpdate: (self) => {
      progress = self.progress;
    },
  });

  // render only while the canvas is actually on screen
  let visible = false;
  const io = new IntersectionObserver((entries) => {
    visible = entries[0]?.isIntersecting ?? false;
  });
  io.observe(canvas);

  const start = performance.now();
  let raf = 0;
  let last = 0;
  const frameInterval = 1000 / 30;
  function tick(now: number) {
    raf = requestAnimationFrame(tick);
    if (!visible || now - last < frameInterval) return;
    last = now;
    const t = (now - start) / 1000;
    drawPlaceholderScene(ctx!, canvas.width, canvas.height, t, progress, particles, vignette);
  }
  raf = requestAnimationFrame(tick);

  return {
    destroy() {
      cancelAnimationFrame(raf);
      st.kill();
      io.disconnect();
      window.removeEventListener("resize", resize);
    },
  };
}
