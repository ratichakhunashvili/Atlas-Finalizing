"use client";

import { useState } from "react";
import { AtlasBackButton, AtlasButton, AtlasTextLink, type } from "./ui";

/*
 * Preferences · Plan my time — Figma frame 1:590, with the Time picker (1:62), Interest chip
 * (1:115) and Price picker (1:120) components. Time and price pick one option; interests are
 * multi-select. "Starting" updates its return time from the chosen duration.
 *
 * Choices are local for now; "Plan my time" is where the planner request will be sent.
 */

const TIMES = ["1 h", "2 h", "3 h", "4 h+"] as const;
const BACK_BY: Record<(typeof TIMES)[number], string> = { "1 h": "17:00", "2 h": "18:00", "3 h": "19:00", "4 h+": "20:00" };
const INTERESTS = ["Food", "Culture", "Nature", "Wellness", "History", "Art", "Nightlife", "Shopping"] as const;
const PRICES = ["Any", "Budget", "Moderate", "Luxury"] as const;

const OPTION = "flex h-[48px] min-w-0 flex-1 items-center justify-center rounded-[12px] border font-manrope font-semibold";

function Segmented<T extends string>({
  options,
  value,
  onChange,
  label,
  textClass,
}: {
  options: readonly T[];
  value: T;
  onChange: (value: T) => void;
  label: string;
  textClass: string;
}) {
  return (
    <div role="radiogroup" aria-label={label} className="flex w-full items-start gap-[8px]">
      {options.map((option) => {
        const selected = option === value;
        return (
          <button
            key={option}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => onChange(option)}
            className={`${OPTION} ${textClass} ${selected ? "border-atlas-teal bg-atlas-teal text-atlas-paper" : "border-atlas-beige bg-atlas-paper text-atlas-teal"}`}
          >
            {option}
          </button>
        );
      })}
    </div>
  );
}

const SECTION_TITLE = "font-grotesk text-[17px] font-bold leading-[22px] text-atlas-teal";

export function PreferencesForm() {
  const [time, setTime] = useState<(typeof TIMES)[number]>("2 h");
  const [interests, setInterests] = useState<string[]>(["Food", "Culture"]);
  const [price, setPrice] = useState<(typeof PRICES)[number]>("Moderate");

  const toggleInterest = (interest: string) =>
    setInterests((current) => (current.includes(interest) ? current.filter((item) => item !== interest) : [...current, interest]));

  return (
    <main className="relative flex min-h-[100dvh] w-full flex-col bg-atlas-paper">
      <div className="flex w-full flex-1 flex-col items-start gap-[22px] px-[16px] pb-[24px] pt-[16px]">
        <div className="flex w-full items-center gap-[8px]">
          <AtlasBackButton to="Main" />
          <p className="font-manrope text-[13px] leading-[18px] text-atlas-slate">Hotel A</p>
        </div>

        <div className="flex w-full flex-col items-start gap-[6px]">
          <h1 className={`w-full ${type.title}`}>Tell us when you&apos;re free.</h1>
          <p className={`w-full ${type.body} text-atlas-slate`}>
            We&apos;ll figure out what you can do with Hotel A and its approved partners.
          </p>
        </div>

        <section className="flex w-full flex-col items-start gap-[10px]">
          <h2 className={SECTION_TITLE}>How much time do you have?</h2>
          <div className="flex w-full flex-col items-start gap-[10px]">
            <Segmented options={TIMES} value={time} onChange={setTime} label="Free time" textClass="text-[15px] leading-[20px]" />
            <div className="flex h-[48px] w-full items-center justify-between whitespace-nowrap border-b border-atlas-beige font-manrope text-[14px] leading-[19px]">
              <p className="text-atlas-ink">Starting</p>
              <p className="font-semibold text-atlas-teal">Now · back by {BACK_BY[time]}</p>
            </div>
          </div>
        </section>

        <section className="flex w-full flex-col items-start gap-[10px]">
          <h2 className={SECTION_TITLE}>What are you curious about?</h2>
          <p className="font-manrope text-[13px] leading-[18px] text-atlas-slate">Pick as many as you like.</p>
          <div className="flex w-full flex-wrap items-start gap-[8px]">
            {INTERESTS.map((interest) => {
              const selected = interests.includes(interest);
              return (
                <button
                  key={interest}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => toggleInterest(interest)}
                  className={`flex h-[44px] items-center justify-center rounded-[22px] border px-[16px] font-manrope text-[14px] font-semibold leading-[19px] ${
                    selected ? "border-atlas-teal bg-atlas-teal text-atlas-paper" : "border-atlas-beige bg-atlas-paper text-atlas-teal"
                  }`}
                >
                  {interest}
                </button>
              );
            })}
          </div>
        </section>

        <section className="flex w-full flex-col items-start gap-[10px]">
          <h2 className={SECTION_TITLE}>Price level</h2>
          <Segmented options={PRICES} value={price} onChange={setPrice} label="Price level" textClass="text-[13px] leading-[18px]" />
          <p className="w-full font-manrope text-[13px] leading-[1.5] text-atlas-slate">
            A general guide only. Places without a known price level can still appear.
          </p>
        </section>
      </div>

      <div className="sticky bottom-0 z-10 flex h-[140px] w-full flex-col items-start gap-[6px] border-t border-atlas-beige bg-atlas-paper px-[16px] pb-[20px] pt-[12px]">
        <AtlasButton to="PlanBuild">Plan my time</AtlasButton>
        <AtlasTextLink to="Main">Just show me places</AtlasTextLink>
      </div>
    </main>
  );
}
