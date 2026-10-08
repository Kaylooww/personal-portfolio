import Link from "next/link";
import { SkillMark } from "@/components/skills/SkillMark";
import { buttonClasses } from "@/components/ui/ButtonLink";
import { ContentIcon } from "@/components/ui/ContentIcon";
import { EmptyState } from "@/components/ui/EmptyState";
import type { AdminSkillCategory, AdminSkillListItem } from "@/lib/queries/admin-skills";
import { SkillRowActions } from "./SkillRowActions";

interface SkillAdminListProps {
  skills: AdminSkillListItem[];
  categories: AdminSkillCategory[];
  filtered: boolean;
}

interface Group {
  key: string;
  title: string;
  icon: string | null;
  hidden: boolean;
  note?: string;
  skills: AdminSkillListItem[];
}

/**
 * Skills grouped the way the public gear board shows them (category order, then
 * skill order), so the arrows move a skill exactly where visitors will see it.
 */
export function SkillAdminList({ skills, categories, filtered }: SkillAdminListProps) {
  if (skills.length === 0) {
    return filtered ? (
      <EmptyState className="mt-6" title="No matches" message="Try another search or category." />
    ) : (
      <EmptyState
        className="mt-6"
        icon="tools"
        title="No gear packed yet"
        message="Add your first skill to fill the gear board."
        action={
          <Link href="/admin/skills/new" className={buttonClasses("primary", "md")}>
            + Add skill
          </Link>
        }
      />
    );
  }

  const groups: Group[] = categories.map((c) => ({
    key: c.id,
    title: c.name,
    icon: c.icon,
    hidden: !c.is_visible,
    skills: skills.filter((s) => s.category_id === c.id),
  }));
  groups.push({
    key: "none",
    title: "Uncategorised",
    icon: null,
    hidden: true,
    note: "Not shown on the public gear board until assigned to a category.",
    skills: skills.filter((s) => s.category_id === null),
  });

  return (
    <div className="mt-6 flex flex-col gap-8">
      {groups
        .filter((g) => g.skills.length > 0)
        .map((g) => (
          <section key={g.key} aria-labelledby={`skill-group-${g.key}`}>
            <h2 id={`skill-group-${g.key}`} className="flex flex-wrap items-center gap-2 font-display-heavy text-lg uppercase text-ink">
              <ContentIcon icon={g.icon} fallback="gear" className="size-5 text-link" />
              {g.title}
              <span className="text-sm font-bold normal-case text-ink-subtle">({g.skills.length})</span>
              {g.hidden && g.key !== "none" && (
                <span className="rounded-tag bg-ink/10 px-2 py-0.5 text-[0.6875rem] font-extrabold uppercase tracking-[0.08em] text-ink-muted">Hidden category</span>
              )}
            </h2>
            {g.note && <p className="mt-1 text-sm text-warm">{g.note}</p>}
            <ul className="mt-3 flex flex-col gap-2">
              {g.skills.map((s, i) => (
                <li key={s.id} className="surface-paper flex flex-col gap-3 rounded-card p-3 sm:flex-row sm:items-center">
                  <div className="flex min-w-0 flex-1 items-center gap-3">
                    <SkillMark name={s.name} logoUrl={s.logo_url} />
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <Link href={`/admin/skills/${s.id}/edit`} className="font-display-heavy truncate text-base text-ink hover:text-link">
                          {s.name}
                        </Link>
                        {!s.is_visible && (
                          <span className="rounded-tag bg-ink/10 px-2 py-0.5 text-[0.6875rem] font-extrabold uppercase tracking-[0.08em] text-ink-muted">Hidden</span>
                        )}
                      </div>
                      <p className="text-sm text-ink-subtle">
                        {s.slug}
                        {s.projectCount > 0 && ` · in ${s.projectCount} ${s.projectCount === 1 ? "project" : "projects"}`}
                        {s.proficiency !== null && ` · level ${s.proficiency}`}
                      </p>
                    </div>
                  </div>
                  <SkillRowActions skill={s} canMoveUp={i > 0} canMoveDown={i < g.skills.length - 1} reorderable={!filtered} />
                </li>
              ))}
            </ul>
          </section>
        ))}
    </div>
  );
}
