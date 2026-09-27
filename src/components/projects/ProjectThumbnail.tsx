import Image from "next/image";
import { LogoMark } from "@/components/ui/LogoMark";
import { cn } from "@/lib/utils/cn";

interface ProjectThumbnailProps {
  src: string | null;
  alt: string;
  sizes: string;
  priority?: boolean;
  className?: string;
}

/** Project screenshot, or a themed "expedition not yet photographed" plate — never a broken image. */
export function ProjectThumbnail({ src, alt, sizes, priority = false, className }: ProjectThumbnailProps) {
  return (
    <div className={cn("relative aspect-[4/3] overflow-hidden rounded-control bg-blue-100", className)}>
      {src ? (
        <Image src={src} alt={alt} fill sizes={sizes} priority={priority} className="object-cover" />
      ) : (
        <svg viewBox="0 0 160 120" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 size-full" aria-hidden>
          <rect width="160" height="120" className="fill-blue-100" />
          <circle cx="122" cy="30" r="12" className="fill-sunset-100" />
          <path d="M0 96 44 46l26 28 20-20 70 62H0Z" className="fill-blue-300" />
          <path d="M0 120V104l36-24 30 18 26-14 68 36Z" className="fill-navy-500" opacity="0.55" />
          <path d="M92 54V30l14 5-14 5" className="stroke-navy-700" strokeWidth="2" fill="none" strokeLinecap="round" />
        </svg>
      )}
      {!src && <LogoMark className="absolute bottom-2.5 right-3 h-4 text-paper" />}
    </div>
  );
}
