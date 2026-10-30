import type { ReactNode } from "react";
import { AdminShell } from "@/components/admin/admin-shell";

/*
 * Every admin frame with the sidebar (70:811–70:2027). AdminSignIn and AdminDenied sit in the
 * (auth) group beside this one, so they keep their own full-page layout under the same /admin URLs.
 */
export default function AdminPanelLayout({ children }: { children: ReactNode }) {
  return <AdminShell>{children}</AdminShell>;
}
