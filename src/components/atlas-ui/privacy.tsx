"use client";

import { useState, type ReactNode } from "react";
import { AtlasIcon } from "./asset";
import type { ScreenKey } from "./screens";
import { AtlasBackButton, AtlasLink, AtlasPoints, AtlasTextLink } from "./ui";

/*
 * Privacy (1:1303), PrivacyPublic (1:2888) and PrivacyDelete (1:1357). The signed-in screen adds
 * Help, the Data request row (1:178: tap once → "Requested · we will email you") and the delete
 * button; PrivacyDelete is the same screen under a confirmation sheet. The document rows jump to
 * the placeholder texts at the bottom of the page.
 */

const ROW = "flex h-[48px] w-full items-center justify-between";
const ROW_LABEL = "whitespace-nowrap font-manrope text-[15px] leading-[20px] text-atlas-ink";
const HEADING = "whitespace-nowrap font-grotesk text-[16px] font-bold leading-[20px] text-atlas-teal";

function Chevron() {
  return <AtlasIcon src="/atlas-ui/icon-chevron.svg" size={16} className="shrink-0" />;
}

function AnchorRow({ label, href, divider = true }: { label: string; href: string; divider?: boolean }) {
  return (
    <a href={href} className={`${ROW} ${divider ? "border-b border-atlas-beige" : ""}`}>
      <span className={ROW_LABEL}>{label}</span>
      <Chevron />
    </a>
  );
}

function DataRequestRow() {
  const [requested, setRequested] = useState(false);
  return (
    <button
      type="button"
      onClick={() => setRequested(true)}
      disabled={requested}
      className="flex h-[52px] w-full items-center justify-between border-b border-atlas-beige text-left"
    >
      <span className={ROW_LABEL}>Download my data</span>
      <span className="whitespace-nowrap font-manrope text-[14px] leading-[19px] text-atlas-slate">
        {requested ? "Requested · we will email you" : "›"}
      </span>
    </button>
  );
}

function Section({ title, children, gap = 0 }: { title: string; children: ReactNode; gap?: number }) {
  return (
    <section className="flex w-full flex-col items-start" style={{ gap }}>
      <h2 className={HEADING}>{title}</h2>
      {children}
    </section>
  );
}

const USES = [
  { icon: "/atlas-ui/icon-pin.svg", text: "Location: to show walk times and confirm check-ins. Sent only when you check in." },
  { icon: "/atlas-ui/icon-camera-20.svg", text: "Camera: to read codes and show the marker view. Stays on your phone." },
  { icon: "/atlas-ui/icon-home-20.svg", text: "Your stay: so we only show what Hotel A offers and approves." },
];

function Documents() {
  return (
    <>
      <div id="terms" className="flex w-full scroll-mt-[16px] flex-col items-start gap-[6px] whitespace-nowrap">
        <h2 className={HEADING}>Terms of use</h2>
        <p className="font-manrope text-[14px] leading-[19px] text-atlas-slate">[Approved terms text]</p>
      </div>
      <div id="privacy-notice" className="flex w-full scroll-mt-[16px] flex-col items-start gap-[6px] whitespace-nowrap">
        <h2 className={HEADING}>Privacy notice</h2>
        <p className="font-manrope text-[14px] leading-[19px] text-atlas-slate">[Approved privacy notice text]</p>
      </div>
    </>
  );
}

function Screen({ back, children }: { back: ScreenKey; children: ReactNode }) {
  return (
    <main className="flex min-h-[100dvh] w-full flex-col items-start gap-[18px] bg-atlas-paper px-[16px] pb-[28px] pt-[16px]">
      <AtlasBackButton to={back} />
      {children}
    </main>
  );
}

export function PrivacyScreen({ confirmDelete = false }: { confirmDelete?: boolean }) {
  return (
    <>
      <Screen back="Stay">
        <h1 className="whitespace-nowrap font-grotesk text-[24px] font-bold leading-[31px] text-atlas-teal">Help and privacy</h1>
        <Section title="Help">
          <AtlasLink to="Stay" className={`${ROW} border-b border-atlas-beige`}>
            <span className={ROW_LABEL}>Call Hotel A front desk</span>
            <Chevron />
          </AtlasLink>
          <div className={ROW}>
            <span className={ROW_LABEL}>Email Atlas support</span>
            <span className="flex items-center gap-[4px]">
              <span className="whitespace-nowrap font-manrope text-[13px] leading-[18px] text-atlas-slate">[support email]</span>
              <Chevron />
            </span>
          </div>
        </Section>
        <Section title="What Atlas uses" gap={10}>
          <AtlasPoints items={USES} gap={10} />
        </Section>
        <Section title="Your data">
          <DataRequestRow />
          <AnchorRow label="Terms of use" href="#terms" />
          <AnchorRow label="Full privacy notice" href="#privacy-notice" divider={false} />
        </Section>
        <AtlasLink
          to="PrivacyDelete"
          className="flex h-[48px] w-full items-center justify-center rounded-[12px] border border-atlas-danger font-manrope text-[15px] font-semibold leading-[20px] text-atlas-danger"
        >
          Delete my account
        </AtlasLink>
        <Documents />
      </Screen>
      {confirmDelete ? <DeleteSheet /> : null}
    </>
  );
}

function DeleteSheet() {
  return (
    <div className="fixed inset-0 z-30 mx-auto w-full max-w-[390px]">
      <div aria-hidden className="absolute inset-0 bg-atlas-ink/50" />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="delete-title"
        className="absolute inset-x-0 bottom-0 flex flex-col items-start gap-[12px] rounded-t-[24px] bg-atlas-paper px-[20px] pb-[28px] pt-[24px]"
      >
        <h2 id="delete-title" className="whitespace-nowrap font-grotesk text-[20px] font-bold leading-[26px] text-atlas-ink">
          Delete your Atlas account?
        </h2>
        <p className="w-full font-manrope text-[15px] leading-[23px] text-atlas-ink">
          Your plans and achievements will be removed. This cannot be undone. Your hotel booking is not affected.
        </p>
        <AtlasLink
          to="Welcome"
          className="flex h-[52px] w-full items-center justify-center rounded-[14px] bg-atlas-danger font-manrope text-[16px] font-semibold leading-[22px] text-white"
        >
          Delete account
        </AtlasLink>
        <AtlasTextLink to="Privacy">Keep my account</AtlasTextLink>
      </div>
    </div>
  );
}

export function PrivacyPublicScreen() {
  return (
    <Screen back="SignIn">
      <h1 className="whitespace-nowrap font-grotesk text-[24px] font-bold leading-[31px] text-atlas-teal">Terms and privacy</h1>
      <Section title="What Atlas uses" gap={10}>
        <AtlasPoints items={USES} gap={10} />
      </Section>
      <Section title="Documents">
        <AnchorRow label="Terms of use" href="#terms" />
        <AnchorRow label="Full privacy notice" href="#privacy-notice" divider={false} />
      </Section>
      <Documents />
    </Screen>
  );
}
