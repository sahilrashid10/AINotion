export function initGrain(canvas: HTMLCanvasElement) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const scale = 0.35;
  let w = 0;
  let h = 0;

  function resize() {
    w = Math.max(1, Math.floor(window.innerWidth * scale));
    h = Math.max(1, Math.floor(window.innerHeight * scale));
    canvas.width = w;
    canvas.height = h;
    canvas.style.width = "100%";
    canvas.style.height = "100%";
  }

  function draw() {
    if (!ctx) return;
    const imageData = ctx.createImageData(w, h);
    const buffer = imageData.data;
    for (let i = 0; i < buffer.length; i += 4) {
      const v = Math.random() * 255;
      buffer[i] = v;
      buffer[i + 1] = v;
      buffer[i + 2] = v;
      buffer[i + 3] = 255;
    }
    ctx.putImageData(imageData, 0, 0);
  }

  resize();
  window.addEventListener("resize", resize);

  let last = 0;
  const fps = 14;
  function loop(t: number) {
    if (t - last > 1000 / fps) {
      draw();
      last = t;
    }
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);
}
