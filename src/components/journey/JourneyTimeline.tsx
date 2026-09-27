import { cn } from "@/lib/utils/cn";
import type { JourneyEntry } from "@/types";
import { JourneyCheckpoint } from "./JourneyCheckpoint";

/** Vertical trail for small screens: newest checkpoint at the top, like climbing upward. */
export function JourneyTimeline({ entries, className }: { entries: JourneyEntry[]; className?: string }) {
  const climbing = [...entries].reverse();

  return (
    <ol className={cn("relative ml-2 space-y-8 border-l-4 border-dotted border-sunset-500 pl-7", className)}>
      {climbing.map((entry) => (
        <li key={entry.id} className="relative">
          <span
            aria-hidden
            className="absolute -left-[2.35rem] top-5 size-4 rounded-pill border-[3px] border-paper bg-sunset-500 shadow-[0_0_10px_var(--color-sunset-500)]"
          />
          <JourneyCheckpoint entry={entry} />
        </li>
      ))}
    </ol>
  );
}
