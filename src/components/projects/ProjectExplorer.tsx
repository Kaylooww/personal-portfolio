"use client";

import { useId, useState } from "react";
import { buttonClasses } from "@/components/ui/ButtonLink";
import { EmptyState } from "@/components/ui/EmptyState";
import { UiIcon } from "@/components/ui/UiIcon";
import { PROJECT_STATUSES, PROJECT_STATUS_LABEL } from "@/lib/constants/status";
import { cn } from "@/lib/utils/cn";
import type { ProjectStatus, ProjectWithRelations } from "@/types";
import { ProjectCard } from "./ProjectCard";

type StatusFilter = ProjectStatus | "all";

function matches(project: ProjectWithRelations, query: string): boolean {
  if (!query) return true;
  const haystack = [project.title, project.short_description, project.role ?? "", ...project.technologies.map((t) => t.name)]
    .join(" ")
    .toLowerCase();
  return query
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)
    .every((word) => haystack.includes(word));
}

/** Search + status filter over the (already public-only) project list. */
export function ProjectExplorer({ projects }: { projects: ProjectWithRelations[] }) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<StatusFilter>("all");
  const searchId = useId();

  const trimmed = query.trim();
  const isFiltered = trimmed !== "" || status !== "all";
  const availableStatuses = PROJECT_STATUSES.filter((s) => projects.some((p) => p.status === s));
  // Numbers follow the full published order so they stay put while filtering.
  const visible = projects
    .map((project, i) => ({ project, number: i + 1 }))
    .filter(({ project }) => (status === "all" || project.status === status) && matches(project, trimmed));

  const reset = () => {
    setQuery("");
    setStatus("all");
  };

  return (
    <div>
      <div className="surface-paper flex flex-col gap-3 rounded-card p-3 sm:flex-row sm:items-center">
        <label htmlFor={searchId} className="sr-only">
          Search projects
        </label>
        <div className="relative sm:w-64 sm:shrink-0">
          <UiIcon name="search" className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-navy-500" />
          <input
            id={searchId}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search expeditions"
            className="h-11 w-full rounded-control border border-paper-edge bg-white/70 pl-9 pr-3 text-sm text-navy-900 placeholder:text-navy-500"
          />
        </div>
        <div role="group" aria-label="Filter by status" className="flex flex-wrap gap-1.5">
          {(["all", ...availableStatuses] as const).map((s) => (
            <button
              key={s}
              type="button"
              aria-pressed={status === s}
              onClick={() => setStatus(s)}
              className={cn(
                "h-9 rounded-pill px-3.5 text-xs font-extrabold uppercase tracking-[0.06em] transition-trail transition-colors",
                status === s ? "bg-navy-900 text-paper" : "bg-paper-shade text-navy-800 hover:bg-blue-50",
              )}
            >
              {s === "all" ? "All" : PROJECT_STATUS_LABEL[s]}
            </button>
          ))}
        </div>
      </div>

      <p aria-live="polite" className="mt-3 px-1 text-sm font-bold text-navy-700">
        {isFiltered ? `${visible.length} of ${projects.length} expeditions` : `${projects.length} ${projects.length === 1 ? "expedition" : "expeditions"}`}
      </p>

      {visible.length > 0 ? (
        <ul className="mt-6 grid gap-x-6 gap-y-9 xl:grid-cols-2">
          {visible.map(({ project, number }) => (
            <li key={project.id} className="flex">
              <ProjectCard project={project} number={number} />
            </li>
          ))}
        </ul>
      ) : (
        <EmptyState
          className="mt-6"
          title={projects.length === 0 ? "No expeditions yet" : "No trail matches"}
          message={projects.length === 0 ? "The first expedition is being planned." : "Try a different search or status."}
          action={
            isFiltered ? (
              <button type="button" onClick={reset} className={buttonClasses("secondary", "md")}>
                Clear filters
              </button>
            ) : undefined
          }
        />
      )}
    </div>
  );
}
