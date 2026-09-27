import type { Metadata } from "next";
import { CheckpointPage } from "@/components/portfolio/CheckpointPage";
import { SummitActions } from "@/components/portfolio/SummitActions";
import { LogoMark } from "@/components/ui/LogoMark";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { getSiteSettings } from "@/lib/queries/site-settings";
import { getSocialLinks } from "@/lib/queries/social-links";

export const metadata: Metadata = {
  title: "The Summit",
  description: "The end of this expedition and the start of the next — get in touch with Kyle Angelo C. Castro.",
};

/** Checkpoint 7 — the Summit: where the next climb begins. Kept deliberately calm and uncluttered. */
export default async function SummitPage() {
  const [settings, links] = await Promise.all([getSiteSettings(), getSocialLinks()]);

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
          <p className="mt-8 max-w-xl text-lg leading-relaxed text-navy-800">{settings.summit_message}</p>
        )}
        <div className="mt-8">
          <SummitActions links={links} />
        </div>
      </div>
    </CheckpointPage>
  );
}
