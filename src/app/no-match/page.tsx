import { AtlasBottomBar } from "@/components/atlas-ui/bottom-bar";
import { PLACES } from "@/components/atlas-ui/fixtures";
import { ContextHeader, PlanSegment } from "@/components/atlas-ui/missions-chrome";
import { PlaceRow } from "@/components/atlas-ui/place-row";
import { AtlasButton, AtlasLink } from "@/components/atlas-ui/ui";

/*
 * NoMatch · Missions › No partner fits — Figma frame 1:352.
 *
 * When no partner approved by the guest's hotel fits, Atlas says so plainly, offers ways to widen
 * the search, and shows the hotel's own facilities. It never substitutes a business that is not
 * one of Hotel A's approved partners.
 */

function Option({ to, label, count }: { to: "Preferences" | "List"; label: string; count: string }) {
  return (
    <AtlasLink
      to={to}
      className="flex h-[48px] w-full items-center justify-between whitespace-nowrap rounded-[12px] border border-atlas-beige px-[14px] font-manrope text-[14px] leading-[19px]"
    >
      <span className="text-atlas-ink">{label}</span>
      <span className="font-semibold text-atlas-teal">{count}</span>
    </AtlasLink>
  );
}

export default function NoMatchPage() {
  return (
    <main className="relative flex min-h-[100dvh] w-full flex-col bg-atlas-paper">
      <div className="flex w-full flex-1 flex-col items-start gap-[14px] px-[16px] py-[12px]">
        <ContextHeader summary="Nightlife · 2 h free" />
        <PlanSegment active="explore" />
        <div className="flex w-full flex-col items-start gap-[8px]">
          <h1 className="w-full font-grotesk text-[24px] font-bold leading-[28px] text-atlas-teal">No partner fits this time</h1>
          <p className="w-full font-manrope text-[15px] leading-[23px] text-atlas-ink">
            None of Hotel A&apos;s approved partners match Nightlife right now. Try one of these, or enjoy what the hotel offers.
          </p>
        </div>
        <Option to="Preferences" label="Add Food and Culture" count="4 places" />
        <Option to="List" label="Show everything Hotel A offers" count="6 places" />
        <h2 className="font-grotesk text-[18px] font-bold leading-[23px] text-atlas-teal">At Hotel A</h2>
        <PlaceRow place={PLACES.pool} photo={{ src: "/atlas-ui/photo-pool.jpg", width: 320, height: 480 }} />
        <PlaceRow place={{ ...PLACES.spa, achievement: undefined }} photo={{ src: "/atlas-ui/photo-spa.jpg", width: 480, height: 320 }} />
        <AtlasButton to="Preferences">Change interests or time</AtlasButton>
        <p className="w-full text-center font-manrope text-[13px] leading-[18px] text-atlas-slate">
          Not finding what you want? Hotel A&apos;s front desk can help.
        </p>
      </div>
      <div className="sticky bottom-0 z-10">
        <AtlasBottomBar active="missions" />
      </div>
    </main>
  );
}
