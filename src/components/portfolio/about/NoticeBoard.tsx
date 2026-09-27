import { cn } from "@/lib/utils/cn";
import type { AboutCard } from "@/types";
import { InfoBoardCard } from "./InfoBoardCard";

interface NoticeBoardProps {
  cards: AboutCard[];
  className?: string;
}

/** Wood-framed board holding the About notes in a two-column pin-up. */
export function NoticeBoard({ cards, className }: NoticeBoardProps) {
  if (cards.length === 0) return null;

  return (
    <section aria-label="About details" className={cn("surface-wood rounded-panel p-2.5 sm:p-3", className)}>
      <div className="rounded-card border-2 border-wood-900/40 bg-wood-500/40 p-4 pb-0 sm:p-5 sm:pb-1 [background-image:repeating-linear-gradient(0deg,transparent_0_46px,rgb(62_40_25/0.25)_46px_48px)]">
        <div className="columns-1 gap-4 sm:columns-2">
          {cards.map((card, i) => (
            <InfoBoardCard key={card.id} card={card} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
