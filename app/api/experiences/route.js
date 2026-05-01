import { NextResponse } from "next/server";
import experienceModel from "@/app/models/experienceModel.js";
import { connectDB } from "@/app/lib/db";

const LIST_FIELDS = "company role location duration description technologies createdAt updatedAt";

export async function GET() {
  await connectDB();

  try {
    const experiences = await experienceModel
      .find()
      .select(LIST_FIELDS)
      .sort({ createdAt: -1, updatedAt: -1, _id: -1 })
      .lean();

    return NextResponse.json({
      success: true,
      experiences: experiences ?? [],
    });
  } catch (e) {
    return NextResponse.json(
      { success: false, error: String(e), experiences: [] },
      { status: 500 },
    );
  }
}
