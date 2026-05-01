import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { sectionShellClassName } from "@/lib/sectionLayout";
import { cn } from "@/lib/utils";

export default function ContactInviteSection({ headlineFontClass }) {
  return (
    <section
      className="relative w-full scroll-mt-28 bg-transparent px-4 py-12 sm:px-6 sm:py-14 md:scroll-mt-32"
      aria-labelledby="contact-invite-heading"
    >
      <div
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.3] dark:opacity-[0.22]"
        style={{
          background:
            "radial-gradient(ellipse 90% 55% at 50% 100%, oklch(0.62 0.12 285 / 0.09), transparent 58%)",
        }}
        aria-hidden
      />
      <div className={cn("relative flex flex-col items-start", sectionShellClassName)}>
        <p className="text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
          Contact
        </p>
        <h2
          id="contact-invite-heading"
          className={cn(
            headlineFontClass,
            "mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl",
          )}
        >
          Ready when you are
        </h2>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
          Whether it&apos;s a project idea, a role, or a quick hello — head to the contact page
          and say hi. I read everything and love hearing from people who care about good work.
        </p>
        <Link
          href="/contact"
          className="mt-6 inline-flex items-center justify-center gap-2 rounded-full border border-border bg-background px-6 py-2.5 text-sm font-semibold text-foreground shadow-sm transition hover:bg-muted/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
        >
          Open contact page
          <ArrowRight className="size-4" aria-hidden />
        </Link>
      </div>
    </section>
  );
}
