import type { Metadata } from "next";
import Link from "next/link";
import { AdminFilters } from "@/components/admin/AdminFilters";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { SkillAdminList } from "@/components/admin/skills/SkillAdminList";
import { buttonClasses } from "@/components/ui/ButtonLink";
import { requireAdmin } from "@/lib/auth/admin";
import { listAdminSkillCategories, listAdminSkills, parseSkillFilters } from "@/lib/queries/admin-skills";

export const metadata: Metadata = { title: "Skills" };

interface AdminSkillsPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function AdminSkillsPage({ searchParams }: AdminSkillsPageProps) {
  await requireAdmin("/admin/skills");
  const filters = parseSkillFilters(await searchParams);
  const [skills, categories] = await Promise.all([listAdminSkills(filters), listAdminSkillCategories()]);
  const filtered = Boolean(filters.q || filters.category);

  const categorySelect = {
    param: "category",
    label: "Filter by category",
    options: [
      { value: "", label: "All categories" },
      ...categories.map((c) => ({ value: c.id, label: c.name })),
      { value: "none", label: "Uncategorised" },
    ],
  };

  return (
    <>
      <AdminPageHeader
        title="Skills"
        description="The gear on the public Skills board. Each category is a panel; the arrows set the order inside it."
        actions={
          <>
            <Link href="/admin/skills/categories" className={buttonClasses("secondary", "md")}>
              Manage categories
            </Link>
            <Link href="/admin/skills/new" className={buttonClasses("primary", "md")}>
              + Add skill
            </Link>
          </>
        }
      />
      <div className="mt-8">
        <AdminFilters searchLabel="Search skills" searchPlaceholder="Search name, slug or description" selects={[categorySelect]} />
        <p aria-live="polite" className="mt-3 px-1 text-sm font-bold text-navy-700">
          {skills.length} {skills.length === 1 ? "skill" : "skills"}
          {filtered ? " match" : ""}
        </p>
        <SkillAdminList skills={skills} categories={categories} filtered={filtered} />
      </div>
    </>
  );
}
