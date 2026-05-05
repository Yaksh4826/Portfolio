import Link from "next/link";
import { Space_Grotesk } from "next/font/google";
import { ArrowLeft } from "lucide-react";
import PageEnter from "@/components/PageEnter";
import ProjectCard from "@/components/ProjectCard";
import { getProjectCardsPaged } from "@/app/lib/projectQueries";
import { cn } from "@/lib/utils";
import { sectionShellClassName } from "@/lib/sectionLayout";

const titleFont = Space_Grotesk({ subsets: ["latin"], display: "swap" });

const PAGE_SIZE_DEFAULT = 10;

export const metadata = {
  title: "Projects · Portfolio",
  description: "Portfolio projects — newest first.",
};

export const revalidate = 60;

function paginationHref(page, pageSize) {
  const q = new URLSearchParams({ page: String(page) });
  if (pageSize !== PAGE_SIZE_DEFAULT) q.set("pageSize", String(pageSize));
  return `/projects?${q.toString()}`;
}

/** @param {{ searchParams?: Promise<{ page?: string; pageSize?: string }> }} props */
export default async function ProjectsListPage(props) {
  const sp = (await props.searchParams) ?? {};
  const rawPage = Number(sp.page);
  const rawSize = Number(sp.pageSize);
  const page = Math.max(1, Number.isFinite(rawPage) ? Math.floor(rawPage) : 1);
  const pageSize = Number.isFinite(rawSize)
    ? Math.min(Math.max(Math.floor(rawSize), 1), 48)
    : PAGE_SIZE_DEFAULT;

  const { projects, total, totalPages, pageSize: resolvedSize } =
    await getProjectCardsPaged(page, pageSize);
  const from = total === 0 ? 0 : (page - 1) * resolvedSize + 1;
  const to = Math.min(page * resolvedSize, total);

  return (
    <PageEnter>
      <div className="mx-auto w-full max-w-none px-4 pt-2 pb-12 sm:px-6 sm:pb-14 md:pb-16">
        <Link
          href="/"
          prefetch
          className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          Back to home
        </Link>

        <header className={cn(sectionShellClassName, "mt-6 sm:mt-8")}>
          <p className="text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            Portfolio
          </p>
          <h1
            className={cn(
              titleFont.className,
              "mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl",
            )}
          >
            All projects
          </h1>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            Everything here, newest completions first — open any card for the full story.
          </p>
        </header>

        <div className={cn(sectionShellClassName, "mt-10 flex flex-col gap-10 lg:gap-14 sm:mt-12")}>
          {projects.length === 0 ? (
            <p className="text-sm text-muted-foreground">No projects yet.</p>
          ) : (
            projects.map((project, i) => (
              <ProjectCard
                key={String(project.slug ?? project._id ?? i)}
                project={project}
                index={(page - 1) * resolvedSize + i}
                headlineFontClass={titleFont.className}
              />
            ))
          )}
        </div>

        {totalPages > 1 ? (
          <footer
            className={cn(
              sectionShellClassName,
              "mt-12 flex flex-col items-stretch gap-4 border-t border-border/50 pt-8 sm:flex-row sm:items-center sm:justify-between sm:gap-6",
            )}
          >
            <p className="text-sm text-muted-foreground">
              {total === 0 ? "No entries" : `Showing ${from}–${to} of ${total}`}
            </p>
            <nav className="flex flex-wrap items-center gap-3" aria-label="Project pages">
              {page > 1 ? (
                <Link
                  href={paginationHref(page - 1, resolvedSize)}
                  prefetch
                  className="inline-flex min-h-10 items-center justify-center rounded-full border border-border bg-background px-5 text-sm font-semibold text-foreground shadow-sm transition hover:bg-muted/80"
                >
                  Previous
                </Link>
              ) : (
                <span className="inline-flex min-h-10 cursor-not-allowed items-center justify-center rounded-full border border-transparent px-5 text-sm text-muted-foreground/50">
                  Previous
                </span>
              )}
              <span className="text-sm tabular-nums text-muted-foreground">
                Page {page} / {totalPages}
              </span>
              {page < totalPages ? (
                <Link
                  href={paginationHref(page + 1, resolvedSize)}
                  prefetch
                  className="inline-flex min-h-10 items-center justify-center rounded-full border border-border bg-background px-5 text-sm font-semibold text-foreground shadow-sm transition hover:bg-muted/80"
                >
                  Next
                </Link>
              ) : (
                <span className="inline-flex min-h-10 cursor-not-allowed items-center justify-center rounded-full border border-transparent px-5 text-sm text-muted-foreground/50">
                  Next
                </span>
              )}
            </nav>
          </footer>
        ) : null}
      </div>
    </PageEnter>
  );
}
