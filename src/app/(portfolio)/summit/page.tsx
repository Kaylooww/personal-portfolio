import type { Metadata } from "next";
import { CheckpointPlaceholder } from "@/components/portfolio/CheckpointPlaceholder";

export const metadata: Metadata = { title: "Summit" };

export default function SummitPage() {
  return <CheckpointPlaceholder section="summit" buildPhase={8} />;
}
