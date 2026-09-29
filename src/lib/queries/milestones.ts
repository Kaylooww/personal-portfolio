import "server-only";
import type { Milestone, MilestoneCategory } from "@/types";
import { publicDb, queryFailed } from "./public-db";

/** Visible milestone categories in display order. */
export async function getMilestoneCategories(): Promise<MilestoneCategory[]> {
  const { data, error } = await publicDb().from("milestone_categories").select("*").eq("is_visible", true).order("display_order");
  if (error) queryFailed("milestone categories", error);
  return data;
}

/** Visible milestones whose category is visible (uncategorised ones are kept). */
export async function getMilestones(): Promise<Milestone[]> {
  const [categories, milestones] = await Promise.all([
    getMilestoneCategories(),
    publicDb().from("milestones").select("*").eq("is_visible", true).order("display_order"),
  ]);
  if (milestones.error) queryFailed("milestones", milestones.error);
  const visible = new Set(categories.map((c) => c.id));
  return milestones.data.filter((m) => m.category_id === null || visible.has(m.category_id));
}
