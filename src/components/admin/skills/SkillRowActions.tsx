"use client";

import Link from "next/link";
import { useState } from "react";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { ContentIcon } from "@/components/ui/ContentIcon";
import { UiIcon } from "@/components/ui/UiIcon";
import { deleteSkill, moveSkill, setSkillFlag } from "@/lib/actions/skills";
import type { AdminSkillListItem } from "@/lib/queries/admin-skills";
import { cn } from "@/lib/utils/cn";
import { EyeIcon, RowIconButton } from "../RowIconButton";
import { useAdminAction } from "../useAdminAction";

interface SkillRowActionsProps {
  skill: AdminSkillListItem;
  canMoveUp: boolean;
  canMoveDown: boolean;
  reorderable: boolean;
}

export function SkillRowActions({ skill, canMoveUp, canMoveDown, reorderable }: SkillRowActionsProps) {
  const { pending, run } = useAdminAction();
  const [confirmOpen, setConfirmOpen] = useState(false);

  return (
    <div className="flex flex-wrap items-center gap-1" aria-busy={pending}>
      {reorderable && (
        <span className="mr-1 flex">
          <RowIconButton disabled={!canMoveUp || pending} onClick={() => run(() => moveSkill(skill.id, "up"))} aria-label={`Move "${skill.name}" up`}>
            <UiIcon name="chevron-up" className="size-4" />
          </RowIconButton>
          <RowIconButton disabled={!canMoveDown || pending} onClick={() => run(() => moveSkill(skill.id, "down"))} aria-label={`Move "${skill.name}" down`}>
            <UiIcon name="chevron-up" className="size-4 rotate-180" />
          </RowIconButton>
        </span>
      )}
      <RowIconButton
        className={cn(skill.featured && "text-gold-500")}
        disabled={pending}
        aria-pressed={skill.featured}
        aria-label={skill.featured ? `Unfeature "${skill.name}"` : `Feature "${skill.name}"`}
        title={skill.featured ? "Featured" : "Not featured"}
        onClick={() => run(() => setSkillFlag(skill.id, "featured", !skill.featured))}
      >
        <ContentIcon icon="star" className={cn("size-4", skill.featured && "fill-current")} />
      </RowIconButton>
      <RowIconButton
        disabled={pending}
        aria-pressed={!skill.is_visible}
        aria-label={skill.is_visible ? `Hide "${skill.name}"` : `Show "${skill.name}"`}
        title={skill.is_visible ? "Visible" : "Hidden"}
        onClick={() => run(() => setSkillFlag(skill.id, "is_visible", !skill.is_visible))}
      >
        <EyeIcon off={!skill.is_visible} />
      </RowIconButton>
      <Link
        href={`/admin/skills/${skill.id}/edit`}
        className="grid h-9 place-items-center rounded-control bg-blue-500 px-3 text-xs font-extrabold uppercase tracking-[0.06em] text-white transition-trail transition-colors hover:bg-blue-600"
      >
        Edit<span className="sr-only"> {skill.name}</span>
      </Link>
      <RowIconButton tone="danger" disabled={pending} onClick={() => setConfirmOpen(true)} aria-label={`Delete "${skill.name}"`}>
        <UiIcon name="trash" className="size-4" />
      </RowIconButton>
      <ConfirmDialog
        open={confirmOpen}
        title={`Delete "${skill.name}"?`}
        message={
          skill.projectCount > 0
            ? `This action cannot be undone. It is removed from the tech stack of ${skill.projectCount} ${skill.projectCount === 1 ? "project" : "projects"}.`
            : "This action cannot be undone."
        }
        confirmLabel="Delete skill"
        pending={pending}
        onCancel={() => setConfirmOpen(false)}
        onConfirm={() => run(() => deleteSkill(skill.id), () => setConfirmOpen(false))}
      />
    </div>
  );
}
