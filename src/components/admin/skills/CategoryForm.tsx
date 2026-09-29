"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useTransition } from "react";
import { Controller, useForm } from "react-hook-form";
import { CheckboxField } from "@/components/forms/CheckboxField";
import { IconPicker } from "@/components/forms/IconPicker";
import { TextField } from "@/components/forms/TextField";
import { buttonClasses } from "@/components/ui/ButtonLink";
import { useToast } from "@/components/ui/Toast";
import { saveSkillCategory } from "@/lib/actions/skills";
import { slugify } from "@/lib/validation/project";
import { skillCategoryFormSchema, type SkillCategoryFormValues } from "@/lib/validation/skill";

interface CategoryFormProps {
  categoryId?: string;
  defaults: SkillCategoryFormValues;
  onDone: () => void;
  onCancel?: () => void;
}

/** Inline create/edit form for a skill category. */
export function CategoryForm({ categoryId, defaults, onDone, onCancel }: CategoryFormProps) {
  const toast = useToast();
  const [pending, startTransition] = useTransition();
  const [slugTouched, setSlugTouched] = useState(Boolean(categoryId));
  const {
    register,
    control,
    handleSubmit,
    setValue,
    setError,
    reset,
    formState: { errors },
  } = useForm<SkillCategoryFormValues>({ resolver: zodResolver(skillCategoryFormSchema), defaultValues: defaults, mode: "onTouched" });

  const onSubmit = handleSubmit((values) =>
    startTransition(async () => {
      const result = await saveSkillCategory({ id: categoryId, values });
      if (!result.ok) {
        for (const [field, message] of Object.entries(result.fieldErrors ?? {})) setError(field as keyof SkillCategoryFormValues, { message });
        toast.error(result.error);
        return;
      }
      toast.success(result.message ?? "Saved");
      if (!categoryId) {
        reset(defaults);
        setSlugTouched(false);
      }
      onDone();
    }),
  );

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <TextField
          label="Category name"
          {...register("name", {
            onChange: (e: { target: { value: string } }) => {
              if (!slugTouched) setValue("slug", slugify(e.target.value), { shouldValidate: true });
            },
          })}
          error={errors.name?.message}
          autoComplete="off"
        />
        <TextField label="Slug" {...register("slug", { onChange: () => setSlugTouched(true) })} error={errors.slug?.message} autoComplete="off" />
      </div>
      <Controller
        control={control}
        name="icon"
        render={({ field, fieldState }) => (
          <IconPicker label="Panel icon" value={field.value} onChange={field.onChange} error={fieldState.error?.message} />
        )}
      />
      <CheckboxField label="Visible" hint="Hidden categories (and their skills) don't appear on the public gear board." {...register("is_visible")} />
      <div className="flex flex-wrap gap-2">
        <button type="submit" disabled={pending} className={buttonClasses("primary", "md")}>
          {pending ? "Saving…" : categoryId ? "Save category" : "Add category"}
        </button>
        {onCancel && (
          <button type="button" onClick={onCancel} disabled={pending} className={buttonClasses("secondary", "md")}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
