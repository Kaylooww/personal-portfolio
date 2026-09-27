"use client";

import Link from "next/link";
import { useEffect } from "react";
import { buttonClasses } from "@/components/ui/ButtonLink";

export default function RouteError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-5 px-6 text-center">
      <h1 className="font-display-heavy text-heading uppercase text-navy-900">The trail washed out</h1>
      <p className="max-w-md text-navy-700">
        This page could not load. Try again, or head back to the start of the route.
      </p>
      <div className="flex flex-wrap justify-center gap-3">
        <button type="button" onClick={reset} className={buttonClasses("primary")}>
          Try again
        </button>
        <Link href="/" className={buttonClasses("secondary")}>
          Back to the airport
        </Link>
      </div>
    </div>
  );
}
