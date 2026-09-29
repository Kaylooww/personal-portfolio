import type { Metadata } from "next";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { ProfileForm } from "@/components/admin/content/ProfileForm";
import { requireAdmin } from "@/lib/auth/admin";
import { getAdminProfile } from "@/lib/queries/admin-content";
import type { ProfileFormValues } from "@/lib/validation/content";

export const metadata: Metadata = { title: "Profile" };

export default async function AdminProfilePage() {
  await requireAdmin("/admin/profile");
  const p = await getAdminProfile();

  const defaults: ProfileFormValues = {
    full_name: p?.full_name ?? "",
    display_first: p?.display_first ?? "",
    display_last: p?.display_last ?? "",
    headline_roles: p?.headline_roles.join("\n") ?? "",
    tagline: p?.tagline ?? "",
    intro: p?.intro ?? "",
    bio: p?.bio ?? "",
    location: p?.location ?? "",
    email: p?.email ?? "",
    photo_url: p?.photo_url ?? "",
    resume_url: p?.resume_url ?? "",
  };

  return (
    <>
      <AdminPageHeader title="Profile" description="Who's on the passport: name, roles, intro, photo and résumé." />
      <div className="mt-8">
        <ProfileForm key={p?.updated_at ?? "new"} defaults={defaults} />
      </div>
    </>
  );
}
