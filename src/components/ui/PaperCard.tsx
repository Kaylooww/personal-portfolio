import type { ComponentPropsWithoutRef, ElementType } from "react";
import { cn } from "@/lib/utils/cn";

type PaperCardProps<T extends ElementType> = {
  as?: T;
  /** `pinned` adds the blue tape strip seen on the passport photo. */
  variant?: "plain" | "pinned";
  tilt?: "none" | "left" | "right";
  interactive?: boolean;
} & Omit<ComponentPropsWithoutRef<T>, "as">;

const TILT = { none: "", left: "-rotate-1", right: "rotate-1" } as const;

export function PaperCard<T extends ElementType = "div">({
  as,
  variant = "plain",
  tilt = "none",
  interactive = false,
  className,
  children,
  ...rest
}: PaperCardProps<T>) {
  const Component: ElementType = as ?? "div";
  return (
    <Component
      className={cn(
        "surface-paper relative rounded-card p-5 sm:p-6",
        TILT[tilt],
        interactive &&
          "transition-trail transition-[transform,box-shadow] hover:-translate-y-0.5 hover:shadow-paper-lift motion-reduce:hover:translate-y-0",
        className,
      )}
      {...rest}
    >
      {variant === "pinned" && (
        <span
          aria-hidden
          className="absolute -top-3 left-1/2 h-6 w-16 -translate-x-1/2 -rotate-2 rounded-tag bg-blue-500/85 shadow-[0_2px_0_var(--color-blue-700)]"
        />
      )}
      {children}
    </Component>
  );
}
