import { createShareImage } from "@/lib/seo/share-image";

// Explicit URL lets an uploaded OG image take precedence over this fallback.
export const dynamic = "force-static";
export const revalidate = 3600;

export const GET = createShareImage;
