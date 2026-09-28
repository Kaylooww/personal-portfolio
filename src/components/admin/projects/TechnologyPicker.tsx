"use client";

import { SkillMark } from "@/components/skills/SkillMark";
import { UiIcon } from "@/components/ui/UiIcon";
import type { SkillOption } from "@/lib/queries/admin-projects";
import { cn } from "@/lib/utils/cn";

interface TechnologyPickerProps {
  options: SkillOption[];
  value: string[];
  onChange: (ids: string[]) => void;
  error?: string | null;
}

/**
 * Pick technologies from the skills list. The order they're picked in is the
 * order shown on the public card; it can be adjusted in the "Selected" row.
 */
export function TechnologyPicker({ options, value, onChange, error }: TechnologyPickerProps) {
  const byId = new Map(options.map((o) => [o.id, o]));
  const groups = new Map<string, SkillOption[]>();
  for (const o of options) {
    const key = o.category ?? "Uncategorised";
    groups.set(key, [...(groups.get(key) ?? []), o]);
  }

  const toggle = (id: string) => onChange(value.includes(id) ? value.filter((v) => v !== id) : [...value, id]);
  const move = (index: number, delta: -1 | 1) => {
    const next = [...value];
    const j = index + delta;
    if (j < 0 || j >= next.length) return;
    [next[index], next[j]] = [next[j]!, next[index]!];
    onChange(next);
  };

  return (
    <fieldset className="flex flex-col gap-3">
      <legend className="sr-only">Tech stack</legend>

      {options.length === 0 ? (
        <p className="text-sm text-navy-500">No skills yet — add some in Skills (Phase 12) to tag projects.</p>
      ) : (
        <div className="flex flex-col gap-3">
          {[...groups].map(([group, items]) => (
            <div key={group}>
              <p className="eyebrow text-[0.6875rem] text-navy-500">{group}</p>
              <div className="mt-1.5 flex flex-wrap gap-1.5">
                {items.map((o) => {
                  const on = value.includes(o.id);
                  return (
                    <button
                      key={o.id}
                      type="button"
                      aria-pressed={on}
                      onClick={() => toggle(o.id)}
                      className={cn(
                        "flex items-center gap-2 rounded-pill border py-1 pl-1 pr-3 text-sm font-bold transition-trail transition-colors",
                        on ? "border-blue-500 bg-blue-100 text-blue-700" : "border-paper-edge bg-white text-navy-800 hover:border-blue-300",
                      )}
                    >
                      <SkillMark name={o.name} logoUrl={o.logo_url} className="size-6 rounded-pill text-[0.55rem]" />
                      {o.name}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {value.length > 0 && (
        <div className="rounded-control bg-paper-shade/60 p-3">
          <p className="text-xs font-extrabold uppercase tracking-[0.08em] text-navy-500">Selected — shown in this order</p>
          <ol className="mt-2 flex flex-wrap gap-1.5">
            {value.map((id, i) => {
              const o = byId.get(id);
              if (!o) return null;
              return (
                <li key={id} className="flex items-center gap-1 rounded-pill bg-white py-0.5 pl-3 pr-1 text-sm font-bold text-navy-800">
                  {o.name}
                  <button type="button" onClick={() => move(i, -1)} disabled={i === 0} aria-label={`Move ${o.name} earlier`} className="grid size-6 place-items-center rounded-pill hover:bg-blue-50 disabled:opacity-30">
                    <UiIcon name="arrow-left" className="size-3.5" />
                  </button>
                  <button type="button" onClick={() => move(i, 1)} disabled={i === value.length - 1} aria-label={`Move ${o.name} later`} className="grid size-6 place-items-center rounded-pill hover:bg-blue-50 disabled:opacity-30">
                    <UiIcon name="arrow-right" className="size-3.5" />
                  </button>
                  <button type="button" onClick={() => toggle(id)} aria-label={`Remove ${o.name}`} className="grid size-6 place-items-center rounded-pill hover:bg-danger-100 hover:text-danger-600">
                    <UiIcon name="close" className="size-3.5" />
                  </button>
                </li>
              );
            })}
          </ol>
        </div>
      )}
      {error && <p className="text-sm font-bold text-danger-600">{error}</p>}
    </fieldset>
  );
}
