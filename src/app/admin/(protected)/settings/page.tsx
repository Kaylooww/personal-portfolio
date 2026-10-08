import type { Metadata } from "next";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { SiteSettingsForm } from "@/components/admin/content/SiteSettingsForm";
import { SocialLinksManager } from "@/components/admin/content/SocialLinksManager";
import { requireAdmin } from "@/lib/auth/admin";
import { SITE } from "@/lib/constants/site";
import { getAdminSiteSettings, listAdminSocialLinks } from "@/lib/queries/admin-content";
import { DEPARTURE_ICONS, type SiteSettingsFormValues } from "@/lib/validation/content";

export const metadata: Metadata = { title: "Settings" };

type DepartureIcon = (typeof DEPARTURE_ICONS)[number];
const asIcon = (v: string | null): DepartureIcon => (DEPARTURE_ICONS as readonly string[]).includes(v ?? "") ? (v as DepartureIcon) : "plane";

export default async function AdminSettingsPage() {
  await requireAdmin("/admin/settings");
  const [s, links] = await Promise.all([getAdminSiteSettings(), listAdminSocialLinks()]);

  const defaults: SiteSettingsFormValues = {
    site_title: s?.site_title ?? SITE.title,
    site_description: s?.site_description ?? SITE.description,
    og_image_url: s?.og_image_url ?? "",
    departures: (s?.departures ?? []).map((d) => ({ destination: d.destination, status: d.status, icon: asIcon(d.icon) })),
    departures_note: s?.departures_note ?? "",
    summit_note: s?.summit_note ?? "",
    summit_message: s?.summit_message ?? "",
    resume_enabled: s?.resume_enabled ?? false,
  };

  return (
    <>
      <AdminPageHeader title="Settings" description="Site-wide text, the departure board, the Summit message and your links." />
      <div className="mt-8">
        <SiteSettingsForm key={s?.updated_at ?? "new"} defaults={defaults} />
      </div>
      <section aria-labelledby="links-heading" className="mt-12">
        <h2 id="links-heading" className="font-display-heavy text-2xl uppercase text-ink">
          Social links
        </h2>
        <p className="mb-5 mt-1 text-ink-muted">Buttons on the Summit page. Email becomes “Contact me”.</p>
        <SocialLinksManager links={links} />
      </section>
    </>
  );
}
