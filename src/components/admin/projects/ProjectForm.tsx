"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { FormSection } from "@/components/admin/FormSection";
import { CheckboxField } from "@/components/forms/CheckboxField";
import { ImageUploader } from "@/components/forms/ImageUploader";
import { SelectField } from "@/components/forms/SelectField";
import { TextAreaField } from "@/components/forms/TextAreaField";
import { TextField } from "@/components/forms/TextField";
import { buttonClasses } from "@/components/ui/ButtonLink";
import { useToast } from "@/components/ui/Toast";
import { discardUpload } from "@/lib/actions/media";
import { saveProject } from "@/lib/actions/projects";
import { PROJECT_STATUS_LABEL, PROJECT_STATUSES } from "@/lib/constants/status";
import type { SkillOption } from "@/lib/queries/admin-projects";
import { projectFormSchema, slugify, type ProjectFormValues } from "@/lib/validation/project";
import type { ContentState } from "@/types";
import { ContentStatePill } from "../ContentStatePill";
import { TechnologyPicker } from "./TechnologyPicker";

interface ProjectFormProps {
  projectId?: string;
  defaults: ProjectFormValues;
  skillOptions: SkillOption[];
  /** Folder for uploads: the project's own id, or a scratch folder for new ones. */
  uploadFolder: `projects/${string}`;
}

const STATUS_OPTIONS = PROJECT_STATUSES.map((s) => ({ value: s, label: PROJECT_STATUS_LABEL[s] }));

