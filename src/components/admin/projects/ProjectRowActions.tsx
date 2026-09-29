"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { ContentIcon } from "@/components/ui/ContentIcon";
import { useToast } from "@/components/ui/Toast";
import { UiIcon } from "@/components/ui/UiIcon";
import { deleteProject, moveProject, setProjectContentState, setProjectFlag } from "@/lib/actions/projects";
import type { ActionResult } from "@/lib/actions/result";
import { cn } from "@/lib/utils/cn";
import { EyeIcon } from "../RowIconButton";
import type { AdminProjectListItem } from "@/lib/queries/admin-projects";

interface ProjectRowActionsProps {
  project: AdminProjectListItem;
  canMoveUp: boolean;
  canMoveDown: boolean;
  /** Reordering only makes sense on the unfiltered list. */
  reorderable: boolean;
}

const iconBtn =
  "grid size-9 place-items-center rounded-control text-navy-700 transition-trail transition-colors hover:bg-blue-50 hover:text-blue-600 disabled:pointer-events-none disabled:opacity-35";
const textBtn =
  "h-9 rounded-control px-3 text-xs font-extrabold uppercase tracking-[0.06em] transition-trail transition-colors disabled:opacity-50";

export function ProjectRowActions({ project, canMoveUp, canMoveDown, reorderable }: ProjectRowActionsProps) {
  const toast = useToast();
  const [pending, startTransition] = useTransition();
  const [confirmOpen, setConfirmOpen] = useState(false);

  const run = (action: () => Promise<ActionResult>, after?: () => void) =>
    startTransition(async () => {
      const result = await action();
      if (result.ok) {
        if (result.message) toast.success(result.message);
        after?.();
      } else {
        toast.error(result.error);
      }
    });

  const isPublished = project.content_state === "published";
  const isArchived = project.content_state === "archived";

  return (
    <div className="flex flex-wrap items-center gap-1" aria-busy={pending}>
      {reorderable && (
        <span className="mr-1 flex">
          <button type="button" className={iconBtn} disabled={!canMoveUp || pending} onClick={() => run(() => moveProject(project.id, "up"))} aria-label={`Move "${project.title}" up`}>
            <UiIcon name="chevron-up" className="size-4" />
          </button>
          <button type="button" className={iconBtn} disabled={!canMoveDown || pending} onClick={() => run(() => moveProject(project.id, "down"))} aria-label={`Move "${project.title}" down`}>
            <UiIcon name="chevron-up" className="size-4 rotate-180" />
          </button>
        </span>
      )}

      <button
        type="button"
        className={cn(iconBtn, project.featured && "text-gold-500")}
        disabled={pending}
        aria-pressed={project.featured}
        aria-label={project.featured ? `Unfeature "${project.title}"` : `Feature "${project.title}"`}
        title={project.featured ? "Featured" : "Not featured"}
        onClick={() => run(() => setProjectFlag(project.id, "featured", !project.featured))}
      >
        <ContentIcon icon="star" className={cn("size-4", project.featured && "fill-current")} />
      </button>
      <button
        type="button"
        className={iconBtn}
        disabled={pending}
        aria-pressed={!project.is_visible}
        aria-label={project.is_visible ? `Hide "${project.title}"` : `Show "${project.title}"`}
        title={project.is_visible ? "Visible" : "Hidden"}
        onClick={() => run(() => setProjectFlag(project.id, "is_visible", !project.is_visible))}
      >
        <EyeIcon off={!project.is_visible} />
      </button>

      {isPublished ? (
        <button type="button" className={cn(textBtn, "text-navy-700 hover:bg-navy-900/5")} disabled={pending} onClick={() => run(() => setProjectContentState(project.id, "draft"))}>
          Unpublish
        </button>
      ) : (
        <button type="button" className={cn(textBtn, "bg-moss-100 text-moss-700 hover:bg-moss-100/70")} disabled={pending} onClick={() => run(() => setProjectContentState(project.id, "published"))}>
          Publish
        </button>
      )}
      <button
        type="button"
        className={cn(textBtn, "text-navy-700 hover:bg-navy-900/5")}
        disabled={pending}
        onClick={() => run(() => setProjectContentState(project.id, isArchived ? "draft" : "archived"))}
      >
        {isArchived ? "Restore" : "Archive"}
      </button>

      <Link href={`/admin/projects/${project.id}/edit`} className={cn(textBtn, "grid place-items-center bg-blue-500 text-white hover:bg-blue-600")}>
        Edit<span className="sr-only"> {project.title}</span>
      </Link>
      <button type="button" className={cn(iconBtn, "hover:bg-danger-100 hover:text-danger-600")} disabled={pending} onClick={() => setConfirmOpen(true)} aria-label={`Delete "${project.title}"`}>
        <UiIcon name="trash" className="size-4" />
      </button>

      <ConfirmDialog
        open={confirmOpen}
        title={`Delete "${project.title}"?`}
        message="This action cannot be undone. Its screenshots and thumbnail are deleted too."
        confirmLabel="Delete project"
        pending={pending}
        onCancel={() => setConfirmOpen(false)}
        onConfirm={() => run(() => deleteProject(project.id), () => setConfirmOpen(false))}
      />
    </div>
  );
}
