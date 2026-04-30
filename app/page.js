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

export default async function Home() {
  const URI = process.env.API_URI;
  const res = await fetch(`${URI}/profile`);
  const data = await res.json();
  const { name, tagLine, bio, avatar, socials } = data.profileData[0];

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
    const exRes = await fetch(`${URI}/experiences`, { next: { revalidate: 120 } });
    if (exRes.ok) {
      const exJson = await exRes.json();
      if (exJson.success && Array.isArray(exJson.experiences)) {
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
