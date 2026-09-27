import { LogoMark } from "@/components/ui/LogoMark";
import { UiIcon } from "@/components/ui/UiIcon";
import { WoodSign } from "@/components/ui/WoodSign";
import type { PortfolioSection } from "@/lib/constants/sections";

interface NextStopSignProps {
  next: PortfolioSection;
  /** Handwritten line above the place name. */
  note?: string;
  className?: string;
}

/** Sandwich-board sign pointing to the following checkpoint. */
export function NextStopSign({ next, note = "Next stop:", className }: NextStopSignProps) {
  return (
    <WoodSign href={next.href} standing className={className}>
      <span className="flex items-center gap-4">
        <span>
          <LogoMark className="mb-1 h-4 text-wood-700" />
          <span className="font-handwritten block text-lg leading-none">{note}</span>
          <span className="font-display-heavy block text-2xl uppercase leading-tight">{next.place}</span>
          <span className="sr-only"> — {next.label}</span>
        </span>
        <UiIcon name="arrow-right" className="size-6" />
      </span>
    </WoodSign>
  );
}
