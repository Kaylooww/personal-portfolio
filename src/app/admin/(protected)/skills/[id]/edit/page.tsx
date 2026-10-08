import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { z } from "zod";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { DangerDeleteButton } from "@/components/admin/DangerDeleteButton";
import { SkillForm } from "@/components/admin/skills/SkillForm";
import { UiIcon } from "@/components/ui/UiIcon";
import { deleteSkill } from "@/lib/actions/skills";
import { requireAdmin } from "@/lib/auth/admin";
import { getAdminSkill, listAdminSkillCategories } from "@/lib/queries/admin-skills";
import { skillToFormValues } from "@/lib/validation/skill";

export const metadata: Metadata = { title: "Edit skill" };

interface EditSkillPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditSkillPage({ params }: EditSkillPageProps) {
  const { id } = await params;
  await requireAdmin(`/admin/skills/${id}/edit`);
  if (!z.uuid().safeParse(id).success) notFound();

  const [skill, categories] = await Promise.all([getAdminSkill(id), listAdminSkillCategories()]);
  if (!skill) notFound();

  const usage =
    skill.projectCount > 0
      ? `This action cannot be undone. It is removed from the tech stack of ${skill.projectCount} ${skill.projectCount === 1 ? "project" : "projects"}.`
      : "This action cannot be undone.";

  return (
    <>
      <Link href="/admin/skills" className="mb-4 inline-flex items-center gap-1.5 text-sm font-extrabold text-link hover:underline">
        <UiIcon name="arrow-left" className="size-4" />
        All skills
      </Link>
      <AdminPageHeader
        title={skill.name}
        description={
          skill.projectCount > 0
            ? `Used in ${skill.projectCount} ${skill.projectCount === 1 ? "project" : "projects"}.`
            : "Not used by any project yet."
        }
      />
      <div className="mt-8 flex flex-col gap-6">
        {/* key: remount the form with fresh defaults after each save */}
        <SkillForm key={skill.updated_at} skillId={skill.id} defaults={skillToFormValues(skill)} categories={categories} />
        <section className="flex flex-wrap items-center justify-between gap-3 rounded-card border border-danger-edge bg-danger-soft/40 p-5">
          <div>
            <h2 className="font-display-heavy text-lg uppercase text-danger">Danger zone</h2>
            <p className="text-sm text-ink-muted">Prefer hiding it if you might want it back.</p>
          </div>
          <DangerDeleteButton
            action={deleteSkill.bind(null, skill.id)}
            buttonLabel="Delete skill"
            title={`Delete "${skill.name}"?`}
            message={usage}
            confirmLabel="Delete skill"
            redirectTo="/admin/skills"
          />
        </section>
      </div>
    </>
  );
}
