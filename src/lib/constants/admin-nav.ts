import type { ContentIconKey } from "@/components/ui/ContentIcon";

export interface AdminNavItem {
  label: string;
  href: `/admin${string}`;
  icon: ContentIconKey;
}

/** Admin sidebar, in the order from .context/ADMIN.md. */
export const ADMIN_NAV: readonly AdminNavItem[] = [
  { label: "Dashboard", href: "/admin", icon: "compass" },
  { label: "Profile", href: "/admin/profile", icon: "users" },
  { label: "About", href: "/admin/about", icon: "book" },
  { label: "Skills", href: "/admin/skills", icon: "tools" },
  { label: "Projects", href: "/admin/projects", icon: "flag" },
  { label: "Journey", href: "/admin/journey", icon: "mountain" },
  { label: "Milestones", href: "/admin/milestones", icon: "trophy" },
  { label: "Media", href: "/admin/media", icon: "camera" },
  { label: "Settings", href: "/admin/settings", icon: "gear" },
];
