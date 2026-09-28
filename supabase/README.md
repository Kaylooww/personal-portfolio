# supabase/

Database schema, security rules and starter content for the portfolio.
Design notes: `.context/DATABASE.md`.

| File | What it does |
|---|---|
| `migrations/20260927000001_schema.sql` | Enums, all tables, constraints, indexes, `updated_at` + `published_at` triggers |
| `migrations/20260927000002_rls.sql` | `private.admin_users`, `private.is_admin()`, RLS on every table |
| `migrations/20260927000003_storage.sql` | Public `portfolio-media` bucket + admin-only write policies |
| `seed.sql` | Starter content matching the site's current mock data |

## Test locally without Supabase

```bash
npm run db:test
```

Applies the migrations and seed to an in-memory Postgres (PGlite) and checks the
RLS rules as an anonymous visitor, a signed-in non-admin, and the admin.
No Docker or Supabase project required.

## Set up a real project

1. Create a project at [supabase.com](https://supabase.com) (free tier is fine).
2. Apply the migrations — either:
   - **CLI:** `npx supabase login`, `npx supabase link --project-ref <ref>`, `npx supabase db push`
   - **Dashboard:** SQL Editor → paste and run each migration file in order.
3. Load starter content: SQL Editor → run `seed.sql` (or `npx supabase db reset` on a local stack).
4. Create the admin login: **Authentication → Users → Add user** (email + password, auto-confirm).
   Keep the **Email provider enabled**, but turn off public sign-ups: Authentication → Sign In / Providers → **Allow new users to sign up: off**.
   (Disabling the Email provider itself blocks the admin from signing in — the login form will say so.)
5. Grant that email admin rights (SQL Editor):
   ```sql
   insert into private.admin_users (email) values (lower('you@example.com'));
   ```
6. Copy **Project URL**, **anon key** and **service_role key** (Project Settings → API) into `.env.local`
   and set `ADMIN_EMAIL` to the same email. The service-role key is server-only.

## Changing the schema

Add a new timestamped file in `migrations/` (never edit an applied one), then update
`src/types/content.ts`, `src/types/database.ts` and `.context/DATABASE.md` in the same change,
and run `npm run db:test`.
