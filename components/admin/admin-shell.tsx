"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ArrowUpRight,
  Briefcase,
  Cpu,
  FolderGit2,
  GraduationCap,
  Inbox,
  LayoutDashboard,
  User,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { SignOutButton } from "./sign-out-button";

const nav: Array<{ href: string; label: string; icon: LucideIcon }> = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/projects", label: "Projects", icon: FolderGit2 },
  { href: "/admin/skills", label: "Skills", icon: Cpu },
  { href: "/admin/experiences", label: "Pengalaman", icon: Briefcase },
  { href: "/admin/educations", label: "Pendidikan", icon: GraduationCap },
  { href: "/admin/profile", label: "Profil", icon: User },
  { href: "/admin/messages", label: "Inbox", icon: Inbox },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuthScreen = pathname === "/admin" || pathname === "/admin/login";

  if (isAuthScreen) {
    return <div className="flex min-h-svh flex-col">{children}</div>;
  }

  return (
    <div className="flex min-h-svh flex-col lg:flex-row">
      <aside className="flex shrink-0 flex-col border-b border-white/5 bg-background lg:sticky lg:top-0 lg:h-svh lg:w-64 lg:border-b-0 lg:border-r">
        <div className="flex items-center justify-between gap-2 px-5 py-4">
          <Link
            href="/admin/dashboard"
            className="flex items-center gap-2.5 font-semibold tracking-tight"
          >
            <span className="flex size-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 text-xs font-bold text-white">
              A
            </span>
            Panel Admin
          </Link>
          <div className="lg:hidden">
            <SignOutButton />
          </div>
        </div>

        <nav
          className="flex gap-1 overflow-x-auto px-3 pb-3 lg:flex-1 lg:flex-col lg:overflow-visible lg:px-3 lg:py-2"
          aria-label="Navigasi admin"
        >
          {nav.map((item) => {
            const active =
              item.href === "/admin/dashboard"
                ? pathname === item.href
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex shrink-0 items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors",
                  active
                    ? "bg-primary/15 font-medium text-primary"
                    : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
                )}
              >
                <item.icon className="size-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden border-t border-white/5 p-3 lg:block">
          <Link
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="mb-2 flex items-center justify-between rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-white/5 hover:text-foreground"
          >
            Lihat Situs
            <ArrowUpRight className="size-4" />
          </Link>
          <SignOutButton />
        </div>
      </aside>

      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}
