import Link from "next/link";
import Image from "next/image";
import { ExternalLink, FolderGit2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
    <Card className="flex flex-col">
      <Link href={`/projects/${project.slug}`} className="group relative block">
        <div className="relative aspect-video w-full overflow-hidden bg-muted">
          {project.image_url ? (
            <Image
              src={project.image_url}
              alt={project.title}
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-muted-foreground">
              <FolderGit2 className="size-8" />
            </div>
          )}
        </div>
      </Link>

      <CardContent className="flex flex-1 flex-col gap-2">
        <div className="flex items-center justify-between gap-2">
          <Link
            href={`/projects/${project.slug}`}
            className="font-medium hover:underline"
          >
            {project.title}
          </Link>
          <div className="flex items-center gap-2 text-muted-foreground">
            {project.repo_url && (
              <a
                href={project.repo_url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Repositori ${project.title}`}
                className="hover:text-foreground"
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
                className="hover:text-foreground"
              >
                <ExternalLink className="size-4" />
              </a>
            )}
          </div>
        </div>
        {project.description && (
          <p className="text-sm text-muted-foreground">
            {truncate(project.description, 140)}
          </p>
        )}
        {project.tech_stack && project.tech_stack.length > 0 && (
          <div className="mt-auto flex flex-wrap gap-1.5 pt-2">
            {project.tech_stack.slice(0, 4).map((tech) => (
              <span
                key={tech}
                className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground"
              >
                {tech}
              </span>
            ))}
            {project.tech_stack.length > 4 && (
              <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                +{project.tech_stack.length - 4}
              </span>
            )}
          </div>
        )}
      </CardContent>

      <CardFooter>
        <Button
          variant="outline"
          size="sm"
          render={<Link href={`/projects/${project.slug}`} />}
        >
          Lihat Detail
        </Button>
      </CardFooter>
    </Card>
  );
}