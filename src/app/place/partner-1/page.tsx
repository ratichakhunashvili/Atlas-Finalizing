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
  ViewAction,
  WhyThis,
} from "@/components/atlas-ui/place-detail";

/* DetailP1 · Partner Place 1 (visited today) — Figma frame 1:1799. */

export default function PartnerPlace1Page() {
  return (
    <DetailScreen
      actions={
        <DetailActions
          secondary={{ to: "RouteP1", icon: "/atlas-ui/icon-route-teal.svg", iconSize: 20, label: "Directions" }}
          primary={{ to: "MyPlan", label: "Back to my plan", icon: "/atlas-ui/icon-list-light-19.svg" }}
        />
      }
    >
      <DetailHero photo={{ src: "/atlas-ui/hero-partner-1.jpg", width: 520, height: 780 }} counter="1 / 4" />
      <DetailBody variant="partner">
        <DetailTitle eyebrow="Partner · Food" name="Partner Place 1" gap={4}>
          <ApprovalRow chip={<PlanChip tone="sand" to="MyPlan">Visited today ✓</PlanChip>} />
        </DetailTitle>
        <FactStrip
          facts={[
            { label: "Walk", value: "6 min" },
            { label: "Visit", value: "45 min" },
            { label: "Price level", value: "Moderate" },
          ]}
        />
        <WhyThis reason="Food, fits your 2 h with the walk back, Moderate price level." allBold />
        <PartnerAbout />
        <InfoRows
          rows={[
            { icon: "/atlas-ui/icon-clock.svg", label: "Opening hours", value: "[Hours, when the partner provides them]" },
            { icon: "/atlas-ui/icon-pin-ink-18.svg", label: "Address", value: "[Street address], Tbilisi" },
          ]}
        />
        <PartnerAchievement title="[Achievement 1]" line="Unlocked today at 16:12" action={<ViewAction to="AchievementDetailP1" />} />
      </DetailBody>
    </DetailScreen>
  );
}
