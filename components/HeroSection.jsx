"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { SiGmail } from "react-icons/si";
import { cn } from "@/lib/utils";
import ResumeActions from "@/components/ResumeActions";

/** Abstract loop — Pexels license: free for commercial use. Override with NEXT_PUBLIC_HERO_VIDEO_URL. */
const DEFAULT_HERO_VIDEO =
  "https://videos.pexels.com/video-files/3045163/3045163-hd_1920_1080_30fps.mp4";

const OPEN_STATUS_GREEN = "#22c55e";

/** Footer-matched shimmer via CSS (`animate-hero-name-shimmer`), not Framer — stable SSR hydrate. */
const heroNameGradientClass =
  "inline-block max-w-full bg-gradient-to-r from-slate-950 via-blue-800 to-sky-400 bg-[length:320%_100%] bg-clip-text bg-no-repeat text-transparent [-webkit-box-decoration-break:clone] [box-decoration-break:clone] animate-hero-name-shimmer motion-reduce:animate-none transition-transform hover:scale-[1.02] motion-reduce:hover:scale-100";

function useDeferUntilVisible(containerRef) {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const root = containerRef.current;
    if (!root) return;
    if (typeof IntersectionObserver !== "function") {
      setShow(true);
      return;
    }
    const io = new IntersectionObserver(
      ([e]) => {
        if (e?.isIntersecting) {
          setShow(true);
          io.disconnect();
        }
      },
      { rootMargin: "140px", threshold: 0.02 },
    );
    io.observe(root);
    return () => io.disconnect();
  }, [containerRef]);
  return show;
}

