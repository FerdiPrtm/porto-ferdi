import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isAdmin } from "@/lib/supabase/guard";
import { LoginForm } from "@/components/admin/login-form";

export const metadata = {
  title: "Admin Login",
  robots: { index: false, follow: false },
};

export default async function AdminLoginPage() {
  const supabase = await createClient();

  if (await isAdmin(supabase)) {
    redirect("/admin/dashboard");
  }

  return (
    <main className="flex flex-1 items-center justify-center px-6 py-16">
      <LoginForm />
    </main>
  );
}