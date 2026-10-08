import Link from "next/link";
import { ContentIcon, type ContentIconKey } from "@/components/ui/ContentIcon";

interface StatCardProps {
  label: string;
  /** null when the count couldn't be loaded. */
  value: number | null;
  icon: ContentIconKey;
  href: string;
}

/** Dashboard tile: one number, one label, links to the section that owns it. */
export function StatCard({ label, value, icon, href }: StatCardProps) {
  return (
    <Link
      href={href}
      className="surface-paper group flex items-center gap-4 rounded-card p-5 transition-trail transition-[transform,box-shadow] hover:-translate-y-0.5 hover:shadow-paper-lift motion-reduce:hover:translate-y-0"
    >
      <span className="grid size-12 shrink-0 place-items-center rounded-control bg-active text-link">
        <ContentIcon icon={icon} className="size-6" />
      </span>
      <span>
        <span className="font-display-heavy block text-3xl leading-none text-ink">{value ?? "—"}</span>
        <span className="mt-1 block text-sm font-bold text-ink-muted group-hover:text-link">{label}</span>
      </span>
    </Link>
  );
}
