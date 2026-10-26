import { SCAN_PROBLEMS } from "@/components/atlas-ui/scan-problems";
import { ScanProblemScreen } from "@/components/atlas-ui/scan-screens";

/* ScanProblem · Check-in problem · Not close enough — Figma frame 1:1042. */

export default function Page() {
  return <ScanProblemScreen problem={SCAN_PROBLEMS.notClose} />;
}
