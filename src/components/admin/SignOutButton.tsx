"use client";

import { useFormStatus } from "react-dom";
import { UiIcon } from "@/components/ui/UiIcon";
import { signOut } from "@/lib/actions/auth";
import { cn } from "@/lib/utils/cn";

function SubmitButton({ className }: { className?: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className={cn(
        "flex items-center gap-3 rounded-control px-3 py-2.5 text-sm font-extrabold text-ink-muted transition-trail transition-colors hover:bg-danger-soft hover:text-danger disabled:opacity-60",
        className,
      )}
    >
      <UiIcon name="log-out" className="size-5" />
      {pending ? "Signing out…" : "Log out"}
    </button>
  );
}

/** Posts to the signOut Server Action; works without JavaScript too. */
export function SignOutButton({ className }: { className?: string }) {
  return (
    <form action={signOut}>
      <SubmitButton className={className} />
    </form>
  );
}
