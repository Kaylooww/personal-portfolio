"use client";

import Image from "next/image";
import { useId, useRef, useState } from "react";
import { buttonClasses } from "@/components/ui/ButtonLink";
import { UiIcon } from "@/components/ui/UiIcon";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { IMAGE_TYPES, MEDIA_BUCKET, buildMediaPath, validateImageFile, type MediaFolder } from "@/lib/storage/media";
import { cn } from "@/lib/utils/cn";

/**
 * Uploads straight from the browser to Supabase Storage with the admin's own
 * session (storage RLS allows only the admin to write), then hands back the
 * public URL. Keeps large files off the Server Action body limit.
 */
export async function uploadImage(file: File, folder: MediaFolder): Promise<{ url: string } | { error: string }> {
  const invalid = validateImageFile(file);
  if (invalid) return { error: invalid };
  const supabase = createSupabaseBrowserClient();
  const path = buildMediaPath(folder, file);
  const { error } = await supabase.storage.from(MEDIA_BUCKET).upload(path, file, {
    contentType: file.type,
    cacheControl: "31536000",
    upsert: false,
  });
  if (error) return { error: "Upload failed. Check the file and try again." };
  return { url: supabase.storage.from(MEDIA_BUCKET).getPublicUrl(path).data.publicUrl };
}

interface ImageUploaderProps {
  label: string;
  hint?: string;
  value: string;
  folder: MediaFolder;
  onChange: (url: string) => void;
  /** Called with a URL this component uploaded but the user then replaced or removed. */
  onDiscard?: (url: string) => void;
  error?: string | null;
  aspect?: "video" | "square" | "photo";
}

const ASPECT = { video: "aspect-video", square: "aspect-square", photo: "aspect-[4/3]" } as const;

export function ImageUploader({ label, hint, value, folder, onChange, onDiscard, error, aspect = "photo" }: ImageUploaderProps) {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const uploadedHere = useRef(new Set<string>());

  const replace = (next: string) => {
    if (value && uploadedHere.current.has(value)) onDiscard?.(value);
    onChange(next);
  };

  const onFile = async (file: File | undefined) => {
    if (!file) return;
    setLocalError(null);
    setUploading(true);
    const result = await uploadImage(file, folder);
    setUploading(false);
    if (inputRef.current) inputRef.current.value = "";
    if ("error" in result) {
      setLocalError(result.error);
      return;
    }
    uploadedHere.current.add(result.url);
    replace(result.url);
  };

  const shownError = localError ?? error;

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={inputId} className="text-sm font-extrabold text-navy-900">
        {label}
      </label>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
        <div className={cn("relative w-full overflow-hidden rounded-control border border-paper-edge bg-paper-shade sm:w-56", ASPECT[aspect])}>
          {value ? (
            <Image src={value} alt="" fill sizes="14rem" className="object-cover" />
          ) : (
            <span className="absolute inset-0 grid place-items-center text-sm font-bold text-navy-500">No image</span>
          )}
          {uploading && <span className="absolute inset-0 grid place-items-center bg-paper/80 text-sm font-extrabold text-navy-900">Uploading…</span>}
        </div>
        <div className="flex flex-col gap-2">
          <input
            ref={inputRef}
            id={inputId}
            type="file"
            accept={IMAGE_TYPES.join(",")}
            className="sr-only"
            disabled={uploading}
            onChange={(e) => onFile(e.target.files?.[0])}
          />
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={() => inputRef.current?.click()} disabled={uploading} className={buttonClasses("secondary", "md", "h-10 px-4 text-xs")}>
              <UiIcon name="folder" className="size-4" />
              {value ? "Replace" : "Upload"}
            </button>
            {value && (
              <button type="button" onClick={() => replace("")} disabled={uploading} className={buttonClasses("ghost", "md", "h-10 px-3 text-xs text-danger-600")}>
                Remove
              </button>
            )}
          </div>
          {hint && <p className="text-sm text-navy-500">{hint}</p>}
          {shownError && (
            <p role="alert" className="text-sm font-bold text-danger-600">
              {shownError}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
