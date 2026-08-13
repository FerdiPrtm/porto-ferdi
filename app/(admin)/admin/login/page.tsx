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
    <main className="relative flex flex-1 items-center justify-center overflow-hidden px-6 py-16">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-[-180px] size-[520px] -translate-x-1/2 rounded-full bg-primary/25 blur-[130px]" />
        <div className="absolute bottom-[-120px] right-[10%] size-[320px] rounded-full bg-violet-600/20 blur-[120px]" />
      </div>
      <div className="relative flex w-full max-w-sm flex-col items-center gap-6">
        <span className="flex size-14 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 text-xl font-bold text-white shadow-xl shadow-indigo-500/30">
          A
        </span>
        <LoginForm />
        <p className="text-center text-xs text-muted-foreground">
          Akses terbatas untuk admin. Hubungi pengelola jika belum memiliki
          akun.
        </p>
      </div>
    </main>
  );
}