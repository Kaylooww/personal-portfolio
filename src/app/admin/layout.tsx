import type { Metadata } from "next";
import type { ReactNode } from "react";
import { SkipLink } from "@/components/layout/SkipLink";

export const metadata: Metadata = {
  title: { default: "Admin", template: "%s | Admin" },
  // The admin is never a search result.
  robots: { index: false, follow: false },
};

/** Plain cream canvas for every /admin route — no scenery, no public navigation. */
export default function AdminRootLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-dvh bg-cream">
      <SkipLink />
      {children}
    </div>
  );
}
