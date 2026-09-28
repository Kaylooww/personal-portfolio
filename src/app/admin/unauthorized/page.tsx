import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { SignOutButton } from "@/components/admin/SignOutButton";
import { buttonClasses } from "@/components/ui/ButtonLink";
import { LogoMark } from "@/components/ui/LogoMark";
import { PaperCard } from "@/components/ui/PaperCard";
import { getAdminSession } from "@/lib/auth/admin";

export const metadata: Metadata = { title: "No access" };

/** Shown to a signed-in account that isn't the admin. */
export default async function AdminUnauthorizedPage() {
  const session = await getAdminSession();
  if (session.status === "admin") redirect("/admin");

  return (
    <main id="main" tabIndex={-1} className="flex min-h-dvh items-center justify-center px-(--page-gutter) py-12 outline-none">
      <PaperCard className="w-full max-w-md p-7 text-center">
        <LogoMark className="mx-auto h-10 text-flag-red" />
        <h1 className="font-display-heavy mt-4 text-3xl uppercase text-navy-900">Crew only</h1>
        <p className="mt-2 text-navy-700">
          {session.status === "forbidden"
            ? `${session.user.email ?? "This account"} doesn't have access to the admin area.`
            : "You need to sign in with the admin account to continue."}
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          {session.status === "forbidden" ? (
            <SignOutButton className="border border-paper-edge" />
          ) : (
            <Link href="/admin/login" className={buttonClasses("primary", "md")}>
              Sign in
            </Link>
          )}
          <Link href="/" className={buttonClasses("secondary", "md")}>
            Back to the portfolio
          </Link>
        </div>
      </PaperCard>
    </main>
  );
}
