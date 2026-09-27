/**
 * Supabase `Database` type for the typed clients (`@/lib/supabase/*`).
 *
 * Hand-written to mirror `supabase/migrations/*` and derived from the domain
 * types in `./content.ts`, so the two cannot drift apart silently. If the
 * schema changes, update the migration, `content.ts`, and this file together
 * (or regenerate with `npx supabase gen types typescript` and compare).
 */
import type {
  AboutCard,
  AboutCardKind,
  ContentState,
  JourneyEntry,
  Milestone,
  MilestoneCategory,
  Profile,
  Project,
  ProjectImage,
  ProjectStatus,
  ProjectTechnology,
  SiteSettings,
  Skill,
  SkillCategory,
  SocialLink,
  SocialPlatform,
} from "./content";

/** Flattens interfaces into plain object types (interfaces don't satisfy `Record<string, unknown>`). */
type Plain<T> = { [K in keyof T]: T[K] };

type NullableKeys<T> = { [K in keyof T]-?: null extends T[K] ? K : never }[keyof T];

/** Columns every table fills in by default. */
type DefaultedColumns = "id" | "created_at" | "updated_at" | "display_order" | "is_visible";

/** Insert shape: nullable and defaulted columns become optional. `Extra` adds table-specific defaults. */
type Insert<Row, Extra extends keyof Row = never> = Plain<
  Omit<Row, NullableKeys<Row> | DefaultedColumns | Extra> &
    Partial<Pick<Row, Extract<NullableKeys<Row> | DefaultedColumns | Extra, keyof Row>>>
>;

interface Relationship {
  foreignKeyName: string;
  columns: string[];
  isOneToOne: boolean;
  referencedRelation: string;
  referencedColumns: string[];
}

type Table<Row, Rel extends Relationship[] = [], Extra extends keyof Row = never> = {
  Row: Plain<Row>;
  Insert: Insert<Row, Extra>;
  Update: Partial<Plain<Row>>;
  Relationships: Rel;
};

export type MilestoneAccent = NonNullable<MilestoneCategory["accent"]>;

export type Database = {
  public: {
    Tables: {
      profiles: Table<Profile, [], "headline_roles" | "tagline" | "intro" | "bio">;
      site_settings: Table<SiteSettings, [], "departures" | "resume_enabled" | "site_description">;
      about_cards: Table<AboutCard, [], "items">;
      skill_categories: Table<SkillCategory>;
      skills: Table<
        Skill,
        [
          {
            foreignKeyName: "skills_category_id_fkey";
            columns: ["category_id"];
            isOneToOne: false;
            referencedRelation: "skill_categories";
            referencedColumns: ["id"];
          },
        ],
        "featured"
      >;
      projects: Table<Project, [], "features" | "status" | "content_state" | "featured">;
      project_technologies: Table<
        ProjectTechnology,
        [
          {
            foreignKeyName: "project_technologies_project_id_fkey";
            columns: ["project_id"];
            isOneToOne: false;
            referencedRelation: "projects";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "project_technologies_skill_id_fkey";
            columns: ["skill_id"];
            isOneToOne: false;
            referencedRelation: "skills";
            referencedColumns: ["id"];
          },
        ]
      >;
      project_images: Table<
        ProjectImage,
        [
          {
            foreignKeyName: "project_images_project_id_fkey";
            columns: ["project_id"];
            isOneToOne: false;
            referencedRelation: "projects";
            referencedColumns: ["id"];
          },
        ],
        "alt"
      >;
      journey_entries: Table<JourneyEntry>;
      milestone_categories: Table<MilestoneCategory>;
      milestones: Table<
        Milestone,
        [
          {
            foreignKeyName: "milestones_category_id_fkey";
            columns: ["category_id"];
            isOneToOne: false;
            referencedRelation: "milestone_categories";
            referencedColumns: ["id"];
          },
        ],
        "featured"
      >;
      social_links: Table<SocialLink>;
    };
    Views: { [_ in never]: never };
    Functions: { [_ in never]: never };
    Enums: {
      about_card_kind: AboutCardKind;
      content_state: ContentState;
      milestone_accent: MilestoneAccent;
      project_status: ProjectStatus;
      social_platform: SocialPlatform;
    };
    CompositeTypes: { [_ in never]: never };
  };
};

export type TableName = keyof Database["public"]["Tables"];
export type TableRow<T extends TableName> = Database["public"]["Tables"][T]["Row"];
export type TableInsert<T extends TableName> = Database["public"]["Tables"][T]["Insert"];
export type TableUpdate<T extends TableName> = Database["public"]["Tables"][T]["Update"];
