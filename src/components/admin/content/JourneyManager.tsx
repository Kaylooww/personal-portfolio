"use client";

import { ContentIcon } from "@/components/ui/ContentIcon";
import { deleteListItem, moveListItem, setListItemVisibility } from "@/lib/actions/content";
import type { JourneyEntry } from "@/types";
import { formatContentDate } from "@/lib/utils/format";
import { InlineListManager } from "../InlineListManager";
import { JourneyForm } from "./JourneyForm";

/** Journey checkpoints, oldest first — the public route climbs in this order. */
export function JourneyManager({ entries }: { entries: JourneyEntry[] }) {
  return (
    <InlineListManager
      items={entries}
      listLabel="Journey checkpoints"
      itemNoun="checkpoint"
      addLabel="+ Add checkpoint"
      empty={{ icon: "mountain", title: "Route not charted yet", message: "Add the first stop of your journey." }}
      label={(e) => `${formatContentDate(e.date) ?? e.period_label} · ${e.title}`}
      leading={(e) => (
        <span className="grid size-10 shrink-0 place-items-center rounded-control bg-blue-100 text-blue-600">
          <ContentIcon icon={e.icon} fallback="flag" className="size-5" />
        </span>
      )}
      summary={(e) => [e.subtitle, e.description].filter(Boolean).join(" — ") || "No subtitle"}
      renderForm={(p) => <JourneyForm {...p} />}
      onMove={(id, dir) => moveListItem("journey_entries", id, dir)}
      onVisibility={(id, v) => setListItemVisibility("journey_entries", id, v)}
      onDelete={(id) => deleteListItem("journey_entries", id)}
    />
  );
}
