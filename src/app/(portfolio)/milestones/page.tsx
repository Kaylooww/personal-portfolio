import { checkpointMetadata } from "@/lib/seo/metadata";
import { MilestoneExplorer } from "@/components/milestones/MilestoneExplorer";
import { CheckpointPage } from "@/components/portfolio/CheckpointPage";
import { NextStopSign } from "@/components/portfolio/NextStopSign";
import { EmptyState } from "@/components/ui/EmptyState";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { SignPost } from "@/components/ui/SignPost";
import { getNextSection } from "@/lib/constants/sections";
import { getMilestoneCategories, getMilestones } from "@/lib/queries/milestones";

export function generateMetadata() {
  return checkpointMetadata("milestones");
}

/** Checkpoint 6 — the Citadel: achievements earned on the climb. */
export default async function MilestonesPage() {
  const [categories, milestones] = await Promise.all([getMilestoneCategories(), getMilestones()]);
  const next = getNextSection("milestones");

  return (
    <CheckpointPage scene="citadel">
      <div className="flex items-start justify-between gap-8">
        <SectionTitle
          eyebrow="Reaching new heights!"
          title="Milestones"
          subtitle={
            categories.length > 0 && (
              <p className="max-w-[36rem] text-xs font-extrabold uppercase leading-relaxed tracking-[0.14em] text-ink-strong sm:text-sm">
                {categories.map((c, i) => (
                  <span key={c.id}>
                    {c.name}
                    {/* Bullet sticks to the preceding name (nbsp) so no line starts with one. */}
                    {i < categories.length - 1 && (
                      <>
                        {" "}
                        <span aria-hidden className="mx-1 text-blue-500">
                          •
                        </span>{" "}
                      </>
                    )}
                  </span>
                ))}
              </p>
            )
          }
          note={"Progress made.\nHigher things ahead."}
        />
        <SignPost labels={["Final ascent", "New heights", "Bigger things", "Last push"]} className="mr-4 hidden xl:inline-flex" />
      </div>

      <div className="mt-10">
        {categories.length === 0 ? (
          <EmptyState icon="flag" title="No flags planted yet" message="Milestones will be pinned here as the climb goes on." />
        ) : (
          <MilestoneExplorer categories={categories} milestones={milestones} />
        )}
      </div>

      {next && (
        <div className="mt-12 flex justify-end">
          <NextStopSign next={next} note="Final ascent:" className="mr-2" />
        </div>
      )}
    </CheckpointPage>
  );
}
