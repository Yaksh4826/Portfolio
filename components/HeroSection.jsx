"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { SiGmail } from "react-icons/si";
import { cn } from "@/lib/utils";

/** Abstract loop — Pexels license: free for commercial use. Override with NEXT_PUBLIC_HERO_VIDEO_URL. */
const DEFAULT_HERO_VIDEO =
  "https://videos.pexels.com/video-files/3045163/3045163-hd_1920_1080_30fps.mp4";

/** Fresh status dot only — keep green isolated from lavender theme. */
const OPEN_STATUS_GREEN = "#22c55e";

const itemVariants = {
  hidden: { opacity: 0, y: 22 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  },
};

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
}) {
  const reduceMotion = useReducedMotion();
  const dur = reduceMotion ? 0 : 0.55;
  const ease = [0.22, 1, 0.36, 1];
  const videoRef = useRef(null);
  const [videoFailed, setVideoFailed] = useState(false);

  const videoSrc = heroVideoUrl?.trim() || DEFAULT_HERO_VIDEO;
  const showVideo = Boolean(videoSrc) && !videoFailed && !reduceMotion;

  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;
    if (reduceMotion) {
      el.pause();
      return;
    }
    el.play().catch(() => setVideoFailed(true));
  }, [reduceMotion, videoSrc]);

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
          {/* Portrait — first on mobile; right column on lg+ */}
          <div
            className={cn(
              "flex w-full justify-center lg:order-2 lg:justify-end",
              "lg:translate-x-6 xl:translate-x-12 2xl:translate-x-16",
            )}
          >
            <div className="relative w-full max-w-[min(100%,268px)] sm:max-w-[300px] lg:max-w-[360px] xl:max-w-[380px]">
              <motion.div
                aria-hidden
                className="pointer-events-none absolute -right-4 -top-6 h-32 w-32 rounded-full bg-primary/28 blur-3xl sm:-right-6 sm:-top-8 sm:h-44 sm:w-44 sm:bg-primary/30"
                animate={
                  reduceMotion
                    ? {}
                    : {
                        scale: [1, 1.15, 1],
                        opacity: [0.35, 0.55, 0.35],
                      }
                }
                transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
              />
              <motion.div
                aria-hidden
                className="pointer-events-none absolute -bottom-8 -left-6 h-40 w-40 rounded-full bg-chart-3/20 blur-3xl sm:-bottom-12 sm:-left-10 sm:h-52 sm:w-52 sm:bg-primary/15"
                animate={
                  reduceMotion
                    ? {}
                    : {
                        scale: [1.08, 1, 1.08],
                        opacity: [0.25, 0.42, 0.25],
                      }
                }
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
              />
              <motion.div
                aria-hidden
                className="pointer-events-none absolute left-1/2 top-1/2 h-28 w-[110%] max-w-none -translate-x-1/2 -translate-y-1/2 rounded-full bg-chart-2/18 blur-3xl sm:h-36 sm:w-[120%] sm:bg-chart-2/20"
                animate={
                  reduceMotion ? {} : { rotate: [0, 6, 0], opacity: [0.2, 0.35, 0.2] }
                }
                transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
              />

              <motion.div
                aria-hidden
                className="pointer-events-none absolute -inset-[6%] rounded-[1.75rem] opacity-60 sm:-inset-[10%] sm:rounded-[2.25rem] sm:opacity-70"
                style={{
                  background:
                    "conic-gradient(from 210deg, oklch(0.62 0.12 285 / 0.22), oklch(0.78 0.1 300 / 0.15), oklch(0.72 0.14 280 / 0.18), oklch(0.62 0.12 285 / 0.22))",
                }}
                animate={reduceMotion ? {} : { rotate: [0, 360] }}
                transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
              />
              <div
                aria-hidden
                className="pointer-events-none absolute -inset-[6%] rounded-[1.75rem] bg-background/55 blur-[2px] sm:-inset-[10%] sm:rounded-[2.25rem]"
              />

              {showVideo ? (
                <div className="pointer-events-none absolute -inset-[8%] z-[1] overflow-hidden rounded-[1.35rem] sm:-inset-[14%] sm:rounded-[2rem]">
                  <video
                    ref={videoRef}
                    className="h-full w-full scale-110 object-cover opacity-[0.22] saturate-150 sm:opacity-[0.28]"
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="metadata"
                    src={videoSrc}
                    onError={() => setVideoFailed(true)}
                  />
                  <div
                    className="absolute inset-0 bg-gradient-to-br from-background/80 via-background/40 to-transparent sm:from-background/75 sm:via-background/35"
                    aria-hidden
                  />
                </div>
              ) : null}

              <motion.div
                className="relative z-10 mx-auto w-full max-w-[220px] sm:max-w-none sm:w-[88%]"
                initial={reduceMotion ? false : { opacity: 0, scale: 0.96, y: 16 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: dur + 0.15, ease, delay: reduceMotion ? 0 : 0.12 }}
              >
                {/* Soft lavender lift — matches site primary, no lime */}
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
                    quality={100}
                    className="h-full w-full object-cover"
                  />
                </div>
              </motion.div>
            </div>
          </div>

          {/* Copy */}
          <motion.div
            className="max-w-none lg:order-1 lg:max-w-xl"
            initial={reduceMotion ? false : "hidden"}
            animate="show"
            variants={{
              hidden: {},
              show: {
                transition: { staggerChildren: reduceMotion ? 0 : 0.12, delayChildren: 0.05 },
              },
            }}
          >
            <motion.div
              variants={itemVariants}
              className="flex items-center gap-2 text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-muted-foreground"
            >
              <span className="relative flex h-2 w-2 shrink-0" aria-hidden>
                {!reduceMotion ? (
                  <span
                    className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-45"
                    style={{ backgroundColor: OPEN_STATUS_GREEN }}
                  />
                ) : null}
                <span
                  className="relative inline-flex h-2 w-2 rounded-full"
                  style={{
                    backgroundColor: OPEN_STATUS_GREEN,
                    boxShadow: `0 0 0 1px color-mix(in oklab, ${OPEN_STATUS_GREEN} 35%, transparent), 0 0 12px 2px color-mix(in oklab, ${OPEN_STATUS_GREEN} 45%, transparent)`,
                  }}
                />
              </span>
              Open to work
            </motion.div>

            <motion.p
              variants={itemVariants}
              className="mt-4 text-[0.95rem] text-foreground/85 sm:mt-5 sm:text-lg"
            >
              Hi, I&apos;m {firstName}.
            </motion.p>
            <motion.h1
              variants={itemVariants}
              className={cn(
                headlineFontClass,
                "mt-2 text-balance text-[clamp(2rem,8.5vw,2.75rem)] font-bold leading-[1.02] tracking-tight text-foreground sm:mt-3 sm:text-5xl md:text-6xl lg:mt-3 lg:text-[4.25rem] xl:text-[5rem] lg:leading-[0.98]",
              )}
            >
              {displayName}
            </motion.h1>
            <motion.p
              variants={itemVariants}
              className="mt-4 text-base font-medium leading-snug text-foreground/90 sm:mt-5 sm:text-lg md:text-xl"
            >
              {tag}
            </motion.p>
            <motion.p
              variants={itemVariants}
              className="mt-3 max-w-[52ch] text-[0.9375rem] leading-relaxed text-muted-foreground sm:mt-4 sm:max-w-md sm:text-base"
            >
              {subline}
            </motion.p>

            <motion.div
              variants={itemVariants}
              className="mt-6 flex w-full flex-col gap-2.5 sm:mt-8 sm:flex-row sm:flex-wrap sm:gap-3"
            >
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
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="mt-6 flex flex-wrap items-center gap-4 sm:mt-8"
            >
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
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
