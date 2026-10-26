import { RepairStop } from "@/components/atlas-ui/repair-stop";

/* Repair · Fix an unavailable stop — Figma frame 1:778. */

export default function RepairPage() {
  return (
    <main>
      <RepairStop photo={{ src: "/atlas-ui/list-partner-4.jpg", width: 479, height: 378 }} replaceTo="MyPlanReplaced" />
    </main>
  );
}
