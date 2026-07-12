import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { createPlaceholderScene } from "./placeholderScene";

gsap.registerPlugin(ScrollTrigger);

interface ScrubOptions {
  src: string;
  canvas: HTMLCanvasElement;
  trigger: string | Element;
  start?: string;
  end?: string;
  scrub?: number | boolean;
}

/**
 * Draws a <video> element's decoded frame onto a canvas, with currentTime
 * driven directly by ScrollTrigger progress — a scroll-scrubbed frame sequence
 * without needing to extract individual image frames. Falls back to an
 * animated placeholder scene on the same canvas if the clip fails to load
 * (e.g. not generated yet), so dropping a real mp4 into /public/video later
 * requires no code changes.
 */
export function createScrollScrubVideo(opts: ScrubOptions) {
  const { src, canvas, trigger, start = "top bottom", end = "bottom top", scrub = 0.4 } = opts;

  const ctx = canvas.getContext("2d");
  const video = document.createElement("video");
  video.src = src;
  video.muted = true;
  video.playsInline = true;
  video.preload = "auto";
  video.crossOrigin = "anonymous";

  let ready = false;
  let usingPlaceholder = false;
  let raf = 0;
  let st: ScrollTrigger | null = null;
  let placeholder: { destroy(): void } | null = null;
  let fallbackTimer = 0;

  function resize() {
    const rect = canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.max(1, Math.round(rect.width * dpr));
    canvas.height = Math.max(1, Math.round(rect.height * dpr));
  }

  function drawFrame() {
    if (!ctx || !ready) return;
    const vw = video.videoWidth;
    const vh = video.videoHeight;
    if (!vw || !vh) return;
    const cw = canvas.width;
    const ch = canvas.height;
    const videoRatio = vw / vh;
    const canvasRatio = cw / ch;
    let dw = cw;
    let dh = ch;
    if (videoRatio > canvasRatio) {
      dh = ch;
      dw = ch * videoRatio;
    } else {
      dw = cw;
      dh = cw / videoRatio;
    }
    const dx = (cw - dw) / 2;
    const dy = (ch - dh) / 2;
    ctx.clearRect(0, 0, cw, ch);
    ctx.drawImage(video, dx, dy, dw, dh);
  }

  function activatePlaceholder() {
    if (usingPlaceholder) return;
    usingPlaceholder = true;
    window.clearTimeout(fallbackTimer);
    cancelAnimationFrame(raf);
    st?.kill();
    window.removeEventListener("resize", resize);
    placeholder = createPlaceholderScene(canvas, trigger);
  }

  video.addEventListener("loadedmetadata", () => {
    if (usingPlaceholder) return;
    ready = true;
    window.clearTimeout(fallbackTimer);
    resize();
    drawFrame();
  });

  video.addEventListener("seeked", drawFrame);
  video.addEventListener("error", activatePlaceholder);

  fallbackTimer = window.setTimeout(() => {
    if (!ready) activatePlaceholder();
  }, 1500);

  window.addEventListener("resize", resize);

  st = ScrollTrigger.create({
    trigger,
    start,
    end,
    scrub,
    onUpdate: (self) => {
      if (usingPlaceholder || !ready || !video.duration) return;
      const target = self.progress * (video.duration - 0.05);
      if (Math.abs(video.currentTime - target) > 0.03) {
        try {
          video.currentTime = target;
        } catch {
          /* seek not ready yet */
        }
      }
    },
  });

  function tick() {
    if (!usingPlaceholder) {
      if (ready) drawFrame();
      raf = requestAnimationFrame(tick);
    }
  }
  raf = requestAnimationFrame(tick);

  return {
    destroy() {
      cancelAnimationFrame(raf);
      window.clearTimeout(fallbackTimer);
      st?.kill();
      placeholder?.destroy();
      window.removeEventListener("resize", resize);
      video.src = "";
    },
  };
}
