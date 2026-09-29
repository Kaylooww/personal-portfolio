import { notFound } from "next/navigation";

/**
 * Any unknown public URL (e.g. /peak) lands here and 404s *inside* the public
 * layout, so the not-found page keeps the site navigation.
 */
export default function UnknownCheckpoint() {
  notFound();
}
