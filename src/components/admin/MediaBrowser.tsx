"use client";

import { useState } from "react";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { ContentIcon } from "@/components/ui/ContentIcon";
import { EmptyState } from "@/components/ui/EmptyState";
import { SafeImage } from "@/components/ui/SafeImage";
import { useToast } from "@/components/ui/Toast";
import { UiIcon } from "@/components/ui/UiIcon";
import { deleteMediaFile } from "@/lib/actions/media";
import type { MediaFile } from "@/lib/queries/admin-content";
import { cn } from "@/lib/utils/cn";
import { RowIconButton } from "./RowIconButton";
import { useAdminAction } from "./useAdminAction";

const FOLDERS = ["all", "profile", "resume", "site", "skills", "milestones", "projects", "unused"] as const;
type Folder = (typeof FOLDERS)[number];

function formatBytes(n: number): string {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(0)} KB`;
  return `${(n / 1024 / 1024).toFixed(1)} MB`;
}

/** Browse the media bucket, see where each file is used, copy links, delete unused files. */
export function MediaBrowser({ files, referencesKnown }: { files: MediaFile[]; referencesKnown: boolean }) {
  const toast = useToast();
  const { pending, run } = useAdminAction();
  const [folder, setFolder] = useState<Folder>("all");
  const [toDelete, setToDelete] = useState<MediaFile | null>(null);

  const shown = files.filter((f) => (folder === "all" ? true : folder === "unused" ? !f.usedBy : f.path.startsWith(`${folder}/`)));
  const unused = files.filter((f) => !f.usedBy);
  const total = files.reduce((sum, f) => sum + f.size, 0);

  const copy = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      toast.success("Link copied");
    } catch {
      toast.error("Couldn't copy — select the link manually.");
    }
  };

  return (
    <div className="flex flex-col gap-5">
      <p className="text-sm font-bold text-ink-muted">
        {files.length} {files.length === 1 ? "file" : "files"} · {formatBytes(total)} · {unused.length} unused
        {!referencesKnown && <span className="ml-2 text-danger">(couldn&apos;t check usage — deleting is disabled)</span>}
      </p>

      <div role="group" aria-label="Filter by folder" className="flex flex-wrap gap-1.5">
        {FOLDERS.map((f) => (
          <button
            key={f}
            type="button"
            aria-pressed={folder === f}
            onClick={() => setFolder(f)}
            className={cn(
              "h-9 rounded-pill px-3.5 text-xs font-extrabold uppercase tracking-[0.06em] transition-trail transition-colors",
              folder === f ? "bg-navy-900 text-paper" : "bg-surface-inset text-ink-strong hover:bg-active-soft",
            )}
          >
            {f}
          </button>
        ))}
      </div>

      {shown.length === 0 ? (
        <EmptyState icon="camera" title="Nothing here" message={folder === "unused" ? "Every stored file is in use." : "No files in this folder yet."} />
      ) : (
        <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3" aria-busy={pending}>
          {shown.map((f) => {
            const name = f.path.split("/").pop() ?? f.path;
            const isImage = f.contentType?.startsWith("image/");
            return (
              <li key={f.path} className="surface-paper flex flex-col gap-3 rounded-card p-3">
                <div className="relative aspect-video overflow-hidden rounded-control bg-surface-inset">
                  {isImage ? (
                    <SafeImage src={f.url} alt="" fill sizes="(min-width: 1280px) 22rem, (min-width: 640px) 45vw, 90vw" className="object-contain" fallback={<span className="absolute inset-0 grid place-items-center text-xs font-bold text-danger">Can’t load image</span>} />
                  ) : (
                    <span className="absolute inset-0 grid place-items-center text-ink-subtle">
                      <ContentIcon icon="book" className="size-10" />
                    </span>
                  )}
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-extrabold text-ink" title={f.path}>
                    {name}
                  </p>
                  <p className="truncate text-xs text-ink-subtle">
                    {f.path.split("/")[0]} · {formatBytes(f.size)}
                  </p>
                  <p className={cn("mt-1 truncate text-xs font-bold", f.usedBy ? "text-moss-700 dark:text-moss-100" : "text-warm")}>{f.usedBy ?? "Not used anywhere"}</p>
                </div>
                <div className="mt-auto flex items-center gap-1">
                  <RowIconButton onClick={() => copy(f.url)} aria-label={`Copy link to ${name}`} title="Copy link">
                    <UiIcon name="external" className="size-4" />
                  </RowIconButton>
                  <a href={f.url} target="_blank" rel="noopener noreferrer" className="px-2 text-xs font-extrabold text-link hover:underline">
                    Open<span className="sr-only"> {name} (opens in a new tab)</span>
                  </a>
                  <RowIconButton
                    tone="danger"
                    className="ml-auto"
                    disabled={pending || Boolean(f.usedBy) || !referencesKnown}
                    title={f.usedBy ? "In use — remove it where it's used first" : "Delete file"}
                    onClick={() => setToDelete(f)}
                    aria-label={`Delete ${name}`}
                  >
                    <UiIcon name="trash" className="size-4" />
                  </RowIconButton>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      <ConfirmDialog
        open={toDelete !== null}
        title="Delete this file?"
        message={`${toDelete?.path ?? ""} — this action cannot be undone.`}
        confirmLabel="Delete file"
        pending={pending}
        onCancel={() => setToDelete(null)}
        onConfirm={() => toDelete && run(() => deleteMediaFile(toDelete.path), () => setToDelete(null))}
      />
    </div>
  );
}
