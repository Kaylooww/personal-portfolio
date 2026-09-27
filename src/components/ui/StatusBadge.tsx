import { PROJECT_STATUS_LABEL } from "@/lib/constants/status";
import { cn } from "@/lib/utils/cn";
import type { ProjectStatus } from "@/types";
import { ContentIcon, type ContentIconKey } from "./ContentIcon";

const STYLE: Record<ProjectStatus, { className: string; icon: ContentIconKey }> = {
  completed: { className: "bg-status-completed-bg text-status-completed", icon: "check-circle" },
  in_progress: { className: "bg-status-progress-bg text-status-progress", icon: "clock" },
  planned: { className: "bg-status-planned-bg text-status-planned", icon: "flag" },
  idea: { className: "bg-status-idea-bg text-status-idea", icon: "lightbulb" },
  archived: { className: "bg-status-archived-bg text-status-archived", icon: "archive" },
};

/** Expedition progress pill. Colours are AA-checked (see DESIGN_SYSTEM.md). */
export function StatusBadge({ status, className }: { status: ProjectStatus; className?: string }) {
  const { className: tone, icon } = STYLE[status];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 whitespace-nowrap rounded-pill px-2.5 py-1 text-[0.6875rem] font-extrabold uppercase tracking-[0.08em]",
        tone,
        className,
      )}
    >
      <ContentIcon icon={icon} className="size-3.5" />
      {PROJECT_STATUS_LABEL[status]}
    </span>
  );
}
