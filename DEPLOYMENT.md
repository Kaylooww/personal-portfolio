# Deployment — Supabase + Vercel

## Release status

Application and documentation phases are complete. Supabase is provisioned and
local production checks passed. **A Vercel deployment and final HTTPS domain have
not been verified.** This guide is the launch handoff; pending owner content,
sign-in and device checks are in [Current State](.context/CURRENT_STATE.md).

## 1. Prepare Supabase

Keep the existing owner database and content. Its three migrations, seed, public
`portfolio-media` bucket and allowlisted Auth user are already present.
For a fresh project, follow [supabase/README.md](supabase/README.md) before building.
Do not rerun the seed on an existing content database.

Confirm:

- Email provider enabled; public sign-ups disabled; admin Auth user confirmed.
- The same email is in `private.admin_users` and the app's `ADMIN_EMAIL`.
- Public reads expose only visible content and published projects.
- `portfolio-media` exists with public reads and admin-only writes.

The app uses email/password login and has no OAuth, email-link callback or
self-service password-reset route. Keep the password out of environment variables.
See [Supabase Auth configuration](https://supabase.com/docs/guides/auth/general-configuration).

## 2. Verify locally

Use Node 24.x, install with `npm ci`, and configure `.env.local` using
[Development](DEVELOPMENT.md). Run:

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

Complete these checks before committing and pushing the release to the connected
Git repository. Results and coverage limits: [Testing](.context/TESTING.md).

## 3. Create the Vercel project

Import the repository and select the directory containing `package.json`
as the Root Directory. Configure:

| Setting | Value |
|---|---|
| Framework preset | Next.js |
| Node.js version | 24.x (also declared in `package.json`) |
| Install command | `npm ci` |
| Build command | `npm run build` |
| Output directory | Framework default; leave override disabled |
| Production branch | The branch chosen for releases |

Vercel supports Next.js routing, rendering and ISR through its framework integration.
This app needs server execution for authentication, actions and regeneration;
keep the normal Next.js build. No `vercel.json` is needed for this setup. See
[Next.js on Vercel](https://vercel.com/docs/frameworks/full-stack/nextjs).
Node 24.x is supported and the package engine declaration selects its major version.
See [Node versions](https://vercel.com/docs/functions/runtimes/node-js/node-js-versions).

## 4. Configure environment variables before building

Set these for **Production**, and configure **Preview** separately:

| Name | Value |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | Final HTTPS origin, e.g. `https://your-project.vercel.app` or custom domain. No route, query or fragment. |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Publishable key; the existing variable name also accepts a legacy anon key |
| `ADMIN_EMAIL` | Confirmed, allowlisted administrator email |
| `SUPABASE_STORAGE_BUCKET` | `portfolio-media` |

`SUPABASE_SERVICE_ROLE_KEY` is optional for the current app. Only the unused
server-only maintenance client reads it. If needed for maintenance, store the
secret/legacy service-role key as a server secret. Normal admin edits and uploads
use session + RLS. See [Supabase API keys](https://supabase.com/docs/guides/getting-started/api-keys).

Public variables are embedded during the build. Changing Vercel environment values
requires a new deployment; existing deployments keep previous values. See
[Vercel environment variables](https://vercel.com/docs/environment-variables).

Use a separate Supabase project for previews that test content changes. A preview
connected to production writes to the same data/media. Revalidation happens within
the deployment running the action; production can retain its cached page until
regeneration. Keep preview access restricted with deployment protection. Public-page
robots metadata does not itself distinguish previews. See
[Vercel deployment protection](https://vercel.com/docs/deployment-protection).

Use the production origin for preview canonical URLs. When `NEXT_PUBLIC_SITE_URL`
is absent, the app falls back to `VERCEL_PROJECT_PRODUCTION_URL`, then localhost.
Set it explicitly in Production to avoid publishing localhost URLs.

The upload bucket name is fixed in the storage migration and shared `MEDIA_BUCKET`
constant. Renaming requires coordinated migration, code and stored-URL changes;
changing the environment variable alone is insufficient.

## 5. Deploy and attach the domain

Deploy after configuring the environment. Builds read Supabase to generate pages,
project paths, sitemap and share image; the project must be reachable.
Inspect the build log for successful compilation and route generation.

For a custom domain, add it in Vercel's project Domains settings, apply the DNS
records shown there, and wait for domain/TLS verification. Set
`NEXT_PUBLIC_SITE_URL` to that HTTPS origin and redeploy before release. Configure
the preferred domain and redirects in Vercel; the app normalizes metadata but does
not redirect alternate hostnames itself. Follow
[Vercel domain setup](https://vercel.com/docs/domains/working-with-domains/add-a-domain).

## 6. Validate the hosted release

Run this checklist on the final HTTPS origin. Local scripts provide the baseline;
hosting can change response/cache headers and access protection.

- [ ] Seven checkpoints and every published project open on desktop and mobile.
- [ ] Owner signs in with the usual password; refresh preserves access and logout removes it.
- [ ] Signed-out admin URLs redirect to login; drafts/hidden/archived projects and unknown URLs return 404.
- [ ] A deliberate admin edit appears publicly; a temporary draft can be published, verified and removed.
- [ ] Image upload and optimized rendering work; Media protects referenced files. Remove temporary files.
- [ ] Review profile copy, journey dates, project claims and milestones; keep sample projects as drafts.
- [ ] GitHub and LinkedIn open the owner's profiles. Add contact email and optional photo/résumé.
- [ ] Sitemap contains the final HTTPS origin and public routes only; robots excludes admin.
- [ ] Canonical, Open Graph and Twitter URLs use the final domain; admin/404 remain noindex.
- [ ] Share image returns a 1200×630 PNG; favicons/custom image work. Check a real social-platform preview.
- [ ] Complete keyboard, screen-reader and physical mobile review; check Safari/Firefox as available.
- [ ] Review deployment logs and measure hosted performance. Record results without inferring Core Web Vitals from local tests.

Record the verified URL, deployment date and remaining items in
[Current State](.context/CURRENT_STATE.md). This checklist stays pending until
hosted checks are performed.

## Content, backups and future releases

Use the [admin guide](.context/ADMIN.md). Saves invalidate affected pages; hourly
regeneration catches direct database changes. Share image and sitemap also use
hourly regeneration. Images accept PNG/JPEG/WebP/AVIF up to 5 MB; résumé PDFs up to
10 MB. The bucket is public: hiding a content row does not make its media URL private.

Keep database backups and separate copies of uploaded files. Database backups
include Storage metadata, not file objects. See
[Supabase backups](https://supabase.com/docs/guides/platform/backups).

For code rollback, use a known-good deployment after checking schema compatibility.
Hosting rollback does not undo database edits or restore deleted uploads. Database
changes need a reviewed migration or restore plan. See
[Vercel rollback](https://vercel.com/docs/instant-rollback).

Add migrations instead of editing applied files, review lockfile changes, rerun
checks, and verify each hosted release. Common errors are covered in
[Development troubleshooting](DEVELOPMENT.md#troubleshooting).
