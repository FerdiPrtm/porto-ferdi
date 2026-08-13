import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import {
  ArrowRight,
  Briefcase,
  Download,
  GraduationCap,
  Mail,
  Send,
  Sparkles,
} from "lucide-react";
import {
  getExperiences,
  getFeaturedProjects,
  getProfile,
  getSkills,
} from "@/lib/data";
import { formatDateRange, truncate } from "@/lib/format";
import { openGraphMeta } from "@/lib/site";
import { ProjectCard } from "@/components/public/project-card";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Beranda",
  description:
    "Halaman utama portofolio — project unggulan, ringkasan, dan ajakan untuk berkolaborasi.",
  openGraph: openGraphMeta("/"),
};

function getInitials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

export default async function HomePage() {
  const [profile, featuredProjects, skills, experiences] = await Promise.all([
    getProfile(),
    getFeaturedProjects(),
    getSkills(),
    getExperiences(),
  ]);

  const name = profile?.full_name || "Portfolio";
  const tagline = profile?.tagline || "Fullstack Developer";
  const bio = profile?.bio || "";

  const stats = [
    {
      icon: Briefcase,
      label: "Project",
      value: String(featuredProjects.length),
    },
    { icon: Sparkles, label: "Pengalaman", value: String(experiences.length) },
    { icon: GraduationCap, label: "Keahlian", value: String(skills.length) },
  ];

  const skillsByCategory = new Map<string, typeof skills>();
  for (const skill of skills) {
    const category = skill.category ?? "Lainnya";
    if (!skillsByCategory.has(category)) skillsByCategory.set(category, []);
    skillsByCategory.get(category)!.push(skill);
  }

  return (
    <main className="flex flex-1 flex-col">
      {/* ---------- HERO ---------- */}
      <section className="relative overflow-hidden">
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-[-220px] size-[640px] -translate-x-1/2 rounded-full bg-primary/25 blur-[140px]" />
          <div className="absolute right-[-80px] top-24 size-[360px] rounded-full bg-violet-600/20 blur-[120px]" />
          <div className="absolute left-[-80px] top-1/2 size-[320px] rounded-full bg-sky-500/15 blur-[120px]" />
        </div>

        <div className="relative mx-auto flex w-full max-w-6xl flex-col items-center px-6 pb-20 pt-24 text-center sm:pt-28">
          <span className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-medium text-muted-foreground">
            <span className="relative flex size-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
              <span className="relative inline-flex size-2 rounded-full bg-emerald-400" />
            </span>
            {tagline}
          </span>

          <div className="mb-8">
            {profile?.avatar_url ? (
              <div className="rounded-full bg-gradient-to-br from-indigo-500 via-violet-500 to-fuchsia-500 p-[3px]">
                <Image
                  src={profile.avatar_url}
                  alt={name}
                  width={128}
                  height={128}
                  priority
                  className="size-28 rounded-full border-4 border-background object-cover sm:size-32"
                />
              </div>
            ) : (
              <div className="flex size-28 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 text-3xl font-bold text-white shadow-2xl shadow-indigo-500/30 sm:size-32">
                {getInitials(name)}
              </div>
            )}
          </div>

          <div className="space-y-5">
            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
              Halo, saya{" "}
              <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
                {name}
              </span>
            </h1>
            <p className="mx-auto max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              {bio ? truncate(bio, 260) : "Portofolio pribadi saya."}
            </p>
          </div>

          <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
            <Button
              size="lg"
              render={<Link href="/projects" />}
              className="gap-2"
            >
              Lihat Project
              <ArrowRight className="size-4" />
            </Button>
            {profile?.cv_url && (
              <Button
                size="lg"
                variant="outline"
                render={
                  <a
                    href={profile.cv_url}
                    target="_blank"
                    rel="noopener noreferrer"
                  />
                }
                className="gap-2"
              >
                <Download className="size-4" />
                Download CV
              </Button>
            )}
            <Button
              size="lg"
              variant="ghost"
              render={<Link href="/contact" />}
              className="gap-2"
            >
              <Mail className="size-4" />
              Hubungi Saya
            </Button>
          </div>

          <div className="mt-14 grid w-full max-w-xl grid-cols-3 gap-3">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-5"
              >
                <stat.icon className="mx-auto mb-2 size-5 text-primary" />
                <p className="text-2xl font-bold tracking-tight">
                  {stat.value}
                </p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- KEAIHLIAN ---------- */}
      {skills.length > 0 && (
        <section className="mx-auto w-full max-w-6xl px-6 py-16">
          <div className="mb-8">
            <p className="text-xs font-medium uppercase tracking-widest text-primary">
              Keahlian
            </p>
            <h2 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
              Tech stack yang saya kuasai
            </h2>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[...skillsByCategory.entries()].map(([category, items]) => (
              <div
                key={category}
                className="rounded-2xl border border-white/10 bg-white/[0.03] p-6"
              >
                <h3 className="mb-4 text-sm font-semibold text-primary">
                  {category}
                </h3>
                <ul className="space-y-3">
                  {items.map((skill) => (
                    <li key={skill.id}>
                      <div className="flex items-center justify-between text-sm">
                        <span className="flex items-center gap-2">
                          {skill.icon && <span>{skill.icon}</span>}
                          {skill.name}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {skill.level}/5
                        </span>
                      </div>
                      <div className="mt-1.5 flex gap-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <span
                            key={i}
                            className={`h-1.5 flex-1 rounded-full ${
                              i < skill.level
                                ? "bg-gradient-to-r from-indigo-500 to-violet-500"
                                : "bg-white/10"
                            }`}
                          />
                        ))}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ---------- PENGALAMAN ---------- */}
      {experiences.length > 0 && (
        <section className="mx-auto w-full max-w-6xl px-6 py-16">
          <div className="mb-8">
            <p className="text-xs font-medium uppercase tracking-widest text-primary">
              Perjalanan Karier
            </p>
            <h2 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
              Pengalaman Kerja
            </h2>
          </div>
          <ol className="relative space-y-8 border-l border-white/10 pl-8">
            {experiences.map((experience) => (
              <li key={experience.id} className="relative">
                <span className="absolute -left-[33px] top-1 flex size-4 items-center justify-center rounded-full border border-primary/40 bg-background">
                  <span className="size-2 rounded-full bg-primary" />
                </span>
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h3 className="font-semibold">{experience.title}</h3>
                    <span className="rounded-full border border-primary/30 bg-primary/10 px-3 py-0.5 text-xs font-medium text-primary">
                      {experience.company}
                    </span>
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground">
                    {formatDateRange(
                      experience.start_date,
                      experience.end_date
                    )}
                  </p>
                  {experience.description && (
                    <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">
                      {experience.description}
                    </p>
                  )}
                </div>
              </li>
            ))}
          </ol>
        </section>
      )}

      {/* ---------- PROJECT UNGGULAN ---------- */}
      {featuredProjects.length > 0 && (
        <section className="mx-auto w-full max-w-6xl px-6 py-16">
          <div className="mb-8 flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-medium uppercase tracking-widest text-primary">
                Portofolio
              </p>
              <h2 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
                Project Unggulan
              </h2>
            </div>
            <Button variant="ghost" render={<Link href="/projects" />}>
              Lihat semua
              <ArrowRight className="size-4" />
            </Button>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featuredProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </section>
      )}

      {/* ---------- CTA ---------- */}
      <section className="mx-auto w-full max-w-6xl px-6 py-16">
        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-indigo-600/20 via-violet-600/10 to-background px-8 py-14 text-center">
          <div
            aria-hidden
            className="pointer-events-none absolute -right-16 -top-16 size-56 rounded-full bg-violet-500/30 blur-[80px]"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -bottom-16 -left-16 size-56 rounded-full bg-indigo-500/30 blur-[80px]"
          />
          <h2 className="relative text-2xl font-bold tracking-tight sm:text-3xl">
            Tertarik bekerja sama?
          </h2>
          <p className="relative mx-auto mt-3 max-w-xl text-sm text-muted-foreground sm:text-base">
            Saya terbuka untuk kolaborasi, project freelance, atau sekadar
            bertukar pikiran. Jangan ragu untuk menghubungi saya.
          </p>
          <div className="relative mt-7 flex flex-wrap items-center justify-center gap-3">
            <Button size="lg" render={<Link href="/contact" />} className="gap-2">
              <Send className="size-4" />
              Kirim Pesan
            </Button>
            <Button
              size="lg"
              variant="outline"
              render={<Link href="/about" />}
            >
              Tentang Saya
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}