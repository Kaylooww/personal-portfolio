import type { Metadata } from "next";
import Link from "next/link";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { StatCard } from "@/components/admin/StatCard";
import { buttonClasses } from "@/components/ui/ButtonLink";
import { PaperCard } from "@/components/ui/PaperCard";
import { ContentIcon } from "@/components/ui/ContentIcon";
import { requireAdmin } from "@/lib/auth/admin";
import { getDashboardStats } from "@/lib/queries/admin-dashboard";

export const metadata: Metadata = { title: "Dashboard" };

export default async function AdminDashboardPage() {
  await requireAdmin("/admin");
  const stats = await getDashboardStats();

  return (
    <>
      <AdminPageHeader title="Dashboard" description="Everything on the expedition at a glance." />

      <section aria-labelledby="stats-heading" className="mt-8">
        <h2 id="stats-heading" className="sr-only">
          Content totals
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <StatCard label="Total projects" value={stats.totalProjects} icon="flag" href="/admin/projects" />
          <StatCard label="Published projects" value={stats.publishedProjects} icon="check-circle" href="/admin/projects" />
          <StatCard label="Draft projects" value={stats.draftProjects} icon="pen" href="/admin/projects" />
          <StatCard label="Total skills" value={stats.totalSkills} icon="tools" href="/admin/skills" />
          <StatCard label="Total milestones" value={stats.totalMilestones} icon="trophy" href="/admin/milestones" />
          <StatCard label="Journey entries" value={stats.journeyEntries} icon="mountain" href="/admin/journey" />
        </div>
      </section>

      <section aria-labelledby="quick-heading" className="mt-10">
        <h2 id="quick-heading" className="font-display-heavy text-xl uppercase text-navy-900">
          Quick actions
        </h2>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link href="/admin/projects/new" className={buttonClasses("primary", "md")}>
            + Add project
          </Link>
          <Link href="/admin/skills/new" className={buttonClasses("secondary", "md")}>
            + Add skill
          </Link>
          <Link href="/admin/milestones/new" className={buttonClasses("secondary", "md")}>
            + Add milestone
          </Link>
        </div>
      </section>

      <PaperCard className="mt-10 flex gap-3 border-blue-300 bg-blue-50 [background-image:none]">
        <ContentIcon icon="compass" className="mt-0.5 size-5 text-blue-600" />
        <p className="text-sm leading-relaxed text-navy-800">
          Changes you save here update the public site straight away. Drafts, hidden items and archived projects stay
          private until you publish or show them.
        </p>
      </PaperCard>
    </>
  );
}
