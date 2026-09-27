import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { buttonClasses } from "@/components/ui/ButtonLink";
import { PaperCard } from "@/components/ui/PaperCard";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { UiIcon } from "@/components/ui/UiIcon";
import { formatMonthYear, padNumber } from "@/lib/utils/format";
import type { ProjectWithRelations } from "@/types";
import { ProjectLinks } from "./ProjectLinks";
import { ProjectThumbnail } from "./ProjectThumbnail";
import { TechStack } from "./TechStack";

interface ProjectDetailProps {
  project: ProjectWithRelations;
  number: number;
}

/** Full expedition report: overview, problem, solution, features, process, gallery, facts. */
export function ProjectDetail({ project, number }: ProjectDetailProps) {
  const started = formatMonthYear(project.started_on);
  const finished = formatMonthYear(project.finished_on);
  const timeline = started ? `${started} – ${finished ?? "present"}` : finished;

  return (
    <article>
      <Link href="/projects" className={buttonClasses("ghost", "md", "-ml-3 h-10 px-3 text-xs")}>
        <UiIcon name="arrow-left" className="size-4" />
        All expeditions
      </Link>

      <div className="mt-4 flex flex-col gap-4">
        <SectionTitle eyebrow={`Expedition ${padNumber(number)}`} title={project.title} titleClassName="text-[length:clamp(2.25rem,1.4rem_+_3vw,4rem)] leading-[0.95]" />
        <div className="flex flex-wrap items-center gap-3">
          <StatusBadge status={project.status} />
          {timeline && <span className="text-sm font-bold text-navy-700">{timeline}</span>}
        </div>
        <p className="max-w-[65ch] text-lg leading-relaxed text-navy-800">{project.short_description}</p>
      </div>

      <div className="mt-10 grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <div className="flex min-w-0 flex-col gap-6">
          <ProjectThumbnail
            src={project.thumbnail_url}
            alt={`Screenshot of ${project.title}`}
            sizes="(min-width: 1024px) 60vw, 100vw"
            priority
            className="aspect-[16/9] shadow-paper-lift"
          />

          {project.description && <Section title="Overview">{project.description}</Section>}
          {project.problem && <Section title="The problem">{project.problem}</Section>}
          {project.solution && <Section title="The solution">{project.solution}</Section>}
          {project.features.length > 0 && (
            <Section title="Features">
              <ul className="space-y-2">
                {project.features.map((f) => (
                  <li key={f} className="flex gap-2.5">
                    <UiIcon name="arrow-right" className="mt-1 size-4 text-blue-500" />
                    {f}
                  </li>
                ))}
              </ul>
            </Section>
          )}
          {project.process && <Section title="Process">{project.process}</Section>}

          {project.images.length > 0 && (
            <Section title="Gallery">
              <ul className="grid gap-4 sm:grid-cols-2">
                {project.images.map((img) => (
                  <li key={img.id}>
                    <figure>
                      <div className="relative aspect-[4/3] overflow-hidden rounded-control bg-blue-100">
                        <Image src={img.url} alt={img.alt} fill sizes="(min-width: 640px) 30vw, 100vw" className="object-cover" />
                      </div>
                      {img.caption && <figcaption className="font-handwritten mt-1.5 text-navy-700">{img.caption}</figcaption>}
                    </figure>
                  </li>
                ))}
              </ul>
            </Section>
          )}
        </div>

        <PaperCard as="aside" aria-label="Expedition facts" className="flex flex-col gap-5 lg:sticky lg:top-28">
          <Fact label="Role">{project.role ?? "—"}</Fact>
          {timeline && <Fact label="Timeline">{timeline}</Fact>}
          <Fact label="Tech stack">
            <TechStack technologies={project.technologies} size="md" />
          </Fact>
          {(project.github_url || project.demo_url || project.documentation_url) && (
            <div className="flex flex-wrap gap-2 border-t border-dashed border-paper-edge pt-5">
              <ProjectLinks project={project} />
              {project.documentation_url && (
                <a
                  href={project.documentation_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={buttonClasses("ghost", "md", "h-10 px-3 text-xs")}
                >
                  Docs
                  <UiIcon name="external" className="size-4" />
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
              )}
            </div>
          )}
        </PaperCard>
      </div>
    </article>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <PaperCard as="section">
      <h2 className="font-display-heavy text-xl uppercase text-navy-900">{title}</h2>
      <div className="mt-2 max-w-[70ch] leading-relaxed text-navy-700">{children}</div>
    </PaperCard>
  );
}

function Fact({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <p className="eyebrow text-[0.6875rem] text-navy-500">{label}</p>
      <div className="mt-1.5 font-bold text-navy-800">{children}</div>
    </div>
  );
}
