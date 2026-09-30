import { formatContentDate } from "@/lib/utils/format";
import { cn } from "@/lib/utils/cn";
import type { Milestone, MilestoneCategory } from "@/types";
import { MilestoneBadge } from "./MilestoneBadge";
import { MilestoneLinks } from "./MilestoneLinks";
import { MilestoneMedia } from "./MilestoneMedia";

interface MilestoneCardProps {
  milestone: Milestone;
  category: MilestoneCategory | null;
  onOpen: () => void;
  view?: "gallery" | "board" | "list";
}

/** One achievement in the log: badge, title, who/when, note and proof links. */
export function MilestoneCard({ milestone, category, onOpen, view = "gallery" }: MilestoneCardProps) {
  const date = formatContentDate(milestone.date, milestone.date_display ?? "month");
  const source = [milestone.issuer, milestone.organization].filter(Boolean).join(" · ");

  return (
    <article className={cn("surface-paper relative flex h-full gap-3 rounded-card p-4 transition-shadow hover:shadow-paper-lift focus-within:ring-2 focus-within:ring-blue-600", view === "gallery" && "flex-col", view === "list" && "items-start sm:items-center")}>
      {view === "gallery" && (milestone.pdf_url || milestone.image_url) && <MilestoneMedia milestone={milestone} />}
      {view !== "gallery" && <MilestoneBadge icon={milestone.badge_icon ?? category?.badge_icon ?? null} accent={category?.accent ?? null} size="sm" className="size-9 shrink-0" />}
      <div className="min-w-0 flex-1">
        {view === "gallery" && <div className="mb-2 flex items-center gap-2"><MilestoneBadge icon={milestone.badge_icon ?? category?.badge_icon ?? null} accent={category?.accent ?? null} size="sm" className="size-8" />{milestone.featured && <span className="text-xs font-extrabold text-gold-700">Featured</span>}{milestone.pdf_url && <span className="text-xs font-extrabold text-blue-600">PDF</span>}</div>}
        <h3 className="font-display-heavy mt-0.5 text-lg leading-tight text-navy-900">
          <button type="button" onClick={onOpen} aria-haspopup="dialog" className="break-words text-left after:absolute after:inset-0 after:rounded-card">
            {milestone.title}
            <span className="sr-only"> — view milestone</span>
          </button>
        </h3>
        {(source || date) && (
          <p className="mt-1 text-sm font-bold text-navy-700">
            {source}
            {source && date && <span aria-hidden> · </span>}
            {date && <time dateTime={milestone.date ?? undefined}>{date}</time>}
          </p>
        )}
        {view === "gallery" && milestone.description && <p className="mt-2 line-clamp-2 whitespace-pre-line text-sm leading-relaxed text-navy-700">{milestone.description}</p>}
        {view !== "list" && <p aria-hidden="true" className="mt-3 text-sm font-extrabold text-blue-600">View milestone →</p>}
        {view === "gallery" && <MilestoneLinks milestone={milestone} />}
      </div>
      {view === "list" && <span aria-hidden="true" className="shrink-0 text-xs font-extrabold text-blue-600">{milestone.pdf_url ? "PDF ↗" : "View →"}</span>}
    </article>
  );
}
