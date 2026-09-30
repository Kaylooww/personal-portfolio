"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { CheckboxField } from "@/components/forms/CheckboxField";
import { IconPicker } from "@/components/forms/IconPicker";
import { TextAreaField } from "@/components/forms/TextAreaField";
import { TextField } from "@/components/forms/TextField";
import { buttonClasses } from "@/components/ui/ButtonLink";
import { saveJourneyEntry } from "@/lib/actions/content";
import { EMPTY_JOURNEY, journeyFormSchema, type JourneyFormValues } from "@/lib/validation/content";
import type { JourneyEntry } from "@/types";
import { FormSaveBar } from "../FormSaveBar";
import type { InlineListFormProps } from "../InlineListManager";
import { useFormAction } from "../useFormAction";

export function JourneyForm({ item, onDone, onCancel }: InlineListFormProps<JourneyEntry>) {
  const defaults: JourneyFormValues = item
    ? {
        period_label: item.period_label,
        date: item.date ?? "",
        title: item.title,
        subtitle: item.subtitle ?? "",
        description: item.description ?? "",
        icon: item.icon ?? "",
        is_visible: item.is_visible,
      }
    : EMPTY_JOURNEY;
  const {
    register,
    control,
    handleSubmit,
    setError,
    reset,
    formState: { errors, isDirty },
  } = useForm<JourneyFormValues>({ resolver: zodResolver(journeyFormSchema), defaultValues: defaults, mode: "onTouched" });
  const { pending, formError, setFormError, submit } = useFormAction(setError);

  const onSubmit = handleSubmit(
    (values) =>
      submit(
        () => saveJourneyEntry({ id: item?.id, values }),
        () => {
          if (!item) reset(EMPTY_JOURNEY);
          onDone();
        },
      ),
    () => setFormError("Please fix the highlighted fields."),
  );

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-4">
      <div className="grid gap-4 sm:grid-cols-[10rem_minmax(0,1fr)_minmax(0,1fr)]">
        <TextField label="Year / period" placeholder="2025 or 2025+" {...register("period_label")} error={errors.period_label?.message} />
        <TextField label="Title" {...register("title")} error={errors.title?.message} />
        <TextField label="Subtitle" placeholder="e.g. BSIT Student" {...register("subtitle")} error={errors.subtitle?.message} />
      </div>
      <TextAreaField label="Short note" rows={2} {...register("description")} error={errors.description?.message} />
      <TextField label="Exact date (optional)" type="date" hint="Shown on the card when provided. Otherwise, the year / period is shown." className="sm:max-w-60" {...register("date")} error={errors.date?.message} />
      <Controller
        control={control}
        name="icon"
        render={({ field, fieldState }) => <IconPicker label="Icon" value={field.value} onChange={field.onChange} error={fieldState.error?.message} />}
      />
      <CheckboxField label="Visible" {...register("is_visible")} />
      <FormSaveBar sticky={false} dirty={isDirty} pending={pending} error={formError} submitLabel={item ? "Save checkpoint" : "Add checkpoint"}>
        {onCancel && (
          <button type="button" onClick={onCancel} className={buttonClasses("secondary", "md")}>
            Cancel
          </button>
        )}
      </FormSaveBar>
    </form>
  );
}
