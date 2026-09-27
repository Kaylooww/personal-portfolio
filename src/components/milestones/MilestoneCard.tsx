import { UiIcon } from "@/components/ui/UiIcon";
import { formatMonthYear } from "@/lib/utils/format";
import type { Milestone, MilestoneCategory } from "@/types";
import { MilestoneBadge } from "./MilestoneBadge";

interface MilestoneCardProps {
  milestone: Milestone;
  category: MilestoneCategory | null;
}

/** One achievement in the log: badge, title, who/when, note and proof links. */
export function MilestoneCard({ milestone, category }: MilestoneCardProps) {
  const date = formatMonthYear(milestone.date);
  const source = [milestone.issuer, milestone.organization].filter(Boolean).join(" · ");

  return (
    <article className="surface-paper flex h-full gap-4 rounded-card p-4 sm:p-5">
      <MilestoneBadge icon={milestone.badge_icon ?? category?.badge_icon ?? null} accent={category?.accent ?? null} size="sm" />
      <div className="min-w-0 flex-1">
        {category && <p className="eyebrow text-[0.6875rem] text-blue-600">{category.name}</p>}
        <h3 className="font-display-heavy mt-0.5 text-lg leading-tight text-navy-900">{milestone.title}</h3>
        {(source || date) && (
          <p className="mt-1 text-sm font-bold text-navy-700">
            {source}
            {source && date && <span aria-hidden> · </span>}
            {date && <time dateTime={milestone.date ?? undefined}>{date}</time>}
          </p>
        )}
        {milestone.description && <p className="mt-2 text-sm leading-relaxed text-navy-700">{milestone.description}</p>}
        {(milestone.certificate_url || milestone.external_url) && (
          <div className="mt-3 flex flex-wrap gap-3 text-sm font-extrabold text-blue-600">
            {milestone.certificate_url && (
              <a href={milestone.certificate_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 hover:underline">
                Certificate <UiIcon name="external" className="size-3.5" />
                <span className="sr-only"> for {milestone.title} (opens in a new tab)</span>
              </a>
            )}
            {milestone.external_url && (
              <a href={milestone.external_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 hover:underline">
                Details <UiIcon name="external" className="size-3.5" />
                <span className="sr-only"> about {milestone.title} (opens in a new tab)</span>
              </a>
            )}
          </div>
        )}
      </div>
    </article>
  );
}
