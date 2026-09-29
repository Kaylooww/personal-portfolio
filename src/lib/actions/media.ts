"use server";

import { requireAdmin } from "@/lib/auth/admin";
import { findMediaReferences } from "@/lib/admin/media-references";
import { revalidatePath } from "next/cache";
import { MEDIA_BUCKET, MEDIA_ROOTS, storagePathFromPublicUrl } from "@/lib/storage/media";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { fail, ok, type ActionResult } from "./result";

/** Deletes a stored file from the Media browser — only when nothing references it. */
export async function deleteMediaFile(path: string): Promise<ActionResult> {
  await requireAdmin("/admin/media");
  if (typeof path !== "string" || !/^[a-z0-9/_.-]+$/i.test(path) || path.includes("..") || !MEDIA_ROOTS.some((r) => path.startsWith(`${r}/`))) {
    return fail("Invalid file.");
  }
  const supabase = await createSupabaseServerClient();
  const url = supabase.storage.from(MEDIA_BUCKET).getPublicUrl(path).data.publicUrl;
  const references = await findMediaReferences(supabase);
  if (references === null) return fail("Couldn't check where this file is used, so it wasn't deleted. Try again.");
  const usedBy = references.get(url);
  if (usedBy) return fail(`This file is in use (${usedBy}). Remove it there first.`);

  const { error } = await supabase.storage.from(MEDIA_BUCKET).remove([path]);
  if (error) {
    console.error("[admin] deleteMediaFile", error);
    return fail("Couldn't delete the file. Please try again.");
  }
  revalidatePath("/admin/media");
  return ok(undefined, "File deleted");
}

/** Folders an editor may clean up after an abandoned upload. */
const DISCARDABLE = ["projects/", "skills/", "profile/", "milestones/", "resume/", "site/"] as const;

/**
 * Removes an uploaded-but-unsaved file (e.g. a replaced image the admin never
 * saved). Refuses if any row still references the URL.
 */
export async function discardUpload(url: string): Promise<ActionResult> {
  await requireAdmin("/admin");
  const path = storagePathFromPublicUrl(url);
  if (!path || !DISCARDABLE.some((f) => path.startsWith(f))) return fail("Invalid file.");

  const supabase = await createSupabaseServerClient();
  const references = await findMediaReferences(supabase);
  if (references === null || references.has(url)) return ok(undefined);

  const { error } = await supabase.storage.from(MEDIA_BUCKET).remove([path]);
  if (error) console.error("[admin] discardUpload", error);
  return ok(undefined);
}
