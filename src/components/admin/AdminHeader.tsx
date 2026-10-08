import Link from "next/link";
import { UiIcon } from "@/components/ui/UiIcon";
import { ThemeToggle } from "@/components/theme/ThemeToggle";

/** Thin top bar: who is signed in, and a way back to the public site. */
export function AdminHeader({ email }: { email: string | undefined }) {
  return (
    <header className="flex items-center justify-between gap-4 border-b border-surface-edge bg-canvas/80 px-(--page-gutter) py-3">
      <p className="min-w-0 truncate text-sm text-ink-muted">
        Signed in as <span className="font-extrabold text-ink">{email ?? "admin"}</span>
      </p>
      <div className="flex shrink-0 items-center gap-2">
        <ThemeToggle />
        <Link
          href="/"
          target="_blank"
          className="flex shrink-0 items-center gap-1.5 rounded-pill px-3 py-1.5 text-sm font-extrabold text-link transition-trail transition-colors hover:bg-active-soft"
        >
          View site
          <UiIcon name="external" className="size-4" />
          <span className="sr-only">(opens in a new tab)</span>
        </Link>
      </div>
    </header>
  );
}
