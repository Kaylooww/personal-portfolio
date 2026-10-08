"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

/** Mounted in the public shell so history navigation can retain its scroll position. */
export function JourneyArrival() {
  const pathname = usePathname();
  const historyDestination = useRef<string | null>(null);
  const visit = useRef({ pathname, initial: true });

  useEffect(() => {
    function rememberHistoryNavigation() {
      historyDestination.current = window.location.href;
    }
    window.addEventListener("popstate", rememberHistoryNavigation);
    return () => window.removeEventListener("popstate", rememberHistoryNavigation);
  }, []);

  useEffect(() => {
    if (visit.current.pathname !== pathname) visit.current = { pathname, initial: false };
    const fromHistory = historyDestination.current === window.location.href;
    historyDestination.current = null;
    const navigation = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming | undefined;
    const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");

    if (
      pathname !== "/journey" ||
      fromHistory ||
      (visit.current.initial && navigation?.type === "back_forward") ||
      window.location.hash ||
      motionPreference.matches ||
      document.hidden
    ) return;

    let frame = 0;
    const listeners = new AbortController();

    function stop() {
      cancelAnimationFrame(frame);
      listeners.abort();
    }

    // Any visitor interaction immediately returns control, including during setup.
    const options = { passive: true, signal: listeners.signal };
    window.addEventListener("wheel", stop, options);
    window.addEventListener("touchstart", stop, options);
    window.addEventListener("pointerdown", stop, options);
    window.addEventListener("keydown", stop, options);
    window.addEventListener("popstate", stop, options);
    window.addEventListener("hashchange", stop, options);
    motionPreference.addEventListener("change", stop, options);
    document.addEventListener("visibilitychange", stop, options);

    // Let Next finish its route scroll and the responsive trail complete layout.
    frame = requestAnimationFrame(() => {
      frame = requestAnimationFrame(() => {
        const trail = [...document.querySelectorAll<HTMLElement>("[data-journey-trail]")]
          .find((element) => element.getClientRects().length > 0);
        const bottom = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
        if (!trail || bottom < 80 || document.querySelector("dialog[open]")) {
          stop();
          return;
        }

        window.scrollTo({ top: bottom, behavior: "instant" });
        const startedAt = performance.now() + 140;
        const duration = Math.min(1600, Math.max(1000, bottom * 0.65));

        function climb(now: number) {
          const progress = Math.min(1, Math.max(0, (now - startedAt) / duration));
          const eased = progress < 0.5
            ? 4 * progress ** 3
            : 1 - (-2 * progress + 2) ** 3 / 2;
          window.scrollTo({ top: bottom * (1 - eased), behavior: "instant" });
          if (progress < 1) frame = requestAnimationFrame(climb);
          else stop();
        }

        frame = requestAnimationFrame(climb);
      });
    });

    return stop;
  }, [pathname]);

  return null;
}
