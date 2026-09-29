"use client";

import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/utils/cn";

/** Square icon button used in admin list rows (move, feature, show/hide, delete). */
export function RowIconButton({ className, tone = "default", ...props }: ComponentPropsWithoutRef<"button"> & { tone?: "default" | "danger" }) {
  return (
    <button
      type="button"
      className={cn(
        "grid size-9 place-items-center rounded-control text-navy-700 transition-trail transition-colors disabled:pointer-events-none disabled:opacity-35",
        tone === "danger" ? "hover:bg-danger-100 hover:text-danger-600" : "hover:bg-blue-50 hover:text-blue-600",
        className,
      )}
      {...props}
    />
  );
}

/** Eye icon; struck through when the item is hidden. */
export function EyeIcon({ off }: { off: boolean }) {
  return (
    <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" />
      <circle cx="12" cy="12" r="3" />
      {off && <path d="m3 3 18 18" />}
    </svg>
  );
}
