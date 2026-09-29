import "server-only";

/** One origin for metadata and discovery files, independent of the request host. */
export function getSiteUrl(): URL {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  const deployment = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  const url = new URL(configured || (deployment ? `https://${deployment}` : "http://localhost:3000"));
  if (!["http:", "https:"].includes(url.protocol) || url.username || url.password) {
    throw new Error("NEXT_PUBLIC_SITE_URL must be an HTTP(S) site URL without credentials.");
  }
  return new URL(url.origin);
}

export function absoluteUrl(path: string): string {
  return new URL(path, getSiteUrl()).toString();
}
