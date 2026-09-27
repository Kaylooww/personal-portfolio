import "server-only";
import { MOCK_MILESTONE_CATEGORIES, MOCK_MILESTONES } from "@/lib/mock/milestones";
import { visibleInOrder } from "@/lib/utils/order";
import type { Milestone, MilestoneCategory } from "@/types";

/** Visible milestone categories in display order. Swaps to Supabase in Phase 14. */
export async function getMilestoneCategories(): Promise<MilestoneCategory[]> {
  return visibleInOrder(MOCK_MILESTONE_CATEGORIES);
}

/** Visible milestones whose category is visible (uncategorised ones are kept). */
export async function getMilestones(): Promise<Milestone[]> {
  const visibleCategories = new Set((await getMilestoneCategories()).map((c) => c.id));
  return visibleInOrder(MOCK_MILESTONES).filter((m) => m.category_id === null || visibleCategories.has(m.category_id));
}
