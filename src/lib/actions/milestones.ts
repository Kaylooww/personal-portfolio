"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { deleteById, fieldErrorsFrom, moveRow, nextDisplayOrder, removeStoredFiles, setVisibility } from "@/lib/admin/helpers";
import { checkMilestoneDocumentFields } from "@/lib/admin/milestone-schema";
import { requireAdmin } from "@/lib/auth/admin";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import {
  milestoneCategoryFormSchema,
  milestoneFormSchema,
  toMilestoneCategoryRow,
  toMilestoneRow,
  type MilestoneCategoryFormValues,
  type MilestoneFormValues,
} from "@/lib/validation/content";
import { fail, fromDbError, ok, type ActionResult } from "./result";

/* Milestones + milestone categories. Same pattern as skills. */

const idSchema = z.uuid();
const direction = z.enum(["up", "down"]);

function revalidateMilestones() {
  revalidatePath("/admin", "layout");
  revalidatePath("/milestones");
}

// ── Milestones ──────────────────────────────────────────────

export async function saveMilestone(input: { id?: string; values: MilestoneFormValues }): Promise<ActionResult<{ id: string }>> {
  await requireAdmin("/admin/milestones");
  const parsed = milestoneFormSchema.safeParse(input.values);
  if (!parsed.success) return fail("Please fix the highlighted fields.", fieldErrorsFrom(parsed.error));
  const supabase = await createSupabaseServerClient();
  const row = toMilestoneRow(parsed.data);
  const schema = await checkMilestoneDocumentFields(supabase);
  if (schema.error) return fromDbError(schema.error);
  if (!schema.available && (row.date_display !== "month" || row.pdf_url)) {
    return fail("Date display choices and PDF uploads need migration 20260930000004_milestone_documents_dates.sql in Supabase SQL Editor. Your changes were not saved.");
  }
  const legacyRow = {
    title: row.title,
    category_id: row.category_id,
    issuer: row.issuer,
    organization: row.organization,
    date: row.date,
    description: row.description,
    badge_icon: row.badge_icon,
    image_url: row.image_url,
    certificate_url: row.certificate_url,
    external_url: row.external_url,
    featured: row.featured,
    is_visible: row.is_visible,
  };
  const saveRow = schema.available ? row : legacyRow;

  if (input.id !== undefined) {
    const id = idSchema.safeParse(input.id);
    if (!id.success) return fail("Unknown milestone.");
    const before = schema.available
      ? await supabase.from("milestones").select("image_url, pdf_url").eq("id", id.data).maybeSingle()
      : await supabase.from("milestones").select("image_url").eq("id", id.data).maybeSingle();
    if (before.error) return fromDbError(before.error);
    if (!before.data) return fail("That milestone no longer exists.");
    const upd = await supabase.from("milestones").update(saveRow).eq("id", id.data);
    if (upd.error) return fromDbError(upd.error);
    if (before.data.image_url && before.data.image_url !== row.image_url) await removeStoredFiles(supabase, [before.data.image_url]);
    const oldPdf = "pdf_url" in before.data && typeof before.data.pdf_url === "string" ? before.data.pdf_url : null;
    if (oldPdf && oldPdf !== row.pdf_url) await removeStoredFiles(supabase, [oldPdf]);
    revalidateMilestones();
    return ok({ id: id.data }, "Milestone saved");
  }

  const next = await nextDisplayOrder(supabase, "milestones");
  if (next.error) return fromDbError(next.error);
  const ins = await supabase
    .from("milestones")
    .insert({ ...saveRow, display_order: next.order })
    .select("id")
    .single();
  if (ins.error) return fromDbError(ins.error);
  revalidateMilestones();
  return ok({ id: ins.data.id }, "Milestone added");
}

export async function setMilestoneFlag(milestoneId: string, flag: "featured" | "is_visible", value: boolean): Promise<ActionResult> {
  await requireAdmin("/admin/milestones");
  const id = idSchema.safeParse(milestoneId);
  const f = z.enum(["featured", "is_visible"]).safeParse(flag);
  if (!id.success || !f.success || typeof value !== "boolean") return fail("Invalid request.");
  const supabase = await createSupabaseServerClient();
  const patch = f.data === "featured" ? { featured: value } : { is_visible: value };
  const { data, error } = await supabase.from("milestones").update(patch).eq("id", id.data).select("id");
  if (error) return fromDbError(error);
  if (!data.length) return fail("That milestone no longer exists.");
  revalidateMilestones();
  const message = f.data === "featured" ? (value ? "Marked as featured" : "Removed from featured") : value ? "Milestone shown" : "Milestone hidden";
  return ok(undefined, message);
}

