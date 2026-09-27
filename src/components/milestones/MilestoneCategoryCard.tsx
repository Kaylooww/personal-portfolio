import { UiIcon } from "@/components/ui/UiIcon";
import { cn } from "@/lib/utils/cn";
import type { MilestoneCategory } from "@/types";
import { MilestoneBadge } from "./MilestoneBadge";

interface MilestoneCategoryCardProps {
  category: MilestoneCategory;
  count: number;
  selected: boolean;
  onSelect: () => void;
}

/** Square badge card that doubles as the category filter toggle. */
export function MilestoneCategoryCard({ category, count, selected, onSelect }: MilestoneCategoryCardProps) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onSelect}
      className={cn(
        "surface-paper group flex h-full w-full flex-col items-start rounded-card p-4 text-left transition-trail transition-[transform,box-shadow] sm:p-5",
        "hover:-translate-y-0.5 hover:shadow-paper-lift motion-reduce:hover:translate-y-0",
        selected && "ring-3 ring-blue-500 ring-offset-2 ring-offset-cream",
      )}
    >
      <MilestoneBadge icon={category.badge_icon} accent={category.accent} className="mx-auto" />
      <span className="font-display-heavy mt-4 text-base uppercase leading-tight text-navy-900 [overflow-wrap:anywhere]">{category.name}</span>
      {category.description && <span className="mt-1 text-sm leading-snug text-navy-700">{category.description}</span>}
      <span className="mt-auto flex w-full items-end justify-between gap-2 pt-3">
        <span className="text-xs font-extrabold uppercase tracking-[0.08em] text-navy-500">
          {count} {count === 1 ? "milestone" : "milestones"}
        </span>
        <span
          aria-hidden
          className={cn(
            "grid size-8 place-items-center rounded-pill text-white transition-trail transition-colors",
            selected ? "bg-navy-900" : "bg-blue-500 group-hover:bg-blue-600",
          )}
        >
          <UiIcon name={selected ? "close" : "arrow-right"} className="size-4" />
        </span>
      </span>
    </button>
  );
}
