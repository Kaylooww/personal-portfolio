const monthYear = new Intl.DateTimeFormat("en-US", { month: "short", year: "numeric", timeZone: "UTC" });

/** "2025-05-01" → "May 2025". Returns null for missing/invalid input. */
export function formatMonthYear(iso: string | null | undefined): string | null {
  if (!iso) return null;
  const date = new Date(iso);
  return Number.isNaN(date.getTime()) ? null : monthYear.format(date);
}

/** 1 → "01" — expedition numbers on flags and tabs. */
export function padNumber(n: number): string {
  return String(n).padStart(2, "0");
}
