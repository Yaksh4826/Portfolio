/**
 * HS256 key for `jose` (middleware Edge + server actions Node).
 * Uses SHA-256 of JWT_SECRET or ADMIN_SECRET_KEY so short env values work
 * and signing/verification always use the same 256-bit key material.
 *
 * @returns {Promise<Uint8Array>}
 */
export async function getAdminJwtSecretBytes() {
  const raw =
    process.env.JWT_SECRET?.trim() ||
    process.env.ADMIN_SECRET_KEY?.trim();
  if (!raw) {
    throw new Error(
      "Set JWT_SECRET or ADMIN_SECRET_KEY in .env for admin sessions.",
    );
  }
  const digest = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(raw),
  );
  return new Uint8Array(digest);
}
