import type { Metadata } from "next";
import { CheckpointPage } from "@/components/portfolio/CheckpointPage";
import { NextStopSign } from "@/components/portfolio/NextStopSign";
import { GearBoard } from "@/components/skills/GearBoard";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { UiIcon } from "@/components/ui/UiIcon";
import { WoodSign } from "@/components/ui/WoodSign";
import { getNextSection } from "@/lib/constants/sections";
import { getSkillCategoriesWithSkills } from "@/lib/queries/skills";

export const metadata: Metadata = {
  title: "Skills",
  description: "The equipment Kyle Angelo C. Castro carries — languages, frameworks, databases, tools and design.",
};

/** Checkpoint 3 — the Jungle: the equipment I carry. */
export default async function SkillsPage() {
  const categories = await getSkillCategoriesWithSkills();
  const next = getNextSection("skills");

  return (
    <CheckpointPage scene="jungle" className="grid items-start gap-x-12 gap-y-10 xl:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
      <div className="flex flex-col gap-10 xl:sticky xl:top-28">
        <SectionTitle
          eyebrow="Expedition gear"
          title={
            <>
              Equipment
              <br />& Skills
            </>
          }
          note={"Tools for bigger climbs.\nSkills to reach higher ideas."}
        />
        <WoodSign tone="dark" standing className="hidden self-start lg:inline-block">
          <span className="font-display-heavy flex items-center gap-3 text-xl uppercase leading-tight">
            Higher skills,
            <br />
            brighter ideas
            <UiIcon name="arrow-right" className="size-6" />
          </span>
        </WoodSign>
      </div>

      <div className="flex flex-col gap-8">
        <GearBoard categories={categories} />
        {next && <NextStopSign next={next} className="mr-2 self-end" />}
      </div>
    </CheckpointPage>
  );
}
