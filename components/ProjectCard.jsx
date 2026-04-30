"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

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
    month: "short",
    year: "numeric",
  }).format(d);
}

function MockThumbnail({ title }) {
  return (
    <div
      className={cn(
        "flex h-full min-h-[200px] w-full items-center justify-center rounded-xl sm:min-h-[240px] lg:min-h-[min(52vh,480px)]",
        "bg-gradient-to-br from-muted via-muted/80 to-muted/50",
        "ring-1 ring-black/[0.06] dark:ring-white/10",
      )}
      aria-hidden
    >
      <span className="text-4xl font-bold tracking-tight text-foreground/20 sm:text-5xl lg:text-6xl">
        {titleInitials(title)}
      </span>
    </div>
  );
}

export default function ProjectCard({ project, index, headlineFontClass }) {
  const { title, slug, summary, thumbnail, tags, completedDate } = project;

  const safeSummary = summary && String(summary).trim() ? String(summary).trim() : "";

  const completedLabel = formatCompleted(completedDate);
  const listTags = Array.isArray(tags) ? tags.filter(Boolean).slice(0, 8) : [];
  const href = `/projects/${encodeURIComponent(slug)}`;
  const showThumb = typeof thumbnail === "string" && thumbnail.trim().length > 0;

  const thumbSizes =
    "100vw";

  const thumbBlock = (
    <div className="relative w-full overflow-hidden rounded-xl ring-1 ring-black/[0.06] dark:ring-white/10">
      {showThumb ? (
        isDataUrl(thumbnail) ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={thumbnail}
            alt=""
            className="aspect-[4/3] w-full object-cover sm:aspect-[16/10] lg:aspect-auto lg:min-h-[min(52vh,520px)] lg:max-h-[600px]"
          />
        ) : (
          <div className="relative aspect-[4/3] w-full sm:aspect-[16/10] lg:aspect-auto lg:min-h-[min(52vh,520px)] lg:max-h-[600px]">
            <Image
              src={thumbnail.trim()}
              alt=""
              fill
              sizes={thumbSizes}
              className="object-cover"
              unoptimized
            />
          </div>
        )
      ) : (
        <MockThumbnail title={title} />
      )}
    </div>
  );

  return (
    <article
      className={cn(
        "relative w-full overflow-hidden rounded-2xl border border-border/80 bg-muted/35 p-5 shadow-sm transition-shadow duration-200 hover:shadow-md sm:p-6",
        "lg:grid lg:grid-cols-[1.35fr_1fr] lg:items-stretch lg:gap-10 lg:p-6 lg:pr-10",
      )}
    >
      <span
        className="pointer-events-none absolute bottom-0 right-2 translate-y-1/4 text-[4rem] font-bold leading-none text-foreground/[0.06] sm:text-[5rem] lg:right-6 lg:text-[6rem] lg:translate-y-1/5"
        aria-hidden
      >
        {index + 1}
      </span>

      {/* Thumbnail — full width on mobile; dominant column on lg */}
      <div className="relative z-[1] mb-5 lg:mb-0 lg:pl-4 lg:pr-2">{thumbBlock}</div>

      <div className="relative z-[1] flex min-w-0 flex-col gap-4 lg:justify-center lg:py-2">
        <div className="flex items-start justify-between gap-3">
          <h3
            className={cn(
              headlineFontClass,
              "min-w-0 text-xl font-bold leading-tight tracking-tight text-foreground sm:text-2xl",
            )}
          >
            <Link href={href} className="hover:text-foreground/90">
              {title}
            </Link>
          </h3>
          <Link
            href={href}
            className="mt-0.5 inline-flex shrink-0 rounded-full border border-border bg-background p-2 text-foreground shadow-sm transition hover:bg-muted/80 active:scale-95"
            aria-label={`Open ${title}`}
          >
            <ArrowUpRight className="size-5" strokeWidth={2.25} />
          </Link>
        </div>

        {safeSummary ? (
          <p className="max-w-prose text-[0.9375rem] leading-relaxed text-muted-foreground sm:text-base lg:max-w-none">
            {safeSummary}
          </p>
        ) : null}

        {completedLabel ? (
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Completed{" "}
            <span className="normal-case text-foreground/80">{completedLabel}</span>
          </p>
        ) : null}

        {listTags.length > 0 ? (
          <ul className="flex flex-wrap gap-2">
            {listTags.map((tag) => (
              <li
                key={tag}
                className="rounded-full bg-background/80 px-3 py-1 text-xs font-medium text-foreground ring-1 ring-black/[0.06] dark:ring-white/10"
              >
                {tag}
              </li>
            ))}
          </ul>
        ) : null}

        <div className="pt-1">
          <Link
            href={href}
            className="inline-flex min-h-10 items-center justify-center rounded-full border border-border bg-background px-6 text-sm font-semibold text-foreground shadow-sm transition hover:bg-muted/80 active:scale-[0.98]"
          >
            Explore more
          </Link>
        </div>
      </div>
    </article>
  );
}
