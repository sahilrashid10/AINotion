import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

function splitChars(el: HTMLElement) {
  const text = el.textContent || "";
  el.textContent = "";
  const chars: HTMLSpanElement[] = [];
  for (const ch of text) {
    const span = document.createElement("span");
    span.className = "char";
    span.textContent = ch === " " ? " " : ch;
    el.appendChild(span);
    chars.push(span);
  }
  return chars;
}

export function initHeroName() {
  const lines = document.querySelectorAll<HTMLElement>(".hero__name-line");
  const allChars: HTMLSpanElement[] = [];
  lines.forEach((line) => allChars.push(...splitChars(line)));

  gsap.set(allChars, { yPercent: 120, rotateZ: 6, opacity: 0 });

  const tl = gsap.timeline({ delay: 0.2 });
  tl.to(".eyebrow", { opacity: 1, y: 0, duration: 0.7, ease: "power3.out" })
    .to(
      allChars,
      {
        yPercent: 0,
        rotateZ: 0,
        opacity: 1,
        duration: 0.9,
        ease: "power4.out",
        stagger: 0.035,
      },
      "-=0.3"
    )
    .to(".hero__subtitle", { opacity: 1, y: 0, duration: 0.7, ease: "power3.out" }, "-=0.5")
    .to(".hero__scroll-cue", { opacity: 1, duration: 0.6 }, "-=0.4");

  // subtle kinetic parallax + fade as the hero is scrolled through
  gsap.to(".hero__content", {
    yPercent: -18,
    opacity: 0,
    ease: "none",
    scrollTrigger: {
      trigger: "#hero",
      start: "top top",
      end: "60% top",
      scrub: 0.5,
    },
  });
}
