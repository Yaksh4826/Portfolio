import { cn } from "@/lib/utils";
import { sectionShellClassName } from "@/lib/sectionLayout";

/**
 * Visual partition between homepage sections — gradient rules + inset dot, aligned with content shell.
 */
export default function HomeSectionDivider({ className }) {
  return (
    <div
      aria-hidden
      className={cn(
        "relative w-full shrink-0 px-4 pb-8 pt-4 sm:px-6 sm:pb-10 sm:pt-6",
        className,
      )}
    >
      <div className={cn(sectionShellClassName, "relative flex items-center gap-5 sm:gap-6")}>
        <span className="h-px min-w-8 flex-1 bg-gradient-to-r from-transparent via-border to-border/85 sm:min-w-12" />
        <span className="size-1.5 shrink-0 rounded-full bg-primary/50 shadow-[0_0_0_5px_theme(colors.primary/8%)] ring-1 ring-primary/25" />
        <span className="h-px min-w-8 flex-1 bg-gradient-to-l from-transparent via-border to-border/85 sm:min-w-12" />
      </div>
    </div>
  );
}
