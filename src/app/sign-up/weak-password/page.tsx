import type { Metadata } from "next";
import { AtlasLogo } from "@/components/atlas-ui/asset";
import { AtlasSignUpForm } from "@/components/atlas-ui/sign-up-form";
import { AtlasBackButton, FlowScreen } from "@/components/atlas-ui/ui";

/* SignUpWeak · Create account: weak password — Figma frame 70:3654. */

export const metadata: Metadata = { title: "Choose a stronger password" };

export default function SignUpWeakPage() {
  return (
    <main>
      <FlowScreen>
        <div className="flex w-full items-center justify-between">
          <AtlasBackButton to="Welcome" />
          <AtlasLogo tone="teal" width={39} height={44} />
        </div>
        <div className="flex w-full flex-1 flex-col">
          <AtlasSignUpForm problem="weak-password" />
        </div>
      </FlowScreen>
    </main>
  );
}
