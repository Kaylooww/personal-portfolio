import type { Metadata } from "next";
import { CheckpointPlaceholder } from "@/components/portfolio/CheckpointPlaceholder";

export const metadata: Metadata = { title: "Milestones" };

export default function MilestonesPage() {
  return <CheckpointPlaceholder section="milestones" buildPhase={7} />;
}
