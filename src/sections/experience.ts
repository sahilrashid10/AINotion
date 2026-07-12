import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function initExperience() {
  const pillars = gsap.utils.toArray<HTMLElement>(".pillar");
  const dots = gsap.utils.toArray<HTMLElement>("[data-dot]");
  if (!pillars.length) return;

  gsap.set(pillars, { y: 40 });
  gsap.set(pillars[0], { opacity: 1, y: 0 });
  dots[0]?.classList.add("is-active");

  let active = 0;

  function setActive(index: number) {
    if (index === active) return;
    gsap.to(pillars[active], { opacity: 0, y: -40, duration: 0.55, ease: "power2.inOut" });
    gsap.to(pillars[index], { opacity: 1, y: 0, duration: 0.55, ease: "power2.inOut" });
    dots[active]?.classList.remove("is-active");
    dots[index]?.classList.add("is-active");
    active = index;
  }

  ScrollTrigger.create({
    trigger: ".experience",
    start: "top top",
    end: "bottom bottom",
    scrub: true,
    onUpdate: (self) => {
      const segment = Math.min(pillars.length - 1, Math.floor(self.progress * pillars.length));
      setActive(segment);
    },
  });
}
