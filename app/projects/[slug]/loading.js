import { cn } from "@/lib/utils";
import { sectionShellClassName } from "@/lib/sectionLayout";

export default function ProjectDetailLoading() {
  return (
    <div
      className={cn(
        sectionShellClassName,
        "px-4 pb-12 pt-2 motion-reduce:animate-none animate-pulse sm:px-6 sm:pb-16 sm:pt-3 md:pb-20",
      )}
      aria-busy
      aria-label="Loading project"
    >
      <div className="h-4 w-28 rounded-md bg-muted-foreground/15" />
      <div className="mt-6 h-9 max-w-xl rounded-lg bg-muted-foreground/15 sm:h-11" />
      <div className="mt-3 h-5 max-w-lg rounded-md bg-muted-foreground/12" />
      <div className="mt-2 h-4 w-40 rounded-md bg-muted-foreground/12" />
      <div className="mt-6 flex flex-wrap gap-2">
        <div className="h-7 w-16 rounded-full bg-muted-foreground/12" />
        <div className="h-7 w-20 rounded-full bg-muted-foreground/12" />
        <div className="h-7 w-14 rounded-full bg-muted-foreground/12" />
      </div>
      <div className="mt-8 aspect-video w-full rounded-2xl bg-muted-foreground/15 ring-1 ring-border/60" />
      <div className="mt-10 space-y-3">
        <div className="h-4 w-full rounded-md bg-muted-foreground/12" />
        <div className="h-4 w-full rounded-md bg-muted-foreground/12" />
        <div className="h-4 w-[92%] rounded-md bg-muted-foreground/12" />
        <div className="h-4 w-[80%] rounded-md bg-muted-foreground/12" />
      </div>
      <div className="mt-10 flex gap-3">
        <div className="h-11 w-32 rounded-full bg-muted-foreground/15" />
        <div className="h-11 w-28 rounded-full bg-muted-foreground/15" />
      </div>
    </div>
  );
}
