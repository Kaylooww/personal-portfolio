"use client";

import { useId, useState } from "react";
import { EmptyState } from "@/components/ui/EmptyState";
import type { Milestone, MilestoneCategory } from "@/types";
import { MilestoneCard } from "./MilestoneCard";
import { MilestoneCategoryCard } from "./MilestoneCategoryCard";

interface MilestoneExplorerProps {
  categories: MilestoneCategory[];
  milestones: Milestone[];
}

/** Category badge grid (acts as the filter) above the milestone log. */
export function MilestoneExplorer({ categories, milestones }: MilestoneExplorerProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const logId = useId();

  const byId = new Map(categories.map((c) => [c.id, c]));
  const selected = selectedId ? (byId.get(selectedId) ?? null) : null;
  const shown = selected ? milestones.filter((m) => m.category_id === selected.id) : milestones;

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
          <h2 id={logId} className="font-display-heavy text-heading uppercase text-navy-900">
            Milestone log
          </h2>
          <p aria-live="polite" className="flex items-center gap-3 text-sm font-bold text-navy-700">
            {selected ? `Showing ${selected.name}` : milestones.length === 1 ? "1 milestone" : `All ${milestones.length} milestones`}
            {selected && (
              <button type="button" onClick={() => setSelectedId(null)} className="rounded-pill bg-navy-900 px-3 py-1.5 text-xs font-extrabold uppercase tracking-[0.06em] text-paper">
                Show all
              </button>
            )}
          </p>
        </div>

        {shown.length > 0 ? (
          <ul className="mt-5 grid gap-4 md:grid-cols-2">
            {shown.map((m) => (
              <li key={m.id}>
                <MilestoneCard milestone={m} category={m.category_id ? (byId.get(m.category_id) ?? null) : null} />
              </li>
            ))}
          </ul>
        ) : (
          <EmptyState
            className="mt-5"
            icon="flag"
            title="No flags planted yet"
            message={selected ? `The first ${selected.name.toLowerCase()} milestone is still ahead.` : "The first milestone is still ahead."}
          />
        )}
      </section>
    </div>
  );
}
