import { AtlasAsset } from "@/components/atlas-ui/asset";
import { AdvanceAfter } from "@/components/atlas-ui/advance-after";
import { AtlasBackButton, FlowScreen, type } from "@/components/atlas-ui/ui";

/*
 * PlanBuild · Building a plan (loading) — Figma frame 1:1144.
 *
 * The real screen waits for the planner. Until that exists it moves on to "Plan ready" after a
 * moment, so the prototype flow can be walked end to end.
 */

export default function PlanBuildingPage() {
  return (
    <main>
      <AdvanceAfter to="PlanBuildDone" ms={2400} />
      <FlowScreen gap={14}>
        <AtlasBackButton to="Preferences" />
        <div role="status" aria-live="polite" className="flex min-h-px w-full flex-1 flex-col items-center justify-center gap-[18px]">
          <AtlasAsset src="/atlas-ui/spinner-plan.svg" width={120} height={120} className="motion-safe:animate-[spin_1.6s_linear_infinite]" />
          <h1 className={`w-full text-center ${type.title}`}>Planning your 2 hours…</h1>
          <p className={`w-full text-center ${type.body} text-atlas-slate`}>
            Checking Hotel A&apos;s approved places, walk times and your way back.
          </p>
        </div>
      </FlowScreen>
    </main>
  );
}
