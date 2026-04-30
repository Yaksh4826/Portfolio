import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Space_Grotesk } from "next/font/google";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

const titleFont = Space_Grotesk({ subsets: ["latin"], display: "swap" });

function isDataUrl(src) {
  return typeof src === "string" && src.startsWith("data:");
}

function titleInitials(title) {
  if (!title || typeof title !== "string") return "◆";
  const parts = title.trim().split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
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

async function getProject(slug) {
  const base = process.env.API_URI;
  if (!base || !slug) return null;
  const res = await fetch(`${base}/projects/by-slug/${encodeURIComponent(slug)}`, {
    next: { revalidate: 60 },
  });
  if (!res.ok) return null;
  const data = await res.json();
  if (!data.success || !data.project) return null;
  return data.project;
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const project = await getProject(slug);
  if (!project) {
    return { title: "Project" };
  }
  return {
    title: `${project.title} · Portfolio`,
    description:
      project.summary ||
      (typeof project.description === "string" ? project.description.slice(0, 160) : undefined),
  };
}

export default async function ProjectPage({ params }) {
  const { slug } = await params;
  const project = await getProject(slug);
  if (!project) {
    notFound();
  }

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

  return (
    <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6 md:py-16">
      <Link
        href="/#projects"
        className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Back to projects
      </Link>

      <header className="mt-8">
        <h1
          className={cn(
            titleFont.className,
            "text-3xl font-bold tracking-tight text-foreground sm:text-4xl",
          )}
        >
          {title}
        </h1>
        {summary ? (
          <p className="mt-3 text-lg text-muted-foreground sm:text-xl">{summary}</p>
        ) : null}
        {completedLabel ? (
          <p className="mt-4 text-sm font-medium text-muted-foreground">
            Completed <span className="text-foreground/90">{completedLabel}</span>
          </p>
        ) : null}
      </header>

      {listTags.length > 0 ? (
        <ul className="mt-6 flex flex-wrap gap-2">
          {listTags.map((tag) => (
            <li
              key={tag}
              className="rounded-full bg-muted/80 px-3 py-1 text-xs font-medium text-foreground ring-1 ring-black/[0.06] dark:ring-white/10"
            >
              {tag}
            </li>
          ))}
        </ul>
      ) : null}

      <div className="mt-8 overflow-hidden rounded-2xl ring-1 ring-black/[0.06] dark:ring-white/10">
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
                sizes="100vw"
                unoptimized
              />
            </div>
          )
        ) : (
          <div
            className={cn(
              "flex aspect-video w-full items-center justify-center",
              "bg-gradient-to-br from-primary/25 via-muted to-chart-2/20",
            )}
            aria-hidden
          >
            <span className="text-5xl font-bold text-foreground/25">{titleInitials(title)}</span>
          </div>
        )}
      </div>

      <div className="prose prose-neutral mt-10 max-w-none dark:prose-invert">
        <p className="whitespace-pre-wrap text-base leading-relaxed text-foreground sm:text-[1.05rem]">
          {description}
        </p>
      </div>

      <div className="mt-10 flex flex-wrap gap-4">
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
            Source
            <ExternalLink className="size-4" />
          </a>
        ) : null}
      </div>
    </article>
  );
}
