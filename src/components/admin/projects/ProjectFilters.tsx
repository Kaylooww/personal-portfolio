"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useId, useState, useTransition } from "react";
import { UiIcon } from "@/components/ui/UiIcon";
import { PROJECT_STATUS_LABEL, PROJECT_STATUSES } from "@/lib/constants/status";

const STATES = [
  { value: "", label: "All states" },
  { value: "published", label: "Published" },
  { value: "draft", label: "Draft" },
  { value: "archived", label: "Archived" },
];

/** Search + filters kept in the URL (?q=&state=&status=) so the server renders the filtered list. */
export function ProjectFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const [pending, startTransition] = useTransition();
  const [q, setQ] = useState(params.get("q") ?? "");
  const ids = { q: useId(), state: useId(), status: useId() };

  const update = (key: string, value: string) => {
    const next = new URLSearchParams(params.toString());
    if (value) next.set(key, value);
    else next.delete(key);
    const qs = next.toString();
    startTransition(() => router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false }));
  };

  // Debounce typing so every keystroke isn't a server round trip.
  useEffect(() => {
    if (q === (params.get("q") ?? "")) return;
    const t = window.setTimeout(() => update("q", q.trim()), 300);
    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- update is recreated each render; q drives this effect
  }, [q]);

  const select = "h-11 rounded-control border border-paper-edge bg-white px-3 text-sm font-bold text-navy-900";

  return (
    <div className="surface-paper flex flex-col gap-3 rounded-card p-3 md:flex-row md:items-center" aria-busy={pending}>
      <div className="relative flex-1">
        <label htmlFor={ids.q} className="sr-only">
          Search projects
        </label>
        <UiIcon name="search" className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-navy-500" />
        <input
          id={ids.q}
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search title, summary or slug"
          className="h-11 w-full rounded-control border border-paper-edge bg-white pl-9 pr-3 text-sm text-navy-900 placeholder:text-navy-500"
        />
      </div>
      <label htmlFor={ids.state} className="sr-only">
        Filter by publishing state
      </label>
      <select id={ids.state} className={select} value={params.get("state") ?? ""} onChange={(e) => update("state", e.target.value)}>
        {STATES.map((s) => (
          <option key={s.value} value={s.value}>
            {s.label}
          </option>
        ))}
      </select>
      <label htmlFor={ids.status} className="sr-only">
        Filter by expedition status
      </label>
      <select id={ids.status} className={select} value={params.get("status") ?? ""} onChange={(e) => update("status", e.target.value)}>
        <option value="">All statuses</option>
        {PROJECT_STATUSES.map((s) => (
          <option key={s} value={s}>
            {PROJECT_STATUS_LABEL[s]}
          </option>
        ))}
      </select>
    </div>
  );
}
