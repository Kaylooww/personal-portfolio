import { SkillMark } from "@/components/skills/SkillMark";
import type { Skill } from "@/types";

/** Row of technology marks with accessible names. */
export function TechStack({ technologies, size = "sm" }: { technologies: Skill[]; size?: "sm" | "md" }) {
  if (technologies.length === 0) return <p className="text-sm text-navy-500">Not listed yet</p>;
  return (
    <ul className="flex flex-wrap gap-1.5" aria-label="Technologies">
      {technologies.map((t) => (
        <li key={t.id} className={size === "md" ? "flex items-center gap-2 rounded-control bg-paper-shade/80 py-1 pl-1 pr-3" : undefined} title={t.name}>
          <SkillMark name={t.name} logoUrl={t.logo_url} className={size === "md" ? "size-8 text-xs" : "size-7 rounded-[6px] text-[0.625rem]"} />
          {size === "md" ? <span className="text-sm font-bold text-navy-800">{t.name}</span> : <span className="sr-only">{t.name}</span>}
        </li>
      ))}
    </ul>
  );
}
