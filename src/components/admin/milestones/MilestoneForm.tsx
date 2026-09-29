"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { CheckboxField } from "@/components/forms/CheckboxField";
import { IconPicker } from "@/components/forms/IconPicker";
import { ImageUploader } from "@/components/forms/ImageUploader";
import { SelectField } from "@/components/forms/SelectField";
import { TextAreaField } from "@/components/forms/TextAreaField";
import { TextField } from "@/components/forms/TextField";
import { discardUpload } from "@/lib/actions/media";
import { saveMilestone } from "@/lib/actions/milestones";
import { milestoneFormSchema, type MilestoneFormValues } from "@/lib/validation/content";
import { FormSaveBar } from "../FormSaveBar";
import { FormSection } from "../FormSection";
import { useFormAction } from "../useFormAction";

interface MilestoneFormProps {
  milestoneId?: string;
  defaults: MilestoneFormValues;
  categories: { id: string; name: string }[];
}

export function MilestoneForm({ milestoneId, defaults, categories }: MilestoneFormProps) {
  const router = useRouter();
  const {
    register,
    control,
    handleSubmit,
    setError,
    formState: { errors, isDirty },
  } = useForm<MilestoneFormValues>({ resolver: zodResolver(milestoneFormSchema), defaultValues: defaults, mode: "onTouched" });
  const { pending, formError, setFormError, submit } = useFormAction(setError);

  const onSubmit = handleSubmit(
    (values) =>
      submit(
        () => saveMilestone({ id: milestoneId, values }),
        () => (milestoneId ? router.refresh() : router.push("/admin/milestones")),
      ),
    () => setFormError("Please fix the highlighted fields."),
  );

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-6">
      <FormSection title="Milestone">
        <TextField label="Title" {...register("title")} error={errors.title?.message} />
        <div className="grid gap-4 sm:grid-cols-2">
          <SelectField
            label="Category"
            options={[{ value: "", label: "Uncategorised" }, ...categories.map((c) => ({ value: c.id, label: c.name }))]}
            {...register("category_id")}
            error={errors.category_id?.message}
          />
          <TextField label="Date" type="date" hint="Saving sorts milestones newest first, with featured entries at the top." {...register("date")} error={errors.date?.message} />
          <TextField label="Issuer (optional)" placeholder="e.g. Google" {...register("issuer")} error={errors.issuer?.message} />
          <TextField label="Organization (optional)" placeholder="e.g. your school" {...register("organization")} error={errors.organization?.message} />
        </div>
        <TextAreaField label="Description" rows={3} {...register("description")} error={errors.description?.message} />
      </FormSection>

      <FormSection title="Proof & links">
        <div className="grid gap-4 sm:grid-cols-2">
          <TextField label="Certificate link" type="url" placeholder="https://…" {...register("certificate_url")} error={errors.certificate_url?.message} />
          <TextField label="Details link" type="url" placeholder="https://…" {...register("external_url")} error={errors.external_url?.message} />
        </div>
        <Controller
          control={control}
          name="image_url"
          render={({ field, fieldState }) => (
            <ImageUploader
              label="Image (optional)"
              hint="A certificate scan or photo."
              value={field.value}
              folder="milestones"
              onChange={field.onChange}
              onDiscard={(url) => void discardUpload(url)}
              error={fieldState.error?.message}
            />
          )}
        />
      </FormSection>

      <FormSection title="Badge & visibility">
        <Controller
          control={control}
          name="badge_icon"
          render={({ field, fieldState }) => (
            <IconPicker label="Badge icon" hint="Leave as none to use the category's badge." value={field.value} onChange={field.onChange} error={fieldState.error?.message} />
          )}
        />
        <CheckboxField label="Featured" {...register("featured")} />
        <CheckboxField label="Visible" {...register("is_visible")} />
      </FormSection>

      <FormSaveBar dirty={isDirty} pending={pending} error={formError} submitLabel={milestoneId ? "Save milestone" : "Add milestone"} />
    </form>
  );
}
