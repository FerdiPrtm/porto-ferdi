import Image from "next/image";
import { FileText } from "lucide-react";
import {
  getEducations,
  getExperiences,
  getProfile,
  getSkills,
} from "@/lib/data";
import { formatDateRange } from "@/lib/format";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Tentang Saya",
  description: "Profil, keahlian, pengalaman, dan pendidikan.",
};

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
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-14 px-6 py-14">
      <section className="flex flex-col items-center gap-6 text-center">
        {profile?.avatar_url && (
          <Image
            src={profile.avatar_url}
            alt={name}
            width={128}
            height={128}
            className="size-32 rounded-full object-cover ring-1 ring-foreground/10"
          />
        )}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">{name}</h1>
          <p className="text-sm font-medium uppercase tracking-widest text-primary">
            {tagline}
          </p>
        </div>
        {profile?.bio && (
          <p className="max-w-2xl whitespace-pre-wrap text-muted-foreground">
            {profile.bio}
          </p>
        )}
        {profile?.cv_url && (
          <Button
            variant="outline"
            render={
              <a href={profile.cv_url} target="_blank" rel="noopener noreferrer" />
            }
          >
            <FileText />
            Download CV
          </Button>
        )}
      </section>

      {skills.length > 0 && (
        <section className="space-y-6">
          <h2 className="text-2xl font-bold tracking-tight">Keahlian</h2>
          <div className="grid gap-6 sm:grid-cols-2">
            {[...skillsByCategory.entries()].map(([category, items]) => (
              <div key={category} className="space-y-3">
                <h3 className="font-medium">{category}</h3>
                <div className="flex flex-wrap gap-2">
                  {items.map((skill) => (
                    <span
                      key={skill.id}
                      className="rounded-full bg-muted px-3 py-1 text-sm"
                    >
                      {skill.icon && `${skill.icon} `}
                      {skill.name}
                      <span className="ml-1 text-xs text-muted-foreground">
                        {skill.level}/5
                      </span>
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {experiences.length > 0 && (
        <section className="space-y-6">
          <h2 className="text-2xl font-bold tracking-tight">Pengalaman</h2>
          <ol className="relative space-y-8 border-l pl-6">
            {experiences.map((experience) => (
              <li key={experience.id} className="relative">
                <span className="absolute -left-[29px] top-1 size-2 rounded-full bg-primary" />
                <div className="space-y-1">
                  <h3 className="font-medium">{experience.title}</h3>
                  <p className="text-sm text-primary">{experience.company}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatDateRange(experience.start_date, experience.end_date)}
                  </p>
                  {experience.description && (
                    <p className="mt-2 whitespace-pre-wrap text-sm text-muted-foreground">
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
          <h2 className="text-2xl font-bold tracking-tight">Pendidikan</h2>
          <ol className="relative space-y-8 border-l pl-6">
            {educations.map((education) => (
              <li key={education.id} className="relative">
                <span className="absolute -left-[29px] top-1 size-2 rounded-full bg-primary" />
                <div className="space-y-1">
                  <h3 className="font-medium">{education.school}</h3>
                  {education.degree && (
                    <p className="text-sm text-muted-foreground">
                      {education.degree}
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    {formatDateRange(education.start_date, education.end_date)}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </section>
      )}
    </main>
  );
}