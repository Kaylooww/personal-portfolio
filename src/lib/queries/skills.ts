import "server-only";
import type { SkillCategoryWithSkills } from "@/types";
import { publicDb, queryFailed } from "./public-db";

/**
 * Visible categories, each with its visible skills, in display order.
 * Categories with no visible skills are dropped so the board never shows empty
 * panels; uncategorised skills aren't shown on the board.
 */
export async function getSkillCategoriesWithSkills(): Promise<SkillCategoryWithSkills[]> {
  const db = publicDb();
  const [cats, skills] = await Promise.all([
    db.from("skill_categories").select("*").eq("is_visible", true).order("display_order"),
    db.from("skills").select("*").eq("is_visible", true).not("category_id", "is", null).order("display_order"),
  ]);
  if (cats.error || skills.error) queryFailed("skills", cats.error ?? skills.error);
  return cats.data.map((c) => ({ ...c, skills: skills.data.filter((s) => s.category_id === c.id) })).filter((c) => c.skills.length > 0);
}
