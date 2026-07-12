import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import "./styles/base.css";
import "./styles/sections.css";

import { initGrain } from "./grain";
import { createScrollScrubVideo } from "./videoScrub";
import { initMarquees } from "./sections/marquee";
import { initStats } from "./sections/stats";
import { initHeroName } from "./sections/heroName";
import { initExperience } from "./sections/experience";
import { initPortfolio } from "./sections/portfolio";
import { initAbout } from "./sections/about";
import { initContact } from "./sections/contact";
import { initTerminal } from "./three/terminal";

gsap.registerPlugin(ScrollTrigger);

// ---------- smooth scroll ----------
const lenis = new Lenis({
  duration: 1.15,
  easing: (t: number) => 1 - Math.pow(1 - t, 3),
  smoothWheel: true,
});

lenis.on("scroll", ScrollTrigger.update);

gsap.ticker.add((time) => {
  lenis.raf(time * 1000);
});
gsap.ticker.lagSmoothing(0);

// ---------- smooth anchor navigation ----------
document.querySelectorAll<HTMLAnchorElement>('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", (e) => {
    const id = link.getAttribute("href");
    if (!id || id === "#") return;
    const target = document.querySelector(id);
    if (!target) return;
    e.preventDefault();
    lenis.scrollTo(target as HTMLElement, { duration: 1.4 });
  });
});

// ---------- grain overlay ----------
const grainCanvas = document.getElementById("grain") as HTMLCanvasElement | null;
if (grainCanvas) initGrain(grainCanvas);

// ---------- global scroll progress rail ----------
const progressFill = document.getElementById("progress-fill");
if (progressFill) {
  ScrollTrigger.create({
    trigger: document.documentElement,
    start: "top top",
    end: "bottom bottom",
    onUpdate: (self) => {
      progressFill.style.width = `${self.progress * 100}%`;
    },
  });
}

// ---------- sections ----------
initMarquees();
initStats();
initHeroName();
initExperience();
initPortfolio();
initAbout();
initContact();

// ---------- 3D terminal centerpiece ----------
const terminalCanvas = document.getElementById("terminal-canvas") as HTMLCanvasElement | null;
if (terminalCanvas) initTerminal(terminalCanvas);

// ---------- scroll-scrubbed cinematic clips ----------
const heroVideoCanvas = document.getElementById("hero-video-canvas") as HTMLCanvasElement | null;
if (heroVideoCanvas) {
  createScrollScrubVideo({
    src: import.meta.env.BASE_URL + "video/hero-terminal-boot.mp4",
    canvas: heroVideoCanvas,
    trigger: "#hero",
    start: "top top",
    end: "bottom bottom",
    scrub: 0.5,
  });
}

const builderVideoCanvas = document.getElementById("builder-video-canvas") as HTMLCanvasElement | null;
if (builderVideoCanvas) {
  createScrollScrubVideo({
    src: import.meta.env.BASE_URL + "video/the-builder.mp4",
    canvas: builderVideoCanvas,
    trigger: ".experience",
    start: "top top",
    end: "bottom bottom",
    scrub: 0.6,
  });
}

const teacherVideoCanvas = document.getElementById("teacher-video-canvas") as HTMLCanvasElement | null;
if (teacherVideoCanvas) {
  createScrollScrubVideo({
    src: import.meta.env.BASE_URL + "video/the-teacher.mp4",
    canvas: teacherVideoCanvas,
    trigger: ".portfolio",
    start: "top bottom",
    end: "bottom top",
    scrub: 0.6,
  });
}

const closerVideoCanvas = document.getElementById("closer-video-canvas") as HTMLCanvasElement | null;
if (closerVideoCanvas) {
  createScrollScrubVideo({
    src: import.meta.env.BASE_URL + "video/the-closer.mp4",
    canvas: closerVideoCanvas,
    trigger: ".contact",
    start: "top bottom",
    end: "bottom top",
    scrub: 0.6,
  });
}

ScrollTrigger.refresh();
