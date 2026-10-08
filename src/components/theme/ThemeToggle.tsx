"use client";

import { useSyncExternalStore } from "react";
import { THEME_KEY } from "@/lib/theme";
import { cn } from "@/lib/utils/cn";

type Theme = "light" | "dark";
const CHANGE_EVENT = "portfolio-theme-change";

function currentTheme(): Theme {
  return document.documentElement.dataset.theme === "dark" ? "dark" : "light";
}

function applyTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme;
  document.documentElement.style.colorScheme = theme;
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

function savedTheme(): Theme | null {
  try {
    const saved = localStorage.getItem(THEME_KEY);
    return saved === "light" || saved === "dark" ? saved : null;
  } catch { return null; }
}

function subscribe(notify: () => void) {
  const system = window.matchMedia("(prefers-color-scheme: dark)");
  const sync = () => applyTheme(savedTheme() ?? (system.matches ? "dark" : "light"));
  const storage = (event: StorageEvent) => {
    if (event.key === THEME_KEY || event.key === null) sync();
  };
  window.addEventListener(CHANGE_EVENT, notify);
  window.addEventListener("storage", storage);
  system.addEventListener("change", sync);
  // Another tab may have changed the preference between the bootstrap and hydration.
  sync();
  return () => {
    window.removeEventListener(CHANGE_EVENT, notify);
    window.removeEventListener("storage", storage);
    system.removeEventListener("change", sync);
  };
}

const serverTheme = (): Theme => "light";

/** Both navigation sizes share the same stored theme and respond to other tabs. */
export function ThemeToggle({ className }: { className?: string }) {
  const theme = useSyncExternalStore(subscribe, currentTheme, serverTheme);
  const label = theme === "dark" ? "Switch to light mode" : "Switch to dark mode";

  function toggle() {
    const next = currentTheme() === "dark" ? "light" : "dark";
    try { localStorage.setItem(THEME_KEY, next); } catch { /* The switch still works when storage is unavailable. */ }
    applyTheme(next);
  }

  return (
    <button type="button" onClick={toggle} aria-label={label} title={label} className={cn("grid size-11 shrink-0 place-items-center rounded-pill border border-surface-edge bg-surface-inset text-ink transition-colors hover:bg-active focus-visible:outline-offset-2", className)}>
      <svg aria-hidden viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="size-5 dark:hidden">
        <path d="M20.6 13A8.6 8.6 0 0 1 11 3.4 8.8 8.8 0 1 0 20.6 13Z" />
      </svg>
      <svg aria-hidden viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" className="hidden size-5 dark:block">
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.5 1.5M17.5 17.5 19 19M5 19l1.5-1.5M17.5 6.5 19 5" />
      </svg>
    </button>
  );
}
