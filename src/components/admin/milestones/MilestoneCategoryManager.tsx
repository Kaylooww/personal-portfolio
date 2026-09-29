"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { CheckboxField } from "@/components/forms/CheckboxField";
import { IconPicker } from "@/components/forms/IconPicker";
import { SelectField } from "@/components/forms/SelectField";
import { TextField } from "@/components/forms/TextField";
import { MilestoneBadge } from "@/components/milestones/MilestoneBadge";
import { buttonClasses } from "@/components/ui/ButtonLink";
import { deleteMilestoneCategory, moveMilestoneCategory, saveMilestoneCategory, setMilestoneCategoryVisibility } from "@/lib/actions/milestones";
import type { AdminMilestoneCategory } from "@/lib/queries/admin-content";
import { EMPTY_MILESTONE_CATEGORY, MILESTONE_ACCENTS, milestoneCategoryFormSchema, type MilestoneCategoryFormValues } from "@/lib/validation/content";
import { slugify } from "@/lib/validation/project";
import { FormSaveBar } from "../FormSaveBar";
import { InlineListManager, type InlineListFormProps } from "../InlineListManager";
import { useFormAction } from "../useFormAction";

function MilestoneCategoryForm({ item, onDone, onCancel }: InlineListFormProps<AdminMilestoneCategory>) {
  const defaults: MilestoneCategoryFormValues = item
    ? {
        name: item.name,
        slug: item.slug,
        description: item.description ?? "",
        badge_icon: item.badge_icon ?? "",
        accent: item.accent ?? "navy",
        is_visible: item.is_visible,
      }
    : EMPTY_MILESTONE_CATEGORY;
  const [slugTouched, setSlugTouched] = useState(Boolean(item));
  const {
    register,
    control,
    handleSubmit,
    setError,
    setValue,
    reset,
    formState: { errors, isDirty },
  } = useForm<MilestoneCategoryFormValues>({ resolver: zodResolver(milestoneCategoryFormSchema), defaultValues: defaults, mode: "onTouched" });
  const { pending, formError, setFormError, submit } = useFormAction(setError);
  const badgeIcon = useWatch({ control, name: "badge_icon" });
  const accent = useWatch({ control, name: "accent" });

  const onSubmit = handleSubmit(
    (values) =>
      submit(
        () => saveMilestoneCategory({ id: item?.id, values }),
        () => {
          if (!item) {
            reset(EMPTY_MILESTONE_CATEGORY);
            setSlugTouched(false);
          }
          onDone();
        },
      ),
    () => setFormError("Please fix the highlighted fields."),
  );

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-4">
      <div className="flex flex-wrap items-start gap-4">
        <MilestoneBadge icon={badgeIcon || null} accent={accent} />
        <div className="grid min-w-0 flex-1 gap-4 sm:grid-cols-2">
          <TextField
            label="Name"
            {...register("name", {
              onChange: (e: { target: { value: string } }) => {
                if (!slugTouched) setValue("slug", slugify(e.target.value), { shouldValidate: true });
              },
            })}
            error={errors.name?.message}
          />
          <TextField label="Slug" {...register("slug", { onChange: () => setSlugTouched(true) })} error={errors.slug?.message} />
          <TextField label="Short description" className="sm:col-span-2" {...register("description")} error={errors.description?.message} />
          <SelectField label="Badge colour" options={MILESTONE_ACCENTS} {...register("accent")} />
        </div>
      </div>
      <Controller
        control={control}
        name="badge_icon"
        render={({ field, fieldState }) => <IconPicker label="Badge icon" value={field.value} onChange={field.onChange} error={fieldState.error?.message} />}
      />
      <CheckboxField label="Visible" hint="Hidden categories and their milestones don't appear publicly." {...register("is_visible")} />
      <FormSaveBar sticky={false} dirty={isDirty} pending={pending} error={formError} submitLabel={item ? "Save category" : "Add category"}>
        {onCancel && (
          <button type="button" onClick={onCancel} className={buttonClasses("secondary", "md")}>
            Cancel
          </button>
        )}
      </FormSaveBar>
    </form>
  );
}

export function MilestoneCategoryManager({ categories }: { categories: AdminMilestoneCategory[] }) {
  return (
    <InlineListManager
      items={categories}
      listLabel="Milestone categories"
      itemNoun="category"
      addLabel="+ Add category"
      empty={{ icon: "trophy", title: "No categories yet", message: "Categories become the badge cards on the Milestones page." }}
      label={(c) => c.name}
      leading={(c) => <MilestoneBadge icon={c.badge_icon} accent={c.accent} size="sm" />}
      summary={(c) => `${c.slug} · ${c.milestoneCount} ${c.milestoneCount === 1 ? "milestone" : "milestones"}`}
      deleteMessage={(c) =>
        c.milestoneCount > 0
          ? `This action cannot be undone. Its ${c.milestoneCount} ${c.milestoneCount === 1 ? "milestone stays" : "milestones stay"} but become uncategorised.`
          : "This action cannot be undone."
      }
      renderForm={(p) => <MilestoneCategoryForm {...p} />}
      onMove={moveMilestoneCategory}
      onVisibility={setMilestoneCategoryVisibility}
      onDelete={deleteMilestoneCategory}
    />
  );
}
