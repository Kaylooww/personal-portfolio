import { UiIcon } from "@/components/ui/UiIcon";
import { cn } from "@/lib/utils/cn";

/** Overhead "GATE 01" wayfinding sign — scenery, not navigation. */
export function GateSign({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn(
        "inline-flex items-center gap-3 rounded-control border-2 border-white/70 bg-blue-500 px-3 py-2 text-white shadow-button",
        className,
      )}
    >
      <span className="grid size-8 place-items-center rounded-tag bg-white text-blue-600">
        <UiIcon name="arrow-right" className="size-5" />
      </span>
      <span className="leading-none">
        <span className="block text-xs font-extrabold uppercase tracking-[0.14em]">Gate</span>
        <span className="font-display-heavy block text-2xl">01</span>
      </span>
    </div>
  );
}
