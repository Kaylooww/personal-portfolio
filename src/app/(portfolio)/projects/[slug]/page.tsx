import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CheckpointPage } from "@/components/portfolio/CheckpointPage";
import { ProjectDetail } from "@/components/projects/ProjectDetail";
import { getPublishedProjectBySlug, getPublishedProjects } from "@/lib/queries/projects";

interface ProjectPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const projects = await getPublishedProjects();
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const project = await getPublishedProjectBySlug((await params).slug);
  if (!project) return { title: "Expedition not found" };
  return { title: project.title, description: project.short_description };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const [project, all] = await Promise.all([getPublishedProjectBySlug(slug), getPublishedProjects()]);
  if (!project) notFound();

  const number = all.findIndex((p) => p.id === project.id) + 1;

  return (
    <CheckpointPage scene="canyon">
      <ProjectDetail project={project} number={number} />
    </CheckpointPage>
  );
}
