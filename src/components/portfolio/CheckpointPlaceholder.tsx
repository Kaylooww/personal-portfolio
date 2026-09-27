import { Container } from "@/components/layout/Container";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { PaperCard } from "@/components/ui/PaperCard";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { getSection, getSectionIndex, type SectionId } from "@/lib/constants/sections";

interface CheckpointPlaceholderProps {
  section: SectionId;
  buildPhase: number;
}

/** Temporary stand-in so every public route resolves while phases are built. */
export function CheckpointPlaceholder({ section, buildPhase }: CheckpointPlaceholderProps) {
  const current = getSection(section);
  const step = getSectionIndex(section) + 1;

  return (
    <Container className="flex min-h-dvh flex-col justify-center gap-8 py-24">
      <SectionTitle eyebrow={`Checkpoint ${step} of 7`} title={current.label} note={current.meaning} />
      <PaperCard className="max-w-md">
        <p className="text-navy-700">
          This checkpoint is being built in <strong>Phase {buildPhase}</strong>.
        </p>
      </PaperCard>
      <ButtonLink href="/" variant="secondary" className="self-start">
        Back to base camp
      </ButtonLink>
    </Container>
  );
}
