import type { ReactNode } from "react";

/*
 * AdminSignIn (70:780) and AdminDenied (70:800): a single white card centred on Sand, no sidebar.
 */
export default function AdminAuthLayout({ children }: { children: ReactNode }) {
  return (
    <main className="flex min-h-dvh w-full items-center justify-center bg-atlas-sand px-[16px] py-[32px]">
      {children}
    </main>
  );
}
