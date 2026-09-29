import type { ReactNode } from "react";
import { PortfolioShell } from "@/components/layout/PortfolioShell";

/*
 * Public pages are statically generated from Supabase. Admin saves refresh the
 * affected pages immediately (revalidatePath); this hourly refresh is a safety
 * net for changes made directly in the database.
 */
export const revalidate = 3600;

export default function PortfolioLayout({ children }: { children: ReactNode }) {
  return <PortfolioShell>{children}</PortfolioShell>;
}
