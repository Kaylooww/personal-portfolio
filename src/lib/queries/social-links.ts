import "server-only";
import type { SocialLink } from "@/types";
import { publicDb, queryFailed } from "./public-db";

/** Visible social links with a non-empty URL (empty links are never rendered). */
export async function getSocialLinks(): Promise<SocialLink[]> {
  const { data, error } = await publicDb().from("social_links").select("*").eq("is_visible", true).order("display_order");
  if (error) queryFailed("social links", error);
  return data.filter((l) => l.url.trim() !== "");
}
