const FRAME_COUNT = 6;
const FPS = 12;

/**
 * Film grain overlay. Noise frames are pre-rendered once (regenerated on
 * resize) and cycled with drawImage — no per-frame pixel generation, so the
 * cost per tick is a single GPU blit instead of a putImageData upload.
 */
export function initGrain(canvas: HTMLCanvasElement) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const scale = 0.3;
  let frames: HTMLCanvasElement[] = [];
  let w = 0;
  let h = 0;

  function buildFrames() {
    frames = [];
    for (let f = 0; f < FRAME_COUNT; f++) {
      const frame = document.createElement("canvas");
      frame.width = w;
      frame.height = h;
      const fctx = frame.getContext("2d")!;
      const imageData = fctx.createImageData(w, h);
      const buffer = imageData.data;
      for (let i = 0; i < buffer.length; i += 4) {
        const v = Math.random() * 255;
        buffer[i] = v;
        buffer[i + 1] = v;
        buffer[i + 2] = v;
        buffer[i + 3] = 255;
      }
      fctx.putImageData(imageData, 0, 0);
      frames.push(frame);
    }
  }

  function resize() {
    w = Math.max(1, Math.floor(window.innerWidth * scale));
    h = Math.max(1, Math.floor(window.innerHeight * scale));
    canvas.width = w;
    canvas.height = h;
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    buildFrames();
  }

  let resizeTimer = 0;
  window.addEventListener("resize", () => {
    window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(resize, 200);
  });
  resize();

  let last = 0;
  let index = 0;
  function loop(t: number) {
    if (t - last > 1000 / FPS && frames.length) {
      index = (index + 1) % frames.length;
      ctx!.drawImage(frames[index], 0, 0);
      last = t;
    }
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);
}
