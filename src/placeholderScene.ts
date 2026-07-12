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
export function drawPlaceholderScene(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  t: number,
  progress: number,
  particles: Particle[]
) {
  ctx.clearRect(0, 0, w, h);

  // base wash
  ctx.fillStyle = "#0b0b0d";
  ctx.fillRect(0, 0, w, h);

  // drifting amber glow, position tied to scroll progress
  const gx = w * (0.25 + progress * 0.5) + Math.sin(t * 0.15) * w * 0.06;
  const gy = h * (0.35 + Math.sin(t * 0.1 + progress * 3) * 0.12);
  const glowR = Math.max(w, h) * 0.55;
  const glow = ctx.createRadialGradient(gx, gy, 0, gx, gy, glowR);
  glow.addColorStop(0, `rgba(${AMBER}, 0.16)`);
  glow.addColorStop(0.5, `rgba(${AMBER}, 0.06)`);
  glow.addColorStop(1, `rgba(${AMBER}, 0)`);
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, w, h);

  // secondary bone-white counter glow
  const gx2 = w * (0.75 - progress * 0.4) + Math.cos(t * 0.12) * w * 0.05;
  const gy2 = h * 0.7;
  const glow2 = ctx.createRadialGradient(gx2, gy2, 0, gx2, gy2, glowR * 0.6);
  glow2.addColorStop(0, `rgba(${BONE}, 0.05)`);
  glow2.addColorStop(1, `rgba(${BONE}, 0)`);
  ctx.fillStyle = glow2;
  ctx.fillRect(0, 0, w, h);

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

  // vignette
  const vignette = ctx.createRadialGradient(w / 2, h / 2, Math.min(w, h) * 0.3, w / 2, h / 2, Math.max(w, h) * 0.75);
  vignette.addColorStop(0, "rgba(11,11,13,0)");
  vignette.addColorStop(1, "rgba(11,11,13,0.85)");
  ctx.fillStyle = vignette;
  ctx.fillRect(0, 0, w, h);
}

export function createPlaceholderScene(canvas: HTMLCanvasElement, trigger: string | Element) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return { destroy() {} };

  function resize() {
    const rect = canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    canvas.width = Math.max(1, Math.round(rect.width * dpr));
    canvas.height = Math.max(1, Math.round(rect.height * dpr));
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

  const start = performance.now();
  let raf = 0;
  function tick(now: number) {
    const t = (now - start) / 1000;
    drawPlaceholderScene(ctx!, canvas.width, canvas.height, t, progress, particles);
    raf = requestAnimationFrame(tick);
  }
  raf = requestAnimationFrame(tick);

  return {
    destroy() {
      cancelAnimationFrame(raf);
      st.kill();
      window.removeEventListener("resize", resize);
    },
  };
}
