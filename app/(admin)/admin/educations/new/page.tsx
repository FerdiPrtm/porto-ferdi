import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isAdmin } from "@/lib/supabase/guard";
import { EducationForm } from "@/components/admin/education-form";

export const metadata = {
  title: "Tambah Pendidikan",
  robots: { index: false, follow: false },
};

export default async function NewEducationPage() {
  const supabase = await createClient();

  if (!(await isAdmin(supabase))) {
    redirect("/admin/login");
  }

  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-6 px-6 py-10">
      <h1 className="text-2xl font-bold tracking-tight">Tambah Pendidikan</h1>
      <EducationForm />
    </main>
  );
}