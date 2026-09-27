import "server-only";
import { MOCK_JOURNEY } from "@/lib/mock/journey";
import { visibleInOrder } from "@/lib/utils/order";
import type { JourneyEntry } from "@/types";

/** Visible journey entries, oldest first (display order). Swaps to Supabase in Phase 14. */
export async function getJourneyEntries(): Promise<JourneyEntry[]> {
  return visibleInOrder(MOCK_JOURNEY);
}
