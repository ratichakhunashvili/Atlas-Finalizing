"use client";

import { useState } from "react";
import { AtlasIcon } from "../asset";
import { AtlasBottomBar } from "../bottom-bar";
import { ContextHeader, PlanSegment } from "../missions-chrome";
import { AtlasTextLink } from "../ui";
import { useMapScene } from "./scene";

/*
 * MapNextPath — Figma frame 1:5494, with the "Map sheet · next stop" component set (1:5548).
 * After checking in at Partner Place 1 the guest picks what comes next without leaving the map.
 *
 * States, as the eight variants draw them:
 *   none      nothing chosen; the main action asks to choose ("Ask" adds an error line)
 *   chosen    the option gets a 2px stroke (bronze on the featured one) and a filled radio,
 *             and the main action names the choice
 *   saved     a status note under the options. Prototype only: the route is not changed.
 */

type OptionId = "p2" | "a1" | "pool";

type Option = {
  id: OptionId;
  eyebrow: string;
  name: string;
  meta: string;
  note: string;
  featured?: boolean;
  action: string;
  saved: string;
};

const OPTIONS: readonly Option[] = [
  {
    id: "p2",
    eyebrow: "Closest",
    name: "Partner Place 2",
    meta: "11 min walk · 60 min · Budget",
    note: "Already next in today's plan.",
    action: "Keep Partner Place 2 next",
    saved: "Partner Place 2 stays your next stop.",
  },
  {
    id: "a1",
    eyebrow: "Featured experience",
    name: "Attraction 1",
    meta: "20 min walk · 45 min",
    note: "Recommended by Hotel A. History. Camera unlock is a prototype.",
    featured: true,
    action: "Make Attraction 1 my next stop",
    saved: "Prototype only: your route hasn't changed. Attraction 1 is not saved as your next stop.",
  },
  {
    id: "pool",
    eyebrow: "Something different",
    name: "Pool",
    meta: "In Hotel A · 60 min",
    note: "A calmer stop at your hotel. No achievement here.",
    action: "Make the pool my next stop",
    saved: "Prototype only: your route hasn't changed. The pool is not saved as your next stop.",
  },
];

const SHEET_HEIGHT = 560;

function OptionCard({ option, selected, onSelect }: { option: Option; selected: boolean; onSelect: () => void }) {
  const featured = Boolean(option.featured);
  const stroke = selected ? (featured ? "border-2 border-atlas-bronze" : "border-2 border-atlas-teal") : featured ? "border border-atlas-teal" : "border border-atlas-beige";
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      onClick={onSelect}
      className={`flex w-full items-start gap-[10px] rounded-[14px] px-[12px] py-[10px] text-left ${stroke} ${
        featured ? "bg-atlas-teal" : "bg-atlas-paper"
      }`}
    >
      <span
        aria-hidden
        className={`flex size-[20px] shrink-0 items-center justify-center rounded-[10px] border-2 ${featured ? "border-atlas-beige" : "border-atlas-teal"}`}
      >
        {selected ? <span className={`size-[8px] rounded-[4px] ${featured ? "bg-atlas-beige" : "bg-atlas-teal"}`} /> : null}
      </span>
      <span className="flex min-w-0 flex-1 flex-col items-start gap-[3px]">
        <span className={`font-manrope text-[11px] font-semibold uppercase leading-[15px] tracking-[0.66px] ${featured ? "text-atlas-beige" : "text-atlas-slate"}`}>
          {option.eyebrow}
        </span>
        <span className={`font-grotesk text-[16px] font-bold leading-[20px] ${featured ? "text-atlas-paper" : "text-atlas-teal"}`}>
          {option.name}
        </span>
        <span className={`font-manrope text-[13px] leading-[18px] ${featured ? "text-atlas-linen" : "text-atlas-ink"}`}>{option.meta}</span>
        <span className={`font-manrope text-[12px] leading-[16px] ${featured ? "text-atlas-beige" : "text-atlas-slate"}`}>{option.note}</span>
      </span>
    </button>
  );
}

