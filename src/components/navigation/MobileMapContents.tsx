"use client";

import Link from "next/link";
import { PORTFOLIO_SECTIONS } from "@/lib/constants/sections";
import { cn } from "@/lib/utils/cn";
import { CheckpointIcon } from "./CheckpointIcon";

export default function MobileMapContents({ activeIndex, onNavigate }: { activeIndex: number; onNavigate: () => void }) {
  const total = PORTFOLIO_SECTIONS.length;
  return (
    <nav aria-label="All checkpoints" className="mt-6 flex-1">
      <ol>
        {PORTFOLIO_SECTIONS.map((s, i) => {
          const isActive = i === activeIndex;
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
                onClick={onNavigate}
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
  );
}
