import type { ReactNode } from "react";
import { SkipLink } from "./SkipLink";

/**
 * Frame shared by every public checkpoint.
 * Phase 2 mounts TopNavigation, ExpeditionSidebar and MobileNavigation here;
 * the grid already reserves the sidebar column on large screens.
 */
export function PortfolioShell({ children }: { children: ReactNode }) {
  return (
    <>
      <SkipLink />
      <div className="relative min-h-dvh lg:grid lg:grid-cols-[var(--sidebar-width)_minmax(0,1fr)]">
        <div aria-hidden className="hidden lg:block" data-slot="expedition-sidebar" />
        <main id="main" tabIndex={-1} className="relative z-(--z-content) min-w-0 outline-none">
          {children}
        </main>
      </div>
    </>
  );
}
