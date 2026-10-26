// Unit tests for the prototype's planning model. Run with `npm test` (node --test).
import assert from "node:assert/strict";
import { test } from "node:test";
import {
  DEFAULT_PLAN,
  DEFAULT_PREFERENCES,
  STOPS,
  clock,
  duration,
  matchingStops,
  proposePlan,
  suggestReplacement,
  timePlan,
  unlockedAchievements,
} from "../src/components/atlas-ui/demo/plan-model.ts";

const withUpcoming = (upcoming) => ({ ...DEFAULT_PLAN, upcoming });

test("the default plan reproduces the design's My plan header and footer", () => {
  const timing = timePlan(DEFAULT_PLAN, "2 h");
  assert.equal(clock(timing.returnAt), "18:10");
  assert.equal(duration(timing.left), "1 h 25 min");
  assert.equal(timing.overrun, false);
  assert.equal(timing.doneCount, 1);
  assert.equal(timing.totalCount, 3);
  assert.equal(timing.next?.id, "partner-2");
  assert.equal(timing.next?.position, 2);
  assert.equal(clock(timing.stops[0].arrive), "16:06");
});

test("an unavailable stop is shown but never timed or offered as next", () => {
  const timing = timePlan(DEFAULT_PLAN, "2 h");
  const broken = timing.stops.find((s) => s.id === "partner-3");
  assert.equal(broken?.status, "unavailable");
  assert.equal(broken?.arrive, undefined);
  assert.equal(timePlan(withUpcoming(["partner-3"]), "2 h").next, undefined);
});

test("adding a hotel facility moves the return time and flags the overrun once", () => {
  const pool = timePlan(withUpcoming(["partner-2", "partner-3", "pool"]), "2 h");
  assert.equal(clock(pool.returnAt), "19:10");
  assert.equal(pool.overrun, true);
  const spa = timePlan(withUpcoming(["partner-2", "partner-3", "spa"]), "2 h");
  assert.equal(clock(spa.returnAt), "19:40");
  // The same stop fits a 4 h afternoon.
  assert.equal(timePlan(withUpcoming(["partner-2", "partner-3", "pool"]), "4 h+").overrun, false);
});

test("removing the unavailable stop leaves the timing of real stops unchanged", () => {
  const removed = timePlan(withUpcoming(["partner-2"]), "2 h");
  assert.equal(clock(removed.returnAt), "18:10");
  assert.equal(removed.totalCount, 2);
});

test("the default preferences propose only what fits, never the unavailable partner", () => {
  const proposal = proposePlan(DEFAULT_PREFERENCES, DEFAULT_PLAN.completed);
  assert.equal(proposal.kind, "plan");
  assert.deepEqual(proposal.stops, ["partner-2"]);
  assert.ok(!proposal.stops.includes("partner-3"));
});

test("chosen interests, price and time change the proposal", () => {
  const wellness4h = proposePlan({ time: "4 h+", interests: ["Wellness"], price: "Any" }, DEFAULT_PLAN.completed);
  assert.equal(wellness4h.kind, "plan");
  assert.ok(wellness4h.stops.every((id) => STOPS[id].category === "Wellness"));

  // One hour has already been mostly used by the first stop: nothing more fits.
  const wellness1h = proposePlan({ time: "1 h", interests: ["Wellness"], price: "Budget" }, DEFAULT_PLAN.completed);
  assert.equal(wellness1h.kind, "no-time");

  const nightlife = proposePlan({ time: "2 h", interests: ["Nightlife"], price: "Any" }, DEFAULT_PLAN.completed);
  assert.equal(nightlife.kind, "no-match");

  // Budget excludes the Moderate partner but keeps places without a known price.
  assert.deepEqual(matchingStops({ time: "2 h", interests: ["Food", "Culture"], price: "Budget" }), ["partner-2", "partner-4"]);
});

test("a proposal never re-adds or reorders completed stops", () => {
  const completed = [...DEFAULT_PLAN.completed, { id: "partner-2", at: 17 * 60 + 5 }];
  const proposal = proposePlan({ time: "4 h+", interests: ["Culture", "History"], price: "Any" }, completed);
  assert.equal(proposal.kind, "plan");
  assert.ok(!proposal.stops.includes("partner-1"));
  assert.ok(!proposal.stops.includes("partner-2"));
  const timing = timePlan({ planned: true, completed, upcoming: proposal.stops }, "4 h+");
  assert.equal(timing.stops[0].id, "partner-1");
  assert.equal(timing.stops[1].id, "partner-2");
  assert.equal(timing.stops[1].status, "done");
});

test("the repair suggestion is an available, matching place not already planned", () => {
  const suggestion = suggestReplacement(DEFAULT_PLAN, DEFAULT_PREFERENCES, "2 h");
  assert.equal(suggestion, "partner-4");
  assert.equal(STOPS[suggestion].available, true);
});

test("achievements follow check-ins: the spa's from yesterday plus each checked-in stop", () => {
  assert.deepEqual(unlockedAchievements(DEFAULT_PLAN), ["achievement-2", "achievement-1"]);
  const afterScan = { ...DEFAULT_PLAN, completed: [...DEFAULT_PLAN.completed, { id: "partner-2", at: 17 * 60 + 5 }] };
  assert.deepEqual(unlockedAchievements(afterScan), ["achievement-2", "achievement-1", "achievement-3"]);
  // A stop with no achievement unlocks nothing.
  const afterPool = { ...DEFAULT_PLAN, completed: [...DEFAULT_PLAN.completed, { id: "pool", at: 17 * 60 + 5 }] };
  assert.equal(unlockedAchievements(afterPool).length, 2);
});
