"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import StackIcon from "tech-stack-icons";
import { sectionShellClassName } from "@/lib/sectionLayout";
import { cn } from "@/lib/utils";

const CATEGORY_ORDER = ["Frontend", "Backend", "AI/ML", "Robotics", "Tools"];

function TechSkeleton() {
  return (
    <div className="flex flex-wrap items-center gap-x-6 gap-y-7 sm:gap-x-7 sm:gap-y-8">
      {Array.from({ length: 14 }, (_, k) => (
        <div
          key={k}
          className={cn(
            "size-[2.625rem] rounded-md bg-muted-foreground/[0.13] motion-reduce:animate-none",
            "animate-pulse sm:size-[2.875rem]",
          )}
        />
      ))}
    </div>
  );
}

function TechLogo({ name, icon }) {
  const initial = (name || "?").slice(0, 2).toUpperCase();
  const iconName = typeof icon === "string" ? icon.trim().toLowerCase() : "";

  if (!iconName) {
    return (
      <span
        className={cn(
          "flex size-[2.625rem] select-none items-center justify-center rounded-md",
          "text-[11px] font-bold tracking-tight text-muted-foreground sm:size-[2.875rem] sm:text-xs",
        )}
        aria-hidden
      >
        {initial}
      </span>
    );
  }

  return (
    <StackIcon
      name={iconName}
      className="size-[2.625rem] opacity-90 transition-opacity duration-150 group-hover:opacity-100 sm:size-[2.875rem]"
    />
  );
}

export default function TechStackSection({ headlineFontClass }) {
  const reduceMotion = useReducedMotion();
  const [items, setItems] = useState([]);
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setStatus("loading");
      try {
        const res = await fetch("/api/techstacks", {
          next: { revalidate: 120 },
        });
        const text = await res.text();
        if (cancelled) return;
        let data;
        try {
          data = JSON.parse(text);
        } catch {
          setItems([]);
          setStatus("error");
          return;
        }
        if (!res.ok || !data.success) {
          setItems([]);
          setStatus("error");
          return;
        }
        const list = Array.isArray(data.techstack) ? data.techstack : [];
        setItems(list);
        setStatus("ready");
      } catch {
        if (cancelled) return;
        setItems([]);
        setStatus("error");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const groupedItems = useMemo(() => {
    const rank = new Map(CATEGORY_ORDER.map((c, i) => [c, i]));
    const grouped = new Map();

    for (const item of items) {
      const category =
        typeof item?.category === "string" && item.category.trim() ? item.category : "Other";
      if (!grouped.has(category)) grouped.set(category, []);
      grouped.get(category).push(item);
    }

    const categories = Array.from(grouped.keys()).sort((a, b) => {
      const ra = rank.get(a) ?? 99;
      const rb = rank.get(b) ?? 99;
      if (ra !== rb) return ra - rb;
      return a.localeCompare(b);
    });

    return categories.map((category) => ({
      category,
      items: grouped
        .get(category)
        .slice()
        .sort((a, b) => String(a?.name ?? "").localeCompare(String(b?.name ?? ""))),
    }));
  }, [items]);

  const containerVariants = {
    hidden: {},
    show: {
      transition: { staggerChildren: reduceMotion ? 0 : 0.05, delayChildren: 0.04 },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 12 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
    },
  };

  return (
    <section
      id="techstack"
      className="relative w-full scroll-mt-28 bg-muted/25 px-4 py-16 sm:px-6 sm:py-20 md:scroll-mt-32"
      aria-labelledby="techstack-heading"
    >
      {/* Subtle lavender wash — blends with page bg (fixed radial on body) */}
      <div
        className="pointer-events-none absolute inset-0 -z-10 opacity-25 dark:opacity-20"
        style={{
          background:
            "radial-gradient(ellipse 80% 50% at 50% -20%, oklch(0.62 0.12 285 / 0.12), transparent 55%), radial-gradient(ellipse 60% 40% at 100% 50%, oklch(0.72 0.1 300 / 0.08), transparent 50%)",
        }}
        aria-hidden
      />

      <div className={cn("relative", sectionShellClassName)}>
        <p className="text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
          Tech stack
        </p>
        <h2
          id="techstack-heading"
          className={cn(
            headlineFontClass,
            "mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl",
          )}
        >
          Tools & technologies
        </h2>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          Stack I reach for to ship reliable products.
        </p>

        <div className="mt-10 sm:mt-12">
          {status === "loading" ? <TechSkeleton /> : null}

          {status === "error" ? (
            <p className="text-sm text-muted-foreground" role="alert">
              Could not load tech stack. Check the database connection and API.
            </p>
          ) : null}

          {status === "ready" && items.length === 0 ? (
            <p className="text-sm text-muted-foreground">No technologies listed yet.</p>
          ) : null}

          {status === "ready" && groupedItems.length > 0 ? (
            <div className="space-y-8 sm:space-y-10">
              {groupedItems.map((group) => (
                <div key={group.category}>
                  <h3 className="mb-4 text-sm font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                    {group.category}
                  </h3>
                  <motion.ul
                    className="flex flex-wrap items-center gap-x-6 gap-y-7 sm:gap-x-8 sm:gap-y-9"
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, margin: "-40px" }}
                  >
                    {group.items.map((tech) => {
                      const label = typeof tech.name === "string" ? tech.name : "Technology";
                      return (
                        <motion.li
                          key={String(tech._id ?? `${group.category}-${tech.name}`)}
                          variants={cardVariants}
                          className="shrink-0"
                        >
                          <div
                            tabIndex={0}
                            title={label}
                            className={cn(
                              "group relative inline-flex cursor-default items-center justify-center outline-none",
                              "rounded-md focus-visible:ring-2 focus-visible:ring-primary/35 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                            )}
                            aria-label={label}
                          >
                            <TechLogo name={tech.name} icon={tech.icon} />
                            <span
                              className={cn(
                                "pointer-events-none absolute bottom-full left-1/2 z-20 mb-2 -translate-x-1/2 whitespace-nowrap rounded-md bg-foreground px-2.5 py-1 text-center text-xs font-medium text-background shadow-md",
                                "invisible opacity-0 transition-[opacity,visibility] duration-150",
                                "group-hover:visible group-hover:opacity-100",
                                "group-focus-within:visible group-focus-within:opacity-100",
                              )}
                              role="tooltip"
                            >
                              {label}
                            </span>
                          </div>
                        </motion.li>
                      );
                    })}
                  </motion.ul>
                </div>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
