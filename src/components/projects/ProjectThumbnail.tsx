import { LogoMark } from "@/components/ui/LogoMark";
import { SafeImage } from "@/components/ui/SafeImage";
import { cn } from "@/lib/utils/cn";

interface ProjectThumbnailProps {
  src: string | null;
  alt: string;
  sizes: string;
  preload?: boolean;
  className?: string;
}

/** Themed "expedition not yet photographed" plate. */
function Plate() {
  return (
    <>
      <svg viewBox="0 0 160 120" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 size-full" aria-hidden>
        <rect width="160" height="120" className="fill-blue-100" />
        <circle cx="122" cy="30" r="12" className="fill-sunset-100" />
        <path d="M0 96 44 46l26 28 20-20 70 62H0Z" className="fill-blue-300" />
        <path d="M0 120V104l36-24 30 18 26-14 68 36Z" className="fill-navy-500" opacity="0.55" />
        <path d="M92 54V30l14 5-14 5" className="stroke-navy-700" strokeWidth="2" fill="none" strokeLinecap="round" />
      </svg>
      <LogoMark className="absolute bottom-2.5 right-3 h-4 text-paper" />
    </>
  );
}

/** Project screenshot, or the themed plate when there's none (or it fails to load) — never a broken image. */
export function ProjectThumbnail({ src, alt, sizes, preload = false, className }: ProjectThumbnailProps) {
  return (
    <div className={cn("relative aspect-[4/3] overflow-hidden rounded-control bg-blue-100", className)}>
      {src ? <SafeImage src={src} alt={alt} fill sizes={sizes} preload={preload} className="object-cover" fallback={<Plate />} /> : <Plate />}
    </div>
  );
}
