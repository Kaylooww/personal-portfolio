/**
 * Domain types for all portfolio content.
 * These mirror the PostgreSQL schema that lands in Phase 9
 * (see .context/CONTENT_MODEL.md). Timestamps are ISO-8601 strings.
 */

export type UUID = string;
export type ISODateString = string;

/** Editorial lifecycle for major content. Only `published` is public. */
export type ContentState = "draft" | "published" | "archived";

/** Progress status shown on the expedition card. Independent of ContentState. */
export type ProjectStatus = "completed" | "in_progress" | "planned" | "idea" | "archived";

interface Timestamps {
  created_at: ISODateString;
  updated_at: ISODateString;
}

interface Orderable {
  display_order: number;
  is_visible: boolean;
}

export interface Profile extends Timestamps {
  id: UUID;
  full_name: string;
  display_first: string;
  display_last: string;
  headline_roles: string[];
  tagline: string;
  intro: string;
  bio: string;
  photo_url: string | null;
  location: string | null;
  resume_url: string | null;
  email: string | null;
}

export interface AboutCardItem {
  label: string;
  icon: string | null;
}

export type AboutCardKind = "education" | "interests" | "focus" | "location" | "goals";

export interface AboutCard extends Timestamps, Orderable {
  id: UUID;
  kind: AboutCardKind;
  title: string;
  items: AboutCardItem[];
}

export interface SkillCategory extends Timestamps, Orderable {
  id: UUID;
  name: string;
  slug: string;
  icon: string | null;
}

export interface Skill extends Timestamps, Orderable {
  id: UUID;
  name: string;
  slug: string;
  category_id: UUID | null;
  description: string | null;
  icon: string | null;
  logo_url: string | null;
  /** Optional 0–100. Not shown when null. */
  proficiency: number | null;
  featured: boolean;
}

export interface SkillCategoryWithSkills extends SkillCategory {
  skills: Skill[];
}

export interface Project extends Timestamps, Orderable {
  id: UUID;
  title: string;
  slug: string;
  short_description: string;
  description: string | null;
  problem: string | null;
  solution: string | null;
  features: string[];
  process: string | null;
  thumbnail_url: string | null;
  role: string | null;
  status: ProjectStatus;
  content_state: ContentState;
  github_url: string | null;
  demo_url: string | null;
  documentation_url: string | null;
  featured: boolean;
  started_on: ISODateString | null;
  finished_on: ISODateString | null;
  published_at: ISODateString | null;
}

export interface ProjectImage {
  id: UUID;
  project_id: UUID;
  url: string;
  alt: string;
  caption: string | null;
  display_order: number;
  created_at: ISODateString;
}

/** Join between a project and a skill used as a technology. */
export interface ProjectTechnology {
  project_id: UUID;
  skill_id: UUID;
  display_order: number;
}

export interface ProjectWithRelations extends Project {
  technologies: Skill[];
  images: ProjectImage[];
}

export interface JourneyEntry extends Timestamps, Orderable {
  id: UUID;
  /** Free-form period label, e.g. "2020" or "2025+". */
  period_label: string;
  date: ISODateString | null;
  title: string;
  subtitle: string | null;
  description: string | null;
  icon: string | null;
}

export interface MilestoneCategory extends Timestamps, Orderable {
  id: UUID;
  name: string;
  slug: string;
  description: string | null;
  badge_icon: string | null;
  accent: "navy" | "red" | "gold" | "blue" | "green" | "purple" | null;
}

export type DateDisplay = "day" | "month" | "year";

export interface Milestone extends Timestamps, Orderable {
  id: UUID;
  title: string;
  category_id: UUID | null;
  issuer: string | null;
  organization: string | null;
  date: ISODateString | null;
  date_display: DateDisplay;
  description: string | null;
  badge_icon: string | null;
  image_url: string | null;
  pdf_url: string | null;
  certificate_url: string | null;
  external_url: string | null;
  featured: boolean;
}

export type SocialPlatform = "github" | "linkedin" | "email" | "website" | "facebook" | "other";

export interface SocialLink extends Timestamps, Orderable {
  id: UUID;
  platform: SocialPlatform;
  label: string;
  url: string;
}

export type DepartureStatus = "ready" | "up_next" | "planned";

export interface DepartureRow {
  destination: string;
  status: DepartureStatus;
  /** Icon key (e.g. "laptop", "palm", "mountain"); unknown keys fall back to a plane. */
  icon: string | null;
}

export interface SiteSettings {
  id: UUID;
  site_title: string;
  site_description: string;
  og_image_url: string | null;
  departures: DepartureRow[];
  /** Short handwritten line in the departure board corner. */
  departures_note: string | null;
  /** Handwritten line under THE SUMMIT. */
  summit_note: string | null;
  /** Closing paragraph on the Summit page. */
  summit_message: string | null;
  resume_enabled: boolean;
  updated_at: ISODateString;
}
