import Image from "next/image";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { Space_Grotesk } from "next/font/google";
import { ExternalLink } from "lucide-react";
import BackToProjectsLink from "@/components/BackToProjectsLink";
import { cn } from "@/lib/utils";
import { sectionShellClassName } from "@/lib/sectionLayout";

const titleFont = Space_Grotesk({ subsets: ["latin"], display: "swap" });

export const revalidate = 60;

async function requestOrigin() {
  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host");
  const proto = h.get("x-forwarded-proto") ?? "http";
  if (host) return `${proto}://${host}`;
  return (
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000")
  );
}

async function loadProject(slug) {
  const origin = await requestOrigin();
  const url = new URL(`/api/projects/by-slug/${slug}`, origin);
  const res = await fetch(url, {
    next: { revalidate: 60 },
    headers: { Accept: "application/json" },
  });
  if (res.status === 404) return null;
  if (!res.ok) return null;
  const data = await res.json();
  return data?.success && data.project ? data.project : null;
}

function isDataUrl(src) {
  return typeof src === "string" && src.startsWith("data:");
}

function titleInitials(title) {
  if (!title || typeof title !== "string") return "◆";
  const parts = title.trim().split(/\s+/).filter(Boolean);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  const t = parts[0] || "";
  return t.slice(0, 2).toUpperCase() || "◆";
}

function formatCompleted(value) {
  if (value == null) return null;
  const d = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(d.getTime())) return null;
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(d);
}

function splitDescription(text) {
  if (typeof text !== "string" || !text.trim()) return [];
  return text.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const raw = typeof slug === "string" ? slug.trim() : "";
  if (!raw) return { title: "Project" };
  const project = await loadProject(raw);
  if (!project) return { title: "Project" };
  return {
    title: `${project.title} · Yaksh Patel`,
    description:
      project.summary ||
      (typeof project.description === "string" ? project.description.slice(0, 160) : undefined),
  };
}

export default async function ProjectPage({ params }) {
  const { slug } = await params;
  const raw = typeof slug === "string" ? slug.trim() : "";
  if (!raw) notFound();

  const project = await loadProject(raw);
  if (!project) notFound();

  const {
    title,
    description,
    summary,
    thumbnail,
    tags,
    githubUrl,
    liveUrl,
    completedDate,
  } = project;

  const listTags = Array.isArray(tags) ? tags.filter(Boolean) : [];
  const completedLabel = formatCompleted(completedDate);
  const showThumb = typeof thumbnail === "string" && thumbnail.trim().length > 0;
  const thumbAlt = `${title} — project preview`;
  const bodyParagraphs = splitDescription(typeof description === "string" ? description : "");

  return (
    <article
      className={cn(
        sectionShellClassName,
        "px-4 pb-12 pt-2 sm:px-6 sm:pb-16 sm:pt-3 md:pb-20",
      )}
    >
      <div className="max-w-3xl">
        <BackToProjectsLink variant="inline" />

        <header className="mt-5 sm:mt-6">
          <h1
            className={cn(
              titleFont.className,
              "text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl",
            )}
          >
            {title}
          </h1>
          {summary && String(summary).trim() ? (
            <p className="mt-3 text-lg leading-snug text-muted-foreground sm:text-xl">
              {String(summary).trim()}
            </p>
          ) : null}

          {completedLabel ? (
            <dl className="mt-6 text-sm">
              <div>
                <dt className="font-medium uppercase tracking-wider text-muted-foreground">
                  Completed
                </dt>
                <dd className="mt-0.5 font-semibold text-foreground">{completedLabel}</dd>
              </div>
            </dl>
          ) : null}
        </header>

        {listTags.length > 0 ? (
          <ul className="mt-8 flex flex-wrap gap-2" aria-label="Technologies">
            {listTags.map((tag, i) => (
              <li
                key={`${tag}-${i}`}
                className="rounded-full bg-muted/90 px-3 py-1 text-xs font-medium text-foreground ring-1 ring-border/80"
              >
                {tag}
              </li>
            ))}
          </ul>
        ) : null}

        <figure className="mt-8 overflow-hidden rounded-2xl ring-1 ring-border/80">
          {showThumb ? (
            isDataUrl(thumbnail) ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={thumbnail}
                alt={thumbAlt}
                className="aspect-video w-full object-cover"
              />
            ) : (
              <div className="relative aspect-video w-full">
                <Image
                  src={thumbnail.trim()}
                  alt={thumbAlt}
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 768px) 100vw, min(72rem, 100vw)"
                  unoptimized
                />
              </div>
            )
          ) : (
            <div
              className={cn(
                "flex aspect-video w-full items-center justify-center",
                "bg-gradient-to-br from-primary/20 via-muted to-chart-2/15",
              )}
              aria-hidden
            >
              <span className="text-5xl font-bold text-foreground/20 sm:text-6xl">
                {titleInitials(title)}
              </span>
            </div>
          )}
        </figure>

        <section className="mt-10" aria-labelledby="project-overview-heading">
          <h2
            id="project-overview-heading"
            className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground"
          >
            Overview
          </h2>
          <div className="mt-4 space-y-4 text-base leading-relaxed text-foreground/90 sm:text-[1.05rem]">
            {bodyParagraphs.length > 0 ? (
              bodyParagraphs.map((para, i) => (
                <p key={i} className="whitespace-pre-wrap">
                  {para}
                </p>
              ))
            ) : (
              <p className="text-muted-foreground">No write-up provided for this project yet.</p>
            )}
          </div>
        </section>

        {(liveUrl || githubUrl) && (
          <section className="mt-12 border-t border-border/60 pt-10" aria-label="Project actions">
            <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              Open project
            </h2>
            <div className="mt-4 flex flex-wrap gap-3">
              {liveUrl ? (
                <a
                  href={liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-5 py-2.5 text-sm font-semibold shadow-sm transition hover:bg-muted/80"
                >
                  View live
                  <ExternalLink className="size-4" />
                </a>
              ) : null}
              {githubUrl ? (
                <a
                  href={githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-5 py-2.5 text-sm font-semibold shadow-sm transition hover:bg-muted/80"
                >
                  Source code
                  <ExternalLink className="size-4" />
                </a>
              ) : null}
            </div>
          </section>
        )}
      </div>
    </article>
  );
}
