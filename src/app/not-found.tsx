import type { Metadata } from "next";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { LogoMark } from "@/components/ui/LogoMark";

export const metadata: Metadata = { title: "Off the map" };

export default function NotFound() {
  return (
    <main id="main" className="flex min-h-dvh flex-col items-center justify-center gap-5 px-6 text-center">
      <LogoMark className="h-10 text-blue-500" />
      <p className="eyebrow text-blue-600">Error 404</p>
      <h1 className="font-display-heavy text-title uppercase text-navy-900">Off the map</h1>
      <p className="font-handwritten max-w-md text-hand-lg text-navy-700">
        No trail leads here. Head back and pick a checkpoint.
      </p>
      <ButtonLink href="/">Back to the airport</ButtonLink>
    </main>
  );
}
