import "server-only";
import { MOCK_ABOUT_CARDS } from "@/lib/mock/about";
import { visibleInOrder } from "@/lib/utils/order";
import type { AboutCard } from "@/types";

/** Visible About cards in display order. Swaps to Supabase in Phase 14. */
export async function getAboutCards(): Promise<AboutCard[]> {
  return visibleInOrder(MOCK_ABOUT_CARDS);
}
