import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

// Teach tailwind-merge our custom scales so e.g. `text-hero` and `text-[2rem]`
// are recognised as conflicting font sizes (not a colour + a size).
const twMerge = extendTailwindMerge({
  extend: {
    theme: {
      text: ["hero", "title", "heading", "hand-lg"],
      radius: ["tag", "control", "card", "panel", "pill"],
      shadow: ["paper", "paper-lift", "nav", "button", "button-pressed", "sign", "glow-blue"],
    },
  },
});

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
