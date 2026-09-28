"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { buttonClasses } from "@/components/ui/ButtonLink";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { useToast } from "@/components/ui/Toast";
import { UiIcon } from "@/components/ui/UiIcon";
import { deleteProject } from "@/lib/actions/projects";

export function DeleteProjectButton({ projectId, title }: { projectId: string; title: string }) {
  const router = useRouter();
  const toast = useToast();
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className={buttonClasses("ghost", "md", "text-danger-600 hover:bg-danger-100")}>
        <UiIcon name="trash" className="size-4" />
        Delete project
      </button>
      <ConfirmDialog
        open={open}
        title={`Delete "${title}"?`}
        message="This action cannot be undone. Its screenshots and thumbnail are deleted too."
        confirmLabel="Delete project"
        pending={pending}
        onCancel={() => setOpen(false)}
        onConfirm={() =>
          startTransition(async () => {
            const r = await deleteProject(projectId);
            if (!r.ok) {
              toast.error(r.error);
              return;
            }
            toast.success(r.message ?? "Project deleted");
            setOpen(false);
            router.push("/admin/projects");
          })
        }
      />
    </>
  );
}
