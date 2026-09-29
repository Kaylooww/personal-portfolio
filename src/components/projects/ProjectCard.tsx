import Link from "next/link";
import { buttonClasses } from "@/components/ui/ButtonLink";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { UiIcon } from "@/components/ui/UiIcon";
import { padNumber } from "@/lib/utils/format";
import type { ProjectWithRelations } from "@/types";
import { ProjectLinks } from "./ProjectLinks";
import { ProjectThumbnail } from "./ProjectThumbnail";
import { TechStack } from "./TechStack";

interface ProjectCardProps {
  project: ProjectWithRelations;
  /** 1-based expedition number shown on the flag tab. */
  number: number;
}

/** Expedition card: flag tab, thumbnail, status, stack, role and actions. */
export function ProjectCard({ project, number }: ProjectCardProps) {
  const href = `/projects/${project.slug}`;

  return (
    <article className="surface-paper group/card relative w-full rounded-card p-4 pt-8 transition-trail transition-[transform,box-shadow] hover:-translate-y-0.5 hover:shadow-paper-lift motion-reduce:hover:translate-y-0 sm:p-5 sm:pt-8 md:grid md:grid-cols-[minmax(0,14rem)_minmax(0,1fr)] md:gap-5">
      <FlagTab number={number} />

      <Link href={href} tabIndex={-1} aria-hidden className="block self-start">
        <ProjectThumbnail
          src={project.thumbnail_url}
          alt=""
          sizes="(min-width: 768px) 14rem, 100vw"
          className="shadow-paper [&_img]:transition-transform [&_img]:duration-(--duration-slow) group-hover/card:[&_img]:scale-[1.03] motion-reduce:group-hover/card:[&_img]:scale-100"
        />
      </Link>

      <div className="mt-4 flex min-w-0 flex-col md:mt-0">
        <div className="flex flex-wrap items-start justify-between gap-x-3 gap-y-2">
          <h2 className="font-display-heavy text-2xl leading-tight text-navy-900">
            <Link href={href} className="rounded-tag hover:text-blue-600">
              {project.title}
            </Link>
          </h2>
          <StatusBadge status={project.status} />
        </div>

        <p className="mt-2 text-[0.9375rem] leading-relaxed text-navy-700">{project.short_description}</p>

        <dl className="mt-4 grid grid-cols-[minmax(0,1fr)_auto] gap-x-5 gap-y-1.5">
          <dt className="eyebrow text-[0.6875rem] text-navy-500">Tech stack</dt>
          <dt className="eyebrow text-[0.6875rem] text-navy-500">Role</dt>
          <dd>
            <TechStack technologies={project.technologies} />
          </dd>
          <dd className="text-sm font-bold text-navy-800">{project.role ?? "—"}</dd>
        </dl>

        <div className="mt-auto flex flex-wrap gap-2 pt-5">
          <Link href={href} className={buttonClasses("ghost", "md", "h-10 px-3 text-xs text-blue-600")}>
            Details
            <UiIcon name="arrow-right" className="size-4" />
            <span className="sr-only"> about {project.title}</span>
          </Link>
          <ProjectLinks project={project} />
        </div>
      </div>
    </article>
  );
}

function FlagTab({ number }: { number: number }) {
  return (
    <span aria-hidden className="absolute -top-3 left-4 flex items-stretch shadow-paper">
      <span className="grid w-10 place-items-center rounded-l-tag bg-blue-500 py-1.5 text-white">
        <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 21V4M5 4.5c4-2 6.5 2 11 0v8.5c-4.5 2-7-2-11 0" />
        </svg>
      </span>
      <span className="grid place-items-center rounded-r-tag bg-paper-shade px-2.5 font-display-heavy text-sm text-navy-800">
        {padNumber(number)}
      </span>
    </span>
  );
}
