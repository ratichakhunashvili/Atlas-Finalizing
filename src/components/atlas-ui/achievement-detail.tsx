import { AtlasIcon } from "./asset";
import type { ScreenKey } from "./screens";
import { AtlasBackButton, AtlasButton, Spacer, type } from "./ui";

/*
 * AchievementDetail (1:989) and AchievementDetailP1 (1:1983): one unlocked achievement — the
 * badge, when and how it was earned, the stay it belongs to, and a link back to its place.
 */

export type AchievementDetailProps = {
  title: string;
  place: string;
  when: string;
  how: string;
  viewLabel: string;
  viewTo: ScreenKey;
};

function InfoRow({ icon, label, value, divider = true }: { icon: string; label: string; value: string; divider?: boolean }) {
  return (
    <div className={`flex h-[48px] w-full items-center gap-[10px] py-[6px] ${divider ? "border-b border-atlas-beige" : ""}`}>
      <AtlasIcon src={icon} size={18} className="shrink-0" />
      <div className="flex min-w-px flex-1 flex-col items-start gap-px whitespace-nowrap">
        <p className="font-manrope text-[14px] font-semibold leading-[19px] text-atlas-ink">{label}</p>
        <p className="font-manrope text-[13px] leading-[18px] text-atlas-slate">{value}</p>
      </div>
    </div>
  );
}

export function AchievementDetailScreen({ title, place, when, how, viewLabel, viewTo }: AchievementDetailProps) {
  return (
    <main className="flex min-h-[100dvh] w-full flex-col items-start gap-[16px] bg-atlas-paper px-[20px] pb-[28px] pt-[16px]">
      <AtlasBackButton to="Achievements" />
      <div className="flex w-full flex-col items-center gap-[14px] pt-[12px]">
        <span className="flex size-[112px] shrink-0 items-center justify-center rounded-[56px] border-4 border-atlas-bronze/60 bg-atlas-teal">
          <AtlasIcon src="/atlas-ui/icon-ach-light-50.svg" size={50} />
        </span>
        <p className={type.eyebrow}>Unlocked</p>
        <h1 className="w-full text-center font-grotesk text-[26px] font-bold leading-[30px] text-atlas-teal">{title}</h1>
        <p className="whitespace-nowrap font-manrope text-[15px] leading-[20px] text-atlas-slate">{place}</p>
      </div>
      <div className="flex w-full flex-col items-start">
        <InfoRow icon="/atlas-ui/icon-clock.svg" label="When" value={when} />
        <InfoRow icon="/atlas-ui/icon-check-18.svg" label="How" value={how} />
        <InfoRow icon="/atlas-ui/icon-home-18.svg" label="Stay" value="Hotel A · [check-in] – [check-out]" divider={false} />
      </div>
      <p className="w-full font-manrope text-[13px] leading-[1.5] text-atlas-slate">
        Achievements are a record of the places you have explored. They have no cash value.
      </p>
      <Spacer />
      <AtlasButton to={viewTo} tone="outline">
        {viewLabel}
      </AtlasButton>
    </main>
  );
}
