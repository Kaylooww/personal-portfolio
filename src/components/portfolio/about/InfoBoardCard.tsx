import { ContentIcon, type ContentIconKey } from "@/components/ui/ContentIcon";
import { Spark } from "@/components/ui/Spark";
import { cn } from "@/lib/utils/cn";
import type { AboutCard, AboutCardKind } from "@/types";

const KIND_ICON: Record<AboutCardKind, ContentIconKey> = {
  education: "graduation",
  interests: "gamepad",
  focus: "code",
  location: "pin",
  goals: "target",
};

const TILTS = ["-rotate-1", "rotate-1", "rotate-[0.6deg]", "-rotate-[0.8deg]", "rotate-[0.4deg]"] as const;

interface InfoBoardCardProps {
  card: AboutCard;
  index: number;
}

/** A paper note pinned to the notice board. Goals render as a checklist. */
export function InfoBoardCard({ card, index }: InfoBoardCardProps) {
  const isChecklist = card.kind === "goals";

  return (
    <article
      className={cn(
        "surface-paper relative mb-4 break-inside-avoid rounded-card p-5 pt-6",
        TILTS[index % TILTS.length],
      )}
    >
      <span aria-hidden className="absolute left-1/2 top-2 size-2.5 -translate-x-1/2 rounded-pill bg-navy-700 shadow-[0_1px_0_var(--color-paper)]" />
      <h3 className="flex items-center gap-2.5 font-display-heavy text-lg uppercase text-ink">
        <ContentIcon icon={KIND_ICON[card.kind]} className="size-6 text-ink-strong" />
        {card.title}
        <Spark className="size-3.5 -translate-y-1.5 text-blue-500" />
      </h3>
      <ul className="mt-3 space-y-2">
        {card.items.map((item) => (
          <li key={item.label} className="flex items-start gap-2.5 text-[0.9375rem] leading-snug text-ink-muted">
            {isChecklist ? (
              <span aria-hidden className="mt-0.5 grid size-4.5 shrink-0 place-items-center rounded-[4px] border-2 border-navy-700">
                <svg viewBox="0 0 12 12" className="size-3 text-link">
                  <path d="m2 6.5 2.5 2.5L10 3" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            ) : (
              <ContentIcon icon={item.icon} fallback="compass" className="mt-px size-4.5 text-ink-strong" />
            )}
            {item.label}
          </li>
        ))}
      </ul>
    </article>
  );
}
