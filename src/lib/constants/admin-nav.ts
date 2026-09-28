import type { ContentIconKey } from "@/components/ui/ContentIcon";

export interface AdminNavItem {
  label: string;
  href: `/admin${string}`;
  icon: ContentIconKey;
  /** Phase that delivers the section's editor (shown on placeholder pages). */
  phase: number;
}

/** Admin sidebar, in the order from .context/ADMIN.md. */
export const ADMIN_NAV: readonly AdminNavItem[] = [
  { label: "Dashboard", href: "/admin", icon: "compass", phase: 10 },
  { label: "Profile", href: "/admin/profile", icon: "users", phase: 13 },
  { label: "About", href: "/admin/about", icon: "book", phase: 13 },
  { label: "Skills", href: "/admin/skills", icon: "tools", phase: 12 },
  { label: "Projects", href: "/admin/projects", icon: "flag", phase: 11 },
  { label: "Journey", href: "/admin/journey", icon: "mountain", phase: 13 },
  { label: "Milestones", href: "/admin/milestones", icon: "trophy", phase: 13 },
  { label: "Media", href: "/admin/media", icon: "camera", phase: 13 },
  { label: "Settings", href: "/admin/settings", icon: "gear", phase: 13 },
];

export function getAdminNavItem(href: AdminNavItem["href"]): AdminNavItem {
  const item = ADMIN_NAV.find((i) => i.href === href);
  if (!item) throw new Error(`Unknown admin section: ${href}`);
  return item;
}
