# Final Testing — Phase 17

Tested on 2026-09-29 against a local **production build** and the configured Supabase project. Browser: headless Microsoft Edge 154 through Playwright; mobile sizes are viewport emulation, not physical devices.

## Repeatable checks

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

`test:browser` and `test:seo` are read-only and need no admin credentials. The browser test submits one deliberately invalid login; it sends no email. To use Playwright's bundled Chromium instead of installed Edge, run `npx playwright install chromium` and leave `BROWSER_CHANNEL` unset. Browser binaries are separate from `npm install`.

## Executed matrix

| Area | Cases | Result |
|---|---|---|
| Public routes | Seven checkpoints and the published project detail; one main landmark and h1; eight internal destinations | Passed |
| Responsive public UI | Each public page at 320, 375, 430, 768, 1024, 1440 and 1920px (56 layouts); fonts/layout settled before measurement | Passed; no horizontal overflow |
| Public accessibility | axe WCAG 2.0/2.1 A/AA at 375 and 1440px, all eight pages (16 audits) | Passed; zero violations |
| Navigation / keyboard | Skip link to main; mobile map has seven links; keyboard open, Escape, focus return; navigate all checkpoints | Passed |
| Search and filters | Project search with no matches, clear/reset, each available status; each milestone category and Show all | Passed |
| Unknown routes | Unknown path, missing project, `/peak`; one public shell, HTTP 404 and noindex | Passed |
| Public SEO | Titles, descriptions, canonical/OG URLs, Twitter cards, query canonical, sitemap, robots, icons, 1200×630 fallback and ISR headers | Passed on final production build |
| Signed-out auth | Dashboard, settings, new project and media redirect to login; external return URL becomes `/admin`; invalid credentials receive a generic error | Passed |
| Signed-in auth | Admin session follows safe return path; logout removes access; real non-admin password login rejected; injected non-admin session reaches unauthorized; live RLS denies its write | Passed; temporary auth account deleted |
| Auth provider | Email enabled and public sign-ups disabled | Verified via Supabase settings |
| Owner password | Sign in with the owner's usual password | Awaiting owner confirmation; no password reset performed |
| Admin routes | Dashboard, Profile, About, Skills/list/new/edit/categories, Projects/list/new/edit, Journey, Milestones/list/new/categories, Settings and Media | Passed; 16 pages |
| Admin layout / accessibility | 320/375/1440px (48 layouts); axe A/AA at 375/1440px (32 audits) | Passed; no overflow or violations |
| Projects | Required fields, draft privacy, publish, hide/show, archive/restore, unpublish, delete confirmation/cancel, screenshot cascade | Passed; public pages and sitemap update after mutations |
| Images / gallery | Reject SVG; upload PNG; optimized hero and thumbnail OG; two screenshots; alt text, reorder; native gallery lazy loading; failed-image fallback | Passed |
| Rejected gallery feedback | Invalid screenshot must not also announce success; mixed batch counts only saved screenshots | Fixed and passed on final build: rejected-only batch has no success; mixed batch reports exactly two saved screenshots |
| Admin search / featured | URL search returns the matching fixture; featured toggle persists | Passed |
| Media | Referenced file's delete disabled and excluded from Unused | Passed |
| Skills / categories | Create, proficiency validation, visibility, category visibility; deleting category retains uncategorised skill; delete fixture | Passed; public gear board follows visibility |
| About / Journey | Create, edit, hide/show, confirmed deletion | Passed; public content refreshes |
| Milestones / categories | Category and milestone creation, edit, hide/show, deletion | Passed; public content refreshes |
| Profile / settings | Edit profile tagline and SEO title, observe public output, restore | Passed |
| Share image | Upload custom image; OG and Twitter use it; removing it restores generated fallback | Passed |
| Résumé | Upload PDF; enable link, fetch with PDF MIME type, hide, remove | Passed |
| Social links | Save owner's GitHub and LinkedIn in admin; publish both; verify Summit destinations | Passed; intentional content change retained |
| Database rules | PGlite migrations, seed, anon/non-admin/admin RLS, storage policies, constraints and triggers | Passed |

## Fixes and cleanup

- Screenshot uploads previously reported success even if every file was rejected. Success now depends on the number of screenshots saved; failures still report their individual errors.
- Removed an obsolete phase reference from the share-image uploader's user-facing hint.
- Temporary content and uploaded media were removed. Original table content was compared after cleanup, excluding `updated_at` timestamps changed by ordinary edits. The owner's GitHub/LinkedIn updates remain in Supabase.
- No browser exceptions occurred in the completed public/admin page audits.
- Final `npm run check`, `npm run db:test`, `npm run test:seo -- http://localhost:3100` and `npm run test:browser -- http://localhost:3100` all passed. Across public and admin: 104 layouts and 48 automated accessibility audits.
- Final cleanup audit matched all 12 content tables to their pre-test values (except timestamps), found zero Storage objects and one original Auth user. No QA records, files or accounts remain.

## Limits and remaining owner checks

- Owner password sign-in confirmation is pending. Generated admin sessions verified protected pages and actions; a temporary non-admin account exercised real password authentication and rejection.
- Automated accessibility checks supplement the keyboard checks; they do not replace a screen-reader review.
- Safari, Firefox and physical mobile devices have not been tested in this environment.
- Final HTTPS domain, deployment cache behavior, real social crawlers and field performance remain launch checks in [DEPLOYMENT.md](../DEPLOYMENT.md). Phase 18 supplies the guide; hosted checks have not been performed. No Lighthouse or Core Web Vitals score is claimed.
- Email contact, profile photo, résumé and final portfolio content remain owner content decisions. The temporary PDF used for testing was removed.
