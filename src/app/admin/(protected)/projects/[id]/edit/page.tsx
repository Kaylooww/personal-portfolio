import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { z } from "zod";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { DeleteProjectButton } from "@/components/admin/projects/DeleteProjectButton";
import { ProjectForm } from "@/components/admin/projects/ProjectForm";
import { ProjectImagesManager } from "@/components/admin/projects/ProjectImagesManager";
import { UiIcon } from "@/components/ui/UiIcon";
import { requireAdmin } from "@/lib/auth/admin";
import { getAdminProject, listSkillOptions } from "@/lib/queries/admin-projects";
import { projectToFormValues } from "@/lib/validation/project";

export const metadata: Metadata = { title: "Edit project" };

interface EditProjectPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditProjectPage({ params }: EditProjectPageProps) {
  const { id } = await params;
  await requireAdmin(`/admin/projects/${id}/edit`);
  if (!z.uuid().safeParse(id).success) notFound();

  const [detail, skills] = await Promise.all([getAdminProject(id), listSkillOptions()]);
  if (!detail) notFound();
  const { project, technologyIds, images } = detail;

  return (
    <>
      <Link href="/admin/projects" className="mb-4 inline-flex items-center gap-1.5 text-sm font-extrabold text-blue-600 hover:underline">
        <UiIcon name="arrow-left" className="size-4" />
        All projects
      </Link>
      <AdminPageHeader
        title={project.title}
        description={`/projects/${project.slug}`}
        actions={
          project.content_state === "published" && project.is_visible ? (
            <Link href={`/projects/${project.slug}`} target="_blank" className="inline-flex items-center gap-1.5 text-sm font-extrabold text-blue-600 hover:underline">
              View public page <UiIcon name="external" className="size-4" />
              <span className="sr-only">(opens in a new tab)</span>
            </Link>
          ) : undefined
        }
      />
      <div className="mt-8 flex flex-col gap-6">
        {/* key: remount the form with fresh defaults after each save */}
        <ProjectForm
          key={project.updated_at}
          projectId={project.id}
          defaults={projectToFormValues(project, technologyIds)}
          skillOptions={skills}
          uploadFolder={`projects/${project.id}`}
        />
        <ProjectImagesManager projectId={project.id} projectTitle={project.title} images={images} />
        <section className="flex flex-wrap items-center justify-between gap-3 rounded-card border border-danger-100 bg-danger-100/40 p-5">
          <div>
            <h2 className="font-display-heavy text-lg uppercase text-danger-600">Danger zone</h2>
            <p className="text-sm text-navy-700">Prefer archiving if you might want it back.</p>
          </div>
          <DeleteProjectButton projectId={project.id} title={project.title} />
        </section>
      </div>
    </>
  );
}
