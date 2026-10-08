"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { buttonClasses } from "@/components/ui/ButtonLink";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { useToast } from "@/components/ui/Toast";
import { UiIcon } from "@/components/ui/UiIcon";
import type { ActionResult } from "@/lib/actions/result";

interface DangerDeleteButtonProps {
  /** A Server Action with its id already bound, e.g. `deleteSkill.bind(null, id)`. */
  action: () => Promise<ActionResult>;
  buttonLabel: string;
  title: string;
  message: string;
  confirmLabel: string;
  /** Where to go after a successful delete. */
  redirectTo: string;
}

/** "Danger zone" delete with a confirmation dialog, then a redirect back to the list. */
export function DangerDeleteButton({ action, buttonLabel, title, message, confirmLabel, redirectTo }: DangerDeleteButtonProps) {
  const router = useRouter();
  const toast = useToast();
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className={buttonClasses("ghost", "md", "text-danger hover:bg-danger-soft")}>
        <UiIcon name="trash" className="size-4" />
        {buttonLabel}
      </button>
      <ConfirmDialog
        open={open}
        title={title}
        message={message}
        confirmLabel={confirmLabel}
        pending={pending}
        onCancel={() => setOpen(false)}
        onConfirm={() =>
          startTransition(async () => {
            const r = await action();
            if (!r.ok) {
              toast.error(r.error);
              return;
            }
            toast.success(r.message ?? "Deleted");
            setOpen(false);
            router.push(redirectTo);
          })
        }
      />
    </>
  );
}
