import { AtlasAsset, AtlasIcon } from "./asset";
import type { ScreenKey } from "./screens";
import { AtlasButton, AtlasTextLink } from "./ui";

/*
 * Unlocked · Achievement unlocked — Figma frame 1:466 — and its UnlockedA1 (2018) and UnlockedP1
 * (5064) variants. Achievements are unlocks, not points: the screen names the achievement and
 * where it was earned, then points to what comes next in the plan.
 */

export type UnlockedState = {
  achievement: string;
  next: { step: number; label: string; text: string };
  action: { label: string; to: ScreenKey };
};

export function UnlockedScreen({ state }: { state: UnlockedState }) {
  return (
    <main className="relative flex min-h-[100dvh] w-full flex-col items-start bg-atlas-teal">
      <AtlasAsset src="/atlas-ui/pattern-beige-wave-2.svg" width={390} height={139} className="pointer-events-none absolute left-0 top-[36px] opacity-45" />

      <div role="status" className="relative flex min-h-px w-full flex-1 flex-col items-center justify-center gap-[16px] px-[24px] pt-[120px]">
        <span className="flex size-[112px] shrink-0 items-center justify-center rounded-[56px] border-[6px] border-atlas-bronze/60 bg-atlas-paper">
          <AtlasIcon src="/atlas-ui/icon-ach-teal-52.svg" size={52} />
        </span>
        <p className="font-grotesk text-[12px] uppercase leading-[15px] tracking-[1.2px] text-atlas-beige">Achievement unlocked</p>
        <h1 className="w-full text-center font-grotesk text-[30px] font-bold leading-[34px] text-atlas-paper">You made it part of your journey.</h1>
        <p className="whitespace-nowrap font-manrope text-[16px] leading-[22px] text-atlas-linen">{state.achievement}</p>
        <p className="whitespace-nowrap font-manrope text-[13px] leading-[18px] text-atlas-beige">[Date], [time] · Saved to your achievements</p>
      </div>

      <div className="relative w-full px-[16px]">
        <div className="flex w-full items-center gap-[12px] rounded-[16px] border border-atlas-beige/40 bg-atlas-paper/10 p-[14px]">
          <span className="flex size-[36px] shrink-0 items-center justify-center rounded-[18px] border-2 border-atlas-beige font-manrope text-[14px] font-semibold leading-[19px] text-atlas-paper">
            {state.next.step}
          </span>
          <span className="flex min-w-0 flex-1 flex-col items-start gap-[2px]">
            <span className="whitespace-nowrap font-manrope text-[12px] leading-[16px] text-atlas-beige">{state.next.label}</span>
            <span className="w-full font-manrope text-[15px] font-semibold leading-[20px] text-atlas-paper">{state.next.text}</span>
          </span>
        </div>
      </div>

      <div className="relative flex w-full flex-col items-start gap-[8px] px-[16px] pb-[28px] pt-[16px]">
        <AtlasButton to={state.action.to} tone="light">
          {state.action.label}
        </AtlasButton>
        <AtlasTextLink to="Achievements" className="!text-atlas-paper">
          See my achievements
        </AtlasTextLink>
      </div>
    </main>
  );
}

const NEXT_IN_PLAN = { step: 2, label: "Next in your plan", text: "Partner Place 2 · 11 min walk" };

export const UNLOCKED_STATES = {
  partner2: {
    achievement: "[Achievement 3] · Partner Place 2",
    next: { step: 3, label: "Next stop needs attention", text: "Partner Place 3 isn't available anymore" },
    action: { label: "Fix stop 3", to: "Repair" },
  },
  attraction1: {
    achievement: "[Achievement 4] · Attraction 1",
    next: NEXT_IN_PLAN,
    action: { label: "Back to my plan", to: "MyPlan" },
  },
  partner1: {
    achievement: "[Achievement 1] · Partner Place 1",
    next: NEXT_IN_PLAN,
    action: { label: "Choose next stop", to: "NextPath" },
  },
} satisfies Record<string, UnlockedState>;
