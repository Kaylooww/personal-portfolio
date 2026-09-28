import type { Metadata } from "next";
import Link from "next/link";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { ProjectAdminList } from "@/components/admin/projects/ProjectAdminList";
import { ProjectFilters } from "@/components/admin/projects/ProjectFilters";
import { buttonClasses } from "@/components/ui/ButtonLink";
import { requireAdmin } from "@/lib/auth/admin";
import { listAdminProjects, parseProjectFilters } from "@/lib/queries/admin-projects";

export const metadata: Metadata = { title: "Projects" };

interface AdminProjectsPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function AdminProjectsPage({ searchParams }: AdminProjectsPageProps) {
  await requireAdmin("/admin/projects");
  const filters = parseProjectFilters(await searchParams);
  const projects = await listAdminProjects(filters);
  const filtered = Boolean(filters.q || filters.state || filters.status);

  return (
    <>
      <AdminPageHeader
        title="Projects"
        description="Drafts stay private. Publish when a project is ready; archive to hide it without deleting."
        actions={
          <Link href="/admin/projects/new" className={buttonClasses("primary", "md")}>
            + Add project
          </Link>
        }
      />
      <div className="mt-8">
        <ProjectFilters />
        <p aria-live="polite" className="mt-3 px-1 text-sm font-bold text-navy-700">
          {projects.length} {projects.length === 1 ? "project" : "projects"}
          {filtered ? " match" : ""}
          {!filtered && projects.length > 1 && <span className="font-normal text-navy-500"> · use the arrows to set the public order</span>}
        </p>
        <ProjectAdminList projects={projects} filtered={filtered} />
      </div>
    </>
  );
}
