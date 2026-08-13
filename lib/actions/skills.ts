"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/supabase/guard";
import { skillSchema, type SkillInput } from "@/lib/validations/skill";

export async function createSkill(
  input: SkillInput
): Promise<{ error: string } | null> {
  const parsed = skillSchema.safeParse(input);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Input tidak valid." };
  }

  const supabase = await requireAdmin();

  const { error } = await supabase.from("skills").insert({
    name: parsed.data.name,
    category: parsed.data.category ?? null,
    level: parsed.data.level,
    icon: parsed.data.icon ?? null,
    sort_order: parsed.data.sortOrder,
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/admin/skills");
  revalidatePath("/");
  revalidatePath("/about");
  redirect("/admin/skills");
}

export async function updateSkill(
  id: string,
  input: SkillInput
): Promise<{ error: string } | null> {
  const parsed = skillSchema.safeParse(input);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Input tidak valid." };
  }

  const supabase = await requireAdmin();

  const { error } = await supabase
    .from("skills")
    .update({
      name: parsed.data.name,
      category: parsed.data.category ?? null,
      level: parsed.data.level,
      icon: parsed.data.icon ?? null,
      sort_order: parsed.data.sortOrder,
    })
    .eq("id", id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/admin/skills");
  revalidatePath("/");
  revalidatePath("/about");
  redirect("/admin/skills");
}

export async function deleteSkill(
  _prev: unknown,
  formData: FormData
): Promise<{ error?: string } | null> {
  const id = String(formData.get("id") ?? "");

  const supabase = await requireAdmin();
  const { error } = await supabase.from("skills").delete().eq("id", id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/admin/skills");
  revalidatePath("/");
  revalidatePath("/about");
  redirect("/admin/skills");
}