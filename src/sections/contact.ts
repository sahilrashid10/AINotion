import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function initContact() {
  gsap.fromTo(
    ".contact__headline",
    { opacity: 0, y: 40 },
    {
      opacity: 1,
      y: 0,
      duration: 1,
      ease: "power4.out",
      scrollTrigger: { trigger: ".contact", start: "top 60%", once: true },
    }
  );

  gsap.fromTo(
    ".contact__ctas",
    { opacity: 0, y: 24 },
    {
      opacity: 1,
      y: 0,
      duration: 0.9,
      delay: 0.25,
      ease: "power3.out",
      scrollTrigger: { trigger: ".contact", start: "top 55%", once: true },
    }
  );

  const github = document.querySelector('[data-footprint="github"]');
  const leetcode = document.querySelector('[data-footprint="leetcode"]');
  github?.setAttribute("href", "https://github.com/sahilrashid10");
  leetcode?.setAttribute("href", "https://leetcode.com/u/sahilrashid10/");
  github?.setAttribute("target", "_blank");
  leetcode?.setAttribute("target", "_blank");
  github?.setAttribute("rel", "noopener");
  leetcode?.setAttribute("rel", "noopener");
}
