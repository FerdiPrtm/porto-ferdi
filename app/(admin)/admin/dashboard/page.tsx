import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { SignOutButton } from "@/components/admin/sign-out-button";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Dashboard",
  robots: { index: false, follow: false },
};

export default async function AdminDashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  return (
    <main className="mx-auto flex max-w-4xl flex-1 flex-col gap-6 px-6 py-10">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <SignOutButton />
      </div>
      <p className="text-muted-foreground">
        Masuk sebagai <span className="font-medium">{user.email}</span>.
        Kelola konten akan dibangun di Sprint 3&ndash;5.
      </p>
      <div className="grid gap-3 sm:grid-cols-2">
        <Button variant="outline" render={<Link href="/admin" />}>
          Admin
        </Button>
      </div>
    </main>
  );
}