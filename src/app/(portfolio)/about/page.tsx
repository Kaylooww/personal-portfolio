import type { Metadata } from "next";
import { CheckpointPlaceholder } from "@/components/portfolio/CheckpointPlaceholder";

export const metadata: Metadata = { title: "About" };

export default function AboutPage() {
  return <CheckpointPlaceholder section="about" buildPhase={3} />;
}
