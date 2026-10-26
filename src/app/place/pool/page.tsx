import { FacilityDetail, NoAchievementNote } from "@/components/atlas-ui/facility-detail";

/* FacilityPool · Pool (hotel facility) — Figma frame 1:1933. */

export default function PoolPage() {
  return (
    <FacilityDetail
      name="Pool"
      photo={{ src: "/atlas-ui/hero-pool.jpg", width: 780, height: 520 }}
      where="Rooftop"
      visit="60 min"
      about="[What the pool offers and when it is open, from Hotel A.]"
      booking="Towels at the pool desk. Atlas does not take bookings."
      addTo="MyPlanAddedPool"
      extra={<NoAchievementNote />}
    />
  );
}
