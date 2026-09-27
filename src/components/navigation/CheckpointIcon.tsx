import type { ReactNode } from "react";
import type { SectionIcon } from "@/lib/constants/sections";
import { cn } from "@/lib/utils/cn";

/** Line glyphs for the seven checkpoints (2px stroke, rounded caps). */
const PATHS: Record<SectionIcon, ReactNode> = {
  plane: (
    <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2Z" />
  ),
  mountain: (
    <>
      <path d="m2.5 19.5 7-12.5 4.4 7.6" />
      <path d="m11.6 19.5 5-8.3 4.9 8.3Z" />
      <path d="M2.5 19.5h9.1" />
      <path d="m6.9 11.6 2.6 1.6 1.8-1.4" />
    </>
  ),
  wrench: (
    <>
      <path d="M14.6 6.4a4 4 0 0 0 5 5l-9 9a2.1 2.1 0 0 1-3-3l9-9a4 4 0 0 0-2 -2Z" />
      <path d="M14.6 6.4 17 4l3 3-2.4 2.4" />
    </>
  ),
  pack: (
    <>
      <path d="M6 9a6 6 0 0 1 12 0v10.5a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 6 19.5Z" />
      <path d="M9.5 3.8V3h5v.8" />
      <path d="M9 13h6v4H9Z" />
      <path d="M6 12H4.5M18 12h1.5" />
    </>
  ),
  map: (
    <>
      <path d="m3 6 5.5-2 7 2.5L21 4.5v13.5l-5.5 2-7-2.5L3 19.5Z" />
      <path d="M8.5 4v13.5M15.5 6.5V20" />
    </>
  ),
  flag: (
    <>
      <path d="M5 21V4" />
      <path d="M5 4.5c4-2 6.5 2 11 0v8.5c-4.5 2-7-2-11 0" />
    </>
  ),
  summit: (
    <>
      <path d="m2 20 7.5-13L13 13" />
      <path d="m9.5 20 6.5-11 6 11Z" />
      <path d="M2 20h8" />
      <path d="M16 9V3.5l3 1.3-3 1.4" />
    </>
  ),
};

interface CheckpointIconProps {
  icon: SectionIcon;
  className?: string;
}

export function CheckpointIcon({ icon, className }: CheckpointIconProps) {
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
      {PATHS[icon]}
    </svg>
  );
}
