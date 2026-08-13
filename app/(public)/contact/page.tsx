import { Mail, MapPin } from "lucide-react";
import type { Metadata } from "next";
import { ContactForm } from "@/components/public/contact-form";
import { SocialIcon } from "@/components/public/social-icon";
import { getProfile } from "@/lib/data";
import { openGraphMeta } from "@/lib/site";

export const metadata: Metadata = {
  title: "Kontak",
  description: "Hubungi saya untuk kolaborasi atau pertanyaan.",
  openGraph: openGraphMeta("/contact"),
};

export default async function ContactPage() {
  const profile = await getProfile();
  const socials = profile?.social_links ?? null;

  const socialItems: Array<{ href: string; kind: "github" | "linkedin" | "x" }> =
    [];
  if (socials?.github) socialItems.push({ href: socials.github, kind: "github" });
  if (socials?.linkedin)
    socialItems.push({ href: socials.linkedin, kind: "linkedin" });
  if (socials?.twitter) socialItems.push({ href: socials.twitter, kind: "x" });

  return (
    <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col justify-center px-6 py-16">
      <div className="mb-10 space-y-2 text-center">
        <p className="text-xs font-medium uppercase tracking-widest text-primary">
          Kontak
        </p>
        <h1 className="bg-gradient-to-r from-indigo-400 via-violet-400 to-fuchsia-400 bg-clip-text text-3xl font-bold tracking-tight text-transparent sm:text-4xl">
          Hubungi Saya
        </h1>
        <p className="mx-auto max-w-xl text-muted-foreground">
          Ada pertanyaan atau ingin berkolaborasi? Silakan kirim pesan — saya
          akan segera membalas.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-[1fr_1.4fr]">
        <aside className="space-y-4">
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
            <h2 className="mb-4 text-sm font-semibold">Informasi Kontak</h2>
            <ul className="space-y-4">
              {profile?.email && (
                <li className="flex items-start gap-3">
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/15 text-primary">
                    <Mail className="size-4" />
                  </span>
                  <div>
                    <p className="text-xs text-muted-foreground">Email</p>
                    <a
                      href={`mailto:${profile.email}`}
                      className="text-sm font-medium break-all hover:text-primary"
                    >
                      {profile.email}
                    </a>
                  </div>
                </li>
              )}
              <li className="flex items-start gap-3">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/15 text-primary">
                  <MapPin className="size-4" />
                </span>
                <div>
                  <p className="text-xs text-muted-foreground">Lokasi</p>
                  <p className="text-sm font-medium">Indonesia</p>
                </div>
              </li>
            </ul>
          </div>

          {socialItems.length > 0 && (
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
              <h2 className="mb-4 text-sm font-semibold">Media Sosial</h2>
              <div className="flex flex-wrap gap-2">
                {socialItems.map(({ href, kind }) => (
                  <a
                    key={kind}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={kind}
                    className="flex size-10 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
                  >
                    <SocialIcon kind={kind} className="size-4" />
                  </a>
                ))}
              </div>
            </div>
          )}
        </aside>

        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 sm:p-8">
          <ContactForm />
        </div>
      </div>
    </main>
  );
}