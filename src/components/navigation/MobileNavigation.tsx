"use client";

import Link from "next/link";
import { useRef } from "react";
import { LogoMark } from "@/components/ui/LogoMark";
import { UiIcon } from "@/components/ui/UiIcon";
import { useActiveSection } from "@/hooks/useActiveSection";
import { PORTFOLIO_SECTIONS } from "@/lib/constants/sections";
import { cn } from "@/lib/utils/cn";
import { CheckpointIcon } from "./CheckpointIcon";

/**
 * Below lg: a compact paper bar (logo, current checkpoint, 7-dot progress, menu)
 * that opens the expedition map as a modal sheet. Native <dialog> gives us
 * focus trapping, Esc-to-close and inert background for free.
 */
export function MobileNavigation() {
  const { section: active, index: activeIndex } = useActiveSection();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const total = PORTFOLIO_SECTIONS.length;

  const open = () => dialogRef.current?.showModal();
  const close = () => dialogRef.current?.close();

  return (
    <div className="lg:hidden">
      <header className="surface-paper fixed inset-x-3 top-[max(0.75rem,env(safe-area-inset-top))] z-(--z-nav) flex h-14 items-center gap-3 rounded-pill pl-2 pr-1.5 shadow-nav">
        <Link href="/" className="grid size-11 shrink-0 place-items-center rounded-pill text-blue-500">
          <LogoMark className="h-5" title="Kyle Castro — home" />
        </Link>

        <div className="min-w-0 flex-1">
          {active && (
            <p className="truncate text-[0.8125rem] font-extrabold uppercase tracking-[0.06em] text-navy-900">
              <span className="text-blue-600">{String(activeIndex + 1).padStart(2, "0")}</span>
              <span aria-hidden className="mx-1.5 text-navy-300">/</span>
              {active.label}
            </p>
          )}
          <ProgressDots activeIndex={activeIndex} total={total} />
        </div>

        <button
          type="button"
          onClick={open}
          aria-haspopup="dialog"
          className="flex h-11 shrink-0 items-center gap-2 rounded-pill bg-navy-900 px-4 text-[0.8125rem] font-extrabold uppercase tracking-[0.06em] text-paper transition-trail transition-colors hover:bg-blue-600"
        >
          <UiIcon name="menu" className="size-4" />
          Map
        </button>
      </header>

      <dialog
        ref={dialogRef}
        aria-labelledby="mobile-map-title"
        onClick={(e) => {
          // A click on the ::backdrop targets the dialog element itself.
          if (e.target === e.currentTarget) close();
        }}
        className={cn(
          "m-0 ml-auto h-dvh max-h-none w-[min(24rem,100%)] max-w-none bg-cream p-0 text-navy-900",
          "backdrop:bg-navy-950/45",
        )}
      >
        <div className="flex min-h-full flex-col px-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-[max(1.25rem,env(safe-area-inset-top))]">
          <div className="flex items-center justify-between">
            <p id="mobile-map-title" className="eyebrow flex items-center gap-2 text-blue-600">
              <LogoMark className="h-4 text-blue-500" />
              Expedition map
            </p>
            <button
              type="button"
              onClick={close}
              aria-label="Close map"
              className="grid size-11 place-items-center rounded-pill text-navy-900 transition-trail transition-colors hover:bg-navy-900/5"
            >
              <UiIcon name="close" />
            </button>
          </div>

          <nav aria-label="Checkpoints" className="mt-6 flex-1">
            <ol>
              {PORTFOLIO_SECTIONS.map((s, i) => {
                const isActive = active?.id === s.id;
                const isClimbed = i < activeIndex;
                const isLast = i === total - 1;
                return (
                  <li key={s.id} className="relative">
                    {!isLast && (
                      <span
                        aria-hidden
                        className={cn(
                          "absolute left-[1.3125rem] top-12 h-[calc(100%-2.25rem)] border-l-2",
                          isClimbed ? "border-solid border-blue-500" : "border-dashed border-navy-300",
                        )}
                      />
                    )}
                    <Link
                      href={s.href}
                      onClick={close}
                      aria-current={isActive ? "page" : undefined}
                      className={cn(
                        "flex items-center gap-4 rounded-card py-2 pr-3 transition-trail transition-colors",
                        isActive ? "bg-blue-100" : "hover:bg-blue-50",
                      )}
                    >
                      <span
                        className={cn(
                          "grid size-11 shrink-0 place-items-center rounded-pill text-white",
                          isActive ? "bg-blue-500 shadow-glow-blue" : isClimbed ? "bg-blue-500" : "bg-navy-700",
                        )}
                      >
                        <CheckpointIcon icon={s.icon} />
                      </span>
                      <span className="min-w-0">
                        <span
                          className={cn(
                            "block font-display-heavy text-xl uppercase leading-tight",
                            isActive ? "text-blue-700" : "text-navy-900",
                          )}
                        >
                          {s.label}
                        </span>
                        <span className="font-handwritten block truncate text-navy-700">{s.meaning}</span>
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ol>
          </nav>
        </div>
      </dialog>
    </div>
  );
}

function ProgressDots({ activeIndex, total }: { activeIndex: number; total: number }) {
  return (
    <div
      role="img"
      aria-label={activeIndex >= 0 ? `Checkpoint ${activeIndex + 1} of ${total}` : `${total} checkpoints`}
      className="mt-1 flex items-center gap-1"
    >
      {Array.from({ length: total }, (_, i) => (
        <span
          key={i}
          className={cn(
            "h-1.5 rounded-pill transition-trail transition-[width,background-color]",
            i === activeIndex ? "w-4 bg-blue-500" : i < activeIndex ? "w-1.5 bg-blue-500" : "w-1.5 bg-navy-300",
          )}
        />
      ))}
    </div>
  );
}
