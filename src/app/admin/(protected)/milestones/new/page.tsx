import type { Metadata } from "next";
import Link from "next/link";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { MilestoneForm } from "@/components/admin/milestones/MilestoneForm";
import { UiIcon } from "@/components/ui/UiIcon";
import { requireAdmin } from "@/lib/auth/admin";
import { hasMilestoneDocumentFields, listAdminMilestoneCategories } from "@/lib/queries/admin-content";
import { EMPTY_MILESTONE } from "@/lib/validation/content";

export const metadata: Metadata = { title: "New milestone" };

export default async function NewMilestonePage() {
  await requireAdmin("/admin/milestones/new");
  const [categories, documentFieldsAvailable] = await Promise.all([listAdminMilestoneCategories(), hasMilestoneDocumentFields()]);

  return (
    <>
      <Link href="/admin/milestones" className="mb-4 inline-flex items-center gap-1.5 text-sm font-extrabold text-blue-600 hover:underline">
        <UiIcon name="arrow-left" className="size-4" />
        All milestones
      </Link>
      <AdminPageHeader title="New milestone" />
      <div className="mt-8">
        <MilestoneForm defaults={{ ...EMPTY_MILESTONE, date_display: documentFieldsAvailable ? "day" : "month", category_id: categories[0]?.id ?? "" }} categories={categories} documentFieldsAvailable={documentFieldsAvailable} />
      </div>
    </>
  );
}
