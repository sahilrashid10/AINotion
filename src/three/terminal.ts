import * as THREE from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const AMBER = 0xff7a18;
const BONE = 0xece7df;

const CODE_LINES = [
  "$ fabric pipeline deploy --env prod",
  "> lakehouse.medallion.bronze  OK",
  "> eventstream.ingest  streaming...",
  "SELECT sales_id, region, revenue",
  "  FROM gold.sales_events",
  "  WHERE ts > current_date() - 1;",
  "> direct_lake.refresh()  200ms",
  "$ adf pipeline run --incremental",
  "> databricks.notebook: pyspark",
  "  df.write.format('delta')",
  "> synapse.sql: serverless OK",
  "> azure.ai: endpoint ready",
];

function buildScreenTexture() {
  // 768x480 reads identically on the tilted screen at a fraction of the
  // per-frame fillText + texture upload cost of the original 1024x640
  const canvas = document.createElement("canvas");
  canvas.width = 768;
  canvas.height = 480;
  const ctx = canvas.getContext("2d")!;
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;

  let offset = 0;

  function draw() {
    ctx.fillStyle = "#0b0b0d";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.font = "21px 'Space Mono', monospace";
    const lineHeight = 32;
    const visibleLines = Math.ceil(canvas.height / lineHeight) + 2;

    for (let i = 0; i < visibleLines; i++) {
      const lineIndex = (Math.floor(offset) + i) % CODE_LINES.length;
      const line = CODE_LINES[lineIndex];
      const y = i * lineHeight - (offset % 1) * lineHeight + 30;
      const isPrompt = line.startsWith("$") || line.startsWith(">");
      ctx.fillStyle = isPrompt ? `#${AMBER.toString(16)}` : `#${BONE.toString(16)}`;
      ctx.globalAlpha = 0.85;
      ctx.fillText(line, 24, y);
    }
    ctx.globalAlpha = 1;

    // scanline
    ctx.fillStyle = "rgba(255,122,24,0.06)";
    for (let y = 0; y < canvas.height; y += 4) {
      ctx.fillRect(0, y, canvas.width, 1);
    }

    texture.needsUpdate = true;
  }

  draw();

  return {
    texture,
    tick() {
      offset += 0.09; // called every 2nd frame — same visual scroll speed
      draw();
    },
  };
}

function buildTerminal() {
  const group = new THREE.Group();

  const edgeMat = new THREE.LineBasicMaterial({ color: AMBER, transparent: true, opacity: 0.9 });
  const fillMat = new THREE.MeshBasicMaterial({
    color: 0x0b0b0d,
    transparent: true,
    opacity: 0.35,
    side: THREE.DoubleSide,
  });

  // base deck
  const baseGeo = new THREE.BoxGeometry(3.2, 0.14, 2);
  const base = new THREE.Mesh(baseGeo, fillMat);
  base.position.set(0, -0.9, 0.4);
  const baseEdges = new THREE.LineSegments(new THREE.EdgesGeometry(baseGeo), edgeMat);
  base.add(baseEdges);
  group.add(base);

  // keyboard hint lines on deck
  const deckLinesGeo = new THREE.PlaneGeometry(2.7, 1.5);
  const deckLinesMat = new THREE.MeshBasicMaterial({
    color: AMBER,
    wireframe: true,
    transparent: true,
    opacity: 0.15,
  });
  const deckLines = new THREE.Mesh(deckLinesGeo, deckLinesMat);
  deckLines.rotation.x = -Math.PI / 2;
  deckLines.position.set(0, -0.82, 0.4);
  group.add(deckLines);

  // hinge pivot at back edge of base
  const hinge = new THREE.Group();
  hinge.position.set(0, -0.83, -0.6);
  group.add(hinge);

  const screenGeo = new THREE.BoxGeometry(3.2, 1.9, 0.06);
  const screen = new THREE.Mesh(screenGeo, fillMat);
  screen.position.set(0, 0.95, 0);
  const screenEdges = new THREE.LineSegments(new THREE.EdgesGeometry(screenGeo), edgeMat);
  screen.add(screenEdges);
  hinge.add(screen);

  const screenTex = buildScreenTexture();
  const faceGeo = new THREE.PlaneGeometry(2.9, 1.65);
  const faceMat = new THREE.MeshBasicMaterial({
    map: screenTex.texture,
    transparent: true,
    opacity: 0.92,
  });
  const face = new THREE.Mesh(faceGeo, faceMat);
  face.position.set(0, 0.95, 0.035);
  hinge.add(face);

  // floating particles for holographic atmosphere
  const particleCount = 140;
  const positions = new Float32Array(particleCount * 3);
  for (let i = 0; i < particleCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 6;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 4;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 4;
  }
  const particleGeo = new THREE.BufferGeometry();
  particleGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  const particleMat = new THREE.PointsMaterial({
    color: AMBER,
    size: 0.02,
    transparent: true,
    opacity: 0.5,
  });
  const particles = new THREE.Points(particleGeo, particleMat);
  group.add(particles);

  return { group, hinge, screenTex, particles };
}

