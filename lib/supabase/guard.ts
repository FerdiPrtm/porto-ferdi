import type { SupabaseClient } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";

export async function isAdmin(supabase: SupabaseClient): Promise<boolean> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return false;

  const { data } = await supabase
    .from("profile")
    .select("is_admin")
    .eq("id", user.id)
    .maybeSingle();

  return data?.is_admin === true;
}

/** Mengembalikan supabase client jika user saat ini adalah admin, selain itu throw. */
export async function requireAdmin() {
  const supabase = await createClient();
  if (!(await isAdmin(supabase))) {
    throw new Error("Unauthorized: hanya admin yang dapat melakukan operasi ini.");
  }
  return supabase;
}