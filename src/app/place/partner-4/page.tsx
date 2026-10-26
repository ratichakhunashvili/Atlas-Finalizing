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

/* DetailP4 · Partner Place 4 (not in plan) — Figma frame 1:1867. Check-in stays off until it is planned. */

export default function PartnerPlace4Page() {
  return (
    <DetailScreen
      actions={
        <DetailActions
          secondary={{ to: "RouteP4", icon: "/atlas-ui/icon-route-teal.svg", iconSize: 20, label: "Directions" }}
          primary={{ to: "MyPlanAddedP4", label: "Add to my plan" }}
        />
      }
    >
      <DetailHero photo={{ src: "/atlas-ui/hero-partner-4.jpg", width: 780, height: 585 }} counter="1 / 4" />
      <DetailBody variant="partner">
        <DetailTitle eyebrow="Partner · Culture" name="Partner Place 4" gap={4}>
          <ApprovalRow chip={<PlanChip tone="sand">Not in today&apos;s plan</PlanChip>} />
        </DetailTitle>
        <FactStrip
          facts={[
            { label: "Walk", value: "14 min" },
            { label: "Visit", value: "60 min" },
          ]}
        />
        <WhyThis reason="Culture, and it fits your 2 h with the walk back." allBold />
        <PartnerAbout />
        <InfoRows
          rows={[
            { icon: "/atlas-ui/icon-clock.svg", label: "Opening hours", value: "[Hours, when the partner provides them]" },
            { icon: "/atlas-ui/icon-pin-ink-18.svg", label: "Address", value: "[Street address], Tbilisi" },
          ]}
        />
        <PartnerAchievement
          title="[Achievement 5]"
          line="Add it to today's plan, then scan the code there"
          action={<ScanAction enabled={false} />}
          footer={
            <p className="flex h-[36px] items-center font-manrope text-[13px] leading-[18px] text-atlas-slate">
              Check-in only works for stops in today&apos;s plan.
            </p>
          }
        />
      </DetailBody>
    </DetailScreen>
  );
}
