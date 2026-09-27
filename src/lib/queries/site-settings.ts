import "server-only";
import { MOCK_SITE_SETTINGS } from "@/lib/mock/site-settings";
import type { SiteSettings } from "@/types";

/** Site-wide settings (departure board, SEO). Swaps to a Supabase read in Phase 14. */
export async function getSiteSettings(): Promise<SiteSettings> {
  return MOCK_SITE_SETTINGS;
}
