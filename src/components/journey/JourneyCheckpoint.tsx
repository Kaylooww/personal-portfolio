import { ContentIcon } from "@/components/ui/ContentIcon";
import { cn } from "@/lib/utils/cn";
import { formatContentDate } from "@/lib/utils/format";
import type { JourneyEntry } from "@/types";

interface JourneyCheckpointProps {
  entry: JourneyEntry;
  className?: string;
}

/** Paper card for one stop on the route: date/period tab, icon, title, subtitle, note. */
export function JourneyCheckpoint({ entry, className }: JourneyCheckpointProps) {
  return (
    <article className={cn("surface-paper relative rounded-card p-4 pt-6", className)}>
      <span className="absolute -top-3 left-4 rounded-tag bg-blue-500 px-2.5 py-0.5 font-display-heavy text-sm text-white shadow-[0_2px_0_var(--color-blue-700)]">
        {entry.date ? <time dateTime={entry.date}>{formatContentDate(entry.date)}</time> : entry.period_label}
      </span>
      <div className="flex items-start gap-3">
        <ContentIcon icon={entry.icon} fallback="flag" className="mt-0.5 size-7 text-link" />
        <div className="min-w-0">
          <h3 className="font-display-heavy text-lg leading-tight text-ink">{entry.title}</h3>
          {entry.subtitle && <p className="text-sm font-bold text-ink-muted">{entry.subtitle}</p>}
        </div>
      </div>
      {entry.description && <p className="mt-2 text-sm leading-snug text-ink-muted">{entry.description}</p>}
    </article>
  );
}
