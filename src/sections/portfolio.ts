import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function initPortfolio() {
  const track = document.getElementById("portfolio-track");
  const section = document.querySelector<HTMLElement>(".portfolio");
  if (!track || !section) return;

  function build() {
    const distance = track!.scrollWidth - window.innerWidth + 2 * getEdgePx();
    if (distance <= 0) return null;

    return gsap.to(track, {
      x: -distance,
      ease: "none",
      scrollTrigger: {
        trigger: section,
        start: "top top",
        end: () => `+=${distance}`,
        scrub: 0.6,
        pin: true,
        invalidateOnRefresh: true,
      },
    });
  }

  function getEdgePx() {
    const val = getComputedStyle(document.documentElement).getPropertyValue("--edge");
    return parseFloat(val) || 24;
  }

  let tween = build();
  window.addEventListener("resize", () => {
    tween?.scrollTrigger?.kill();
    tween?.kill();
    tween = build();
    ScrollTrigger.refresh();
  });
}
