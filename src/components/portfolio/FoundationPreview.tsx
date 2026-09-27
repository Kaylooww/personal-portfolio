import { Container } from "@/components/layout/Container";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { PaperCard } from "@/components/ui/PaperCard";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { PORTFOLIO_SECTIONS } from "@/lib/constants/sections";
import { SITE } from "@/lib/constants/site";
import { PROJECT_STATUSES, PROJECT_STATUS_LABEL } from "@/lib/constants/status";
import { cn } from "@/lib/utils/cn";
import type { ProjectStatus } from "@/types";

/**
 * PHASE 1 ONLY — a living specimen of the design tokens so they can be
 * reviewed in the browser. Replaced by the Airport page in Phase 2.
 */

const SWATCHES = [
  { name: "navy-900", className: "bg-navy-900", ink: "text-white", use: "Headlines, body ink" },
  { name: "navy-700", className: "bg-navy-700", ink: "text-white", use: "Departure board" },
  { name: "blue-500", className: "bg-blue-500", ink: "text-white", use: "Active trail, primary action" },
  { name: "blue-100", className: "bg-blue-100", ink: "text-navy-900", use: "Soft highlight" },
  { name: "paper", className: "bg-paper border border-paper-edge", ink: "text-navy-900", use: "Cards, passport" },
  { name: "cream", className: "bg-cream border border-paper-edge", ink: "text-navy-900", use: "Page canvas" },
  { name: "wood-700", className: "bg-wood-700", ink: "text-paper", use: "Signs, boards" },
  { name: "sunset-500", className: "bg-sunset-500", ink: "text-navy-950", use: "Warm accent, Idea" },
  { name: "moss-500", className: "bg-moss-500", ink: "text-navy-950", use: "Ready, Completed" },
] as const;

const STATUS_STYLE: Record<ProjectStatus, string> = {
  completed: "bg-status-completed-bg text-status-completed",
  in_progress: "bg-status-progress-bg text-status-progress",
  planned: "bg-status-planned-bg text-status-planned",
  idea: "bg-status-idea-bg text-status-idea",
  archived: "bg-status-archived-bg text-status-archived",
};

export function FoundationPreview() {
  return (
    <Container className="space-y-16 py-16 sm:py-24">
      <header className="space-y-6">
        <p className="inline-flex rounded-pill bg-navy-900 px-3 py-1 text-xs font-extrabold text-paper">
          Phase 1 foundation preview · replaced by the Airport in Phase 2
        </p>
        <SectionTitle
          size="hero"
          eyebrow="Welcome aboard!"
          title={
            <>
              Kyle Angelo
              <br />
              C. Castro
            </>
          }
          note={"Building ideas,\none climb at a time."}
        />
        <p className="eyebrow text-navy-700">{SITE.roles.join(" • ")}</p>
        <div className="flex flex-wrap gap-3">
          <ButtonLink href="/about" size="lg">Start the climb</ButtonLink>
          <ButtonLink href="/projects" size="lg" variant="secondary">View projects</ButtonLink>
        </div>
      </header>

      <section aria-labelledby="palette-heading" className="space-y-5">
        <h2 id="palette-heading" className="text-heading uppercase">Palette</h2>
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {SWATCHES.map((s) => (
            <li key={s.name} className={cn("rounded-card p-4 shadow-paper", s.className, s.ink)}>
              <p className="font-extrabold">{s.name}</p>
              <p className="text-sm opacity-90">{s.use}</p>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="surfaces-heading" className="space-y-5">
        <h2 id="surfaces-heading" className="text-heading uppercase">Surfaces</h2>
        <div className="grid gap-6 md:grid-cols-3">
          <PaperCard variant="pinned" tilt="left" interactive>
            <h3 className="text-xl uppercase">Paper card</h3>
            <p className="mt-2 text-navy-700">Cream stock, warm edge, soft navy shadow. Holds all readable content.</p>
          </PaperCard>
          <div className="surface-wood rounded-panel p-6">
            <p className="font-handwritten text-2xl leading-tight">Next stop:<br />Bigger things</p>
          </div>
          <div className="surface-board rounded-panel p-5">
            <p className="eyebrow text-blue-300">Departures</p>
            <dl className="mt-3 space-y-2">
              {[
                ["My portfolio", "Ready", "bg-moss-500 text-navy-950"],
                ["Shore", "Up next", "bg-blue-500 text-white"],
                ["Bigger things", "Planned", "bg-navy-500 text-white"],
              ].map(([dest, status, cls]) => (
                <div key={dest} className="flex items-center justify-between gap-4 border-t border-white/10 pt-2">
                  <dt className="font-extrabold uppercase tracking-wide text-blue-100">{dest}</dt>
                  <dd className={cn("rounded-tag px-2.5 py-0.5 text-xs font-extrabold uppercase", cls)}>{status}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      <section aria-labelledby="status-heading" className="space-y-5">
        <h2 id="status-heading" className="text-heading uppercase">Expedition status</h2>
        <ul className="flex flex-wrap gap-2">
          {PROJECT_STATUSES.map((status) => (
            <li key={status} className={cn("rounded-pill px-3 py-1 text-xs font-extrabold uppercase tracking-wider", STATUS_STYLE[status])}>
              {PROJECT_STATUS_LABEL[status]}
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="route-heading" className="space-y-5">
        <h2 id="route-heading" className="text-heading uppercase">The route</h2>
        <ol className="grid gap-3 sm:grid-cols-2 lg:grid-cols-7">
          {PORTFOLIO_SECTIONS.map((s, i) => (
            <li key={s.id}>
              <PaperCard className="h-full p-4 sm:p-4">
                <p className="text-xs font-extrabold text-blue-600">Checkpoint {i + 1}</p>
                <p className="font-display-heavy text-lg uppercase">{s.label}</p>
                <p className="font-handwritten text-navy-700">{s.meaning}</p>
              </PaperCard>
            </li>
          ))}
        </ol>
      </section>
    </Container>
  );
}
