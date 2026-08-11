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
        <Button variant="outline" render={<Link href="/admin/projects" />}>
          Kelola Projects
        </Button>
      </div>
    </main>
  );
}