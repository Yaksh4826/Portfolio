const CLOUDINARY_HOST = "res.cloudinary.com";

/** @param {string | null | undefined} format */
export function normalizeResumeFormat(format) {
  if (typeof format !== "string") return "pdf";
  const f = format.trim().toLowerCase().replace(/^\./, "");
  if (!f || f === "file") return "pdf";
  return f;
}

/** @param {string | null | undefined} url @param {string} [fallbackFormat] */
export function resumeExtensionFromUrl(url, fallbackFormat = "pdf") {
  if (typeof url === "string") {
    const path = url.split("?")[0];
    const match = path.match(/\.([a-z0-9]{2,5})$/i);
    if (match) return match[1].toLowerCase();
  }
  return normalizeResumeFormat(fallbackFormat);
}

/** @param {string | null | undefined} url */
function baseResumeUrl(url) {
  if (typeof url !== "string") return null;
  const trimmed = url.trim();
  if (!trimmed) return null;
  return trimmed
    .replace("/raw/fl_attachment/upload/", "/raw/upload/")
    .replace("/image/fl_attachment/upload/", "/image/upload/")
    .replace("/raw/upload/fl_attachment/", "/raw/upload/")
    .replace("/image/upload/fl_attachment/", "/image/upload/");
}

/** @param {string} url */
function isCloudinaryUrl(url) {
  return url.includes(CLOUDINARY_HOST);
}

/** @param {string} url */
function hasFileExtension(url) {
  return /\.[a-z0-9]{2,5}$/i.test(url.split("?")[0]);
}

/** @param {string} url @param {string} ext */
function withExtension(url, ext) {
  if (!url || hasFileExtension(url)) return url;
  return `${url.split("?")[0]}.${ext}`;
}

/** @param {string} url @param {string} flag */
function insertCloudinaryFlag(url, flag) {
  if (!isCloudinaryUrl(url)) return url;
  if (url.includes(`/upload/${flag}/`)) return url;

  if (url.includes("/raw/upload/")) {
    return url.replace("/raw/upload/", `/raw/upload/${flag}/`);
  }
  if (url.includes("/image/upload/")) {
    return url.replace("/image/upload/", `/image/upload/${flag}/`);
  }
  return url;
}

/** @param {string | null | undefined} url @param {string} [format] */
export function resumeViewUrl(url, format = "pdf") {
  const base = baseResumeUrl(url);
  if (!base) return null;

  const ext = resumeExtensionFromUrl(base, format);
  if (!isCloudinaryUrl(base)) return base;

  if (base.includes("/raw/upload/")) {
    return withExtension(base, ext);
  }

  if (base.includes("/image/upload/") && ext === "pdf") {
    return insertCloudinaryFlag(base, "fl_inline");
  }

  return withExtension(base, ext);
}

/**
 * @param {string | null | undefined} url
 * @param {string} [downloadName] e.g. Yaksh_Patel.pdf
 * @param {string} [format]
 */
export function resumeDownloadUrl(url, downloadName, format = "pdf") {
  const base = baseResumeUrl(url);
  if (!base) return null;

  const ext = resumeExtensionFromUrl(base, format);
  const name =
    typeof downloadName === "string" && downloadName.trim()
      ? downloadName.trim()
      : `resume.${ext}`;
  const safeName = name.includes(".") ? name : `${name}.${ext}`;
  const flag = `fl_attachment:${safeName.replace(/,/g, "_")}`;

  if (!isCloudinaryUrl(base)) return withExtension(base, ext);

  const withExt = withExtension(base, ext);
  return insertCloudinaryFlag(withExt, flag);
}

/** @param {string | null | undefined} name @param {string} [format] */
export function resumeDownloadFilename(name, format = "pdf") {
  const ext = normalizeResumeFormat(format);
  const base = (typeof name === "string" ? name.trim() : "") || "resume";
  const safe = base.replace(/[^\w.-]+/g, "_").replace(/_+/g, "_") || "resume";
  if (safe.toLowerCase().endsWith(`.${ext}`)) return safe;
  return `${safe}.${ext}`;
}
