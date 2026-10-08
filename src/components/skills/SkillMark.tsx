import { SafeImage } from "@/components/ui/SafeImage";
import { cn } from "@/lib/utils/cn";

// Every tone keeps white text at ≥ 4.5:1 (WCAG AA).
const TONES = ["bg-blue-500", "bg-navy-700", "bg-moss-600", "bg-sunset-700", "bg-wood-700", "bg-flag-red"] as const;

/** "JavaScript" → "JS", "HTML" → "HTML", "React" → "Re". */
export function monogram(name: string): string {
  const trimmed = name.trim();
  if (trimmed.length <= 4) return trimmed;
  const caps = trimmed.match(/[A-Z]/g);
  if (caps && caps.length >= 2) return caps.slice(0, 2).join("");
  return trimmed.slice(0, 2);
}

function toneFor(name: string): string {
  let hash = 0;
  for (const ch of name) hash = (hash * 31 + ch.charCodeAt(0)) >>> 0;
  return TONES[hash % TONES.length] ?? TONES[0];
}

interface SkillMarkProps {
  name: string;
  logoUrl: string | null;
  className?: string;
}

/** A skill's logo, or a coloured monogram until one is uploaded. Decorative: the name is always shown beside it. */
export function SkillMark({ name, logoUrl, className }: SkillMarkProps) {
  const text = monogram(name);
  const badge = (
    <span
      aria-hidden
      className={cn(
        "grid size-10 place-items-center rounded-tag font-display-heavy leading-none text-white shadow-[inset_0_-3px_0_rgb(0_0_0/0.18)]",
        text.length > 2 ? "text-[0.7rem]" : "text-base",
        toneFor(name),
        className,
      )}
    >
      {text}
    </span>
  );
  if (!logoUrl) return badge;
  return (
    <span className={cn("relative block size-10 dark:rounded-tag dark:bg-paper", className)}>
      {/* A logo that fails to load falls back to the monogram. */}
      <SafeImage src={logoUrl} alt="" fill sizes="40px" className="object-contain dark:p-0.5" fallback={badge} />
    </span>
  );
}
