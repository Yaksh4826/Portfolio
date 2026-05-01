"use client";

import { useEffect, useState } from "react";
import { sectionShellClassName } from "@/lib/sectionLayout";
import { cn } from "@/lib/utils";
import ProjectCard from "@/components/ProjectCard";

function ProjectCardSkeleton() {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border border-border/80 bg-muted/35 p-5 sm:p-6",
        "motion-reduce:animate-none animate-pulse",
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="h-6 w-[55%] max-w-xs rounded-md bg-muted-foreground/15" />
        <div className="size-9 shrink-0 rounded-full bg-muted-foreground/15" />
      </div>
      <div className="mt-4 aspect-video w-full rounded-xl bg-muted-foreground/15" />
      <div className="mt-4 space-y-2">
        <div className="h-4 w-full rounded-md bg-muted-foreground/15" />
        <div className="h-4 w-[90%] rounded-md bg-muted-foreground/15" />
        <div className="h-4 w-[70%] rounded-md bg-muted-foreground/15" />
      </div>
      <div className="mt-4 h-3 w-32 rounded-md bg-muted-foreground/15" />
      <div className="mt-4 flex flex-wrap gap-2">
        <div className="h-7 w-14 rounded-full bg-muted-foreground/15" />
        <div className="h-7 w-16 rounded-full bg-muted-foreground/15" />
        <div className="h-7 w-20 rounded-full bg-muted-foreground/15" />
      </div>
      <div className="mt-6 h-10 w-36 rounded-full bg-muted-foreground/15" />
    </div>
  );
}

export default function ProjectsSection({ headlineFontClass }) {
  const [projects, setProjects] = useState([]);
  const [status, setStatus] = useState("loading");
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setStatus("loading");
      setErrorMessage(null);
      try {
        const res = await fetch("/api/projects");
        const data = await res.json();
        if (cancelled) return;
        if (!data.success) {
          setProjects([]);
          setErrorMessage(typeof data.message === "string" ? data.message : "Could not load projects.");
          setStatus("error");
          return;
        }
        setProjects(Array.isArray(data.projects) ? data.projects : []);
        setStatus("ready");
      } catch {
        if (cancelled) return;
        setProjects([]);
        setErrorMessage("Could not load projects.");
        setStatus("error");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const showSkeleton = status === "loading";

  return (
    <section
      id="projects"
      className="relative w-full scroll-mt-28 px-4 py-14 sm:px-6 sm:py-16 md:scroll-mt-32 md:py-20"
      aria-labelledby="projects-heading"
    >
      <div className={sectionShellClassName}>
        <p className="text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
          Projects
        </p>
        <h2
          id="projects-heading"
          className={cn(
            headlineFontClass,
            "mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl",
          )}
        >
          Recent work
        </h2>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          Newest completions first — side projects, client work, and experiments.
        </p>

        <div className="mt-10 flex w-full flex-col gap-10 lg:gap-14">
          {showSkeleton
            ? [0, 1, 2].map((k) => <ProjectCardSkeleton key={k} />)
            : null}

          {!showSkeleton && status === "error" ? (
            <p className="w-full text-sm text-muted-foreground" role="alert">
              {errorMessage}
            </p>
          ) : null}

          {!showSkeleton && status === "ready" && projects.length === 0 ? (
            <p className="w-full text-sm text-muted-foreground">No projects yet.</p>
          ) : null}

          {!showSkeleton && status === "ready"
            ? projects.map((project, index) => (
                <ProjectCard
                  key={String(project.slug || project._id || index)}
                  project={project}
                  index={index}
                  headlineFontClass={headlineFontClass}
                />
              ))
            : null}
        </div>
      </div>
    </section>
  );
}
