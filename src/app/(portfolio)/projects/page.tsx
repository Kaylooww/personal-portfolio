import type { Metadata } from "next";
import { CheckpointPage } from "@/components/portfolio/CheckpointPage";
import { NextStopSign } from "@/components/portfolio/NextStopSign";
import { ProjectExplorer } from "@/components/projects/ProjectExplorer";
import { ContentIcon } from "@/components/ui/ContentIcon";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { SignPost } from "@/components/ui/SignPost";
import { getNextSection } from "@/lib/constants/sections";
import { getPublishedProjects } from "@/lib/queries/projects";

export const metadata: Metadata = {
  title: "Projects",
  description: "Expeditions by Kyle Angelo C. Castro — completed builds, work in progress, plans and ideas.",
};

/** Checkpoint 4 — the Canyon: expeditions completed and underway. */
export default async function ProjectsPage() {
  const projects = await getPublishedProjects();
  const next = getNextSection("projects");

  return (
    <CheckpointPage scene="canyon">
      <div className="flex items-start justify-between gap-8">
        <SectionTitle
          eyebrow="Projects"
          eyebrowIcon={<ContentIcon icon="flag" className="size-4 text-blue-500" />}
          title="Expeditions"
          note={"Real projects. Real progress.\nEach one is a checkpoint on the climb."}
        />
        <SignPost labels={["Bigger things", "New skills", "Higher ideas"]} className="mr-4 hidden xl:inline-flex" />
      </div>

      <div className="mt-10">
        <ProjectExplorer projects={projects} />
      </div>

      {next && (
        <div className="mt-12 flex justify-end">
          <NextStopSign next={next} note="Next expedition:" className="mr-2" />
        </div>
      )}
    </CheckpointPage>
  );
}
