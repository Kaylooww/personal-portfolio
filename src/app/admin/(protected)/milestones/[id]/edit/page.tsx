import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { z } from "zod";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { DangerDeleteButton } from "@/components/admin/DangerDeleteButton";
import { MilestoneForm } from "@/components/admin/milestones/MilestoneForm";
import { UiIcon } from "@/components/ui/UiIcon";
import { deleteMilestone } from "@/lib/actions/milestones";
import { requireAdmin } from "@/lib/auth/admin";
import { getAdminMilestone, listAdminMilestoneCategories } from "@/lib/queries/admin-content";
import { milestoneToFormValues } from "@/lib/validation/content";

export const metadata: Metadata = { title: "Edit milestone" };

interface EditMilestonePageProps {
  params: Promise<{ id: string }>;
}

export default async function EditMilestonePage({ params }: EditMilestonePageProps) {
  const { id } = await params;
  await requireAdmin(`/admin/milestones/${id}/edit`);
  if (!z.uuid().safeParse(id).success) notFound();

  const [milestone, categories] = await Promise.all([getAdminMilestone(id), listAdminMilestoneCategories()]);
  if (!milestone) notFound();

  return (
    <>
      <Link href="/admin/milestones" className="mb-4 inline-flex items-center gap-1.5 text-sm font-extrabold text-blue-600 hover:underline">
        <UiIcon name="arrow-left" className="size-4" />
        All milestones
      </Link>
      <AdminPageHeader title={milestone.title} />
      <div className="mt-8 flex flex-col gap-6">
        {/* key: remount the form with fresh defaults after each save */}
        <MilestoneForm key={milestone.updated_at} milestoneId={milestone.id} defaults={milestoneToFormValues(milestone)} categories={categories} />
        <section className="flex flex-wrap items-center justify-between gap-3 rounded-card border border-danger-100 bg-danger-100/40 p-5">
          <div>
            <h2 className="font-display-heavy text-lg uppercase text-danger-600">Danger zone</h2>
            <p className="text-sm text-navy-700">Prefer hiding it if you might want it back.</p>
          </div>
          <DangerDeleteButton
            action={deleteMilestone.bind(null, milestone.id)}
            buttonLabel="Delete milestone"
            title={`Delete "${milestone.title}"?`}
            message="This action cannot be undone. Its image is deleted too."
            confirmLabel="Delete milestone"
            redirectTo="/admin/milestones"
          />
        </section>
      </div>
    </>
  );
}
