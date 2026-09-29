import type { ReactNode } from "react";
import { Container } from "@/components/layout/Container";
import type { SectionScene } from "@/lib/constants/sections";
import { cn } from "@/lib/utils/cn";
import { SceneBackground } from "./SceneBackground";

interface CheckpointPageProps {
  scene: SectionScene;
  children: ReactNode;
  className?: string;
}

/** Scene + padded content column shared by every checkpoint after the Airport. */
export function CheckpointPage({ scene, children, className }: CheckpointPageProps) {
  return (
    <>
      <SceneBackground scene={scene} />
      <div className="pb-16 pt-24 lg:pt-28">
        <Container className={cn("reveal-stagger relative", className)}>{children}</Container>
      </div>
    </>
  );
}
