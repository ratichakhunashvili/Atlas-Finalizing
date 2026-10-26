import { RepairStop } from "@/components/atlas-ui/repair-stop";
import { AtlasButton, AtlasTextLink } from "@/components/atlas-ui/ui";

/*
 * RepairConfirm · Remove stop confirmation — Figma frame 1:1423. The repair screen under a dimmed
 * overlay, with a bottom-sheet confirmation. Removing can be undone from My plan for a few seconds.
 */

export default function RepairConfirmPage() {
  return (
    <main className="relative">
      <div aria-hidden inert>
        <RepairStop replaceTo="MyPlan" />
      </div>
      <div aria-hidden className="fixed inset-0 z-20 mx-auto max-w-[390px] bg-atlas-ink/50" />
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="remove-stop-title"
        className="fixed bottom-0 left-0 right-0 z-30 mx-auto flex max-w-[390px] flex-col items-start gap-[12px] rounded-t-[24px] bg-atlas-paper px-[20px] pb-[28px] pt-[24px]"
      >
        <h2 id="remove-stop-title" className="font-grotesk text-[20px] font-bold leading-[26px] text-atlas-ink">
          Remove stop 3?
        </h2>
        <p className="w-full font-manrope text-[15px] leading-[23px] text-atlas-ink">
          Your plan will go from Partner Place 2 straight back to Hotel A. You can undo this for a few seconds.
        </p>
        <AtlasButton to="MyPlanRemoved">Remove stop</AtlasButton>
        <AtlasTextLink to="Repair">Keep it</AtlasTextLink>
      </section>
    </main>
  );
}
