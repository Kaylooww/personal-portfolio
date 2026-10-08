"use client";

import { useEffect } from "react";
import "@/styles/globals.css";

/** Replaces the root layout if it crashes, so it renders its own <html>/<body>. Kept dependency-free. */
export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="en">
      <body className="grid min-h-dvh place-items-center bg-canvas p-6 text-center text-ink">
        <main>
          <h1 className="text-3xl font-extrabold uppercase">The trail washed out</h1>
          <p className="mt-3 text-ink-muted">Something went wrong loading the site. Please try again.</p>
          <button type="button" onClick={reset} className="mt-6 rounded-control bg-blue-500 px-5 py-3 font-extrabold uppercase tracking-wide text-white">
            Try again
          </button>
        </main>
      </body>
    </html>
  );
}
