import type { Metadata } from "next";
import { CheckpointPlaceholder } from "@/components/portfolio/CheckpointPlaceholder";

export const metadata: Metadata = { title: "Projects" };

export default function ProjectsPage() {
  return <CheckpointPlaceholder section="projects" buildPhase={5} />;
}
