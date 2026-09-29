import { SafeImage } from "@/components/ui/SafeImage";
import { formatMonthYear } from "@/lib/utils/format";
import type { Milestone, MilestoneCategory } from "@/types";
import { MilestoneBadge } from "./MilestoneBadge";
import { MilestoneLinks } from "./MilestoneLinks";

interface MilestoneCardProps {
  milestone: Milestone;
  category: MilestoneCategory | null;
  onOpen: () => void;
}

/** One achievement in the log: badge, title, who/when, note and proof links. */
export function MilestoneCard({ milestone, category, onOpen }: MilestoneCardProps) {
  const date = formatMonthYear(milestone.date);
  const source = [milestone.issuer, milestone.organization].filter(Boolean).join(" · ");

  return (
    <article className="surface-paper relative flex h-full gap-4 rounded-card p-4 transition-shadow hover:shadow-paper-lift focus-within:ring-2 focus-within:ring-blue-600 sm:p-5">
      <MilestoneBadge icon={milestone.badge_icon ?? category?.badge_icon ?? null} accent={category?.accent ?? null} size="sm" />
      <div className="min-w-0 flex-1">
        {category && <p className="eyebrow text-[0.6875rem] text-blue-600">{category.name}</p>}
        <h3 className="font-display-heavy mt-0.5 text-lg leading-tight text-navy-900">
          <button type="button" onClick={onOpen} aria-haspopup="dialog" className="text-left after:absolute after:inset-0 after:rounded-card">
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
        {milestone.image_url && (
          <div className="mt-3 overflow-hidden rounded-control bg-paper-shade">
            <SafeImage
              src={milestone.image_url}
              alt={`Image for ${milestone.title}`}
              width={800}
              height={500}
              sizes="(min-width: 1024px) 35vw, (min-width: 768px) 40vw, 75vw"
              className="aspect-[8/5] w-full object-contain"
              fallback={<p className="p-4 text-sm text-navy-700">Image unavailable</p>}
            />
          </div>
        )}
        {milestone.description && <p className="mt-2 line-clamp-3 whitespace-pre-line text-sm leading-relaxed text-navy-700">{milestone.description}</p>}
        <p aria-hidden="true" className="mt-3 text-sm font-extrabold text-blue-600">View milestone →</p>
        <MilestoneLinks milestone={milestone} />
      </div>
    </article>
  );
}
