import type { ReactNode } from "react";

interface AdminPageHeaderProps {
  title: string;
  description?: string;
  actions?: ReactNode;
}

/** Title row for every admin page. The admin is utilitarian: no sparks, no scenery. */
export function AdminPageHeader({ title, description, actions }: AdminPageHeaderProps) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="font-display-heavy text-3xl uppercase text-navy-900">{title}</h1>
        {description && <p className="mt-1 max-w-[60ch] text-navy-700">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </div>
  );
}
