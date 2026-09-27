import { cn } from "@/lib/utils/cn";

interface LogoMarkProps {
  className?: string;
  /** Provide a label only when the mark stands alone as a link or image. */
  title?: string;
}

/** Twin-peak expedition mark seen on flags, crates and the nav. */
export function LogoMark({ className, title }: LogoMarkProps) {
  return (
    <svg
      viewBox="0 0 40 28"
      className={cn("h-6 w-auto", className)}
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
      focusable="false"
    >
      <path d="M1 27 15.5 3.5 30 27Z" fill="currentColor" />
      <path d="M17 27 28 10l11 17Z" fill="currentColor" opacity="0.72" />
      <path
        d="m10.5 18.5 5-7.5 3.2 4.8 2.6-3.1 3.4 5.3"
        fill="none"
        stroke="var(--color-paper)"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
