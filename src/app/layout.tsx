import type { Metadata, Viewport } from "next";
import { Manrope, Space_Grotesk } from "next/font/google";
import type { ReactNode } from "react";
import "./globals.css";

/*
 * Atlas — a faithful web recreation of the Atlas Figma file
 * (figma.com/design/3N0YrlADgeuFyp8I8oh5of).
 *
 * Space Grotesk and Manrope are the brand faces (docs/atlas-brand-book.md). Both are
 * published under the SIL Open Font License and loaded here with next/font/google, so they
 * are self-hosted rather than fetched from Google at runtime.
 */

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-atlas-grotesk",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-atlas-manrope",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Atlas",
  description: "Tell us when you're free. We'll figure out what you can do.",
};

export const viewport: Viewport = {
  themeColor: "#0a4a4f",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${manrope.variable}`}>
      <body>
        {/*
         * The design frame is 390 wide. Capping at 390 keeps every screen pixel-exact on
         * desktop and on phones at that width or wider; narrower phones scale down fluidly.
         */}
        <div className="mx-auto min-h-full w-full max-w-[390px] bg-atlas-paper text-atlas-ink shadow-[0_0_60px_rgba(28,41,41,0.10)]">
          {children}
        </div>
      </body>
    </html>
  );
}
