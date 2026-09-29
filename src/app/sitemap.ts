import type { MetadataRoute } from "next";
import { PORTFOLIO_SECTIONS } from "@/lib/constants/sections";
import { getPublishedProjectIndex } from "@/lib/queries/projects";
import { absoluteUrl } from "@/lib/seo/url";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const projects = await getPublishedProjectIndex();
  return [
    ...PORTFOLIO_SECTIONS.map(({ href }) => ({ url: absoluteUrl(href) })),
    ...projects.map(({ slug }) => ({ url: absoluteUrl(`/projects/${slug}`) })),
  ];
}
