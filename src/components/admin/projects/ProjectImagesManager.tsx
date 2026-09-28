"use client";

import Image from "next/image";
import { useId, useRef, useState, useTransition } from "react";
import { uploadImage } from "@/components/forms/ImageUploader";
import { buttonClasses } from "@/components/ui/ButtonLink";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { useToast } from "@/components/ui/Toast";
import { UiIcon } from "@/components/ui/UiIcon";
import { addProjectImage, deleteProjectImage, discardUpload, moveProjectImage, updateProjectImage } from "@/lib/actions/projects";
import { IMAGE_TYPES } from "@/lib/storage/media";
import type { ProjectImage } from "@/types";

interface ProjectImagesManagerProps {
  projectId: string;
  projectTitle: string;
  images: ProjectImage[];
}

/** Screenshot gallery for the project detail page: upload many, describe, reorder, delete. */
export function ProjectImagesManager({ projectId, projectTitle, images }: ProjectImagesManagerProps) {
  const toast = useToast();
  const inputRef = useRef<HTMLInputElement>(null);
  const inputId = useId();
  const [uploading, setUploading] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const [toDelete, setToDelete] = useState<ProjectImage | null>(null);

  const onFiles = async (files: FileList | null) => {
    if (!files?.length) return;
    const list = [...files];
    for (const [i, file] of list.entries()) {
      setUploading(`Uploading ${i + 1} of ${list.length}…`);
      const up = await uploadImage(file, `projects/${projectId}`);
      if ("error" in up) {
        toast.error(`${file.name}: ${up.error}`);
        continue;
      }
      const saved = await addProjectImage(projectId, { url: up.url, alt: `${projectTitle} screenshot`, caption: "" });
      if (!saved.ok) {
        toast.error(saved.error);
        void discardUpload(up.url);
      }
    }
    setUploading(null);
    if (inputRef.current) inputRef.current.value = "";
    toast.success(list.length === 1 ? "Screenshot added" : "Screenshots added");
  };

  const run = (fn: () => ReturnType<typeof moveProjectImage>, after?: () => void) =>
    startTransition(async () => {
      const r = await fn();
      if (r.ok) {
        if (r.message) toast.success(r.message);
        after?.();
      } else toast.error(r.error);
    });

  return (
    <section className="surface-paper flex flex-col gap-4 rounded-card p-5 sm:p-6" aria-labelledby={`${inputId}-title`} aria-busy={pending || Boolean(uploading)}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 id={`${inputId}-title`} className="font-display-heavy text-lg uppercase text-navy-900">
            Screenshots
          </h2>
          <p className="text-sm text-navy-500">Shown as a gallery on the project page. Describe each one for screen readers.</p>
        </div>
        <input ref={inputRef} id={inputId} type="file" multiple accept={IMAGE_TYPES.join(",")} className="sr-only" onChange={(e) => onFiles(e.target.files)} disabled={Boolean(uploading)} />
        <label htmlFor={inputId} className={buttonClasses("secondary", "md", "cursor-pointer")}>
          <UiIcon name="folder" className="size-4" />
          {uploading ?? "Add screenshots"}
        </label>
      </div>

      {images.length === 0 ? (
        <p className="rounded-control bg-paper-shade/60 p-4 text-sm text-navy-700">No screenshots yet.</p>
      ) : (
        <ol aria-label="Screenshots" className="grid gap-4 md:grid-cols-2">
          {images.map((img, i) => (
            <ImageRow
              key={img.id}
              image={img}
              index={i}
              total={images.length}
              busy={pending}
              onMove={(dir) => run(() => moveProjectImage(img.id, dir))}
              onSave={(alt, caption) => run(() => updateProjectImage(img.id, { alt, caption }))}
              onDelete={() => setToDelete(img)}
            />
          ))}
        </ol>
      )}

      <ConfirmDialog
        open={toDelete !== null}
        title="Delete this screenshot?"
        message="This action cannot be undone."
        confirmLabel="Delete screenshot"
        pending={pending}
        onCancel={() => setToDelete(null)}
        onConfirm={() => toDelete && run(() => deleteProjectImage(toDelete.id), () => setToDelete(null))}
      />
    </section>
  );
}

interface ImageRowProps {
  image: ProjectImage;
  index: number;
  total: number;
  busy: boolean;
  onMove: (dir: "up" | "down") => void;
  onSave: (alt: string, caption: string) => void;
  onDelete: () => void;
}

function ImageRow({ image, index, total, busy, onMove, onSave, onDelete }: ImageRowProps) {
  const [alt, setAlt] = useState(image.alt);
  const [caption, setCaption] = useState(image.caption ?? "");
  const dirty = alt !== image.alt || caption !== (image.caption ?? "");
  const altId = useId();
  const capId = useId();

  return (
    <li className="flex flex-col gap-3 rounded-control border border-paper-edge bg-white/60 p-3">
      <div className="relative aspect-video overflow-hidden rounded-tag bg-paper-shade">
        <Image src={image.url} alt="" fill sizes="(min-width: 768px) 30vw, 90vw" className="object-cover" />
        <span className="absolute left-2 top-2 rounded-tag bg-navy-900/80 px-2 py-0.5 text-xs font-extrabold text-paper">{index + 1}</span>
      </div>
      <label htmlFor={altId} className="text-xs font-extrabold text-navy-900">
        Alt text
      </label>
      <input id={altId} value={alt} onChange={(e) => setAlt(e.target.value)} maxLength={200} className="-mt-2 h-10 rounded-control border border-paper-edge bg-white px-3 text-sm" />
      <label htmlFor={capId} className="text-xs font-extrabold text-navy-900">
        Caption (optional)
      </label>
      <input id={capId} value={caption} onChange={(e) => setCaption(e.target.value)} maxLength={300} className="-mt-2 h-10 rounded-control border border-paper-edge bg-white px-3 text-sm" />
      <div className="flex flex-wrap items-center gap-1">
        <button type="button" disabled={busy || index === 0} onClick={() => onMove("up")} aria-label="Move earlier" className="grid size-9 place-items-center rounded-control hover:bg-blue-50 disabled:opacity-30">
          <UiIcon name="arrow-left" className="size-4" />
        </button>
        <button type="button" disabled={busy || index === total - 1} onClick={() => onMove("down")} aria-label="Move later" className="grid size-9 place-items-center rounded-control hover:bg-blue-50 disabled:opacity-30">
          <UiIcon name="arrow-right" className="size-4" />
        </button>
        <button type="button" disabled={busy || !dirty} onClick={() => onSave(alt, caption)} className={buttonClasses("secondary", "md", "ml-auto h-9 px-3 text-xs")}>
          Save details
        </button>
        <button type="button" disabled={busy} onClick={onDelete} aria-label="Delete screenshot" className="grid size-9 place-items-center rounded-control text-navy-700 hover:bg-danger-100 hover:text-danger-600">
          <UiIcon name="trash" className="size-4" />
        </button>
      </div>
    </li>
  );
}
