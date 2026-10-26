import { MyPlan, PLAN_STATES } from "@/components/atlas-ui/my-plan";

/* MyPlanRemoved · My plan after removing stop 3 — Figma frame 1:2285. */

export default function Page() {
  return <MyPlan state={PLAN_STATES.removed} />;
}
