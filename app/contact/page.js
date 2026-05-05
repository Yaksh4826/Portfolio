import Link from "next/link";
import { Space_Grotesk } from "next/font/google";
import { ArrowLeft, Mail, Phone } from "lucide-react";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { SiGmail } from "react-icons/si";
import PageEnter from "@/components/PageEnter";
import { cn } from "@/lib/utils";
import ContactForm from "@/components/ContactForm";
import { getBaseUrl } from "@/lib/utils";

const titleFont = Space_Grotesk({ subsets: ["latin"], display: "swap" });

function buildTelHref(raw) {
  if (raw == null) return null;
  const s = String(raw).trim();
  if (!s) return null;
  const body = s.replace(/\s/g, "");
  if (!body) return null;
  return body.toLowerCase().startsWith("tel:") ? body : `tel:${body}`;
}

export const metadata = {
  title: "Contact · Yaksh Patel",
  description: "Get in touch for collaborations and opportunities.",
};

export const dynamic = 'force-dynamic';

export default async function ContactPage() {
  let name = "";
  let socials = {};
  try {
    const res = await fetch(`${getBaseUrl()}/api/profile`, { next: { revalidate: 120 } });
    const data = await res.json();
    const p = data?.profileData?.[0];
    if (p) {
      name = p.name || "";
      socials = p.socials || {};
    }
  } catch {
    /* optional */
  }

  const emailEnv = process.env.EMAIL;
  const mailHref =
    typeof emailEnv === "string" && emailEnv.includes("@")
      ? `mailto:${emailEnv}`
      : typeof emailEnv === "string"
        ? emailEnv.startsWith("mailto:")
          ? emailEnv
          : `mailto:${emailEnv}`
        : null;

  const callHref = buildTelHref(process.env.MOBILE_NO);
  const displayEmail =
    typeof emailEnv === "string"
      ? emailEnv.replace(/^mailto:/i, "").trim()
      : null;

  return (
    <PageEnter>
      <div className="mx-auto max-w-3xl px-4 pt-2 pb-10 sm:px-6 sm:pt-3 sm:pb-12 md:pb-14">
      <Link
        href="/"
        prefetch
        className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Back to home
      </Link>

      <header className="mt-4 sm:mt-5">
        <h1
          className={cn(
            titleFont.className,
            "text-3xl font-bold tracking-tight text-foreground sm:text-4xl",
          )}
        >
          Contact
        </h1>
        <p className="mt-2 max-w-xl text-muted-foreground">
          {name
            ? `Reach ${name.split(" ")[0] || name} for projects, freelance, or a quick chat.`
            : "Reach out for projects, freelance, or a quick chat."}
        </p>
      </header>

      <div className="mt-6 grid gap-8 sm:mt-8 lg:grid-cols-[1fr_1.1fr] lg:gap-10">
        <div className="space-y-6">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Details
          </h2>
          <ul className="space-y-4">
            {mailHref ? (
              <li>
                <a
                  href={mailHref}
                  className="group flex items-start gap-3 rounded-xl border border-border/80 bg-card/40 px-4 py-3 transition hover:border-border hover:bg-card/60"
                >
                  <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted">
                    <Mail className="size-4 text-foreground" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      Email
                    </p>
                    <p className="truncate text-sm font-medium text-foreground group-hover:underline">
                      {displayEmail || "Send an email"}
                    </p>
                  </div>
                </a>
              </li>
            ) : null}
            {callHref ? (
              <li>
                <a
                  href={callHref}
                  className="group flex items-start gap-3 rounded-xl border border-border/80 bg-card/40 px-4 py-3 transition hover:border-border hover:bg-card/60"
                >
                  <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted">
                    <Phone className="size-4 text-foreground" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      Phone
                    </p>
                    <p className="text-sm font-medium text-foreground group-hover:underline">
                      Call or text
                    </p>
                  </div>
                </a>
              </li>
            ) : null}
          </ul>

          {(socials.github || socials.linkedin || mailHref) ? (
            <div>
              <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                Social
              </h2>
              <div className="flex flex-wrap gap-3">
                {socials.github ? (
                  <a
                    href={socials.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex size-11 items-center justify-center rounded-full border border-border bg-background text-muted-foreground transition hover:text-foreground"
                    aria-label="GitHub"
                  >
                    <FaGithub className="size-5" />
                  </a>
                ) : null}
                {socials.linkedin ? (
                  <a
                    href={socials.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex size-11 items-center justify-center rounded-full border border-border bg-background text-muted-foreground transition hover:text-foreground"
                    aria-label="LinkedIn"
                  >
                    <FaLinkedin className="size-5" />
                  </a>
                ) : null}
                {mailHref ? (
                  <a
                    href={mailHref}
                    className="inline-flex size-11 items-center justify-center rounded-full border border-border bg-background text-muted-foreground transition hover:text-foreground"
                    aria-label="Email"
                  >
                    <SiGmail className="size-5" />
                  </a>
                ) : null}
              </div>
            </div>
          ) : null}

          {!mailHref && !callHref ? (
            <p className="text-sm text-muted-foreground">
              Add <code className="rounded bg-muted px-1 py-0.5 text-xs">EMAIL</code> and optional{" "}
              <code className="rounded bg-muted px-1 py-0.5 text-xs">MOBILE_NO</code> in{" "}
              <code className="rounded bg-muted px-1 py-0.5 text-xs">.env</code> to show contact details here.
            </p>
          ) : null}
        </div>

        <div className="rounded-2xl border border-border/80 bg-card/30 p-5 shadow-sm sm:p-6">
          <h2 className="mb-5 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Send a message
          </h2>
          <ContactForm />
        </div>
      </div>
    </div>
    </PageEnter>
  );
}
