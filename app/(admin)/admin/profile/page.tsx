import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isAdmin } from "@/lib/supabase/guard";
import { ProfileForm } from "@/components/admin/profile-form";

export const metadata = {
  title: "Edit Profil",
  robots: { index: false, follow: false },
};

export default async function AdminProfilePage() {
  const supabase = await createClient();

  if (!(await isAdmin(supabase))) {
    redirect("/admin/login");
  }

  const { data: profile } = await supabase
    .from("profile")
    .select("*")
    .limit(1)
    .single();

  if (!profile) {
    return (
      <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-6 px-6 py-10">
        <h1 className="text-2xl font-bold tracking-tight">Edit Profil</h1>
        <p className="text-muted-foreground">
          Profil belum tersedia. Hubungi administrator.
        </p>
      </main>
    );
  }

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 px-6 py-10">
      <h1 className="text-2xl font-bold tracking-tight">Edit Profil</h1>
      <ProfileForm profile={profile} />
    </main>
  );
}