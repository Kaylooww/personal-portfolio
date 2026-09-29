# Development

## Requirements and first run

- Node.js **24.x** and npm (tested with Node 24.19.0).
- A reachable Supabase project with the repository migrations and starter rows.
- Edge or Playwright Chromium for browser checks.

Use `npm ci` to install the lockfile. On first setup, copy `.env.example` to
`.env.local`, fill in the values below, then run `npm run dev`. Windows PowerShell:

```powershell
npm ci
Copy-Item .env.example .env.local
# Edit .env.local before starting the server.
npm run dev
```

Keep an existing `.env.local`. On macOS/Linux, use `cp` for the copy.
The owner's Supabase project is already set up; a new project follows
[supabase/README.md](supabase/README.md). The application has no mock-data mode.

## Environment

| Variable | Local value / purpose |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | `http://localhost:3000`; canonical origin, sitemap and share URLs. Match the port when testing another local port. |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project HTTPS URL. Required for reads, auth and uploads. |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Publishable key (`sb_publishable_…`); a legacy anon key also works. The variable retains its original name. |
| `ADMIN_EMAIL` | Email of the confirmed Auth user, also listed in `private.admin_users`. |
| `SUPABASE_SERVICE_ROLE_KEY` | Optional secret/legacy service-role key for the server-only maintenance client. No current app route or action calls this client; normal admin writes use session + RLS. |
| `SUPABASE_STORAGE_BUCKET` | Keep `portfolio-media`. Uploads use `MEDIA_BUCKET` in `src/lib/storage/media.ts`; this variable alone cannot rename the bucket. |

Keep secrets in the ignored `.env.local`. Never give a secret/service-role key a
`NEXT_PUBLIC_` name. Public Supabase keys are used with RLS. See
[Supabase's key guide](https://supabase.com/docs/guides/getting-started/api-keys)
for publishable versus secret keys.

Restart development after changing environment values. Rebuild production after
changing public values because Next.js embeds them during the build. The installed
guide is `node_modules/next/dist/docs/01-app/02-guides/environment-variables.md`.

## Verification

Stop any server using the existing production build before rebuilding it.

```powershell
npm run check
npm run db:test
npm run start -- --port 3100
```

In a second terminal:

```powershell
npm run test:seo -- http://localhost:3100
$env:BROWSER_CHANNEL = 'msedge'
npm run test:browser -- http://localhost:3100
```

For bundled Chromium, run `npx playwright install chromium` and leave
`BROWSER_CHANNEL` unset. On macOS/Linux with Edge installed, use
`BROWSER_CHANNEL=msedge npm run test:browser -- http://localhost:3100`.

The smoke scripts are read-only; the browser script attempts one invalid login.
Neither needs the owner's password. The SEO script expects local Next production
cache headers; use the deployment checklist for hosted validation. It verifies
canonical consistency, so separately verify the intended origin. See
[Testing](.context/TESTING.md) for manual admin coverage and limits.
No CI workflow is configured; run checks before merging.

## Working on the application

1. Read [CHECKPOINTS.md](CHECKPOINTS.md), the [context index](.context/README.md),
   [current state](.context/CURRENT_STATE.md), and the task's context document.
2. Keep content in Supabase. Public queries live in `src/lib/queries/`; admin
   actions in `src/lib/actions/` verify the session and validate input with Zod.
3. Prefer Server Components. Reuse the tokens in `src/styles/globals.css` and the
   existing paper, wood, map and flag components. The last route is `/summit`.
4. Read the relevant installed Next.js guide in `node_modules/next/dist/docs/`
   before changing framework behavior. This project uses Next 16 `proxy.ts`.
5. Run relevant checks and update the current state, changelog and affected docs.

Public queries use a cookie-less client and RLS. Pages use hourly ISR; admin actions
invalidate affected routes (shared content invalidates the public layout). Direct
SQL edits appear through regeneration after the interval. Admin reads use the
signed-in user's session. Do not replace them with the service client.

For schema changes, add a migration, update the domain/database types, run
`npm run db:test`, and follow the [database workflow](supabase/README.md).
Use a separate Supabase project for destructive tests; local admin edits against
the owner's project change real content.

## Troubleshooting

| Symptom | Check |
|---|---|
| Build fails generating public pages | Supabase URL/key, network, project availability and migrations. Builds query real content. |
| Admin credentials rejected | Email provider enabled, confirmed Auth user, matching `ADMIN_EMAIL`, correct password. |
| Admin opens but saves/uploads fail | Lower-case email in `private.admin_users`; RLS and storage migrations applied. |
| File rejected | Images: PNG/JPEG/WebP/AVIF up to 5 MB. Résumé: PDF up to 10 MB. SVG is not accepted. |
| Remote image falls back | URL accessible; `next.config.ts` permits Supabase HTTPS public-storage paths. Other hosts need explicit configuration and a rebuild. |
| Project missing publicly | Published + visible; drafts, archived and hidden projects are excluded. |
| Skill missing from board | Assign it to a visible category and enable skill visibility. |
| Résumé button absent | Upload a PDF in Profile and enable résumé download in Settings. |
| Browser executable missing | Install Chromium or set `BROWSER_CHANNEL=msedge` when Edge is installed. |
| Local process fails with a permissions error | Use a terminal permitted to start Node worker/browser processes. |
