import { createClient } from "@/lib/supabase/client";

export async function uploadFile(
  file: File,
  bucket: string,
  folder: string
): Promise<{ url: string; error: string | null }> {
  const supabase = createClient();

  const ext = file.name.split(".").pop();
  const path = `${folder}/${Date.now()}_${Math.random()
    .toString(36)
    .slice(2, 8)}.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from(bucket)
    .upload(path, file);

  if (uploadError) {
    return { url: "", error: uploadError.message };
  }

  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return { url: data.publicUrl, error: null };
}