import type { Metadata } from "next";
import Link from "next/link";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { SkillForm } from "@/components/admin/skills/SkillForm";
import { UiIcon } from "@/components/ui/UiIcon";
import { requireAdmin } from "@/lib/auth/admin";
import { listAdminSkillCategories } from "@/lib/queries/admin-skills";
import { EMPTY_SKILL_FORM } from "@/lib/validation/skill";

export const metadata: Metadata = { title: "New skill" };

export default async function NewSkillPage() {
  await requireAdmin("/admin/skills/new");
  const categories = await listAdminSkillCategories();

  return (
    <>
      <Link href="/admin/skills" className="mb-4 inline-flex items-center gap-1.5 text-sm font-extrabold text-link hover:underline">
        <UiIcon name="arrow-left" className="size-4" />
        All skills
      </Link>
      <AdminPageHeader title="New skill" />
      <div className="mt-8">
        <SkillForm defaults={{ ...EMPTY_SKILL_FORM, category_id: categories[0]?.id ?? "" }} categories={categories} />
      </div>
    </>
  );
}
