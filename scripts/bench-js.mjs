/*
 * JS-weight benchmark for the self-improvement loop.
 *
 *   node scripts/bench-js.mjs            # build, serve, measure
 *   node scripts/bench-js.mjs --verify   # + typecheck, lint, unit tests before, check-ui after
 *
 * Builds the production app, starts `next start` on a free port, opens five key screens in fresh
 * browser contexts at 390 x 844, and sums the gzipped (level 9) size of every same-origin
 * /_next/**.js file each screen downloads. The map screen is measured only once the Mapbox map is
 * really ready, so removing or breaking the live map can never look like a win.
 *
 * The last stdout line is one JSON object: {"primary", "sub_scores", "checks"}. Everything else
 * goes to stderr, with Mapbox tokens redacted.
 */
import { spawn, spawnSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { createServer } from "node:net";
import { createRequire } from "node:module";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import { gzipSync } from "node:zlib";

const CWD = process.cwd();
const VERIFY = process.argv.includes("--verify");
const ROUTES = [
  ["/", "route_home"],
  ["/list", "route_list"],
  ["/plan", "route_plan"],
  ["/place/partner-2", "route_place_partner_2"],
  ["/scan", "route_scan"],
];
const MAP_TIMEOUT = 30_000;
const QUIET_MS = 2_000;
const QUIET_MAX = 15_000;

const redact = (s) => String(s).replace(/pk\.[A-Za-z0-9._-]+/g, "pk.<redacted>");
const log = (...args) => process.stderr.write(redact(args.join(" ")) + "\n");
const t0 = Date.now();

class BenchError extends Error {}
const die = (msg) => {
  throw new BenchError(msg);
};

// --- token -------------------------------------------------------------------------------------
function readToken() {
  if (process.env.NEXT_PUBLIC_MAPBOX_TOKEN) return process.env.NEXT_PUBLIC_MAPBOX_TOKEN.trim();
  const envFile = join(CWD, ".env.local");
  if (!existsSync(envFile)) return "";
  const line = readFileSync(envFile, "utf8")
    .split(/\r?\n/)
    .find((l) => /^\s*NEXT_PUBLIC_MAPBOX_TOKEN\s*=/.test(l));
  if (!line) return "";
  return line.slice(line.indexOf("=") + 1).trim().replace(/^["']|["']$/g, "");
}

// --- child processes ---------------------------------------------------------------------------
function run(label, command, env = {}) {
  log(`\n> [${label}] ${command}`);
  const started = Date.now();
  const res = spawnSync(command, {
    cwd: CWD,
    shell: true,
    env: { ...process.env, ...env },
    encoding: "utf8",
    maxBuffer: 64 * 1024 * 1024,
  });
  const out = `${res.stdout ?? ""}${res.stderr ?? ""}`;
  const ok = res.status === 0;
  // Keep logs short on success, full on failure.
  const lines = out.trimEnd().split(/\r?\n/);
  const shown = ok ? lines.slice(-12) : lines;
  for (const l of shown) log(`  ${l}`);
  log(`< [${label}] ${ok ? "ok" : `FAILED (exit ${res.status})`} in ${((Date.now() - started) / 1000).toFixed(1)}s`);
  return ok;
}

function freePort() {
  return new Promise((resolve, reject) => {
    const srv = createServer();
    srv.unref();
    srv.on("error", reject);
    srv.listen(0, "127.0.0.1", () => {
      const { port } = srv.address();
      srv.close(() => resolve(port));
    });
  });
}

function killTree(child) {
  if (!child || child.exitCode !== null) return;
  if (process.platform === "win32") {
    spawnSync("taskkill", ["/pid", String(child.pid), "/T", "/F"], { stdio: "ignore" });
  } else {
    try {
      process.kill(-child.pid, "SIGKILL");
    } catch {
      child.kill("SIGKILL");
    }
  }
}

async function waitForHttp(url, child, timeoutMs = 60_000) {
  const end = Date.now() + timeoutMs;
  while (Date.now() < end) {
    if (child.exitCode !== null) die(`production server exited early (code ${child.exitCode})`);
    try {
      const res = await fetch(url);
      if (res.status === 200) return;
    } catch {
      /* not up yet */
    }
    await new Promise((r) => setTimeout(r, 300));
  }
  die(`production server did not answer 200 at ${url} within ${timeoutMs / 1000}s`);
}

// --- measurement -------------------------------------------------------------------------------
async function measureRoute(browser, base, route) {
  const origin = new URL(base).origin;
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1 });
  const files = new Map(); // url (no query) -> Promise<{ bytes, at }>
  let lastJsAt = Date.now();
  let loadAt = 0;
  context.on("response", (response) => {
    const raw = response.url();
    let u;
    try {
      u = new URL(raw);
    } catch {
      return;
    }
    if (u.origin !== origin || !u.pathname.startsWith("/_next/") || !u.pathname.endsWith(".js")) return;
    const key = origin + u.pathname;
    lastJsAt = Date.now();
    if (files.has(key)) return;
    const at = Date.now();
    files.set(
      key,
      response.body().then(
        (body) => ({ bytes: gzipSync(body, { level: 9 }).length, at }),
        (err) => ({ error: `${key}: ${err.message}`, at }),
      ),
    );
  });

  try {
    const page = await context.newPage();
    const res = await page.goto(base + route, { waitUntil: "load", timeout: 60_000 });
    loadAt = Date.now();
    if (!res || res.status() !== 200) die(`${route} answered ${res ? res.status() : "nothing"}`);

    if (route === "/") {
      try {
        await page.waitForFunction(
          () => {
            const alert = document.querySelector(".atlas-map [role=alert]");
            if (alert) return `alert:${alert.textContent}`;
            const loading = [...document.querySelectorAll("[role=status]")].some((el) =>
              (el.textContent ?? "").includes("Loading the map"),
            );
            return !loading && document.querySelector("canvas.mapboxgl-canvas") ? "ready" : false;
          },
          null,
          { timeout: MAP_TIMEOUT, polling: 100 },
        ).then(async (handle) => {
          const state = await handle.jsonValue();
          if (state !== "ready") die(`map did not load (${state})`);
        });
      } catch (err) {
        if (err instanceof BenchError) throw err;
        die(`map did not load within ${MAP_TIMEOUT / 1000}s`);
      }
    }

    // Settle: no new /_next/*.js response for QUIET_MS (max QUIET_MAX).
    const settleStart = Date.now();
    lastJsAt = Math.max(lastJsAt, settleStart);
    while (Date.now() - lastJsAt < QUIET_MS) {
      if (Date.now() - settleStart > QUIET_MAX) {
        log(`  ! ${route}: JS still arriving after ${QUIET_MAX / 1000}s; measuring what arrived`);
        break;
      }
      await new Promise((r) => setTimeout(r, 100));
    }

    const entries = await Promise.all([...files].map(async ([url, p]) => ({ url, ...(await p) })));
    const errors = entries.filter((e) => e.error);
    if (errors.length) die(`could not read JS bodies on ${route}:\n  ${errors.map((e) => e.error).join("\n  ")}`);
    return entries.map((e) => ({ url: e.url, bytes: e.bytes, afterLoadMs: e.at - loadAt }));
  } finally {
    await context.close();
  }
}

// --- main --------------------------------------------------------------------------------------
let server;
let exitCode = 1;
try {
  const token = readToken();
  if (!token) {
    die("NEXT_PUBLIC_MAPBOX_TOKEN is not set (env or .env.local). Without it the map never loads mapbox-gl and the score would be fake.");
  }

  const nodeRequire = createRequire(join(CWD, "package.json"));
  let nextBin;
  let playwright;
  try {
    nextBin = nodeRequire.resolve("next/dist/bin/next");
    playwright = await import(pathToFileURL(nodeRequire.resolve("playwright")).href);
  } catch (err) {
    die(`cannot resolve next/playwright from ${CWD} (is node_modules present or linked?): ${err.message}`);
  }
  const chromium = playwright.chromium ?? playwright.default.chromium;

  if (VERIFY) {
    for (const [label, cmd] of [
      ["typecheck", "npm run typecheck"],
      ["lint", "npm run lint"],
      ["unit tests", "npm test"],
    ]) {
      if (!run(label, cmd)) die(`guardrail failed: ${label}`);
    }
  }

  if (!run("build", "npm run build", { NEXT_TELEMETRY_DISABLED: "1" })) die("build failed");

  const port = await freePort();
  const base = `http://localhost:${port}`;
  log(`\n> starting production server on ${base}`);
  server = spawn(process.execPath, [nextBin, "start", "-p", String(port)], {
    cwd: CWD,
    env: { ...process.env, NEXT_TELEMETRY_DISABLED: "1" },
    stdio: ["ignore", "pipe", "pipe"],
    detached: process.platform !== "win32",
  });
  server.stdout.on("data", (d) => log(`  [server] ${String(d).trimEnd()}`));
  server.stderr.on("data", (d) => log(`  [server] ${String(d).trimEnd()}`));
  await waitForHttp(base + "/", server);

  const browser = await chromium.launch({ args: ["--use-angle=swiftshader", "--enable-unsafe-swiftshader"] });
  const subScores = {};
  const union = new Map();
  let total = 0;
  try {
    for (const [route, key] of ROUTES) {
      const files = await measureRoute(browser, base, route);
      const bytes = files.reduce((s, f) => s + f.bytes, 0);
      total += bytes;
      subScores[key] = Math.round((bytes / 1024) * 10) / 10;
      log(`\n${route}: ${files.length} files, ${subScores[key]} KB gz`);
      for (const f of [...files].sort((a, b) => b.bytes - a.bytes)) {
        union.set(f.url, f.bytes);
        log(`  ${(f.bytes / 1024).toFixed(1).padStart(7)} KB  +${String(f.afterLoadMs).padStart(5)}ms  ${f.url.slice(base.length)}`);
      }
    }
  } finally {
    await browser.close();
  }
  subScores.unique_js_kb = Math.round(([...union.values()].reduce((s, b) => s + b, 0) / 1024) * 10) / 10;
  const primary = Math.round((total / 1024) * 10) / 10;

  let checks = "skipped";
  if (VERIFY) {
    if (!run("check-ui", `node "${join("scripts", "check-ui.mjs")}"`, { BASE: base })) die("guardrail failed: check-ui");
    checks = "pass";
  }

  log(`\nbench-js done in ${((Date.now() - t0) / 1000).toFixed(1)}s: ${primary} KB gz`);
  process.stdout.write(JSON.stringify({ primary, sub_scores: subScores, checks }) + "\n");
  exitCode = 0;
} catch (err) {
  log(`\nbench-js FAILED: ${err instanceof BenchError ? err.message : err.stack ?? err}`);
  exitCode = 1;
} finally {
  if (server) {
    killTree(server);
    log("  production server stopped");
  }
}
process.exit(exitCode);
