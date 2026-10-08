"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { FormSection } from "@/components/admin/FormSection";
import { CheckboxField } from "@/components/forms/CheckboxField";
import { IconPicker } from "@/components/forms/IconPicker";
import { ImageUploader } from "@/components/forms/ImageUploader";
import { SelectField } from "@/components/forms/SelectField";
import { TextAreaField } from "@/components/forms/TextAreaField";
import { TextField } from "@/components/forms/TextField";
import { SkillMark } from "@/components/skills/SkillMark";
import { buttonClasses } from "@/components/ui/ButtonLink";
import { useToast } from "@/components/ui/Toast";
import { discardUpload } from "@/lib/actions/media";
import { saveSkill } from "@/lib/actions/skills";
import { skillFormSchema, type SkillFormValues } from "@/lib/validation/skill";
import { slugify } from "@/lib/validation/project";

interface SkillFormProps {
  skillId?: string;
  defaults: SkillFormValues;
  categories: { id: string; name: string }[];
}

export function SkillForm({ skillId, defaults, categories }: SkillFormProps) {
  const router = useRouter();
  const toast = useToast();
  const [pending, startTransition] = useTransition();
  const [formError, setFormError] = useState<string | null>(null);
  const [slugTouched, setSlugTouched] = useState(Boolean(skillId));

  const {
    register,
    control,
    handleSubmit,
    setValue,
    setError,
    formState: { errors, isDirty },
  } = useForm<SkillFormValues>({ resolver: zodResolver(skillFormSchema), defaultValues: defaults, mode: "onTouched" });

  const name = useWatch({ control, name: "name" });
  const logo = useWatch({ control, name: "logo_url" });

  const onSubmit = handleSubmit(
    (values) => {
      setFormError(null);
      startTransition(async () => {
        const result = await saveSkill({ id: skillId, values });
        if (!result.ok) {
          setFormError(result.error);
          for (const [field, message] of Object.entries(result.fieldErrors ?? {})) setError(field as keyof SkillFormValues, { message });
          toast.error(result.error);
          return;
        }
        toast.success(result.message ?? "Saved");
        if (!skillId) router.push("/admin/skills");
        else router.refresh();
      });
    },
    () => setFormError("Please fix the highlighted fields."),
  );

  const nameField = register("name", {
    onChange: (e: { target: { value: string } }) => {
      if (!slugTouched) setValue("slug", slugify(e.target.value), { shouldValidate: true });
    },
  });

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-6">
      <FormSection title="Skill">
        <div className="grid gap-4 sm:grid-cols-2">
          <TextField label="Name" {...nameField} error={errors.name?.message} autoComplete="off" />
          <TextField
            label="Slug"
            {...register("slug", { onChange: () => setSlugTouched(true) })}
            error={errors.slug?.message}
            hint="Unique id, e.g. javascript or java-backend."
            autoComplete="off"
          />
        </div>
        <SelectField
          label="Category"
          options={[{ value: "", label: "Uncategorised (hidden on the gear board)" }, ...categories.map((c) => ({ value: c.id, label: c.name }))]}
          {...register("category_id")}
          error={errors.category_id?.message}
        />
        <TextAreaField label="Description (optional)" rows={2} hint="Shown as a tooltip on the skill tile." {...register("description")} error={errors.description?.message} />
        <TextField
          label="Proficiency (optional)"
          inputMode="numeric"
          placeholder="0–100"
          hint="Leave empty to show no level."
          className="sm:max-w-48"
          {...register("proficiency")}
          error={errors.proficiency?.message}
        />
      </FormSection>

      <FormSection title="Logo & icon">
        <div className="flex items-center gap-3 rounded-control bg-surface-inset/60 p-3">
          <SkillMark name={name || "Skill"} logoUrl={logo || null} />
          <p className="text-sm text-ink-muted">Preview. Without a logo the tile shows a coloured monogram.</p>
        </div>
        <Controller
          control={control}
          name="logo_url"
          render={({ field, fieldState }) => (
            <ImageUploader
              label="Logo"
              hint="Square PNG or WebP with a transparent background works best (max 5 MB)."
              aspect="square"
              value={field.value}
              folder="skills"
              onChange={field.onChange}
              onDiscard={(url) => void discardUpload(url)}
              error={fieldState.error?.message}
            />
          )}
        />
        <Controller
          control={control}
          name="icon"
          render={({ field, fieldState }) => (
            <IconPicker label="Fallback icon (optional)" hint="Used by the admin and future layouts when there's no logo." value={field.value} onChange={field.onChange} error={fieldState.error?.message} />
          )}
        />
      </FormSection>

      <FormSection title="Visibility">
        <CheckboxField label="Featured" hint="Highlight this skill." {...register("featured")} />
        <CheckboxField label="Visible" hint="Unticked hides it from the public gear board." {...register("is_visible")} />
      </FormSection>

      <div className="sticky bottom-0 z-10 -mx-(--page-gutter) flex flex-wrap items-center gap-3 border-t border-surface-edge bg-canvas/95 px-(--page-gutter) py-4">
        <span className="mr-auto text-sm font-bold text-warm">{isDirty ? "Unsaved changes" : ""}</span>
        {formError && (
          <p role="alert" className="w-full text-sm font-bold text-danger sm:w-auto">
            {formError}
          </p>
        )}
        <button type="submit" disabled={pending} className={buttonClasses("primary", "md")}>
          {pending ? "Saving…" : skillId ? "Save skill" : "Add skill"}
        </button>
      </div>
    </form>
  );
}
