export const ADMIN_SESSION_COOKIE = "admin_session";
export const ADMIN_SESSION_VALUE = "true";

export function getAdminSecretKey() {
  const key = process.env.ADMIN_SECRET_KEY?.trim();
  if (!key) {
    console.error("Missing ADMIN_SECRET_KEY in environment (.env.local / .env).");
    throw new Error("ADMIN_SECRET_KEY is not configured");
  }
  return key;
}

export function adminSessionCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24, // 24 hours
  };
}

export function attachAdminSession(res) {
  res.cookies.set(
    ADMIN_SESSION_COOKIE,
    ADMIN_SESSION_VALUE,
    adminSessionCookieOptions(),
  );
  return res;
}

export function clearAdminSession(res) {
  const opts = adminSessionCookieOptions();
  res.cookies.set(ADMIN_SESSION_COOKIE, "", {
    httpOnly: opts.httpOnly,
    secure: opts.secure,
    sameSite: opts.sameSite,
    path: opts.path,
    maxAge: 0,
    expires: new Date(0),
  });
  return res;
}
/** httpOnly admin session — cookie name `admin_token` (set after POST /api/admin/auth). */

export const ADMIN_TOKEN_COOKIE = "admin_token";
export const ADMIN_TOKEN_VALUE = "active";

export function adminTokenCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30, // 30 days
  };
}

/**
 * @param {import("next/server").NextResponse} res
 */
export function attachAdminToken(res) {
  res.cookies.set(ADMIN_TOKEN_COOKIE, ADMIN_TOKEN_VALUE, adminTokenCookieOptions());
  return res;
}

/**
 * Clear cookie — match every attribute from attach() or browsers keep the old cookie.
 * Prefer Expires epoch (widely honoured with httpOnly cookies).
 *
 * @param {import("next/server").NextResponse} res
 */
export function clearAdminToken(res) {
  const opts = adminTokenCookieOptions();
  const clearOpts = {
    httpOnly: opts.httpOnly,
    secure: opts.secure,
    sameSite: opts.sameSite,
    path: opts.path,
    maxAge: 0,
    expires: new Date(0),
  };
  res.cookies.set(ADMIN_TOKEN_COOKIE, "", clearOpts);
  return res;
}
