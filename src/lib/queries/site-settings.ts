import "server-only";
import { cache } from "react";
import { SITE } from "@/lib/constants/site";
import type { SiteSettings } from "@/types";
import { getProfile } from "./profile";
import { publicDb, queryFailed } from "./public-db";

const DEFAULT_SETTINGS: SiteSettings = {
  id: "",
  site_title: SITE.title,
  site_description: SITE.description,
  og_image_url: null,
  departures: [],
  departures_note: null,
  summit_note: null,
  summit_message: null,
  resume_enabled: false,
  updated_at: "",
};

/** Site-wide settings (departure board, Summit text, SEO). */
export const getSiteSettings = cache(async (): Promise<SiteSettings> => {
  const { data, error } = await publicDb().from("site_settings").select("*").limit(1).maybeSingle();
  if (error) queryFailed("site settings", error);
  return data ?? DEFAULT_SETTINGS;
});

/** The résumé link, only when the admin has switched downloads on and uploaded a PDF. */
export async function getResumeUrl(): Promise<string | null> {
  const [settings, profile] = await Promise.all([getSiteSettings(), getProfile()]);
  return settings.resume_enabled && profile.resume_url ? profile.resume_url : null;
}
