"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useId, useRef, useState, useTransition } from "react";
import { UiIcon } from "@/components/ui/UiIcon";

export interface AdminFilterSelect {
  /** URL search param key. */
  param: string;
  label: string;
  options: readonly { value: string; label: string }[];
}

interface AdminFiltersProps {
  searchLabel: string;
  searchPlaceholder: string;
  selects: readonly AdminFilterSelect[];
}

/**
 * Search box + dropdown filters that live in the URL (?q=…&param=…), so the
 * server renders the filtered list and the back button / shared links work.
 */
export function AdminFilters({ searchLabel, searchPlaceholder, selects }: AdminFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const [pending, startTransition] = useTransition();
  const [q, setQ] = useState(params.get("q") ?? "");
  const timer = useRef<number | undefined>(undefined);
  const baseId = useId();

  useEffect(() => () => window.clearTimeout(timer.current), []);

  // Reads the live query string at call time so debounced calls never use stale params.
  const update = (key: string, value: string) => {
    const next = new URLSearchParams(window.location.search);
    if (value) next.set(key, value);
    else next.delete(key);
    const qs = next.toString();
    startTransition(() => router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false }));
  };

  const onSearch = (value: string) => {
    setQ(value);
    window.clearTimeout(timer.current);
    // Debounce typing so every keystroke isn't a server round trip.
    timer.current = window.setTimeout(() => update("q", value.trim()), 300);
  };

  const selectClass = "h-11 rounded-control border border-paper-edge bg-white px-3 text-sm font-bold text-navy-900";

  return (
    <div className="surface-paper flex flex-col gap-3 rounded-card p-3 md:flex-row md:items-center" aria-busy={pending}>
      <div className="relative flex-1">
        <label htmlFor={`${baseId}-q`} className="sr-only">
          {searchLabel}
        </label>
        <UiIcon name="search" className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-navy-500" />
        <input
          id={`${baseId}-q`}
          type="search"
          value={q}
          onChange={(e) => onSearch(e.target.value)}
          placeholder={searchPlaceholder}
          className="h-11 w-full rounded-control border border-paper-edge bg-white pl-9 pr-3 text-sm text-navy-900 placeholder:text-navy-500"
        />
      </div>
      {selects.map((s) => (
        <div key={s.param}>
          <label htmlFor={`${baseId}-${s.param}`} className="sr-only">
            {s.label}
          </label>
          <select
            id={`${baseId}-${s.param}`}
            className={`${selectClass} w-full md:w-auto`}
            value={params.get(s.param) ?? ""}
            onChange={(e) => update(s.param, e.target.value)}
          >
            {s.options.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
      ))}
    </div>
  );
}
