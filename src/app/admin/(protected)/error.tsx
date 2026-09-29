"use client";

import Link from "next/link";
import { useEffect } from "react";
import { buttonClasses } from "@/components/ui/ButtonLink";
import { TrailMessage } from "@/components/ui/TrailMessage";

/** Admin section errors render inside the admin shell so the sidebar stays usable. */
export default function AdminError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <TrailMessage
      as="h1"
      tone="red"
      eyebrow="Something went wrong"
      title="Base camp hit a snag"
      message="This section couldn't load. Your saved content is safe — try again, or pick another section."
      actions={
        <>
          <button type="button" onClick={reset} className={buttonClasses("primary")}>
            Try again
          </button>
          <Link href="/admin" className={buttonClasses("secondary")}>
            Dashboard
          </Link>
        </>
      }
    />
  );
}
