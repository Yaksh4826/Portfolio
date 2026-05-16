import { NextResponse } from "next/server";
import { connectDB } from "@/app/lib/db";
import {
  isCloudinaryReady,
  uploadResumeFromBlob,
} from "@/app/lib/cloudinaryUpload";
import profileModel from "@/app/models/profileModel";

/**
 * POST /api/admin/upload-resume
 * Multipart: field name "file" (PDF or Word document).
 */
export async function POST(req) {
  if (!isCloudinaryReady()) {
    return NextResponse.json(
      {
        success: false,
        message:
          "Cloudinary is not configured. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET in .env",
      },
      { status: 503 },
    );
  }

  try {
    const form = await req.formData();
    const file = form.get("file");
    if (!file || typeof file.arrayBuffer !== "function") {
      return NextResponse.json(
        { success: false, message: 'Expected multipart field "file" with a document' },
        { status: 400 },
      );
    }

    const payload = await uploadResumeFromBlob(file);

    await connectDB();
    await profileModel.findOneAndUpdate(
      {},
      {
        resumeUrl: payload.url,
        resumePublicId: payload.publicId,
        resumeFormat: payload.format,
      },
      { upsert: true },
    );

    return NextResponse.json({ success: true, ...payload });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: err instanceof Error ? err.message : String(err) },
      { status: 500 },
    );
  }
}
