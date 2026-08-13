import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { getFeaturedProjects, getProfile } from "@/lib/data";
import { truncate } from "@/lib/format";
import { openGraphMeta } from "@/lib/site";
import { ProjectCard } from "@/components/public/project-card";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Beranda",
  description:
    "Halaman utama portofolio — project unggulan, ringkasan, dan ajakan untuk berkolaborasi.",
  openGraph: openGraphMeta("/"),
};

export default async function HomePage() {
  const [profile, featuredProjects] = await Promise.all([
    getProfile(),
    getFeaturedProjects(),
  ]);

  const name = profile?.full_name || "Portfolio";
  const tagline = profile?.tagline || "Fullstack Developer";
  const bio = profile?.bio || "";

  return (
    <main className="flex flex-1 flex-col">
      <section className="mx-auto flex w-full max-w-5xl flex-col items-center gap-8 px-6 py-20 text-center">
        {profile?.avatar_url && (
          <Image
            src={profile.avatar_url}
            alt={name}
            width={112}
            height={112}
            priority
            className="size-28 rounded-full object-cover ring-1 ring-foreground/10"
          />
        )}
        <div className="space-y-4">
          <p className="text-sm font-medium uppercase tracking-widest text-primary">
            {tagline}
          </p>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Halo, saya <span className="text-primary">{name}</span>
          </h1>
          <p className="mx-auto max-w-2xl text-muted-foreground">
            {bio ? truncate(bio, 240) : "Portofolio pribadi saya."}
          </p>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Button render={<Link href="/projects" />}>Lihat Project</Button>
          {profile?.cv_url && (
            <Button
              variant="outline"
              render={
                <a href={profile.cv_url} target="_blank" rel="noopener noreferrer" />
              }
            >
              Download CV
            </Button>
          )}
          <Button variant="ghost" render={<Link href="/about" />}>
            Tentang Saya
          </Button>
          <Button variant="outline" render={<Link href="/contact" />}>
            Hubungi Saya
          </Button>
        </div>
      </section>

      {featuredProjects.length > 0 && (
        <section className="mx-auto w-full max-w-5xl px-6 py-16">
          <div className="mb-6 flex items-end justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">
                Project Unggulan
              </h2>
              <p className="text-sm text-muted-foreground">
                Beberapa project pilihan yang pernah saya kerjakan.
              </p>
            </div>
            <Button variant="ghost" size="sm" render={<Link href="/projects" />}>
              Lihat semua
            </Button>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {featuredProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}