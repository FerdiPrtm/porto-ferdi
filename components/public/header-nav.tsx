"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const links = [
  { href: "/", label: "Beranda" },
  { href: "/projects", label: "Projects" },
  { href: "/about", label: "Tentang" },
  { href: "/contact", label: "Kontak" },
];

export function HeaderNav() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-wrap items-center gap-1" aria-label="Navigasi utama">
      {links.map((link) => {
        const active =
          link.href === "/"
            ? pathname === "/"
            : pathname.startsWith(link.href);
        return (
          <Link
            key={link.href}
            href={link.href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "rounded-full px-3.5 py-1.5 text-sm transition-colors",
              active
                ? "bg-primary/15 font-medium text-primary"
                : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
            )}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}