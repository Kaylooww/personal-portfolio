import type { Skill, SkillCategory } from "@/types";

/**
 * PLACEHOLDER CONTENT — replaced by `skill_categories` / `skills` in Phase 14.
 * Mirrors reference 03-skills.png. Logos arrive via `logo_url` uploads (Phase 12);
 * until then tiles show a monogram.
 */
const stamp = { created_at: "2026-09-27T00:00:00.000Z", updated_at: "2026-09-27T00:00:00.000Z" };

const category = (n: number, name: string, slug: string, icon: string): SkillCategory => ({
  id: `c0000000-0000-0000-0000-00000000000${n}`,
  name,
  slug,
  icon,
  display_order: n,
  is_visible: true,
  ...stamp,
});

export const MOCK_SKILL_CATEGORIES: SkillCategory[] = [
  category(1, "Programming", "programming", "code"),
  category(2, "Frontend", "frontend", "monitor"),
  category(3, "Backend", "backend", "server"),
  category(4, "Database", "database", "database"),
  category(5, "Tools", "tools", "tools"),
  category(6, "UI/UX", "ui-ux", "palette"),
];

let seq = 0;
const skill = (categoryN: number, name: string, slug: string, featured = false): Skill => {
  seq += 1;
  return {
    id: `s0000000-0000-0000-0000-${String(seq).padStart(12, "0")}`,
    name,
    slug,
    category_id: `c0000000-0000-0000-0000-00000000000${categoryN}`,
    description: null,
    icon: null,
    logo_url: null,
    proficiency: null,
    featured,
    display_order: seq,
    is_visible: true,
    ...stamp,
  };
};

export const MOCK_SKILLS: Skill[] = [
  skill(1, "JavaScript", "javascript", true),
  skill(1, "Java", "java"),
  skill(1, "C", "c"),
  skill(2, "HTML", "html"),
  skill(2, "CSS", "css"),
  skill(2, "React", "react", true),
  skill(3, "Java", "java-backend"),
  skill(3, "C", "c-backend"),
  skill(4, "PostgreSQL", "postgresql"),
  skill(5, "Git", "git"),
  skill(6, "Figma", "figma", true),
];
