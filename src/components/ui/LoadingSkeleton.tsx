import { cn } from "@/lib/utils/cn";

/** A single shimmering placeholder block (motion is disabled for reduced-motion users by the global guard). */
export function SkeletonBlock({ className }: { className?: string }) {
  return <span aria-hidden className={cn("block animate-pulse rounded-control bg-paper-shade", className)} />;
}

interface LoadingSkeletonProps {
  label: string;
  /** How many list rows to sketch. */
  rows?: number;
}

/** Page-shaped placeholder: title, action, then paper rows. Announces itself to screen readers once. */
export function LoadingSkeleton({ label, rows = 4 }: LoadingSkeletonProps) {
  return (
    <div role="status" aria-live="polite" className="flex flex-col gap-6">
      <span className="sr-only">{label}</span>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="flex flex-col gap-2">
          <SkeletonBlock className="h-8 w-48" />
          <SkeletonBlock className="h-4 w-72 max-w-full" />
        </div>
        <SkeletonBlock className="h-11 w-36" />
      </div>
      <SkeletonBlock className="h-16 w-full rounded-card" />
      <div className="flex flex-col gap-3">
        {Array.from({ length: rows }, (_, i) => (
          <div key={i} className="surface-paper flex items-center gap-4 rounded-card p-4">
            <SkeletonBlock className="size-12 shrink-0" />
            <div className="flex flex-1 flex-col gap-2">
              <SkeletonBlock className="h-4 w-1/3" />
              <SkeletonBlock className="h-3 w-2/3" />
            </div>
            <SkeletonBlock className="hidden h-9 w-40 sm:block" />
          </div>
        ))}
      </div>
    </div>
  );
}
