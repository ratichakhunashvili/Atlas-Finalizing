import { AtlasIcon } from "@/components/atlas-ui/asset";
import {
  AboutBlock,
  DetailActions,
  DetailBody,
  DetailHero,
  DetailScreen,
  DetailTitle,
  FactCards,
  InfoRows,
  SourceRow,
} from "@/components/atlas-ui/place-detail";
import { AtlasButton } from "@/components/atlas-ui/ui";

/* AttractionDetail · Attraction details — Figma frame 1:925. Unlocked with the camera view, not a code. */

export default function AttractionPage() {
  return (
    <DetailScreen
      actions={
        <DetailActions
          tall
          secondary={{ to: "RouteA1", icon: "/atlas-ui/icon-route-teal-22.svg", iconSize: 22, label: "Directions" }}
          primary={{ to: "MyPlanAddedA1", label: "Add to my plan" }}
        />
      }
    >
      <DetailHero photo={{ src: "/atlas-ui/hero-attraction-1.jpg", width: 780, height: 520 }} />
      <DetailBody variant="place">
        <DetailTitle eyebrow="Attraction · History" name="Attraction 1" gap={6}>
          <SourceRow icon="/atlas-ui/icon-check-teal-16.svg">Recommended by Hotel A</SourceRow>
        </DetailTitle>
        <FactCards
          facts={[
            { label: "Walk", value: "20 min", note: "1.5 km" },
            { label: "Visit", value: "45 min", note: "typical" },
            { label: "Entry", value: "[entry]", note: "if known" },
          ]}
        />
        <AboutBlock text="[What the guest will see and why it matters, from a verified description.]" />
        <InfoRows
          rows={[
            { icon: "/atlas-ui/icon-clock.svg", label: "Opening hours", value: "[Hours, when known]" },
            { icon: "/atlas-ui/icon-pin-ink-18.svg", label: "Where", value: "[Address], Tbilisi" },
          ]}
        />
        <section className="flex w-full flex-col items-start gap-[10px] rounded-[16px] border border-atlas-teal p-[16px]">
          <div className="flex w-full items-center gap-[12px]">
            <span className="flex size-[44px] shrink-0 items-center justify-center rounded-[22px] bg-atlas-teal">
              <AtlasIcon src="/atlas-ui/icon-ach-light-20.svg" size={20} />
            </span>
            <span className="flex min-w-0 flex-1 flex-col items-start gap-[2px] whitespace-nowrap">
              <span className="font-grotesk text-[16px] font-bold leading-[20px] text-atlas-teal">[Achievement 4]</span>
              <span className="font-manrope text-[13px] leading-[18px] text-atlas-slate">Not unlocked yet</span>
            </span>
          </div>
          <p className="w-full font-manrope text-[14px] leading-[1.55] text-atlas-ink">
            When you are there, open the camera view and find the marker. There is no code to scan here.
          </p>
          <AtlasButton to="ARUnlock" tone="outline" icon="/atlas-ui/icon-camera-teal-19.svg">
            Open camera view
          </AtlasButton>
          <p className="w-full text-center font-manrope text-[13px] leading-[18px] text-atlas-slate">
            Works within about 50 m. No camera? You can unlock with your location.
          </p>
        </section>
      </DetailBody>
    </DetailScreen>
  );
}
