/*
 * Responsive and interaction checks for the Atlas prototype, in a real (headless Chromium) browser.
 *
 *   npm run dev
 *   npm run test:ui                      # every viewport, every route, every journey
 *   SHOTS=1 npm run test:ui              # also save viewport screenshots to screenshots/responsive
 *   ONLY=layout | ONLY=journeys          # one half
 *
 * Layout: at each viewport and route, the page must not scroll sideways, every visible control
 * must sit on screen (or inside a deliberately scrollable row), nothing may cover a control even
 * after it is scrolled into view, and targets must be at least 24 px (inline text links exempt).
 *
 * Journeys: the demo interactions that must stay consistent — search, preferences carried into
 * the plan, plan changes with undo and reload, check-ins reaching Achievements, the next-stop
 * choice, the remove-stop dialog's focus handling, and labels that match where they lead.
 *
 * Phone sizes use Chromium's mobile emulation (touch, mobile viewport). That approximates, but
 * is not, iOS Safari or Android Chrome on a device.
 */
import assert from "node:assert/strict";
import { mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const BASE = process.env.BASE ?? "http://localhost:3000";
const ONLY = process.env.ONLY;
const SHOTS = process.env.SHOTS === "1";

const VIEWPORTS = [
  { name: "320x568", width: 320, height: 568 },
  { name: "360x800", width: 360, height: 800 },
  { name: "375x812", width: 375, height: 812 },
  { name: "390x844", width: 390, height: 844 },
  { name: "430x932", width: 430, height: 932 },
  { name: "768x1024", width: 768, height: 1024 },
  { name: "1024x768", width: 1024, height: 768 },
  { name: "1440x900", width: 1440, height: 900 },
  { name: "844x390", width: 844, height: 390 },
  // A 390 x 844 phone at 200% zoom lays out like a 195 x 422 viewport.
  { name: "zoom200", width: 195, height: 422 },
];

const ROUTES = [
  ["/", "map"],
  ["/list", "list"],
  ["/plan", "plan"],
  ["/preferences", "preferences"],
  ["/scan", "scan"],
  ["/route", "route"],
  ["/next-stop", "next-stop"],
  ["/map/next-stop", "map-next-stop"],
  ["/profile", "profile"],
  ["/achievements", "achievements"],
  ["/place/partner-2", "detail"],
  ["/place/pool", "pool"],
  ["/plan/repair/confirm", "repair-confirm"],
  ["/plan/ready", "plan-ready"],
  ["/welcome", "welcome"],
  ["/sign-in", "sign-in"],
  ["/qr-invalid", "qr-invalid"],
  ["/scan/place-unavailable", "scan-problem"],
  ["/ar-unlock", "ar-unlock"],
  ["/unlocked", "unlocked"],
  ["/privacy", "privacy"],
  ["/no-match", "no-match"],
  ["/map/location-off", "map-location-off"],
  ["/sign-up", "sign-up"],
  ["/sign-up/email-used", "sign-up-email-used"],
  ["/reset-password", "reset-password"],
  ["/reset-password/expired", "reset-expired"],
  ["/scan-hotel", "scan-hotel"],
  ["/stay/confirmed", "stay-confirmed"],
  ["/stay/ended", "stay-ended"],
  ["/plan/reorder", "plan-reorder"],
  ["/plan/error", "plan-error"],
  ["/plan/build-failed", "plan-build-failed"],
  ["/preferences/edit", "preferences-edit"],
  ["/profile/sign-out", "sign-out"],
  ["/account-deleted", "account-deleted"],
  ["/admin/sign-in", "admin-sign-in"],
  ["/admin", "admin-hotels"],
  ["/admin/places", "admin-places"],
  ["/admin/places/edit", "admin-place-form"],
  ["/admin/partners", "admin-partners"],
  ["/admin/qr", "admin-qr"],
  ["/admin/qr/created", "admin-qr-created"],
  ["/admin/qr/revoke", "admin-qr-revoke"],
];

const failures = [];
const fail = (message) => {
  failures.push(message);
  console.log(`  ✗ ${message}`);
};

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

/** Runs in the page: layout problems for the current scroll position, after scrolling covered controls into view. */
function auditLayout() {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const issues = [];
  const describe = (el) => {
    const text = (el.getAttribute("aria-label") || el.textContent || "").trim().replace(/\s+/g, " ").slice(0, 40);
    return `<${el.tagName.toLowerCase()}> "${text}"`;
  };
  const overflow = document.documentElement.scrollWidth - vw;
  if (overflow > 1) issues.push(`page scrolls sideways by ${overflow}px`);

  const modal = document.querySelector("dialog[open]");
  const scope = modal ?? document;
  const controls = [...scope.querySelectorAll('a[href], button, input:not(.sr-only), [role="switch"], label:has(> input.sr-only)')];

  const scrollerOf = (el) => {
    for (let node = el.parentElement; node; node = node.parentElement) {
      const style = getComputedStyle(node);
      if (/(auto|scroll)/.test(style.overflowX) && node.scrollWidth > node.clientWidth + 1) return node;
    }
    return null;
  };

  for (const el of controls) {
    if (el.closest("[hidden]") || el.closest('[aria-hidden="true"]')) continue;
    // Mapbox's own logo and attribution controls are third-party and kept as Mapbox ships them.
    if (el.closest(".mapboxgl-control-container")) continue;
    const style = getComputedStyle(el);
    if (style.visibility === "hidden" || style.display === "none") continue;
    let r = el.getBoundingClientRect();
    if (r.width === 0 || r.height === 0) continue;
    const scroller = scrollerOf(el);

    if (!scroller && (r.left < -1 || r.right > vw + 1)) issues.push(`off screen: ${describe(el)} x ${Math.round(r.left)}–${Math.round(r.right)}`);

    const inline = style.display === "inline";
    // A field inside a label is targeted through the label; .atlas-hit extends a link's hit area by 6px above and below.
    const target = el.matches("input") && el.closest("label") ? el.closest("label").getBoundingClientRect() : r;
    const extra = el.classList.contains("atlas-hit") ? 12 : 0;
    if (!inline && (target.width < 24 || target.height + extra < 24)) issues.push(`target under 24px: ${describe(el)} ${Math.round(r.width)}x${Math.round(r.height)}`);

    if (scroller) continue; // Rows that scroll sideways reveal their items when scrolled.
    const covered = () => {
      r = el.getBoundingClientRect();
      const x = Math.min(Math.max(r.left + r.width / 2, 0), vw - 1);
      const y = r.top + r.height / 2;
      if (y < 0 || y >= vh) return null;
      const hit = document.elementFromPoint(x, y);
      return hit && !el.contains(hit) && !hit.contains(el) ? hit : null;
    };
    let hit = covered();
    if (hit) {
      el.scrollIntoView({ block: "center", inline: "nearest" });
      hit = covered();
    }
    if (hit) issues.push(`covered: ${describe(el)} under ${describe(hit)}`);
  }
  window.scrollTo(0, 0);
  return issues;
}

async function layoutChecks(browser) {
  console.log("\nLayout");
  for (const viewport of VIEWPORTS) {
    const phone = viewport.width < 768 && viewport.height > viewport.width;
    const context = await browser.newContext({
      viewport: { width: viewport.width, height: viewport.height },
      deviceScaleFactor: viewport.name === "zoom200" ? 2 : 1,
      isMobile: phone,
      hasTouch: phone,
    });
    const page = await context.newPage();
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    let count = 0;
    for (const [route, name] of ROUTES) {
      errors.length = 0;
      const res = await page.goto(BASE + route, { waitUntil: "networkidle" });
      await page.addStyleTag({ content: "nextjs-portal { display: none !important; }" });
      await page.waitForTimeout(route === "/" || route.startsWith("/route") || route.startsWith("/map") ? 1500 : 300);
      if (res?.status() !== 200) fail(`${viewport.name} ${route}: HTTP ${res?.status()}`);
      for (const error of errors) fail(`${viewport.name} ${route}: page error ${error}`);
      const issues = await page.evaluate(auditLayout);
      for (const issue of issues) fail(`${viewport.name} ${route}: ${issue}`);
      if (SHOTS) {
        const dir = join(ROOT, "screenshots", "responsive", viewport.name);
        mkdirSync(dir, { recursive: true });
        await page.screenshot({ path: join(dir, `${name}.png`) });
      }
      count++;
    }
    console.log(`  ${viewport.name}: ${count} routes checked`);
    await context.close();
  }
}

async function journey(browser, name, viewport, run) {
  const context = await browser.newContext({ viewport, isMobile: viewport.width < 768, hasTouch: viewport.width < 768 });
  const page = await context.newPage();
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  try {
    await run(page);
    assert.deepEqual(errors, [], `page errors: ${errors.join("; ")}`);
    console.log(`  ✓ ${name}`);
  } catch (error) {
    fail(`${name}: ${error.message.split("\n")[0]}`);
  } finally {
    await context.close();
  }
}

const go = async (page, route) => {
  await page.goto(BASE + route, { waitUntil: "networkidle" });
  await page.addStyleTag({ content: "nextjs-portal { display: none !important; }" });
};

/** "back by 18:10" in the header and "around 18:10" in the footer must agree. */
async function planTimes(page) {
  const header = await page.getByText(/· back by \d\d:\d\d/).first().textContent();
  const footer = await page.getByText(/· around \d\d:\d\d/).first().textContent();
  return { back: header.match(/\d\d:\d\d/)[0], around: footer.match(/\d\d:\d\d/)[0], header };
}

async function journeys(browser) {
  console.log("\nJourneys");
  const phone = { width: 390, height: 844 };

  await journey(browser, "list search filters approved places, combines with chips, and clears", phone, async (page) => {
    await go(page, "/list");
    const search = page.getByRole("searchbox");
    await search.fill("zzzaudit");
    await page.getByRole("heading", { name: "0 places" }).waitFor();
    await page.getByText("No places match “zzzaudit”").waitFor();
    await search.fill("partner");
    await page.getByRole("heading", { name: "3 places" }).waitFor();
    await page.getByRole("button", { name: /Hotel 2/ }).click();
    await page.getByRole("heading", { name: "0 places" }).waitFor();
    await page.getByRole("button", { name: "Clear search and filters" }).click();
    await page.getByRole("heading", { name: "6 places" }).waitFor();
    await page.getByRole("link", { name: "Map" }).click();
    await page.waitForURL(`${BASE}/`);
  });

  await journey(browser, "preferences carry into planning: 1 h Wellness Budget reaches No partner fits", phone, async (page) => {
    await go(page, "/preferences");
    await page.getByText("1 h", { exact: true }).click();
    await page.getByRole("button", { name: "Food" }).click();
    await page.getByRole("button", { name: "Culture" }).click();
    await page.getByRole("button", { name: "Wellness" }).click();
    await page.getByText("Budget", { exact: true }).click();
    await page.getByText("Now · back by 17:00").waitFor();
    await page.getByRole("link", { name: "Plan my time" }).click();
    await page.getByRole("heading", { name: "Planning your 1 hour…" }).waitFor();
    await page.waitForURL(`${BASE}/no-match`, { timeout: 8000 });
    await page.getByText(/Wellness don't fit in 1 hour/).waitFor();
    assert.equal(await page.getByText("1 h free · Wellness · Budget").count(), 1);
  });

  await journey(browser, "a saved plan shows on My plan with the chosen time, and survives reload", phone, async (page) => {
    await go(page, "/preferences");
    await page.getByText("4 h+", { exact: true }).click();
    await page.getByRole("button", { name: "Wellness" }).click();
    await page.getByRole("link", { name: "Plan my time" }).click();
    await page.waitForURL(`${BASE}/plan/ready`, { timeout: 8000 });
    await page.getByText(/You asked for 4 hours or more/).waitFor();
    assert.equal(await page.getByText("Partner Place 3").count(), 0, "Plan ready must not offer the unavailable partner");
    const readyBack = (await page.getByText(/Back at Hotel A around/).textContent()).match(/\d\d:\d\d/)[0];
    await page.getByRole("button", { name: "Save this plan" }).click();
    await page.waitForURL(`${BASE}/plan`);
    const times = await planTimes(page);
    assert.equal(times.back, readyBack);
    assert.equal(times.around, readyBack);
    await page.reload({ waitUntil: "networkidle" });
    assert.equal((await planTimes(page)).back, readyBack);
  });

  await journey(browser, "adding the pool persists on My plan, times agree, overrun warns, Undo restores", phone, async (page) => {
    await go(page, "/place/pool");
    await page.getByRole("button", { name: "Add to my plan" }).click();
    await page.waitForURL(`${BASE}/plan`);
    await page.getByText("Added the pool to your plan").waitFor();
    const times = await planTimes(page);
    assert.equal(times.back, "19:10");
    assert.equal(times.around, "19:10");
    await page.getByText("This plan now runs past your 2 h free. Remove a stop or re-plan.").waitFor();
    await go(page, "/place/pool");
    await page.getByRole("link", { name: "View in my plan" }).waitFor();
    await go(page, "/plan");
    assert.equal((await planTimes(page)).back, "19:10", "the added stop must survive navigation");
    await go(page, "/place/spa");
    await page.getByRole("button", { name: "Add to my plan" }).click();
    await page.waitForURL(`${BASE}/plan`);
    await page.getByRole("button", { name: "Undo" }).click();
    assert.equal((await planTimes(page)).back, "19:10", "Undo removes only the last change");
  });

  await journey(browser, "a simulated scan checks in the next stop and Achievements agrees", phone, async (page) => {
    await go(page, "/achievements");
    await page.getByText("2 of 5 unlocked").waitFor();
    await go(page, "/scan");
    await page.getByRole("heading", { name: "Partner Place 2" }).waitFor();
    await page.getByRole("link", { name: "Simulate a good scan at Partner Place 2" }).click();
    await page.waitForURL(`${BASE}/unlocked`);
    await page.getByText("[Achievement 3] · Partner Place 2").waitFor();
    await page.getByText(/Saved in this browser \(prototype\)/).waitFor();
    await page.getByRole("link", { name: "See my achievements" }).click();
    await page.getByText("3 of 5 unlocked").waitFor();
    await go(page, "/plan");
    await page.getByText("2 of 3 stops").waitFor();
  });

  await journey(browser, "choosing the next stop reorders My plan", phone, async (page) => {
    await go(page, "/next-stop");
    await page.getByText("Pool", { exact: true }).click();
    await page.getByText("Partner Place 2 moves to after the pool.").waitFor();
    await page.getByRole("button", { name: "Make the pool my next stop" }).click();
    await page.getByText("The pool is your next stop").waitFor();
    await page.getByRole("link", { name: "View my plan" }).click();
    await page.waitForURL(`${BASE}/plan`);
    const nextCard = page.locator("li", { hasText: "Next" }).first();
    await nextCard.getByText("Pool").waitFor();
  });

  await journey(browser, "remove-stop dialog moves focus in, closes on Escape, restores focus, then removes", phone, async (page) => {
    await go(page, "/plan/repair");
    const opener = page.getByRole("button", { name: "Remove this stop" });
    await opener.focus();
    await page.keyboard.press("Enter");
    const dialog = page.getByRole("dialog", { name: "Remove stop 3?" });
    await dialog.waitFor();
    assert.ok(await page.evaluate(() => document.activeElement?.closest("dialog") !== null), "focus moves into the dialog");
    for (let i = 0; i < 5; i++) {
      await page.keyboard.press("Tab");
      assert.ok(await page.evaluate(() => document.activeElement?.closest("dialog") !== null), "focus stays in the dialog");
    }
    await page.keyboard.press("Shift+Tab");
    assert.ok(await page.evaluate(() => document.activeElement?.closest("dialog") !== null), "Shift+Tab stays in the dialog");
    await page.keyboard.press("Escape");
    await dialog.waitFor({ state: "hidden" });
    assert.ok(await page.evaluate(() => document.activeElement?.textContent?.includes("Remove this stop")), "focus returns to the opener");
    await opener.click();
    await dialog.getByRole("button", { name: "Remove stop" }).click();
    await page.waitForURL(`${BASE}/plan`);
    await page.getByText("1 of 2 stops").waitFor();
    assert.equal(await page.getByText("Partner Place 3").count(), 0);
  });

  await journey(browser, "labels match destinations on problem screens and the QR error", phone, async (page) => {
    await go(page, "/scan/already-checked-in");
    await page.getByRole("link", { name: "See achievement" }).click();
    await page.waitForURL(`${BASE}/achievements/achievement-3`);
    await page.getByText("Partner Place 2 · Hotel A").waitFor();
    await go(page, "/scan/place-unavailable");
    await page.getByRole("heading", { name: "Partner Place 3 isn't available anymore" }).waitFor();
    await page.getByRole("link", { name: "Fix this stop" }).click();
    await page.waitForURL(`${BASE}/plan/repair`);
    await page.getByRole("heading", { name: "Partner Place 3 isn't available anymore" }).waitFor();
    await go(page, "/qr-invalid");
    await page.getByRole("button", { name: "Call the front desk" }).click();
    await page.getByText(/Calling isn't connected in this prototype/).waitFor();
    assert.equal(new URL(page.url()).pathname, "/qr-invalid");
  });

  await journey(browser, "the map sheet collapses and expands from its handle", phone, async (page) => {
    await go(page, "/");
    const handle = page.getByRole("button", { name: "Hide places to see more of the map" });
    await handle.click();
    await page.getByRole("button", { name: "Show places" }).waitFor();
    assert.equal(await page.locator("#map-place-cards").isVisible(), false);
    await page.getByRole("button", { name: "Show places" }).click();
    assert.equal(await page.locator("#map-place-cards").isVisible(), true);
  });

  await journey(browser, "keyboard focus is visible on the list", phone, async (page) => {
    await go(page, "/list");
    for (let i = 0; i < 6; i++) await page.keyboard.press("Tab");
    const outline = await page.evaluate(() => {
      const el = document.activeElement;
      const target = el?.matches("input") ? el.closest("label") : el;
      const style = getComputedStyle(target);
      return `${style.outlineStyle} ${style.outlineWidth}`;
    });
    assert.ok(!outline.startsWith("none"), `focused control shows an outline (${outline})`);
  });

  await journey(browser, "wide layout shows the rail and the map panel together", { width: 1440, height: 900 }, async (page) => {
    await go(page, "/");
    await page.getByRole("navigation", { name: "Atlas sections" }).waitFor();
    await page.getByRole("region", { name: "Places" }).getByText("Partner Place 2").first().waitFor();
    const rail = await page.getByRole("navigation", { name: "Atlas sections" }).boundingBox();
    assert.ok(rail && rail.x === 0 && rail.height >= 890, "the rail runs the full height on the left");
  });
}

await waitForServer();
const browser = await chromium.launch({ args: ["--use-angle=swiftshader", "--enable-unsafe-swiftshader"] });
if (ONLY !== "journeys") await layoutChecks(browser);
if (ONLY !== "layout") await journeys(browser);
await browser.close();

console.log(failures.length === 0 ? "\nAll checks passed." : `\n${failures.length} problem(s).`);
process.exit(failures.length === 0 ? 0 : 1);
