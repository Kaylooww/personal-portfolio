"use client";

import { useTransition } from "react";
import { useToast } from "@/components/ui/Toast";
import type { ActionResult } from "@/lib/actions/result";

/**
 * Runs a Server Action in a transition and reports the outcome as a toast.
 * `pending` stays true until the revalidated page has re-rendered.
 */
export function useAdminAction() {
  const toast = useToast();
  const [pending, startTransition] = useTransition();

  const run = <T,>(action: () => Promise<ActionResult<T>>, onSuccess?: (data: T) => void) =>
    startTransition(async () => {
      const result = await action();
      if (result.ok) {
        if (result.message) toast.success(result.message);
        onSuccess?.(result.data);
      } else {
        toast.error(result.error);
      }
    });

  return { pending, run };
}
