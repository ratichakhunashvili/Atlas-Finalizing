import { AtlasIcon } from "@/components/atlas-ui/asset";
import { AtlasBackButton, AtlasButton, AtlasTextLink, FlowScreen, Spacer, type } from "@/components/atlas-ui/ui";

/*
 * PlanBuildDone · Plan ready — Figma frame 1:1156.
 *
 * When fewer approved places fit than the time allows, the plan is simply shorter, and the screen
 * says so. It never pads the plan with places Hotel A has not approved.
 */

function Note({ children }: { children: string }) {
  return (
    <div className="flex w-full items-start gap-[10px]">
      <AtlasIcon src="/atlas-ui/icon-info-slate.svg" size={18} className="shrink-0" />
      <p className="min-w-0 flex-1 font-manrope text-[13px] leading-[1.5] text-atlas-slate">{children}</p>
    </div>
  );
}

function Stop({ n, name, meta }: { n: number; name: string; meta: string }) {
  return (
    <div className="flex w-full items-center gap-[12px] rounded-[14px] border border-atlas-beige p-[12px]">
      <span className="flex size-[32px] shrink-0 items-center justify-center rounded-[16px] bg-atlas-teal font-manrope text-[15px] font-semibold leading-[20px] text-atlas-paper">
        {n}
      </span>
      <span className="flex min-w-0 flex-1 flex-col items-start gap-[2px]">
        <span className="whitespace-nowrap font-manrope text-[15px] font-semibold leading-[20px] text-atlas-ink">{name}</span>
        <span className="w-full font-manrope text-[13px] leading-[18px] text-atlas-slate">{meta}</span>
      </span>
    </div>
  );
}

export default function PlanReadyPage() {
  return (
    <main>
      <FlowScreen gap={14}>
        <AtlasBackButton to="Preferences" />
        <div className="flex w-full flex-col items-start gap-[8px]">
          <p className={type.eyebrow}>Your plan for today</p>
          <h1 className={`w-full ${type.title}`}>We found 2 stops that fit</h1>
          <Note>
            You asked for 2 hours. Only 2 approved places fit with time to walk back to Hotel A, so the plan is shorter.
          </Note>
        </div>
        <div className="flex w-full flex-col items-start gap-[10px]">
          <Stop n={2} name="Partner Place 2" meta="11 min walk · 60 min · Budget" />
          <Stop n={3} name="Partner Place 3" meta="9 min walk · 40 min" />
          <div className="flex w-full items-center gap-[12px] px-[12px] py-[4px]">
            <AtlasIcon src="/atlas-ui/icon-home-slate-20.svg" size={20} className="shrink-0" />
            <p className="whitespace-nowrap font-manrope text-[14px] leading-[19px] text-atlas-slate">Back at Hotel A around 18:10</p>
          </div>
        </div>
        <Note>
          Partner Place 1, where you checked in earlier, stays as stop 1. Saving replaces only the stops you have not visited yet.
        </Note>
        <Spacer />
        <div className="flex w-full flex-col items-start gap-[6px]">
          <AtlasButton to="MyPlan">Save this plan</AtlasButton>
          <AtlasTextLink to="Preferences">Change time or interests</AtlasTextLink>
        </div>
      </FlowScreen>
    </main>
  );
}
