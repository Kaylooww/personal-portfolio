import Link from "next/link";
import { buttonClasses } from "@/components/ui/ButtonLink";
import { EmptyState } from "@/components/ui/EmptyState";
import { SafeImage } from "@/components/ui/SafeImage";
import { StatusBadge } from "@/components/ui/StatusBadge";
import type { AdminProjectListItem } from "@/lib/queries/admin-projects";
import { ContentStatePill } from "../ContentStatePill";
import { ProjectRowActions } from "./ProjectRowActions";

interface ProjectAdminListProps {
  projects: AdminProjectListItem[];
  filtered: boolean;
}

const updatedFmt = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" });

export function ProjectAdminList({ projects, filtered }: ProjectAdminListProps) {
  if (projects.length === 0) {
    return filtered ? (
      <EmptyState className="mt-6" title="No matches" message="Try another search or clear the filters." />
    ) : (
      <EmptyState
        className="mt-6"
        icon="flag"
        title="No expeditions yet"
        message="Add your first project to get the climb started."
        action={
          <Link href="/admin/projects/new" className={buttonClasses("primary", "md")}>
            + Add project
          </Link>
        }
      />
    );
  }

  return (
    <ul className="mt-6 flex flex-col gap-3">
      {projects.map((p, i) => (
        <li key={p.id} className="surface-paper flex flex-col gap-4 rounded-card p-4 lg:flex-row lg:items-center">
          <div className="flex min-w-0 flex-1 items-center gap-4">
            <div className="relative aspect-[4/3] w-24 shrink-0 overflow-hidden rounded-control bg-active">
              {p.thumbnail_url && <SafeImage src={p.thumbnail_url} alt="" fill sizes="6rem" className="object-cover" fallback={null} />}
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <Link href={`/admin/projects/${p.id}/edit`} className="font-display-heavy truncate text-lg text-ink hover:text-link">
                  {p.title}
                </Link>
                <ContentStatePill state={p.content_state} />
                {!p.is_visible && (
                  <span className="rounded-tag bg-ink/10 px-2 py-0.5 text-[0.6875rem] font-extrabold uppercase tracking-[0.08em] text-ink-muted">
                    Hidden
                  </span>
                )}
              </div>
              <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-ink-subtle">
                <StatusBadge status={p.status} />
                <span>/{p.slug}</span>
                <span>Updated {updatedFmt.format(new Date(p.updated_at))}</span>
              </p>
            </div>
          </div>
          <ProjectRowActions project={p} canMoveUp={i > 0} canMoveDown={i < projects.length - 1} reorderable={!filtered} />
        </li>
      ))}
    </ul>
  );
}
