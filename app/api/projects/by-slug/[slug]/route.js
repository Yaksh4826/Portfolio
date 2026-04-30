import { NextResponse } from "next/server";
import { connectDB } from "@/app/lib/db";
import projectModel from "@/app/models/projectModel";

export async function GET(_request, { params }) {
  await connectDB();
  const { slug } = await params;
  const safeSlug = typeof slug === "string" ? slug.trim() : "";

  if (!safeSlug) {
    return NextResponse.json({ success: false, message: "Invalid slug" }, { status: 400 });
  }

  try {
    const project = await projectModel.findOne({ slug: safeSlug }).lean();

    if (!project) {
      return NextResponse.json({ success: false, message: "Project not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, project });
  } catch (e) {
    return NextResponse.json({ success: false, error: String(e) }, { status: 500 });
  }
}
