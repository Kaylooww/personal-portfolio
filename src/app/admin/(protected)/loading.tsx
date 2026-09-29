import { LoadingSkeleton } from "@/components/ui/LoadingSkeleton";

/** Shown inside the admin shell (sidebar stays put) while a section loads its data. */
export default function AdminLoading() {
  return <LoadingSkeleton label="Loading…" />;
}
