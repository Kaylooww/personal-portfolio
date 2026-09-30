"use client";

import { useEffect, useId, useRef } from "react";
import { UiIcon } from "@/components/ui/UiIcon";
import { formatContentDate } from "@/lib/utils/format";
import type { Milestone, MilestoneCategory } from "@/types";
import { MilestoneBadge } from "./MilestoneBadge";
import { MilestoneLinks } from "./MilestoneLinks";
import { MilestoneMedia } from "./MilestoneMedia";

interface MilestoneDetailDialogProps {
  milestone: Milestone | null;
  category: MilestoneCategory | null;
  onDismiss: () => void;
}

/** One native modal for the log, preserving the current category filter. */
export function MilestoneDetailDialog({ milestone, category, onDismiss }: MilestoneDetailDialogProps) {
  const ref = useRef<HTMLDialogElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const titleId = useId();

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (milestone && !dialog.open) {
      dialog.showModal();
      closeRef.current?.focus();
      dialog.scrollTop = 0;
    } else if (!milestone && dialog.open) {
      dialog.close();
    }
  }, [milestone]);

  const date = formatContentDate(milestone?.date, milestone?.date_display ?? "month");
  const source = [milestone?.issuer, milestone?.organization].filter(Boolean).join(" · ");

  return (
    <dialog
      ref={ref}
      aria-labelledby={titleId}
      onCancel={(event) => {
        event.preventDefault();
        onDismiss();
      }}
      onClick={(event) => {
        if (event.target !== event.currentTarget) return;
        const bounds = event.currentTarget.getBoundingClientRect();
        if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) onDismiss();
      }}
      className="m-auto max-h-[calc(100dvh-2rem)] w-[min(48rem,calc(100vw-2rem))] overflow-y-auto overscroll-contain rounded-panel border border-paper-edge bg-paper p-5 text-navy-900 shadow-paper-lift backdrop:bg-navy-950/45 sm:p-8"
    >
      {milestone && (
        <>
          <div className="flex items-start justify-between gap-4">
            <MilestoneBadge icon={milestone.badge_icon ?? category?.badge_icon ?? null} accent={category?.accent ?? null} size="sm" />
            <button ref={closeRef} type="button" onClick={onDismiss} aria-label="Close milestone" className="grid size-11 shrink-0 place-items-center rounded-pill hover:bg-navy-900/5">
              <UiIcon name="close" />
            </button>
          </div>
          {category && <p className="eyebrow mt-4 text-blue-600">{category.name}</p>}
          <h2 id={titleId} className="font-display-heavy mt-2 break-words text-heading leading-tight">{milestone.title}</h2>
          {(source || date) && (
            <p className="mt-2 text-sm font-bold text-navy-700">
              {source}{source && date && <span aria-hidden> · </span>}
              {date && <time dateTime={milestone.date ?? undefined}>{date}</time>}
            </p>
          )}
          {(milestone.pdf_url || milestone.image_url) && <div className="mt-5"><MilestoneMedia milestone={milestone} detail /></div>}
          {milestone.description && <p className="mt-5 whitespace-pre-line break-words leading-relaxed text-navy-700">{milestone.description}</p>}
          <MilestoneLinks milestone={milestone} />
        </>
      )}
    </dialog>
  );
}
