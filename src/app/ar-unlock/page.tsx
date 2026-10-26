import { AtlasAsset, AtlasIcon } from "@/components/atlas-ui/asset";
import { AtlasButton, AtlasLink } from "@/components/atlas-ui/ui";

/*
 * ARUnlock · AR unlock (attraction) — Figma frame 1:436.
 *
 * The camera view is the design's illustration standing in for the live camera. Tapping the
 * marker simulates finding it, as the prototype does. The location is checked once, on unlock.
 */

export default function ArUnlockPage() {
  return (
    <main className="relative h-[100dvh] w-full overflow-hidden bg-atlas-night">
      <AtlasAsset src="/atlas-ui/ar-camera-view.svg" width={390} height={844} className="pointer-events-none absolute left-0 top-0" />
      <p aria-hidden className="absolute left-0 right-0 top-[520px] text-center font-manrope text-[12px] leading-[16px] text-atlas-mist">
        [Live camera view]
      </p>

      <AtlasLink
        to="AttractionDetail"
        label="Close the camera view"
        className="absolute left-[16px] top-[16px] flex size-[44px] items-center justify-center rounded-[12px] bg-atlas-ink/75"
      >
        <AtlasIcon src="/atlas-ui/icon-close-light.svg" size={20} />
      </AtlasLink>
      <p className="absolute right-[16px] top-[16px] flex items-center gap-[8px] rounded-[18px] bg-atlas-ink/75 px-[14px] py-[8px] font-manrope text-[13px] leading-[18px] text-atlas-paper">
        <AtlasIcon src="/atlas-ui/icon-pin-light-16.svg" size={16} />
        In range · location accurate to 12 m
      </p>

      <div className="absolute left-[24px] right-[24px] top-[88px] flex flex-col items-center gap-[4px] whitespace-nowrap">
        <p className="font-grotesk text-[11px] font-medium uppercase leading-[14px] tracking-[0.88px] text-atlas-beige">You&apos;re here</p>
        <h1 className="font-grotesk text-[22px] font-bold leading-[28px] text-atlas-paper">Attraction 1</h1>
      </div>

      <AtlasLink to="UnlockedA1" className="absolute left-1/2 top-[196px] flex w-[140px] -translate-x-1/2 flex-col items-center gap-[8px]">
        <span className="flex size-[88px] items-center justify-center rounded-[44px] bg-atlas-paper/18">
          <span className="flex size-[70px] items-center justify-center rounded-[35px] bg-atlas-bronze">
            <span className="flex size-[64px] items-center justify-center rounded-[32px] border-[3px] border-atlas-paper bg-atlas-teal">
              <AtlasIcon src="/atlas-ui/icon-star-light-28.svg" size={28} />
            </span>
          </span>
        </span>
        <span className="rounded-[14px] bg-atlas-paper px-[12px] py-[6px] font-manrope text-[14px] font-semibold leading-[19px] text-atlas-teal">
          Tap to unlock
        </span>
      </AtlasLink>

      <section className="absolute bottom-0 left-0 right-0 flex flex-col items-start gap-[12px] rounded-t-[24px] bg-atlas-paper px-[16px] pb-[28px] pt-[20px]">
        <h2 className="font-grotesk text-[17px] font-bold leading-[22px] text-atlas-teal">Look around for the marker</h2>
        <p className="w-full font-manrope text-[14px] leading-[1.55] text-atlas-slate">
          Turn slowly toward Attraction 1. The marker shows its direction; it may drift a little.
        </p>
        <AtlasButton to="UnlockedA1" tone="outline">
          Unlock without camera
        </AtlasButton>
        <p className="w-full text-center font-manrope text-[12px] leading-[1.5] text-atlas-slate">
          Camera stays on your phone. Your location is checked once, when you unlock.
        </p>
      </section>
    </main>
  );
}
