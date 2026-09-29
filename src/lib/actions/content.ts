"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { deleteById, fieldErrorsFrom, moveRow, nextDisplayOrder, removeStoredFiles, setVisibility, type ServerSupabase } from "@/lib/admin/helpers";
import { requireAdmin } from "@/lib/auth/admin";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import {
  aboutCardFormSchema,
  journeyFormSchema,
  profileFormSchema,
  siteSettingsFormSchema,
  socialLinkFormSchema,
  toAboutCardRow,
  toJourneyRow,
  toProfileRow,
  toSiteSettingsRow,
  toSocialLinkRow,
  type AboutCardFormValues,
  type JourneyFormValues,
  type ProfileFormValues,
  type SiteSettingsFormValues,
  type SocialLinkFormValues,
} from "@/lib/validation/content";
import { fail, fromDbError, ok, type ActionResult } from "./result";

/*
 * Profile, site settings, About cards, Journey entries and social links.
 * Pattern: requireAdmin() → zod → write with the admin's session (RLS) →
 * revalidate every public page (this content appears site-wide).
 */

const idSchema = z.uuid();
const direction = z.enum(["up", "down"]);

function revalidatePublic() {
  revalidatePath("/", "layout");
  revalidatePath("/admin", "layout");
}

const invalid = (error: z.ZodError) => fail("Please fix the highlighted fields.", fieldErrorsFrom(error));

/** Insert-or-update for a single-row table. */
async function saveSingleton(supabase: ServerSupabase, table: "profiles" | "site_settings", row: Record<string, unknown>) {
  const existing = await supabase.from(table).select("id").limit(1).maybeSingle();
  if (existing.error) return { error: existing.error };
  const res = existing.data
    ? await supabase.from(table).update(row as never).eq("id", existing.data.id)
    : await supabase.from(table).insert(row as never);
  return { error: res.error };
}

// ── Profile ─────────────────────────────────────────────────

export async function saveProfile(values: ProfileFormValues): Promise<ActionResult> {
  await requireAdmin("/admin/profile");
  const parsed = profileFormSchema.safeParse(values);
  if (!parsed.success) return invalid(parsed.error);

  const supabase = await createSupabaseServerClient();
  const before = await supabase.from("profiles").select("photo_url, resume_url").limit(1).maybeSingle();
  if (before.error) return fromDbError(before.error);
  const row = toProfileRow(parsed.data);
  const { error } = await saveSingleton(supabase, "profiles", row);
  if (error) return fromDbError(error);

  const replaced = [before.data?.photo_url, before.data?.resume_url].filter((u) => u && u !== row.photo_url && u !== row.resume_url);
  await removeStoredFiles(supabase, replaced);
  revalidatePublic();
  return ok(undefined, "Profile saved");
}

// ── Site settings ───────────────────────────────────────────

export async function saveSiteSettings(values: SiteSettingsFormValues): Promise<ActionResult> {
  await requireAdmin("/admin/settings");
  const parsed = siteSettingsFormSchema.safeParse(values);
  if (!parsed.success) return invalid(parsed.error);

  const supabase = await createSupabaseServerClient();
  const before = await supabase.from("site_settings").select("og_image_url").limit(1).maybeSingle();
  if (before.error) return fromDbError(before.error);
  const row = toSiteSettingsRow(parsed.data);
  const { error } = await saveSingleton(supabase, "site_settings", row);
  if (error) return fromDbError(error);
  if (before.data?.og_image_url && before.data.og_image_url !== row.og_image_url) await removeStoredFiles(supabase, [before.data.og_image_url]);
  revalidatePublic();
  return ok(undefined, "Settings saved");
}

// ── Generic list operations (about / journey / social) ──────

type ListTable = "about_cards" | "journey_entries" | "social_links";
const LIST_TABLE = z.enum(["about_cards", "journey_entries", "social_links"]);
const LIST_PATH: Record<ListTable, string> = { about_cards: "/admin/about", journey_entries: "/admin/journey", social_links: "/admin/settings" };