export function NextStopSheet() {
  const [choice, setChoice] = useState<OptionId | null>(null);
  const [asked, setAsked] = useState(false);
  const [saved, setSaved] = useState(false);
  const chosen = OPTIONS.find((option) => option.id === choice);

  const choose = (id: OptionId) => {
    setChoice(id);
    setAsked(false);
    setSaved(false);
  };

  const confirm = () => {
    if (!chosen) setAsked(true);
    else setSaved(true);
  };

  return (
    <section
      aria-label="Choose your next stop"
      className="flex w-full flex-col items-center gap-[8px] overflow-y-auto rounded-t-[22px] bg-atlas-paper px-[16px] pb-[12px] pt-[8px] shadow-[0px_-4px_18px_0px_rgba(28,41,41,0.1)]"
      style={{ height: SHEET_HEIGHT }}
    >
      <div aria-hidden className="h-[4px] w-[36px] shrink-0 rounded-[2px] bg-atlas-beige" />
      <div className="flex w-full items-center gap-[10px]">
        <span className="flex size-[32px] shrink-0 items-center justify-center rounded-[16px] bg-atlas-teal">
          <AtlasIcon src="/atlas-ui/icon-check-light-16.svg" size={16} />
        </span>
        <span className="flex min-w-0 flex-1 flex-col items-start">
          <span className="font-grotesk text-[15px] font-bold leading-[19px] text-atlas-teal">Checked in at Partner Place 1</span>
          <span className="font-manrope text-[12px] leading-[16px] text-atlas-slate">1 of 3 stops done · achievement unlocked</span>
        </span>
      </div>
      <h2 className="w-full font-grotesk text-[17px] font-bold leading-[22px] text-atlas-teal">What would you like to do next?</h2>
      <div role="radiogroup" aria-label="Next stop" className="flex w-full flex-col items-start gap-[8px]">
        {OPTIONS.map((option) => (
          <OptionCard key={option.id} option={option} selected={choice === option.id} onSelect={() => choose(option.id)} />
        ))}
      </div>
      {asked ? (
        <p role="alert" className="w-full font-manrope text-[13px] leading-[18px] text-atlas-danger">
          Choose one of the three first.
        </p>
      ) : null}
      {saved && chosen ? (
        <p role="status" className="w-full rounded-[12px] bg-atlas-sand px-[12px] py-[10px] font-manrope text-[13px] leading-[1.45] text-atlas-ink">
          {chosen.saved}
        </p>
      ) : null}
      <button
        type="button"
        onClick={confirm}
        className="flex h-[52px] w-full shrink-0 items-center justify-center rounded-[14px] bg-atlas-teal font-manrope text-[16px] font-semibold leading-[22px] text-atlas-paper"
      >
        {chosen ? chosen.action : "Choose your next stop"}
      </button>
      <AtlasTextLink to="Main" className="!text-[14px] !leading-[19px]">
        Maybe later
      </AtlasTextLink>
    </section>
  );
}

export function NextStopMap() {
  useMapScene({
    places: [
      { id: "partner-2", marker: "partner-next" },
      { id: "partner-1", marker: "partner-checked" },
      { id: "pool", marker: "facility" },
      { id: "spa", marker: "facility" },
      { id: "partner-4", marker: "partner" },
      { id: "attraction-1", marker: "attraction" },
    ],
    hotel: true,
    you: true,
    bottomInset: 96 + SHEET_HEIGHT,
    allowTilt: true,
  });

  return (
    <div className="pointer-events-none absolute inset-0">
      <div className="pointer-events-auto absolute left-[12px] right-[12px] top-[12px]">
        <ContextHeader />
      </div>
      <div className="pointer-events-auto absolute left-[12px] right-[12px] top-[72px]">
        <PlanSegment active="explore" />
      </div>
      <div className="pointer-events-auto absolute bottom-[96px] left-0 right-0">
        <NextStopSheet />
      </div>
      <div className="pointer-events-auto absolute bottom-0 left-0 right-0">
        <AtlasBottomBar active="missions" />
      </div>
    </div>
  );
}
