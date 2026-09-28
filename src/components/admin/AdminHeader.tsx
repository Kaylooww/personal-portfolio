import Link from "next/link";
import { UiIcon } from "@/components/ui/UiIcon";

/** Thin top bar: who is signed in, and a way back to the public site. */
export function AdminHeader({ email }: { email: string | undefined }) {
  return (
    <header className="flex items-center justify-between gap-4 border-b border-paper-edge bg-cream/80 px-(--page-gutter) py-3">
      <p className="min-w-0 truncate text-sm text-navy-700">
        Signed in as <span className="font-extrabold text-navy-900">{email ?? "admin"}</span>
      </p>
      <Link
        href="/"
        target="_blank"
        className="flex shrink-0 items-center gap-1.5 rounded-pill px-3 py-1.5 text-sm font-extrabold text-blue-600 transition-trail transition-colors hover:bg-blue-50"
      >
        View site
        <UiIcon name="external" className="size-4" />
        <span className="sr-only">(opens in a new tab)</span>
      </Link>
    </header>
  );
}
