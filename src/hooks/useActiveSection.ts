"use client";

import { usePathname } from "next/navigation";
import { getSectionForPath, getSectionIndex, type PortfolioSection } from "@/lib/constants/sections";

interface ActiveSection {
  section: PortfolioSection | null;
  /** 0-based position on the route; -1 when off the route (e.g. 404). */
  index: number;
}

export function useActiveSection(): ActiveSection {
  const section = getSectionForPath(usePathname());
  return { section, index: section ? getSectionIndex(section.id) : -1 };
}
