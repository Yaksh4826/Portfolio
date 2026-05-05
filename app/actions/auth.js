"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SignJWT } from "jose";
import bcrypt from "bcryptjs";
import { connectDB } from "@/app/lib/db";
import adminModel from "@/app/models/adminModel";
import {
  ADMIN_TOKEN_COOKIE,
  ADMIN_JWT_MAX_AGE_SEC,
  adminTokenClearCookieOptions,
  adminTokenCookieBaseOptions,
} from "@/app/lib/adminSession";
import { getAdminJwtSecretBytes } from "@/app/lib/adminJwt";

/**
 * @param {unknown} _prev
 * @param {FormData} formData
 */
export async function loginAction(_prev, formData) {
  const password = String(formData.get("password") ?? "").trim();
  if (!password) {
    return { ok: false, message: "Invalid credentials." };
  }

  /** @type {{ _id: unknown; passwordHash: string } | null} */
  let admin = null;
  try {
    await connectDB();
    const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
    if (email) {
      admin = await adminModel.findOne({ email }).lean();
    } else {
      admin = await adminModel.findOne().sort({ createdAt: 1 }).lean();
    }
    if (!admin?.passwordHash) {
      return { ok: false, message: "Invalid credentials." };
    }
    const match = await bcrypt.compare(password, admin.passwordHash);
    if (!match) {
      return { ok: false, message: "Invalid credentials." };
    }
  } catch (e) {
    console.error(e);
    return { ok: false, message: "Could not sign in." };
  }

  const secret = await getAdminJwtSecretBytes();
  const token = await new SignJWT({ sub: String(admin._id) })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${ADMIN_JWT_MAX_AGE_SEC}s`)
    .sign(secret);

  const cookieStore = await cookies();
  cookieStore.set(ADMIN_TOKEN_COOKIE, token, adminTokenCookieBaseOptions());
  redirect("/admin");
}

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_TOKEN_COOKIE, { path: "/" });
  cookieStore.set(ADMIN_TOKEN_COOKIE, "", adminTokenClearCookieOptions());
  redirect("/admin/login");
}
