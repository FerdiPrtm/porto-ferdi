import Image from "next/image";
import { FileText } from "lucide-react";
import type { Metadata } from "next";
import {
  getEducations,
  getExperiences,
  getProfile,
  getSkills,
} from "@/lib/data";
import { formatDateRange } from "@/lib/format";
import { openGraphMeta } from "@/lib/site";
import { Button } from "@/components/ui/button";
import { SkillIcon } from "@/components/public/skill-icon";

export const metadata: Metadata = {
  title: "Tentang Saya",
  description: "Profil, keahlian, pengalaman, dan pendidikan.",
  openGraph: openGraphMeta("/about"),
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

export default async function AboutPage() {
  const [profile, skills, experiences, educations] = await Promise.all([
    getProfile(),
    getSkills(),
    getExperiences(),
    getEducations(),
  ]);

  const name = profile?.full_name || "Portfolio";
  const tagline = profile?.tagline || "Fullstack Developer";

  const skillsByCategory = new Map<string, typeof skills>();
  for (const skill of skills) {
    const category = skill.category ?? "Lainnya";
    if (!skillsByCategory.has(category)) {
      skillsByCategory.set(category, []);
    }
    skillsByCategory.get(category)!.push(skill);
  }

  return (
    <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-16 px-6 py-16">
      <section className="flex flex-col items-center gap-6 text-center">
        <div className="rounded-full bg-gradient-to-br from-indigo-500 via-violet-500 to-fuchsia-500 p-[3px]">
          {profile?.avatar_url ? (
            <Image
              src={profile.avatar_url}
              alt={name}
              width={128}
              height={128}
              className="size-28 rounded-full border-4 border-background object-cover sm:size-32"
            />
          ) : (
            <div className="flex size-28 items-center justify-center rounded-full border-4 border-background bg-gradient-to-br from-indigo-500 to-violet-600 text-3xl font-bold text-white sm:size-32">
              {getInitials(name)}
            </div>
          )}
        </div>
        <div className="space-y-2">
          <h1 className="bg-gradient-to-r from-indigo-400 via-violet-400 to-fuchsia-400 bg-clip-text text-3xl font-bold tracking-tight text-transparent sm:text-4xl">
            {name}
          </h1>
          <p className="text-sm font-medium uppercase tracking-widest text-primary">
            {tagline}
          </p>
        </div>
        {profile?.bio && (
          <div className="w-full max-w-2xl rounded-2xl border border-white/10 bg-white/[0.03] p-6">
            <p className="whitespace-pre-wrap text-left text-sm leading-relaxed text-muted-foreground">
              {profile.bio}
            </p>
          </div>
        )}
        {profile?.cv_url && (
          <Button
            variant="outline"
            render={
              <a href={profile.cv_url} target="_blank" rel="noopener noreferrer" />
            }
            className="gap-2"
          >
            <FileText className="size-4" />
            Download CV
          </Button>
        )}
      </section>

      {skills.length > 0 && (
        <section className="space-y-6">
          <div>
            <p className="text-xs font-medium uppercase tracking-widest text-primary">
              Keahlian
            </p>
            <h2 className="mt-1 text-2xl font-bold tracking-tight">
              Tech stack yang saya kuasai
            </h2>
          </div>
          <div className="grid gap-6 sm:grid-cols-2">
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
                        <span className="flex items-center gap-2.5">
                          <SkillIcon
                            name={skill.name}
                            className="text-primary"
                          />
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

      {experiences.length > 0 && (
        <section className="space-y-6">
          <div>
            <p className="text-xs font-medium uppercase tracking-widest text-primary">
              Perjalanan Karier
            </p>
            <h2 className="mt-1 text-2xl font-bold tracking-tight">
              Pengalaman Kerja
            </h2>
          </div>
          <ol className="relative space-y-6 border-l border-white/10 pl-8">
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
                  <p className="mt-1.5 text-xs text-muted-foreground">
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

      {educations.length > 0 && (
        <section className="space-y-6">
          <div>
            <p className="text-xs font-medium uppercase tracking-widest text-primary">
              Latar Belakang
            </p>
            <h2 className="mt-1 text-2xl font-bold tracking-tight">
              Pendidikan
            </h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {educations.map((education) => (
              <div
                key={education.id}
                className="rounded-2xl border border-white/10 bg-white/[0.03] p-6"
              >
                <h3 className="font-semibold">{education.school}</h3>
                {education.degree && (
                  <p className="mt-1 text-sm text-muted-foreground">
                    {education.degree}
                  </p>
                )}
                <p className="mt-2 text-xs text-primary">
                  {formatDateRange(education.start_date, education.end_date)}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}