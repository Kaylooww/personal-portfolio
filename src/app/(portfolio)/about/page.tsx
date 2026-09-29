import { checkpointMetadata } from "@/lib/seo/metadata";
import { CheckpointPage } from "@/components/portfolio/CheckpointPage";
import { NextStopSign } from "@/components/portfolio/NextStopSign";
import { PassportCard } from "@/components/portfolio/PassportCard";
import { AboutIntroCard } from "@/components/portfolio/about/AboutIntroCard";
import { NoticeBoard } from "@/components/portfolio/about/NoticeBoard";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { getNextSection } from "@/lib/constants/sections";
import { getAboutCards } from "@/lib/queries/about";
import { getProfile } from "@/lib/queries/profile";

export function generateMetadata() {
  return checkpointMetadata("about");
}

/** Checkpoint 2 — the Shore: who I am. */
export default async function AboutPage() {
  const [profile, cards] = await Promise.all([getProfile(), getAboutCards()]);
  const next = getNextSection("about");

  return (
    <CheckpointPage scene="shore" className="grid items-start gap-x-12 gap-y-12 xl:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)]">
      <div>
        <SectionTitle title="About me" note="The beginning of my journey." />
        <div className="mt-10 grid items-start gap-8 sm:grid-cols-[12rem_minmax(0,1fr)] sm:gap-6 xl:grid-cols-[11rem_minmax(0,1fr)] 2xl:grid-cols-[13rem_minmax(0,1fr)]">
          <PassportCard name={profile.full_name} photoUrl={profile.photo_url} className="w-44 sm:mt-4 sm:w-auto" />
          <AboutIntroCard profile={profile} />
        </div>
      </div>

      <div className="flex flex-col gap-8">
        <NoticeBoard cards={cards} />
        {next && <NextStopSign next={next} className="mr-2 self-end" />}
      </div>
    </CheckpointPage>
  );
}
