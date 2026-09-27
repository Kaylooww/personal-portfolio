import { UiIcon, type UiIconName } from "@/components/ui/UiIcon";
import { DEPARTURE_STATUS_LABEL } from "@/lib/constants/status";
import { cn } from "@/lib/utils/cn";
import type { DepartureRow, DepartureStatus } from "@/types";

interface DepartureBoardProps {
  rows: DepartureRow[];
  note: string | null;
  className?: string;
}

const STATUS_STYLE: Record<DepartureStatus, string> = {
  ready: "bg-moss-500 text-navy-950",
  up_next: "bg-blue-500 text-white",
  planned: "border border-navy-300/60 bg-white/5 text-navy-300",
};

const KNOWN_ICONS: readonly UiIconName[] = ["laptop", "palm", "plane"];

function rowIcon(icon: string | null): UiIconName | "mountain" {
  if (icon === "mountain") return "mountain";
  return KNOWN_ICONS.find((k) => k === icon) ?? "plane";
}

/** The terminal's flight board, listing where the portfolio is headed. */
export function DepartureBoard({ rows, note, className }: DepartureBoardProps) {
  return (
    <section
      aria-labelledby="departures-title"
      className={cn("rounded-panel bg-navy-950 p-1.5 shadow-paper-lift sm:p-2", className)}
    >
      <div className="surface-board rounded-card px-4 pb-3 pt-4 sm:px-6 sm:pb-4 sm:pt-5">
        <header className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="grid size-10 place-items-center rounded-tag bg-sunset-500 text-navy-950 sm:size-11">
              <UiIcon name="plane" className="size-6" />
            </span>
            <h2 id="departures-title" className="font-display-heavy text-heading uppercase leading-none">
              Departures
            </h2>
          </div>
          {note && (
            <p className="font-handwritten mt-0.5 hidden whitespace-pre text-right text-sm uppercase leading-tight text-blue-300 -rotate-2 xs:block">
              {note}
            </p>
          )}
        </header>

        <table className="mt-4 w-full border-collapse text-left">
          <caption className="sr-only">Portfolio departures and their status</caption>
          <thead>
            <tr className="text-[0.6875rem] font-extrabold uppercase tracking-[0.12em] text-navy-300">
              <th scope="col" className="pb-2 font-extrabold">Destination</th>
              <th scope="col" className="pb-2 font-extrabold">Status</th>
              <th scope="col" className="pb-2 text-center font-extrabold">
                <span className="hidden sm:inline">Next stop</span>
                <span className="sm:hidden">Next</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => {
              const icon = rowIcon(row.icon);
              return (
                <tr key={row.destination} className="border-t border-white/10">
                  <th scope="row" className="py-3 pr-3 font-normal">
                    <span className="flex items-center gap-2.5 text-sm font-extrabold uppercase tracking-[0.04em] text-blue-300 sm:text-base">
                      {icon === "mountain" ? <MountainGlyph /> : <UiIcon name={icon} className="size-5 text-paper" />}
                      {row.destination}
                    </span>
                  </th>
                  <td className="py-3 pr-2">
                    <span
                      className={cn(
                        "inline-flex whitespace-nowrap rounded-control px-2.5 py-1 text-[0.6875rem] font-extrabold uppercase tracking-[0.08em] sm:px-3 sm:text-xs",
                        STATUS_STYLE[row.status],
                      )}
                    >
                      {DEPARTURE_STATUS_LABEL[row.status]}
                    </span>
                  </td>
                  <td className="py-3 text-center text-paper">
                    {row.status === "up_next" ? (
                      <>
                        <UiIcon name="arrow-down-right" className="mx-auto size-5" />
                        <span className="sr-only">Boarding next</span>
                      </>
                    ) : (
                      <>
                        <span aria-hidden className="text-navy-300">—</span>
                        <span className="sr-only">None</span>
                      </>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function MountainGlyph() {
  return (
    <svg aria-hidden viewBox="0 0 24 24" className="size-5 shrink-0 text-paper" fill="currentColor">
      <path d="M1.5 20 9 7l4 7-2.2 6Z" />
      <path d="M10 20 16 10l6.5 10Z" opacity="0.75" />
    </svg>
  );
}
