import { cn } from "@/lib/utils/cn";

interface SignPostProps {
  /** Plank labels from top to bottom. */
  labels: readonly string[];
  className?: string;
}

/** Wooden post with arrow planks — scenery that sets the mood, not navigation. */
export function SignPost({ labels, className }: SignPostProps) {
  return (
    <div aria-hidden className={cn("relative inline-flex flex-col items-center", className)}>
      <span className="absolute inset-y-0 left-1/2 w-3 -translate-x-1/2 rounded-t-tag bg-wood-700" />
      <div className="relative flex flex-col gap-2.5 py-3">
        {labels.map((label, i) => (
          <span
            key={label}
            className={cn(
              "surface-wood font-display-heavy relative block whitespace-nowrap py-1.5 pl-4 pr-7 text-sm uppercase tracking-wide [clip-path:polygon(0_0,calc(100%-0.9rem)_0,100%_50%,calc(100%-0.9rem)_100%,0_100%)]",
              i % 2 === 0 ? "-rotate-3" : "rotate-2",
            )}
          >
            {label}
          </span>
        ))}
      </div>
    </div>
  );
}
