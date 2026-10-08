import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

interface WoodSignProps {
  children: ReactNode;
  /** `light` = pale planed board with dark lettering; `dark` = stained plank with paper lettering. */
  tone?: "light" | "dark";
  /** Makes the whole sign a link. */
  href?: string;
  /** Adds the two legs of a sandwich board. */
  standing?: boolean;
  className?: string;
}

const TONE = {
  light: "border-2 border-wood-500 bg-surface-inset text-wood-ink",
  dark: "surface-wood",
} as const;

/** Hand-lettered wooden sign used for "Next stop" and wayfinding across checkpoints. */
export function WoodSign({ children, tone = "light", href, standing = false, className }: WoodSignProps) {
  const board = (
    <span
      className={cn(
        "relative block rounded-panel px-5 py-4 shadow-sign",
        TONE[tone],
        href && "transition-trail transition-transform group-hover:-translate-y-0.5 motion-reduce:group-hover:translate-y-0",
      )}
    >
      {children}
    </span>
  );

  const legs = standing && (
    <span aria-hidden className="flex justify-between px-6">
      <span className="h-5 w-2.5 rounded-b-tag bg-wood-700" />
      <span className="h-5 w-2.5 rounded-b-tag bg-wood-700" />
    </span>
  );

  if (href) {
    return (
      <Link href={href} className={cn("group inline-block -rotate-2 rounded-panel", className)}>
        {board}
        {legs}
      </Link>
    );
  }

  return (
    <div className={cn("inline-block -rotate-2", className)}>
      {board}
      {legs}
    </div>
  );
}
