"use client";

import Link from "next/link";
import { useEffect } from "react";
import { buttonClasses } from "@/components/ui/ButtonLink";
import { TrailMessage } from "@/components/ui/TrailMessage";

/** Last-resort boundary for anything outside the public and admin layouts. */
export default function RouteError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main id="main" className="grid min-h-dvh place-items-center">
      <TrailMessage
        tone="red"
        eyebrow="Something went wrong"
        title="The trail washed out"
        message="This page couldn't load. Try again, or head back to the start of the route."
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
    </main>
  );
}
