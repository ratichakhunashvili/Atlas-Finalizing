"use client";

import { useState, type ReactNode } from "react";
import { AtlasIcon } from "./asset";
import { AtlasBottomBar } from "./bottom-bar";
import type { ScanProblem } from "./scan-problems";
import { AtlasButton, AtlasLink, AtlasTextLink } from "./ui";

/*
 * The Scan tab: Scan (1:410) and the six check-in problems (1:1042 – 1:1127).
 *
 * The camera area is the design's own placeholder — a dark surface labelled "[Live camera
 * view]". The viewfinder simulates a good scan when tapped, as the prototype does; the real
 * camera and code reader plug in here later. Nothing is photographed or sent.
 */

function CameraSurface({ label, labelTop, children }: { label: string; labelTop: number; children: ReactNode }) {
  return (
    <main className="relative h-[100dvh] w-full overflow-hidden bg-atlas-night">
      <p aria-hidden className="absolute left-0 right-0 text-center font-manrope text-[12px] leading-[16px] text-atlas-mist" style={{ top: labelTop }}>
        {label}
      </p>
      {children}
    </main>
  );
}

function CloseButton() {
  return (
    <AtlasLink
      to="Main"
      label="Close the scanner"
      className="absolute left-[16px] top-[16px] flex size-[44px] items-center justify-center rounded-[12px] bg-atlas-ink/75"
    >
      <AtlasIcon src="/atlas-ui/icon-close-light.svg" size={20} />
    </AtlasLink>
  );
}

const CORNER = "absolute size-[44px] border-atlas-beige";

export function ScanScreen() {
  const [flash, setFlash] = useState(false);
  return (
    <CameraSurface label="[Live camera view]" labelTop={520}>
      <CloseButton />
      <button
        type="button"
        aria-pressed={flash}
        aria-label="Flashlight"
        onClick={() => setFlash(!flash)}
        className={`absolute right-[16px] top-[16px] flex size-[44px] items-center justify-center rounded-[22px] ${flash ? "bg-atlas-paper/30" : "bg-atlas-ink/75"}`}
      >
        <AtlasIcon src="/atlas-ui/icon-flash.svg" size={20} />
      </button>

      <div className="absolute left-[24px] right-[24px] top-[76px] flex flex-col items-center gap-[6px]">
        <p className="font-grotesk text-[11px] font-medium uppercase leading-[14px] tracking-[0.88px] text-atlas-beige">Next stop</p>
        <h1 className="font-grotesk text-[22px] font-bold leading-[28px] text-atlas-paper">Partner Place 2</h1>
        <p className="w-full text-center font-manrope text-[14px] leading-[19px] text-atlas-fog">
          Point your camera at the Atlas code at any partner&apos;s counter
        </p>
        <p className="flex items-center gap-[6px] font-manrope text-[13px] leading-[18px] text-atlas-paper">
          <AtlasIcon src="/atlas-ui/icon-pin-light-15.svg" size={15} />
          You&apos;re at Partner Place 2
        </p>
      </div>

      <AtlasLink to="Unlocked" label="Simulate a good scan" className="absolute left-1/2 top-[196px] block size-[240px] -translate-x-1/2">
        <span className={`${CORNER} left-0 top-0 rounded-tl-[14px] border-l-4 border-t-4`} />
        <span className={`${CORNER} right-0 top-0 rounded-tr-[14px] border-r-4 border-t-4`} />
        <span className={`${CORNER} bottom-0 left-0 rounded-bl-[14px] border-b-4 border-l-4`} />
        <span className={`${CORNER} bottom-0 right-0 rounded-br-[14px] border-b-4 border-r-4`} />
      </AtlasLink>

      <div className="absolute bottom-0 left-0 right-0">
        <section className="flex w-full flex-col items-start gap-[12px] rounded-t-[24px] bg-atlas-paper px-[16px] pb-[12px] pt-[18px]">
          <h2 className="font-grotesk text-[17px] font-bold leading-[22px] text-atlas-teal">Can&apos;t find the code?</h2>
          <p className="w-full font-manrope text-[14px] leading-[1.55] text-atlas-slate">Ask staff for the Atlas card, or use your location.</p>
          <AtlasButton to="Unlocked" tone="outline">
            Check in with my location
          </AtlasButton>
          <p className="w-full text-center font-manrope text-[12px] leading-[1.5] text-atlas-slate">
            The camera only reads the code on your phone. No photos are saved or sent.
          </p>
        </section>
        <AtlasBottomBar active="scan" />
      </div>
    </CameraSurface>
  );
}

export function ScanProblemScreen({ problem }: { problem: ScanProblem }) {
  return (
    <CameraSurface label="[Camera view, paused]" labelTop={200}>
      <CloseButton />
      <AtlasLink
        to={problem.next}
        className="absolute right-[16px] top-[16px] flex h-[44px] items-center justify-center overflow-hidden rounded-[22px] border border-dashed border-atlas-beige bg-atlas-ink/75 px-[14px] font-manrope text-[12px] leading-[16px] text-atlas-paper"
      >
        Design review: case {problem.caseNumber} of 6 ›
      </AtlasLink>
      <section
        role="alertdialog"
        aria-labelledby="scan-problem-title"
        className="absolute bottom-0 left-0 right-0 flex flex-col items-start gap-[14px] rounded-t-[24px] bg-atlas-paper px-[20px] pb-[28px] pt-[24px]"
      >
        <span className="flex size-[56px] items-center justify-center rounded-[28px] bg-atlas-sand">
          <AtlasIcon src={problem.icon} size={26} />
        </span>
        <h1 id="scan-problem-title" className="w-full font-grotesk text-[22px] font-bold leading-[25px] text-atlas-teal">
          {problem.title}
        </h1>
        <p className="w-full font-manrope text-[15px] leading-[23px] text-atlas-ink">{problem.body}</p>
        <AtlasButton to={problem.primary.to}>{problem.primary.label}</AtlasButton>
        <AtlasTextLink to={problem.secondary.to}>{problem.secondary.label}</AtlasTextLink>
      </section>
    </CameraSurface>
  );
}
