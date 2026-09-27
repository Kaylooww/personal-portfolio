import "server-only";
import { MOCK_PROFILE } from "@/lib/mock/profile";
import type { Profile } from "@/types";

/** The single public profile. Swaps to a Supabase read in Phase 14; callers stay unchanged. */
export async function getProfile(): Promise<Profile> {
  return MOCK_PROFILE;
}
