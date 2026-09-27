import type { ReactNode } from "react";
import { cn } from "@/lib/utils/cn";
import { LogoMark } from "./LogoMark";
import { Spark } from "./Spark";

interface SectionTitleProps {
  eyebrow?: string;
  eyebrowIcon?: ReactNode;
  title: ReactNode;
  /** Plain line between the title and the note (e.g. roles). */
  subtitle?: ReactNode;
  /** Handwritten journal line under the title. Use `\n` for line breaks. */
  note?: string;
  as?: "h1" | "h2";
  size?: "hero" | "title";
  /** Overrides the title's type size when a layout needs a tighter fit. */
  titleClassName?: string;
  className?: string;
}

/**
 * The shared heading lockup from every reference:
 * blue eyebrow → heavy navy title with blue "spark" → handwritten note with a swoosh.
 */
export function SectionTitle({
  eyebrow,
  eyebrowIcon,
  title,
  subtitle,
  note,
  as: Heading = "h1",
  size = "title",
  titleClassName,
  className,
}: SectionTitleProps) {
  return (
    <div className={cn("max-w-[40rem]", className)}>
      {eyebrow && (
        <p className="eyebrow mb-2 flex items-center gap-2 text-blue-600">
          {eyebrowIcon ?? <LogoMark className="h-4 text-blue-500" />}
          {eyebrow}
        </p>
      )}
      <Heading
        className={cn(
          "font-display-heavy uppercase text-navy-900",
          size === "hero" ? "text-hero" : "text-title",
          titleClassName,
        )}
      >
        {title}
        <Spark className="ml-[0.08em] inline-block h-[0.45em] w-[0.45em] -translate-y-[0.32em] text-blue-500" />
      </Heading>
      {subtitle && <div className="mt-4">{subtitle}</div>}
      {note && (
        <p className="font-handwritten relative mt-4 inline-block whitespace-pre-line text-hand-lg text-navy-800 -rotate-1">
          {note}
          <Swoosh className="absolute -bottom-2 left-0 h-3 w-3/5 text-blue-500" />
        </p>
      )}
    </div>
  );
}

function Swoosh({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 12" preserveAspectRatio="none" className={className} aria-hidden focusable="false">
      <path d="M2 9C60 2 130 1 198 5" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" fill="none" />
    </svg>
  );
}
