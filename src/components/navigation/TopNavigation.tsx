"use client";

import Link from "next/link";
import { LogoMark } from "@/components/ui/LogoMark";
import { useActiveSection } from "@/hooks/useActiveSection";
import { PORTFOLIO_SECTIONS } from "@/lib/constants/sections";
import { cn } from "@/lib/utils/cn";
import { CheckpointIcon } from "./CheckpointIcon";
import { ThemeToggle } from "@/components/theme/ThemeToggle";

/** Floating paper pill across the top of the scene (lg and up). */
export function TopNavigation() {
  const { section: active } = useActiveSection();

  return (
    <nav
      aria-label="Checkpoints"
      className={cn(
        "surface-paper fixed top-4 z-(--z-nav) hidden h-14 items-center gap-1 rounded-pill py-1.5 pl-3 pr-2 shadow-nav lg:flex",
        // Centre on the content column, not the viewport, so the sidebar doesn't push it off-balance.
        "left-[calc(var(--sidebar-width)+(100%-var(--sidebar-width))/2)] -translate-x-1/2",
      )}
    >
      <Link
        href="/"
        className="mr-1 grid size-10 place-items-center rounded-pill text-blue-500 transition-trail transition-colors hover:bg-active-soft"
      >
        <LogoMark className="h-5" title="Kyle Castro — home" />
      </Link>
      <ul className="flex items-center gap-0.5">
        {PORTFOLIO_SECTIONS.map((s) => {
          const isActive = active?.id === s.id;
          return (
            <li key={s.id}>
              <Link
                href={s.href}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "relative flex h-10 items-center gap-1.5 rounded-pill px-2.5 text-[0.75rem] font-extrabold uppercase tracking-[0.04em] whitespace-nowrap xl:px-3.5 xl:text-[0.8125rem]",
                  "transition-trail transition-colors",
                  isActive ? "bg-active text-link-strong" : "text-ink hover:bg-active-soft hover:text-link",
                )}
              >
                {s.id === "summit" && <CheckpointIcon icon="summit" className="size-4" />}
                {s.label}
                {isActive && (
                  <span aria-hidden className="absolute inset-x-3.5 -bottom-0.5 h-[3px] rounded-pill bg-blue-500" />
                )}
              </Link>
            </li>
          );
        })}
      </ul>
      <ThemeToggle className="ml-1" />
    </nav>
  );
}
