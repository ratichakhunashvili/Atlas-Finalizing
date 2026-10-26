"use client";

import { useState } from "react";
import { AtlasButton, AtlasField, AtlasLink, Spacer, type } from "./ui";

/*
 * Auth form — Figma component set 1:4998, variants "Sign in" (1:4999) and "Create account"
 * (1:5025). The mode switch toggles between them; the button continues to location
 * permission, as the component description specifies.
 *
 * Nothing is submitted anywhere yet: the form is ready for an auth handler to be attached.
 */

type Mode = "sign-in" | "create";

function ModeTab({ active, onSelect, children }: { active: boolean; onSelect: () => void; children: string }) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      onClick={onSelect}
      className={`flex h-[44px] min-w-0 flex-1 items-center justify-center font-manrope text-[14px] font-semibold leading-[19px] ${
        active ? "bg-atlas-teal text-atlas-paper" : "bg-atlas-paper text-atlas-teal"
      }`}
    >
      {children}
    </button>
  );
}

export function AtlasAuthForm({ initialMode = "sign-in" }: { initialMode?: Mode }) {
  const [mode, setMode] = useState<Mode>(initialMode);
  const creating = mode === "create";

  return (
    <form className="flex w-full min-h-0 flex-1 flex-col items-start gap-[16px]" onSubmit={(event) => event.preventDefault()}>
      <div className="flex w-full flex-col items-start gap-[8px]">
        <p className={type.eyebrow}>Hotel A</p>
        <h1 className={`w-full ${type.title}`}>{creating ? "Create your account" : "Welcome back"}</h1>
        <p className={`w-full ${type.body} text-atlas-slate`}>
          Your account keeps your plan and achievements for this stay.
        </p>
      </div>

      <div role="tablist" aria-label="Account" className="flex w-full overflow-hidden rounded-[12px] border border-atlas-beige">
        <ModeTab active={!creating} onSelect={() => setMode("sign-in")}>
          Sign in
        </ModeTab>
        <ModeTab active={creating} onSelect={() => setMode("create")}>
          Create account
        </ModeTab>
      </div>

      <div className="flex w-full flex-col items-start gap-[16px]">
        {creating ? (
          <>
            <AtlasField id="auth-name" label="Your name" placeholder="First name" autoComplete="given-name" />
            <AtlasField id="auth-email" label="Email" type="email" placeholder="you@example.com" autoComplete="email" />
            <AtlasField
              id="auth-password"
              label="Password"
              type="password"
              autoComplete="new-password"
              hint="At least 8 characters."
            />
          </>
        ) : (
          <>
            <AtlasField id="auth-email" label="Email" type="email" placeholder="you@example.com" autoComplete="email" />
            <AtlasField id="auth-password" label="Password" type="password" autoComplete="current-password" />
            <AtlasLink
              to="ForgotPassword"
              className="flex h-[44px] items-center font-manrope text-[14px] font-semibold leading-[19px] text-atlas-teal"
            >
              Forgot password?
            </AtlasLink>
          </>
        )}
      </div>

      <Spacer />

      <div className="flex w-full flex-col items-start gap-[10px]">
        <AtlasButton to="PermLocation">{creating ? "Create account" : "Sign in"}</AtlasButton>
        <AtlasLink to="PrivacyPublic" className="w-full text-center font-manrope text-[12px] leading-[1.5] text-atlas-slate">
          By continuing you agree to Atlas&apos;s Terms and Privacy notice.
        </AtlasLink>
      </div>
    </form>
  );
}
