"use client";

import { PROJECT_STATUS_LABEL, PROJECT_STATUSES } from "@/lib/constants/status";
import { AdminFilters } from "../AdminFilters";

const SELECTS = [
  {
    param: "state",
    label: "Filter by publishing state",
    options: [
      { value: "", label: "All states" },
      { value: "published", label: "Published" },
      { value: "draft", label: "Draft" },
      { value: "archived", label: "Archived" },
    ],
  },
  {
    param: "status",
    label: "Filter by expedition status",
    options: [{ value: "", label: "All statuses" }, ...PROJECT_STATUSES.map((s) => ({ value: s, label: PROJECT_STATUS_LABEL[s] }))],
  },
] as const;

export function ProjectFilters() {
  return <AdminFilters searchLabel="Search projects" searchPlaceholder="Search title, summary or slug" selects={SELECTS} />;
}
