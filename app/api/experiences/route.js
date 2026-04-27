import { NextResponse } from "next/server";
import experienceModel from "@/app/models/profileModel.js";
import { connectDB } from "@/app/lib/db";

export async function GET(request) {
  await connectDB();

  const experiences = await experienceModel.find();

  if (!experiences || experiences.length === 0) {
    return NextResponse.json(
      { success: false, message: "No experiences added" },
      { status: 404 }
    );
  }

  return NextResponse.json(
    { success: true, experiences },
    { status: 200 }
  );
}
