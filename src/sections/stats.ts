import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function initStats() {
  const nums = document.querySelectorAll<HTMLElement>(".stat__num");

  nums.forEach((el) => {
    const to = Number(el.dataset.countTo || "0");
    const decimals = Number(el.dataset.decimals || "0");
    const suffix = el.dataset.suffix || "";
    const counter = { val: 0 };

    ScrollTrigger.create({
      trigger: el,
      start: "top 85%",
      once: true,
      onEnter: () => {
        gsap.to(counter, {
          val: to,
          duration: 1.6,
          ease: "power3.out",
          onUpdate: () => {
            el.textContent = counter.val.toFixed(decimals) + suffix;
          },
        });
      },
    });
  });

  gsap.utils.toArray<HTMLElement>(".stat").forEach((stat, i) => {
    gsap.fromTo(
      stat,
      { opacity: 0, y: 24 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        delay: i * 0.08,
        ease: "power3.out",
        scrollTrigger: { trigger: stat, start: "top 88%", once: true },
      }
    );
  });
}
