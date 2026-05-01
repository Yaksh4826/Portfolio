"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import LogoutButton from "@/components/admin/LogoutButton";

const LINKS = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/projects", label: "Projects" },
  { href: "/admin/profile", label: "Profile" },
  { href: "/admin/techstack", label: "Tech stack" },
  { href: "/admin/experience", label: "Experience" },
];

/**
 * Layout only — `middleware` enforces `admin_token` on all /admin/* except /admin/login.
 */
export default function AdminChrome({ children }) {
  const pathname = usePathname();
  const isLogin = pathname === "/admin/login";

  if (isLogin) {
    return (
      <div className="min-h-[70vh] px-4 py-10 sm:px-6">
        <div className="mx-auto w-full max-w-md">{children}</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 px-4 pb-16 pt-4 lg:flex-row lg:px-8">
      <aside className="shrink-0 lg:w-52">
        <div className="sticky top-28 rounded-2xl border border-border bg-card p-4 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Admin
          </p>
          <nav className="mt-3 flex flex-col gap-1">
            {LINKS.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={cn(
                  "rounded-lg px-3 py-2 text-sm font-medium transition",
                  pathname === href
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
              >
                {label}
              </Link>
            ))}
          </nav>
          <div className="mt-4 border-t border-border pt-4">
            <Link
              href="/"
              className="block rounded-lg px-3 py-2 text-sm text-muted-foreground transition hover:bg-muted hover:text-foreground"
            >
              ← View site
            </Link>
            <LogoutButton />
          </div>
        </div>
      </aside>
      <main className="min-w-0 flex-1">{children}</main>
    </div>
  );
}
