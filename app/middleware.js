import { NextResponse } from "next/server";
import { ADMIN_TOKEN_COOKIE } from "@/app/lib/adminSession";
import { verifyAdminJwtCompact } from "@/app/lib/adminAuthJwt";
import { attachClearedAdminTokenCookie } from "@/app/lib/adminCookieResponse";

const NO_STORE = "private, no-store, max-age=0, must-revalidate";

function readToken(request) {
  return request.cookies.get(ADMIN_TOKEN_COOKIE)?.value ?? null;
}

export async function middleware(request) {
  const { pathname } = request.nextUrl;
  const token = readToken(request);
  const valid = token ? await verifyAdminJwtCompact(token) : false;

  if (pathname === "/admin/login" || pathname.startsWith("/admin/login/")) {
    if (token && !valid) {
      const res = NextResponse.next();
      attachClearedAdminTokenCookie(res);
      res.headers.set("Cache-Control", NO_STORE);
      return res;
    }
    if (valid) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
    const res = NextResponse.next();
    res.headers.set("Cache-Control", NO_STORE);
    return res;
  }

  if (pathname === "/admin" || pathname.startsWith("/admin/")) {
    if (!valid) {
      const res = NextResponse.redirect(new URL("/admin/login", request.url));
      if (token) attachClearedAdminTokenCookie(res);
      return res;
    }
    const res = NextResponse.next();
    res.headers.set("Cache-Control", NO_STORE);
    return res;
  }

  if (pathname.startsWith("/api/admin")) {
    if (!valid) {
      const res = NextResponse.json({ message: "Unauthorized." }, { status: 401 });
      if (token) attachClearedAdminTokenCookie(res);
      return res;
    }
    const res = NextResponse.next();
    res.headers.set("Cache-Control", NO_STORE);
    return res;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin", "/admin/:path*", "/api/admin", "/api/admin/:path*"],
};
