/**
 * Media rules shared by the client uploader and server actions. The bucket
 * (supabase/migrations/*_storage.sql) enforces type + size again server-side.
 */
export const MEDIA_BUCKET = "portfolio-media";

export const IMAGE_TYPES = ["image/png", "image/jpeg", "image/webp", "image/avif"] as const;
export const DOCUMENT_TYPES = ["application/pdf"] as const;
export const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
export const MAX_DOCUMENT_BYTES = 10 * 1024 * 1024;

const EXTENSIONS: Record<string, string> = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/webp": "webp",
  "image/avif": "avif",
  "application/pdf": "pdf",
};

export type MediaFolder = `projects/${string}` | "profile" | "skills" | "milestones" | "resume" | "site";

/** Top-level folders the media browser lists. */
export const MEDIA_ROOTS = ["profile", "resume", "site", "skills", "milestones", "projects"] as const;

export function validateDocumentFile(file: { type: string; size: number }): string | null {
  if (!(DOCUMENT_TYPES as readonly string[]).includes(file.type)) return "Use a PDF file.";
  if (file.size > MAX_DOCUMENT_BYTES) return `PDFs must be ${MAX_DOCUMENT_BYTES / 1024 / 1024} MB or smaller.`;
  return null;
}

export function validateImageFile(file: { type: string; size: number }): string | null {
  if (!(IMAGE_TYPES as readonly string[]).includes(file.type)) return "Use a PNG, JPG, WebP or AVIF image.";
  if (file.size > MAX_IMAGE_BYTES) return `Images must be ${MAX_IMAGE_BYTES / 1024 / 1024} MB or smaller.`;
  return null;
}

/** "My Screenshot (1).PNG" → "my-screenshot-1" — safe, readable, collision-proofed by a prefix. */
export function sanitiseFileStem(name: string): string {
  const stem = name.replace(/\.[^.]+$/, "");
  const clean = stem
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
  return clean || "file";
}

export function buildMediaPath(folder: MediaFolder, file: { name: string; type: string }): string {
  const ext = EXTENSIONS[file.type] ?? "bin";
  const unique = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
  return `${folder}/${unique}-${sanitiseFileStem(file.name)}.${ext}`;
}

/**
 * Object path inside our bucket for a public URL we issued, or null for any
 * other URL (external links are never deleted).
 */
export function storagePathFromPublicUrl(url: string | null | undefined): string | null {
  if (!url) return null;
  const marker = `/storage/v1/object/public/${MEDIA_BUCKET}/`;
  const i = url.indexOf(marker);
  if (i === -1) return null;
  const path = decodeURIComponent(url.slice(i + marker.length).split("?")[0] ?? "");
  return path && !path.includes("..") ? path : null;
}
