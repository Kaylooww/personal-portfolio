"use client";

import { useState } from "react";
import { buttonClasses } from "@/components/ui/ButtonLink";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { ContentIcon } from "@/components/ui/ContentIcon";
import { EmptyState } from "@/components/ui/EmptyState";
import { UiIcon } from "@/components/ui/UiIcon";
import { deleteSkillCategory, moveSkillCategory, setSkillCategoryVisibility } from "@/lib/actions/skills";
import type { AdminSkillCategory } from "@/lib/queries/admin-skills";
import { EMPTY_SKILL_CATEGORY_FORM } from "@/lib/validation/skill";
import { EyeIcon, RowIconButton } from "../RowIconButton";
import { useAdminAction } from "../useAdminAction";
import { CategoryForm } from "./CategoryForm";

/** Create, edit inline, reorder, show/hide and delete skill categories. */
export function CategoryManager({ categories }: { categories: AdminSkillCategory[] }) {
  const { pending, run } = useAdminAction();
  const [editing, setEditing] = useState<string | null>(null);
  const [adding, setAdding] = useState(categories.length === 0);
  const [toDelete, setToDelete] = useState<AdminSkillCategory | null>(null);

  return (
    <div className="flex flex-col gap-6">
      {adding ? (
        <section className="surface-paper rounded-card p-5 sm:p-6" aria-label="New category">
          <h2 className="font-display-heavy mb-4 text-lg uppercase text-navy-900">New category</h2>
          <CategoryForm defaults={EMPTY_SKILL_CATEGORY_FORM} onDone={() => setAdding(false)} onCancel={categories.length ? () => setAdding(false) : undefined} />
        </section>
      ) : (
        <button type="button" onClick={() => setAdding(true)} className={buttonClasses("primary", "md", "self-start")}>
          + Add category
        </button>
      )}

      {categories.length === 0 ? (
        <EmptyState icon="tools" title="No categories yet" message="Categories become the panels on the public gear board." />
      ) : (
        <ol className="flex flex-col gap-2" aria-label="Skill categories" aria-busy={pending}>
          {categories.map((c, i) => (
            <li key={c.id} className="surface-paper rounded-card p-3">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <div className="flex min-w-0 flex-1 items-center gap-3">
                  <span className="grid size-10 shrink-0 place-items-center rounded-control bg-blue-100 text-blue-600">
                    <ContentIcon icon={c.icon} fallback="gear" className="size-5" />
                  </span>
                  <div className="min-w-0">
                    <p className="flex flex-wrap items-center gap-2">
                      <span className="font-display-heavy text-base text-navy-900">{c.name}</span>
                      {!c.is_visible && (
                        <span className="rounded-tag bg-navy-900/10 px-2 py-0.5 text-[0.6875rem] font-extrabold uppercase tracking-[0.08em] text-navy-700">Hidden</span>
                      )}
                    </p>
                    <p className="text-sm text-navy-500">
                      {c.slug} · {c.skillCount} {c.skillCount === 1 ? "skill" : "skills"}
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-1">
                  <RowIconButton disabled={i === 0 || pending} onClick={() => run(() => moveSkillCategory(c.id, "up"))} aria-label={`Move "${c.name}" up`}>
                    <UiIcon name="chevron-up" className="size-4" />
                  </RowIconButton>
                  <RowIconButton disabled={i === categories.length - 1 || pending} onClick={() => run(() => moveSkillCategory(c.id, "down"))} aria-label={`Move "${c.name}" down`}>
                    <UiIcon name="chevron-up" className="size-4 rotate-180" />
                  </RowIconButton>
                  <RowIconButton
                    disabled={pending}
                    aria-pressed={!c.is_visible}
                    aria-label={c.is_visible ? `Hide "${c.name}"` : `Show "${c.name}"`}
                    onClick={() => run(() => setSkillCategoryVisibility(c.id, !c.is_visible))}
                  >
                    <EyeIcon off={!c.is_visible} />
                  </RowIconButton>
                  <button
                    type="button"
                    aria-expanded={editing === c.id}
                    onClick={() => setEditing(editing === c.id ? null : c.id)}
                    className="h-9 rounded-control bg-blue-500 px-3 text-xs font-extrabold uppercase tracking-[0.06em] text-white hover:bg-blue-600"
                  >
                    {editing === c.id ? "Close" : "Edit"}
                    <span className="sr-only"> {c.name}</span>
                  </button>
                  <RowIconButton tone="danger" disabled={pending} onClick={() => setToDelete(c)} aria-label={`Delete "${c.name}"`}>
                    <UiIcon name="trash" className="size-4" />
                  </RowIconButton>
                </div>
              </div>
              {editing === c.id && (
                <div className="mt-4 border-t border-dashed border-paper-edge pt-4">
                  <CategoryForm
                    categoryId={c.id}
                    defaults={{ name: c.name, slug: c.slug, icon: c.icon ?? "", is_visible: c.is_visible }}
                    onDone={() => setEditing(null)}
                    onCancel={() => setEditing(null)}
                  />
                </div>
              )}
            </li>
          ))}
        </ol>
      )}

      <ConfirmDialog
        open={toDelete !== null}
        title={`Delete "${toDelete?.name ?? ""}"?`}
        message={
          toDelete && toDelete.skillCount > 0
            ? `This action cannot be undone. Its ${toDelete.skillCount} ${toDelete.skillCount === 1 ? "skill stays" : "skills stay"} but become uncategorised (hidden from the gear board until reassigned).`
            : "This action cannot be undone."
        }
        confirmLabel="Delete category"
        pending={pending}
        onCancel={() => setToDelete(null)}
        onConfirm={() => toDelete && run(() => deleteSkillCategory(toDelete.id), () => setToDelete(null))}
      />
    </div>
  );
}
