import { cn } from "@/lib/utils/cn";
import type { ContentState } from "@/types";

const STYLE: Record<ContentState, { label: string; className: string }> = {
  published: { label: "Published", className: "bg-moss-100 text-moss-700" },
  draft: { label: "Draft", className: "bg-sunset-100 text-sunset-700" },
  archived: { label: "Archived", className: "bg-stone-100 text-stone-700" },
};

/** Editorial state (is it public?) — distinct from the expedition StatusBadge. */
export function ContentStatePill({ state, className }: { state: ContentState; className?: string }) {
  const s = STYLE[state];
  return (
    <span className={cn("inline-flex rounded-tag px-2 py-0.5 text-[0.6875rem] font-extrabold uppercase tracking-[0.08em]", s.className, className)}>
      {s.label}
    </span>
  );
}
