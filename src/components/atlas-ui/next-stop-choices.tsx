"use client";

import { useState } from "react";
import { AtlasAsset, AtlasIcon } from "./asset";
import { AtlasBackButton, AtlasButton, AtlasTextLink } from "./ui";

/*
 * NextPath · Choose your next stop — Figma frame 1:5087, with the Next stop choices component
 * set (1:5111): three eligible places, the featured one outlined. Tap a card to select it, the
 * button names the pick, confirming shows a toast with Undo. Prototype: the plan order does not
 * change, and the screen says so.
 */

type ChoiceId = "pool" | "attraction-1" | "partner-4";

type Choice = {
  id: ChoiceId;
  label: string;
  featured?: boolean;
  category: string;
  name: string;
  meta: string;
  reason: string;
  photo: { src: string; width: number; height: number };
  /** "the pool", "Attraction 1" — how sentences refer to it. */
  phrase: string;
};

const CHOICES: readonly Choice[] = [
  {
    id: "pool",
    label: "Quick and close",
    category: "At your hotel · Wellness",
    name: "Pool",
    meta: "In Hotel A · 60 min",
    reason: "No walk needed.",
    photo: { src: "/atlas-ui/choice-pool.jpg", width: 320, height: 480 },
    phrase: "the pool",
  },
  {
    id: "attraction-1",
    label: "Recommended",
    featured: true,
    category: "Attraction · History",
    name: "Attraction 1",
    meta: "20 min walk · 45 min",
    reason: "Recommended by Hotel A. Achievement to unlock.",
    photo: { src: "/atlas-ui/choice-attraction-1.jpg", width: 480, height: 320 },
    phrase: "Attraction 1",
  },
  {
    id: "partner-4",
    label: "Something different",
    category: "Partner · Culture",
    name: "Partner Place 4",
    meta: "14 min walk · 60 min",
    reason: "A partner you haven't visited. Achievement to unlock.",
    photo: { src: "/atlas-ui/choice-partner-4.jpg", width: 480, height: 320 },
    phrase: "Partner Place 4",
  },
];

const capitalise = (text: string) => text.charAt(0).toUpperCase() + text.slice(1);

function ChoiceCard({ choice, selected, onSelect }: { choice: Choice; selected: boolean; onSelect: () => void }) {
  const outlined = selected || choice.featured;
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      onClick={onSelect}
      className={`flex w-full items-start gap-[10px] rounded-[16px] p-[10px] text-left ${selected ? "bg-atlas-sand" : "bg-atlas-paper"} ${
        outlined ? "border-2 border-atlas-teal" : "border border-atlas-beige"
      }`}
    >
      <span className="relative size-[60px] shrink-0 overflow-hidden rounded-[10px] bg-atlas-beige">
        <AtlasAsset src={choice.photo.src} width={choice.photo.width} height={choice.photo.height} className="absolute inset-0 size-full object-cover" />
      </span>
      <span className="flex min-w-0 flex-1 flex-col items-start gap-[3px]">
        <span className="flex w-full items-center justify-between">
          <span className="flex items-center gap-[6px]">
            {choice.featured ? (
              <span className="rounded-[9px] bg-atlas-teal px-[8px] py-[2px] font-manrope text-[11px] font-semibold leading-[15px] text-atlas-paper">
                Featured
              </span>
            ) : null}
            <span className="whitespace-nowrap font-manrope text-[11px] font-semibold uppercase leading-[15px] tracking-[0.44px] text-atlas-slate">
              {choice.label}
            </span>
          </span>
          <span
            aria-hidden
            className={`flex size-[20px] shrink-0 items-center justify-center rounded-[10px] border-2 border-atlas-teal ${selected ? "bg-atlas-teal" : ""}`}
          >
            {selected ? <span className="size-[8px] rounded-[4px] bg-atlas-paper" /> : null}
          </span>
        </span>
        <span className="whitespace-nowrap font-manrope text-[12px] leading-[16px] text-atlas-slate">{choice.category}</span>
        <span className="whitespace-nowrap font-grotesk text-[16px] font-bold leading-[20px] text-atlas-teal">{choice.name}</span>
        <span className="whitespace-nowrap font-manrope text-[13px] leading-[18px] text-atlas-ink">{choice.meta}</span>
        <span className="flex w-full items-center gap-[4px]">
          <span aria-hidden className={`size-[6px] shrink-0 rounded-[3px] ${choice.featured ? "bg-atlas-bronze" : "bg-atlas-beige"}`} />
          <span className="min-w-0 flex-1 font-manrope text-[12px] leading-[16px] text-atlas-slate">{choice.reason}</span>
        </span>
      </span>
    </button>
  );
}

