import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import { ExternalLink, FolderGit2 } from "lucide-react";
import { getProjectBySlug } from "@/lib/data";
import { formatDate } from "@/lib/format";
import { openGraphMeta, siteName } from "@/lib/site";
import { Button } from "@/components/ui/button";

export const revalidate = 3600;

export async function generateMetadata({
  params,
}: PageProps<"/projects/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) {
    return { title: "Project Tidak Ditemukan" };
  }
  const description =
    project.description ?? `Project ${project.title} yang pernah dikerjakan.`;
  const images = project.image_url
    ? [project.image_url]
    : openGraphMeta("/projects")?.images;
  return {
    title: project.title,
    description,
    openGraph: openGraphMeta(`/projects/${project.slug}`, {
      title: project.title,
      description,
      type: "article",
      images,
    }),
    twitter: {
      card: "summary_large_image",
      title: project.title,
      description,
      images,
      site: siteName,
    },
  };
}

export default async function ProjectDetailPage({
  params,
}: PageProps<"/projects/[slug]">) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-8 px-6 py-14">
      <div className="space-y-3">
        <p className="text-sm text-muted-foreground">
          {project.created_at
            ? formatDate(project.created_at)
            : project.slug}
        </p>
        <h1 className="text-3xl font-bold tracking-tight">{project.title}</h1>
        <div className="flex flex-wrap gap-2">
          {(project.tech_stack ?? []).map((tech: string) => (
            <span
              key={tech}
              className="rounded-full bg-muted px-3 py-1 text-sm text-muted-foreground"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>

      <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-muted ring-1 ring-foreground/10">
        {project.image_url ? (
          <Image
            src={project.image_url}
            alt={project.title}
            fill
            priority
            sizes="(max-width: 768px) 100vw, 768px"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-muted-foreground">
            <FolderGit2 className="size-10" />
          </div>
        )}
      </div>

      <p className="whitespace-pre-wrap leading-relaxed">
        {project.description || "Belum ada deskripsi untuk project ini."}
      </p>

      <div className="flex flex-wrap gap-3">
        {project.demo_url && (
          <Button
            render={
              <a href={project.demo_url} target="_blank" rel="noopener noreferrer" />
            }
          >
            <ExternalLink />
            Lihat Demo
          </Button>
        )}
        {project.repo_url && (
          <Button
            variant="outline"
            render={
              <a href={project.repo_url} target="_blank" rel="noopener noreferrer" />
            }
          >
            <FolderGit2 />
            Source Code
          </Button>
        )}
      </div>
    </main>
  );
}