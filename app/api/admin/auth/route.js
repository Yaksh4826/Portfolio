import { NextResponse } from "next/server";
import { attachAdminToken } from "@/app/lib/adminSession";

/**
 * Secret keyword login: POST { keyword } must match ADMIN_SECRET_KEY.
 * Sets httpOnly cookie `admin_token` (Secure in production).
 */
export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, message: "Invalid body" }, { status: 400 });
  }

  const keyword = (typeof body?.keyword === "string" ? body.keyword : "").trim();
  const expected = process.env.ADMIN_SECRET_KEY?.trim() ?? "";

  if (!expected || keyword !== expected) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  attachAdminToken(res);
  return res;
}
