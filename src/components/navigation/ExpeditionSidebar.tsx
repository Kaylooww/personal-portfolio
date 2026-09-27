"use client";

import Link from "next/link";
import { useActiveSection } from "@/hooks/useActiveSection";
import { PORTFOLIO_SECTIONS } from "@/lib/constants/sections";
import { cn } from "@/lib/utils/cn";
import { CheckpointIcon } from "./CheckpointIcon";

/**
 * The route map on the left rail (lg and up): a dashed trail linking the seven
 * checkpoints, drawn solid blue for the stretch already climbed.
 */
export function ExpeditionSidebar() {
  const { section: active, index: activeIndex } = useActiveSection();

  return (
    <nav
      aria-label="Expedition route"
      className="fixed inset-y-0 left-0 z-(--z-sidebar) hidden w-(--sidebar-width) flex-col justify-center pl-6 lg:flex"
    >
      {/* Trail stub leading into the first checkpoint */}
      <span
        aria-hidden
        className={cn(
          "ml-[1.0625rem] h-10 border-l-2",
          activeIndex >= 0 ? "border-solid border-blue-500" : "border-dashed border-navy-300",
        )}
      />
      <ol>
        {PORTFOLIO_SECTIONS.map((s, i) => {
          const isActive = active?.id === s.id;
          const isClimbed = i < activeIndex;
          const isLast = i === PORTFOLIO_SECTIONS.length - 1;
          return (
            <li key={s.id} className="relative flex h-16 items-start">
              {!isLast && (
                <span
                  aria-hidden
                  className={cn(
                    "absolute left-[1.0625rem] top-9 h-full border-l-2",
                    isClimbed ? "border-solid border-blue-500" : "border-dashed border-navy-300",
                  )}
                />
              )}
              <Link
                href={s.href}
                aria-current={isActive ? "page" : undefined}
                className="group relative flex items-center gap-3 rounded-pill pr-3 outline-offset-2"
              >
                <span className="grid w-9 place-items-center">
                  <span
                    className={cn(
                      "grid place-items-center rounded-pill text-white transition-trail transition-[background-color,box-shadow,width,height]",
                      isActive
                        ? "-mt-1 size-11 bg-blue-500 shadow-glow-blue"
                        : cn("size-9 group-hover:bg-blue-600", isClimbed ? "bg-blue-500" : "bg-navy-700"),
                    )}
                  >
                    <CheckpointIcon icon={s.icon} className={isActive ? "size-5" : "size-4"} />
                  </span>
                </span>
                <span
                  className={cn(
                    "text-[0.8125rem] font-extrabold uppercase tracking-[0.06em] transition-trail transition-colors",
                    isActive ? "text-blue-600" : "text-navy-900 group-hover:text-blue-600",
                  )}
                >
                  {s.label}
                </span>
              </Link>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
