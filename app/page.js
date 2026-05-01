import { Space_Grotesk } from "next/font/google";
import HeroSection from "@/components/HeroSection";
import TechStackSection from "@/components/TechStackSection";
import ProjectsSection from "@/components/ProjectsSection";
import ExperienceSection from "@/components/ExperienceSection";
import ContactInviteSection from "@/components/ContactInviteSection";

const nameFont = Space_Grotesk({
  subsets: ["latin"],
  display: "swap",
});

function buildTelHref(raw) {
  if (raw == null) return null;
  const s = String(raw).trim();
  if (!s) return null;
  const body = s.replace(/\s/g, "");
  if (!body) return null;
  return body.toLowerCase().startsWith("tel:") ? body : `tel:${body}`;
}

async function safeJson(res) {
  const contentType = res.headers.get("content-type") || "";
  if (!contentType.toLowerCase().includes("application/json")) return null;
  try {
    return await res.json();
  } catch {
    return null;
  }
}

function getServerBaseUrl() {
  const explicit =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.NEXT_PUBLIC_VERCEL_URL;
  if (typeof explicit === "string" && explicit.trim()) {
    const value = explicit.trim().replace(/\/$/, "");
    return /^https?:\/\//i.test(value) ? value : `https://${value}`;
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  return "http://localhost:3000";
}

export default async function Home() {
  const baseUrl = getServerBaseUrl();
  let name = "";
  let tagLine = "";
  let bio = "";
  let avatar = "";
  let socials = {};

  try {
    const res = await fetch(`${baseUrl}/api/profile`, {
      next: { revalidate: 120 },
      headers: { Accept: "application/json" },
    });
    if (res.ok) {
      const data = await safeJson(res);
      const profile = data?.profileData?.[0];
      if (profile) {
        name = profile.name || "";
        tagLine = profile.tagLine || "";
        bio = profile.bio || "";
        avatar = profile.avatar || "";
        socials = profile.socials || {};
      }
    }
  } catch {
    /* ignore profile fetch errors to avoid prerender failures */
  }

  const email = process.env.EMAIL;
  const mailHref =
    typeof email === "string" && email.includes("@")
      ? `mailto:${email}`
      : typeof email === "string"
        ? email.startsWith("mailto:")
          ? email
          : `mailto:${email}`
        : null;

  const callHref = buildTelHref(process.env.MOBILE_NO);

  /** Strong alt text for SEO (avoid empty / generic alts). */
  const profilePhotoAlt = tagLine
    ? `${name} — ${tagLine}. Profile photo.`
    : `${name}. Profile photo.`;

  let experiences = [];
  try {
    const exRes = await fetch(`${baseUrl}/api/experiences`, {
      next: { revalidate: 120 },
      headers: { Accept: "application/json" },
    });
    if (exRes.ok) {
      const exJson = await safeJson(exRes);
      if (exJson?.success && Array.isArray(exJson.experiences)) {
        experiences = exJson.experiences;
      }
    }
  } catch {
    /* ignore */
  }

  return (
    <>
      <HeroSection
        name={name}
        tagLine={tagLine}
        bio={bio}
        avatar={avatar}
        profilePhotoAlt={profilePhotoAlt}
        mailHref={mailHref}
        socials={socials}
        headlineFontClass={nameFont.className}
        callHref={callHref}
        heroVideoUrl={process.env.NEXT_PUBLIC_HERO_VIDEO_URL}
      />
      <div
        id="about"
        tabIndex={-1}
        className="h-px w-full shrink-0 scroll-mt-28 overflow-hidden outline-none"
        aria-hidden
      />
      <TechStackSection headlineFontClass={nameFont.className} />
      <ProjectsSection headlineFontClass={nameFont.className} />
      <ExperienceSection
        experiences={experiences}
        headlineFontClass={nameFont.className}
      />
      <ContactInviteSection headlineFontClass={nameFont.className} />
    </>
  );
}
