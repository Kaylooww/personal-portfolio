import type { Skill } from "@/types";
import { SkillMark } from "./SkillMark";

/** One piece of gear on a category panel. */
export function SkillCard({ skill }: { skill: Pick<Skill, "name" | "logo_url" | "description"> }) {
  return (
    <li
      title={skill.description ?? undefined}
      className="relative flex flex-col items-center gap-2 rounded-control border border-surface-edge bg-surface-inset/70 px-2 pb-2.5 pt-3 text-center transition-trail transition-transform hover:-translate-y-0.5 motion-reduce:hover:translate-y-0"
    >
      <SkillMark name={skill.name} logoUrl={skill.logo_url} />
      <span className="text-xs font-extrabold leading-tight text-ink-strong">{skill.name}</span>
      <span aria-hidden className="absolute bottom-1 right-1 size-0 border-b-[9px] border-l-[9px] border-b-paper-edge border-l-transparent" />
    </li>
  );
}
