import { gsap } from "gsap";

const SKILLS = [
  "Power BI",
  "DAX",
  "Power Query",
  "Microsoft Fabric",
  "Lakehouse",
  "Eventstream",
  "Azure Data Factory",
  "Databricks",
  "PySpark",
  "ADLS Gen2",
  "Synapse",
  "SQL",
  "Python",
  "C#",
  ".NET Core",
  "C++",
  "MongoDB",
  "ETL/ELT Pipelines",
  "Medallion Architecture",
  "Data Structures & Algorithms",
];

function buildGroup(accentEvery = 4): HTMLDivElement {
  const group = document.createElement("div");
  group.className = "marquee__group";
  SKILLS.forEach((skill, i) => {
    const item = document.createElement("span");
    item.className = "marquee__item" + (i % accentEvery === 0 ? " is-accent" : "");
    item.textContent = skill;
    group.appendChild(item);

    const dot = document.createElement("span");
    dot.className = "marquee__dot";
    dot.textContent = "•";
    group.appendChild(dot);
  });
  return group;
}

export function initMarquees() {
  const wraps = document.querySelectorAll<HTMLElement>(".marquee-wrap");

  wraps.forEach((wrap) => {
    const track = wrap.querySelector<HTMLElement>(".marquee");
    if (!track) return;
    const direction = Number(wrap.dataset.marqueeSpeed || "1");

    track.appendChild(buildGroup());
    track.appendChild(buildGroup());

    if (direction < 0) gsap.set(track, { xPercent: -50 });

    const baseTween = gsap.to(track, {
      xPercent: direction > 0 ? -50 : 0,
      duration: 34,
      ease: "none",
      repeat: -1,
    });

    // subtle speed-up on active scroll for a kinetic feel
    let velocityTimeout: number;
    window.addEventListener("scroll", () => {
      baseTween.timeScale(2.4);
      window.clearTimeout(velocityTimeout);
      velocityTimeout = window.setTimeout(() => baseTween.timeScale(1), 220);
    });
  });
}
