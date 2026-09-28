import type { Metadata } from "next";
import { AdminComingSoon } from "@/components/admin/AdminComingSoon";
import { requireAdmin } from "@/lib/auth/admin";
import { getAdminNavItem } from "@/lib/constants/admin-nav";

const section = getAdminNavItem("/admin/media");

export const metadata: Metadata = { title: section.label };

export default async function AdminMediaPage() {
  await requireAdmin(section.href);
  return <AdminComingSoon section={section} />;
}
