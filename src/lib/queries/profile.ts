import "server-only";
import { cache } from "react";
import { SITE } from "@/lib/constants/site";
import type { Profile } from "@/types";
import { publicDb, queryFailed } from "./public-db";

/** Used only if the profile row is missing, so pages still render something sensible. */
const EMPTY_PROFILE: Profile = {
  id: "",
  full_name: SITE.name,
  display_first: SITE.name,
  display_last: "",
  headline_roles: [],
  tagline: "",
  intro: "",
  bio: "",
  photo_url: null,
  location: null,
  resume_url: null,
  email: null,
  created_at: "",
  updated_at: "",
};

/** The single public profile (cached per request, so layouts and pages share one read). */
export const getProfile = cache(async (): Promise<Profile> => {
  const { data, error } = await publicDb().from("profiles").select("*").limit(1).maybeSingle();
  if (error) queryFailed("the profile", error);
  return data ?? EMPTY_PROFILE;
});
