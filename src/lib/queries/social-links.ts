import "server-only";
import { MOCK_SOCIAL_LINKS } from "@/lib/mock/social-links";
import { visibleInOrder } from "@/lib/utils/order";
import type { SocialLink } from "@/types";

/** Visible social links with a non-empty URL (empty links are never rendered). */
export async function getSocialLinks(): Promise<SocialLink[]> {
  return visibleInOrder(MOCK_SOCIAL_LINKS).filter((l) => l.url.trim() !== "");
}
