import { jwtVerify } from "jose";
import { getAdminJwtSecretBytes } from "@/app/lib/adminJwt";

/**
 * @param {string | undefined | null} token Compact JWT string from cookie.
 * @returns {Promise<boolean>}
 */
export async function verifyAdminJwtCompact(token) {
  if (!token || typeof token !== "string") return false;
  try {
    const secret = await getAdminJwtSecretBytes();
    const { payload } = await jwtVerify(token, secret, {
      algorithms: ["HS256"],
    });
    const sub = payload?.sub;
    return typeof sub === "string" && sub.length > 0;
  } catch {
    return false;
  }
}
