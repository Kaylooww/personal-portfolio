import type { Metadata } from "next";
import { CheckpointPlaceholder } from "@/components/portfolio/CheckpointPlaceholder";

export const metadata: Metadata = { title: "Skills" };

export default function SkillsPage() {
  return <CheckpointPlaceholder section="skills" buildPhase={4} />;
}
