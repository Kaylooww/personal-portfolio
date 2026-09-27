import "server-only";
import { MOCK_SKILL_CATEGORIES, MOCK_SKILLS } from "@/lib/mock/skills";
import { visibleInOrder } from "@/lib/utils/order";
import type { Skill, SkillCategoryWithSkills } from "@/types";

/**
 * Visible categories, each with its visible skills, in display order.
 * Categories with no visible skills are dropped so the board never shows empty panels.
 */
export async function getSkillCategoriesWithSkills(): Promise<SkillCategoryWithSkills[]> {
  const skills = visibleInOrder(MOCK_SKILLS);
  return visibleInOrder(MOCK_SKILL_CATEGORIES)
    .map((c) => ({ ...c, skills: skills.filter((s) => s.category_id === c.id) }))
    .filter((c) => c.skills.length > 0);
}

/** Every visible skill, keyed by id — used to resolve project technologies. */
export async function getSkillsById(): Promise<Map<string, Skill>> {
  return new Map(visibleInOrder(MOCK_SKILLS).map((s) => [s.id, s]));
}
