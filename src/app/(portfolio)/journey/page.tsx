import type { Metadata } from "next";
import { CheckpointPlaceholder } from "@/components/portfolio/CheckpointPlaceholder";

export const metadata: Metadata = { title: "Journey" };

export default function JourneyPage() {
  return <CheckpointPlaceholder section="journey" buildPhase={6} />;
}
