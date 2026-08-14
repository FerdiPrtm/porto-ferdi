import Link from "next/link";
import { createPublicClient } from "@/lib/supabase/public";
import { HeaderNav } from "@/components/public/header-nav";
import { SocialIcon } from "@/components/public/social-icon";
import { Button } from "@/components/ui/button";

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
    <div className="flex items-center gap-2">
      {items.map(({ href, kind }) => (
        <a
          key={kind}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={kind}
          className="rounded-full border border-white/10 bg-white/5 p-2 text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
        >
          <SocialIcon kind={kind} className="size-4" />
        </a>
      ))}
    </div>
  );
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createPublicClient();
  const { data: profile } = await supabase
    .from("profile")
    .select("full_name, social_links, email")
    .limit(1)
    .maybeSingle();

  const name = profile?.full_name || "Portfolio";

  return (
    <div className="flex min-h-svh flex-col">
      <header className="sticky top-0 z-50 border-b border-white/5 bg-background/70 backdrop-blur-xl">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-6 py-3.5">
          <Link
            href="/"
            className="flex items-center gap-2.5 text-sm font-semibold tracking-tight"
          >
            <span className="flex size-8 items-center justify-center rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 text-xs font-bold text-white shadow-lg shadow-orange-500/25">
              {getInitials(name)}
            </span>
            {name}
          </Link>
          <HeaderNav />
        </div>
      </header>

      {children}

      <footer className="mt-auto border-t border-white/5">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-5 px-6 py-10 sm:flex-row">
          <div className="flex flex-col items-center gap-1 sm:items-start">
            <p className="text-sm font-medium">
              © {new Date().getFullYear()} {name}
            </p>
            <p className="text-xs text-muted-foreground">
              Dibangun dengan Next.js & Supabase.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <SocialLinks socials={profile?.social_links ?? null} />
            <Button
              size="sm"
              render={<Link href="/contact" />}
              className="hidden sm:inline-flex"
            >
              Hubungi Saya
            </Button>
          </div>
        </div>
      </footer>
    </div>
  );
}