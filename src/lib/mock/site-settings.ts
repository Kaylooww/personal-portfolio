import type { SiteSettings } from "@/types";
import { SITE } from "@/lib/constants/site";

/**
 * PLACEHOLDER CONTENT — replaced by the `site_settings` table in Phase 14.
 * Read it only through `@/lib/queries/site-settings`.
 */
export const MOCK_SITE_SETTINGS: SiteSettings = {
  id: "00000000-0000-0000-0000-000000000002",
  site_title: SITE.title,
  site_description: SITE.description,
  og_image_url: null,
  departures: [
    { destination: "My Portfolio", status: "ready", icon: "laptop" },
    { destination: "Shore", status: "up_next", icon: "palm" },
    { destination: "Bigger Things", status: "planned", icon: "mountain" },
  ],
  departures_note: "Same ideas.\nHigher places.",
  summit_note: "Every project was\nanother step upward.",
  summit_message:
    "Thanks for climbing with me. This is where one expedition ends and the next begins — if you have an idea, a project or an opportunity, I'd love to hear about it.",
  resume_enabled: false,
  updated_at: "2026-09-25T00:00:00.000Z",
};
