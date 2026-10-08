import { checkpointMetadata } from "@/lib/seo/metadata";
import { CheckpointPage } from "@/components/portfolio/CheckpointPage";
import { SummitActions } from "@/components/portfolio/SummitActions";
import { LogoMark } from "@/components/ui/LogoMark";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { getResumeUrl, getSiteSettings } from "@/lib/queries/site-settings";
import { getSocialLinks } from "@/lib/queries/social-links";

export function generateMetadata() {
  return checkpointMetadata("summit");
}

/** Checkpoint 7 — the Summit: where the next climb begins. Kept deliberately calm and uncluttered. */
export default async function SummitPage() {
  const [settings, links, resumeUrl] = await Promise.all([getSiteSettings(), getSocialLinks(), getResumeUrl()]);

  return (
    <CheckpointPage scene="sunset" className="flex min-h-[calc(100dvh-10rem)] flex-col justify-center">
      <div className="max-w-2xl">
        <LogoMark className="h-12 text-blue-500 sm:h-14" />
        <SectionTitle
          as="h1"
          size="hero"
          title="The Summit"
          note={settings.summit_note ?? undefined}
          className="mt-4 max-w-none"
        />
        {settings.summit_message && (
          <p className="mt-8 max-w-xl text-lg leading-relaxed text-ink-strong">{settings.summit_message}</p>
        )}
        <div className="mt-8">
          <SummitActions links={links} resumeUrl={resumeUrl} />
        </div>
      </div>
    </CheckpointPage>
  );
}
