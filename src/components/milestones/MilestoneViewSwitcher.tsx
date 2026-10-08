import { cn } from "@/lib/utils/cn";

export type MilestoneView = "gallery" | "board" | "list";
const views: { id: MilestoneView; label: string }[] = [{ id: "gallery", label: "Gallery" }, { id: "board", label: "Board" }, { id: "list", label: "List" }];

export function MilestoneViewSwitcher({ value, onChange }: { value: MilestoneView; onChange: (view: MilestoneView) => void }) {
  return (
    <div role="group" aria-label="Milestone view" className="surface-paper inline-flex flex-wrap gap-1 rounded-pill p-1.5">
      {views.map(({ id, label }) => (
        <button key={id} type="button" aria-pressed={value === id} onClick={() => onChange(id)} className={cn("flex min-h-11 items-center gap-2 rounded-pill px-3 text-sm font-extrabold transition-colors sm:px-4", value === id ? "bg-navy-900 text-paper" : "text-ink-muted hover:bg-surface-inset")}>
          <svg aria-hidden="true" viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            {id === "gallery" ? <><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></> : id === "board" ? <><rect x="3" y="4" width="18" height="16" rx="2" /><path d="M9 4v16M15 4v16" /></> : <><path d="M8 5h13M8 12h13M8 19h13M3 5h.01M3 12h.01M3 19h.01" /></>}
          </svg>
          {label}
        </button>
      ))}
    </div>
  );
}