export function initTerminal(canvas: HTMLCanvasElement) {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
  camera.position.set(0, 0.15, 6.2);

  // antialias off: EffectComposer renders via an offscreen target, so MSAA
  // on the default framebuffer never applies — it only costs memory/fill
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: false });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
  renderer.setClearColor(0x000000, 0);

  const composer = new EffectComposer(renderer);
  const renderPass = new RenderPass(scene, camera);
  composer.addPass(renderPass);
  // fixed low internal resolution keeps the blur passes cheap; bloom is soft by nature
  const bloom = new UnrealBloomPass(new THREE.Vector2(256, 144), 0.65, 0.5, 0.72);
  composer.addPass(bloom);

  const { group, hinge, screenTex, particles } = buildTerminal();
  scene.add(group);

  scene.add(new THREE.AmbientLight(0xffffff, 0.4));
  const key = new THREE.PointLight(AMBER, 3, 20);
  key.position.set(3, 2, 4);
  scene.add(key);

  const CLOSED = -Math.PI / 2 + 0.05;
  const OPEN = 0.06;
  hinge.rotation.x = CLOSED;

  function resize() {
    const rect = canvas.getBoundingClientRect();
    const w = Math.max(1, rect.width);
    const h = Math.max(1, rect.height);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h, false);
    composer.setSize(w, h);
  }
  resize();
  window.addEventListener("resize", resize);

  const state = { unfold: 0, spin: 0 };

  ScrollTrigger.create({
    trigger: "#hero",
    start: "top top",
    end: "bottom bottom",
    scrub: 0.6,
    onUpdate: (self) => {
      const p = self.progress;
      state.unfold = Math.min(1, p / 0.42);
      state.spin = p;
    },
  });

  // render only while the hero is on screen
  let visible = false;
  const io = new IntersectionObserver((entries) => {
    visible = entries[0]?.isIntersecting ?? false;
  });
  io.observe(canvas);

  // adaptive quality: measure real frame rate and shed cost in two steps —
  // 1) drop the bloom composer, 2) render at reduced resolution — so weak
  // GPUs stay smooth while capable ones keep the full look
  let qualityLevel = 0;
  let fpsWindowStart = 0;
  let fpsFrames = 0;

  function degrade() {
    qualityLevel++;
    if (qualityLevel === 2) {
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1) * 0.66);
      resize();
    }
  }

  function trackFps(now: number) {
    if (qualityLevel >= 2) return;
    if (!fpsWindowStart) fpsWindowStart = now;
    fpsFrames++;
    const elapsed = now - fpsWindowStart;
    if (elapsed >= 1500) {
      const fps = (fpsFrames / elapsed) * 1000;
      if (fps < 34) degrade();
      fpsWindowStart = now;
      fpsFrames = 0;
    }
  }

  const startTime = performance.now();
  let frame = 0;

  function animate() {
    requestAnimationFrame(animate);
    if (!visible) return;
    const now = performance.now();
    trackFps(now);
    const t = (now - startTime) / 1000;

    const unfoldEased = 1 - Math.pow(1 - state.unfold, 3);
    hinge.rotation.x = THREE.MathUtils.lerp(CLOSED, OPEN, unfoldEased);

    group.rotation.y = state.spin * Math.PI * 4 + Math.sin(t * 0.15) * 0.05;
    group.position.y = Math.sin(t * 0.6) * 0.05;
    particles.rotation.y = t * 0.02;

    // the scrolling code texture reads fine at half rate; redrawing a
    // 1024x640 canvas with text every frame is the expensive part
    if (frame++ % 2 === 0) screenTex.tick();

    if (qualityLevel === 0) composer.render();
    else renderer.render(scene, camera);
  }
  requestAnimationFrame(animate);

  return {
    destroy() {
      io.disconnect();
      window.removeEventListener("resize", resize);
      renderer.dispose();
    },
  };
}
