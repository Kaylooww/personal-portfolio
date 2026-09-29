import { UiIcon } from "@/components/ui/UiIcon";
import type { Milestone } from "@/types";

export function MilestoneLinks({ milestone }: { milestone: Milestone }) {
  if (!milestone.certificate_url && !milestone.external_url) return null;

  return (
    <div className="relative z-10 mt-3 flex flex-wrap gap-3 text-sm font-extrabold text-blue-600">
      {milestone.certificate_url && (
        <a href={milestone.certificate_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 hover:underline">
          Certificate <UiIcon name="external" className="size-3.5" />
          <span className="sr-only"> for {milestone.title} (opens in a new tab)</span>
        </a>
      )}
      {milestone.external_url && (
        <a href={milestone.external_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 hover:underline">
          Details <UiIcon name="external" className="size-3.5" />
          <span className="sr-only"> about {milestone.title} (opens in a new tab)</span>
        </a>
      )}
    </div>
  );
}
