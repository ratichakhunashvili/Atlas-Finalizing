import type { Metadata } from "next";
import Link from "next/link";

/*
 * Not found — not a Figma frame. A quiet page in the design's palette and type for links that
 * lead nowhere, pointing back to the map and the prototype guide. No logo: the design shows none.
 */

export const metadata: Metadata = { title: "Page not found" };

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-[100dvh] w-full max-w-[560px] flex-col items-start justify-center gap-[16px] px-[24px] py-[48px]">
      <p className="font-grotesk text-[11px] font-medium uppercase leading-[14px] tracking-[0.88px] text-atlas-slate">Page not found</p>
      <h1 className="font-grotesk text-[26px] font-bold leading-[30px] text-atlas-teal">This page isn&apos;t part of the prototype</h1>
      <p className="font-manrope text-[15px] leading-[23px] text-atlas-ink">
        The link may be old or mistyped. Every screen of the Atlas prototype is listed in the guide.
      </p>
      <div className="flex w-full flex-col gap-[8px] pt-[8px]">
        <Link
          href="/"
          className="flex h-[52px] w-full items-center justify-center rounded-[14px] bg-atlas-teal font-manrope text-[16px] font-semibold leading-[22px] text-atlas-paper"
        >
          Go to the map
        </Link>
        <Link href="/guide" className="flex h-[44px] w-full items-center justify-center font-manrope text-[15px] font-semibold leading-[20px] text-atlas-teal">
          Open the prototype guide
        </Link>
      </div>
    </main>
  );
}
