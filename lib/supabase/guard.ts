import type { SupabaseClient } from "@supabase/supabase-js";

export async function isAdmin(
  supabase: SupabaseClient
): Promise<boolean> {
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