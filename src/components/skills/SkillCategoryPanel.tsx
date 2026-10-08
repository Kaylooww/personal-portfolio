import { ContentIcon } from "@/components/ui/ContentIcon";
import type { SkillCategoryWithSkills } from "@/types";
import { SkillCard } from "./SkillCard";

/** A paper panel nailed to the gear board: category heading + its skills. */
export function SkillCategoryPanel({ category }: { category: SkillCategoryWithSkills }) {
  const headingId = `skill-cat-${category.slug}`;
  return (
    <section aria-labelledby={headingId} className="surface-paper relative rounded-card p-4 sm:p-5">
      {/* nail heads */}
      <span aria-hidden className="absolute left-2.5 top-2.5 size-1.5 rounded-pill bg-navy-500/60" />
      <span aria-hidden className="absolute right-2.5 top-2.5 size-1.5 rounded-pill bg-navy-500/60" />
      <h2 id={headingId} className="flex items-center gap-2.5 font-display-heavy text-lg uppercase text-ink">
        <ContentIcon icon={category.icon} fallback="gear" className="size-6 text-link" />
        {category.name}
      </h2>
      <ul className="mt-3 grid grid-cols-3 gap-2.5">
        {category.skills.map((s) => (
          <SkillCard key={s.id} skill={s} />
        ))}
      </ul>
    </section>
  );
}
