import { NextResponse } from "next/server";
import { connectDB } from "@/app/lib/db";
import projectModel from "@/app/models/projectModel";

/** Card-safe fields only — keeps homepage payload light. */
const CARD_FIELDS =
  "title slug summary thumbnail tags completedDate createdAt";

export async function GET() {
  await connectDB();

  try {
    const projects = await projectModel
      .find()
      .select(CARD_FIELDS)
      .sort({ completedDate: -1, createdAt: -1 })
      .lean();

    if (!projects?.length) {
      return NextResponse.json(
        { success: true, projects: [] },
        { headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300" } },
      );
    }

    return NextResponse.json(
      { success: true, projects },
      { headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300" } },
    );
  } catch (e) {
    return NextResponse.json(
      { success: false, error: String(e) },
      {
        status: 500,
        headers: { "Cache-Control": "private, no-store" },
      },
    );
  }
}
