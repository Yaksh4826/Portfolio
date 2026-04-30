import techStackModel from "@/app/models/techStackModel";
import { connectDB } from "@/app/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  await connectDB();
  try {
    const techstack = await techStackModel
      .find()
      .select("name category icon")
      .sort({ category: 1, name: 1 })
      .lean();

    return NextResponse.json({
      success: true,
      techstack: techstack ?? [],
    });
  } catch (e) {
    return NextResponse.json(
      { success: false, error: String(e), techstack: [] },
      { status: 500 },
    );
  }
}
