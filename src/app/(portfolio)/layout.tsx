import type { ReactNode } from "react";
import { PortfolioShell } from "@/components/layout/PortfolioShell";

export default function PortfolioLayout({ children }: { children: ReactNode }) {
  return <PortfolioShell>{children}</PortfolioShell>;
}
