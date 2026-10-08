"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm, useWatch } from "react-hook-form";
import { CheckboxField } from "@/components/forms/CheckboxField";
import { SelectField } from "@/components/forms/SelectField";
import { TextField } from "@/components/forms/TextField";
import { buttonClasses } from "@/components/ui/ButtonLink";
import { CONTENT_ICON_KEYS, ContentIcon } from "@/components/ui/ContentIcon";
import { UiIcon } from "@/components/ui/UiIcon";
import { saveAboutCard } from "@/lib/actions/content";
import { ABOUT_CARD_KINDS, EMPTY_ABOUT_CARD, aboutCardFormSchema, type AboutCardFormValues } from "@/lib/validation/content";
import type { AboutCard } from "@/types";
import { FormSaveBar } from "../FormSaveBar";
import type { InlineListFormProps } from "../InlineListManager";
import { useFormAction } from "../useFormAction";

const ICON_OPTIONS = [{ value: "", label: "No icon" }, ...CONTENT_ICON_KEYS.map((k) => ({ value: k, label: k.replace(/-/g, " ") }))];

export function AboutCardForm({ item, onDone, onCancel }: InlineListFormProps<AboutCard>) {
  const defaults: AboutCardFormValues = item
    ? { kind: item.kind, title: item.title, items: item.items.map((i) => ({ label: i.label, icon: i.icon ?? "" })), is_visible: item.is_visible }
    : EMPTY_ABOUT_CARD;
  const {
    register,
    control,
    handleSubmit,
    setError,
    reset,
    formState: { errors, isDirty },
  } = useForm<AboutCardFormValues>({ resolver: zodResolver(aboutCardFormSchema), defaultValues: defaults, mode: "onTouched" });
  const { fields, append, remove, move } = useFieldArray({ control, name: "items" });
  const { pending, formError, setFormError, submit } = useFormAction(setError);
  const isChecklist = useWatch({ control, name: "kind" }) === "goals";
  const itemValues = useWatch({ control, name: "items" });

  const onSubmit = handleSubmit(
    (values) =>
      submit(
        () => saveAboutCard({ id: item?.id, values }),
        () => {
          if (!item) reset(EMPTY_ABOUT_CARD);
          onDone();
        },
      ),
    () => setFormError("Please fix the highlighted fields."),
  );

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <SelectField label="Card type" options={ABOUT_CARD_KINDS} {...register("kind")} error={errors.kind?.message} />
        <TextField label="Title" {...register("title")} error={errors.title?.message} />
      </div>

      <fieldset className="flex flex-col gap-2">
        <legend className="text-sm font-extrabold text-ink">Lines</legend>
        {isChecklist && <p className="text-sm text-ink-subtle">Goals show as a checklist, so line icons aren&apos;t used.</p>}
        <ol className="flex flex-col gap-2" aria-label="Card lines">
          {fields.map((f, i) => (
            <li key={f.id} className="flex flex-wrap items-start gap-2 rounded-control bg-surface-inset/50 p-2">
              <TextField label={`Line ${i + 1}`} className="min-w-48 flex-1" {...register(`items.${i}.label`)} error={errors.items?.[i]?.label?.message} />
              {!isChecklist && (
                <div className="flex items-end gap-2">
                  <SelectField label="Icon" options={ICON_OPTIONS} {...register(`items.${i}.icon`)} className="w-40" />
                  <span className="mb-3 grid size-6 place-items-center text-ink-muted">
                    <ContentIcon icon={itemValues?.[i]?.icon || null} fallback="compass" className="size-5" />
                  </span>
                </div>
              )}
              <div className="flex items-center gap-1 self-end pb-1.5">
                <button type="button" onClick={() => move(i, i - 1)} disabled={i === 0} aria-label={`Move line ${i + 1} up`} className="grid size-9 place-items-center rounded-control hover:bg-active-soft disabled:opacity-30">
                  <UiIcon name="chevron-up" className="size-4" />
                </button>
                <button type="button" onClick={() => move(i, i + 1)} disabled={i === fields.length - 1} aria-label={`Move line ${i + 1} down`} className="grid size-9 place-items-center rounded-control hover:bg-active-soft disabled:opacity-30">
                  <UiIcon name="chevron-up" className="size-4 rotate-180" />
                </button>
                <button type="button" onClick={() => remove(i)} disabled={fields.length === 1} aria-label={`Remove line ${i + 1}`} className="grid size-9 place-items-center rounded-control hover:bg-danger-soft hover:text-danger disabled:opacity-30">
                  <UiIcon name="close" className="size-4" />
                </button>
              </div>
            </li>
          ))}
        </ol>
        {errors.items?.message && <p className="text-sm font-bold text-danger">{errors.items.message}</p>}
        <button type="button" onClick={() => append({ label: "", icon: "" })} disabled={fields.length >= 12} className={buttonClasses("secondary", "md", "h-10 self-start px-4 text-xs")}>
          + Add line
        </button>
      </fieldset>

      <CheckboxField label="Visible" {...register("is_visible")} />
      <FormSaveBar sticky={false} dirty={isDirty} pending={pending} error={formError} submitLabel={item ? "Save card" : "Add card"}>
        {onCancel && (
          <button type="button" onClick={onCancel} className={buttonClasses("secondary", "md")}>
            Cancel
          </button>
        )}
      </FormSaveBar>
    </form>
  );
}
