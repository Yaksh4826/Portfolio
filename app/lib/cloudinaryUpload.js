import { v2 as cloudinary } from "cloudinary";

const MAX_BYTES = 8 * 1024 * 1024; // 8 MB

function configured() {
  return Boolean(
    process.env.CLOUDINARY_CLOUD_NAME?.trim() &&
      process.env.CLOUDINARY_API_KEY?.trim() &&
      process.env.CLOUDINARY_API_SECRET?.trim(),
  );
}

function applyConfig() {
  if (!configured()) {
    throw new Error(
      "Cloudinary env missing: set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET",
    );
  }
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME.trim(),
    api_key: process.env.CLOUDINARY_API_KEY.trim(),
    api_secret: process.env.CLOUDINARY_API_SECRET.trim(),
    secure: true,
  });
}

function defaultFolder() {
  return process.env.CLOUDINARY_UPLOAD_FOLDER?.trim() || "yaksh_portfolio";
}

function assertSize(bytesLength, label) {
  if (bytesLength > MAX_BYTES) {
    throw new Error(`${label} too large (max ${MAX_BYTES / (1024 * 1024)} MB)`);
  }
}

/**
 * @param {string} dataUri - data:image/...;base64,...
 * @returns {Promise<{ url: string, publicId: string, width?: number, height?: number }>}
 */
export async function uploadImageFromDataUri(dataUri) {
  applyConfig();
  if (typeof dataUri !== "string" || !dataUri.startsWith("data:image/")) {
    throw new Error("Expected a data:image/...;base64,... string");
  }
  const base64part = dataUri.split(",")[1];
  if (base64part) {
    assertSize(Math.ceil((base64part.length * 3) / 4), "Image");
  }

  const result = await cloudinary.uploader.upload(dataUri, {
    folder: defaultFolder(),
    unique_filename: true,
    overwrite: false,
    resource_type: "image",
  });

  return {
    url: result.secure_url,
    publicId: result.public_id,
    width: result.width,
    height: result.height,
  };
}

/**
 * @param {Blob} file - from FormData (browser) or File
 */
export async function uploadImageFromBlob(file) {
  if (typeof file.size === "number") assertSize(file.size, "Image");
  const buf = Buffer.from(await file.arrayBuffer());
  assertSize(buf.length, "Image");
  const mime = file.type && file.type.startsWith("image/") ? file.type : "image/jpeg";
  const dataUri = `data:${mime};base64,${buf.toString("base64")}`;
  return uploadImageFromDataUri(dataUri);
}

export function isCloudinaryReady() {
  return configured();
}


const RESUME_TYPES = {
  pdf: {
    resource_type: "image",
    mime: "application/pdf",
  },
  doc: {
    resource_type: "raw",
    mime: "application/msword",
  },
  docx: {
    resource_type: "raw",
    mime: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  },
};

function resumeExtensionFromFile(file) {
  const name = (file.name || "").toLowerCase();
  const fromName = name.match(/\.([a-z0-9]+)$/);
  if (fromName && RESUME_TYPES[fromName[1]]) return fromName[1];

  const mime = (file.type || "").toLowerCase();
  for (const [ext, cfg] of Object.entries(RESUME_TYPES)) {
    if (mime === cfg.mime) return ext;
  }
  return "pdf";
}

export async function uploadResumeFromBlob(file) {
  applyConfig();
  if (typeof file.size === "number") assertSize(file.size, "Resume");
  const buffer = Buffer.from(await file.arrayBuffer());
  assertSize(buffer.length, "Resume");

  const ext = resumeExtensionFromFile(file);
  const typeCfg = RESUME_TYPES[ext];
  const mime =
    (file.type && file.type.trim()) ||
    typeCfg.mime ||
    (ext === "pdf" ? "application/pdf" : "application/octet-stream");
  const dataUri = `data:${mime};base64,${buffer.toString("base64")}`;

  const result = await cloudinary.uploader.upload(dataUri, {
    folder: `${defaultFolder()}/resumes`,
    resource_type: typeCfg.resource_type,
    ...(ext === "pdf" ? { format: "pdf" } : {}),
    unique_filename: true,
    overwrite: false,
  });

  const format = result.format && result.format !== "file" ? result.format : ext;
  return {
    url: result.secure_url,
    publicId: result.public_id,
    bytes: result.bytes,
    format,
  };
}
