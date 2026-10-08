import type { Metadata } from "next";
import Link from "next/link";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { ProjectForm } from "@/components/admin/projects/ProjectForm";
import { UiIcon } from "@/components/ui/UiIcon";
import { requireAdmin } from "@/lib/auth/admin";
import { listSkillOptions } from "@/lib/queries/admin-projects";
import { EMPTY_PROJECT_FORM } from "@/lib/validation/project";

export const metadata: Metadata = { title: "New project" };

export default async function NewProjectPage() {
  await requireAdmin("/admin/projects/new");
  const skills = await listSkillOptions();

  return (
    <>
      <Link href="/admin/projects" className="mb-4 inline-flex items-center gap-1.5 text-sm font-extrabold text-link hover:underline">
        <UiIcon name="arrow-left" className="size-4" />
        All projects
      </Link>
      <AdminPageHeader title="New project" description="Save as a draft while you write; publish when it's ready. Screenshots can be added after the first save." />
      <div className="mt-8">
        <ProjectForm defaults={EMPTY_PROJECT_FORM} skillOptions={skills} uploadFolder={`projects/new-${crypto.randomUUID()}`} />
      </div>
    </>
  );
}
