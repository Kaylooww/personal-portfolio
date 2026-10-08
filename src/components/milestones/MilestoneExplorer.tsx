"use client";

import { useId, useState } from "react";
import { EmptyState } from "@/components/ui/EmptyState";
import type { Milestone, MilestoneCategory } from "@/types";
import { MilestoneCard } from "./MilestoneCard";
import { MilestoneCategoryCard } from "./MilestoneCategoryCard";
import { MilestoneDetailDialog } from "./MilestoneDetailDialog";
import { MilestoneViewSwitcher, type MilestoneView } from "./MilestoneViewSwitcher";
import { cn } from "@/lib/utils/cn";

interface MilestoneExplorerProps {
  categories: MilestoneCategory[];
  milestones: Milestone[];
}

/** Category badge grid (acts as the filter) above the milestone log. */
export function MilestoneExplorer({ categories, milestones }: MilestoneExplorerProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [opened, setOpened] = useState<Milestone | null>(null);
  const [view, setView] = useState<MilestoneView>("gallery");
  const logId = useId();

  const byId = new Map(categories.map((c) => [c.id, c]));
  const selected = selectedId ? (byId.get(selectedId) ?? null) : null;
  const shown = selected ? milestones.filter((m) => m.category_id === selected.id) : milestones;
  const groups = [
    ...categories.map((category) => ({ id: category.id, name: category.name, category, items: shown.filter((m) => m.category_id === category.id) })),
    { id: "uncategorised", name: "Other milestones", category: null, items: shown.filter((m) => !m.category_id) },
  ].filter((group) => group.items.length > 0);

  return (
    <div>
      <ul aria-label="Milestone categories — choose one to filter the log" className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((c) => (
          <li key={c.id}>
            <MilestoneCategoryCard
              category={c}
              count={milestones.filter((m) => m.category_id === c.id).length}
              selected={selectedId === c.id}
              onSelect={() => setSelectedId((cur) => (cur === c.id ? null : c.id))}
            />
          </li>
        ))}
      </ul>

      <section aria-labelledby={logId} className="mt-12">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <h2 id={logId} className="font-display-heavy text-heading uppercase text-ink">
            Milestone log
          </h2>
          <p aria-live="polite" className="flex items-center gap-3 text-sm font-bold text-ink-muted">
            {selected ? `Showing ${selected.name}` : milestones.length === 1 ? "1 milestone" : `All ${milestones.length} milestones`}
            {selected && (
              <button type="button" onClick={() => setSelectedId(null)} className="rounded-pill bg-navy-900 px-3 py-1.5 text-xs font-extrabold uppercase tracking-[0.06em] text-paper">
                Show all
              </button>
            )}
          </p>
        </div>

        <div className="mt-5"><MilestoneViewSwitcher value={view} onChange={setView} /></div>
        {shown.length > 0 ? (
          <div role={view === "board" ? "region" : undefined} aria-label={view === "board" ? "Milestone board — scroll to see categories" : undefined} tabIndex={view === "board" ? 0 : undefined}
            className={cn("mt-6", view === "board" ? "flex items-start gap-4 overflow-x-auto rounded-card pb-5" : "space-y-8")}>
            {groups.map((group) => view === "board" ? (
              <section key={group.id} aria-label={group.name} className="w-[min(19rem,85vw)] shrink-0 rounded-panel border border-surface-edge bg-surface-inset/95 p-3">
                <h3 className="mb-3 flex items-center justify-between gap-2 px-1 font-display-heavy text-lg text-ink"><span>{group.name}</span><span className="text-sm text-ink-subtle">{group.items.length}</span></h3>
                <ul className="space-y-3">{group.items.map((m) => <li key={m.id}><MilestoneCard milestone={m} category={group.category} view={view} onOpen={() => setOpened(m)} /></li>)}</ul>
              </section>
            ) : (
              <details key={group.id} open className="group/category">
                <summary className="mb-4 cursor-pointer rounded-tag font-display-heavy text-lg text-ink"><span className="ml-2">{group.name}</span><span className="ml-3 text-sm text-ink-subtle">{group.items.length}</span></summary>
                <ul className={view === "gallery" ? "grid gap-4 md:grid-cols-2 xl:grid-cols-3" : "space-y-2"}>
                  {group.items.map((m) => <li key={m.id}><MilestoneCard milestone={m} category={group.category} view={view} onOpen={() => setOpened(m)} /></li>)}
                </ul>
              </details>
            ))}
          </div>
        ) : (
          <EmptyState
            className="mt-5"
            icon="flag"
            title="No flags planted yet"
            message={selected ? `The first ${selected.name.toLowerCase()} milestone is still ahead.` : "The first milestone is still ahead."}
          />
        )}
      </section>
      <MilestoneDetailDialog milestone={opened} category={opened?.category_id ? (byId.get(opened.category_id) ?? null) : null} onDismiss={() => setOpened(null)} />
    </div>
  );
}
