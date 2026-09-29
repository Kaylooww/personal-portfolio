import type { Metadata } from "next";
import Link from "next/link";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { MilestoneCategoryManager } from "@/components/admin/milestones/MilestoneCategoryManager";
import { UiIcon } from "@/components/ui/UiIcon";
import { requireAdmin } from "@/lib/auth/admin";
import { listAdminMilestoneCategories } from "@/lib/queries/admin-content";

export const metadata: Metadata = { title: "Milestone categories" };

export default async function MilestoneCategoriesPage() {
  await requireAdmin("/admin/milestones/categories");
  const categories = await listAdminMilestoneCategories();

  return (
    <>
      <Link href="/admin/milestones" className="mb-4 inline-flex items-center gap-1.5 text-sm font-extrabold text-blue-600 hover:underline">
        <UiIcon name="arrow-left" className="size-4" />
        All milestones
      </Link>
      <AdminPageHeader title="Milestone categories" description="Each category is a badge card on the Milestones page, in this order." />
      <div className="mt-8">
        <MilestoneCategoryManager categories={categories} />
      </div>
    </>
  );
}
