import type { ReactNode } from "react";
import { cn } from "@/lib/utils/cn";
import { ContentIcon, type ContentIconKey } from "./ContentIcon";

interface EmptyStateProps {
  title: string;
  message?: string;
  icon?: ContentIconKey;
  action?: ReactNode;
  className?: string;
}

/** Friendly "nothing here yet" note, written in the expedition voice. */
export function EmptyState({ title, message, icon = "compass", action, className }: EmptyStateProps) {
  return (
    <div className={cn("surface-paper flex flex-col items-center gap-3 rounded-card px-6 py-10 text-center", className)}>
      <span className="grid size-14 place-items-center rounded-pill bg-active text-link">
        <ContentIcon icon={icon} className="size-7" />
      </span>
      <p className="font-display-heavy text-xl uppercase text-ink">{title}</p>
      {message && <p className="font-handwritten max-w-sm text-lg text-ink-muted">{message}</p>}
      {action}
    </div>
  );
}
