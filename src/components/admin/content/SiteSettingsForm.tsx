"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { CheckboxField } from "@/components/forms/CheckboxField";
import { ImageUploader } from "@/components/forms/ImageUploader";
import { SelectField } from "@/components/forms/SelectField";
import { TextAreaField } from "@/components/forms/TextAreaField";
import { TextField } from "@/components/forms/TextField";
import { buttonClasses } from "@/components/ui/ButtonLink";
import { UiIcon } from "@/components/ui/UiIcon";
import { saveSiteSettings } from "@/lib/actions/content";
import { discardUpload } from "@/lib/actions/media";
import { DEPARTURE_ICONS, DEPARTURE_STATUSES, siteSettingsFormSchema, type SiteSettingsFormValues } from "@/lib/validation/content";
import { FormSaveBar } from "../FormSaveBar";
import { FormSection } from "../FormSection";
import { useFormAction } from "../useFormAction";

const ICON_OPTIONS = DEPARTURE_ICONS.map((i) => ({ value: i, label: i }));

export function SiteSettingsForm({ defaults }: { defaults: SiteSettingsFormValues }) {
  const router = useRouter();
  const {
    register,
    control,
    handleSubmit,
    setError,
    formState: { errors, isDirty },
  } = useForm<SiteSettingsFormValues>({ resolver: zodResolver(siteSettingsFormSchema), defaultValues: defaults, mode: "onTouched" });
  const departures = useFieldArray({ control, name: "departures" });
  const { pending, formError, setFormError, submit } = useFormAction(setError);

  const onSubmit = handleSubmit(
    (values) => submit(() => saveSiteSettings(values), () => router.refresh()),
    () => setFormError("Please fix the highlighted fields."),
  );

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-6">
      <FormSection title="Search & sharing">
        <TextField label="Site title" {...register("site_title")} error={errors.site_title?.message} />
        <TextAreaField label="Description" rows={2} hint="Used by search engines and link previews." {...register("site_description")} error={errors.site_description?.message} />
        <Controller
          control={control}
          name="og_image_url"
          render={({ field, fieldState }) => (
            <ImageUploader
              label="Share image"
              hint="1200×630 works best for link previews."
              aspect="video"
              value={field.value}
              folder="site"
              onChange={field.onChange}
              onDiscard={(url) => void discardUpload(url)}
              error={fieldState.error?.message}
            />
          )}
        />
      </FormSection>

      <FormSection title="Departure board" description="The flight board on the Airport page.">
        <ol className="flex flex-col gap-2" aria-label="Departures">
          {departures.fields.map((f, i) => (
            <li key={f.id} className="flex flex-wrap items-end gap-2 rounded-control bg-paper-shade/50 p-2">
              <TextField label="Destination" className="min-w-40 flex-1" {...register(`departures.${i}.destination`)} error={errors.departures?.[i]?.destination?.message} />
              <SelectField label="Status" options={DEPARTURE_STATUSES} className="w-36" {...register(`departures.${i}.status`)} />
              <SelectField label="Icon" options={ICON_OPTIONS} className="w-32" {...register(`departures.${i}.icon`)} />
              <div className="flex items-center gap-1 pb-1.5">
                <button type="button" onClick={() => departures.move(i, i - 1)} disabled={i === 0} aria-label={`Move departure ${i + 1} up`} className="grid size-9 place-items-center rounded-control hover:bg-blue-50 disabled:opacity-30">
                  <UiIcon name="chevron-up" className="size-4" />
                </button>
                <button type="button" onClick={() => departures.move(i, i + 1)} disabled={i === departures.fields.length - 1} aria-label={`Move departure ${i + 1} down`} className="grid size-9 place-items-center rounded-control hover:bg-blue-50 disabled:opacity-30">
                  <UiIcon name="chevron-up" className="size-4 rotate-180" />
                </button>
                <button type="button" onClick={() => departures.remove(i)} aria-label={`Remove departure ${i + 1}`} className="grid size-9 place-items-center rounded-control hover:bg-danger-100 hover:text-danger-600">
                  <UiIcon name="close" className="size-4" />
                </button>
              </div>
            </li>
          ))}
        </ol>
        {errors.departures?.message && <p className="text-sm font-bold text-danger-600">{errors.departures.message}</p>}
        <button
          type="button"
          onClick={() => departures.append({ destination: "", status: "planned", icon: "mountain" })}
          disabled={departures.fields.length >= 6}
          className={buttonClasses("secondary", "md", "h-10 self-start px-4 text-xs")}
        >
          + Add departure
        </button>
        <TextAreaField label="Board note" rows={2} hint="Handwritten corner note; Enter for a line break." {...register("departures_note")} error={errors.departures_note?.message} />
      </FormSection>

      <FormSection title="Summit" description="The final page.">
        <TextAreaField label="Handwritten note" rows={2} {...register("summit_note")} error={errors.summit_note?.message} />
        <TextAreaField label="Closing message" rows={3} {...register("summit_message")} error={errors.summit_message?.message} />
      </FormSection>

      <FormSection title="Résumé">
        <CheckboxField label="Offer résumé download" hint="Shows a download link when a résumé PDF is uploaded in Profile." {...register("resume_enabled")} />
      </FormSection>

      <FormSaveBar dirty={isDirty} pending={pending} error={formError} submitLabel="Save settings" />
    </form>
  );
}
