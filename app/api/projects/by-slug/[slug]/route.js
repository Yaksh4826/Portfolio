import { NextResponse } from "next/server";
import { connectDB } from "@/app/lib/db";
import projectModel from "@/app/models/projectModel";

function escapeRegex(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function slugCandidates(raw) {
  const safe = typeof raw === "string" ? raw.trim() : "";
  if (!safe) return [];
  const lower = safe.toLowerCase();
  const hyphen = safe.replace(/\s+/g, "-");
  const hyphenLower = hyphen.toLowerCase();
  return [...new Set([safe, lower, hyphen, hyphenLower])];
}

export async function GET(_request, { params }) {
  const { slug } = await params;
  const safeSlug = typeof slug === "string" ? slug.trim() : "";

  if (!safeSlug) {
    return NextResponse.json(
      { success: false, message: "Invalid slug" },
      { status: 400, headers: { "Cache-Control": "private, no-store" } },
    );
  }

  await connectDB();

  try {
    const candidates = slugCandidates(safeSlug);
    const primary = candidates[0];
    const orClauses = [
      ...candidates.map((s) => ({ slug: s })),
      { slug: { $regex: new RegExp(`^${escapeRegex(primary)}$`, "i") } },
    ];

    const project = await projectModel.findOne({ $or: orClauses }).lean();

    if (!project) {
      return NextResponse.json(
        { success: false, message: "Project not found" },
        { status: 404, headers: { "Cache-Control": "private, no-store" } },
      );
    }

    return NextResponse.json(
      { success: true, project },
      { headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300" } },
    );
  } catch (e) {
    return NextResponse.json(
      { success: false, error: String(e) },
      { status: 500, headers: { "Cache-Control": "private, no-store" } },
    );
  }
}
