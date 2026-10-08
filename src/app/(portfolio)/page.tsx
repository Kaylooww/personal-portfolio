import { checkpointMetadata } from "@/lib/seo/metadata";
import { Container } from "@/components/layout/Container";
import { NextStopSign } from "@/components/portfolio/NextStopSign";
import { DepartureBoard } from "@/components/portfolio/DepartureBoard";
import { PassportCard } from "@/components/portfolio/PassportCard";
import { SceneBackground } from "@/components/portfolio/SceneBackground";
import { AirportIntro } from "@/components/portfolio/airport/AirportIntro";
import { GateSign } from "@/components/portfolio/airport/GateSign";
import { UiIcon } from "@/components/ui/UiIcon";
import { getNextSection } from "@/lib/constants/sections";
import { getProfile } from "@/lib/queries/profile";
import { getSiteSettings } from "@/lib/queries/site-settings";

export function generateMetadata() {
  return checkpointMetadata("airport");
}

/** Checkpoint 1 — the Airport: where the expedition begins. */
export default async function AirportPage() {
  const [profile, settings] = await Promise.all([getProfile(), getSiteSettings()]);
  const next = getNextSection("airport");

  return (
    <>
      <SceneBackground scene="terminal" />

      <div className="flex min-h-dvh flex-col pb-6 pt-24 lg:pt-28">
        <Container className="reveal-stagger grid flex-1 content-center items-center gap-x-12 gap-y-12 xl:grid-cols-[minmax(0,1fr)_minmax(22rem,26rem)] 2xl:grid-cols-[minmax(0,1fr)_minmax(24rem,30rem)] 2xl:gap-x-20">
          <div className="grid items-center gap-x-10 gap-y-10 sm:grid-cols-[12rem_minmax(0,1fr)] xl:grid-cols-[11rem_minmax(0,1fr)] xl:gap-x-8 2xl:grid-cols-[13rem_minmax(0,1fr)] 2xl:gap-x-10">
            <PassportCard name={profile.full_name} photoUrl={profile.photo_url} showAdminLink className="w-44 sm:w-auto" />
            <AirportIntro profile={profile} />
          </div>

          <div className="relative flex flex-col gap-6 lg:max-w-xl xl:max-w-none">
            <GateSign className="hidden self-end xl:inline-flex" />
            <DepartureBoard rows={settings.departures} note={settings.departures_note} />
            {next && <NextStopSign next={next} className="self-end mr-2" />}
          </div>
        </Container>

        <Container className="mt-10 hidden items-end lg:flex">
          <p
            aria-hidden
            className="hidden items-center gap-2 text-xs font-extrabold uppercase tracking-[0.18em] text-link lg:flex"
          >
            <UiIcon name="chevron-up" className="size-4 rotate-90" />
            This way to the climb
          </p>
        </Container>
      </div>
    </>
  );
}
