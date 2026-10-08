import { PaperCard } from "@/components/ui/PaperCard";
import { Spark } from "@/components/ui/Spark";
import type { Profile } from "@/types";

interface AboutIntroCardProps {
  profile: Pick<Profile, "display_first" | "display_last" | "intro" | "bio">;
}

/** "Hello! I'm …" journal page beside the passport photo. */
export function AboutIntroCard({ profile }: AboutIntroCardProps) {
  return (
    <PaperCard tilt="right" className="p-6 sm:p-7">
      <p className="font-handwritten text-hand-lg text-ink-strong">Hello! I&apos;m</p>
      <h2 className="font-display-heavy mt-1 text-heading uppercase text-ink">
        {profile.display_first}
        <br />
        {profile.display_last}
        <Spark className="ml-1 inline-block size-[0.55em] -translate-y-[0.35em] text-blue-500" />
      </h2>
      {profile.intro && <p className="mt-4 leading-relaxed text-ink-muted">{profile.intro}</p>}
      {profile.intro && profile.bio && <hr className="my-4 border-t-2 border-dashed border-surface-edge" />}
      {profile.bio && <p className="leading-relaxed text-ink-muted">{profile.bio}</p>}
    </PaperCard>
  );
}
