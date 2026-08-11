import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { isAdmin } from "@/lib/supabase/guard";
import { SignOutButton } from "@/components/admin/sign-out-button";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Dashboard",
  robots: { index: false, follow: false },
};

export default async function AdminDashboardPage() {
  const supabase = await createClient();

  if (!(await isAdmin(supabase))) {
    redirect("/admin/login");
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { count: projectCount } = await supabase
    .from("projects")
    .select("id", { count: "exact", head: true });

  const { count: unreadCount } = await supabase
    .from("messages")
    .select("id", { count: "exact", head: true })
    .eq("is_read", false);

  return (
    <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-6 px-6 py-10">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <SignOutButton />
      </div>
      <p className="text-muted-foreground">
        Masuk sebagai <span className="font-medium">{user?.email}</span>.
        Kelola konten di menu berikut.
      </p>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-lg border p-4">
          <p className="text-sm text-muted-foreground">Total Project</p>
          <p className="mt-1 text-3xl font-bold tracking-tight">
            {projectCount ?? 0}
          </p>
        </div>
        <div className="rounded-lg border p-4">
          <p className="text-sm text-muted-foreground">
            Pesan Belum Dibaca
          </p>
          <p className="mt-1 text-3xl font-bold tracking-tight">
            {unreadCount ?? 0}
          </p>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <Button variant="outline" render={<Link href="/admin/projects" />}>
          Kelola Projects
        </Button>
        <Button variant="outline" render={<Link href="/admin/skills" />}>
          Kelola Skills
        </Button>
        <Button variant="outline" render={<Link href="/admin/experiences" />}>
          Kelola Pengalaman
        </Button>
        <Button variant="outline" render={<Link href="/admin/educations" />}>
          Kelola Pendidikan
        </Button>
        <Button variant="outline" render={<Link href="/admin/profile" />}>
          Edit Profil
        </Button>
        <Button variant="outline" render={<Link href="/admin/messages" />}>
          Inbox Pesan
        </Button>
      </div>
    </main>
  );
}