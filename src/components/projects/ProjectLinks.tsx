import { buttonClasses } from "@/components/ui/ButtonLink";
import { UiIcon } from "@/components/ui/UiIcon";
import type { Project } from "@/types";

/** External GitHub / Live demo buttons; renders only the links that exist. */
export function ProjectLinks({ project }: { project: Pick<Project, "title" | "github_url" | "demo_url"> }) {
  return (
    <>
      {project.github_url && (
        <a
          href={project.github_url}
          target="_blank"
          rel="noopener noreferrer"
          className={buttonClasses("secondary", "md", "h-10 px-4 text-xs")}
        >
          <UiIcon name="github" className="size-4" />
          GitHub
          <span className="sr-only"> repository for {project.title} (opens in a new tab)</span>
        </a>
      )}
      {project.demo_url && (
        <a
          href={project.demo_url}
          target="_blank"
          rel="noopener noreferrer"
          className={buttonClasses("primary", "md", "h-10 px-4 text-xs")}
        >
          <UiIcon name="external" className="size-4" />
          Live demo
          <span className="sr-only"> of {project.title} (opens in a new tab)</span>
        </a>
      )}
    </>
  );
}
