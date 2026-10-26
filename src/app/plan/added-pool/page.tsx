import { MyPlan, PLAN_STATES } from "@/components/atlas-ui/my-plan";

/* MyPlanAddedPool · My plan with the pool added — Figma frame 1:2499. */

export default function Page() {
  return <MyPlan state={PLAN_STATES.addedPool} />;
}
