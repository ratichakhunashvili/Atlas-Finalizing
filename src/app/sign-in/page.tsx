import { AtlasAsset, AtlasLogo } from "@/components/atlas-ui/asset";
import { AtlasAuthForm } from "@/components/atlas-ui/auth-form";
import { AtlasBackButton, FlowScreen } from "@/components/atlas-ui/ui";

/* SignIn · Sign in / create account — Figma frame 1:722, built on the Auth form set 1:4998. */

export default function SignInPage() {
  return (
    <main className="relative">
      <AtlasAsset
        src="/atlas-ui/pattern-teal-wave.svg"
        width={390}
        height={139}
        className="pointer-events-none absolute left-0 top-[64px] opacity-12"
      />
      <FlowScreen className="!bg-transparent">
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
