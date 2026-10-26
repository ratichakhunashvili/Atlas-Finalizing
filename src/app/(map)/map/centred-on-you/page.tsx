import { MissionsMap } from "@/components/atlas-ui/map/missions-map";

/* Toast · Centred on your location — Figma frame 1:5054, shown over the home map. */

export default function CentredOnYouPage() {
  return <MissionsMap initialToast="you" />;
}
