import { NextResponse } from "next/server";
import { connectDB } from "@/app/lib/db";
import experienceModel from "@/app/models/experienceModel.js";

export async function GET() {
  try {
    await connectDB();
    const experiences = await experienceModel.find().sort({ createdAt: -1 }).lean();
    return NextResponse.json({ success: true, experiences: experiences ?? [] });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await connectDB();
    const body = await req.json();
    const data = await experienceModel.create(body);
    return NextResponse.json({ success: true, data }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
