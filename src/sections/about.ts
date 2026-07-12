import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const ACCENT_WORDS = new Set(["Microsoft", "Azure", "AI", "Engineer", "Associate"]);

export function initAbout() {
  const el = document.getElementById("about-kinetic");
  if (!el) return;

  const text = el.textContent || "";
  el.textContent = "";

  const words = text.trim().split(/\s+/);
  const spans = words.map((word) => {
    const span = document.createElement("span");
    span.className = "word" + (ACCENT_WORDS.has(word.replace(/[.,:]/g, "")) ? " is-accent" : "");
    span.textContent = word;
    el.appendChild(span);
    return span;
  });

  gsap.to(spans, {
    opacity: 1,
    stagger: 0.06,
    ease: "none",
    scrollTrigger: {
      trigger: el,
      start: "top 80%",
      end: "bottom 40%",
      scrub: 0.5,
    },
  });

  gsap.fromTo(
    ".about__body",
    { opacity: 0, y: 20 },
    {
      opacity: 1,
      y: 0,
      duration: 0.9,
      ease: "power3.out",
      scrollTrigger: { trigger: ".about__body", start: "top 88%", once: true },
    }
  );
}
