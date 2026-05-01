import { NextResponse } from "next/server";
import {
  isCloudinaryReady,
  uploadImageFromBlob,
  uploadImageFromDataUri,
} from "@/app/lib/cloudinaryUpload";

/**
 * POST /api/admin/upload-image
 * Auth: same admin cookie as other /api/admin/* routes (middleware).
 *
 * Multipart: field name "file" (image).
 * JSON: { "dataUri": "data:image/png;base64,..." } or { "image": "<same>" }
 *
 * Response: { success: true, url, publicId, width?, height? }
 * Save `url` into project.thumbnail, profile.avatar, etc. — your existing APIs stay unchanged.
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
    const ct = req.headers.get("content-type") || "";

    if (ct.includes("multipart/form-data")) {
      const form = await req.formData();
      const file = form.get("file");
      if (!file || typeof file.arrayBuffer !== "function") {
        return NextResponse.json(
          { success: false, message: 'Expected multipart field "file" with an image' },
          { status: 400 },
        );
      }
      const payload = await uploadImageFromBlob(file);
      return NextResponse.json({ success: true, ...payload });
    }

    if (ct.includes("application/json")) {
      const body = await req.json();
      const dataUri =
        typeof body?.dataUri === "string"
          ? body.dataUri
          : typeof body?.image === "string"
            ? body.image
            : null;

      if (!dataUri || !dataUri.startsWith("data:image/")) {
        return NextResponse.json(
          {
            success: false,
            message: 'JSON body needs dataUri or image as "data:image/...;base64,..."',
          },
          { status: 400 },
        );
      }

      const payload = await uploadImageFromDataUri(dataUri);
      return NextResponse.json({ success: true, ...payload });
    }

    return NextResponse.json(
      { success: false, message: "Use Content-Type: multipart/form-data or application/json" },
      { status: 415 },
    );
  } catch (e) {
    return NextResponse.json(
      { success: false, error: e instanceof Error ? e.message : String(e) },
      { status: 500 },
    );
  }
}