export async function setListItemVisibility(table: ListTable, itemId: string, visible: boolean): Promise<ActionResult> {
  const t = LIST_TABLE.safeParse(table);
  if (!t.success) return fail("Invalid request.");
  await requireAdmin(LIST_PATH[t.data]);
  const id = idSchema.safeParse(itemId);
  if (!id.success || typeof visible !== "boolean") return fail("Invalid request.");
  const supabase = await createSupabaseServerClient();
  const { error, found } = await setVisibility(supabase, t.data, id.data, visible);
  if (error) return fromDbError(error);
  if (!found) return fail("That item no longer exists.");
  revalidatePublic();
  return ok(undefined, visible ? "Shown on the site" : "Hidden from the site");
}

export async function moveListItem(table: ListTable, itemId: string, dir: "up" | "down"): Promise<ActionResult> {
  const t = LIST_TABLE.safeParse(table);
  if (!t.success) return fail("Invalid request.");
  await requireAdmin(LIST_PATH[t.data]);
  const id = idSchema.safeParse(itemId);
  const d = direction.safeParse(dir);
  if (!id.success || !d.success) return fail("Invalid request.");
  const supabase = await createSupabaseServerClient();
  const err = await moveRow(supabase, t.data, id.data, d.data);
  if (err) return fromDbError(err);
  revalidatePublic();
  return ok(undefined, "Order updated");
}

export async function deleteListItem(table: ListTable, itemId: string): Promise<ActionResult> {
  const t = LIST_TABLE.safeParse(table);
  if (!t.success) return fail("Invalid request.");
  await requireAdmin(LIST_PATH[t.data]);
  const id = idSchema.safeParse(itemId);
  if (!id.success) return fail("Invalid request.");
  const supabase = await createSupabaseServerClient();
  const { error, found } = await deleteById(supabase, t.data, id.data);
  if (error) return fromDbError(error);
  if (!found) return fail("That item no longer exists.");
  revalidatePublic();
  return ok(undefined, "Deleted");
}

async function saveListItem(table: ListTable, id: string | undefined, row: Record<string, unknown>, labels: { created: string; saved: string }) {
  const supabase = await createSupabaseServerClient();
  if (id !== undefined) {
    const parsedId = idSchema.safeParse(id);
    if (!parsedId.success) return fail("Unknown item.");
    const { data, error } = await supabase.from(table).update(row as never).eq("id", parsedId.data).select("id");
    if (error) return fromDbError(error);
    if (!data?.length) return fail("That item no longer exists.");
    revalidatePublic();
    return ok({ id: parsedId.data }, labels.saved);
  }
  const next = await nextDisplayOrder(supabase, table);
  if (next.error) return fromDbError(next.error);
  const { data, error } = await supabase
    .from(table)
    .insert({ ...row, display_order: next.order } as never)
    .select("id")
    .single();
  if (error) return fromDbError(error);
  revalidatePublic();
  return ok({ id: data.id }, labels.created);
}

// ── About cards ─────────────────────────────────────────────

export async function saveAboutCard(input: { id?: string; values: AboutCardFormValues }): Promise<ActionResult<{ id: string }>> {
  await requireAdmin("/admin/about");
  const parsed = aboutCardFormSchema.safeParse(input.values);
  if (!parsed.success) return invalid(parsed.error);
  return saveListItem("about_cards", input.id, toAboutCardRow(parsed.data), { created: "Card added", saved: "Card saved" });
}

// ── Journey ─────────────────────────────────────────────────

export async function saveJourneyEntry(input: { id?: string; values: JourneyFormValues }): Promise<ActionResult<{ id: string }>> {
  await requireAdmin("/admin/journey");
  const parsed = journeyFormSchema.safeParse(input.values);
  if (!parsed.success) return invalid(parsed.error);
  return saveListItem("journey_entries", input.id, toJourneyRow(parsed.data), { created: "Checkpoint added", saved: "Checkpoint saved" });
}

// ── Social links ────────────────────────────────────────────

export async function saveSocialLink(input: { id?: string; values: SocialLinkFormValues }): Promise<ActionResult<{ id: string }>> {
  await requireAdmin("/admin/settings");
  const parsed = socialLinkFormSchema.safeParse(input.values);
  if (!parsed.success) return invalid(parsed.error);
  return saveListItem("social_links", input.id, toSocialLinkRow(parsed.data), { created: "Link added", saved: "Link saved" });
}
