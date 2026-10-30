import type { Metadata } from "next";
import { AtlasLogo } from "@/components/atlas-ui/asset";
import { AtlasSignUpForm } from "@/components/atlas-ui/sign-up-form";
import { AtlasBackButton, FlowScreen } from "@/components/atlas-ui/ui";

/* SignUpEmailUsed · Create account: email already used — Figma frame 70:3615. */

export const metadata: Metadata = { title: "Email already in use" };

export default function SignUpEmailUsedPage() {
  return (
    <main>
      <FlowScreen>
        <div className="flex w-full items-center justify-between">
          <AtlasBackButton to="Welcome" />
          <AtlasLogo tone="teal" width={39} height={44} />
        </div>
        <div className="flex w-full flex-1 flex-col">
          <AtlasSignUpForm problem="email-used" />
        </div>
      </FlowScreen>
    </main>
  );
}
