"use client";

import { useEffect, useId, useRef } from "react";
import { buttonClasses } from "./ButtonLink";

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: string;
  confirmLabel: string;
  pending?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

/**
 * Destructive-action confirmation on a native <dialog> (focus trap, Esc, inert
 * background). Focus starts on Cancel so Enter never deletes by accident.
 */
export function ConfirmDialog({ open, title, message, confirmLabel, pending = false, onConfirm, onCancel }: ConfirmDialogProps) {
  const ref = useRef<HTMLDialogElement>(null);
  const cancelRef = useRef<HTMLButtonElement>(null);
  const titleId = useId();
  const descId = useId();

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      dialog.showModal();
      cancelRef.current?.focus();
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  return (
    <dialog
      ref={ref}
      aria-labelledby={titleId}
      aria-describedby={descId}
      onCancel={(e) => {
        e.preventDefault();
        if (!pending) onCancel();
      }}
      className="m-auto w-[min(28rem,calc(100vw-2rem))] rounded-panel border border-surface-edge bg-surface p-6 text-ink shadow-paper-lift backdrop:bg-navy-950/45"
    >
      <h2 id={titleId} className="font-display-heavy text-xl text-ink">
        {title}
      </h2>
      <p id={descId} className="mt-2 text-ink-muted">
        {message}
      </p>
      <div className="mt-6 flex flex-wrap justify-end gap-2">
        <button ref={cancelRef} type="button" onClick={onCancel} disabled={pending} className={buttonClasses("secondary", "md")}>
          Cancel
        </button>
        <button
          type="button"
          onClick={onConfirm}
          disabled={pending}
          className={buttonClasses("primary", "md", "bg-danger-600 shadow-[0_3px_0_#7a1a12] hover:bg-danger-600/90 disabled:opacity-70")}
        >
          {pending ? "Working…" : confirmLabel}
        </button>
      </div>
    </dialog>
  );
}
