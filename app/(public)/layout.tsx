import Link from "next/link";
import { createPublicClient } from "@/lib/supabase/public";
import { HeaderNav } from "@/components/public/header-nav";
import { SocialIcon } from "@/components/public/social-icon";

export const revalidate = 3600;

type SocialLinks = {
  github?: string | null;
  linkedin?: string | null;
  twitter?: string | null;
} | null;

function SocialLinks({ socials }: { socials: SocialLinks }) {
  const items: Array<{ href: string; kind: "github" | "linkedin" | "x" }> = [];
  if (socials?.github) items.push({ href: socials.github, kind: "github" });
  if (socials?.linkedin) items.push({ href: socials.linkedin, kind: "linkedin" });
  if (socials?.twitter) items.push({ href: socials.twitter, kind: "x" });

  if (items.length === 0) return null;

  return (
    <div className="flex items-center gap-3">
      {items.map(({ href, kind }) => (
        <a
          key={kind}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={kind}
          className="text-muted-foreground transition-colors hover:text-foreground"
        >
          <SocialIcon kind={kind} className="size-4" />
        </a>
      ))}
    </div>
  );
}

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createPublicClient();
  const { data: profile } = await supabase
    .from("profile")
    .select("full_name, social_links")
    .limit(1)
    .maybeSingle();

  return (
    <div className="flex min-h-svh flex-col">
      <header className="sticky top-0 z-10 border-b bg-background/80 backdrop-blur">
        <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-6 py-3">
          <Link href="/" className="text-sm font-semibold tracking-tight">
            {profile?.full_name || "Portfolio"}
          </Link>
          <HeaderNav />
        </div>
      </header>

      {children}

      <footer className="border-t">
        <div className="mx-auto flex w-full max-w-5xl flex-col items-center justify-between gap-4 px-6 py-8 sm:flex-row">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()}{" "}
            {profile?.full_name || "Portfolio"}. Semua hak dilindungi.
          </p>
          <SocialLinks socials={profile?.social_links ?? null} />
        </div>
      </footer>
    </div>
  );
}