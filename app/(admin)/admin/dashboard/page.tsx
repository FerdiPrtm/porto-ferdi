import Link from "next/link";
import {
  ArrowRight,
  Briefcase,
  Cpu,
  FolderGit2,
  GraduationCap,
  Inbox,
  Mail,
  User,
  type LucideIcon,
} from "lucide-react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isAdmin } from "@/lib/supabase/guard";

export const metadata = {
  title: "Dashboard",
  robots: { index: false, follow: false },
};

const menu: Array<{
  href: string;
  label: string;
  description: string;
  icon: LucideIcon;
}> = [
  {
    href: "/admin/projects",
    label: "Projects",
    description: "Tambah, edit, atau hapus project",
    icon: FolderGit2,
  },
  {
    href: "/admin/skills",
    label: "Skills",
    description: "Atur keahlian dan level",
    icon: Cpu,
  },
  {
    href: "/admin/experiences",
    label: "Pengalaman",
    description: "Riwayat pekerjaan",
    icon: Briefcase,
  },
  {
    href: "/admin/educations",
    label: "Pendidikan",
    description: "Latar belakang pendidikan",
    icon: GraduationCap,
  },
  {
    href: "/admin/profile",
    label: "Profil",
    description: "Nama, bio, dan sosial media",
    icon: User,
  },
  {
    href: "/admin/messages",
    label: "Inbox",
    description: "Pesan dari pengunjung",
    icon: Mail,
  },
];

export default async function AdminDashboardPage() {
  const supabase = await createClient();

  if (!(await isAdmin(supabase))) {
    redirect("/admin/login");
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const [{ count: projectCount }, { count: skillCount }, { count: unreadCount }] =
    await Promise.all([
      supabase.from("projects").select("id", { count: "exact", head: true }),
      supabase.from("skills").select("id", { count: "exact", head: true }),
      supabase
        .from("messages")
        .select("id", { count: "exact", head: true })
        .eq("is_read", false),
    ]);

  const stats = [
    {
      label: "Total Project",
      value: projectCount ?? 0,
      icon: FolderGit2,
      className: "from-indigo-500 to-violet-600",
    },
    {
      label: "Total Skill",
      value: skillCount ?? 0,
      icon: Cpu,
      className: "from-violet-500 to-fuchsia-600",
    },
    {
      label: "Pesan Belum Dibaca",
      value: unreadCount ?? 0,
      icon: Inbox,
      className: "from-sky-500 to-indigo-600",
    },
  ];

  return (
    <main className="flex w-full flex-1 flex-col gap-8 px-6 py-10">
      <div className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Masuk sebagai{" "}
          <span className="font-medium text-foreground">{user?.email}</span>.
          Kelola konten situs dari menu berikut.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl border border-white/10 bg-white/[0.03] p-5"
          >
            <span
              className={`inline-flex size-10 items-center justify-center rounded-lg bg-gradient-to-br ${stat.className} text-white`}
            >
              <stat.icon className="size-5" />
            </span>
            <p className="mt-4 text-3xl font-bold tracking-tight">
              {stat.value}
            </p>
            <p className="mt-0.5 text-sm text-muted-foreground">
              {stat.label}
            </p>
          </div>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {menu.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="group flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-lg hover:shadow-indigo-500/10"
          >
            <div className="flex items-center justify-between">
              <span className="inline-flex size-10 items-center justify-center rounded-lg bg-primary/15 text-primary">
                <item.icon className="size-5" />
              </span>
              <ArrowRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
            </div>
            <div>
              <p className="font-semibold">{item.label}</p>
              <p className="mt-0.5 text-sm text-muted-foreground">
                {item.description}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
