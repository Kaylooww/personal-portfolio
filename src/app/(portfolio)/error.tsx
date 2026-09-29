"use client";

import Link from "next/link";
import { useEffect } from "react";
import { buttonClasses } from "@/components/ui/ButtonLink";
import { TrailMessage } from "@/components/ui/TrailMessage";

/** Public-page errors (e.g. the database is unreachable) — navigation stays so visitors can move on. */
export default function PortfolioError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <TrailMessage
      className="min-h-dvh"
      tone="red"
      eyebrow="Weather delay"
      title="The trail washed out"
      message="This checkpoint couldn't load right now. Try again in a moment, or visit another stop."
      actions={
        <>
          <button type="button" onClick={reset} className={buttonClasses("primary")}>
            Try again
          </button>
          <Link href="/" className={buttonClasses("secondary")}>
            Back to the airport
          </Link>
        </>
      }
    />
  );
}
