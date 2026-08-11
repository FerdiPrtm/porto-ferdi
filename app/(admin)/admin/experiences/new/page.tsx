import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isAdmin } from "@/lib/supabase/guard";
import { ExperienceForm } from "@/components/admin/experience-form";

export const metadata = {
  title: "Tambah Pengalaman",
  robots: { index: false, follow: false },
};

export default async function NewExperiencePage() {
  const supabase = await createClient();

  if (!(await isAdmin(supabase))) {
    redirect("/admin/login");
  }

  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-6 px-6 py-10">
      <h1 className="text-2xl font-bold tracking-tight">Tambah Pengalaman</h1>
      <ExperienceForm />
    </main>
  );
}