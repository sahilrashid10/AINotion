import { chromium } from "playwright";
import { execFileSync } from "node:child_process";
import { mkdirSync, writeFileSync, rmSync } from "node:fs";

import { tmpdir } from "node:os";
import { fileURLToPath } from "node:url";
import { dirname } from "node:path";
const HERE = dirname(fileURLToPath(import.meta.url));
const SCRATCH = tmpdir();
const FFMPEG = process.env.FFMPEG_PATH || "/opt/pw-browsers/ffmpeg-1011/ffmpeg-linux";
const FPS = 24, DUR = 8, FRAMES = FPS * DUR;
const CLIPS = ["hero-terminal-boot", "the-builder", "the-teacher", "the-closer"];

const browser = await chromium.launch({
  executablePath: process.env.CHROMIUM_PATH || "/opt/pw-browsers/chromium-1194/chrome-linux/chrome",
  args: ["--no-sandbox"],
});
const page = await browser.newPage({ viewport: { width: 1300, height: 740 } });
await page.goto("file://" + HERE + "/render.html");

for (const clip of CLIPS) {
  const dir = `${SCRATCH}/frames-${clip}`;
  rmSync(dir, { recursive: true, force: true });
  mkdirSync(dir, { recursive: true });
  console.log("rendering", clip);
  for (let f = 0; f < FRAMES; f++) {
    const data = await page.evaluate(
      ([scene, frame]) => {
        window.drawFrame(scene, frame);
        return window.frameData();
      },
      [clip, f]
    );
    writeFileSync(`${dir}/f${String(f).padStart(4, "0")}.jpg`, Buffer.from(data.split(",")[1], "base64"));
  }
  console.log("encoding", clip);
  // this ffmpeg build only has the image2pipe demuxer — feed JPEGs via stdin
  execFileSync("bash", ["-c",
    `cat ${dir}/f*.jpg | ${FFMPEG} -y -f image2pipe -framerate ${FPS} -c:v mjpeg -i pipe:0 ` +
    `-c:v libvpx -b:v 2200k -qmin 4 -qmax 42 -g 6 -pix_fmt yuv420p -an ` +
    `${HERE}/../public/video/${clip}.webm`,
  ], { stdio: "inherit" });
  rmSync(dir, { recursive: true, force: true });
}

await browser.close();
console.log("ALL CLIPS DONE");
