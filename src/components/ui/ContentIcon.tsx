import type { ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

/**
 * Icons that content can reference by key (about items, skill categories,
 * journey entries, milestone badges). Keys are stored in the database, so
 * only ever add keys — renaming one orphans existing rows.
 */
const PATHS = {
  graduation: (
    <>
      <path d="m2 9 10-5 10 5-10 5Z" />
      <path d="M6 11v5c3 2 9 2 12 0v-5M22 9v6" />
    </>
  ),
  pin: (
    <>
      <path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21Z" />
      <circle cx="12" cy="9.5" r="2.5" />
    </>
  ),
  gamepad: (
    <>
      <path d="M6 8h12a4 4 0 0 1 4 4v1.5a3.5 3.5 0 0 1-6.3 2.1L14.5 14h-5l-1.2 1.6A3.5 3.5 0 0 1 2 13.5V12a4 4 0 0 1 4-4Z" />
      <path d="M7 10.5v3M5.5 12h3M16 11h.01M18 13h.01" />
    </>
  ),
  mountain: <path d="m2.5 20 7-12 4 6.5 2.5-3.5L21.5 20Z" />,
  camera: (
    <>
      <path d="M4 8h3l2-3h6l2 3h3a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1Z" />
      <circle cx="12" cy="13.5" r="3.5" />
    </>
  ),
  music: (
    <>
      <path d="M9 18V5l11-2v13" />
      <circle cx="6" cy="18" r="3" />
      <circle cx="17" cy="16" r="3" />
    </>
  ),
  monitor: <path d="M3 5h18v11H3ZM8 20h8M12 16v4" />,
  laptop: <path d="M5 6.5A1.5 1.5 0 0 1 6.5 5h11A1.5 1.5 0 0 1 19 6.5V15H5ZM2.5 15h19l-1.2 3H3.7Z" />,
  pen: <path d="m4 20 4-1L19 8l-3-3L5 16ZM14 7l3 3" />,
  globe: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18" />
    </>
  ),
  box: <path d="m12 3 8 4.5v9L12 21l-8-4.5v-9ZM4 7.5l8 4.5 8-4.5M12 12v9" />,
  target: (
    <>
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="5" />
      <circle cx="12" cy="12" r="1.5" />
    </>
  ),
  code: <path d="m8 7-5 5 5 5M16 7l5 5-5 5M14 4l-4 16" />,
  users: (
    <>
      <circle cx="9" cy="8" r="3.5" />
      <path d="M2.5 20c0-3.6 2.9-6 6.5-6s6.5 2.4 6.5 6M16 4.6a3.5 3.5 0 0 1 0 6.8M18 14.3c2 .7 3.5 2.6 3.5 5.7" />
    </>
  ),
  gear: (
    <>
      <circle cx="12" cy="12" r="3.5" />
      <path d="M12 2v3M12 19v3M4.9 4.9 7 7M17 17l2.1 2.1M2 12h3M19 12h3M4.9 19.1 7 17M17 7l2.1-2.1" />
    </>
  ),
  book: <path d="M4 19V5a2 2 0 0 1 2-2h14v14H6a2 2 0 0 0-2 2Zm0 0a2 2 0 0 0 2 2h14" />,
  trophy: <path d="M8 4h8v5a4 4 0 0 1-8 0ZM8 6H5a3 3 0 0 0 3 4M16 6h3a3 3 0 0 1-3 4M12 13v4M8 21h8M9 21v-2h6v2" />,
  medal: (
    <>
      <circle cx="12" cy="15" r="5" />
      <path d="M8.5 11 5 3h4l3 6 3-6h4l-3.5 8" />
    </>
  ),
  certificate: <path d="M4 4h16v11H4ZM8 8h8M8 11h5M14 19l.5-3.5M18 19l-.5-3.5M13.5 21l2.5-1.5 2.5 1.5" />,
  flag: <path d="M5 21V4M5 4.5c4-2 6.5 2 11 0v8.5c-4.5 2-7-2-11 0" />,
  star: <path d="m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9Z" />,
  compass: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="m15.5 8.5-2 5-5 2 2-5Z" />
    </>
  ),
  lightbulb: <path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2.1h5c0-.9.4-1.6 1-2.1A6 6 0 0 0 12 3Z" />,
  rocket: (
    <>
      <path d="M5 15c-1.5 1.5-2 5-2 5s3.5-.5 5-2M9 15l-3-3c2-6 7-9 14-9 0 7-3 12-9 14Z" />
      <circle cx="15" cy="9" r="1.5" />
    </>
  ),
  database: (
    <>
      <ellipse cx="12" cy="5" rx="8" ry="3" />
      <path d="M4 5v14c0 1.7 3.6 3 8 3s8-1.3 8-3V5M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3" />
    </>
  ),
  server: <path d="M4 4h16v6H4ZM4 14h16v6H4ZM8 7h.01M8 17h.01" />,
  tools: <path d="M14.6 6.4a4 4 0 0 0 5 5l-9 9a2.1 2.1 0 0 1-3-3l9-9a4 4 0 0 0-2-2ZM14.6 6.4 17 4l3 3-2.4 2.4" />,
  palette: (
    <path d="M12 3a9 9 0 1 0 0 18c1.1 0 1.7-.8 1.7-1.7 0-.5-.2-.8-.5-1.2-.3-.3-.5-.7-.5-1.2 0-1 .8-1.7 1.7-1.7H16a5 5 0 0 0 5-5c0-4-4-7.2-9-7.2ZM7.5 11h.01M10 7.5h.01M14.5 7.5h.01" />
  ),
  palm: <path d="M12 21c0-4 .5-8 2-11M14 10c-2.5-3-6.5-3-8.5-.5 3-.5 5.5 0 8.5.5ZM14 10c1-3.5 4.5-5 7-3.5-3 .5-5 1.5-7 3.5ZM14 10c3 0 5.5 2 5.5 4.5-2-2-3.5-3-5.5-4.5ZM8 21h9" />,
  "check-circle": (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="m8 12 3 3 5-6" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </>
  ),
  archive: <path d="M3 4h18v4H3ZM5 8v12h14V8M10 12h4" />,
} satisfies Record<string, ReactNode>;

export type ContentIconKey = keyof typeof PATHS;

export const CONTENT_ICON_KEYS = Object.keys(PATHS) as ContentIconKey[];

export function isContentIconKey(key: string | null | undefined): key is ContentIconKey {
  return typeof key === "string" && key in PATHS;
}

interface ContentIconProps {
  /** Stored icon key; unknown or missing keys fall back to `fallback`. */
  icon: string | null | undefined;
  fallback?: ContentIconKey;
  className?: string;
}

export function ContentIcon({ icon, fallback = "compass", className }: ContentIconProps) {
  const key = isContentIconKey(icon) ? icon : fallback;
  return (
    <svg
      viewBox="0 0 24 24"
      className={cn("size-5 shrink-0", className)}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      focusable="false"
    >
      {PATHS[key]}
    </svg>
  );
}