export function ProjectForm({ projectId, defaults, skillOptions, uploadFolder }: ProjectFormProps) {
  const router = useRouter();
  const toast = useToast();
  const [pending, startTransition] = useTransition();
  const [formError, setFormError] = useState<string | null>(null);
  // Auto-fill the slug from the title until the admin edits the slug by hand (new projects only).
  const [slugTouched, setSlugTouched] = useState(Boolean(projectId));

  const {
    register,
    control,
    handleSubmit,
    setValue,
    setError,
    formState: { errors, isDirty },
  } = useForm<ProjectFormValues>({ resolver: zodResolver(projectFormSchema), defaultValues: defaults, mode: "onTouched" });

  const summary = useWatch({ control, name: "short_description" });
  const slug = useWatch({ control, name: "slug" });
  const currentState = defaults.content_state as ContentState;

  const submit = (intent: ContentState) =>
    handleSubmit((values) => {
      setFormError(null);
      startTransition(async () => {
        const result = await saveProject({ id: projectId, values: { ...values, content_state: intent } });
        if (!result.ok) {
          setFormError(result.error);
          for (const [field, message] of Object.entries(result.fieldErrors ?? {})) {
            setError(field as keyof ProjectFormValues, { message });
          }
          toast.error(result.error);
          return;
        }
        toast.success(result.message ?? "Saved");
        if (!projectId) router.push(`/admin/projects/${result.data.id}/edit`);
        else router.refresh();
      });
    }, () => setFormError("Please fix the highlighted fields."))();

  const titleField = register("title", {
    onChange: (e: { target: { value: string } }) => {
      if (!slugTouched) setValue("slug", slugify(e.target.value), { shouldValidate: true });
    },
  });
  const slugField = register("slug", { onChange: () => setSlugTouched(true) });

  return (
    <form onSubmit={(e) => e.preventDefault()} noValidate className="flex flex-col gap-6">
      <FormSection title="Basics">
        <TextField label="Title" {...titleField} error={errors.title?.message} autoComplete="off" />
        <TextField
          label="URL slug"
          {...slugField}
          error={errors.slug?.message}
          hint={`Public address: /projects/${slug || "your-slug"} — lowercase letters, numbers and dashes.`}
          autoComplete="off"
        />
        <TextAreaField
          label="Short description"
          rows={2}
          {...register("short_description")}
          error={errors.short_description?.message}
          hint={`${summary?.length ?? 0}/300 — shown on the project card.`}
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <SelectField label="Expedition status" options={STATUS_OPTIONS} {...register("status")} error={errors.status?.message} />
          <TextField label="Your role" placeholder="e.g. Full Stack Developer" {...register("role")} error={errors.role?.message} />
        </div>
      </FormSection>

      <FormSection title="Thumbnail">
        <Controller
          control={control}
          name="thumbnail_url"
          render={({ field, fieldState }) => (
            <ImageUploader
              label="Card image"
              hint="PNG, JPG, WebP or AVIF, up to 5 MB. A 4:3 screenshot works best."
              value={field.value}
              folder={uploadFolder}
              onChange={(url) => field.onChange(url)}
              onDiscard={(url) => void discardUpload(url)}
              error={fieldState.error?.message}
            />
          )}
        />
      </FormSection>

      <FormSection title="Story">
        <TextAreaField label="Overview" rows={5} {...register("description")} error={errors.description?.message} />
        <div className="grid gap-4 md:grid-cols-2">
          <TextAreaField label="The problem" {...register("problem")} error={errors.problem?.message} />
          <TextAreaField label="The solution" {...register("solution")} error={errors.solution?.message} />
        </div>
        <TextAreaField label="Features" rows={5} hint="One feature per line." {...register("features")} error={errors.features?.message} />
        <TextAreaField label="Process" {...register("process")} error={errors.process?.message} />
      </FormSection>

      <FormSection title="Tech stack">
        <Controller
          control={control}
          name="technology_ids"
          render={({ field, fieldState }) => (
            <TechnologyPicker options={skillOptions} value={field.value} onChange={field.onChange} error={fieldState.error?.message} />
          )}
        />
      </FormSection>

      <FormSection title="Links & timeline">
        <div className="grid gap-4 md:grid-cols-3">
          <TextField label="GitHub" type="url" placeholder="https://github.com/…" {...register("github_url")} error={errors.github_url?.message} />
          <TextField label="Live demo" type="url" placeholder="https://…" {...register("demo_url")} error={errors.demo_url?.message} />
          <TextField label="Documentation" type="url" placeholder="https://…" {...register("documentation_url")} error={errors.documentation_url?.message} />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <TextField label="Started" type="date" {...register("started_on")} error={errors.started_on?.message} />
          <TextField label="Finished" type="date" hint="Leave empty if still in progress." {...register("finished_on")} error={errors.finished_on?.message} />
        </div>
      </FormSection>

      <FormSection title="Visibility">
        <CheckboxField label="Featured" hint="Highlight this project." {...register("featured")} />
        <CheckboxField label="Visible" hint="Unticked hides it publicly even when published." {...register("is_visible")} />
      </FormSection>

      <div className="sticky bottom-0 z-10 -mx-(--page-gutter) flex flex-wrap items-center gap-3 border-t border-surface-edge bg-canvas/95 px-(--page-gutter) py-4">
        <span className="mr-auto flex items-center gap-2 text-sm text-ink-muted">
          {projectId && (
            <>
              Currently <ContentStatePill state={currentState} />
            </>
          )}
          {isDirty && <span className="font-bold text-warm">Unsaved changes</span>}
        </span>
        {formError && (
          <p role="alert" className="w-full text-sm font-bold text-danger sm:w-auto">
            {formError}
          </p>
        )}
        {currentState === "published" ? (
          <>
            <button type="button" disabled={pending} onClick={() => submit("draft")} className={buttonClasses("secondary", "md")}>
              Save as draft
            </button>
            <button type="button" disabled={pending} onClick={() => submit("published")} className={buttonClasses("primary", "md")}>
              {pending ? "Saving…" : "Update published"}
            </button>
          </>
        ) : (
          <>
            <button type="button" disabled={pending} onClick={() => submit(currentState === "archived" ? "archived" : "draft")} className={buttonClasses("secondary", "md")}>
              {pending ? "Saving…" : currentState === "archived" ? "Save (keep archived)" : "Save draft"}
            </button>
            <button type="button" disabled={pending} onClick={() => submit("published")} className={buttonClasses("primary", "md")}>
              Publish
            </button>
          </>
        )}
      </div>
    </form>
  );
}
