# Supabase

Schema, security rules and starter content. Design details:
[Database](../.context/DATABASE.md) and [Content model](../.context/CONTENT_MODEL.md).
The owner's live project already has these migrations and seed; preserve its content.

| File | Purpose |
|---|---|
| `migrations/20260927000001_schema.sql` | Enums, tables, constraints, indexes and timestamp/publishing triggers |
| `migrations/20260927000002_rls.sql` | Private admin allowlist, helper and table RLS |
| `migrations/20260927000003_storage.sql` | Public `portfolio-media` bucket and admin-only writes |
| `seed.sql` | Starter content; sample projects draft, social placeholders hidden |

## Fresh project setup

1. Create a Supabase project and wait for its database to be available.
2. In its SQL Editor, run the three migration files above in order, once each.
3. Run `seed.sql` once on the fresh database. It is not safe to rerun on an existing portfolio.
4. Keep the **Email provider enabled** and disable **Allow new users to sign up**.
   Create the administrator under Authentication → Users with email, password and
   confirmed email status. Existing confirmed users can sign in when sign-ups are
   off. See [Auth configuration](https://supabase.com/docs/guides/auth/general-configuration).
5. Grant the same email database rights in the SQL Editor:

   ```sql
   insert into private.admin_users (email)
   values (lower('you@example.com'))
   on conflict (email) do nothing;
   ```

6. Put the project URL and publishable key into `.env.local` under
   `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`. Set `ADMIN_EMAIL`
   to the same email. These variable names accept modern keys despite their legacy
   terminology. The secret/service-role key is optional for the server-only
   maintenance helper; no app route requires it. See
   [API keys](https://supabase.com/docs/guides/getting-started/api-keys).
7. Start the app, sign in at `/admin/login`, and verify a reversible save/upload.
   Confirm drafts remain private; remove temporary content/files afterward.

Keep `private` outside exposed API schemas. Normal writes use the signed-in admin's
session; app email and database allowlist must match. Manage the Auth account in
Supabase; the app has no registration or self-service password recovery screen.

## Storage

Keep the bucket named `portfolio-media`. Its migration allows public reads and
admin writes, with a 10 MB limit and PNG/JPEG/WebP/AVIF/PDF MIME types.
Uploaders enforce 5 MB for images and 10 MB for PDFs; SVG is rejected.
Folders: `profile`, `projects`, `skills`, `milestones`, `resume`, `site`.

`SUPABASE_STORAGE_BUCKET` alone does not configure uploads: the shared
`MEDIA_BUCKET` constant and migration name this bucket too. Public URLs are stored
in content rows and stay accessible when a row is hidden. Back up file objects
separately from the database.

## Tests and future migrations

```powershell
npm run db:test
```

This applies migrations and seed to in-memory PostgreSQL (PGlite), checking RLS as
anon/non-admin/admin, constraints and triggers. It needs neither Docker nor live
credentials and does not mutate the hosted database.

For schema changes:

1. Add a timestamped migration; never edit an applied migration.
2. Update `src/types/content.ts`, `src/types/database.ts` and database docs.
3. Run `npm run db:test` and app checks. Verify Auth/Storage changes in a separate hosted test project.
4. Back up the target, review the SQL, and apply only the new migration.

### Optional CLI workflow

This repository has SQL migrations and no `supabase/config.toml`. To adopt the
CLI, initialize configuration with `npx supabase init`, then authenticate and link:

```powershell
npx supabase login
npx supabase link --project-ref YOUR_PROJECT_REF
npx supabase migration list
```

SQL Editor execution does not populate CLI migration history. For an existing
project, compare its schema with the SQL files and reconcile history before
`db push`, which could otherwise recreate existing objects. For a fresh linked
project with no migrations applied, `npx supabase db push` applies the files in
order. Load the seed once through SQL Editor afterward. Follow
[Supabase's migration workflow and history guidance](https://supabase.com/docs/guides/deployment/database-migrations).

For the current live project, continue reviewed SQL Editor migrations until history
is deliberately reconciled. Do not use a database reset as a release step.
