import { AtlasIcon } from "@/components/atlas-ui/asset";
import { AtlasBottomBar } from "@/components/atlas-ui/bottom-bar";
import type { ScreenKey } from "@/components/atlas-ui/screens";
import { AtlasBackButton, AtlasLink, type } from "@/components/atlas-ui/ui";

/*
 * Achievements · Profile › Achievements — Figma frame 1:624. Achievements are unlocks earned by
 * checking in, never points: two unlocked, three still to discover, each linking to its place.
 */

const UNLOCKED: { title: string; line: string; to: ScreenKey }[] = [
  { title: "[Achievement 1]", line: "Partner Place 1 · Today", to: "AchievementDetailP1" },
  { title: "[Achievement 2]", line: "Spa · Yesterday", to: "AchievementDetail" },
];

const TO_DISCOVER: { title: string; place: string; how: string; to: ScreenKey }[] = [
  { title: "[Achievement 3]", place: "Partner Place 2 · 11 min · in today's plan", how: "Scan the code at the counter", to: "Detail" },
  { title: "[Achievement 4]", place: "Attraction 1 · 20 min walk", how: "Camera view when you are there", to: "AttractionDetail" },
  { title: "[Achievement 5]", place: "Partner Place 4 · 14 min walk", how: "Scan the code at the counter", to: "DetailP4" },
];

export default function AchievementsPage() {
  return (
    <main className="relative flex min-h-[100dvh] w-full flex-col bg-atlas-paper">
      <div className="flex w-full flex-1 flex-col items-start gap-[14px] px-[16px] pb-[20px] pt-[14px]">
        <div className="flex w-full items-center gap-[10px]">
          <AtlasBackButton to="Stay" />
          <div className="flex flex-col items-start gap-[2px] whitespace-nowrap">
            <p className={type.eyebrow}>Profile</p>
            <h1 className="font-grotesk text-[24px] font-bold leading-[31px] text-atlas-teal">Achievements</h1>
          </div>
        </div>

        <div className="flex w-full flex-col items-start gap-[6px]">
          <div className="flex w-full items-start justify-between whitespace-nowrap font-manrope text-[13px] leading-[18px]">
            <p className="font-semibold text-atlas-ink">2 of 5 unlocked</p>
            <p className="text-atlas-slate">Check in at a place to unlock it</p>
          </div>
          <div className="flex w-full items-start gap-[4px]">
            {[0, 1, 2, 3, 4].map((index) => (
              <div key={index} className={`h-[5px] min-w-px flex-1 rounded-[3px] ${index < 2 ? "bg-atlas-teal" : "bg-atlas-beige"}`} />
            ))}
          </div>
        </div>

        <h2 className="font-grotesk text-[16px] font-bold leading-[20px] text-atlas-teal">Unlocked</h2>
        <div className="flex w-full items-start gap-[10px]">
          {UNLOCKED.map((item) => (
            <AtlasLink
              key={item.title}
              to={item.to}
              className="flex min-w-0 flex-1 flex-col items-start gap-[6px] rounded-[14px] border border-atlas-beige p-[12px] text-left"
            >
              <span className="flex size-[44px] shrink-0 items-center justify-center rounded-[22px] border-[3px] border-atlas-bronze bg-atlas-teal">
                <AtlasIcon src="/atlas-ui/icon-ach-light-20.svg" size={20} />
              </span>
              <span className="whitespace-nowrap font-grotesk text-[14px] font-bold leading-[18px] text-atlas-teal">{item.title}</span>
              <span className="w-full font-manrope text-[12px] leading-[16px] text-atlas-slate">{item.line}</span>
            </AtlasLink>
          ))}
        </div>

        <h2 className="font-grotesk text-[16px] font-bold leading-[20px] text-atlas-teal">Still to discover</h2>
        <div className="flex w-full flex-col items-start">
          {TO_DISCOVER.map((item) => (
            <AtlasLink key={item.title} to={item.to} className="flex h-[60px] w-full items-center gap-[10px] border-b border-atlas-beige text-left">
              <span className="flex size-[40px] shrink-0 items-center justify-center rounded-[20px] border-2 border-dashed border-atlas-slate">
                <AtlasIcon src="/atlas-ui/icon-ach-slate-18.svg" size={18} />
              </span>
              <span className="flex min-w-0 flex-1 flex-col items-start gap-px">
                <span className="whitespace-nowrap font-grotesk text-[15px] font-bold leading-[19px] text-atlas-teal">{item.title}</span>
                <span className="w-full font-manrope text-[13px] leading-[18px] text-atlas-ink">{item.place}</span>
                <span className="w-full font-manrope text-[12px] leading-[16px] text-atlas-slate">{item.how}</span>
              </span>
              <AtlasIcon src="/atlas-ui/icon-chevron.svg" size={16} className="shrink-0" />
            </AtlasLink>
          ))}
        </div>
      </div>
      <div className="sticky bottom-0 z-10">
        <AtlasBottomBar active="profile" />
      </div>
    </main>
  );
}
