# Deployment

> Initial outline. Completed with full step-by-step instructions in **Phase 18**.

## Targets
- **Supabase** — database, auth, storage (project created in Phase 9).
- **Vercel** — Next.js hosting.

## Outline
1. Create a Supabase project; run migrations from `supabase/migrations/` (this also creates the `portfolio-media` bucket and its policies); run `supabase/seed.sql`. Details: `supabase/README.md`.
2. Disable public sign-ups (Authentication → Providers → Email).
3. Create the single admin user in Supabase Auth; add the email to `private.admin_users`; set `ADMIN_EMAIL`.
4. Import the repository into Vercel (framework preset: Next.js).
5. Add environment variables from `.env.example` in Vercel (Production + Preview). `SUPABASE_SERVICE_ROLE_KEY` must **not** be prefixed `NEXT_PUBLIC_`.
6. Set `NEXT_PUBLIC_SITE_URL` to the production domain.
7. Deploy; verify public pages, admin login, publish → public update.
