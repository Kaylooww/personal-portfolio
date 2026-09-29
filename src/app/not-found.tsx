import type { Metadata } from "next";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { TrailMessage } from "@/components/ui/TrailMessage";

export const metadata: Metadata = { title: "Off the map" };

/**
 * The single 404 page. Public URLs always reach it through the (portfolio)
 * layout — unknown paths via the catch-all route, unpublished projects via
 * notFound() — so it renders inside the site shell and doesn't add its own.
 */
export default function NotFound() {
  return (
    <TrailMessage
      className="min-h-dvh"
      eyebrow="Error 404"
      title="Off the map"
      message="No trail leads here — it may have moved or isn't public yet. Pick another checkpoint."
      actions={
        <>
          <ButtonLink href="/">Back to the airport</ButtonLink>
          <ButtonLink href="/projects" variant="secondary">
            All expeditions
          </ButtonLink>
        </>
      }
    />
  );
}
