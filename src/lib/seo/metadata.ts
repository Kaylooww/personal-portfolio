import "server-only";
import type { Metadata } from "next";
import { SITE } from "@/lib/constants/site";
import { getSection, type SectionId } from "@/lib/constants/sections";
import { getProfile } from "@/lib/queries/profile";
import { getSiteSettings } from "@/lib/queries/site-settings";
import { absoluteUrl } from "./url";

interface PageMetadataOptions {
  path: string;
  title?: string;
  description?: string;
  image?: string | null;
}

/** Set the whole social object: Next merges nested metadata shallowly. */
export async function pageMetadata({ path, title, description, image }: PageMetadataOptions): Promise<Metadata> {
  const [settings, profile] = await Promise.all([getSiteSettings(), getProfile()]);
  const pageTitle = title ? `${title} | ${profile.full_name}` : settings.site_title;
  const pageDescription = description ?? settings.site_description;
  const customImage = image || settings.og_image_url;
  const images = customImage
    ? [{ url: customImage, alt: title ?? settings.site_title }]
    : [{ url: absoluteUrl("/share-image"), width: 1200, height: 630, alt: settings.site_title }];

  return {
    title: { absolute: pageTitle },
    description: pageDescription,
    applicationName: settings.site_title,
    authors: [{ name: profile.full_name }],
    alternates: { canonical: absoluteUrl(path) },
    openGraph: {
      type: "website",
      locale: SITE.locale,
      siteName: settings.site_title,
      title: pageTitle,
      description: pageDescription,
      url: absoluteUrl(path),
      images,
    },
    twitter: { card: "summary_large_image", title: pageTitle, description: pageDescription, images },
  };
}

export async function checkpointMetadata(id: SectionId): Promise<Metadata> {
  const section = getSection(id);
  if (id === "airport") return pageMetadata({ path: section.href });
  const profile = await getProfile();
  const descriptions: Record<Exclude<SectionId, "airport">, string> = {
    about: `Meet ${profile.full_name}: education, interests, development focus and current goals.`,
    skills: `Explore the languages, frameworks, databases, tools and design skills in ${profile.full_name}'s equipment pack.`,
    projects: `Expeditions by ${profile.full_name}: completed builds, work in progress, plans and ideas.`,
    journey: `The route so far: the places, programs and projects that shaped ${profile.full_name}.`,
    milestones: `Certifications, competitions, awards and academic achievements earned by ${profile.full_name}.`,
    summit: `The next climb starts here. Get in touch with ${profile.full_name} at the Summit.`,
  };
  return pageMetadata({
    path: section.href,
    title: id === "summit" ? "The Summit" : section.label,
    description: descriptions[id],
  });
}
