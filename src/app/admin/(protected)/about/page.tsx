import type { Metadata } from "next";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AboutCardsManager } from "@/components/admin/content/AboutCardsManager";
import { requireAdmin } from "@/lib/auth/admin";
import { listAdminAboutCards } from "@/lib/queries/admin-content";

export const metadata: Metadata = { title: "About" };

export default async function AdminAboutPage() {
  await requireAdmin("/admin/about");
  const cards = await listAdminAboutCards();

  return (
    <>
      <AdminPageHeader title="About" description="The paper notes pinned to the About page's notice board, in this order. The intro text lives in Profile." />
      <div className="mt-8">
        <AboutCardsManager cards={cards} />
      </div>
    </>
  );
}
