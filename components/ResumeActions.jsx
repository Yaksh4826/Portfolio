import { FileText } from "lucide-react";
import { cn } from "@/lib/utils";

const heroBtnClass =
  "inline-flex h-9 min-h-9 flex-1 items-center justify-center gap-1.5 rounded-full border border-border bg-muted/40 px-4 text-xs font-semibold text-foreground transition hover:bg-muted/70 active:scale-[0.98] sm:h-11 sm:min-h-11 sm:flex-initial sm:px-6 sm:text-sm";

const contactChipClass =
  "inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-3 py-1.5 text-xs font-semibold text-foreground transition hover:bg-muted/80";

/** Signed Cloudinary view URL from the server. */
export default function ResumeActions({ viewUrl, className, variant = "hero" }) {
  if (!viewUrl) return null;

  const btnClass = variant === "contact" ? contactChipClass : heroBtnClass;
  const label = "View resume";

  const link = (
    <a href={viewUrl} target="_blank" rel="noopener noreferrer" className={btnClass}>
      <FileText className="size-3.5 shrink-0 sm:size-4" aria-hidden />
      {label}
    </a>
  );

  if (variant === "contact") {
    return (
      <li className={className}>
        <div className="rounded-xl border border-border/80 bg-card/40 px-4 py-3">
          <div className="flex items-start gap-3">
            <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted">
              <FileText className="size-4 text-foreground" aria-hidden />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Resume
              </p>
              <div className="mt-2">{link}</div>
            </div>
          </div>
        </div>
      </li>
    );
  }

  return (
    <div
      className={cn(
        "mt-2 flex w-full sm:flex-row sm:flex-wrap sm:gap-3",
        className,
      )}
    >
      {link}
    </div>
  );
}

