import { AchievementDetailScreen } from "@/components/atlas-ui/achievement-detail";

/* AchievementDetailP1 · Achievement 1 details — Figma frame 1:1983. */

export default function Achievement1Page() {
  return (
    <AchievementDetailScreen
      title="[Achievement 1]"
      place="Partner Place 1 · Hotel A"
      when="Today, 16:12"
      how="Scanned the code at the counter"
      viewLabel="View Partner Place 1"
      viewTo="DetailP1"
    />
  );
}
