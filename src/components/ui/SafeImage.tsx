"use client";

import Image, { type ImageProps } from "next/image";
import { useState, type ReactNode } from "react";

type SafeImageProps = Omit<ImageProps, "onError" | "src"> & {
  src: string;
  /** Rendered instead of a broken image if the file can't be loaded. */
  fallback: ReactNode;
};

/**
 * next/image that never shows a broken-image icon: if the file is missing
 * (e.g. deleted in Storage) the themed fallback is rendered instead.
 */
export function SafeImage({ fallback, src, alt, ...props }: SafeImageProps) {
  // Track which src failed so a new src gets a fresh attempt without an effect.
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  if (failedSrc === src) return <>{fallback}</>;
  return <Image src={src} alt={alt} {...props} onError={() => setFailedSrc(src)} />;
}
