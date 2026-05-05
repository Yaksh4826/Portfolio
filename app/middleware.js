import { NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { ADMIN_TOKEN_COOKIE } from "@/app/lib/adminSession";
import { getAdminJwtSecretBytes } from "@/app/lib/adminJwt";

async function isValidAdminJwt(request) {
  const token = request.cookies.get(ADMIN_TOKEN_COOKIE)?.value;
  if (!token) return false;
  try {
    const secret = await getAdminJwtSecretBytes();
    await jwtVerify(token, secret);
    return true;
  } catch {
    return false;
  }
}

export async function middleware(request) {
  const { pathname } = request.nextUrl;
  const valid = await isValidAdminJwt(request);

  if (pathname === "/admin/login" || pathname.startsWith("/admin/login/")) {
    if (valid) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
    return NextResponse.next();
  }

  if (pathname === "/admin" || pathname.startsWith("/admin/")) {
    if (!valid) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
    return NextResponse.next();
  }

  if (pathname.startsWith("/api/admin")) {
    if (!valid) {
      return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
    }
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin", "/admin/:path*", "/api/admin/:path*"],
};
