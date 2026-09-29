import type { Metadata } from "next";
import Link from "next/link";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { CategoryManager } from "@/components/admin/skills/CategoryManager";
import { UiIcon } from "@/components/ui/UiIcon";
import { requireAdmin } from "@/lib/auth/admin";
import { listAdminSkillCategories } from "@/lib/queries/admin-skills";

export const metadata: Metadata = { title: "Skill categories" };

export default async function SkillCategoriesPage() {
  await requireAdmin("/admin/skills/categories");
  const categories = await listAdminSkillCategories();

  return (
    <>
      <Link href="/admin/skills" className="mb-4 inline-flex items-center gap-1.5 text-sm font-extrabold text-blue-600 hover:underline">
        <UiIcon name="arrow-left" className="size-4" />
        All skills
      </Link>
      <AdminPageHeader title="Skill categories" description="Each category is a panel on the public gear board, shown in this order." />
      <div className="mt-8">
        <CategoryManager categories={categories} />
      </div>
    </>
  );
}
