import type { Metadata } from "next";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { MediaBrowser } from "@/components/admin/MediaBrowser";
import { requireAdmin } from "@/lib/auth/admin";
import { listMediaFiles } from "@/lib/queries/admin-content";

export const metadata: Metadata = { title: "Media" };

export default async function AdminMediaPage() {
  await requireAdmin("/admin/media");
  const { files, referencesKnown } = await listMediaFiles();

  return (
    <>
      <AdminPageHeader
        title="Media"
        description="Everything in storage. Upload files from the editors (profile, projects, skills, milestones, settings); clean up unused ones here."
      />
      <div className="mt-8">
        <MediaBrowser files={files} referencesKnown={referencesKnown} />
      </div>
    </>
  );
}
