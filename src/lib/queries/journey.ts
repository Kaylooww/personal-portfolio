import "server-only";
import type { JourneyEntry } from "@/types";
import { publicDb, queryFailed } from "./public-db";

/** Visible journey entries, oldest first (display order). */
export async function getJourneyEntries(): Promise<JourneyEntry[]> {
  const { data, error } = await publicDb().from("journey_entries").select("*").eq("is_visible", true).order("display_order");
  if (error) queryFailed("the journey", error);
  return data;
}