export function NextStopChoices() {
  const [selected, setSelected] = useState<ChoiceId | null>(null);
  const [done, setDone] = useState(false);
  const choice = CHOICES.find((item) => item.id === selected);

  const select = (id: ChoiceId) => {
    setSelected(id);
    setDone(false);
  };

  const note = done
    ? "Prototype: My plan in this demo still shows the original order."
    : choice
      ? `Partner Place 2 moves to after ${choice.phrase}.`
      : "Choosing adds it to your plan. Nothing is booked.";

  return (
    <main className="relative flex min-h-[100dvh] w-full flex-col bg-atlas-paper">
      <div className="flex w-full flex-col items-start gap-[12px] px-[16px] pt-[14px]">
        <div className="flex w-full items-center gap-[10px]">
          <AtlasBackButton to="UnlockedP1" />
          <p className="font-manrope text-[13px] leading-[18px] text-atlas-slate">Hotel A · Today</p>
        </div>
        <div className="flex w-full items-center gap-[10px]">
          <span className="flex size-[36px] shrink-0 items-center justify-center rounded-[18px] bg-atlas-teal">
            <AtlasIcon src="/atlas-ui/icon-check-light-18.svg" size={18} />
          </span>
          <span className="flex min-w-0 flex-1 flex-col items-start whitespace-nowrap">
            <span className="font-grotesk text-[15px] font-bold leading-[19px] text-atlas-teal">Partner Place 1 complete</span>
            <span className="font-manrope text-[12px] leading-[16px] text-atlas-slate">1 of 3 stops done today</span>
          </span>
        </div>
        <div className="flex w-full items-start gap-[4px]">
          {[0, 1, 2].map((index) => (
            <div key={index} className={`h-[5px] min-w-px flex-1 rounded-[3px] ${index === 0 ? "bg-atlas-teal" : "bg-atlas-beige"}`} />
          ))}
        </div>
        <div aria-hidden className="relative h-[36px] w-full overflow-hidden">
          <AtlasAsset src="/atlas-ui/pattern-teal-wave.svg" width={390} height={139} className="absolute left-[-16px] top-[-52px] max-w-none opacity-30" />
        </div>
        <div className="flex w-full flex-col items-start gap-[4px]">
          <h1 className="whitespace-nowrap font-grotesk text-[22px] font-bold leading-[1.2] text-atlas-teal">Choose your next stop</h1>
          <p className="w-full font-manrope text-[14px] leading-[1.5] text-atlas-slate">
            Up next in your plan: <span className="font-semibold text-atlas-ink">Partner Place 2</span>. Pick a different stop, or keep your
            plan as it is.
          </p>
        </div>
      </div>

      <div role="radiogroup" aria-label="Next stop" className="flex w-full flex-1 flex-col items-start gap-[10px] px-[16px] pt-[12px]">
        {CHOICES.map((item) => (
          <ChoiceCard key={item.id} choice={item} selected={item.id === selected} onSelect={() => select(item.id)} />
        ))}
      </div>

      <div className="sticky bottom-0 z-10">
        {done && choice ? (
          <div
            role="status"
            className="absolute bottom-[162px] left-[12px] right-[12px] flex h-[52px] items-center justify-between rounded-[14px] bg-atlas-ink pl-[16px] pr-[8px] drop-shadow-[0px_6px_9px_rgba(28,41,41,0.3)]"
          >
            <p className="font-manrope text-[14px] leading-[19px] text-atlas-paper">{capitalise(choice.phrase)} is your next stop</p>
            <button
              type="button"
              onClick={() => setDone(false)}
              className="flex h-[44px] items-center px-[12px] font-manrope text-[14px] font-semibold leading-[19px] text-atlas-beige"
            >
              Undo
            </button>
          </div>
        ) : null}
        <div className="flex h-[150px] w-full flex-col items-start gap-[4px] border-t border-atlas-beige bg-atlas-paper px-[16px] pb-[14px] pt-[10px]">
          <p className="w-full text-center font-manrope text-[12px] leading-[16px] text-atlas-slate">{note}</p>
          {done ? (
            <AtlasButton to="MyPlan">View my plan</AtlasButton>
          ) : choice ? (
            <button
              type="button"
              onClick={() => setDone(true)}
              className="flex h-[52px] w-full items-center justify-center rounded-[14px] bg-atlas-teal font-manrope text-[16px] font-semibold leading-[22px] text-atlas-paper"
            >
              Make {choice.phrase} my next stop
            </button>
          ) : (
            <button
              type="button"
              disabled
              className="flex h-[52px] w-full items-center justify-center rounded-[14px] bg-atlas-mist font-manrope text-[16px] font-semibold leading-[22px] text-atlas-ink"
            >
              Choose a stop to continue
            </button>
          )}
          <AtlasTextLink to="MyPlan" className="!text-[14px] !leading-[19px]">
            Keep my plan
          </AtlasTextLink>
        </div>
      </div>
    </main>
  );
}
