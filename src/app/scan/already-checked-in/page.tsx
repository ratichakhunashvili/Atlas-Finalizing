import { SCAN_PROBLEMS } from "@/components/atlas-ui/scan-problems";
import { ScanProblemScreen } from "@/components/atlas-ui/scan-screens";

/* ScanProblemDone · Check-in problem · Already checked in — Figma frame 1:1076. */

export default function Page() {
  return <ScanProblemScreen problem={SCAN_PROBLEMS.alreadyDone} />;
}
