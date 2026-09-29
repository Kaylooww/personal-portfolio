"use client";

import { useId, useRef, useState } from "react";
import { buttonClasses } from "@/components/ui/ButtonLink";
import { UiIcon } from "@/components/ui/UiIcon";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { DOCUMENT_TYPES, MEDIA_BUCKET, buildMediaPath, validateDocumentFile, type MediaFolder } from "@/lib/storage/media";

interface DocumentUploaderProps {
  label: string;
  hint?: string;
  value: string;
  folder: MediaFolder;
  onChange: (url: string) => void;
  onDiscard?: (url: string) => void;
  error?: string | null;
}

/** PDF upload (résumé, certificates) straight to Storage with the admin's session. */
export function DocumentUploader({ label, hint, value, folder, onChange, onDiscard, error }: DocumentUploaderProps) {
  const id = useId();
  const input = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const uploadedHere = useRef(new Set<string>());

  const replace = (next: string) => {
    if (value && uploadedHere.current.has(value)) onDiscard?.(value);
    onChange(next);
  };

  const onFile = async (file: File | undefined) => {
    if (!file) return;
    const invalid = validateDocumentFile(file);
    if (invalid) {
      setLocalError(invalid);
      return;
    }
    setLocalError(null);
    setBusy(true);
    const supabase = createSupabaseBrowserClient();
    const path = buildMediaPath(folder, file);
    const { error: upErr } = await supabase.storage.from(MEDIA_BUCKET).upload(path, file, { contentType: file.type, upsert: false });
    setBusy(false);
    if (input.current) input.current.value = "";
    if (upErr) {
      setLocalError("Upload failed. Please try again.");
      return;
    }
    const url = supabase.storage.from(MEDIA_BUCKET).getPublicUrl(path).data.publicUrl;
    uploadedHere.current.add(url);
    replace(url);
  };

  const shown = localError ?? error;
  const fileName = value ? decodeURIComponent(value.split("/").pop() ?? "").replace(/^[a-z0-9]+-[a-z0-9]+-/, "") : null;

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-extrabold text-navy-900">
        {label}
      </label>
      <input ref={input} id={id} type="file" accept={DOCUMENT_TYPES.join(",")} className="sr-only" disabled={busy} onChange={(e) => onFile(e.target.files?.[0])} />
      <div className="flex flex-wrap items-center gap-2">
        {value ? (
          <a href={value} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 rounded-control bg-paper-shade px-3 py-2 text-sm font-bold text-blue-600 hover:underline">
            <UiIcon name="folder" className="size-4" />
            {fileName}
            <span className="sr-only">(opens in a new tab)</span>
          </a>
        ) : (
          <span className="text-sm text-navy-500">No file</span>
        )}
        <button type="button" onClick={() => input.current?.click()} disabled={busy} className={buttonClasses("secondary", "md", "h-10 px-4 text-xs")}>
          {busy ? "Uploading…" : value ? "Replace PDF" : "Upload PDF"}
        </button>
        {value && (
          <button type="button" onClick={() => replace("")} disabled={busy} className={buttonClasses("ghost", "md", "h-10 px-3 text-xs text-danger-600")}>
            Remove
          </button>
        )}
      </div>
      {hint && <p className="text-sm text-navy-500">{hint}</p>}
      {shown && (
        <p role="alert" className="text-sm font-bold text-danger-600">
          {shown}
        </p>
      )}
    </div>
  );
}
