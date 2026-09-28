import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { LoginForm } from "@/components/admin/LoginForm";
import { LogoMark } from "@/components/ui/LogoMark";
import { PaperCard } from "@/components/ui/PaperCard";
import { UiIcon } from "@/components/ui/UiIcon";
import { getAdminSession } from "@/lib/auth/admin";
import { safeAdminPath } from "@/lib/auth/paths";

export const metadata: Metadata = { title: "Sign in" };

interface LoginPageProps {
  searchParams: Promise<{ next?: string; signedOut?: string }>;
}

export default async function AdminLoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;
  const next = safeAdminPath(params.next);
  const session = await getAdminSession();

  if (session.status === "admin") redirect(next);
  if (session.status === "forbidden") redirect("/admin/unauthorized");

  return (
    <main id="main" tabIndex={-1} className="flex min-h-dvh items-center justify-center px-(--page-gutter) py-12 outline-none">
      <div className="w-full max-w-sm">
        <div className="mb-6 flex flex-col items-center gap-3 text-center">
          <LogoMark className="h-10 text-blue-500" />
          <h1 className="font-display-heavy text-3xl uppercase text-navy-900">Base Camp</h1>
          <p className="font-handwritten text-lg text-navy-700">Admin access for the expedition.</p>
        </div>

        <PaperCard className="p-6 sm:p-7">
          {params.signedOut && (
            <p role="status" className="mb-5 rounded-control bg-moss-100 px-3 py-2 text-sm font-bold text-moss-700">
              You&apos;ve been signed out.
            </p>
          )}
          {session.status === "unconfigured" ? (
            <p className="text-navy-700">
              Sign-in is unavailable because Supabase isn&apos;t configured. Add the Supabase URL and keys to
              <code className="mx-1 rounded-tag bg-paper-shade px-1">.env.local</code>
              (see <code className="rounded-tag bg-paper-shade px-1">supabase/README.md</code>).
            </p>
          ) : (
            <LoginForm next={next} />
          )}
        </PaperCard>

        <Link href="/" className="mx-auto mt-6 flex w-fit items-center gap-1.5 text-sm font-extrabold text-blue-600 hover:underline">
          <UiIcon name="arrow-left" className="size-4" />
          Back to the portfolio
        </Link>
      </div>
    </main>
  );
}
