import techStackModel from "@/app/models/techStackModel";
import { connectDB } from "@/app/lib/db";
import { NextResponse } from "next/server";
import { isValidTechStackIconName } from "@/app/lib/techStackIcons";

export async function GET() {
  await connectDB();
  try {
    const techstack = await techStackModel
      .find()
      .select("name category icon")
      .sort({ category: 1, name: 1 })
      .lean();
    const safeTechstack = (techstack ?? []).filter((item) => isValidTechStackIconName(item?.icon));

    return NextResponse.json(
      { success: true, techstack: safeTechstack },
      { headers: { "Cache-Control": "public, s-maxage=120, stale-while-revalidate=600" } },
    );
  } catch (e) {
    return NextResponse.json(
      { success: false, error: String(e), techstack: [] },
      { status: 500, headers: { "Cache-Control": "private, no-store" } },
    );
  }
}
