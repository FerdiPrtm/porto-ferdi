import Link from "next/link";
import type { Metadata } from "next";
import { getProjects } from "@/lib/data";
import { openGraphMeta } from "@/lib/site";
import { ProjectCard } from "@/components/public/project-card";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Projects",
  description: "Kumpulan project yang pernah saya kerjakan.",
  openGraph: openGraphMeta("/projects"),
};

export default async function ProjectsPage({
  searchParams,
}: PageProps<"/projects">) {
  const params = await searchParams;
  const rawTech = params?.tech;
  const tech =
    typeof rawTech === "string" && rawTech.length > 0 ? rawTech : null;

  const projects = await getProjects();

  const allTech = [
    ...new Set(projects.flatMap((project) => project.tech_stack ?? [])),
  ].sort((a: string, b: string) => a.localeCompare(b, "id"));

  const filtered = tech
    ? projects.filter((project) =>
        (project.tech_stack ?? []).some(
          (item: string) => item.toLowerCase() === tech.toLowerCase()
        )
      )
    : projects;

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col px-6 py-14">
      <div className="mb-8 space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
        <p className="text-muted-foreground">
          Berikut project yang pernah saya kerjakan.
        </p>
      </div>

      {allTech.length > 0 && (
        <div className="mb-8 flex flex-wrap gap-2">
          <Link
            href="/projects"
            className={cn(
              "rounded-full border px-3 py-1 text-sm transition-colors",
              !tech
                ? "border-primary bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            Semua
          </Link>
          {allTech.map((item) => (
            <Link
              key={item}
              href={`/projects?tech=${encodeURIComponent(item)}`}
              className={cn(
                "rounded-full border px-3 py-1 text-sm transition-colors",
                tech === item
                  ? "border-primary bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {item}
            </Link>
          ))}
        </div>
      )}

      {filtered.length === 0 ? (
        <p className="text-muted-foreground">
          Belum ada project untuk ditampilkan.
        </p>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}
    </main>
  );
}