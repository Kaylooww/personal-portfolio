import type { Metadata } from "next";
import Link from "next/link";
import { AdminFilters } from "@/components/admin/AdminFilters";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { MilestoneAdminList } from "@/components/admin/milestones/MilestoneAdminList";
import { buttonClasses } from "@/components/ui/ButtonLink";
import { requireAdmin } from "@/lib/auth/admin";
import { listAdminMilestoneCategories, listAdminMilestones, parseMilestoneFilters } from "@/lib/queries/admin-content";

export const metadata: Metadata = { title: "Milestones" };

interface AdminMilestonesPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function AdminMilestonesPage({ searchParams }: AdminMilestonesPageProps) {
  await requireAdmin("/admin/milestones");
  const filters = parseMilestoneFilters(await searchParams);
  const [milestones, categories] = await Promise.all([listAdminMilestones(filters), listAdminMilestoneCategories()]);
  const filtered = Boolean(filters.q || filters.category);

  const categorySelect = {
    param: "category",
    label: "Filter by category",
    options: [{ value: "", label: "All categories" }, ...categories.map((c) => ({ value: c.id, label: c.name })), { value: "none", label: "Uncategorised" }],
  };

  return (
    <>
      <AdminPageHeader
        title="Milestones"
        description="Certifications, competitions, awards and achievements. Arrows set the order within each category."
        actions={
          <>
            <Link href="/admin/milestones/categories" className={buttonClasses("secondary", "md")}>
              Manage categories
            </Link>
            <Link href="/admin/milestones/new" className={buttonClasses("primary", "md")}>
              + Add milestone
            </Link>
          </>
        }
      />
      <div className="mt-8">
        <AdminFilters searchLabel="Search milestones" searchPlaceholder="Search title, issuer or organization" selects={[categorySelect]} />
        <p aria-live="polite" className="mt-3 px-1 text-sm font-bold text-navy-700">
          {milestones.length} {milestones.length === 1 ? "milestone" : "milestones"}
          {filtered ? " match" : ""}
        </p>
        <MilestoneAdminList milestones={milestones} categories={categories} filtered={filtered} />
      </div>
    </>
  );
}
