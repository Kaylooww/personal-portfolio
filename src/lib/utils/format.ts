const monthYear = new Intl.DateTimeFormat("en-US", { month: "short", year: "numeric", timeZone: "UTC" });
const exactDate = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" });
const yearOnly = new Intl.DateTimeFormat("en-US", { year: "numeric", timeZone: "UTC" });

/** Dates are displayed in UTC so calendar days do not shift with a visitor's timezone. */
export function formatContentDate(iso: string | null | undefined, display: "day" | "month" | "year" = "day"): string | null {
  if (!iso) return null;
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return null;
  return (display === "year" ? yearOnly : display === "month" ? monthYear : exactDate).format(date);
}

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
