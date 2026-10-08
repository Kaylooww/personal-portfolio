import Link from "next/link";
import { LogoMark } from "@/components/ui/LogoMark";
import { PaperCard } from "@/components/ui/PaperCard";
import { SafeImage } from "@/components/ui/SafeImage";
import { UiIcon } from "@/components/ui/UiIcon";
import { cn } from "@/lib/utils/cn";

interface PassportCardProps {
  name: string;
  photoUrl: string | null;
  showAdminLink?: boolean;
  className?: string;
}

/**
 * Taped-down passport photo with airmail stripes and a postmark.
 * Falls back to a silhouette until a profile photo is uploaded (Phase 13).
 */
export function PassportCard({ name, photoUrl, showAdminLink = false, className }: PassportCardProps) {
  return (
    <PaperCard as="figure" variant="pinned" className={cn("-rotate-2 p-3 sm:p-3.5", showAdminLink ? "pb-18 sm:pb-20" : "pb-14 sm:pb-16", className)}>
      <div className="relative aspect-[4/5] overflow-hidden rounded-tag bg-blue-300/45">
        {photoUrl ? (
          <SafeImage src={photoUrl} alt={`Portrait of ${name}`} fill sizes="(min-width: 1536px) 11.25rem, (min-width: 1280px) 9.25rem, (min-width: 640px) 10.25rem, 9.5rem" className="object-cover" preload fallback={<PhotoSilhouette />} />
        ) : (
          <PhotoSilhouette />
        )}
        <LogoMark className="absolute right-2.5 top-2.5 h-4 text-link" />
      </div>

      <figcaption className={cn("font-handwritten absolute inset-x-0 truncate px-5 text-center text-lg font-bold uppercase tracking-wide text-ink-strong", showAdminLink ? "bottom-8 sm:bottom-9" : "bottom-4 sm:bottom-5")}>
        {passportName(name)}
      </figcaption>

      {showAdminLink && (
        <Link
          href="/admin/login"
          rel="nofollow"
          aria-label="Admin"
          title="Admin"
          className="group/admin absolute bottom-0 left-1 grid size-11 place-items-center rounded-pill"
        >
          <span aria-hidden className="size-3.5 rounded-pill bg-ink ring-1 ring-surface-edge transition-trail transition-colors group-hover/admin:bg-blue-600 group-focus-visible/admin:bg-blue-600" />
        </Link>
      )}

      {/* Airmail stripes and postmark: decoration only */}
      <svg aria-hidden viewBox="0 0 40 24" className={cn("absolute -left-2 h-5 w-9 text-blue-500", showAdminLink ? "bottom-16" : "bottom-12")}>
        <path d="M2 5c6-4 10 4 16 0s10 4 16 0M2 12c6-4 10 4 16 0s10 4 16 0M2 19c6-4 10 4 16 0s10 4 16 0" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
      </svg>
      <span
        aria-hidden
        className={cn("absolute -right-4 grid size-14 rotate-12 bg-surface/60 place-items-center rounded-pill border-2 border-dashed border-blue-500/70 text-blue-500/80", showAdminLink ? "bottom-14" : "bottom-10")}
      >
        <UiIcon name="plane" className="size-6" />
      </span>
    </PaperCard>
  );
}

/** "Kyle Angelo C. Castro" → "Kyle Castro": first and last name, as on a boarding pass. */
function passportName(fullName: string): string {
  const parts = fullName.trim().split(/\s+/);
  return parts.length > 1 ? `${parts[0]} ${parts[parts.length - 1]}` : fullName;
}

function PhotoSilhouette() {
  return (
    <svg aria-hidden viewBox="0 0 160 200" className="absolute inset-0 size-full" preserveAspectRatio="xMidYMax meet">
      <g className="fill-navy-500/80">
        <circle cx="80" cy="82" r="38" />
        <path d="M68 48c4-14 30-16 40-4 10 2 14 14 10 24-10-8-26-8-44-4-10 2-14-6-6-16Z" />
        <path d="M18 200c0-40 26-66 62-66s62 26 62 66Z" />
      </g>
    </svg>
  );
}
