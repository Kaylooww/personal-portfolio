import type { ReactNode } from "react";
import { ExpeditionSidebar } from "@/components/navigation/ExpeditionSidebar";
import { MobileNavigation } from "@/components/navigation/MobileNavigation";
import { TopNavigation } from "@/components/navigation/TopNavigation";
import { SkipLink } from "./SkipLink";
import { JourneyArrival } from "@/components/journey/JourneyArrival";

/**
 * Frame shared by every public checkpoint. The nav pieces are fixed-position
 * client islands; the grid reserves the sidebar's column so page content never
 * slides underneath it on large screens.
 */
export function PortfolioShell({ children }: { children: ReactNode }) {
  return (
    <>
      <JourneyArrival />
      <SkipLink />
      <TopNavigation />
      <MobileNavigation />
      <div className="relative min-h-dvh lg:grid lg:grid-cols-[var(--sidebar-width)_minmax(0,1fr)]">
        <ExpeditionSidebar />
        <div aria-hidden className="hidden lg:block" />
        <main id="main" tabIndex={-1} className="relative z-(--z-content) min-w-0 outline-none">
          {children}
        </main>
      </div>
    </>
  );
}
