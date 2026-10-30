import type { Metadata } from "next";
import { AtlasLogo } from "@/components/atlas-ui/asset";
import { AtlasButton, AtlasField, AtlasLink, type } from "@/components/atlas-ui/ui";

/* AdminSignIn · Admin sign-in — Figma frame 70:780. */

export const metadata: Metadata = { title: "Admin sign-in" };

export default function AdminSignInPage() {
  return (
    <form
      noValidate
      aria-labelledby="admin-sign-in-title"
      className="flex w-full max-w-[420px] flex-col items-start gap-[16px] rounded-[16px] border border-atlas-beige bg-white p-[24px] sm:p-[32px]"
    >
      <AtlasLogo tone="teal" width={42} height={48} />
      <div className="flex w-full flex-col items-start gap-[6px]">
        <h1 id="admin-sign-in-title" className={type.title}>
          Admin sign-in
        </h1>
        <p className="font-manrope text-[14px] leading-[19px] text-atlas-slate">For Atlas platform admins only.</p>
      </div>
      <AtlasField id="admin-email" label="Email" type="email" placeholder="admin@example.com" autoComplete="username" />
      <AtlasField id="admin-password" label="Password" type="password" placeholder="••••••••••" autoComplete="current-password" />
      <AtlasButton to="AdminHotels">Sign in</AtlasButton>
      <AtlasLink
        to="AdminDenied"
        className="flex h-[44px] w-full items-center justify-center text-center font-manrope text-[13px] font-semibold leading-[18px] text-atlas-slate"
      >
        Demo: sign in without admin access
      </AtlasLink>
      <AtlasLink
        to="Welcome"
        className="flex h-[44px] w-full items-center justify-center text-center font-manrope text-[14px] font-semibold leading-[19px] text-atlas-teal"
      >
        Open the guest app
      </AtlasLink>
    </form>
  );
}
