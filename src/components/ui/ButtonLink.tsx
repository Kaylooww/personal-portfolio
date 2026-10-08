import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

type Variant = "primary" | "secondary" | "ghost";
type Size = "md" | "lg";

const VARIANTS: Record<Variant, string> = {
  primary:
    "bg-blue-500 text-white shadow-button hover:bg-blue-600 active:translate-y-0.5 active:shadow-button-pressed",
  secondary:
    "surface-paper text-ink hover:border-wood-300 active:translate-y-0.5",
  ghost: "text-ink-strong hover:bg-ink/5",
};

const SIZES: Record<Size, string> = {
  md: "h-11 px-5 text-sm",
  lg: "h-14 px-7 text-base",
};

export function buttonClasses(variant: Variant = "primary", size: Size = "md", className?: string) {
  return cn(
    "group/btn inline-flex items-center justify-center gap-2.5 rounded-control font-body font-extrabold uppercase tracking-[0.08em]",
    "transition-trail transition-[background-color,transform,box-shadow,border-color] select-none",
    "motion-reduce:active:translate-y-0 disabled:pointer-events-none disabled:opacity-60",
    VARIANTS[variant],
    SIZES[size],
    className,
  );
}

type ButtonLinkProps = Omit<ComponentProps<typeof Link>, "className"> & {
  variant?: Variant;
  size?: Size;
  className?: string;
  icon?: ReactNode;
  trailingIcon?: ReactNode;
};

export function ButtonLink({
  variant = "primary",
  size = "md",
  className,
  icon,
  trailingIcon,
  children,
  ...rest
}: ButtonLinkProps) {
  return (
    <Link className={buttonClasses(variant, size, className)} {...rest}>
      {icon}
      <span>{children}</span>
      {trailingIcon && (
        <span className="transition-trail transition-transform group-hover/btn:translate-x-0.5 motion-reduce:group-hover/btn:translate-x-0">{trailingIcon}</span>
      )}
    </Link>
  );
}
