"use client";

import { useState, type ReactNode } from "react";
import { buttonClasses } from "@/components/ui/ButtonLink";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { EmptyState } from "@/components/ui/EmptyState";
import type { ContentIconKey } from "@/components/ui/ContentIcon";
import { UiIcon } from "@/components/ui/UiIcon";
import type { ActionResult } from "@/lib/actions/result";
import { EyeIcon, RowIconButton } from "./RowIconButton";
import { useAdminAction } from "./useAdminAction";

export interface InlineListFormProps<T> {
  item?: T;
  onDone: () => void;
  onCancel?: () => void;
}

interface InlineListManagerProps<T extends { id: string; is_visible: boolean }> {
  items: T[];
  /** Accessible name for the list and item-level buttons, e.g. "About cards" / "card". */
  listLabel: string;
  itemNoun: string;
  addLabel: string;
  empty: { icon: ContentIconKey; title: string; message: string };
  label: (item: T) => string;
  summary: (item: T) => ReactNode;
  leading?: (item: T) => ReactNode;
  deleteMessage?: (item: T) => string;
  renderForm: (props: InlineListFormProps<T>) => ReactNode;
  onMove: (id: string, dir: "up" | "down") => Promise<ActionResult>;
  onVisibility: (id: string, visible: boolean) => Promise<ActionResult>;
  onDelete: (id: string) => Promise<ActionResult>;
}

/**
 * Ordered list with inline create/edit, reorder, show/hide and confirmed
 * delete — the shared shape of About cards, Journey entries, social links and
 * milestone categories.
 */
export function InlineListManager<T extends { id: string; is_visible: boolean }>(props: InlineListManagerProps<T>) {
  const { items, listLabel, itemNoun, addLabel, empty, label, summary, leading, deleteMessage, renderForm, onMove, onVisibility, onDelete } = props;
  const { pending, run } = useAdminAction();
  const [editing, setEditing] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);
  const [toDelete, setToDelete] = useState<T | null>(null);

  return (
    <div className="flex flex-col gap-5">
      {adding ? (
        <section className="surface-paper rounded-card p-5 sm:p-6" aria-label={`New ${itemNoun}`}>
          <h2 className="font-display-heavy mb-4 text-lg uppercase text-ink">New {itemNoun}</h2>
          {renderForm({ onDone: () => setAdding(false), onCancel: () => setAdding(false) })}
        </section>
      ) : (
        <button type="button" onClick={() => setAdding(true)} className={buttonClasses("primary", "md", "self-start")}>
          {addLabel}
        </button>
      )}

      {items.length === 0 ? (
        <EmptyState icon={empty.icon} title={empty.title} message={empty.message} />
      ) : (
        <ol className="flex flex-col gap-2" aria-label={listLabel} aria-busy={pending}>
          {items.map((item, i) => {
            const name = label(item);
            return (
              <li key={item.id} className="surface-paper rounded-card p-3">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                  <div className="flex min-w-0 flex-1 items-center gap-3">
                    {leading?.(item)}
                    <div className="min-w-0">
                      <p className="flex flex-wrap items-center gap-2">
                        <span className="font-display-heavy text-base text-ink">{name}</span>
                        {!item.is_visible && (
                          <span className="rounded-tag bg-ink/10 px-2 py-0.5 text-[0.6875rem] font-extrabold uppercase tracking-[0.08em] text-ink-muted">Hidden</span>
                        )}
                      </p>
                      <div className="text-sm text-ink-subtle">{summary(item)}</div>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-1">
                    <RowIconButton disabled={i === 0 || pending} onClick={() => run(() => onMove(item.id, "up"))} aria-label={`Move "${name}" up`}>
                      <UiIcon name="chevron-up" className="size-4" />
                    </RowIconButton>
                    <RowIconButton disabled={i === items.length - 1 || pending} onClick={() => run(() => onMove(item.id, "down"))} aria-label={`Move "${name}" down`}>
                      <UiIcon name="chevron-up" className="size-4 rotate-180" />
                    </RowIconButton>
                    <RowIconButton
                      disabled={pending}
                      aria-pressed={!item.is_visible}
                      aria-label={item.is_visible ? `Hide "${name}"` : `Show "${name}"`}
                      onClick={() => run(() => onVisibility(item.id, !item.is_visible))}
                    >
                      <EyeIcon off={!item.is_visible} />
                    </RowIconButton>
                    <button
                      type="button"
                      aria-expanded={editing === item.id}
                      onClick={() => setEditing(editing === item.id ? null : item.id)}
                      className="h-9 rounded-control bg-blue-500 px-3 text-xs font-extrabold uppercase tracking-[0.06em] text-white hover:bg-blue-600"
                    >
                      {editing === item.id ? "Close" : "Edit"}
                      <span className="sr-only"> {name}</span>
                    </button>
                    <RowIconButton tone="danger" disabled={pending} onClick={() => setToDelete(item)} aria-label={`Delete "${name}"`}>
                      <UiIcon name="trash" className="size-4" />
                    </RowIconButton>
                  </div>
                </div>
                {editing === item.id && (
                  <div className="mt-4 border-t border-dashed border-surface-edge pt-4">
                    {renderForm({ item, onDone: () => setEditing(null), onCancel: () => setEditing(null) })}
                  </div>
                )}
              </li>
            );
          })}
        </ol>
      )}

      <ConfirmDialog
        open={toDelete !== null}
        title={`Delete "${toDelete ? label(toDelete) : ""}"?`}
        message={toDelete && deleteMessage ? deleteMessage(toDelete) : "This action cannot be undone."}
        confirmLabel={`Delete ${itemNoun}`}
        pending={pending}
        onCancel={() => setToDelete(null)}
        onConfirm={() => toDelete && run(() => onDelete(toDelete.id), () => setToDelete(null))}
      />
    </div>
  );
}
