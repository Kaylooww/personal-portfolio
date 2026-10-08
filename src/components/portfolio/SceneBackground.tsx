import type { ComponentType } from "react";
import type { SectionScene } from "@/lib/constants/sections";
import { CanyonScene } from "./scenes/CanyonScene";
import { CitadelScene } from "./scenes/CitadelScene";
import { JungleScene } from "./scenes/JungleScene";
import { RidgeScene } from "./scenes/RidgeScene";
import { ShoreScene } from "./scenes/ShoreScene";
import { SunsetScene } from "./scenes/SunsetScene";
import { TerminalScene } from "./scenes/TerminalScene";
import "./scenes/scenes.css";

/** One stand-in scene per checkpoint. Swap a component for a painted plate without touching pages. */
const SCENES: Record<SectionScene, ComponentType> = {
  terminal: TerminalScene,
  shore: ShoreScene,
  jungle: JungleScene,
  canyon: CanyonScene,
  ridge: RidgeScene,
  citadel: CitadelScene,
  sunset: SunsetScene,
};

interface SceneBackgroundProps {
  scene: SectionScene;
}

/**
 * Full-bleed environment behind a checkpoint, fixed to the viewport so it also
 * sits under the sidebar. Scrims keep text legible: a left-side paper wash on
 * desktop, a stronger overall wash on small screens where content covers the art.
 */
export function SceneBackground({ scene }: SceneBackgroundProps) {
  const Scene = SCENES[scene];

  return (
    <div aria-hidden data-scene={scene} className="scene-art pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-cream">
      <Scene />
      <div className="scene-scrim-mobile absolute inset-0 lg:hidden" />
      <div className="scrim-left absolute inset-0 hidden lg:block" />
    </div>
  );
}
