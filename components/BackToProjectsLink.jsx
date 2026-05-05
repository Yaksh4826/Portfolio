"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

/** Client island: link from project detail back to paginated `/projects` index. */
export default function BackToProjectsLink({ variant = "inline" }) {
  const className =
    variant === "inline"
      ? "inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition hover:text-foreground"
      : "mt-8 inline-flex items-center gap-2 rounded-full border border-border bg-background px-6 py-2.5 text-sm font-semibold text-foreground shadow-sm transition hover:bg-muted/80";

  return (
    <Link href="/projects" prefetch className={className}>
      <ArrowLeft className="size-4" />
      Back to projects
    </Link>
  );
}
