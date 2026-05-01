import { NextResponse } from "next/server";
import { ADMIN_TOKEN_COOKIE, ADMIN_TOKEN_VALUE } from "@/app/lib/adminSession";

/** No cookie required — login + unlock flows. */
const PUBLIC_ADMIN_APIS = new Set(["/api/admin/auth", "/api/admin/logout"]);

function hasValidAdminToken(request) {
  const t = request.cookies.get(ADMIN_TOKEN_COOKIE);
  return Boolean(t?.value && t.value === ADMIN_TOKEN_VALUE);
}

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  // ── Admin UI (App Router pages) ──────────────────────────────────────
  if (pathname === "/admin" || pathname.startsWith("/admin/")) {
    if (pathname === "/admin/login" || pathname.startsWith("/admin/login/")) {
      return NextResponse.next();
    }
    if (!hasValidAdminToken(request)) {
      const login = new URL("/admin/login", request.url);
      return NextResponse.redirect(login);
    }
    return NextResponse.next();
  }

  // ── Admin APIs ───────────────────────────────────────────────────────
  if (pathname.startsWith("/api/admin")) {
    if (PUBLIC_ADMIN_APIS.has(pathname)) {
      return NextResponse.next();
    }
    if (!hasValidAdminToken(request)) {
      return NextResponse.json(
        { message: "Unauthorized: invalid or missing admin_token." },
        { status: 401 },
      );
    }
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin", "/admin/:path*", "/api/admin/:path*"],
};
