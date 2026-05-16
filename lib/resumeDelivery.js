import { v2 as cloudinary } from "cloudinary";
import { normalizeResumeFormat } from "@/lib/resumeUrls";

function configured() {
  return Boolean(
    process.env.CLOUDINARY_CLOUD_NAME?.trim() &&
      process.env.CLOUDINARY_API_KEY?.trim() &&
      process.env.CLOUDINARY_API_SECRET?.trim(),
  );
}

function applyConfig() {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME.trim(),
    api_key: process.env.CLOUDINARY_API_KEY.trim(),
    api_secret: process.env.CLOUDINARY_API_SECRET.trim(),
    secure: true,
  });
}

/** @param {string} url */
function publicIdFromUrl(url) {
  const match = url.match(/\/upload\/(?:v\d+\/)?(.+?)(?:\.[a-z0-9]{2,5})?(?:\?|#|$)/i);
  return match?.[1] ?? null;
}

/**
 * Signed Cloudinary API URLs (required when PDF delivery is restricted on the account).
 * @returns {{ viewUrl: string | null }}
 */
export function getResumeDeliveryLinks({
  resumePublicId,
  resumeUrl,
  resumeFormat,
}) {
  if (!configured()) {
    const fallback = typeof resumeUrl === "string" ? resumeUrl.trim() || null : null;
    return { viewUrl: fallback };
  }

  applyConfig();

  const publicId =
    (typeof resumePublicId === "string" && resumePublicId.trim()) ||
    (typeof resumeUrl === "string" ? publicIdFromUrl(resumeUrl.trim()) : null);

  if (!publicId) {
    const fallback = typeof resumeUrl === "string" ? resumeUrl.trim() || null : null;
    return { viewUrl: fallback };
  }

  const format = normalizeResumeFormat(resumeFormat);
  const resourceType = format === "pdf" ? "image" : "raw";
  const deliveryFormat = format === "pdf" ? "pdf" : format;
  const expiresAt = Math.floor(Date.now() / 1000) + 60 * 60 * 24;

  const viewUrl = cloudinary.utils.private_download_url(publicId, deliveryFormat, {
    resource_type: resourceType,
    type: "upload",
    expires_at: expiresAt,
  });

  return { viewUrl };
}
