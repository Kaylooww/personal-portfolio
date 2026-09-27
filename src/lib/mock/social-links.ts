import type { SocialLink } from "@/types";

/**
 * PLACEHOLDER CONTENT — replaced by `social_links` in Phase 14.
 * The owner's real GitHub / LinkedIn / email are not known yet: these URLs are
 * obvious placeholders and MUST be replaced before launch (admin, Phase 13).
 */
const stamp = { created_at: "2026-09-27T00:00:00.000Z", updated_at: "2026-09-27T00:00:00.000Z" };

export const MOCK_SOCIAL_LINKS: SocialLink[] = [
  { id: "l0000000-0000-0000-0000-000000000001", platform: "email", label: "Email", url: "mailto:hello@example.com", display_order: 1, is_visible: true, ...stamp },
  { id: "l0000000-0000-0000-0000-000000000002", platform: "github", label: "GitHub", url: "https://github.com/", display_order: 2, is_visible: true, ...stamp },
  { id: "l0000000-0000-0000-0000-000000000003", platform: "linkedin", label: "LinkedIn", url: "https://www.linkedin.com/", display_order: 3, is_visible: true, ...stamp },
];
