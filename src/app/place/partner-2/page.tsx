import {
  ApprovalRow,
  DetailActions,
  DetailBody,
  DetailHero,
  DetailScreen,
  DetailTitle,
  FactStrip,
  InfoRows,
  PartnerAbout,
  PartnerAchievement,
  PlanChip,
  ScanAction,
  WhyThis,
} from "@/components/atlas-ui/place-detail";
import { AtlasLink } from "@/components/atlas-ui/ui";

/* Detail · Place details (Partner Place 2) — Figma frame 1:280. The next stop in today's plan. */

export default function PartnerPlace2Page() {
  return (
    <DetailScreen
      actions={
        <DetailActions
          secondary={{ to: "MyPlan", icon: "/atlas-ui/icon-list-teal-20.svg", iconSize: 20, label: "My plan" }}
          primary={{ to: "Route", label: "Get directions", icon: "/atlas-ui/icon-route-light.svg" }}
        />
      }
    >
      <DetailHero photo={{ src: "/atlas-ui/hero-partner-2.jpg", width: 780, height: 520 }} counter="1 / 4" />
      <DetailBody variant="partner">
        <DetailTitle eyebrow="Partner · Culture" name="Partner Place 2" gap={4}>
          <ApprovalRow chip={<PlanChip tone="teal" to="MyPlan">Stop 2 today ›</PlanChip>} />
        </DetailTitle>
        <FactStrip
          facts={[
            { label: "Walk", value: "11 min" },
            { label: "Visit", value: "60 min" },
            { label: "Price level", value: "Budget" },
          ]}
        />
        <WhyThis reason="Culture, fits your 2 h with the walk back, Budget price level." />
        <PartnerAbout />
        <InfoRows
          rows={[
            { icon: "/atlas-ui/icon-clock.svg", label: "Opening hours", value: "[Hours, when the partner provides them]" },
            { icon: "/atlas-ui/icon-pin-ink-18.svg", label: "Address", value: "[Street address], Tbilisi" },
          ]}
        />
        <PartnerAchievement
          title="[Achievement 3]"
          line="Scan the code at the counter to unlock"
          action={<ScanAction enabled />}
          footer={
            <AtlasLink to="Unlocked" className="flex h-[36px] items-center font-manrope text-[13px] font-semibold leading-[18px] text-atlas-teal">
              No code there? Check in with your location
            </AtlasLink>
          }
        />
      </DetailBody>
    </DetailScreen>
  );
}
