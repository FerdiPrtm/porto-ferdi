import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ExternalLink, FolderGit2 } from "lucide-react";
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
      <Link
        href="/projects"
        className="inline-flex w-fit items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Semua Project
      </Link>

      <div className="space-y-3">
        <p className="text-xs font-medium uppercase tracking-widest text-primary">
          {project.created_at
            ? formatDate(project.created_at)
            : project.slug}
        </p>
        <h1 className="bg-gradient-to-r from-indigo-400 via-violet-400 to-fuchsia-400 bg-clip-text text-3xl font-bold tracking-tight text-transparent sm:text-4xl">
          {project.title}
        </h1>
        <div className="flex flex-wrap gap-2">
          {(project.tech_stack ?? []).map((tech: string) => (
            <span
              key={tech}
              className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm text-muted-foreground"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>

      <div className="relative aspect-video w-full overflow-hidden rounded-2xl border border-white/10 bg-muted">
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
          <div className="flex h-full items-center justify-center bg-gradient-to-br from-indigo-500/15 to-violet-600/15 text-primary/60">
            <FolderGit2 className="size-10" />
          </div>
        )}
      </div>

      <p className="whitespace-pre-wrap leading-relaxed text-muted-foreground">
        {project.description || "Belum ada deskripsi untuk project ini."}
      </p>

      <div className="flex flex-wrap gap-3">
        {project.demo_url && (
          <Button
            render={
              <a href={project.demo_url} target="_blank" rel="noopener noreferrer" />
            }
            className="gap-2"
          >
            <ExternalLink className="size-4" />
            Lihat Demo
          </Button>
        )}
        {project.repo_url && (
          <Button
            variant="outline"
            render={
              <a href={project.repo_url} target="_blank" rel="noopener noreferrer" />
            }
            className="gap-2"
          >
            <FolderGit2 className="size-4" />
            Source Code
          </Button>
        )}
      </div>
    </main>
  );
}