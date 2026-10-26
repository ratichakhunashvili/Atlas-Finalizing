import { AtlasIcon } from "@/components/atlas-ui/asset";
import { AtlasButton, FlowScreen, type } from "@/components/atlas-ui/ui";

/* CheckedIn · Checked in (no achievement) — Figma frame 1:1024. A stop like the pool, with nothing to unlock. */

export default function CheckedInPage() {
  return (
    <main>
      <FlowScreen>
        <div role="status" className="flex min-h-px w-full flex-1 flex-col items-center justify-center gap-[14px]">
          <span className="flex size-[96px] items-center justify-center rounded-[48px] bg-atlas-teal">
            <AtlasIcon src="/atlas-ui/icon-check-light-43.svg" size={43} />
          </span>
          <p className={type.eyebrow}>Checked in</p>
          <h1 className="w-full text-center font-grotesk text-[26px] font-bold leading-[30px] text-atlas-teal">You are at the Pool</h1>
          <p className="whitespace-nowrap font-manrope text-[15px] leading-[20px] text-atlas-slate">Today, 17:05 · Hotel A</p>
          <p className="w-full text-center font-manrope text-[14px] leading-[1.5] text-atlas-ink">
            This stop has no achievement, but it is marked as visited in your plan.
          </p>
        </div>
        <div className="flex w-full items-center gap-[12px] rounded-[16px] border border-atlas-beige p-[14px]">
          <span className="flex size-[36px] shrink-0 items-center justify-center rounded-[18px] border-2 border-atlas-teal font-manrope text-[14px] font-semibold leading-[19px] text-atlas-teal">
            2
          </span>
          <span className="flex min-w-0 flex-1 flex-col items-start gap-[2px] whitespace-nowrap">
            <span className="font-manrope text-[12px] leading-[16px] text-atlas-slate">Next in your plan</span>
            <span className="font-manrope text-[15px] font-semibold leading-[20px] text-atlas-ink">Partner Place 2 · 11 min walk</span>
          </span>
        </div>
        <AtlasButton to="MyPlan">Continue</AtlasButton>
      </FlowScreen>
    </main>
  );
}
