import type { Metadata } from "next";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { JourneyManager } from "@/components/admin/content/JourneyManager";
import { requireAdmin } from "@/lib/auth/admin";
import { listAdminJourney } from "@/lib/queries/admin-content";

export const metadata: Metadata = { title: "Journey" };

export default async function AdminJourneyPage() {
  await requireAdmin("/admin/journey");
  const entries = await listAdminJourney();

  return (
    <>
      <AdminPageHeader title="Journey" description="Checkpoints on the route, oldest first. The last one sits at the summit flag." />
      <div className="mt-8">
        <JourneyManager entries={entries} />
      </div>
    </>
  );
}
