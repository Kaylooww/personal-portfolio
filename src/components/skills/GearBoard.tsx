import { EmptyState } from "@/components/ui/EmptyState";
import { cn } from "@/lib/utils/cn";
import type { SkillCategoryWithSkills } from "@/types";
import { SkillCategoryPanel } from "./SkillCategoryPanel";

interface GearBoardProps {
  categories: SkillCategoryWithSkills[];
  className?: string;
}

/** Wooden plank board holding every skill category. */
export function GearBoard({ categories, className }: GearBoardProps) {
  if (categories.length === 0) {
    return (
      <EmptyState
        icon="tools"
        title="Gear being packed"
        message="Skills will be laid out here before the next climb."
        className={className}
      />
    );
  }

  return (
    <div className={cn("surface-wood rounded-panel p-3 sm:p-4", className)}>
      <div className="grid gap-3 sm:grid-cols-2 sm:gap-4 [&>*:nth-child(odd)]:sm:-rotate-[0.4deg] [&>*:nth-child(even)]:sm:rotate-[0.4deg]">
        {categories.map((c) => (
          <SkillCategoryPanel key={c.id} category={c} />
        ))}
      </div>
    </div>
  );
}
