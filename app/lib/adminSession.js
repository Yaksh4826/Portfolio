/** httpOnly JWT session cookie for admin (set by server action after password login). */
export const ADMIN_TOKEN_COOKIE = "admin_token";

/** Cookie lifetime (seconds); keep in sync with JWT `exp` in `app/actions/auth.js`. */
export const ADMIN_JWT_MAX_AGE_SEC = 60 * 60 * 24 * 7;

/** HTTPS only in prod; localhost/dev over http must not use Secure-only cookies or login/logout silently fails. */
function secureCookieRuntime() {
  return process.env.NODE_ENV === "production";
}

/** Cookie options: httpOnly, secure when deployed, SameSite=Lax cross-nav same-site reliability, path `/`. */
export function adminTokenCookieBaseOptions() {
  return {
    httpOnly: true,
    secure: secureCookieRuntime(),
    /** Lax avoids rare same-site quirks; JWT is HttpOnly anyway and path is /. */
    sameSite: "lax",
    path: "/",
    maxAge: ADMIN_JWT_MAX_AGE_SEC,
  };
}

export function adminTokenClearCookieOptions() {
  return {
    httpOnly: true,
    secure: secureCookieRuntime(),
    sameSite: "lax",
    path: "/",
    maxAge: 0,
    expires: new Date(0),
  };
}
