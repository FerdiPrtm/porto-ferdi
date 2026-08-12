import { createClient as createSupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

/**
 * Client baca publik (tanpa cookie / session). Dipakai oleh halaman publik
 * agar tetap bisa di-generate statis / di-cache (ISR) — data yang diakses
 * memang public-read via RLS.
 */
export function createPublicClient() {
  if (!supabaseUrl || !supabaseKey) {
    throw new Error(
      "Missing Supabase env vars (NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY)."
    );
  }

  return createSupabaseClient(supabaseUrl, supabaseKey);
}