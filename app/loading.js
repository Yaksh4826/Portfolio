import { cn } from "@/lib/utils";
import { sectionShellClassName } from "@/lib/sectionLayout";

/** Initial route skeleton — brief pulse while the home RSC stream resolves. */
export default function RootLoading() {
  return (
    <div
      className={cn(
        sectionShellClassName,
        "motion-reduce:animate-none animate-pulse px-4 pb-16 pt-4 sm:px-6 sm:pb-20 sm:pt-6",
      )}
      aria-busy
      aria-label="Loading page"
    >
      <div className="flex flex-col gap-10 lg:grid lg:grid-cols-[1fr_0.95fr] lg:items-center lg:gap-10">
        <div className="order-2 space-y-5 lg:order-1">
          <div className="h-3 w-32 rounded-md bg-muted-foreground/15" />
          <div className="h-5 w-48 rounded-md bg-muted-foreground/12" />
          <div className="h-12 max-w-md rounded-lg bg-muted-foreground/15 sm:h-14" />
          <div className="h-4 w-full max-w-lg rounded-md bg-muted-foreground/12" />
          <div className="h-4 w-full max-w-md rounded-md bg-muted-foreground/12" />
          <div className="flex gap-3 pt-2">
            <div className="h-10 w-36 rounded-full bg-muted-foreground/15" />
            <div className="h-10 w-36 rounded-full bg-muted-foreground/15" />
          </div>
        </div>
        <div className="order-1 mx-auto aspect-square w-full max-w-[280px] rounded-2xl bg-muted-foreground/15 lg:order-2" />
      </div>
    </div>
  );
}
