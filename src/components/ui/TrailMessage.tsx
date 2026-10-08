import type { ReactNode } from "react";
import { cn } from "@/lib/utils/cn";
import { LogoMark } from "./LogoMark";

interface TrailMessageProps {
  eyebrow: string;
  title: string;
  message: string;
  actions: ReactNode;
  /** Heading level: h1 when it's the whole page, h2 inside a page that already has one. */
  as?: "h1" | "h2";
  tone?: "blue" | "red";
  className?: string;
}

/** Centered paper-free message for 404 / error states, in the expedition voice. */
export function TrailMessage({ eyebrow, title, message, actions, as: Heading = "h1", tone = "blue", className }: TrailMessageProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center gap-5 px-6 py-16 text-center", className)}>
      <LogoMark className={cn("h-10", tone === "red" ? "text-flag-red" : "text-blue-500")} />
      <p className="eyebrow text-link">{eyebrow}</p>
      <Heading className="font-display-heavy text-title uppercase text-ink">{title}</Heading>
      <p className="font-handwritten max-w-md text-hand-lg text-ink-muted">{message}</p>
      <div className="flex flex-wrap justify-center gap-3">{actions}</div>
    </div>
  );
}
