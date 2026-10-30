import type { Metadata } from "next";
import { AtlasLogo } from "@/components/atlas-ui/asset";
import { AtlasSignUpForm } from "@/components/atlas-ui/sign-up-form";
import { AtlasBackButton, FlowScreen } from "@/components/atlas-ui/ui";

/* SignUp · Create account — Figma frame 70:3586. */

export const metadata: Metadata = { title: "Create your account" };

export default function SignUpPage() {
  return (
    <main>
      <FlowScreen>
        <div className="flex w-full items-center justify-between">
          <AtlasBackButton to="Welcome" />
          <AtlasLogo tone="teal" width={39} height={44} />
        </div>
        <div className="flex w-full flex-1 flex-col">
          <AtlasSignUpForm />
        </div>
      </FlowScreen>
    </main>
  );
}
