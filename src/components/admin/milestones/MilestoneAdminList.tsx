"use client";

import Link from "next/link";
import { useState } from "react";
import { MilestoneBadge } from "@/components/milestones/MilestoneBadge";
import { buttonClasses } from "@/components/ui/ButtonLink";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { ContentIcon } from "@/components/ui/ContentIcon";
import { EmptyState } from "@/components/ui/EmptyState";
import { UiIcon } from "@/components/ui/UiIcon";
import { deleteMilestone, moveMilestone, setMilestoneFlag } from "@/lib/actions/milestones";
import type { AdminMilestoneCategory } from "@/lib/queries/admin-content";
import { cn } from "@/lib/utils/cn";
import { formatMonthYear } from "@/lib/utils/format";
import type { Milestone } from "@/types";
import { EyeIcon, RowIconButton } from "../RowIconButton";
import { useAdminAction } from "../useAdminAction";

interface MilestoneAdminListProps {
  milestones: Milestone[];
  categories: AdminMilestoneCategory[];
  filtered: boolean;
}

/** Milestones grouped by category (the public log order); arrows move within a category. */
export function MilestoneAdminList({ milestones, categories, filtered }: MilestoneAdminListProps) {
  const { pending, run } = useAdminAction();
  const [toDelete, setToDelete] = useState<Milestone | null>(null);

  if (milestones.length === 0) {
    return filtered ? (
      <EmptyState className="mt-6" title="No matches" message="Try another search or category." />
    ) : (
      <EmptyState
        className="mt-6"
        icon="trophy"
        title="No flags planted yet"
        message="Add your first certification, award or achievement."
        action={
          <Link href="/admin/milestones/new" className={buttonClasses("primary", "md")}>
            + Add milestone
          </Link>
        }
      />
    );
  }

  const groups = [
    ...categories.map((c) => ({ key: c.id, category: c as AdminMilestoneCategory | null, items: milestones.filter((m) => m.category_id === c.id) })),
    { key: "none", category: null, items: milestones.filter((m) => m.category_id === null) },
  ].filter((g) => g.items.length > 0);

  return (
    <div className="mt-6 flex flex-col gap-8" aria-busy={pending}>
      {groups.map((g) => (
        <section key={g.key} aria-labelledby={`ms-group-${g.key}`}>
          <h2 id={`ms-group-${g.key}`} className="flex flex-wrap items-center gap-2 font-display-heavy text-lg uppercase text-navy-900">
            {g.category ? <MilestoneBadge icon={g.category.badge_icon} accent={g.category.accent} size="sm" className="size-9" /> : <ContentIcon icon="archive" className="size-5 text-navy-500" />}
            {g.category?.name ?? "Uncategorised"}
            <span className="text-sm font-bold normal-case text-navy-500">({g.items.length})</span>
          </h2>
          <ul className="mt-3 flex flex-col gap-2">
            {g.items.map((m, i) => (
              <li key={m.id} className="surface-paper flex flex-col gap-3 rounded-card p-3 sm:flex-row sm:items-center">
                <div className="min-w-0 flex-1">
                  <p className="flex flex-wrap items-center gap-2">
                    <Link href={`/admin/milestones/${m.id}/edit`} className="font-display-heavy text-base text-navy-900 hover:text-blue-600">
                      {m.title}
                    </Link>
                    {!m.is_visible && (
                      <span className="rounded-tag bg-navy-900/10 px-2 py-0.5 text-[0.6875rem] font-extrabold uppercase tracking-[0.08em] text-navy-700">Hidden</span>
                    )}
                  </p>
                  <p className="text-sm text-navy-500">{[m.issuer, m.organization, formatMonthYear(m.date)].filter(Boolean).join(" · ") || "No details yet"}</p>
                </div>
                <div className="flex flex-wrap items-center gap-1">
                  {!filtered && (
                    <span className="mr-1 flex">
                      <RowIconButton disabled={i === 0 || pending} onClick={() => run(() => moveMilestone(m.id, "up"))} aria-label={`Move "${m.title}" up`}>
                        <UiIcon name="chevron-up" className="size-4" />
                      </RowIconButton>
                      <RowIconButton disabled={i === g.items.length - 1 || pending} onClick={() => run(() => moveMilestone(m.id, "down"))} aria-label={`Move "${m.title}" down`}>
                        <UiIcon name="chevron-up" className="size-4 rotate-180" />
                      </RowIconButton>
                    </span>
                  )}
                  <RowIconButton
                    className={cn(m.featured && "text-gold-500")}
                    disabled={pending}
                    aria-pressed={m.featured}
                    aria-label={m.featured ? `Unfeature "${m.title}"` : `Feature "${m.title}"`}
                    onClick={() => run(() => setMilestoneFlag(m.id, "featured", !m.featured))}
                  >
                    <ContentIcon icon="star" className={cn("size-4", m.featured && "fill-current")} />
                  </RowIconButton>
                  <RowIconButton
                    disabled={pending}
                    aria-pressed={!m.is_visible}
                    aria-label={m.is_visible ? `Hide "${m.title}"` : `Show "${m.title}"`}
                    onClick={() => run(() => setMilestoneFlag(m.id, "is_visible", !m.is_visible))}
                  >
                    <EyeIcon off={!m.is_visible} />
                  </RowIconButton>
                  <Link
                    href={`/admin/milestones/${m.id}/edit`}
                    className="grid h-9 place-items-center rounded-control bg-blue-500 px-3 text-xs font-extrabold uppercase tracking-[0.06em] text-white hover:bg-blue-600"
                  >
                    Edit<span className="sr-only"> {m.title}</span>
                  </Link>
                  <RowIconButton tone="danger" disabled={pending} onClick={() => setToDelete(m)} aria-label={`Delete "${m.title}"`}>
                    <UiIcon name="trash" className="size-4" />
                  </RowIconButton>
                </div>
              </li>
            ))}
          </ul>
        </section>
      ))}
      <ConfirmDialog
        open={toDelete !== null}
        title={`Delete "${toDelete?.title ?? ""}"?`}
        message="This action cannot be undone."
        confirmLabel="Delete milestone"
        pending={pending}
        onCancel={() => setToDelete(null)}
        onConfirm={() => toDelete && run(() => deleteMilestone(toDelete.id), () => setToDelete(null))}
      />
    </div>
  );
}
