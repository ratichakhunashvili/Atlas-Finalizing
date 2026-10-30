import type { Metadata } from "next";
import { AtlasBadge, AtlasButton, AtlasTextLink } from "@/components/atlas-ui/ui";

/* AdminDenied · Access denied — Figma frame 70:800. */

export const metadata: Metadata = { title: "Access denied" };

export default function AdminDeniedPage() {
  return (
    <section
      aria-labelledby="admin-denied-title"
      className="flex w-full max-w-[460px] flex-col items-center gap-[14px] rounded-[16px] border border-atlas-beige bg-white p-[24px] text-center sm:p-[32px]"
    >
      <AtlasBadge icon="/atlas-ui/icon-lock-teal-29.svg" iconSize={29} tone="sand" />
      <h1 id="admin-denied-title" className="font-grotesk text-[24px] font-bold leading-[31px] text-atlas-teal">
        Access denied
      </h1>
      <p className="w-full font-manrope text-[15px] leading-[1.55] text-atlas-slate">
        {"This account isn't an Atlas platform admin. Ask a platform admin to grant access."}
      </p>
      <AtlasButton to="AdminSignIn">Sign in with a different account</AtlasButton>
      <AtlasTextLink to="Welcome">Back to the Atlas app</AtlasTextLink>
    </section>
  );
}
