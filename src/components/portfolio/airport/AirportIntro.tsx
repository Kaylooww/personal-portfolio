import { CheckpointIcon } from "@/components/navigation/CheckpointIcon";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { UiIcon } from "@/components/ui/UiIcon";
import type { Profile } from "@/types";

interface AirportIntroProps {
  profile: Pick<Profile, "display_first" | "display_last" | "headline_roles" | "tagline">;
}

// Between xl and 2xl the intro column shares the row with the departure board,
// so the buttons tighten up to stay side by side.
const COMPACT_AT_XL = "xl:h-12 xl:px-5 xl:text-sm 2xl:h-14 2xl:px-7 2xl:text-base";

/** Name, roles, tagline and the two boarding actions. */
export function AirportIntro({ profile }: AirportIntroProps) {
  return (
    <div>
      <SectionTitle
        eyebrow="Welcome aboard!"
        eyebrowIcon={<UiIcon name="plane" className="size-4 text-blue-500" />}
        title={
          <>
            <span className="whitespace-nowrap">{profile.display_first}</span>
            <br />
            <span className="whitespace-nowrap">{profile.display_last}</span>
          </>
        }
        titleClassName="text-[length:clamp(2.5rem,1rem_+_2.9vw,5rem)] leading-[0.95]"
        subtitle={
          <p className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-base font-bold text-navy-800 sm:text-lg">
            {profile.headline_roles.map((role, i) => (
              <span key={role} className="flex items-center gap-2.5">
                {i > 0 && <span aria-hidden className="size-1.5 rounded-pill bg-blue-500" />}
                {role}
              </span>
            ))}
          </p>
        }
        note={profile.tagline}
      />

      <div className="mt-9 flex flex-wrap gap-3 sm:gap-4">
        <ButtonLink
          href="/about"
          size="lg"
          className={COMPACT_AT_XL}
          icon={<CheckpointIcon icon="mountain" className="size-5" />}
          trailingIcon={<UiIcon name="arrow-right" className="size-5" />}
        >
          Start the climb
        </ButtonLink>
        <ButtonLink href="/projects" variant="secondary" size="lg" className={COMPACT_AT_XL} icon={<UiIcon name="folder" className="size-5" />}>
          View projects
        </ButtonLink>
      </div>
    </div>
  );
}
