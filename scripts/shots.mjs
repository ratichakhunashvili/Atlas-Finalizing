/*
 * Screenshots screens at the design width so they can be compared against the Figma frames.
 *
 *   npm run dev
 *   npm run shots -- /:index /states:states
 *
 * Each argument is "<route>:<name>". Files land in screenshots/<name>.png (or OUT_DIR). VIEWPORT
 * sets the CSS viewport, e.g. VIEWPORT=320x568; it defaults to the 390 x 844 design frame. Console errors,
 * page errors and failed requests are reported per route, so a screen that renders but
 * misbehaves does not pass quietly.
 */
import { chromium } from "playwright";
import { mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const BASE = process.env.BASE ?? "http://localhost:3000";
const OUT = join(ROOT, process.env.OUT_DIR ?? "screenshots");
const [VIEW_W, VIEW_H] = (process.env.VIEWPORT ?? "390x844").split("x").map(Number);

const targets = process.argv.slice(2).map((arg) => {
  const at = arg.lastIndexOf(":");
  if (at <= 0) throw new Error(`Expected "<route>:<name>", got "${arg}"`);
  return { route: arg.slice(0, at), name: arg.slice(at + 1) };
});

if (targets.length === 0) {
  console.error('Nothing to capture. Example: npm run shots -- /:index /states:states');
  process.exit(1);
}

mkdirSync(OUT, { recursive: true });

async function waitForServer() {
  for (let attempt = 0; attempt < 60; attempt++) {
    try {
      const res = await fetch(BASE);
      if (res.status < 500) return;
    } catch {
      // Not up yet.
    }
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }
  throw new Error(`No dev server at ${BASE}. Start one with "npm run dev".`);
}

await waitForServer();

// SwiftShader gives headless Chromium a software GPU, so the WebGL map renders in screenshots.
const browser = await chromium.launch({ args: ["--use-angle=swiftshader", "--enable-unsafe-swiftshader"] });
const page = await browser.newPage({ viewport: { width: VIEW_W, height: VIEW_H }, deviceScaleFactor: 2 });

const problems = [];
page.on("console", (msg) => {
  if (msg.type() === "error") problems.push(`console: ${msg.text()}`);
});
page.on("pageerror", (error) => problems.push(`pageerror: ${error.message}`));
page.on("requestfailed", (request) =>
  problems.push(`requestfailed: ${request.url()} ${request.failure()?.errorText ?? ""}`)
);

let failed = false;

for (const { route, name } of targets) {
  problems.length = 0;
  const res = await page.goto(BASE + route, { waitUntil: "networkidle" });
  // The Next.js dev-tools badge is an overlay, not part of the design.
  await page.addStyleTag({ content: "nextjs-portal { display: none !important; }" });
  await page.waitForTimeout(Number(process.env.WAIT ?? 500));
  // FULL=0 captures just the viewport, matching a Figma frame that clips its content.
  await page.screenshot({ path: join(OUT, `${name}.png`), fullPage: process.env.FULL !== "0" });
  const height = await page.evaluate(() => document.documentElement.scrollHeight);
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  console.log(`${route} -> ${process.env.OUT_DIR ?? "screenshots"}/${name}.png  status=${res?.status()} height=${height}${overflow > 0 ? `  OVERFLOW-X=${overflow}px` : ""}`);
  for (const problem of problems) {
    failed = true;
    console.log(`   ! ${problem}`);
  }
}

await browser.close();
process.exit(failed ? 1 : 0);
