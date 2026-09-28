import type { ReactNode } from "react";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { ToastProvider } from "@/components/ui/Toast";
import { requireAdmin } from "@/lib/auth/admin";

/**
 * Everything in (protected) requires the admin. The proxy already bounced
 * signed-out visitors; this re-verifies with Supabase Auth on the server.
 * Pages call requireAdmin() too, because layouts don't re-render on every
 * client-side navigation.
 */
export default async function ProtectedAdminLayout({ children }: { children: ReactNode }) {
  const user = await requireAdmin();

  return (
    <ToastProvider>
      <div className="lg:grid lg:grid-cols-[16rem_minmax(0,1fr)]">
        <AdminSidebar />
        <div className="min-w-0">
          <AdminHeader email={user.email} />
          <main id="main" tabIndex={-1} className="px-(--page-gutter) py-8 outline-none lg:py-10">
            <div className="mx-auto max-w-6xl">{children}</div>
          </main>
        </div>
      </div>
    </ToastProvider>
  );
}
