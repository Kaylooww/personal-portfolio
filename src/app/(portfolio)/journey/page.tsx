import { checkpointMetadata } from "@/lib/seo/metadata";
import { JourneyRoute } from "@/components/journey/JourneyRoute";
import { JourneyTimeline } from "@/components/journey/JourneyTimeline";
import { CheckpointPage } from "@/components/portfolio/CheckpointPage";
import { NextStopSign } from "@/components/portfolio/NextStopSign";
import { EmptyState } from "@/components/ui/EmptyState";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { getNextSection } from "@/lib/constants/sections";
import { getJourneyEntries } from "@/lib/queries/journey";

export function generateMetadata() {
  return checkpointMetadata("journey");
}

/** Checkpoint 5 — the Ridge: checkpoints along the route. */
export default async function JourneyPage() {
  const entries = await getJourneyEntries();
  const next = getNextSection("journey");

  return (
    <CheckpointPage scene="ridge">
      <SectionTitle
        eyebrow="My journey"
        title="My Journey"
        note={"Different places,\nbigger perspectives,\none climb at a time."}
      />

      {entries.length === 0 ? (
        <EmptyState className="mt-10" icon="compass" title="Route being charted" message="The first checkpoints will appear here soon." />
      ) : (
        <>
          <JourneyRoute entries={entries} className="mt-10 hidden lg:block" />
          <JourneyTimeline entries={entries} className="mt-10 lg:hidden" />
        </>
      )}

      {next && (
        <div className="mt-12 flex justify-end">
          <NextStopSign next={next} note="A higher me awaits:" className="mr-2" />
        </div>
      )}
    </CheckpointPage>
  );
}
