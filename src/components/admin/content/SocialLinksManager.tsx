"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import { CheckboxField } from "@/components/forms/CheckboxField";
import { SelectField } from "@/components/forms/SelectField";
import { TextField } from "@/components/forms/TextField";
import { buttonClasses } from "@/components/ui/ButtonLink";
import { UiIcon, type UiIconName } from "@/components/ui/UiIcon";
import { deleteListItem, moveListItem, saveSocialLink, setListItemVisibility } from "@/lib/actions/content";
import { EMPTY_SOCIAL_LINK, SOCIAL_PLATFORMS, socialLinkFormSchema, type SocialLinkFormValues } from "@/lib/validation/content";
import type { SocialLink, SocialPlatform } from "@/types";
import { FormSaveBar } from "../FormSaveBar";
import { InlineListManager, type InlineListFormProps } from "../InlineListManager";
import { useFormAction } from "../useFormAction";

const ICON: Partial<Record<SocialPlatform, UiIconName>> = { github: "github", linkedin: "linkedin", email: "mail" };

function SocialLinkForm({ item, onDone, onCancel }: InlineListFormProps<SocialLink>) {
  const defaults: SocialLinkFormValues = item
    ? {
        platform: item.platform,
        label: item.label,
        // Emails are stored as mailto: links; edit them as plain addresses.
        url: item.platform === "email" ? item.url.replace(/^mailto:/i, "") : item.url,
        is_visible: item.is_visible,
      }
    : EMPTY_SOCIAL_LINK;
  const {
    register,
    handleSubmit,
    setError,
    reset,
    control,
    formState: { errors, isDirty },
  } = useForm<SocialLinkFormValues>({ resolver: zodResolver(socialLinkFormSchema), defaultValues: defaults, mode: "onTouched" });
  const { pending, formError, setFormError, submit } = useFormAction(setError);
  const isEmail = useWatch({ control, name: "platform" }) === "email";

  const onSubmit = handleSubmit(
    (values) =>
      submit(
        () => saveSocialLink({ id: item?.id, values }),
        () => {
          if (!item) reset(EMPTY_SOCIAL_LINK);
          onDone();
        },
      ),
    () => setFormError("Please fix the highlighted fields."),
  );

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-4">
      <div className="grid gap-4 sm:grid-cols-[10rem_12rem_minmax(0,1fr)]">
        <SelectField label="Platform" options={SOCIAL_PLATFORMS} {...register("platform")} />
        <TextField label="Button label" {...register("label")} error={errors.label?.message} />
        <TextField
          label={isEmail ? "Email address" : "Link"}
          type={isEmail ? "email" : "url"}
          placeholder={isEmail ? "you@example.com" : "https://…"}
          {...register("url")}
          error={errors.url?.message}
        />
      </div>
      <CheckboxField label="Visible" hint="Shown on the Summit page." {...register("is_visible")} />
      <FormSaveBar sticky={false} dirty={isDirty} pending={pending} error={formError} submitLabel={item ? "Save link" : "Add link"}>
        {onCancel && (
          <button type="button" onClick={onCancel} className={buttonClasses("secondary", "md")}>
            Cancel
          </button>
        )}
      </FormSaveBar>
    </form>
  );
}

export function SocialLinksManager({ links }: { links: SocialLink[] }) {
  return (
    <InlineListManager
      items={links}
      listLabel="Social links"
      itemNoun="link"
      addLabel="+ Add link"
      empty={{ icon: "globe", title: "No links yet", message: "Add your GitHub, LinkedIn and contact email for the Summit page." }}
      label={(l) => l.label}
      leading={(l) => (
        <span className="grid size-10 shrink-0 place-items-center rounded-control bg-active text-link">
          <UiIcon name={ICON[l.platform] ?? "external"} className="size-5" />
        </span>
      )}
      summary={(l) => l.url.replace(/^mailto:/i, "")}
      renderForm={(p) => <SocialLinkForm {...p} />}
      onMove={(id, dir) => moveListItem("social_links", id, dir)}
      onVisibility={(id, v) => setListItemVisibility("social_links", id, v)}
      onDelete={(id) => deleteListItem("social_links", id)}
    />
  );
}
