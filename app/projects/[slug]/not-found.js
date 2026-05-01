import BackToProjectsLink from "@/components/BackToProjectsLink";
import { sectionShellClassName } from "@/lib/sectionLayout";
import { cn } from "@/lib/utils";

export default function ProjectNotFound() {
  return (
    <div
      className={cn(
        sectionShellClassName,
        "px-4 py-16 text-center sm:px-6 sm:py-20 md:py-24",
      )}
    >
      <p className="text-sm font-medium text-muted-foreground">Project</p>
      <h1 className="mt-2 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
        This project doesn&apos;t exist
      </h1>
      <p className="mx-auto mt-3 max-w-md text-sm text-muted-foreground">
        The slug in the URL may be wrong or this project was removed.
      </p>
      <div className="flex justify-center">
        <BackToProjectsLink variant="button" />
      </div>
    </div>
  );
}
