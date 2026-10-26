import { AtlasAsset, AtlasIcon } from "./asset";
import type { Photo } from "./fixtures";
import { PriceLevel } from "./place-card";
import type { ScreenKey } from "./screens";
import { AtlasBackButton, AtlasButton, FlowScreen, Spacer, type } from "./ui";

/*
 * Repair · Fix an unavailable stop — Figma frame 1:778.
 *
 * A stop whose partnership ended can't stay in the plan. The suggested replacement must be one of
 * Hotel A's own approved partners — here Partner Place 4 — never an unapproved nearby business.
 */

export function RepairStop({ photo, replaceTo }: { photo?: Photo; replaceTo: ScreenKey }) {
  return (
    <FlowScreen className="!px-[16px] !pb-[24px]">
      <AtlasBackButton to="MyPlan" />
      <div className="flex w-full flex-col items-start gap-[8px]">
        <p className={type.eyebrow}>Stop 3</p>
        <h1 className="w-full font-grotesk text-[26px] font-bold leading-[30px] text-atlas-teal">Partner Place 3 isn&apos;t available anymore</h1>
        <p className={`w-full ${type.body} text-atlas-ink`}>
          It&apos;s no longer offered for Hotel A guests. Choose what to do with this stop. Your other stops stay as they are.
        </p>
      </div>

      <section className="flex w-full flex-col items-start gap-[10px]">
        <h2 className="font-grotesk text-[17px] font-bold leading-[22px] text-atlas-teal">Suggested instead</h2>
        <div className="flex w-full items-start gap-[12px] rounded-[16px] border-2 border-atlas-teal p-[12px]">
          {photo ? (
            <span className="relative size-[72px] shrink-0 overflow-hidden rounded-[12px] bg-atlas-beige">
              <AtlasAsset src={photo.src} width={photo.width} height={photo.height} className="absolute inset-0 size-full object-cover" />
            </span>
          ) : (
            <span className="flex size-[72px] shrink-0 items-center justify-center rounded-[12px] bg-atlas-beige font-manrope text-[11px] leading-[15px] text-atlas-ink">
              Photo
            </span>
          )}
          <span className="flex min-w-0 flex-1 flex-col items-start gap-[4px]">
            <span className={type.eyebrow}>Partner · Culture</span>
            <span className="whitespace-nowrap font-grotesk text-[17px] font-bold leading-[22px] text-atlas-teal">Partner Place 4</span>
            <span className="flex w-full flex-wrap items-center gap-[6px]">
              <span className="whitespace-nowrap font-manrope text-[13px] leading-[18px] text-atlas-ink">9 min from Stop 2 · 60 min</span>
              <PriceLevel price="Budget" />
            </span>
            <span className="w-full font-manrope text-[12px] leading-[16px] text-atlas-slate">You&apos;d still be back by about 18:15</span>
          </span>
        </div>
      </section>

      <div className="flex w-full items-start gap-[10px]">
        <AtlasIcon src="/atlas-ui/icon-info-slate.svg" size={18} className="shrink-0" />
        <p className="min-w-0 flex-1 font-manrope text-[13px] leading-[1.5] text-atlas-slate">
          Places you&apos;ve already checked in at won&apos;t change, and their achievements stay unlocked.
        </p>
      </div>

      <Spacer />
      <div className="flex w-full flex-col items-start gap-[8px]">
        <AtlasButton to={replaceTo}>Replace with Partner Place 4</AtlasButton>
        <AtlasButton to="RepairConfirm" tone="outline">
          Remove this stop
        </AtlasButton>
      </div>
    </FlowScreen>
  );
}
