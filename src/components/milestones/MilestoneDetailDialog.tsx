"use client";

import { useEffect, useId, useRef } from "react";
import { SafeImage } from "@/components/ui/SafeImage";
import { UiIcon } from "@/components/ui/UiIcon";
import { formatMonthYear } from "@/lib/utils/format";
import type { Milestone, MilestoneCategory } from "@/types";
import { MilestoneBadge } from "./MilestoneBadge";
import { MilestoneLinks } from "./MilestoneLinks";

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

  const date = formatMonthYear(milestone?.date ?? null);
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
          {milestone.image_url && (
            <figure className="mt-5">
              <div className="overflow-hidden rounded-control bg-paper-shade">
                <SafeImage
                  key={milestone.image_url}
                  src={milestone.image_url}
                  alt={`Image for ${milestone.title}`}
                  width={1200}
                  height={900}
                  sizes="(min-width: 768px) 704px, calc(100vw - 74px)"
                  className="max-h-[60dvh] w-full object-contain"
                  fallback={<p className="p-6 text-center text-navy-700">This image could not be loaded.</p>}
                />
              </div>
              <figcaption className="mt-2 text-sm font-extrabold text-blue-600">
                <a href={milestone.image_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 hover:underline">
                  Open full-size image <UiIcon name="external" className="size-3.5" />
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
              </figcaption>
            </figure>
          )}
          {milestone.description && <p className="mt-5 whitespace-pre-line break-words leading-relaxed text-navy-700">{milestone.description}</p>}
          <MilestoneLinks milestone={milestone} />
        </>
      )}
    </dialog>
  );
}
