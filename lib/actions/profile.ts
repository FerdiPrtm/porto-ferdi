"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/supabase/guard";
import { profileSchema, type ProfileInput } from "@/lib/validations/profile";

export async function updateProfile(
  input: ProfileInput
): Promise<{ error: string } | null> {
  const parsed = profileSchema.safeParse(input);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Input tidak valid." };
  }

  const supabase = await requireAdmin();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { error: "Sesi berakhir, silakan login ulang." };
  }

  const { error } = await supabase
    .from("profile")
    .update({
      full_name: parsed.data.fullName,
      tagline: parsed.data.tagline ?? null,
      bio: parsed.data.bio ?? null,
      email: parsed.data.email ?? null,
      avatar_url: parsed.data.avatarUrl ?? null,
      cv_url: parsed.data.cvUrl ?? null,
      social_links: {
        github: parsed.data.socialLinks?.github ?? null,
        linkedin: parsed.data.socialLinks?.linkedin ?? null,
        twitter: parsed.data.socialLinks?.twitter ?? null,
      },
    })
    .eq("id", user.id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/");
  revalidatePath("/about");
  redirect("/admin/profile");
}