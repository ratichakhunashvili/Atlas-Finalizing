import { SCAN_PROBLEMS } from "@/components/atlas-ui/scan-problems";
import { ScanProblemScreen } from "@/components/atlas-ui/scan-screens";

/* ScanProblemWrong · Check-in problem · Wrong code — Figma frame 1:1059. */

export default function Page() {
  return <ScanProblemScreen problem={SCAN_PROBLEMS.wrongCode} />;
}
