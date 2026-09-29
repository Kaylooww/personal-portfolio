"use client";

import { useId } from "react";
import { CONTENT_ICON_KEYS, ContentIcon, type ContentIconKey } from "@/components/ui/ContentIcon";
import { cn } from "@/lib/utils/cn";

interface IconPickerProps {
  label: string;
  hint?: string;
  value: string;
  onChange: (key: string) => void;
  /** Offer "No icon" (stores ""). */
  allowNone?: boolean;
  error?: string | null;
}

const label = (key: ContentIconKey) => key.replace(/-/g, " ");

/** Radio grid over the ContentIcon registry — the keys stored in the database. */
export function IconPicker({ label: text, hint, value, onChange, allowNone = true, error }: IconPickerProps) {
  const name = useId();
  const options: (ContentIconKey | "")[] = allowNone ? ["", ...CONTENT_ICON_KEYS] : [...CONTENT_ICON_KEYS];

  return (
    <fieldset className="flex flex-col gap-1.5">
      <legend className="text-sm font-extrabold text-navy-900">{text}</legend>
      {hint && <p className="text-sm text-navy-500">{hint}</p>}
      <div className="mt-1 grid grid-cols-[repeat(auto-fill,minmax(4.25rem,1fr))] gap-1.5">
        {options.map((key) => {
          const checked = value === key;
          return (
            <label
              key={key || "none"}
              title={key ? label(key) : "No icon"}
              className={cn(
                "flex cursor-pointer flex-col items-center gap-1 rounded-control border px-1 py-2 text-[0.625rem] font-bold capitalize leading-tight text-navy-700 transition-trail transition-colors",
                "has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-blue-500",
                checked ? "border-blue-500 bg-blue-100 text-blue-700" : "border-paper-edge bg-white hover:border-blue-300",
              )}
            >
              <input type="radio" name={name} value={key} checked={checked} onChange={() => onChange(key)} className="sr-only" />
              {key ? <ContentIcon icon={key} className="size-5" /> : <span aria-hidden className="grid size-5 place-items-center text-base leading-none">∅</span>}
              <span className="w-full truncate text-center">{key ? label(key) : "none"}</span>
            </label>
          );
        })}
      </div>
      {error && <p className="text-sm font-bold text-danger-600">{error}</p>}
    </fieldset>
  );
}
