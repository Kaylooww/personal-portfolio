import type { ContentState, ProjectStatus } from "@/types";

export const PROJECT_STATUSES: readonly ProjectStatus[] = [
  "completed",
  "in_progress",
  "planned",
  "idea",
  "archived",
];

export const PROJECT_STATUS_LABEL: Record<ProjectStatus, string> = {
  completed: "Completed",
  in_progress: "In Progress",
  planned: "Planned",
  idea: "Idea",
  archived: "Archived",
};

export const CONTENT_STATES: readonly ContentState[] = ["draft", "published", "archived"];
