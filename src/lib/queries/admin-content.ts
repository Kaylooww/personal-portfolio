import "server-only";
import { findMediaReferences } from "@/lib/admin/media-references";
import { checkMilestoneDocumentFields } from "@/lib/admin/milestone-schema";
import { MEDIA_BUCKET, MEDIA_ROOTS } from "@/lib/storage/media";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { AboutCard, JourneyEntry, Milestone, MilestoneCategory, Profile, SiteSettings, SocialLink } from "@/types";

/* Admin reads for Phase 13 sections — the admin's own session, so RLS returns hidden rows too. */

function fail(where: string, error: unknown): never {
  console.error(`[admin] ${where}`, error);
  throw new Error(`Could not load ${where}.`);
}

export async function getAdminProfile(): Promise<Profile | null> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.from("profiles").select("*").limit(1).maybeSingle();
  if (error) fail("the profile", error);
  return data;
}

export async function getAdminSiteSettings(): Promise<SiteSettings | null> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.from("site_settings").select("*").limit(1).maybeSingle();
  if (error) fail("site settings", error);
  return data;
}

export async function listAdminAboutCards(): Promise<AboutCard[]> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.from("about_cards").select("*").order("display_order").order("created_at");
  if (error) fail("About cards", error);
  return data;
}

export async function listAdminJourney(): Promise<JourneyEntry[]> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.from("journey_entries").select("*").order("display_order").order("created_at");
  if (error) fail("journey entries", error);
  return data;
}

export async function listAdminSocialLinks(): Promise<SocialLink[]> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.from("social_links").select("*").order("display_order").order("created_at");
  if (error) fail("social links", error);
  return data;
}

export type AdminMilestoneCategory = MilestoneCategory & { milestoneCount: number };

export async function hasMilestoneDocumentFields(): Promise<boolean> {
  const supabase = await createSupabaseServerClient();
  const status = await checkMilestoneDocumentFields(supabase);
  if (status.error) fail("the milestone schema", status.error);
  return status.available;
}

export async function listAdminMilestoneCategories(): Promise<AdminMilestoneCategory[]> {
  const supabase = await createSupabaseServerClient();
  const [cats, ms] = await Promise.all([
    supabase.from("milestone_categories").select("*").order("display_order").order("created_at"),
    supabase.from("milestones").select("category_id"),
  ]);
  if (cats.error || ms.error) fail("milestone categories", cats.error ?? ms.error);
  return cats.data.map((c) => ({ ...c, milestoneCount: ms.data.filter((m) => m.category_id === c.id).length }));
}

export interface AdminMilestoneFilters {
  q?: string;
  category?: string;
}

export function parseMilestoneFilters(params: Record<string, string | string[] | undefined>): AdminMilestoneFilters {
  const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v)?.trim() || undefined;
  const category = one(params.category);
  return {
    q: one(params.q)?.slice(0, 100),
    category: category === "none" || /^[0-9a-f-]{36}$/i.test(category ?? "") ? category : undefined,
  };
}

export async function listAdminMilestones(filters: AdminMilestoneFilters): Promise<Milestone[]> {
  const supabase = await createSupabaseServerClient();
  let query = supabase.from("milestones").select("*")
    .order("featured", { ascending: false })
    .order("date", { ascending: false, nullsFirst: false })
    .order("display_order").order("id");
  if (filters.category === "none") query = query.is("category_id", null);
  else if (filters.category) query = query.eq("category_id", filters.category);
  const q = filters.q?.replace(/[,()*%_\\"'.:]/g, " ").replace(/\s+/g, " ").trim();
  if (q) query = query.or(`title.ilike.%${q}%,issuer.ilike.%${q}%,organization.ilike.%${q}%`);
  const { data, error } = await query;
  if (error) fail("milestones", error);
  return data;
}

export async function getAdminMilestone(id: string): Promise<Milestone | null> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.from("milestones").select("*").eq("id", id).maybeSingle();
  if (error) fail("the milestone", error);
  return data;
}

// ── Media ───────────────────────────────────────────────────

export interface MediaFile {
  path: string;
  url: string;
  size: number;
  contentType: string | null;
  updatedAt: string | null;
  /** Where the file is used, or null if nothing references it. */
  usedBy: string | null;
}

/** Every object in the media bucket (folders walked one level under projects/), with usage. */
export async function listMediaFiles(): Promise<{ files: MediaFile[]; referencesKnown: boolean }> {
  const supabase = await createSupabaseServerClient();
  const bucket = supabase.storage.from(MEDIA_BUCKET);

  const listFolder = async (prefix: string) => {
    const { data, error } = await bucket.list(prefix, { limit: 1000, sortBy: { column: "name", order: "asc" } });
    if (error) fail("media files", error);
    return data;
  };

  const entries: { path: string; meta: { size?: number; mimetype?: string } | null; updatedAt: string | null }[] = [];
  for (const root of MEDIA_ROOTS) {
    for (const item of await listFolder(root)) {
      if (item.id === null) {
        // A sub-folder (projects/<id>/): list one level down.
        for (const inner of await listFolder(`${root}/${item.name}`)) {
          if (inner.id !== null) entries.push({ path: `${root}/${item.name}/${inner.name}`, meta: inner.metadata as never, updatedAt: inner.updated_at ?? null });
        }
      } else if (!item.name.startsWith(".")) {
        entries.push({ path: `${root}/${item.name}`, meta: item.metadata as never, updatedAt: item.updated_at ?? null });
      }
    }
  }

  const refs = await findMediaReferences(supabase);
  const files = entries.map((e) => {
    const url = bucket.getPublicUrl(e.path).data.publicUrl;
    return {
      path: e.path,
      url,
      size: e.meta?.size ?? 0,
      contentType: e.meta?.mimetype ?? null,
      updatedAt: e.updatedAt,
      usedBy: refs?.get(url) ?? null,
    };
  });
  return { files, referencesKnown: refs !== null };
}