export default function HeroSection({
  name,
  tagLine,
  bio,
  avatar,
  profilePhotoAlt,
  mailHref,
  socials,
  headlineFontClass,
  heroVideoUrl,
  callHref,
  resumeViewUrl,
}) {
  const videoRef = useRef(null);
  const heroVisualRootRef = useRef(null);
  const [videoFailed, setVideoFailed] = useState(false);
  const deferMedia = useDeferUntilVisible(heroVisualRootRef);

  const videoSrc = heroVideoUrl?.trim() || DEFAULT_HERO_VIDEO;
  const canPlayVideo =
    deferMedia && Boolean(videoSrc) && !videoFailed;

  useEffect(() => {
    const el = videoRef.current;
    if (!el || !canPlayVideo) return;
    el.play().catch(() => setVideoFailed(true));
  }, [canPlayVideo, videoSrc]);

  const firstName = (name || "").trim().split(/\s+/)[0] || "there";
  const displayName = (name || "").trim() || firstName;
  const tag =
    (tagLine && tagLine.trim()) ||
    "I build fast, accessible web experiences with care for craft and UX.";
  const rawBio = (bio || "").trim();
  const firstSentence =
    rawBio.length > 0
      ? rawBio.includes(".")
        ? `${rawBio.split(".")[0].trim()}.`
        : rawBio
      : null;
  const subline =
    firstSentence ||
    "From concept to deploy — clear communication, sharp execution, and interfaces people enjoy using.";

  return (
    <section
      id="home"
      className="relative w-full overflow-x-clip px-4 pb-10 pt-2 sm:px-6 sm:pb-12 sm:pt-4 md:pb-16"
    >
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-8 sm:gap-10 lg:grid lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-10 xl:gap-14">
          <div
            className={cn(
              "flex w-full justify-center lg:order-2 lg:justify-end",
              "lg:translate-x-6 xl:translate-x-12 2xl:translate-x-16",
            )}
          >
            <div
              ref={heroVisualRootRef}
              className="relative w-full max-w-[min(100%,268px)] sm:max-w-[300px] lg:max-w-[360px] xl:max-w-[380px]"
            >
              <div
                aria-hidden
                className="pointer-events-none absolute -right-4 -top-6 h-32 w-32 animate-pulse rounded-full bg-primary/28 blur-3xl motion-reduce:hidden sm:-right-6 sm:-top-8 sm:h-44 sm:w-44 sm:bg-primary/30"
              />
              <div
                aria-hidden
                className="pointer-events-none absolute -bottom-8 -left-6 h-40 w-40 animate-pulse rounded-full bg-chart-3/20 blur-3xl motion-reduce:hidden sm:-bottom-12 sm:-left-10 sm:h-52 sm:w-52 sm:bg-primary/15 [animation-duration:10s]"
              />

              <div
                aria-hidden
                className="pointer-events-none absolute -inset-[6%] rounded-[1.75rem] opacity-60 motion-safe:animate-[spin_28s_linear_infinite] motion-reduce:animate-none sm:-inset-[10%] sm:rounded-[2.25rem] sm:opacity-70"
                style={{
                  background:
                    "conic-gradient(from 210deg, oklch(0.62 0.12 285 / 0.22), oklch(0.78 0.1 300 / 0.15), oklch(0.72 0.14 280 / 0.18), oklch(0.62 0.12 285 / 0.22))",
                }}
              />
              <div
                aria-hidden
                className="pointer-events-none absolute -inset-[6%] rounded-[1.75rem] bg-background/55 blur-[2px] sm:-inset-[10%] sm:rounded-[2.25rem]"
              />

              {canPlayVideo ? (
                <div className="pointer-events-none absolute -inset-[8%] z-[1] overflow-hidden rounded-[1.35rem] motion-reduce:hidden sm:-inset-[14%] sm:rounded-[2rem]">
                  <video
                    ref={videoRef}
                    className="h-full w-full scale-110 object-cover opacity-[0.22] saturate-150 sm:opacity-[0.28]"
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="none"
                    src={videoSrc}
                    onError={() => setVideoFailed(true)}
                  />
                  <div
                    className="absolute inset-0 bg-gradient-to-br from-background/80 via-background/40 to-transparent sm:from-background/75 sm:via-background/35"
                    aria-hidden
                  />
                </div>
              ) : null}

              <div className="relative z-10 mx-auto w-full max-w-[220px] sm:max-w-none sm:w-[88%]">
                <span
                  className="pointer-events-none absolute -inset-[10%] rounded-[2rem] opacity-70 blur-2xl sm:-inset-[12%] sm:rounded-[2.25rem]"
                  style={{
                    background:
                      "radial-gradient(circle, oklch(0.58 0.12 285 / 0.22) 0%, transparent 72%)",
                  }}
                  aria-hidden
                />
                <div
                  className={cn(
                    "relative aspect-square overflow-hidden rounded-2xl bg-muted/30",
                    "shadow-[0_28px_70px_-12px_rgba(45,35,80,0.28),0_0_0_1px_rgba(255,255,255,0.5)_inset]",
                    "ring-1 ring-primary/25 ring-offset-2 ring-offset-background dark:ring-primary/35",
                  )}
                >
                  <Image
                    src={avatar}
                    alt={profilePhotoAlt}
                    width={1000}
                    height={1000}
                    sizes="(max-width: 480px) 240px, (max-width: 640px) 280px, (max-width: 1024px) 320px, 380px"
                    priority
                    quality={85}
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="max-w-none lg:order-1 lg:max-w-xl">
            <div className="flex items-center gap-2 text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              <span className="relative flex h-2 w-2 shrink-0" aria-hidden>
                <span
                  className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-45 motion-reduce:hidden"
                  style={{ backgroundColor: OPEN_STATUS_GREEN }}
                />
                <span
                  className="relative inline-flex h-2 w-2 rounded-full"
                  style={{
                    backgroundColor: OPEN_STATUS_GREEN,
                    boxShadow: `0 0 0 1px color-mix(in oklab, ${OPEN_STATUS_GREEN} 35%, transparent), 0 0 12px 2px color-mix(in oklab, ${OPEN_STATUS_GREEN} 45%, transparent)`,
                  }}
                />
              </span>
              Open to work
            </div>

            <p className="mt-4 text-[0.95rem] text-foreground/85 sm:mt-5 sm:text-lg">
              Hi, I&apos;m {firstName}.
            </p>

            <h1
              className={cn(
                headlineFontClass,
                "relative z-10 mt-2 text-balance text-[clamp(2rem,8.5vw,2.75rem)] font-bold leading-[1.02] tracking-tight sm:mt-3 sm:text-5xl md:text-6xl lg:mt-3 lg:text-[4.25rem] xl:text-[5rem] lg:leading-[0.98]",
              )}
            >
              <span className={heroNameGradientClass}>{displayName}</span>
            </h1>

            <p className="mt-4 text-base font-medium leading-snug text-foreground/90 sm:mt-5 sm:text-lg md:text-xl">
              {tag}
            </p>
            <p className="mt-3 max-w-[52ch] text-[0.9375rem] leading-relaxed text-muted-foreground sm:mt-4 sm:max-w-md sm:text-base">
              {subline}
            </p>

            <div className="mt-6 flex w-full flex-col gap-2.5 sm:mt-8 sm:flex-row sm:flex-wrap sm:gap-3">
              <Link
                href="/contact"
                className="inline-flex h-9 min-h-9 flex-1 items-center justify-center rounded-full border border-border bg-background px-4 text-xs font-semibold text-foreground shadow-sm transition hover:bg-muted/80 active:scale-[0.98] sm:h-11 sm:min-h-11 sm:flex-initial sm:px-8 sm:text-sm"
              >
                Let&apos;s connect
              </Link>
              {callHref ? (
                <a
                  href={callHref}
                  className="inline-flex h-9 min-h-9 flex-1 items-center justify-center rounded-full border border-zinc-800 bg-zinc-900 px-4 text-xs font-semibold text-white shadow-[inset_0_1px_0_0_rgba(255,255,255,0.12)] transition hover:bg-zinc-800 active:scale-[0.98] dark:border-zinc-600 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white sm:h-11 sm:min-h-11 sm:flex-initial sm:px-8 sm:text-sm"
                >
                  Book a call
                </a>
              ) : null}
            </div>

            <ResumeActions viewUrl={resumeViewUrl} />

            <div className="mt-6 flex flex-wrap items-center gap-4 sm:mt-8">
              {socials?.github ? (
                <a
                  href={socials.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground transition hover:text-foreground"
                  aria-label="GitHub"
                >
                  <FaGithub className="size-6" />
                </a>
              ) : null}
              {socials?.linkedin ? (
                <a
                  href={socials.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground transition hover:text-foreground"
                  aria-label="LinkedIn"
                >
                  <FaLinkedin className="size-6" />
                </a>
              ) : null}
              {mailHref ? (
                <a
                  href={mailHref}
                  className="text-muted-foreground transition hover:text-foreground"
                  aria-label="Email"
                >
                  <SiGmail className="size-6" />
                </a>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
