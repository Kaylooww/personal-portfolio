Phases 10–11: admin authentication and project management

Phase 10 — Authentication + Admin Foundation
- Supabase email/password sign-in via Server Action (generic errors;
  non-admin accounts are signed straight back out)
- src/proxy.ts refreshes the session and redirects signed-out /admin/*
  requests to /admin/login?next=… (next sanitised, no open redirects)
- requireAdmin() checks getUser() + ADMIN_EMAIL in the protected
  layout and every admin page; /admin/unauthorized for non-admins
- "Base Camp" admin shell: sidebar (tab row on mobile), header,
  logout, noindex; dashboard with live stats and quick actions
- Placeholder pages for sections built in later phases

Phase 11 — Project Management
- /admin/projects: list of all projects with URL-based search and
  state/status filters, move up/down ordering, featured and
  visibility toggles, publish/unpublish, archive/restore, delete
  with confirmation
- /admin/projects/new and /[id]/edit: React Hook Form + zod editor
  (auto slug, summary counter, status, role, story fields, features,
  tech stack picker, links, dates, featured/visible), same schema
  re-validated in the Server Actions
- Thumbnail and screenshot uploads straight to Supabase Storage;
  screenshot alt text, captions, reordering and deletion
- Deleting or replacing images removes the stored files
- Toasts, confirm dialog, reusable form fields, ActionResult with
  friendly database error mapping

Docs: ADMIN, ROUTES, COMPONENTS, ARCHITECTURE, CHANGELOG,
CURRENT_STATE, CHECKPOINTS, supabase/README, DEPLOYMENT updated.