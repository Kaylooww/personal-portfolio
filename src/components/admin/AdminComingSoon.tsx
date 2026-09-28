import { buttonClasses } from "@/components/ui/ButtonLink";
import { EmptyState } from "@/components/ui/EmptyState";
import type { AdminNavItem } from "@/lib/constants/admin-nav";
import Link from "next/link";
import { AdminPageHeader } from "./AdminPageHeader";

/** Protected placeholder for sections whose editor arrives in a later phase. */
export function AdminComingSoon({ section }: { section: AdminNavItem }) {
  return (
    <>
      <AdminPageHeader title={section.label} />
      <EmptyState
        className="mt-8"
        icon={section.icon}
        title="Trail under construction"
        message={`The ${section.label.toLowerCase()} editor is built in Phase ${section.phase}.`}
        action={
          <Link href="/admin" className={buttonClasses("secondary", "md")}>
            Back to dashboard
          </Link>
        }
      />
    </>
  );
}
