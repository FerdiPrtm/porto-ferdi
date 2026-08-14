import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, FolderGit2 } from "lucide-react";
import { truncate } from "@/lib/format";

export type PublicProject = {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  tech_stack: string[] | null;
  image_url: string | null;
  demo_url: string | null;
  repo_url: string | null;
};

export function ProjectCard({ project }: { project: PublicProject }) {
  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-xl hover:shadow-orange-500/10">
      <Link
        href={`/projects/${project.slug}`}
        className="relative block aspect-video w-full overflow-hidden bg-muted"
      >
        {project.image_url ? (
          <Image
            src={project.image_url}
            alt={project.title}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-gradient-to-br from-amber-500/15 to-orange-600/15 text-primary/60">
            <FolderGit2 className="size-10 transition-transform duration-500 group-hover:scale-110" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        <span className="absolute right-3 top-3 flex size-8 items-center justify-center rounded-full bg-background/80 opacity-0 backdrop-blur transition-opacity duration-300 group-hover:opacity-100">
          <ArrowUpRight className="size-4" />
        </span>
      </Link>

      <div className="flex flex-1 flex-col gap-2 p-5">
        <div className="flex items-start justify-between gap-2">
          <Link
            href={`/projects/${project.slug}`}
            className="font-semibold transition-colors group-hover:text-primary"
          >
            {project.title}
          </Link>
        </div>
        {project.description && (
          <p className="text-sm text-muted-foreground">
            {truncate(project.description, 140)}
          </p>
        )}
        {project.tech_stack && project.tech_stack.length > 0 && (
          <div className="mt-auto flex flex-wrap gap-1.5 pt-3">
            {project.tech_stack.slice(0, 4).map((tech) => (
              <span
                key={tech}
                className="rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-xs text-muted-foreground"
              >
                {tech}
              </span>
            ))}
            {project.tech_stack.length > 4 && (
              <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-xs text-muted-foreground">
                +{project.tech_stack.length - 4}
              </span>
            )}
          </div>
        )}
        <div className="flex items-center gap-3 pt-4 text-muted-foreground">
          <Link
            href={`/projects/${project.slug}`}
            className="text-xs font-medium text-primary hover:underline"
          >
            Lihat Detail
          </Link>
          <span className="text-white/15">•</span>
          {project.repo_url && (
            <a
              href={project.repo_url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Repositori ${project.title}`}
              className="transition-colors hover:text-foreground"
            >
              <FolderGit2 className="size-4" />
            </a>
          )}
          {project.demo_url && (
            <a
              href={project.demo_url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Demo ${project.title}`}
              className="transition-colors hover:text-foreground"
            >
              <ArrowUpRight className="size-4" />
            </a>
          )}
        </div>
      </div>
    </article>
  );
}