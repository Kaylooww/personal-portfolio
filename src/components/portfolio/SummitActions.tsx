import { ButtonLink, buttonClasses } from "@/components/ui/ButtonLink";
import { UiIcon, type UiIconName } from "@/components/ui/UiIcon";
import type { SocialLink, SocialPlatform } from "@/types";

const PLATFORM_ICON: Partial<Record<SocialPlatform, UiIconName>> = {
  github: "github",
  linkedin: "linkedin",
  email: "mail",
};

/** Contact first, then View Projects, résumé (if offered), then social links. Missing links are simply not shown. */
export function SummitActions({ links, resumeUrl = null }: { links: SocialLink[]; resumeUrl?: string | null }) {
  const email = links.find((l) => l.platform === "email");
  const others = links.filter((l) => l.platform !== "email");

  return (
    <div className="flex flex-wrap gap-3">
      {email && (
        <a href={email.url} className={buttonClasses("primary", "lg")}>
          <UiIcon name="mail" className="size-5" />
          Contact me
        </a>
      )}
      <ButtonLink href="/projects" variant="secondary" size="lg" icon={<UiIcon name="folder" className="size-5" />}>
        View projects
      </ButtonLink>
      {resumeUrl && (
        <a href={resumeUrl} target="_blank" rel="noopener noreferrer" className={buttonClasses("secondary", "lg")}>
          <UiIcon name="arrow-down-right" className="size-5" />
          Résumé
          <span className="sr-only"> (PDF, opens in a new tab)</span>
        </a>
      )}
      {others.map((l) => (
        <a
          key={l.id}
          href={l.url}
          target="_blank"
          rel="noopener noreferrer me"
          className={buttonClasses("secondary", "lg")}
        >
          <UiIcon name={PLATFORM_ICON[l.platform] ?? "external"} className="size-5" />
          {l.label}
          <span className="sr-only"> (opens in a new tab)</span>
        </a>
      ))}
    </div>
  );
}
