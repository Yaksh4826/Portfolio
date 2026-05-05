/** httpOnly JWT session cookie for admin (set by server action after password login). */
export const ADMIN_TOKEN_COOKIE = "admin_token";

/** Cookie lifetime (seconds); keep in sync with JWT `exp` in `app/actions/auth.js`. */
export const ADMIN_JWT_MAX_AGE_SEC = 60 * 60 * 24 * 7;

/** Cookie options: httpOnly, secure, sameSite strict, path `/`, plus maxAge. */
export function adminTokenCookieBaseOptions() {
  return {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    path: "/",
    maxAge: ADMIN_JWT_MAX_AGE_SEC,
  };
}

export function adminTokenClearCookieOptions() {
  return {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    path: "/",
    maxAge: 0,
    expires: new Date(0),
  };
}
