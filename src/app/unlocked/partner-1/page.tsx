import { UNLOCKED_STATES, UnlockedScreen } from "@/components/atlas-ui/unlocked";

/* UnlockedP1 · Unlocked at Partner Place 1, then choose the next stop — Figma frame 1:5064. */

export default function Page() {
  return <UnlockedScreen state={UNLOCKED_STATES.partner1} />;
}
