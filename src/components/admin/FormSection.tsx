import type { ReactNode } from "react";

/** Paper panel grouping related fields in admin forms. */
export function FormSection({ title, description, children }: { title: string; description?: string; children: ReactNode }) {
  return (
    <section className="surface-paper flex flex-col gap-4 rounded-card p-5 sm:p-6">
      <div>
        <h2 className="font-display-heavy text-lg uppercase text-ink">{title}</h2>
        {description && <p className="mt-0.5 text-sm text-ink-subtle">{description}</p>}
      </div>
      {children}
    </section>
  );
}
