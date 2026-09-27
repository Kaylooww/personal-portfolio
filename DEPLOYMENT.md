# Deployment

> Initial outline. Completed with full step-by-step instructions in **Phase 18**.

## Targets
- **Supabase** — database, auth, storage (project created in Phase 9).
- **Vercel** — Next.js hosting.

## Outline
1. Create a Supabase project; run migrations from `supabase/migrations/`; run `supabase/seed.sql`.
2. Create the storage bucket (`portfolio-media`) and apply storage policies.
3. Create the single admin user in Supabase Auth; set `ADMIN_EMAIL`.
4. Import the repository into Vercel (framework preset: Next.js).
5. Add environment variables from `.env.example` in Vercel (Production + Preview). `SUPABASE_SERVICE_ROLE_KEY` must **not** be prefixed `NEXT_PUBLIC_`.
6. Set `NEXT_PUBLIC_SITE_URL` to the production domain.
7. Deploy; verify public pages, admin login, publish → public update.
