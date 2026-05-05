import {
  ADMIN_TOKEN_COOKIE,
  adminTokenClearCookieOptions,
} from "@/app/lib/adminSession";

/** Clear admin JWT cookie from a `NextResponse` (middleware / Route Handlers). */
export function attachClearedAdminTokenCookie(response) {
  response.cookies.set(ADMIN_TOKEN_COOKIE, "", adminTokenClearCookieOptions());
}
