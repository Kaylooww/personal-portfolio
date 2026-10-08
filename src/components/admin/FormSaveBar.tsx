import type { ReactNode } from "react";
import { buttonClasses } from "@/components/ui/ButtonLink";

interface FormSaveBarProps {
  dirty: boolean;
  pending: boolean;
  error: string | null;
  submitLabel: string;
  /** Extra buttons shown before the submit button. */
  children?: ReactNode;
  /** Sticky footer for long page forms; inline for small inline forms. */
  sticky?: boolean;
}

export function FormSaveBar({ dirty, pending, error, submitLabel, children, sticky = true }: FormSaveBarProps) {
  return (
    <div
      className={
        sticky
          ? "sticky bottom-0 z-10 -mx-(--page-gutter) flex flex-wrap items-center gap-3 border-t border-surface-edge bg-canvas/95 px-(--page-gutter) py-4"
          : "flex flex-wrap items-center gap-3"
      }
    >
      {sticky && <span className="mr-auto text-sm font-bold text-warm">{dirty ? "Unsaved changes" : ""}</span>}
      {error && (
        <p role="alert" className="w-full text-sm font-bold text-danger sm:w-auto">
          {error}
        </p>
      )}
      {children}
      <button type="submit" disabled={pending} className={buttonClasses("primary", "md")}>
        {pending ? "Saving…" : submitLabel}
      </button>
    </div>
  );
}
