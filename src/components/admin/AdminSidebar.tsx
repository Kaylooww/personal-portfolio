"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { ContentIcon } from "@/components/ui/ContentIcon";
import { LogoMark } from "@/components/ui/LogoMark";
import { ADMIN_NAV } from "@/lib/constants/admin-nav";
import { cn } from "@/lib/utils/cn";
import { SignOutButton } from "./SignOutButton";

function isActive(pathname: string, href: string): boolean {
  return href === "/admin" ? pathname === "/admin" : pathname === href || pathname.startsWith(`${href}/`);
}

/** Paper sidebar on large screens; a horizontally scrolling tab row on small ones. */
export function AdminSidebar() {
  const pathname = usePathname();
  const navRef = useRef<HTMLElement>(null);

  // On small screens the nav is a horizontal strip; keep the current section in view.
  useEffect(() => {
    const active = navRef.current?.querySelector<HTMLElement>('[aria-current="page"]');
    active?.scrollIntoView({ block: "nearest", inline: "center" });
  }, [pathname]);

  return (
    <aside className="border-b border-surface-edge bg-surface lg:sticky lg:top-0 lg:flex lg:h-dvh lg:flex-col lg:border-b-0 lg:border-r">
      <Link href="/admin" className="hidden items-center gap-3 px-6 pb-4 pt-6 lg:flex">
        <LogoMark className="h-7 text-blue-500" />
        <span className="leading-tight">
          <span className="font-display-heavy block text-lg uppercase text-ink">Base Camp</span>
          <span className="block text-xs font-bold text-ink-subtle">Portfolio admin</span>
        </span>
      </Link>

      <nav ref={navRef} aria-label="Admin sections" className="lg:flex-1 lg:overflow-y-auto lg:px-3">
        <ul className="flex gap-1 overflow-x-auto px-3 py-2 lg:flex-col lg:overflow-visible lg:p-0">
          {ADMIN_NAV.map((item) => {
            const active = isActive(pathname, item.href);
            return (
              <li key={item.href} className="shrink-0">
                <Link
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "flex items-center gap-3 whitespace-nowrap rounded-control px-3 py-2.5 text-sm font-extrabold transition-trail transition-colors",
                    active ? "bg-active text-link-strong" : "text-ink-muted hover:bg-active-soft hover:text-link",
                  )}
                >
                  <ContentIcon icon={item.icon} className="size-5" />
                  {item.label}
                </Link>
              </li>
            );
          })}
          <li className="shrink-0 lg:hidden">
            <SignOutButton />
          </li>
        </ul>
      </nav>

      <div className="hidden border-t border-surface-edge p-3 lg:block">
        <SignOutButton className="w-full" />
      </div>
    </aside>
  );
}
