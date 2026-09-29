"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { DocumentUploader } from "@/components/forms/DocumentUploader";
import { ImageUploader } from "@/components/forms/ImageUploader";
import { TextAreaField } from "@/components/forms/TextAreaField";
import { TextField } from "@/components/forms/TextField";
import { saveProfile } from "@/lib/actions/content";
import { discardUpload } from "@/lib/actions/media";
import { profileFormSchema, type ProfileFormValues } from "@/lib/validation/content";
import { FormSaveBar } from "../FormSaveBar";
import { FormSection } from "../FormSection";
import { useFormAction } from "../useFormAction";

export function ProfileForm({ defaults }: { defaults: ProfileFormValues }) {
  const router = useRouter();
  const {
    register,
    control,
    handleSubmit,
    setError,
    formState: { errors, isDirty },
  } = useForm<ProfileFormValues>({ resolver: zodResolver(profileFormSchema), defaultValues: defaults, mode: "onTouched" });
  const { pending, formError, setFormError, submit } = useFormAction(setError);

  const onSubmit = handleSubmit(
    (values) => submit(() => saveProfile(values), () => router.refresh()),
    () => setFormError("Please fix the highlighted fields."),
  );

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-6">
      <FormSection title="Name & headline" description="Shown on the Airport and About pages.">
        <TextField label="Full name" {...register("full_name")} error={errors.full_name?.message} autoComplete="name" />
        <div className="grid gap-4 sm:grid-cols-2">
          <TextField label="Name — first line" hint="e.g. Kyle Angelo" {...register("display_first")} error={errors.display_first?.message} />
          <TextField label="Name — second line" hint="e.g. C. Castro" {...register("display_last")} error={errors.display_last?.message} />
        </div>
        <TextAreaField label="Roles" rows={3} hint="One per line, e.g. BSIT Student." {...register("headline_roles")} error={errors.headline_roles?.message} />
        <TextAreaField label="Tagline" rows={2} hint="Handwritten line; press Enter for a line break." {...register("tagline")} error={errors.tagline?.message} />
      </FormSection>

      <FormSection title="About me" description="The intro card on the About page.">
        <TextAreaField label="Intro" rows={3} {...register("intro")} error={errors.intro?.message} />
        <TextAreaField label="Second paragraph" rows={3} {...register("bio")} error={errors.bio?.message} />
        <div className="grid gap-4 sm:grid-cols-2">
          <TextField label="Location" {...register("location")} error={errors.location?.message} />
          <TextField label="Public email (optional)" type="email" {...register("email")} error={errors.email?.message} autoComplete="email" />
        </div>
      </FormSection>

      <FormSection title="Photo & résumé">
        <Controller
          control={control}
          name="photo_url"
          render={({ field, fieldState }) => (
            <ImageUploader
              label="Passport photo"
              hint="Portrait (4:5) works best. Without one, a silhouette is shown."
              value={field.value}
              folder="profile"
              onChange={field.onChange}
              onDiscard={(url) => void discardUpload(url)}
              error={fieldState.error?.message}
            />
          )}
        />
        <Controller
          control={control}
          name="resume_url"
          render={({ field, fieldState }) => (
            <DocumentUploader
              label="Résumé (PDF)"
              hint="Shown publicly only when “Offer résumé download” is on in Settings."
              value={field.value}
              folder="resume"
              onChange={field.onChange}
              onDiscard={(url) => void discardUpload(url)}
              error={fieldState.error?.message}
            />
          )}
        />
      </FormSection>

      <FormSaveBar dirty={isDirty} pending={pending} error={formError} submitLabel="Save profile" />
    </form>
  );
}
