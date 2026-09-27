import { CheckpointPlaceholder } from "@/components/portfolio/CheckpointPlaceholder";

export default async function ProjectDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  await params;
  return <CheckpointPlaceholder section="projects" buildPhase={5} />;
}
