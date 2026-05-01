import { cn } from "@/lib/utils";
import { sectionShellClassName } from "@/lib/sectionLayout";

export default function ContactLoading() {
  return (
    <div
      className={cn(sectionShellClassName, "motion-reduce:animate-none mx-auto max-w-3xl animate-pulse px-4 pt-2 pb-10 sm:px-6 sm:pt-3")}
      aria-busy
      aria-label="Loading contact"
    >
      <div className="h-4 w-32 rounded-md bg-muted-foreground/15" />
      <div className="mt-5 h-8 max-w-xs rounded-lg bg-muted-foreground/15 sm:mt-6 sm:h-9" />
      <div className="mt-3 h-4 max-w-md rounded-md bg-muted-foreground/12" />
      <div className="mt-10 grid gap-8 lg:grid-cols-2">
        <div className="space-y-4">
          <div className="h-3 w-20 rounded bg-muted-foreground/12" />
          <div className="h-20 rounded-xl bg-muted-foreground/15" />
          <div className="h-20 rounded-xl bg-muted-foreground/15" />
        </div>
        <div className="rounded-2xl border border-border/50 bg-muted/25 p-5">
          <div className="h-3 w-28 rounded bg-muted-foreground/12" />
          <div className="mt-5 space-y-4">
            <div className="h-10 w-full rounded-xl bg-muted-foreground/12" />
            <div className="h-10 w-full rounded-xl bg-muted-foreground/12" />
            <div className="h-28 w-full rounded-xl bg-muted-foreground/12" />
            <div className="h-10 w-36 rounded-full bg-muted-foreground/15" />
          </div>
        </div>
      </div>
    </div>
  );
}
