import { sectionShellClassName } from "@/lib/sectionLayout";
import { cn } from "@/lib/utils";

function normalizeBullets(description) {
  if (!Array.isArray(description)) return [];
  return description.map((s) => (typeof s === "string" ? s.trim() : "")).filter(Boolean);
}

function normalizeTech(technologies) {
  if (!Array.isArray(technologies)) return [];
  return technologies.map((s) => (typeof s === "string" ? s.trim() : "")).filter(Boolean);
}

export default function ExperienceSection({ experiences = [], headlineFontClass }) {
  const list = Array.isArray(experiences) ? experiences : [];

  return (
    <section
      id="experience"
      className="relative w-full scroll-mt-28 bg-muted/20 px-4 py-14 sm:px-6 sm:py-16 md:scroll-mt-32 md:py-20"
      aria-labelledby="experience-heading"
    >
      <div className={sectionShellClassName}>
        <p className="text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
          Experience
        </p>
        <h2
          id="experience-heading"
          className={cn(
            headlineFontClass,
            "mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl",
          )}
        >
          Where I&apos;ve worked
        </h2>

        {list.length === 0 ? (
          <p className="mt-10 text-sm text-muted-foreground">No experience to show yet.</p>
        ) : (
          <ul className="mt-10 sm:mt-12">
            {list.map((exp, i) => {
              const isLast = i === list.length - 1;
              const bullets = normalizeBullets(exp.description);
              const tech = normalizeTech(exp.technologies);
              const duration = typeof exp.duration === "string" ? exp.duration.trim() : "";
              const role = typeof exp.role === "string" ? exp.role.trim() : "";
              const company = typeof exp.company === "string" ? exp.company.trim() : "";
              const location = typeof exp.location === "string" ? exp.location.trim() : "";

              return (
                <li
                  key={
                    typeof exp._id === "string"
                      ? exp._id
                      : exp._id?.toString?.() || `${company}-${i}`
                  }
                  className="flex items-stretch gap-6 sm:gap-10"
                >
                  {/* Timeline rail: hollow node + vertical segment */}
                  <div className="flex w-4 shrink-0 flex-col items-center pt-0.5 sm:w-5">
                    <span
                      className="size-3 shrink-0 rounded-full border-2 border-muted-foreground/45 bg-background sm:size-3.5"
                      aria-hidden
                    />
                    {!isLast ? (
                      <span
                        className="mt-3 w-px flex-1 bg-border"
                        style={{ minHeight: "1.25rem" }}
                        aria-hidden
                      />
                    ) : null}
                  </div>

                  <div className="min-w-0 flex-1 pb-14 sm:pb-16">
                    {duration ? (
                      <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                        {duration}
                      </p>
                    ) : null}

                    <div className="mt-2 flex flex-wrap items-baseline gap-x-2 gap-y-1">
                      {role ? (
                        <span className="text-base font-semibold text-foreground sm:text-lg">
                          {role}
                          {company ? " at" : ""}
                        </span>
                      ) : null}
                      {company ? (
                        <span className="inline-flex items-center rounded-md border border-border bg-background px-2.5 py-0.5 text-sm font-medium text-foreground shadow-sm sm:text-[0.9375rem]">
                          {company}
                        </span>
                      ) : null}
                    </div>

                    {location ? (
                      <p className="mt-1.5 text-sm text-muted-foreground">{location}</p>
                    ) : null}

                    {bullets.length > 0 ? (
                      <ul className="mt-4 list-disc space-y-2 ps-5 text-[0.9375rem] leading-relaxed text-muted-foreground sm:text-base">
                        {bullets.map((line, j) => (
                          <li key={j}>{line}</li>
                        ))}
                      </ul>
                    ) : null}

                    {tech.length > 0 ? (
                      <ul className="mt-5 flex flex-wrap gap-x-4 gap-y-2">
                        {tech.map((t) => (
                          <li
                            key={t}
                            className="text-xs font-medium text-muted-foreground sm:text-sm"
                          >
                            {t}
                          </li>
                        ))}
                      </ul>
                    ) : null}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </section>
  );
}