export async function deleteMilestone(milestoneId: string): Promise<ActionResult> {
  await requireAdmin("/admin/milestones");
  const id = idSchema.safeParse(milestoneId);
  if (!id.success) return fail("Invalid request.");
  const supabase = await createSupabaseServerClient();
  const schema = await checkMilestoneDocumentFields(supabase);
  if (schema.error) return fromDbError(schema.error);
  const { data, error } = schema.available
    ? await supabase.from("milestones").delete().eq("id", id.data).select("title, image_url, pdf_url").maybeSingle()
    : await supabase.from("milestones").delete().eq("id", id.data).select("title, image_url").maybeSingle();
  if (error) return fromDbError(error);
  if (!data) return fail("That milestone no longer exists.");
  const oldPdf = "pdf_url" in data && typeof data.pdf_url === "string" ? data.pdf_url : null;
  await removeStoredFiles(supabase, [data.image_url, oldPdf]);
  revalidateMilestones();
  return ok(undefined, `Deleted "${data.title}"`);
}

// ── Categories ──────────────────────────────────────────────

export async function saveMilestoneCategory(input: { id?: string; values: MilestoneCategoryFormValues }): Promise<ActionResult<{ id: string }>> {
  await requireAdmin("/admin/milestones/categories");
  const parsed = milestoneCategoryFormSchema.safeParse(input.values);
  if (!parsed.success) return fail("Please fix the highlighted fields.", fieldErrorsFrom(parsed.error));
  const supabase = await createSupabaseServerClient();
  const row = toMilestoneCategoryRow(parsed.data);

  if (input.id !== undefined) {
    const id = idSchema.safeParse(input.id);
    if (!id.success) return fail("Unknown category.");
    const { data, error } = await supabase.from("milestone_categories").update(row).eq("id", id.data).select("id");
    if (error) return fromDbError(error, "slug");
    if (!data.length) return fail("That category no longer exists.");
    revalidateMilestones();
    return ok({ id: id.data }, "Category saved");
  }
  const next = await nextDisplayOrder(supabase, "milestone_categories");
  if (next.error) return fromDbError(next.error);
  const ins = await supabase
    .from("milestone_categories")
    .insert({ ...row, display_order: next.order })
    .select("id")
    .single();
  if (ins.error) return fromDbError(ins.error, "slug");
  revalidateMilestones();
  return ok({ id: ins.data.id }, "Category added");
}

export async function setMilestoneCategoryVisibility(categoryId: string, visible: boolean): Promise<ActionResult> {
  await requireAdmin("/admin/milestones/categories");
  const id = idSchema.safeParse(categoryId);
  if (!id.success || typeof visible !== "boolean") return fail("Invalid request.");
  const supabase = await createSupabaseServerClient();
  const { error, found } = await setVisibility(supabase, "milestone_categories", id.data, visible);
  if (error) return fromDbError(error);
  if (!found) return fail("That category no longer exists.");
  revalidateMilestones();
  return ok(undefined, visible ? "Category shown" : "Category hidden");
}

export async function moveMilestoneCategory(categoryId: string, dir: "up" | "down"): Promise<ActionResult> {
  await requireAdmin("/admin/milestones/categories");
  const id = idSchema.safeParse(categoryId);
  const d = direction.safeParse(dir);
  if (!id.success || !d.success) return fail("Invalid request.");
  const supabase = await createSupabaseServerClient();
  const err = await moveRow(supabase, "milestone_categories", id.data, d.data);
  if (err) return fromDbError(err);
  revalidateMilestones();
  return ok(undefined, "Order updated");
}

/** Milestones in a deleted category stay, uncategorised (FK is ON DELETE SET NULL). */
export async function deleteMilestoneCategory(categoryId: string): Promise<ActionResult> {
  await requireAdmin("/admin/milestones/categories");
  const id = idSchema.safeParse(categoryId);
  if (!id.success) return fail("Invalid request.");
  const supabase = await createSupabaseServerClient();
  const { error, found } = await deleteById(supabase, "milestone_categories", id.data);
  if (error) return fromDbError(error);
  if (!found) return fail("That category no longer exists.");
  revalidateMilestones();
  return ok(undefined, "Category deleted");
}
