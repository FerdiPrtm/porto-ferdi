"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/supabase/guard";
import {
  experienceSchema,
  type ExperienceInput,
} from "@/lib/validations/experience";

export async function createExperience(
  input: ExperienceInput
): Promise<{ error: string } | null> {
  const parsed = experienceSchema.safeParse(input);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Input tidak valid." };
  }

  const supabase = await requireAdmin();

  const { error } = await supabase.from("experiences").insert({
    title: parsed.data.title,
    company: parsed.data.company,
    description: parsed.data.description ?? null,
    start_date: parsed.data.startDate ?? null,
    end_date: parsed.data.endDate ?? null,
    sort_order: parsed.data.sortOrder,
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/admin/experiences");
  revalidatePath("/");
  revalidatePath("/about");
  redirect("/admin/experiences");
}

export async function updateExperience(
  id: string,
  input: ExperienceInput
): Promise<{ error: string } | null> {
  const parsed = experienceSchema.safeParse(input);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Input tidak valid." };
  }

  const supabase = await requireAdmin();

  const { error } = await supabase
    .from("experiences")
    .update({
      title: parsed.data.title,
      company: parsed.data.company,
      description: parsed.data.description ?? null,
      start_date: parsed.data.startDate ?? null,
      end_date: parsed.data.endDate ?? null,
      sort_order: parsed.data.sortOrder,
    })
    .eq("id", id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/admin/experiences");
  revalidatePath("/");
  revalidatePath("/about");
  redirect("/admin/experiences");
}

export async function deleteExperience(
  _prev: unknown,
  formData: FormData
): Promise<{ error?: string } | null> {
  const id = String(formData.get("id") ?? "");

  const supabase = await requireAdmin();
  const { error } = await supabase
    .from("experiences")
    .delete()
    .eq("id", id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/admin/experiences");
  revalidatePath("/");
  revalidatePath("/about");
  redirect("/admin/experiences");
}