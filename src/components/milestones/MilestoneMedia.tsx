import { SafeImage } from "@/components/ui/SafeImage";
import { PdfPreview } from "@/components/ui/PdfPreview";
import { UiIcon } from "@/components/ui/UiIcon";
import type { Milestone } from "@/types";

/** PDF takes precedence over the optional image in both gallery and detail. */
export function MilestoneMedia({ milestone, detail = false }: { milestone: Milestone; detail?: boolean }) {
  const src = milestone.pdf_url || milestone.image_url;
  if (!src) return null;

  return (
    <figure>
      {milestone.pdf_url ? (
        <PdfPreview src={milestone.pdf_url} title={milestone.title} interactive={detail} />
      ) : (
        <div className="overflow-hidden rounded-control bg-surface-inset">
          <SafeImage key={src} src={src} alt={`Image for ${milestone.title}`} width={detail ? 1200 : 800} height={detail ? 900 : 500}
            sizes={detail ? "(min-width: 768px) 704px, calc(100vw - 74px)" : "(min-width: 1280px) 28vw, (min-width: 768px) 40vw, 85vw"}
            className={detail ? "max-h-[60dvh] w-full object-contain" : "aspect-[8/5] w-full object-contain"}
            fallback={<p className="p-6 text-center text-sm text-ink-muted">Image unavailable</p>} />
        </div>
      )}
      {detail && (
        <figcaption className="mt-2 text-sm font-extrabold text-link">
          <a href={src} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 hover:underline">
            {milestone.pdf_url ? "Open PDF" : "Open full-size image"} <UiIcon name="external" className="size-3.5" />
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
        </figcaption>
      )}
    </figure>
  );
}
