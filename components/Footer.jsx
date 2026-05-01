"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Space_Grotesk } from "next/font/google";
import { cn } from "@/lib/utils";

const footerNameFont = Space_Grotesk({
  subsets: ["latin"],
  display: "swap",
});

/** Match hero h1 typography (Space Grotesk, bold, tight) at footer scale */
const nameClass = cn(
  footerNameFont.className,
  "text-balance text-base font-bold leading-[1.02] tracking-tight sm:text-lg md:text-xl",
);

/** Blue shimmer — deeper navy/slate → sky (readable on light page bg) */
const nameGradientClass =
  "relative z-10 inline-block cursor-default bg-gradient-to-r from-slate-950 via-blue-800 to-sky-400 bg-[length:320%_100%] bg-clip-text text-transparent";

function HeartPulse({ className }) {
  const reduceMotion = useReducedMotion();
  if (reduceMotion) {
    return (
      <span className={className} aria-hidden>
        ❤️
      </span>
    );
  }
  return (
    <motion.span
      className={`inline-block select-none ${className ?? ""}`}
      aria-hidden
      animate={{ scale: [1, 1.08, 1] }}
      transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
    >
      ❤️
    </motion.span>
  );
}

export default function Footer() {
  const reduceMotion = useReducedMotion();

  return (
    <footer className="relative mt-auto overflow-hidden bg-transparent py-2.5 sm:py-3" role="contentinfo">
      {reduceMotion ? (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-primary/[0.04] to-transparent"
        />
      ) : (
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-gradient-to-r from-primary/[0.035] via-chart-2/[0.06] to-chart-3/[0.045] bg-[length:260%_100%]"
          style={{ backgroundPosition: "0% 50%" }}
          animate={{ backgroundPosition: ["0% 50%", "100% 50%"] }}
          transition={{
            duration: 14,
            repeat: Infinity,
            repeatType: "mirror",
            ease: "linear",
          }}
        />
      )}

      <div className="relative z-10 mx-auto max-w-4xl px-3 text-center">
        <div className="flex flex-col items-center justify-center gap-0">
          <p className="flex flex-wrap items-center justify-center gap-x-0.5 text-[0.55rem] font-medium uppercase tracking-[0.18em] text-muted-foreground sm:text-[0.58rem]">
            <span>Built with</span>
            <HeartPulse className="text-[0.7rem] leading-none sm:text-xs" />
            <span>by</span>
          </p>
          <p className="mt-0.5">
            {reduceMotion ? (
              <span className={`${nameClass} text-blue-950`}>Yaksh</span>
            ) : (
              <motion.span
                className={`${nameClass} ${nameGradientClass}`}
                style={{ backgroundPosition: "0% 50%" }}
                animate={{ backgroundPosition: ["0% 50%", "100% 50%"] }}
                transition={{
                  duration: 5.5,
                  repeat: Infinity,
                  repeatType: "mirror",
                  ease: "linear",
                }}
                whileHover={{
                  scale: 1.05,
                  transition: { type: "spring", stiffness: 400, damping: 15 },
                }}
                whileTap={{ scale: 0.96 }}
              >
                Yaksh
              </motion.span>
            )}
          </p>
          <p className="mt-2 text-[0.5rem] text-muted-foreground/70 sm:text-[0.52rem]">
            <a href="/admin/login" className="underline-offset-2 hover:text-muted-foreground hover:underline">
              Admin
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
