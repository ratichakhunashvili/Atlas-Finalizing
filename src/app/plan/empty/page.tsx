import { AtlasAsset } from "@/components/atlas-ui/asset";
import { MissionsShell } from "@/components/atlas-ui/my-plan";
import { AtlasButton, AtlasTextLink, type } from "@/components/atlas-ui/ui";

/* MyPlanEmpty · Missions › My plan (empty) — Figma frame 1:1195. Before any plan exists. */

export default function MyPlanEmptyPage() {
  return (
    <MissionsShell gap={14} paddingBottom={24}>
      <div className="flex min-h-px w-full flex-1 flex-col items-start justify-center gap-[16px]">
        <AtlasAsset src="/atlas-ui/pattern-teal-wave.svg" width={366} height={130} />
        <h1 className={`w-full ${type.title}`}>No plan for today yet</h1>
        <p className={`w-full ${type.body} text-atlas-slate`}>
          Tell us how much time you have and we will build a walking route from Hotel A and back.
        </p>
      </div>
      <AtlasButton to="Preferences">Plan my free time</AtlasButton>
      <AtlasTextLink to="Main">Browse places instead</AtlasTextLink>
    </MissionsShell>
  );
}
