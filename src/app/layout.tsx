import type { Metadata, Viewport } from "next";
import { Manrope, Space_Grotesk } from "next/font/google";
import type { ReactNode } from "react";
import { NavigationMemory } from "@/components/atlas-ui/navigation";
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
  title: { template: "%s · Atlas prototype", default: "Atlas prototype" },
  description: "Tell us when you're free. We'll figure out what you can do.",
  // An interface prototype with fictional fixtures: keep it out of search results.
  robots: { index: false, follow: false },
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
         * At 390 wide every screen renders the Figma frame exactly. Other widths adapt the
         * composition (globals.css: the `wide` and `short` layouts) instead of scaling it.
         */}
        <div className="atlas-app min-h-full w-full bg-atlas-paper text-atlas-ink">
          <NavigationMemory />
          {children}
        </div>
      </body>
    </html>
  );
}
