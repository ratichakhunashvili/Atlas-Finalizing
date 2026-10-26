"use client";

import { useState, type ReactNode } from "react";
import { AtlasIcon, AtlasLogo } from "./asset";
import { AtlasBottomBar } from "./bottom-bar";
import type { ScreenKey } from "./screens";
import { AtlasLink } from "./ui";

/*
 * Stay · Profile — Figma frame 1:1542: the guest, their current stay, achievements, preferences
 * and app settings. The language row switches English / Georgian, as its component description
 * says; the rest open the screens they name.
 */

const ROW = "flex h-[48px] w-full items-center justify-between";

function SettingRow({ label, value, to, divider = true }: { label: string; value?: string; to: ScreenKey; divider?: boolean }) {
  return (
    <AtlasLink to={to} className={`${ROW} ${divider ? "border-b border-atlas-beige" : ""}`}>
      <span className="whitespace-nowrap font-manrope text-[15px] leading-[20px] text-atlas-ink">{label}</span>
      <span className="flex items-center gap-[4px]">
        {value ? <span className="whitespace-nowrap font-manrope text-[13px] leading-[18px] text-atlas-slate">{value}</span> : null}
        <AtlasIcon src="/atlas-ui/icon-chevron.svg" size={16} />
      </span>
    </AtlasLink>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="flex w-full flex-col items-start">
      <h2 className="font-grotesk text-[16px] font-bold leading-[20px] text-atlas-teal">{title}</h2>
      {children}
    </section>
  );
}

function LanguageRow() {
  const [language, setLanguage] = useState<"English" | "ქართული">("English");
  return (
    <button
      type="button"
      onClick={() => setLanguage(language === "English" ? "ქართული" : "English")}
      className={`${ROW} border-b border-atlas-beige`}
    >
      <span className="whitespace-nowrap font-manrope text-[15px] leading-[20px] text-atlas-ink">Language</span>
      <span className="flex items-center gap-[4px]">
        <span className="whitespace-nowrap font-manrope text-[13px] leading-[18px] text-atlas-slate">{language}</span>
        <AtlasIcon src="/atlas-ui/icon-chevron.svg" size={16} />
      </span>
    </button>
  );
}

function Badge({ unlocked }: { unlocked: boolean }) {
  return unlocked ? (
    <span className="flex size-[40px] shrink-0 items-center justify-center rounded-[20px] border-[3px] border-atlas-bronze bg-atlas-teal">
      <AtlasIcon src="/atlas-ui/icon-ach-light-20.svg" size={20} />
    </span>
  ) : (
    <span className="flex size-[40px] shrink-0 items-center justify-center rounded-[20px] border-2 border-dashed border-atlas-umber">
      <AtlasIcon src="/atlas-ui/icon-ach-umber-18.svg" size={18} />
    </span>
  );
}

