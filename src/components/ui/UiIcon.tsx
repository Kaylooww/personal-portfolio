import type { ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

export type UiIconName =
  | "arrow-right"
  | "arrow-down-right"
  | "chevron-up"
  | "folder"
  | "menu"
  | "close"
  | "key"
  | "laptop"
  | "palm"
  | "plane"
  | "arrow-left"
  | "external"
  | "github"
  | "linkedin"
  | "mail"
  | "search";

/** General-purpose line icons (2px stroke, rounded caps). Decorative by default. */
const PATHS: Record<UiIconName, ReactNode> = {
  "arrow-left": <path d="M20 12H5m6-6-6 6 6 6" />,
  external: <path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5" />,
  github: (
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.4 5.4 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4M9 18c-4.51 2-5-2-7-2" />
  ),
  linkedin: (
    <>
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6ZM2 9h4v12H2Z" />
      <circle cx="4" cy="4" r="2" />
    </>
  ),
  mail: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3 7 9 6 9-6" />
    </>
  ),
  search: (
    <>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-4-4" />
    </>
  ),
  "arrow-right": <path d="M4 12h15m-6-6 6 6-6 6" />,
  "arrow-down-right": <path d="m6 6 12 12m0-9v9H9" />,
  "chevron-up": <path d="m5 15 7-7 7 7" />,
  folder: <path d="M3 7.5A1.5 1.5 0 0 1 4.5 6h4.2l2 2.2h8.8A1.5 1.5 0 0 1 21 9.7v8.8a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 3 18.5Z" />,
  menu: <path d="M4 7h16M4 12h16M4 17h10" />,
  close: <path d="M6 6l12 12M18 6 6 18" />,
  key: (
    <>
      <circle cx="8" cy="15" r="4" />
      <path d="m11 12 8-8m-3 3 2.5 2.5M14 9l2 2" />
    </>
  ),
  laptop: (
    <>
      <path d="M5 6.5A1.5 1.5 0 0 1 6.5 5h11A1.5 1.5 0 0 1 19 6.5V15H5Z" />
      <path d="M2.5 15h19l-1.2 3H3.7Z" />
    </>
  ),
  palm: (
    <>
      <path d="M12 21c0-4 .5-8 2-11" />
      <path d="M14 10c-2.5-3-6.5-3-8.5-.5 3-.5 5.5 0 8.5.5Z" />
      <path d="M14 10c1-3.5 4.5-5 7-3.5-3 .5-5 1.5-7 3.5Z" />
      <path d="M14 10c3 0 5.5 2 5.5 4.5C17.5 12.5 16 11.5 14 10Z" />
      <path d="M8 21h9" />
    </>
  ),
  plane: (
    <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2Z" />
  ),
};

interface UiIconProps {
  name: UiIconName;
  className?: string;
}

export function UiIcon({ name, className }: UiIconProps) {
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
      {PATHS[name]}
    </svg>
  );
}
