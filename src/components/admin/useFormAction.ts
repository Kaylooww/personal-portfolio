"use client";

import { useState, useTransition } from "react";
import type { FieldValues, Path, UseFormSetError } from "react-hook-form";
import { useToast } from "@/components/ui/Toast";
import type { ActionResult } from "@/lib/actions/result";

/**
 * Submits a React Hook Form through a Server Action: pending state, toast,
 * and server-side field errors mapped back onto the form.
 */
export function useFormAction<V extends FieldValues>(setError: UseFormSetError<V>) {
  const toast = useToast();
  const [pending, startTransition] = useTransition();
  const [formError, setFormError] = useState<string | null>(null);

  const submit = <R,>(action: () => Promise<ActionResult<R>>, onSuccess?: (data: R) => void) => {
    setFormError(null);
    startTransition(async () => {
      const result = await action();
      if (!result.ok) {
        setFormError(result.error);
        for (const [field, message] of Object.entries(result.fieldErrors ?? {})) setError(field as Path<V>, { message });
        toast.error(result.error);
        return;
      }
      toast.success(result.message ?? "Saved");
      onSuccess?.(result.data);
    });
  };

  return { pending, formError, setFormError, submit };
}
