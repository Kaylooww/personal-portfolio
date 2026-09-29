import "server-only";
import type { AboutCard } from "@/types";
import { publicDb, queryFailed } from "./public-db";

/** Visible About cards in display order. */
export async function getAboutCards(): Promise<AboutCard[]> {
  const { data, error } = await publicDb().from("about_cards").select("*").eq("is_visible", true).order("display_order");
  if (error) queryFailed("About cards", error);
  return data;
}
