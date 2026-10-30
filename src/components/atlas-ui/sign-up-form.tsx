"use client";

import { AtlasIcon } from "./asset";
import { AtlasButton, AtlasField, AtlasLink, Spacer, type } from "./ui";

/*
 * Create account — the form shared by SignUp (70:3586), SignUpEmailUsed (70:3615) and
 * SignUpWeak (70:3654). `problem` picks the error state; without it the form is clean.
 *
 * The design shows the fields filled with an example guest, so they start with those values.
 * Nothing is submitted anywhere: the button continues to StayConfirmed, as the prototype does.
 */

export type SignUpProblem = "email-used" | "weak-password";

const PASSWORD_HINT = "At least 8 characters, with a letter and a number.";

const LINK = "flex h-[44px] items-center font-manrope text-[14px] font-semibold leading-[19px] text-atlas-teal";

export function AtlasSignUpForm({ problem }: { problem?: SignUpProblem }) {
  const emailUsed = problem === "email-used";
  const weak = problem === "weak-password";

  return (
    <form className="flex w-full min-h-0 flex-1 flex-col items-start gap-[16px]" onSubmit={(event) => event.preventDefault()}>
      <div className="flex w-full flex-col items-start gap-[8px]">
        <p className={type.eyebrow}>Hotel A</p>
        <h1 className={`w-full ${type.title}`}>Create your account</h1>
        <p className={`w-full ${type.body} text-atlas-slate`}>Your account keeps your plan and achievements for this stay.</p>
      </div>

      {emailUsed ? (
        <div
          role="alert"
          className="flex w-full items-start gap-[10px] rounded-[12px] border border-atlas-danger bg-atlas-danger-soft px-[14px] py-[12px]"
        >
          <AtlasIcon src="/atlas-ui/icon-info-danger-18.svg" size={18} className="mt-px shrink-0" />
          <p className="min-w-0 flex-1 font-manrope text-[14px] leading-[1.45] text-atlas-danger">
            An account with this email already exists.
          </p>
        </div>
      ) : null}

      <div className="flex w-full flex-col items-start gap-[16px]">
        <AtlasField id="signup-name" label="Your name" defaultValue="Nino" autoComplete="given-name" />
        <AtlasField
          id="signup-email"
          label="Email"
          type="email"
          defaultValue="nino@example.com"
          autoComplete="email"
          error={emailUsed ? "This email is already in use." : undefined}
        />
        <AtlasField
          id="signup-password"
          label="Password"
          type="password"
          autoComplete="new-password"
          defaultValue={emailUsed ? "atlas-2026" : weak ? "123456" : undefined}
          hint={PASSWORD_HINT}
          error={weak ? "Too easy to guess. Use at least 8 characters with a letter and a number." : undefined}
        />
        {emailUsed ? (
          <div className="flex w-full flex-wrap items-center gap-x-[16px]">
            <AtlasLink to="SignIn" className={LINK}>
              Sign in instead
            </AtlasLink>
            <AtlasLink to="ForgotPassword" className={LINK}>
              Forgot password?
            </AtlasLink>
          </div>
        ) : null}
      </div>

      <Spacer />

      <div className="flex w-full flex-col items-start gap-[10px]">
        <AtlasButton to="StayConfirmed">Create account</AtlasButton>
        <AtlasLink to="PrivacyPublic" className="atlas-hit w-full text-center font-manrope text-[12px] leading-[1.5] text-atlas-slate">
          By continuing you agree to Atlas&apos;s Terms and Privacy notice.
        </AtlasLink>
        <p className="w-full text-center font-manrope text-[12px] leading-[1.5] text-atlas-slate">
          Prototype: sign-up isn&apos;t connected. Nothing you type is checked, stored or sent.
        </p>
      </div>
    </form>
  );
}
