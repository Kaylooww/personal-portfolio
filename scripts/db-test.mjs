// npm run db:test
//
// Applies supabase/migrations/* + supabase/seed.sql to an in-memory Postgres
// (PGlite — no Docker or Supabase project needed) with minimal stand-ins for
// Supabase's auth.jwt(), API roles and storage tables, then exercises the RLS
// policies as an anonymous visitor, a signed-in non-admin, and the admin.
import { PGlite } from "@electric-sql/pglite";
import { readFileSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..", "supabase");
const db = new PGlite();
let failures = 0;
const check = (name, ok, detail = "") => {
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}${detail ? `  (${detail})` : ""}`);
  if (!ok) failures++;
};

// ── Supabase stand-ins ──
await db.exec(`
  create role anon nologin;
  create role authenticated nologin;
  create schema auth;
  create function auth.jwt() returns jsonb language sql stable as
    $$ select coalesce(nullif(current_setting('request.jwt.claims', true), ''), '{}')::jsonb $$;
  grant usage on schema auth to anon, authenticated;
  grant execute on function auth.jwt() to anon, authenticated;
  create schema storage;
  create table storage.buckets (id text primary key, name text not null, public boolean default false,
    file_size_limit bigint, allowed_mime_types text[]);
  create table storage.objects (id uuid primary key default gen_random_uuid(), bucket_id text references storage.buckets(id), name text);
  alter table storage.objects enable row level security;
  grant usage on schema public, storage to anon, authenticated;
`);

for (const f of readdirSync(join(root, "migrations")).filter((f) => f.endsWith(".sql")).sort()) {
  try {
    await db.exec(readFileSync(join(root, "migrations", f), "utf8"));
    check(`migration ${f}`, true);
  } catch (e) {
    check(`migration ${f}`, false, e.message);
  }
}
// Supabase grants table privileges to API roles by default; RLS then restricts rows.
await db.exec(`
  grant select, insert, update, delete on all tables in schema public to anon, authenticated;
  grant select, insert, update, delete on storage.objects to anon, authenticated;
`);
try {
  await db.exec(readFileSync(join(root, "seed.sql"), "utf8"));
  check("seed.sql", true);
} catch (e) {
  check("seed.sql", false, e.message);
}

async function as(role, email, fn) {
  await db.exec("reset role");
  await db.query(`select set_config('request.jwt.claims', $1, false)`, [email ? JSON.stringify({ email }) : ""]);
  await db.exec(`set role ${role}`);
  try {
    return await fn();
  } finally {
    await db.exec("reset role");
  }
}
const count = async (sql) => Number((await db.query(sql)).rows[0].n);
const fails = async (sql) => {
  try {
    await db.query(sql);
    return false;
  } catch {
    return true;
  }
};

// ── Anonymous visitor ──
await as("anon", null, async () => {
  check("anon sees only published projects", (await count("select count(*) n from projects")) === 1);
  check("anon sees technologies of published project only", (await count("select count(*) n from project_technologies")) === 5);
  check("anon sees all visible skills", (await count("select count(*) n from skills")) === 11);
  check("anon sees no hidden social links", (await count("select count(*) n from social_links")) === 0);
  check("anon sees profile + settings", (await count("select (select count(*) from profiles) + (select count(*) from site_settings) n")) === 2);
  check("anon cannot insert projects", await fails("insert into projects (title, slug, short_description) values ('x','x','x')"));
  check("anon cannot read admin list", await fails("select * from private.admin_users"));
  check("anon cannot upload media", await fails("insert into storage.objects (bucket_id, name) values ('portfolio-media','a.png')"));
  check("anon can read media rows", (await count("select count(*) n from storage.objects")) === 0);
});

// ── Signed-in, not an admin ──
await as("authenticated", "stranger@example.com", async () => {
  check("non-admin sees only published projects", (await count("select count(*) n from projects")) === 1);
  check("non-admin cannot update profile", (await db.query("update profiles set bio = 'hacked' returning id")).rows.length === 0);
  check("non-admin cannot insert skills", await fails("insert into skills (name, slug) values ('x','x')"));
});

// ── Admin ──
await db.exec("insert into private.admin_users (email) values ('admin@example.com')");
await as("authenticated", "Admin@Example.com", async () => {
  check("admin sees drafts too", (await count("select count(*) n from projects")) === 4);
  check("admin sees hidden social links", (await count("select count(*) n from social_links")) === 3);
  await db.query("insert into projects (title, slug, short_description, content_state) values ('New', 'new-one', 'Desc', 'published')");
  const r = await db.query("select published_at is not null as stamped from projects where slug = 'new-one'");
  check("admin can insert; published_at auto-stamped", r.rows[0]?.stamped === true);
  check("admin can update profile", (await db.query("update profiles set bio = 'ok' returning id")).rows.length === 1);
  check("admin can upload media", !(await fails("insert into storage.objects (bucket_id, name) values ('portfolio-media','a.png')")));
  check("admin cannot upload to another bucket", await fails("insert into storage.objects (bucket_id, name) values ('other','a.png')"));
});

// ── Constraints ──
const milestoneDefaults = await db.query("insert into milestones (title) values ('Date display test') returning date_display, pdf_url");
check("milestone defaults preserve month/year labels", milestoneDefaults.rows[0].date_display === "month" && milestoneDefaults.rows[0].pdf_url === null);
check("invalid milestone date display rejected", await fails("update milestones set date_display = 'week' where title = 'Date display test'"));
check("non-http PDF URL rejected", await fails("update milestones set pdf_url = 'javascript:alert(1)' where title = 'Date display test'"));
for (const precision of ["day", "month", "year"]) {
  await db.query("update milestones set date_display = $1, pdf_url = 'https://example.com/certificate.pdf' where title = 'Date display test'", [precision]);
}
check("milestones accept every date precision and a PDF", (await db.query("select date_display, pdf_url from milestones where title = 'Date display test'")).rows[0].date_display === "year");
check("second profile row rejected (singleton)", await fails("insert into profiles (full_name, display_first, display_last) values ('a','a','a')"));
check("bad slug rejected", await fails("insert into skill_categories (name, slug) values ('X', 'Bad Slug')"));
check("non-http URL rejected", await fails("update projects set demo_url = 'javascript:alert(1)' where slug = 'expedition-portfolio'"));
check("finished before started rejected", await fails("update projects set started_on = '2026-01-01', finished_on = '2025-01-01' where slug = 'expedition-portfolio'"));
const before = (await db.query("select updated_at from journey_entries order by display_order limit 1")).rows[0].updated_at;
await new Promise((r) => setTimeout(r, 20));
await db.exec("update journey_entries set title = title where display_order = 1");
const after = (await db.query("select updated_at from journey_entries order by display_order limit 1")).rows[0].updated_at;
check("updated_at trigger fires", after > before);

console.log(failures === 0 ? "\nALL CHECKS PASSED" : `\n${failures} CHECK(S) FAILED`);
process.exit(failures ? 1 : 0);
