import { ContentIcon } from "@/components/ui/ContentIcon";
import { cn } from "@/lib/utils/cn";
import type { MilestoneCategory } from "@/types";

type Accent = NonNullable<MilestoneCategory["accent"]>;

const ENAMEL: Record<Accent, string> = {
  navy: "bg-navy-800",
  red: "bg-flag-red",
  gold: "bg-gold-500",
  blue: "bg-blue-600",
  green: "bg-moss-700",
  purple: "bg-plum-600",
};

const HEX = "[clip-path:polygon(25%_3%,75%_3%,100%_50%,75%_97%,25%_97%,0_50%)]";

interface MilestoneBadgeProps {
  icon: string | null;
  accent: MilestoneCategory["accent"];
  size?: "sm" | "lg";
  className?: string;
}

/** Enamel hexagon badge with a gold rim — decorative; the title always accompanies it. */
export function MilestoneBadge({ icon, accent, size = "lg", className }: MilestoneBadgeProps) {
  const big = size === "lg";
  return (
    <span aria-hidden className={cn("relative grid shrink-0 place-items-center", big ? "size-24" : "size-14", className)}>
      <span className={cn("absolute inset-0 bg-gold-700", HEX)} />
      <span className={cn("absolute bg-gold-500", HEX, big ? "inset-1" : "inset-0.5")} />
      <span className={cn("absolute grid place-items-center text-paper", HEX, ENAMEL[accent ?? "navy"], big ? "inset-2.5" : "inset-1.5")}>
        <ContentIcon icon={icon} fallback="star" className={big ? "size-9" : "size-6"} />
      </span>
    </span>
  );
}