export function ProfileScreen() {
  return (
    <main className="relative flex min-h-[100dvh] w-full flex-col bg-atlas-paper">
      <div className="flex w-full flex-1 flex-col items-start gap-[14px] px-[16px] pb-[24px] pt-[14px]">
        <div className="flex w-full items-center gap-[12px]">
          <span className="flex size-[48px] shrink-0 items-center justify-center rounded-[24px] bg-atlas-sand font-grotesk text-[16px] font-bold leading-[20px] text-atlas-teal">
            G
          </span>
          <span className="flex min-w-0 flex-1 flex-col items-start gap-px whitespace-nowrap">
            <span className="font-grotesk text-[22px] font-bold leading-[28px] text-atlas-teal">[Guest name]</span>
            <span className="font-manrope text-[13px] leading-[18px] text-atlas-slate">[guest@email.com]</span>
          </span>
        </div>

        <section aria-label="Your stay" className="flex w-full items-center gap-[12px] rounded-[16px] bg-atlas-teal p-[12px]">
          <span className="flex size-[56px] shrink-0 items-center justify-center rounded-[12px] bg-atlas-lagoon font-manrope text-[10px] leading-[14px] text-atlas-beige">
            Photo
          </span>
          <span className="flex min-w-0 flex-1 flex-col items-start gap-[2px]">
            <span className="whitespace-nowrap font-manrope text-[12px] leading-[16px] text-atlas-beige">Your stay</span>
            <span className="whitespace-nowrap font-grotesk text-[18px] font-bold leading-[23px] text-atlas-paper">Hotel A</span>
            <span className="w-full font-manrope text-[13px] leading-[18px] text-atlas-linen">[check-in] – [check-out]</span>
            <span className="whitespace-nowrap font-manrope text-[12px] leading-[16px] text-atlas-beige">Night 2 of 3</span>
          </span>
          <AtlasLink
            to="Stay"
            label="Call the front desk"
            className="flex size-[44px] shrink-0 items-center justify-center rounded-[12px] bg-atlas-paper/15"
          >
            <AtlasIcon src="/atlas-ui/icon-phone-light-19.svg" size={19} />
          </AtlasLink>
        </section>

        <AtlasLink to="Achievements" className="flex w-full flex-col items-start gap-[10px] rounded-[16px] border border-atlas-beige p-[14px] text-left">
          <span className="flex w-full items-center justify-between">
            <span className="font-grotesk text-[16px] font-bold leading-[20px] text-atlas-teal">Achievements</span>
            <span className="flex items-center gap-[2px] font-manrope text-[13px] font-semibold leading-[18px] text-atlas-teal">
              See all
              <AtlasIcon src="/atlas-ui/icon-chevron-teal-16.svg" size={16} />
            </span>
          </span>
          <span className="flex items-start gap-[8px]">
            <Badge unlocked />
            <Badge unlocked />
            <Badge unlocked={false} />
            <Badge unlocked={false} />
            <Badge unlocked={false} />
          </span>
          <span className="whitespace-nowrap font-manrope text-[13px] leading-[18px] text-atlas-ink">
            <span className="font-semibold">2 of 5 unlocked</span> this stay
          </span>
          <span className="flex w-full items-start gap-[4px]">
            {[0, 1, 2, 3, 4].map((index) => (
              <span key={index} className={`h-[5px] min-w-px flex-1 rounded-[3px] ${index < 2 ? "bg-atlas-teal" : "bg-atlas-beige"}`} />
            ))}
          </span>
        </AtlasLink>

        <Section title="Your preferences">
          <SettingRow label="Interests" value="Food, Culture" to="Preferences" />
          <SettingRow label="Free time" value="2 h" to="Preferences" />
          <SettingRow label="Price level" value="Moderate" to="Preferences" divider={false} />
        </Section>

        <Section title="App">
          <LanguageRow />
          <SettingRow label="Location" value="While using" to="Permissions" />
          <SettingRow label="Camera" value="Ask each time" to="Permissions" />
          <SettingRow label="Help and privacy" to="Privacy" divider={false} />
        </Section>

        <AtlasLink
          to="SignIn"
          className="flex h-[48px] w-full items-center justify-center rounded-[12px] border border-atlas-beige font-manrope text-[15px] font-semibold leading-[20px] text-atlas-ink"
        >
          Sign out
        </AtlasLink>

        <div className="flex w-full items-center gap-[12px] border-t border-atlas-beige pb-[4px] pt-[10px]">
          <AtlasLogo tone="teal" width={35} height={40} />
          <span className="flex flex-col items-start gap-px whitespace-nowrap">
            <span className="font-grotesk text-[13px] font-bold leading-[17px] tracking-[2.6px] text-atlas-teal">ATLAS</span>
            <span className="font-manrope text-[12px] leading-[16px] text-atlas-slate">All trips leave a story. · [version]</span>
          </span>
        </div>
      </div>
      <div className="sticky bottom-0 z-10">
        <AtlasBottomBar active="profile" />
      </div>
    </main>
  );
}
