import type { Metadata } from "next";
import { AtlasAsset, AtlasLogo } from "@/components/atlas-ui/asset";
import { AtlasAuthForm } from "@/components/atlas-ui/auth-form";
import { AtlasBackButton, FlowScreen } from "@/components/atlas-ui/ui";

/* SignIn · Sign in / create account — Figma frame 1:722, built on the Auth form set 1:4998. */

export const metadata: Metadata = { title: "Sign in" };

export default function SignInPage() {
  return (
    <main>
      <FlowScreen className="overflow-hidden">
        <AtlasAsset
          src="/atlas-ui/pattern-teal-wave.svg"
          width={390}
          height={139}
          className="pointer-events-none absolute left-0 top-[calc(64px+env(safe-area-inset-top))] max-w-none opacity-12"
        />
        <div className="relative flex w-full items-center justify-between">
          <AtlasBackButton to="Welcome" />
          <AtlasLogo tone="teal" width={38} height={44} />
        </div>
        <div className="relative flex w-full flex-1 flex-col">
          <AtlasAuthForm />
        </div>
      </FlowScreen>
    </main>
  );
}
